import { createHash, randomUUID } from 'node:crypto';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { codexCommand, observeCodex } from './codex.mjs';
import { tasks } from './corpus.mjs';
import { checkDefinitions } from './graders.mjs';
import { runProcess } from './process.mjs';
import { markdownReport, summarize } from './report.mjs';
import { saveJSON as save } from './storage.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

export function parseArgs(args) {
  const options = {
    repetitions: 2,
    timeoutMs: 120000,
    totalMs: 1200000,
    effort: 'high',
    executable: 'codex',
    tasks: [],
  };
  const seen = new Set();
  const keys = new Map([
    ['--output', 'output'],
    ['--model', 'model'],
    ['--effort', 'effort'],
    ['--executable', 'executable'],
    ['--codex-home', 'codexHome'],
    ['--kit-root', 'kitRoot'],
    ['--repetitions', 'repetitions'],
    ['--timeout-ms', 'timeoutMs'],
    ['--total-ms', 'totalMs'],
    ['--task', 'tasks'],
  ]);
  for (let index = 0; index < args.length; index++) {
    const key = keys.get(args[index]);
    if (!key) throw new Error(`Unknown benchmark option: ${args[index]}`);
    if (seen.has(key) && key !== 'tasks')
      throw new Error(`Duplicate benchmark option: ${args[index]}`);
    seen.add(key);
    const value = args[++index];
    if (!value || value.startsWith('--'))
      throw new Error(`Missing benchmark option value: ${args[index - 1]}`);
    if (key === 'tasks') options.tasks.push(value);
    else options[key] = value;
  }
  if (!options.model) throw new Error('An explicit --model is required for matched trials.');
  if (!options.codexHome)
    throw new Error('Supply --codex-home with an isolated logged-in runtime home.');
  if (!['low', 'medium', 'high', 'xhigh'].includes(options.effort))
    throw new Error('Invalid reasoning effort.');
  for (const [key, min, max] of [
    ['repetitions', 2, 2],
    ['timeoutMs', 100, 300000],
    ['totalMs', 100, 1800000],
  ]) {
    options[key] = Number(options[key]);
    if (!Number.isInteger(options[key]) || options[key] < min || options[key] > max)
      throw new Error(`Invalid ${key}.`);
  }
  if (options.tasks.some((id) => !tasks.some((task) => task.id === id)))
    throw new Error('Unknown benchmark task.');
  return options;
}

export function scheduleTasks(selected, repetitions = 2) {
  return selected.flatMap((task) =>
    Array.from({ length: repetitions }, (_, repeat) =>
      (repeat % 2 ? ['kit', 'baseline'] : ['baseline', 'kit']).map((condition) => ({
        id: `${task.id}-r${repeat + 1}-${condition}`,
        task_id: task.id,
        cohort: task.cohort,
        repetition: repeat + 1,
        condition,
      })),
    ).flat(),
  );
}

