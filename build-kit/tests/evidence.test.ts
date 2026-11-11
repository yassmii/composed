import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type EvidenceReceipt,
  type EvidenceReview,
  runEvidence,
  runVerify,
  verifyEvidence,
} from '../src/cli/evidence.ts';

let project: string;
let output = 0;

beforeEach(() => {
  project = mkdtempSync(join(tmpdir(), 'composed-evidence-'));
  output = 0;
  writeFileSync(
    join(project, 'candidate.mjs'),
    'export const canCancel = (hours) => hours >= 24;\n',
  );
  writeFileSync(
    join(project, 'check.mjs'),
    [
      "import assert from 'node:assert/strict';",
      "import { canCancel } from './candidate.mjs';",
      'assert.equal(canCancel(23), false);',
      'assert.equal(canCancel(24), true);',
      'assert.equal(canCancel(25), true);',
    ].join('\n'),
  );
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  rmSync(project, { recursive: true, force: true });
});

async function record(command = [process.execPath, 'check.mjs'], extra: string[] = []) {
  return runEvidence([
    'run',
    '--cwd',
    project,
    '--subject',
    'candidate.mjs',
    '--subject',
    'check.mjs',
    '--requirement',
    'REQ-EX-CANCEL-001',
    '--acceptance',
    'ACC-EX-CANCEL-001',
    '--output',
    `evidence/run-${++output}.json`,
    '--json',
    ...extra,
    '--',
    ...command,
  ]);
}

function rewriteReceipt(
  change: (receipt: EvidenceReceipt) => void,
  relative = 'evidence/run-1.json',
) {
  const path = join(project, relative);
  const receipt = JSON.parse(readFileSync(path, 'utf8')) as EvidenceReceipt;
  change(receipt);
  writeFileSync(path, JSON.stringify(receipt));
}

function printedOutput(): string {
  return vi
    .mocked(console.log)
    .mock.calls.map((call) => call.join(' '))
    .join('\n');
}

