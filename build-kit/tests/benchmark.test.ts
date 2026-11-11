import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const load = (name: string) => import(pathToFileURL(join(root, 'benchmarks', name)).href);
const { tasks } = await load('corpus.mjs');
const { checkDefinitions } = await load('graders.mjs');
const { runProcess } = await load('process.mjs');
const { observeCodex } = await load('codex.mjs');
const { parseArgs, scheduleTasks, validateGrade, runBenchmark } = await load('run.mjs');
const { summarize } = await load('report.mjs');
const { readResults, saveJSON } = await load('storage.mjs');
const scratch = mkdtempSync(join(tmpdir(), 'composed-benchmark-tests-'));

afterAll(() => rmSync(scratch, { recursive: true, force: true }));

describe('paired delivery benchmark', () => {
  it('balances order with fresh trial identities and keeps cohorts distinct', () => {
    const schedule = scheduleTasks(tasks);
    expect(schedule).toHaveLength(12);
    expect(new Set(schedule.map((trial: { id: string }) => trial.id)).size).toBe(12);
    expect(schedule.slice(0, 4).map((trial: { condition: string }) => trial.condition)).toEqual([
      'baseline',
      'kit',
      'kit',
      'baseline',
    ]);
    expect(
      schedule.filter((trial: { cohort: string }) => trial.cohort === 'confirmation'),
    ).toHaveLength(8);
  });

  it('requires an explicit model/runtime home and bounds the paid trial envelope', () => {
    expect(() => parseArgs([])).toThrow('model');
    expect(() => parseArgs(['--model', 'fixture'])).toThrow('codex-home');
    const base = ['--model', 'fixture', '--codex-home', scratch];
    expect(() => parseArgs([...base, '--repetitions', '3'])).toThrow();
    expect(() => parseArgs([...base, '--timeout-ms', '0'])).toThrow();
    expect(() => parseArgs([...base, '--total-ms', '99999999'])).toThrow();
    expect(() => parseArgs([...base, '--task', 'unknown'])).toThrow();
    expect(() => parseArgs([...base, '--model', 'other'])).toThrow('Duplicate');
  });

  it('never treats a normal exit or success-looking answer as a complete Codex turn', () => {
    const result = {
      status: 'completed',
      exit_code: 0,
      stdout:
        '{"type":"item.completed","item":{"type":"agent_message","text":"all tests passed"}}\n',
    };
    expect(observeCodex(result).completed).toBe(false);
    expect(observeCodex({ ...result, stdout: 'null\n[]\nnot-json\n' }).completed).toBe(false);
    expect(
      observeCodex({ ...result, stdout: '{"type":"turn.completed"}\n', status: 'blocked' })
        .completed,
    ).toBe(false);
  });

  it('reports observed root usage without inventing currency or missing metrics', () => {
    const result = observeCodex({
      status: 'completed',
      exit_code: 0,
      stdout: [
        { type: 'thread.started', thread_id: 'fixture-thread' },
        {
          type: 'turn.completed',
          usage: { input_tokens: 12, cached_input_tokens: 10, output_tokens: 3 },
        },
        {
          type: 'turn.completed',
          usage: { input_tokens: 8, cached_input_tokens: 4, output_tokens: 2 },
        },
      ]
        .map((event) => JSON.stringify(event))
        .join('\n'),
    });
    expect(result.completed).toBe(true);
    expect(result.root_usage).toEqual({
      input_tokens: 20,
      cached_input_tokens: 14,
      output_tokens: 5,
      reasoning_output_tokens: null,
    });
    expect(result.cost_usd).toBeNull();
    expect(result.resolved_backend_model).toBeNull();
    const partial = observeCodex({
      status: 'completed',
      exit_code: 0,
      stdout: [
        {
          type: 'turn.completed',
          usage: { input_tokens: 12, cached_input_tokens: 10, output_tokens: 3 },
        },
        { type: 'turn.completed' },
      ]
        .map((event) => JSON.stringify(event))
        .join('\n'),
    });
    expect(partial.root_usage).toBeNull();
    expect(partial.root_usage_coverage).toEqual({
      completed_turns: 2,
      turns_with_usage: 1,
      complete_root_usage: false,
    });
    expect(
      observeCodex({
        status: 'completed',
        exit_code: 0,
        stdout: '{"type":"turn.completed","usage":{}}',
      }).root_usage,
    ).toBeNull();
  });

  it('runs arguments literally without invoking a shell', async () => {
    const text = '$(touch unexpected); echo injected';
    const result = await runProcess(process.execPath, [
      '-e',
      'process.stdout.write(process.argv[1])',
      text,
    ]);
    expect(result.exit_code).toBe(0);
    expect(result.stdout).toBe(text);
  });

  it('bounds a stuck child and excessive output', async () => {
    const stuck = await runProcess(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], {
      timeoutMs: 150,
    });
    expect(stuck.status).toBe('blocked');
    expect(stuck.reason).toBe('timeout');
    const noisy = await runProcess(
      process.execPath,
      ['-e', 'process.stdout.write("x".repeat(10000))'],
      { maxBytes: 128 },
    );
    expect(noisy.status).toBe('blocked');
    expect(noisy.reason).toBe('output_limit');
    expect(Buffer.byteLength(noisy.stdout)).toBeLessThanOrEqual(128);
  });

  it('distinguishes missing executables from nonzero command exits', async () => {
    const missing = await runProcess(join(scratch, 'missing-executable'), []);
    expect(missing.status).toBe('blocked');
    expect(missing.reason).toContain('spawn_error');
    const failed = await runProcess(process.execPath, ['-e', 'process.exit(7)']);
    expect(failed.status).toBe('completed');
    expect(failed.exit_code).toBe(7);
  });

  (process.platform === 'win32' ? it.skip : it)(
    'cleans ordinary background children after a normal parent exit',
    async () => {
      const code =
        'const child=require("node:child_process").spawn(process.execPath,["-e","setInterval(()=>{},1000)"],{stdio:"ignore"});child.unref();console.log(child.pid)';
      const result = await runProcess(process.execPath, ['-e', code]);
      expect(result.exit_code).toBe(0);
      const pid = Number(result.stdout.trim());
      expect(pid).toBeGreaterThan(0);
      let alive = true;
      for (let attempt = 0; attempt < 20; attempt++) {
        try {
          process.kill(pid, 0);
          if (
            process.platform === 'linux' &&
            readFileSync(`/proc/${pid}/stat`, 'utf8').includes(') Z ')
          ) {
            alive = false;
            break;
          }
        } catch {
          alive = false;
          break;
        }
        await new Promise((done) => setTimeout(done, 25));
      }
      expect(alive).toBe(false);
    },
  );

  it('persists bounded output while the child is running', async () => {
    const seen: string[] = [];
    const result = await runProcess(
      process.execPath,
      ['-e', 'console.log("started");setInterval(()=>{},1000)'],
      { timeoutMs: 400, onStdout: (chunk: Buffer) => seen.push(chunk.toString()) },
    );
    expect(result.status).toBe('blocked');
    expect(seen.join('')).toContain('started');
  });

  it('grades actual seed behaviour despite rewritten public tests and package scripts', async () => {
    const task = tasks.find((entry: { id: string }) => entry.id === 'csv-record');
    const candidate = join(scratch, 'candidate');
    mkdirSync(join(candidate, 'src'), { recursive: true });
    mkdirSync(join(candidate, 'test'));
    writeFileSync(join(candidate, 'src/csv.mjs'), task.files['src/csv.mjs']);
    writeFileSync(join(candidate, 'package.json'), '{"scripts":{"test":"echo success"}}');
    writeFileSync(join(candidate, 'test/public.test.mjs'), '// acceptance passed\n');
    const execution = await runProcess(process.execPath, [
      join(root, 'benchmarks/grade.mjs'),
      '--task',
      task.id,
      '--candidate',
      candidate,
    ]);
    expect(execution.exit_code).toBe(0);
    const grade = JSON.parse(execution.stdout);
    expect(validateGrade(task, grade)).toBe(true);
    expect(grade.passed).toBe(false);
    expect(
      grade.checks.find((check: { id: string }) => check.id === 'csv.quoted-comma').passed,
    ).toBe(false);
    expect(
      grade.checks.filter(
        (check: { kind: string; passed: boolean }) => check.kind === 'regression' && check.passed,
      ),
    ).toHaveLength(2);
  });

  it('refuses incomplete, duplicate and inconsistent grader results', () => {
    const task = tasks[0];
    const checks = checkDefinitions[task.id].map(({ id, kind }: { id: string; kind: string }) => ({
      id,
      kind,
      passed: true,
    }));
    const grade = {
      format_version: 1,
      task_id: task.id,
      cohort: task.cohort,
      checks,
      passed: true,
    };
    expect(validateGrade(task, grade)).toBe(true);
    expect(validateGrade(task, { ...grade, checks: checks.slice(1) })).toBe(false);
    expect(validateGrade(task, { ...grade, checks: checks.map(() => checks[0]) })).toBe(false);
    expect(validateGrade(task, { ...grade, passed: false })).toBe(false);
  });

  it('preserves missing and blocked scheduled trials without pooling development results', () => {
    const schedule = scheduleTasks(tasks);
    const row = schedule[0];
    const summary = summarize({ schedule, digest: 'fixture' }, [
      { ...row, outcome: 'blocked', agent: { duration_ms: 10 } },
    ]);
    expect(summary.cohorts.development.conditions.baseline.blocked).toBe(1);
    expect(summary.cohorts.development.conditions.baseline.not_run).toBe(1);
    expect(summary.cohorts.confirmation.conditions.baseline.scheduled).toBe(4);
    expect(summary.cohorts.confirmation.conditions.baseline.not_run).toBe(4);
    expect(
      summary.cohorts.confirmation.pairs.every((pair: { comparable: boolean }) => !pair.comparable),
    ).toBe(true);
    expect(summary.cost_usd).toBeNull();
    expect(summary.comparative_benefit).toBe('not_established');
    expect(() => summarize({ schedule }, [{ ...row }, { ...row }])).toThrow('Duplicate');
  });

  it('aggregates root tokens only when every dispatched attempt has complete coverage', () => {
    const schedule = scheduleTasks(tasks.slice(0, 1));
    const baseline = schedule.filter((row: { condition: string }) => row.condition === 'baseline');
    const complete = baseline.map((row: object) => ({
      ...row,
      outcome: 'failed',
      dispatch_requested_at: 'fixture',
      observation: {
        root_usage_coverage: { complete_root_usage: true },
        root_usage: {
          input_tokens: 10,
          cached_input_tokens: 4,
          output_tokens: 3,
          reasoning_output_tokens: null,
        },
      },
    }));
    const full = summarize({ schedule }, complete).cohorts.development.conditions.baseline;
    expect(full.dispatched).toBe(2);
    expect(full.root_tokens_if_all_dispatched_known).toEqual({
      input_tokens: 20,
      cached_input_tokens: 8,
      output_tokens: 6,
      reasoning_output_tokens: null,
    });
    const missing = { ...complete[1], observation: null };
    const partial = summarize({ schedule }, [complete[0], missing]).cohorts.development.conditions
      .baseline;
    expect(
      Object.values(partial.root_tokens_if_all_dispatched_known).every((value) => value === null),
    ).toBe(true);
  });

  it('recovers early interruptions and prefers a durable attempt marker over stale planned results', async () => {
    const output = join(scratch, 'interrupted');
    mkdirSync(output);
    const schedule = scheduleTasks(tasks);
    const protocol = { digest: 'fixture', schedule, agent: { model: 'fixture', effort: 'high' } };
    saveJSON(join(output, 'protocol.json'), protocol);
    expect(readResults(output, protocol)).toEqual([]);
    const report = await runProcess(process.execPath, [
      join(root, 'benchmarks/report.mjs'),
      output,
    ]);
    expect(report.exit_code).toBe(0);
    expect(
      JSON.parse(readFileSync(join(output, 'summary.json'), 'utf8')).cohorts.confirmation.conditions
        .baseline.not_run,
    ).toBe(4);
    saveJSON(
      join(output, 'results.json'),
      schedule.map((trial: object) => ({ ...trial, outcome: 'not_run' })),
    );
    const trial = schedule[0];
    mkdirSync(join(output, trial.id));
    saveJSON(join(output, trial.id, 'result.json'), {
      ...trial,
      outcome: 'blocked',
      reason: 'agent_dispatch_interrupted_or_unconfirmed',
    });
    const summary = summarize(protocol, readResults(output, protocol));
    expect(summary.cohorts.development.conditions.baseline.blocked).toBe(1);
    expect(summary.cohorts.development.conditions.baseline.not_run).toBe(1);
    writeFileSync(join(output, 'results.json'), 'corrupt');
    expect(() => readResults(output, protocol)).toThrow();
  });

  it('refuses an existing output before invoking any agent or touching prior evidence', async () => {
    const output = join(scratch, 'previous');
    mkdirSync(output);
    const marker = join(output, 'keep.json');
    writeFileSync(marker, 'unchanged');
    await expect(runBenchmark({ output, executable: 'missing' })).rejects.toThrow('new output');
    expect(readFileSync(marker, 'utf8')).toBe('unchanged');
  });
});