function filesUnder(root, base = root) {
  const result = {};
  for (const entry of readdirSync(root, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const path = join(root, entry.name);
    if (entry.isDirectory()) Object.assign(result, filesUnder(path, base));
    else if (entry.isFile())
      result[relative(base, path).split(sep).join('/')] = hash(readFileSync(path));
    else throw new Error(`Unsupported source entry: ${path}`);
  }
  return result;
}

function sourceManifest(kitRoot) {
  const manifest = {};
  for (const directory of ['bin', 'src/cli', 'bridges', 'skills', 'memory', 'work']) {
    for (const [path, digest] of Object.entries(filesUnder(join(kitRoot, directory)))) {
      manifest[`${directory}/${path}`] = digest;
    }
  }
  manifest['package.json'] = hash(readFileSync(join(kitRoot, 'package.json')));
  return manifest;
}

export function validateGrade(task, grade) {
  const expected = checkDefinitions[task.id];
  if (
    !grade ||
    grade.format_version !== 1 ||
    grade.task_id !== task.id ||
    grade.cohort !== task.cohort ||
    !Array.isArray(grade.checks) ||
    grade.checks.length !== expected.length
  )
    return false;
  const ids = new Set(grade.checks.map((check) => check.id));
  if (ids.size !== expected.length) return false;
  if (
    !expected.every((definition) =>
      grade.checks.some(
        (check) =>
          check.id === definition.id &&
          check.kind === definition.kind &&
          typeof check.passed === 'boolean',
      ),
    )
  )
    return false;
  return grade.passed === grade.checks.every((check) => check.passed);
}

export function validateCalibration(report) {
  return (
    report?.passed === true &&
    Array.isArray(report.tasks) &&
    report.tasks.length === tasks.length &&
    tasks.every((task) => {
      const row = report.tasks.find((entry) => entry.task_id === task.id);
      return (
        row?.cohort === task.cohort &&
        row.controls?.length === 3 &&
        ['seed', 'reference', 'mutant'].every((variant) => {
          const control = row.controls.find((entry) => entry.variant === variant);
          const expected = variant === 'reference';
          return (
            control?.control_passed === true &&
            control.expected_passed === expected &&
            control.observed_passed === expected
          );
        })
      );
    })
  );
}

function seedWorkspace(task, root) {
  for (const [path, content] of Object.entries(task.files)) {
    if (
      path.includes('\\') ||
      path.split('/').some((part) => !part || part === '.' || part === '..') ||
      path.startsWith('/')
    )
      throw new Error(`Unsafe seed path: ${path}`);
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, { flag: 'wx' });
  }
}

async function git(root, args) {
  return runProcess(
    'git',
    ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args],
    { cwd: root, timeoutMs: 15000 },
  );
}

