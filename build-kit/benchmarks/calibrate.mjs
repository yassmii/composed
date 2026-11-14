import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tasks } from './corpus.mjs';
import { checkDefinitions } from './graders.mjs';

const cartCorrect = String.raw`export function calculateCart(items, options = {}) {
  const { discountBasisPoints = 0, shippingCents = 0, freeShippingThresholdCents = null } = options;
  const money = (value) => Number.isSafeInteger(value) && value >= 0;
  if (!Array.isArray(items) || !Number.isInteger(discountBasisPoints) || discountBasisPoints < 0 || discountBasisPoints > 10000 || !money(shippingCents) || (freeShippingThresholdCents !== null && !money(freeShippingThresholdCents))) throw new RangeError('Invalid cart');
  let subtotal = 0n;
  for (const item of items) {
    if (!item || !money(item.unitPriceCents) || !Number.isSafeInteger(item.quantity) || item.quantity < 1) throw new RangeError('Invalid item');
    subtotal += BigInt(item.unitPriceCents) * BigInt(item.quantity);
  }
  const max = BigInt(Number.MAX_SAFE_INTEGER);
  if (subtotal > max) throw new RangeError('Unsafe subtotal');
  const discount = (subtotal * BigInt(discountBasisPoints) + 5000n) / 10000n;
  const merchandise = subtotal - discount;
  const shipping = items.length === 0 || (freeShippingThresholdCents !== null && merchandise >= BigInt(freeShippingThresholdCents)) ? 0 : shippingCents;
  const total = merchandise + BigInt(shipping);
  if (total > max) throw new RangeError('Unsafe total');
  return { subtotalCents: Number(subtotal), discountCents: Number(discount), shippingCents: shipping, totalCents: Number(total) };
}
`;

const retryCorrect = String.raw`export async function withRetry(operation, options = {}) {
  const { maxAttempts = 3, retryCodes = ['ETIMEDOUT', 'ECONNRESET'], signal } = options;
  if (typeof operation !== 'function') throw new TypeError('operation must be a function');
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10) throw new RangeError('Invalid maxAttempts');
  if (!Array.isArray(retryCodes) || retryCodes.some((code) => typeof code !== 'string' || !code.length)) throw new TypeError('Invalid retryCodes');
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (signal?.aborted) throw signal.reason ?? Object.assign(new Error('Aborted'), { name: 'AbortError' });
    try {
      return await operation(attempt);
    } catch (error) {
      if (!retryCodes.includes(error?.code) || attempt === maxAttempts) throw error;
    }
  }
}
`;

const csvCorrect = String.raw`export function parseCsvRecord(record) {
  if (typeof record !== 'string') throw new TypeError('Expected a string');
  const fields = [];
  let field = '';
  let quoted = false;
  let closed = false;
  for (let index = 0; index < record.length; index++) {
    const character = record[index];
    if (character === '\r' || character === '\n') throw new SyntaxError('Only one physical record is allowed');
    if (quoted) {
      if (character === '"') {
        if (record[index + 1] === '"') {
          field += '"'; index++;
        } else {
          quoted = false; closed = true;
        }
      } else field += character;
    } else if (closed) {
      if (character !== ',') throw new SyntaxError('Content after closing quote');
      fields.push(field); field = ''; closed = false;
    } else if (character === ',') {
      fields.push(field); field = '';
    } else if (character === '"') {
      if (field.length) throw new SyntaxError('Misplaced quote');
      quoted = true;
    } else field += character;
  }
  if (quoted) throw new SyntaxError('Unmatched quote');
  fields.push(field);
  return fields;
}
`;

const reservationCorrect = String.raw`export function confirm(booking, now) {
  if (booking.state !== 'active') return { ...booking };
  return { ...booking, state: now >= booking.expiresAt ? 'expired' : 'confirmed' };
}
`;

const approvalCorrect = String.raw`export function approve(document, expectedRevision, role) {
  if (role !== 'reviewer') return { status: 'forbidden', document: { ...document } };
  if (expectedRevision !== document.revision) return { status: 'conflict', document: { ...document } };
  return { status: 'ok', document: { ...document, state: 'approved' } };
}
`;

const holdCorrect = String.raw`export function decide(hold, command, now) {
  const refuse = (status) => ({ status, hold: { ...hold } });
  if (command.type !== 'release' && command.actor !== 'owner') return refuse('forbidden');
  if (hold.state !== 'held') return refuse('closed');
  if (now >= hold.expiresAt) return { status: 'expired', hold: { ...hold, state: 'expired', revision: hold.revision + 1 } };
  if (command.expectedRevision !== hold.revision) return refuse('conflict');
  if (command.type === 'capture') {
    if (command.amount < 1 || command.amount > hold.amount) return refuse('invalid');
    return { status: 'ok', hold: { ...hold, state: 'captured', captured: command.amount, revision: hold.revision + 1 } };
  }
  if (command.type === 'extend') {
    if (command.until <= hold.expiresAt || command.until > hold.expiresAt + 3600) return refuse('invalid');
    return { status: 'ok', hold: { ...hold, expiresAt: command.until, revision: hold.revision + 1 } };
  }
  return { status: 'ok', hold: { ...hold, state: 'released', revision: hold.revision + 1 } };
}
`;
const holdConflict =
  "  if (command.expectedRevision !== hold.revision) return refuse('conflict');\n";
