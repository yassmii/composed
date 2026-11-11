import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..', 'benchmarks', 'adaptive-delivery');
const { tasks } = await import(pathToFileURL(join(root, 'corpus.mjs')).href);
const { prepare, calibrate, scheduleTasks, readProtocol } = await import(
  pathToFileURL(join(root, 'protocol.mjs')).href
);
const { summarize } = await import(pathToFileURL(join(root, 'report.mjs')).href);
const scratch = mkdtempSync(join(tmpdir(), 'composed-adaptive-test-'));
const environment = join(scratch, 'environment.json');
writeFileSync(
  environment,
  JSON.stringify({
    client: 'fixture',
    client_version: '1',
    access_mode: 'local',
    fixed_model: 'fixed',
    allowed_models: ['fixed', 'other'],
    data_policy: 'synthetic local only',
  }),
);
const options = {
  output: join(scratch, 'campaign'),
  baseline: 'a'.repeat(40),
  candidate: 'b'.repeat(40),
  environment,
  authorization: 'user-local-only',
};
const protocol = await prepare(options);

afterAll(() => rmSync(scratch, { recursive: true, force: true }));

function accepted(trial: { id: string; condition: string; family: string }) {
  return {
    id: trial.id,
    protocol_sha256: protocol.sha256,
    outcome: 'accepted',
    revision: trial.condition === 'A' ? options.baseline : options.candidate,
    client: 'fixture',
    client_version: '1',
    access_mode: 'local',
    requested_model: trial.condition === 'C' ? 'other' : 'fixed',
    observed_model: null,
    duration_ms: { A: 100, B: 75, C: 50 }[trial.condition],
    evidence: ['fixture-only-observation'],
    grade: { passed: true },
    gates_passed: true,
    review: {
      mode: 'native-subagent',
      author_id: 'author',
      reviewer_id: 'reviewer',
      fresh_context: true,
      verdict: 'accepted',
      evidence: 'fixture-only-verdict',
    },
    cost_usd: null,
    tokens: null,
    human_interventions: 0,
    retries: 0,
  };
}

describe('adaptive delivery protocol (MET-ADH-003 / ACC-ADH-016)', () => {
  it('calibrates every reference against a failing seed and semantic mutant', async () => {
    const calibration = await calibrate();
    expect(calibration.status).toBe('passed');
    expect(calibration.results).toHaveLength(8);
    expect(tasks.filter((task: { cohort: string }) => task.cohort === 'confirmation')).toHaveLength(
      4,
    );
  });

  it('rotates A/B/C order and freezes the protocol without launching an agent', () => {
    const schedule = scheduleTasks();
    expect(schedule).toHaveLength(72);
    expect(new Set(schedule.map((trial: { id: string }) => trial.id)).size).toBe(72);
    expect(schedule.slice(0, 9).map((trial: { condition: string }) => trial.condition)).toEqual([
      'A',
      'B',
      'C',
      'B',
      'C',
      'A',
      'C',
      'A',
      'B',
    ]);
    expect(readProtocol(join(options.output, 'protocol.json')).sha256).toBe(protocol.sha256);
    expect(() => scheduleTasks(0)).toThrow();
  });

  it('refuses overwriting evidence and mutable revisions', async () => {
    const before = readFileSync(join(options.output, 'protocol.json'), 'utf8');
    await expect(prepare(options)).rejects.toThrow();
    expect(readFileSync(join(options.output, 'protocol.json'), 'utf8')).toBe(before);
    await expect(prepare({ ...options, baseline: 'HEAD' })).rejects.toThrow('immutable');
  });

  it('rejects modified frozen inputs', () => {
    const path = join(scratch, 'changed.json');
    writeFileSync(path, JSON.stringify({ ...protocol, thresholds: { complex_median_gain: 0 } }));
    expect(() => readProtocol(path)).toThrow('changed');
  });

  it('keeps missing and blocked trials and withholds gains instead of filtering failures', () => {
    const first = accepted(protocol.schedule[0]);
    const report = summarize(protocol, [{ ...first, outcome: 'blocked' }]);
    expect(report.cohorts.development.conditions.A.outcomes.blocked).toBe(1);
    expect(report.cohorts.development.conditions.A.outcomes.not_run).toBe(11);
    expect(report.cohorts.confirmation.conditions.A.outcomes.not_run).toBe(12);
    expect(report.organisation_target_observed).toBe(false);
    expect(report.adaptive_target_observed).toBe(false);
    expect(report.cohorts.development.comparisons.A_to_B.paired_complex_median_gain).toBeNull();
    expect(report.cohorts.development.conditions.A.cost_usd).toBeNull();
  });

  it('separates organisation and assignment gains without claiming a general advantage', () => {
    const report = summarize(protocol, protocol.schedule.map(accepted));
    expect(report.organisation_target_observed).toBe(true);
    expect(report.adaptive_target_observed).toBe(true);
    expect(report.comparative_benefit).toBe('not_established');
    expect(report.cohorts.confirmation.comparisons.A_to_B.paired_complex_median_gain).toBe(0.25);
    expect(report.cohorts.confirmation.conditions.C.cost_usd).toBeNull();
  });

  it('rejects duplicate trials, success-looking failed checks, hidden fallback and self-review', () => {
    const row = accepted(protocol.schedule[0]);
    expect(() => summarize(protocol, [row, row])).toThrow('duplicate');
    expect(() => summarize(protocol, [{ ...row, grade: { passed: false } }])).toThrow('gates');
    expect(() => summarize(protocol, [{ ...row, requested_model: 'remote-fallback' }])).toThrow();
    const risky = accepted(
      protocol.schedule.find((trial: { family: string }) => trial.family === 'risky-interface'),
    );
    expect(() =>
      summarize(protocol, [
        { ...risky, review: { ...risky.review, reviewer_id: risky.review.author_id } },
      ]),
    ).toThrow('independent');
  });
});
