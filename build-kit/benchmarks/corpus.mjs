const cartPrompt = `Fix calculateCart in this existing Node.js ESM project and add meaningful tests. Keep the existing public API and native test command; no dependency or stack change is needed. This is a bounded local correction. Keep production code self-contained in the existing source module; add tests under test/.

Each item has integer unitPriceCents >= 0 and integer quantity >= 1. All supplied integer values must be safe integers. Options are discountBasisPoints (integer 0..10000, default 0), shippingCents (integer >= 0, default 0), and freeShippingThresholdCents (integer >= 0 or null, default null).
Return { subtotalCents, discountCents, shippingCents, totalCents }. Sum line prices first, then round the single order-wide discount to the nearest cent, with halves rounded up. Free shipping applies when the post-discount merchandise amount is greater than or equal to the threshold. Empty carts have zero shipping. Do not mutate the input. Reject invalid values or monetary totals beyond Number.MAX_SAFE_INTEGER with RangeError. Preserve existing valid no-discount behaviour. Run the documented tests and report the actual result.`;

const retryPrompt = `Fix withRetry in this existing Node.js ESM project and add meaningful tests. Keep the existing exported function and native test command; no dependency or stack change is needed. This is a bounded local correction. Keep production code self-contained in the existing source module; add tests under test/.

withRetry(operation, options) returns the first successful result unchanged. Pass one-based attempt numbers to operation. maxAttempts is an integer 1..10, defaults to 3, and counts the initial call. retryCodes defaults to ['ETIMEDOUT', 'ECONNRESET']; retry only errors whose code is in that list. Exhaustion and non-retryable errors must reject with the exact original error object. Validate maxAttempts before calling operation (RangeError); operation must be a function and retryCodes an array of nonempty strings (TypeError).
An optional AbortSignal is checked before the first call and before every retry: once aborted, make no further call and reject with signal.reason (or an AbortError if no reason exists). A successful operation still returns its result. No delays or network calls are needed. Preserve existing successful behaviour. Run the documented tests and report the actual result.`;

const csvPrompt = `Fix parseCsvRecord in this existing Node.js ESM project and add meaningful tests. Keep the existing public API and native test command; no dependency or stack change is needed. This is a bounded local correction. Keep production code self-contained in the existing source module; add tests under test/.

The function accepts exactly one physical CSV record string, with commas as delimiters. Return strings, preserving whitespace and empty fields, including a trailing empty field. Empty input is one empty field. A field may be quoted only from its first character; quoted commas are data and doubled double-quotes inside a quoted field decode to one quote. After a closing quote, only a comma or end of input is valid. Reject unmatched quotes, quotes inside an unquoted field, characters after a closing quote, and any CR or LF, even inside quotes, with SyntaxError. Non-string input raises TypeError. Do not carry state between calls. Preserve existing plain-record behaviour. Run the documented tests and report the actual result.`;

const commonPackage = `${JSON.stringify({ private: true, type: 'module', scripts: { test: 'node --test' }, engines: { node: '>=20' } }, null, 2)}\n`;

const cartSeed = String.raw`export function calculateCart(items, options = {}) {
  const { discountBasisPoints = 0, shippingCents = 0, freeShippingThresholdCents = null } = options;
  const subtotalCents = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
  const discountCents = items.reduce((sum, item) => sum + Math.round(item.unitPriceCents * discountBasisPoints / 10000) * item.quantity, 0);
  const shipping = items.length === 0 || (freeShippingThresholdCents !== null && subtotalCents > freeShippingThresholdCents) ? 0 : shippingCents;
  return { subtotalCents, discountCents, shippingCents: shipping, totalCents: subtotalCents - discountCents + shipping };
}
`;

const retrySeed = String.raw`export async function withRetry(operation, options = {}) {
  const { maxAttempts = 3 } = options;
  let lastError;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
    }
  }
  if (maxAttempts === 1) throw lastError;
}
`;

const csvSeed = String.raw`export function parseCsvRecord(record) {
  return record.split(',');
}
`;