export async function runBenchmark(options) {
  const kitRoot = resolve(options.kitRoot ?? join(here, '..'));
  const output = resolve(options.output ?? join(here, 'runs', `${Date.now()}-${randomUUID()}`));
  if (existsSync(output))
    throw new Error('Choose a new output directory; previous attempts are preserved.');
  if (process.platform === 'win32')
    throw new Error(
      'Measured sessions require POSIX process-group cleanup; calibration and reporting remain portable.',
    );
  if (
    !options.codexHome ||
    !existsSync(join(resolve(options.codexHome), 'auth.json')) ||
    existsSync(join(resolve(options.codexHome), 'AGENTS.md'))
  )
    throw new Error('Use an isolated authenticated runtime home without global AGENTS.md.');
  const selected = tasks.filter((task) => !options.tasks.length || options.tasks.includes(task.id));
  const schedule = scheduleTasks(selected, options.repetitions);
  if (!schedule.length || schedule.length > 12)
    throw new Error('Pilot must schedule between 1 and 12 sessions.');
  const version = await runProcess(options.executable, ['--version'], { timeoutMs: 10000 });
  if (version.status !== 'completed' || version.exit_code !== 0)
    throw new Error('Codex executable is unavailable.');
  const kitSources = sourceManifest(kitRoot);
  const harness = Object.fromEntries(
    readdirSync(here)
      .filter((name) => name.endsWith('.mjs'))
      .sort()
      .map((name) => [name, hash(readFileSync(join(here, name)))]),
  );
  const protocol = {
    format_version: 1,
    agent: {
      adapter: 'codex-exec',
      executable: options.executable,
      version: version.stdout.trim(),
      model: options.model,
      effort: options.effort,
      user_config: 'ignored',
      memories: 'disabled',
      sandbox: 'workspace-write',
      approvals: 'never',
      sessions: 'fresh ephemeral',
    },
    node: process.version,
    platform: process.platform,
    kit_version: JSON.parse(readFileSync(join(kitRoot, 'package.json'), 'utf8')).version,
    kit_sources: kitSources,
    harness_sources: harness,
    tasks: selected.map((task) => ({
      id: task.id,
      cohort: task.cohort,
      prompt_sha256: hash(task.prompt),
      seed_sha256: hash(JSON.stringify(task.files)),
      sources: task.sources,
    })),
    limits: {
      sessions: schedule.length,
      per_session_ms: options.timeoutMs,
      total_ms: options.totalMs,
      combined_agent_output_bytes: 1048576,
    },
    schedule,
    guarantees: {
      project_isolation: 'separate fresh temporary Git repositories outside the Composed tree',
      grader_visibility: 'withheld from supplied workspaces; not adversarially inaccessible',
      model_version: 'requested identifier; resolved backend version unknown',
      root_usage: 'observed events only; delegated completeness unknown',
      currency_cost: 'unknown',
    },
  };
  protocol.digest = hash(JSON.stringify(protocol));
  mkdirSync(dirname(output), { recursive: true });
  mkdirSync(output);
  save(join(output, 'protocol.json'), protocol);
  const results = schedule.map((trial) => ({
    ...trial,
    outcome: 'not_run',
    reason: null,
    agent: null,
    observation: null,
    grade: null,
  }));
  save(join(output, 'results.json'), results);
  const calibration = await runProcess(process.execPath, [join(here, 'calibrate.mjs')], {
    cwd: here,
    timeoutMs: 60000,
    maxBytes: 262144,
  });
  save(join(output, 'calibration-process.json'), calibration);
  let calibrationReport;
  try {
    calibrationReport = JSON.parse(calibration.stdout);
  } catch {
    calibrationReport = null;
  }
  const calibrated =
    calibration.status === 'completed' &&
    calibration.exit_code === 0 &&
    validateCalibration(calibrationReport);
  save(join(output, 'calibration.json'), { verified: calibrated, report: calibrationReport });
  const workspaces = mkdtempSync(join(tmpdir(), 'composed-benchmark-workspaces-'));
  save(join(output, 'workspace-location.json'), {
    root: workspaces,
    retention: 'local; no automatic deletion of attempted trials',
  });
  const started = performance.now();
  for (const [index, trial] of schedule.entries()) {
    const task = selected.find((entry) => entry.id === trial.task_id);
    const result = results[index];
    const trialOutput = join(output, trial.id);
    mkdirSync(trialOutput);
    const persist = () => {
      save(join(trialOutput, 'result.json'), result);
      save(join(output, 'results.json'), results);
    };
    if (!calibrated) {
      result.reason = 'grader_calibration_failed';
    } else if (performance.now() - started >= options.totalMs) {
      result.reason = 'total_deadline';
    } else {
      try {
        if (hash(JSON.stringify(sourceManifest(kitRoot))) !== hash(JSON.stringify(kitSources)))
          throw new Error('Kit source changed after protocol freeze.');
        if (
          !Object.entries(harness).every(
            ([path, digest]) => hash(readFileSync(join(here, path))) === digest,
          )
        )
          throw new Error('Benchmark source changed after protocol freeze.');
        const root = join(workspaces, trial.id);
        mkdirSync(root);
        seedWorkspace(task, root);
        const init = await git(root, ['init', '--quiet']);
        if (init.status !== 'completed' || init.exit_code !== 0)
          throw new Error('Git init failed.');
        const setupStarted = performance.now();
        if (trial.condition === 'kit') {
          const install = await runProcess(
            process.execPath,
            [
              join(kitRoot, 'bin/composed-kit.mjs'),
              'init',
              '--yes',
              '--agents=codex',
              '--lang=en',
              '--skills=core,support',
              '--cwd',
              root,
              '--kit-root',
              kitRoot,
            ],
            { cwd: root, timeoutMs: 30000 },
          );
          save(join(trialOutput, 'kit-install.json'), install);
          if (install.status !== 'completed' || install.exit_code !== 0)
            throw new Error('Kit installation failed.');
        }
        if (
          !Object.entries(task.files).every(
            ([path, content]) => hash(readFileSync(join(root, path))) === hash(content),
          )
        )
          throw new Error('Initial application files differ from frozen seed.');
        save(join(trialOutput, 'initial-files.json'), filesUnder(root));
        for (const args of [
          ['add', '.'],
          [
            '-c',
            'user.name=Composed benchmark',
            '-c',
            'user.email=benchmark@example.invalid',
            'commit',
            '--quiet',
            '-m',
            'Benchmark starting state',
          ],
        ]) {
          const command = await git(root, args);
          if (command.status !== 'completed' || command.exit_code !== 0)
            throw new Error('Initial Git snapshot failed.');
        }
        result.setup_duration_ms = Math.round(performance.now() - setupStarted);
        result.initial_revision = (await git(root, ['rev-parse', 'HEAD'])).stdout.trim();
        const remaining = Math.max(0, Math.round(options.totalMs - (performance.now() - started)));
        if (remaining <= 0) {
          result.reason = 'total_deadline';
        } else {
          const command = codexCommand({ ...options, workspace: root });
          const environment = { ...process.env };
          if (options.codexHome) environment.CODEX_HOME = resolve(options.codexHome);
          writeFileSync(join(trialOutput, 'events.jsonl'), '', { flag: 'wx' });
          writeFileSync(join(trialOutput, 'stderr.txt'), '', { flag: 'wx' });
          writeFileSync(join(trialOutput, 'prompt.txt'), task.prompt, { flag: 'wx' });
          result.outcome = 'blocked';
          result.reason = 'agent_dispatch_interrupted_or_unconfirmed';
          result.dispatch_requested_at = new Date().toISOString();
          persist();
          result.agent = await runProcess(command.executable, command.args, {
            cwd: root,
            env: environment,
            input: task.prompt,
            timeoutMs: Math.min(options.timeoutMs, remaining),
            onStdout: (chunk) => appendFileSync(join(trialOutput, 'events.jsonl'), chunk),
            onStderr: (chunk) => appendFileSync(join(trialOutput, 'stderr.txt'), chunk),
          });
          result.observation = observeCodex(result.agent);
          result.agent = { ...result.agent, stdout: undefined, stderr: undefined };
          result.reason = 'grading_pending_or_interrupted';
          persist();
          const execution = await runProcess(
            process.execPath,
            [join(here, 'grade.mjs'), '--task', task.id, '--candidate', root],
            { cwd: here, timeoutMs: 10000, maxBytes: 262144 },
          );
          save(join(trialOutput, 'grader-process.json'), execution);
          let grade;
          try {
            grade = JSON.parse(execution.stdout);
          } catch {
            grade = null;
          }
          if (
            execution.status === 'completed' &&
            execution.exit_code === 0 &&
            validateGrade(task, grade)
          )
            result.grade = grade;
          result.outcome =
            !result.observation.completed || !result.grade
              ? 'blocked'
              : result.grade.passed
                ? 'passed'
                : 'failed';
          result.reason = !result.observation.completed
            ? (result.agent.reason ?? 'incomplete_agent_execution')
            : !result.grade
              ? 'grader_invalid_or_unavailable'
              : null;
          const diff = await git(root, [
            'diff',
            '--no-ext-diff',
            '--no-textconv',
            '--binary',
            'HEAD',
          ]);
          writeFileSync(join(trialOutput, 'delivery.diff'), diff.stdout);
          result.delivered_sources = result.grade?.sources ?? null;
        }
      } catch (error) {
        result.outcome = 'blocked';
        result.reason = error.message;
      }
    }
    persist();
    console.log(`${trial.id}: ${result.outcome}${result.reason ? ` (${result.reason})` : ''}`);
  }
  const summary = summarize(protocol, results);
  save(join(output, 'summary.json'), summary);
  writeFileSync(join(output, 'report.md'), markdownReport(protocol, summary));
  console.log(`Results: ${output}`);
  return { protocol, results, summary, output };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await runBenchmark(parseArgs(process.argv.slice(2)));
    if (result.results.some((trial) => trial.outcome !== 'passed')) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