describe('executable local evidence', () => {
  it('explains a current record without claiming product acceptance or a required review', async () => {
    const report = await record();
    vi.mocked(console.log).mockClear();
    await runVerify(['--cwd', project, '--evidence', report.receipt]);
    expect(printedOutput()).toContain('Result: current passing record');
    expect(printedOutput()).toContain('no command executed');
    expect(printedOutput()).toContain('Review: not supplied; review requirements not assessed.');
    expect(printedOutput()).toContain('Product acceptance and closure are not assessed.');
  });

  it('makes a historical pass visibly stale and does not rerun its command', async () => {
    const report = await record();
    rewriteReceipt((receipt) => {
      receipt.execution.executable = process.execPath;
      receipt.execution.args = ['-e', "require('fs').writeFileSync('marker','ran')"];
    });
    const historical = readFileSync(join(project, report.receipt), 'utf8');
    writeFileSync(join(project, 'candidate.mjs'), 'export const canCancel = () => false;\n');
    vi.mocked(console.log).mockClear();
    await runVerify(['--cwd', project, '--evidence', report.receipt]);
    expect(printedOutput()).toContain('Result: evidence needs attention');
    expect(printedOutput()).toContain('Recorded check: passed; selected files: stale');
    expect(printedOutput()).toContain('Keep the old receipt.');
    expect(printedOutput()).not.toContain('Result: current passing record');
    expect(existsSync(join(project, 'marker'))).toBe(false);
    expect(readFileSync(join(project, report.receipt), 'utf8')).toBe(historical);
  });

  it.each([
    ['failed', [process.execPath, '-e', 'process.exit(1)'], 'execution.stdout/stderr'],
    ['blocked', ['composed-nonexistent-check-command-32768'], 'execution blocker'],
  ] as const)(
    'gives an actionable explanation for a %s execution',
    async (status, command, next) => {
      const report = await record([...command]);
      vi.mocked(console.log).mockClear();
      await runVerify(['--cwd', project, '--evidence', report.receipt]);
      expect(printedOutput()).toContain('Result: evidence needs attention');
      expect(printedOutput()).toContain(`Recorded check: ${status}`);
      expect(printedOutput()).toContain(next);
      expect(printedOutput()).not.toContain('Result: current passing record');
    },
  );

  it('distinguishes an unexecuted declaration from an unreadable receipt', async () => {
    const report = await record();
    rewriteReceipt((receipt) => {
      receipt.execution.status = 'not_run';
      receipt.execution.started_at = null;
      receipt.execution.finished_at = null;
      receipt.execution.exit_code = null;
    });
    vi.mocked(console.log).mockClear();
    await runVerify(['--cwd', project, '--evidence', report.receipt]);
    expect(printedOutput()).toContain('Recorded check: not_run');
    expect(printedOutput()).toContain('run the intended authorised check');
    writeFileSync(join(project, report.receipt), '{broken');
    vi.mocked(console.log).mockClear();
    await runVerify(['--cwd', project, '--evidence', report.receipt]);
    expect(printedOutput()).toContain('untrusted (invalid receipt)');
    expect(printedOutput()).toContain('resolve the receipt path, format or integrity');
    expect(printedOutput()).not.toContain('Recorded check: not_run');
  });

  it('captures a real acceptance check and verifies the exact artifact revision', async () => {
    const report = await record();
    expect(report.healthy).toBe(true);
    expect(report.recorded_status).toBe('passed');
    expect(report.applicability).toBe('current');
    expect(report.closure).toBe('not_assessed');
    const receipt = JSON.parse(
      readFileSync(join(project, report.receipt), 'utf8'),
    ) as EvidenceReceipt;
    expect(receipt.execution.exit_code).toBe(0);
    expect(receipt.execution.started_at).not.toBeNull();
    expect(receipt.requirement_ids).toContain('REQ-EX-CANCEL-001');
    expect(receipt.acceptance_ids).toContain('ACC-EX-CANCEL-001');
    expect(receipt.subjects.map((subject) => subject.path)).toEqual(['candidate.mjs', 'check.mjs']);
    expect(await runVerify(['--cwd', project, '--evidence', report.receipt, '--json'])).toEqual(
      report,
    );
    expect(JSON.parse(vi.mocked(console.log).mock.calls.at(-1)?.[0] as string)).toEqual(report);
  });

  it('rejects a plausible boundary bug even when the candidate module loads normally', async () => {
    writeFileSync(
      join(project, 'candidate.mjs'),
      'export const canCancel = (hours) => hours > 24;\n',
    );
    const moduleLoad = await record([process.execPath, '-e', "import('./candidate.mjs')"]);
    expect(moduleLoad.recorded_status).toBe('passed');
    const acceptance = await record();
    expect(acceptance.healthy).toBe(false);
    expect(acceptance.recorded_status).toBe('failed');
    expect(acceptance.applicability).toBe('current');
  });

  it('does not treat a success-looking response as a successful execution', async () => {
    const report = await record([
      process.execPath,
      '-e',
      "console.log('ALL TESTS PASSED');process.exit(1)",
    ]);
    expect(report.healthy).toBe(false);
    expect(report.recorded_status).toBe('failed');
  });

  it('invalidates old evidence when a subject or checker changes, without rewriting history', async () => {
    const report = await record();
    const before = readFileSync(join(project, report.receipt), 'utf8');
    writeFileSync(join(project, 'candidate.mjs'), 'export const canCancel = () => false;\n');
    const stale = verifyEvidence(project, report.receipt);
    expect(stale.healthy).toBe(false);
    expect(stale.recorded_status).toBe('passed');
    expect(stale.applicability).toBe('stale');
    expect(readFileSync(join(project, report.receipt), 'utf8')).toBe(before);
    writeFileSync(
      join(project, 'candidate.mjs'),
      'export const canCancel = (hours) => hours >= 24;\n',
    );
    writeFileSync(join(project, 'check.mjs'), '// checker removed\n');
    expect(verifyEvidence(project, report.receipt).applicability).toBe('stale');
  });

  it('uses monotonic elapsed time while preserving and marking regressed wall timestamps', async () => {
    const clock = vi.spyOn(Date, 'now').mockReturnValueOnce(2000).mockReturnValue(1000);
    const report = await record([process.execPath, '-e', 'process.exit(1)']);
    expect(report.recorded_status).toBe('failed');
    const receipt = JSON.parse(
      readFileSync(join(project, report.receipt), 'utf8'),
    ) as EvidenceReceipt;
    expect(receipt.execution.duration_source).toBe('monotonic');
    expect(receipt.execution.duration_ms).toBeGreaterThanOrEqual(0);
    expect(receipt.execution.wall_clock_regressed).toBe(true);
    expect(Date.parse(receipt.execution.finished_at as string)).toBeLessThan(
      Date.parse(receipt.execution.started_at as string),
    );
    clock.mockRestore();
    rewriteReceipt((value) => {
      value.execution.wall_clock_regressed = false;
    }, report.receipt);
    expect(verifyEvidence(project, report.receipt).applicability).toBe('invalid');
  });

  it('does not inflate elapsed duration after a forward wall-clock step and keeps legacy receipts valid', async () => {
    const clock = vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValue(86401000);
    const report = await record();
    expect(report.healthy).toBe(true);
    const receipt = JSON.parse(
      readFileSync(join(project, report.receipt), 'utf8'),
    ) as EvidenceReceipt;
    expect(receipt.execution.duration_ms).toBeLessThan(86400000);
    expect(receipt.execution.wall_clock_regressed).toBe(false);
    clock.mockRestore();
    rewriteReceipt((value) => {
      const {
        duration_source: _source,
        wall_clock_regressed: _regressed,
        ...legacy
      } = value.execution;
      value.execution = legacy;
    }, report.receipt);
    expect(verifyEvidence(project, report.receipt).healthy).toBe(true);
  });

  it('records missing tools and bounded time/output failures without passing them', async () => {
    const missing = await record(['composed-nonexistent-check-command-32768']);
    expect(missing.recorded_status).toBe('blocked');
    expect(missing.healthy).toBe(false);
    const timeout = await record(
      [process.execPath, '-e', 'setInterval(()=>{},1000)'],
      ['--timeout-ms', '25'],
    );
    expect(timeout.recorded_status).toBe('blocked');
    const excessive = await record([
      process.execPath,
      '-e',
      "process.stdout.write('x'.repeat(300000))",
    ]);
    expect(excessive.recorded_status).toBe('blocked');
    const receipt = JSON.parse(
      readFileSync(join(project, excessive.receipt), 'utf8'),
    ) as EvidenceReceipt;
    expect(receipt.execution.output_truncated).toBe(true);
    expect(receipt.execution.stdout.length).toBeLessThanOrEqual(128 * 1024);
  });

  it('refuses existing evidence output before executing the command', async () => {
    await record();
    const marker = join(project, 'marker');
    await expect(
      runEvidence([
        '--cwd',
        project,
        '--subject',
        'candidate.mjs',
        '--requirement',
        'REQ-1',
        '--acceptance',
        'ACC-1',
        '--output',
        'evidence/run-1.json',
        '--',
        process.execPath,
        '-e',
        "require('fs').writeFileSync('marker','ran')",
      ]),
    ).rejects.toThrow(/exists/);
    expect(existsSync(marker)).toBe(false);
  });

  it('never executes receipt-supplied commands during verification', async () => {
    const report = await record();
    rewriteReceipt((receipt) => {
      receipt.execution.executable = process.execPath;
      receipt.execution.args = ['-e', "require('fs').writeFileSync('marker','ran')"];
    });
    expect(verifyEvidence(project, report.receipt).healthy).toBe(true);
    expect(existsSync(join(project, 'marker'))).toBe(false);
  });

  it('does not turn a planned or internally inconsistent receipt into a passing check', async () => {
    const report = await record();
    rewriteReceipt((receipt) => {
      receipt.execution.status = 'not_run';
      receipt.execution.started_at = null;
      receipt.execution.finished_at = null;
      receipt.execution.exit_code = null;
    });
    expect(verifyEvidence(project, report.receipt).healthy).toBe(false);
    expect(verifyEvidence(project, report.receipt).recorded_status).toBe('not_run');
    rewriteReceipt((receipt) => {
      receipt.execution.status = 'passed';
    });
    expect(verifyEvidence(project, report.receipt).applicability).toBe('invalid');
  });

  it('refuses traversal, absolute paths, linked subjects and linked receipt ancestors', async () => {
    for (const subject of [
      '../outside',
      '/etc/passwd',
      'C:/outside',
      '\\\\host\\share',
      'a/../candidate.mjs',
    ]) {
      await expect(
        runEvidence([
          '--cwd',
          project,
          '--subject',
          subject,
          '--requirement',
          'REQ-1',
          '--acceptance',
          'ACC-1',
          '--output',
          'run.json',
          '--',
          process.execPath,
          '-e',
          'process.exit(0)',
        ]),
      ).rejects.toThrow();
    }
    const linked = join(project, 'linked.mjs');
    symlinkSync(join(project, 'candidate.mjs'), linked);
    await expect(
      runEvidence([
        '--cwd',
        project,
        '--subject',
        'linked.mjs',
        '--requirement',
        'REQ-1',
        '--acceptance',
        'ACC-1',
        '--output',
        'run.json',
        '--',
        process.execPath,
        '-e',
        'process.exit(0)',
      ]),
    ).rejects.toThrow();
    mkdirSync(join(project, 'outside'));
    symlinkSync(join(project, 'outside'), join(project, 'linked-output'), 'dir');
    await expect(
      runEvidence([
        '--cwd',
        project,
        '--subject',
        'candidate.mjs',
        '--requirement',
        'REQ-1',
        '--acceptance',
        'ACC-1',
        '--output',
        'linked-output/run.json',
        '--',
        process.execPath,
        '-e',
        'process.exit(0)',
      ]),
    ).rejects.toThrow();
    expect(existsSync(join(project, 'outside/run.json'))).toBe(false);
  });

  it('keeps review applicability separate from authenticated independence', async () => {
    const report = await record();
    const receiptBytes = readFileSync(join(project, report.receipt));
    const review: EvidenceReview = {
      format_version: 1,
      kind: 'local-review-declaration',
      receipt_sha256: createHash('sha256').update(receiptBytes).digest('hex'),
      subject_digest: report.subject_digest,
      author: 'author',
      reviewer: 'reviewer',
      author_context: 'author-session',
      reviewer_context: 'fresh-session',
      mode: 'native-subagent',
      verdict: 'accepted',
    };
    writeFileSync(join(project, 'review.json'), JSON.stringify(review));
    const declared = verifyEvidence(project, report.receipt, 'review.json');
    expect(declared.healthy).toBe(true);
    expect(declared.review).toEqual({ applicability: 'current', independence: 'declared' });
    expect(declared.closure).toBe('not_assessed');
    writeFileSync(join(project, 'review.json'), JSON.stringify({ ...review, reviewer: 'author' }));
    expect(verifyEvidence(project, report.receipt, 'review.json').healthy).toBe(false);
    vi.mocked(console.log).mockClear();
    await runVerify(['--cwd', project, '--evidence', report.receipt, '--review', 'review.json']);
    expect(printedOutput()).toContain('Result: evidence needs attention');
    expect(printedOutput()).toContain('independence: self_review');
    expect(printedOutput()).toContain('actual independent review');
    writeFileSync(
      join(project, 'review.json'),
      JSON.stringify({ ...review, receipt_sha256: '0'.repeat(64) }),
    );
    expect(verifyEvidence(project, report.receipt, 'review.json').review.applicability).toBe(
      'stale',
    );
    vi.mocked(console.log).mockClear();
    await runVerify(['--cwd', project, '--evidence', report.receipt, '--review', 'review.json']);
    expect(printedOutput()).toContain('keep the earlier review');
    writeFileSync(
      join(project, 'review.json'),
      JSON.stringify({ ...review, verdict: 'return_needed' }),
    );
    vi.mocked(console.log).mockClear();
    await runVerify(['--cwd', project, '--evidence', report.receipt, '--review', 'review.json']);
    expect(printedOutput()).toContain('resolve the recorded review verdict with the reviewer');
    expect(printedOutput()).not.toContain('Result: current passing record');
    writeFileSync(join(project, 'review.json'), '{broken');
    vi.mocked(console.log).mockClear();
    await runVerify(['--cwd', project, '--evidence', report.receipt, '--review', 'review.json']);
    expect(printedOutput()).toContain('locate a valid review declaration');
  });

  it('reports an in-command subject mutation as blocked', async () => {
    const report = await record([
      process.execPath,
      '-e',
      "require('fs').writeFileSync('candidate.mjs','changed')",
    ]);
    expect(report.recorded_status).toBe('blocked');
    expect(report.applicability).toBe('stale');
  });

  it('rejects unknown flags and malformed receipt versions without invoking anything', async () => {
    await expect(runVerify(['--cwd', project, '--evidence', 'foo', '--execute'])).rejects.toThrow(
      /Unknown/,
    );
    await expect(record(undefined, ['--timeout-ms', '0'])).rejects.toThrow(/timeout-ms/);
    const report = await record();
    rewriteReceipt((receipt) => {
      (receipt as unknown as { format_version: number }).format_version = 2;
    }, report.receipt);
    expect(verifyEvidence(project, report.receipt).healthy).toBe(false);
    expect(verifyEvidence(project, report.receipt).applicability).toBe('invalid');
  });
});
