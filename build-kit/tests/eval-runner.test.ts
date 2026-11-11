import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '..');
const RUNNER = join(ROOT, 'evals/run.mjs');
const scenarioCount = (
  JSON.parse(readFileSync(join(ROOT, 'evals/scenarios.json'), 'utf8')) as {
    scenarios: unknown[];
  }
).scenarios.length;
let output: string;

beforeEach(() => {
  output = mkdtempSync(join(tmpdir(), 'hunch-eval-'));
});

afterEach(() => {
  rmSync(output, { recursive: true, force: true });
});

describe('agentic eval runner', () => {
  it('runs the full scenario suite with the deterministic fixture adapter', () => {
    execFileSync(process.execPath, [RUNNER, '--adapter', 'fixture', '--output', output], {
      cwd: ROOT,
      stdio: 'pipe',
    });

    const summary = JSON.parse(readFileSync(join(output, 'summary.json'), 'utf8')) as {
      passed: number;
      total: number;
      score: number;
    };
    expect(summary).toMatchObject({ passed: scenarioCount, total: scenarioCount, score: 1 });
    expect(existsSync(join(output, 'production-migration.json'))).toBe(true);
  });
});