// Synthetic experimental rules for the contract-confirmation cohort. They are not a Composed
// product contract and change none.
const commonContract = `# Common contract slice v0.1.0

Promise: a decision applies to an explicit current state and never authorises a stale one.
Boundary: a deterministic in-memory transition. No network, storage, real identity or interface.

| Clause | Observable behaviour |
| --- | --- |
| REQ-CMP-001 | An active reservation can be confirmed only before its expiry. At the exact expiry it is expired. A terminal state stays terminal. |
| INV-CMP-001 | Evaluating a reservation changes neither the input nor its metadata. |
| ACC-CMP-001 | Before, at and after expiry, observe confirmed, expired and expired. Reservations already confirmed, cancelled or expired are returned unchanged. |
| REQ-CMP-002 | An approval is granted only if the expected revision equals the current revision and the actor is a reviewer. Otherwise return conflict or forbidden; a role refusal takes priority. |
| INV-CMP-002 | A refusal keeps the state. Approving an already approved document at the same revision is idempotent. The input is never modified. |
| ACC-CMP-002 | Observe a valid approval, a stale-revision refusal, a role refusal, a repeated approval and the absence of mutation. |
| REQ-CMP-003 | A command on a payment hold is decided by the first rule that applies, in this order. (1) Capture and extend are for the owner only, otherwise forbidden; release is open to the owner and the operator. (2) A hold whose state is not held is closed. (3) At or after its expiry, a held hold becomes expired. (4) A command whose expected revision differs from the current revision is a conflict. (5) A capture amount outside 1 to the hold amount, or an extension that does not move the expiry later by 1 to 3600, is invalid. (6) Otherwise the command succeeds: capture sets the state captured and the captured amount, extend sets the new expiry, release sets the state released. |
| INV-CMP-003 | Forbidden, closed, conflict and invalid return the hold unchanged. Expired and ok increase the revision by exactly one and change nothing else beyond what their rule states. The input and its metadata are never modified. |
| ACC-CMP-003 | Observe each rule on its own and the priority between successive rules, including the exact expiry and both ends of each range. |

Valid inputs only: safe integer times; reservation states active, confirmed, cancelled or expired;
positive safe integer revisions; document states draft or approved; roles editor or reviewer;
hold states held, released, captured or expired with a positive safe integer amount; command types
capture, release or extend; actors owner or operator; safe integer capture amounts and expiry times.
Invalid inputs are out of scope. Results are new values. No real authentication is exercised.
`;

const reservationPrompt =
  'Fix confirm(booking, now) in src/main.mjs so that it satisfies REQ-CMP-001, INV-CMP-001 and ACC-CMP-001 in CONTRACT.md, and add meaningful tests. booking has a state (active, confirmed, cancelled or expired), an expiresAt time and possibly other metadata. Keep the existing public API and native test command; no dependency or stack change is needed. This is a bounded local correction. Keep production code self-contained in the existing source module; add tests under test/. Run the documented tests and report the actual result.';

const approvalPrompt =
  'Fix approve(document, expectedRevision, role) in src/main.mjs so that it satisfies REQ-CMP-002, INV-CMP-002 and ACC-CMP-002 in CONTRACT.md, and add meaningful tests. document has a revision, a state (draft or approved) and possibly other metadata. The function returns { status, document } with status ok, conflict or forbidden. Keep the existing public API and native test command; no dependency or stack change is needed. This is a bounded local correction. Keep production code self-contained in the existing source module; add tests under test/. Run the documented tests and report the actual result.';

const holdPrompt =
  'Fix decide(hold, command, now) in src/main.mjs so that it satisfies REQ-CMP-003, INV-CMP-003 and ACC-CMP-003 in CONTRACT.md, and add meaningful tests. hold has a state, an amount, a captured amount, an expiresAt time, a revision and possibly other metadata. command has a type, an actor, an expectedRevision, and an amount for capture or an until time for extend. The function returns { status, hold } with status ok, forbidden, closed, expired, conflict or invalid. Keep the existing public API and native test command; no dependency or stack change is needed. This is a bounded local correction. Keep production code self-contained in the existing source module; add tests under test/. Run the documented tests and report the actual result.';

const holdSeed = String.raw`export function decide(hold, command, now) {
  if (hold.state !== 'held') return { status: 'closed', hold: { ...hold } };
  if (command.expectedRevision !== hold.revision) return { status: 'conflict', hold: { ...hold } };
  if (now > hold.expiresAt) return { status: 'expired', hold: { ...hold, state: 'expired' } };
  if (command.type === 'capture') {
    return { status: 'ok', hold: { ...hold, state: 'captured', captured: command.amount, revision: hold.revision + 1 } };
  }
  if (command.type === 'extend') {
    return { status: 'ok', hold: { ...hold, expiresAt: command.until, revision: hold.revision + 1 } };
  }
  return { status: 'ok', hold: { ...hold, state: 'released', revision: hold.revision + 1 } };
}
`;

const reservationSeed = String.raw`export function confirm(booking, now) {
  if (booking.state !== 'active') return { ...booking };
  return { ...booking, state: now > booking.expiresAt ? 'expired' : 'confirmed' };
}
`;

const approvalSeed = String.raw`export function approve(document, expectedRevision, role) {
  if (role !== 'reviewer') return { status: 'forbidden', document: { ...document } };
  return { status: 'ok', document: { ...document, state: 'approved' } };
}
`;

function files(title, prompt, sourcePath, source, publicTests) {
  return {
    'README.md': `# ${title}\n\nExisting stack: Node.js >=20, ESM, built-in node:test. No dependencies.\n\nRun \`npm test\` from the project root.\n\n## Requested correction\n\n${prompt}\n`,
    'package.json': commonPackage,
    [sourcePath]: source,
    'test/public.test.mjs': publicTests,
  };
}

