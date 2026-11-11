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
];