const holdExpiry =
  "  if (now >= hold.expiresAt) return { status: 'expired', hold: { ...hold, state: 'expired', revision: hold.revision + 1 } };\n";

const references = {
  'cart-totals': cartCorrect,
  'retry-operation': retryCorrect,
  'csv-record': csvCorrect,
  'reservation-expiry': reservationCorrect,
  'revision-approval': approvalCorrect,
  'hold-decision': holdCorrect,
};
const mutants = {
  'cart-totals': cartCorrect.replace(
    'merchandise >= BigInt(freeShippingThresholdCents)',
    'subtotal >= BigInt(freeShippingThresholdCents)',
  ),
  'retry-operation': retryCorrect.replace(
    '!retryCodes.includes(error?.code) || attempt === maxAttempts',
    'attempt === maxAttempts',
  ),
  'csv-record': csvCorrect.replace("field += '\"'; index++;", 'field += \'""\'; index++;'),
  'reservation-expiry': reservationCorrect.replace(
    "if (booking.state !== 'active') return { ...booking };",
    '',
  ),
  'revision-approval': approvalCorrect.replace(
    "if (role !== 'reviewer')",
    "if (role !== 'reviewer' && expectedRevision === document.revision)",
  ),
  // Checks the revision before the expiry: every rule is present, two are in the wrong order.
  'hold-decision': holdCorrect.replace(holdExpiry + holdConflict, holdConflict + holdExpiry),
};
for (const [id, mutant] of Object.entries(mutants))
  if (mutant === references[id]) throw new Error(`Mutant for ${id} equals its reference.`);

const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--output'))
  throw new Error('Usage: node calibrate.mjs [--output <new-json-file>]');
const output = args[1] ? resolve(args[1]) : null;
if (output && existsSync(output))
  throw new Error('Choose a new calibration filename; earlier results are preserved.');
const root = mkdtempSync(join(tmpdir(), 'composed-benchmark-calibration-'));
const grader = fileURLToPath(new URL('./grade.mjs', import.meta.url));
const results = [];
try {
  for (const task of tasks) {
    const controls = [];
    for (const variant of ['seed', 'reference', 'mutant']) {
      const candidate = join(root, task.id, variant);
      for (const [relative, content] of Object.entries(task.files)) {
        const target = join(candidate, relative);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, content);
      }
      if (variant !== 'seed')
        writeFileSync(
          join(candidate, task.sources[0]),
          variant === 'reference' ? references[task.id] : mutants[task.id],
        );
      const child = spawnSync(
        process.execPath,
        [grader, '--task', task.id, '--candidate', candidate],
        { encoding: 'utf8', timeout: 8000, maxBuffer: 1024 * 1024 },
      );
      if (child.error || child.status !== 0)
        throw new Error(
          `Grader failed for ${task.id}/${variant}: ${child.error?.message ?? child.stderr}`,
        );
      const observed = JSON.parse(child.stdout);
      const expected = variant === 'reference';
      const ids = checkDefinitions[task.id].map((check) => check.id);
      const complete =
        observed.task_id === task.id &&
        JSON.stringify(observed.checks.map((check) => check.id)) === JSON.stringify(ids);
      const allRegressionPass = observed.checks
        .filter((check) => check.kind === 'regression')
        .every((check) => check.passed);
      controls.push({
        variant,
        expected_passed: expected,
        observed_passed: observed.passed,
        control_passed: complete && allRegressionPass && observed.passed === expected,
        checks: observed.checks,
      });
    }
    results.push({ task_id: task.id, cohort: task.cohort, controls });
  }
  const summary = {
    format_version: 1,
    evaluation_kind: 'semantic-grader-calibration',
    passed: results.every((task) => task.controls.every((control) => control.control_passed)),
    tasks: results,
    limitations: [
      'Controls execute known code; they are not model trials or comparative kit results.',
      'The corpus is synthetic and does not establish real-project or cross-runtime representativeness.',
      'These checks cover declared behaviours rather than every possible implementation or malicious candidate.',
    ],
  };
  if (output) {
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, `${JSON.stringify(summary, null, 2)}\n`, { flag: 'wx' });
  }
  console.log(JSON.stringify(summary));
  if (!summary.passed) process.exitCode = 1;
} finally {
  rmSync(root, { recursive: true, force: true });
}
