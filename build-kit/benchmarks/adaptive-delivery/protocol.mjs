import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runProcess } from '../process.mjs';
import { graderSource, tasks } from './corpus.mjs';

export const conditions = ['A', 'B', 'C'];
export const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

export function scheduleTasks(repetitions = 3) {
  if (!Number.isInteger(repetitions) || repetitions < 3 || repetitions > 6)
    throw new Error('Repetitions must be between 3 and 6.');
  return tasks.flatMap((task, index) =>
    Array.from({ length: repetitions }, (_, repetition) => {
      const offset = (index + repetition) % conditions.length;
      const order = [...conditions.slice(offset), ...conditions.slice(0, offset)];
      return order.map((condition) => ({
        id: `${task.id}-${repetition + 1}-${condition}`,
        task_id: task.id,
        family: task.family,
        cohort: task.cohort,
        repetition: repetition + 1,
        condition,
      }));
    }).flat(),
  );
}

export async function grade(task, candidate) {
  const scratch = mkdtempSync(join(tmpdir(), 'composed-adaptive-grade-'));
  try {
    const judge = join(scratch, 'judge.mjs');
    writeFileSync(judge, graderSource(task));
    const result = await runProcess(process.execPath, [judge, resolve(candidate)], {
      timeoutMs: 5000,
      maxBytes: 32768,
    });
    return {
      passed: result.status === 'completed' && result.exit_code === 0,
      judge_status: result.status,
      exit_code: result.exit_code,
      // Candidate code is executed locally with the caller's privileges, never sandboxed here.
      scope: 'semantic-fixture-only',
    };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

export async function calibrate() {
  const scratch = mkdtempSync(join(tmpdir(), 'composed-adaptive-calibration-'));
  try {
    const results = [];
    for (const task of tasks) {
      const row = { task_id: task.id };
      for (const variant of ['seed', 'reference', 'mutant']) {
        const candidate = join(scratch, `${task.id}-${variant}.mjs`);
        writeFileSync(candidate, task[variant]);
        row[variant] = await grade(task, candidate);
      }
      results.push(row);
    }
    return {
      status: results.every((row) => !row.seed.passed && row.reference.passed && !row.mutant.passed)
        ? 'passed'
        : 'failed',
      results,
    };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

export async function prepare(options) {
  const { output, baseline, candidate, environment, authorization, repetitions = 3 } = options;
  for (const [key, value] of Object.entries({ baseline, candidate })) {
    if (typeof value !== 'string' || !/^[a-f0-9]{40}$/.test(value))
      throw new Error(`${key} must be an immutable 40-character revision.`);
  }
  for (const [key, value] of Object.entries({ environment, authorization })) {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`${key} is required.`);
  }
  const environmentData = JSON.parse(readFileSync(environment, 'utf8'));
  const environmentKeys = [
    'client',
    'client_version',
    'access_mode',
    'fixed_model',
    'allowed_models',
    'data_policy',
  ];
  if (
    !environmentData ||
    Object.keys(environmentData).some((key) => !environmentKeys.includes(key)) ||
    ['client', 'client_version', 'access_mode', 'fixed_model', 'data_policy'].some(
      (key) => typeof environmentData[key] !== 'string' || !environmentData[key].trim(),
    ) ||
    !Array.isArray(environmentData.allowed_models) ||
    !environmentData.allowed_models.length ||
    environmentData.allowed_models.some((model) => typeof model !== 'string' || !model.trim()) ||
    !environmentData.allowed_models.includes(environmentData.fixed_model)
  )
    throw new Error(
      'Invalid environment: freeze client, access, fixed/allowed models and data policy.',
    );
  const schedule = scheduleTasks(repetitions);
  const calibration = await calibrate();
  if (calibration.status !== 'passed') throw new Error('Judge calibration failed.');
  const body = {
    format_version: 1,
    scope: 'adaptive-delivery-pilot',
    created_at: new Date().toISOString(),
    revisions: { A: baseline, B: candidate, C: candidate },
    environment: environmentData,
    authorization_reference: authorization,
    conditions: {
      A: 'baseline kit, fixed model',
      B: 'improved organisation, same fixed model as A',
      C: 'same organisation as B, adaptive assignment within approved candidates',
    },
    limits: { trial_ms: 600000, total_ms: schedule.length * 600000, attempts_per_trial: 2 },
    thresholds: { complex_median_gain: 0.2, direct_max_regression: 0.1 },
    tasks,
    graders_sha256: digest(tasks.map(graderSource)),
    calibration,
    schedule,
  };
  const protocol = { ...body, sha256: digest(body) };
  // Exclusive output creation prevents replacing an existing campaign or its evidence.
  mkdirSync(output);
  writeFileSync(join(output, 'protocol.json'), `${JSON.stringify(protocol, null, 2)}\n`, {
    flag: 'wx',
  });
  return protocol;
}

export function readProtocol(path) {
  const protocol = JSON.parse(readFileSync(path, 'utf8'));
  const { sha256, ...body } = protocol;
  if (
    body.format_version !== 1 ||
    body.scope !== 'adaptive-delivery-pilot' ||
    digest(body) !== sha256 ||
    !Array.isArray(body.schedule) ||
    body.schedule.length === 0 ||
    new Set(body.schedule.map((row) => row.id)).size !== body.schedule.length
  )
    throw new Error('Invalid or changed frozen protocol.');
  return protocol;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length === 1 && args[0] === 'calibrate') {
      const result = await calibrate();
      console.log(JSON.stringify(result, null, 2));
      if (result.status !== 'passed') process.exitCode = 1;
    } else if (args.length === 6 && args[0] === 'prepare') {
      const protocol = await prepare({
        output: resolve(args[1]),
        baseline: args[2],
        candidate: args[3],
        environment: args[4],
        authorization: args[5],
      });
      console.log(JSON.stringify({ status: 'prepared', sha256: protocol.sha256, calls: 0 }));
    } else {
      throw new Error(
        'Usage: protocol.mjs calibrate | prepare <new-output> <baseline-sha> <candidate-sha> <environment-ref> <authorization-ref>',
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
