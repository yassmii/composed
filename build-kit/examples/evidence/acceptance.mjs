import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// ACC-EX-CANCEL-001 checks observable behaviour, independent of candidate implementation details.
const candidate = process.argv[2];
if (!candidate) throw new Error('Pass the candidate module path as an explicit argument.');
const { canCancel } = await import(pathToFileURL(resolve(candidate)).href);
for (const [hours, expected] of [
  [23, false],
  [24, true],
  [25, true],
  [-1, false],
  [Number.POSITIVE_INFINITY, false],
]) {
  assert.equal(canCancel(hours), expected, `Cancellation at ${hours} hours`);
}
console.log('ACC-EX-CANCEL-001 passed: boundary and invalid-input cases checked.');
