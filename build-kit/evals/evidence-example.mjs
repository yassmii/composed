import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { register } from 'tsx/esm/api';

const argv = process.argv.slice(2);
if (argv.length && (argv.length !== 2 || argv[0] !== '--output')) {
  throw new Error('Usage: node evals/evidence-example.mjs [--output <new-directory>]');
}
const root = argv[1] ? resolve(argv[1]) : mkdtempSync(join(tmpdir(), 'composed-evidence-example-'));
if (argv[1] && existsSync(root))
  throw new Error('Choose a new output directory; earlier evidence is preserved.');
mkdirSync(root, { recursive: true });
const source = resolve(dirname(fileURLToPath(import.meta.url)), '../examples/evidence');
for (const name of [
  'cancellation.correct.mjs',
  'cancellation.wrong.mjs',
  'acceptance.mjs',
  'requirements.json',
]) {
  cpSync(join(source, name), join(root, name));
}

const unregister = register();
try {
  const { runEvidence, verifyEvidence } = await import('../src/cli/evidence.ts');
  const subjects = [
    'acceptance.mjs',
    'requirements.json',
    'cancellation.correct.mjs',
    'cancellation.wrong.mjs',
  ];
  const run = (name, command) =>
    runEvidence([
      'run',
      '--cwd',
      root,
      ...subjects.flatMap((path) => ['--subject', path]),
      '--requirement',
      'REQ-EX-CANCEL-001',
      '--acceptance',
      'ACC-EX-CANCEL-001',
      '--output',
      `receipts/${name}.json`,
      '--',
      process.execPath,
      ...command,
    ]);

  const correct = await run('correct', ['acceptance.mjs', 'cancellation.correct.mjs']);
  assert.equal(correct.healthy, true, 'The grader must accept the known-correct reference.');
  const normalExit = await run('wrong-module-load', ['-e', "import('./cancellation.wrong.mjs')"]);
  assert.equal(normalExit.healthy, true, 'The plausible wrong module loads with exit zero.');
  const wrong = await run('wrong-acceptance', ['acceptance.mjs', 'cancellation.wrong.mjs']);
  assert.equal(wrong.healthy, false, 'The grader must reject the plausible boundary defect.');
  assert.equal(wrong.recorded_status, 'failed');

  const correctBytes = readFileSync(join(root, 'cancellation.correct.mjs'));
  writeFileSync(join(root, 'cancellation.correct.mjs'), 'export const canCancel = () => false;\n');
  const stale = verifyEvidence(root, correct.receipt);
  assert.equal(stale.applicability, 'stale', 'An old successful receipt must become inapplicable.');
  assert.equal(stale.recorded_status, 'passed', 'Historical execution must not be rewritten.');
  writeFileSync(join(root, 'cancellation.correct.mjs'), correctBytes);

  const correctReceiptBytes = readFileSync(join(root, correct.receipt));
  const planned = JSON.parse(correctReceiptBytes.toString('utf8'));
  planned.id = 'illustrative-not-run-declaration';
  planned.execution = {
    ...planned.execution,
    status: 'not_run',
    started_at: null,
    finished_at: null,
    exit_code: null,
    duration_ms: 0,
    stdout: '',
    stderr: '',
  };
  writeFileSync(join(root, 'receipts/not-run.json'), `${JSON.stringify(planned, null, 2)}\n`);
  const notRun = verifyEvidence(root, 'receipts/not-run.json');
  assert.equal(notRun.healthy, false, 'An unexecuted declaration must not satisfy validation.');

  const selfReview = {
    format_version: 1,
    kind: 'local-review-declaration',
    receipt_sha256: createHash('sha256').update(correctReceiptBytes).digest('hex'),
    subject_digest: correct.subject_digest,
    author: 'example-author',
    reviewer: 'example-author',
    author_context: 'example-session',
    reviewer_context: 'example-session',
    mode: 'self-review',
    verdict: 'accepted',
  };
  writeFileSync(join(root, 'self-review.json'), `${JSON.stringify(selfReview, null, 2)}\n`);
  const review = verifyEvidence(root, correct.receipt, 'self-review.json');
  assert.equal(review.healthy, false, 'Self-review must not be mistaken for independent review.');

  const summary = {
    format_version: 1,
    evaluation_kind: 'deterministic-acceptance-controls',
    healthy: true,
    root,
    checks: {
      correct_reference_accepted: correct.healthy,
      wrong_candidate_loads_normally: normalExit.healthy,
      semantic_boundary_defect_rejected: !wrong.healthy,
      changed_subject_invalidates_applicability: stale.applicability === 'stale',
      historical_result_preserved: stale.recorded_status === 'passed',
      unexecuted_declaration_rejected: !notRun.healthy,
      self_review_identified: review.review.independence === 'self_review',
    },
    evidence: {
      correct,
      normal_exit: normalExit,
      wrong,
      stale,
      not_run: notRun,
      self_review: review,
    },
    limitations: [
      'The example executes local acceptance code. It is not a model run or a comparative methodology benchmark.',
      'The not_run and review documents are explicit test declarations; they do not attest identities or approval.',
      'Successful check execution applies only to the listed subjects and unsigned local receipts.',
    ],
  };
  writeFileSync(join(root, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(
    `Evidence acceptance controls: ${Object.keys(summary.checks).length} passed. Results: ${root}`,
  );
} finally {
  unregister();
}