export const tasks = [
  {
    id: 'cart-totals',
    title: 'Cart discount and shipping arithmetic',
    cohort: 'development',
    prompt: cartPrompt,
    sources: ['src/cart.mjs'],
    files: files(
      'Cart totals',
      cartPrompt,
      'src/cart.mjs',
      cartSeed,
      String.raw`import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCart } from '../src/cart.mjs';

test('retains ordinary integer totals', () => {
  assert.deepEqual(calculateCart([{ unitPriceCents: 250, quantity: 2 }]), {
    subtotalCents: 500, discountCents: 0, shippingCents: 0, totalCents: 500,
  });
});
test('retains ordinary shipping without a threshold', () => {
  assert.deepEqual(calculateCart([{ unitPriceCents: 100, quantity: 1 }], { shippingCents: 25 }), {
    subtotalCents: 100, discountCents: 0, shippingCents: 25, totalCents: 125,
  });
});
`,
    ),
  },
  {
    id: 'retry-operation',
    title: 'Retry policy, attempt limits and cancellation',
    cohort: 'confirmation',
    prompt: retryPrompt,
    sources: ['src/retry.mjs'],
    files: files(
      'Retry operation',
      retryPrompt,
      'src/retry.mjs',
      retrySeed,
      String.raw`import assert from 'node:assert/strict';
import test from 'node:test';
import { withRetry } from '../src/retry.mjs';

test('returns a successful result unchanged', async () => {
  const result = { ok: true };
  assert.equal(await withRetry(async () => result), result);
});
test('recovers from a transient timeout', async () => {
  let calls = 0;
  assert.equal(await withRetry(async () => {
    if (++calls === 1) throw Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' });
    return 42;
  }), 42);
  assert.equal(calls, 2);
});
`,
    ),
  },
  {
    id: 'csv-record',
    title: 'Strict CSV record parsing',
    cohort: 'confirmation',
    prompt: csvPrompt,
    sources: ['src/csv.mjs'],
    files: files(
      'CSV record parser',
      csvPrompt,
      'src/csv.mjs',
      csvSeed,
      String.raw`import assert from 'node:assert/strict';
import test from 'node:test';
import { parseCsvRecord } from '../src/csv.mjs';

test('retains plain fields', () => {
  assert.deepEqual(parseCsvRecord('alpha,beta'), ['alpha', 'beta']);
});
test('retains empty fields', () => {
  assert.deepEqual(parseCsvRecord('alpha,,gamma,'), ['alpha', '', 'gamma', '']);
});
`,
    ),
  },
  {
    id: 'reservation-expiry',
    title: 'Reservation confirmation at its expiry',
    cohort: 'contract-confirmation',
    prompt: reservationPrompt,
    sources: ['src/main.mjs'],
    files: {
      ...files(
        'Reservation expiry',
        reservationPrompt,
        'src/main.mjs',
        reservationSeed,
        String.raw`import assert from 'node:assert/strict';
import test from 'node:test';
import { confirm } from '../src/main.mjs';

test('confirms an active reservation before its expiry', () => {
  assert.deepEqual(confirm({ state: 'active', expiresAt: 10 }, 9), { state: 'confirmed', expiresAt: 10 });
});
`,
      ),
      'CONTRACT.md': commonContract,
    },
  },
  {
    id: 'revision-approval',
    title: 'Approval of the current revision',
    cohort: 'contract-confirmation',
    prompt: approvalPrompt,
    sources: ['src/main.mjs'],
    files: {
      ...files(
        'Revision approval',
        approvalPrompt,
        'src/main.mjs',
        approvalSeed,
        String.raw`import assert from 'node:assert/strict';
import test from 'node:test';
import { approve } from '../src/main.mjs';

test('approves the current revision for a reviewer', () => {
  assert.deepEqual(approve({ revision: 2, state: 'draft' }, 2, 'reviewer'), {
    status: 'ok',
    document: { revision: 2, state: 'approved' },
  });
});
`,
      ),
      'CONTRACT.md': commonContract,
    },
  },
  {
    id: 'hold-decision',
    title: 'Ordered decision rules for a payment hold',
    cohort: 'contract-confirmation',
    prompt: holdPrompt,
    sources: ['src/main.mjs'],
    files: {
      ...files(
        'Hold decision',
        holdPrompt,
        'src/main.mjs',
        holdSeed,
        String.raw`import assert from 'node:assert/strict';
import test from 'node:test';
import { decide } from '../src/main.mjs';

const held = { state: 'held', amount: 500, captured: 0, expiresAt: 100, revision: 3 };

test('the owner captures the full amount before expiry', () => {
  assert.deepEqual(decide(held, { type: 'capture', actor: 'owner', expectedRevision: 3, amount: 500 }, 50), {
    status: 'ok',
    hold: { ...held, state: 'captured', captured: 500, revision: 4 },
  });
});
test('the operator releases a current hold', () => {
  assert.deepEqual(decide(held, { type: 'release', actor: 'operator', expectedRevision: 3 }, 50), {
    status: 'ok',
    hold: { ...held, state: 'released', revision: 4 },
  });
});
`,
      ),
      'CONTRACT.md': commonContract,
    },
  },
];
