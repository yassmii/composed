import { test } from 'node:test';
import { assertCase, cases } from '../checker/assertions.mjs';
import { eligible } from '../src/access.mjs';

test('accepts the exact boundary, accepts later and rejects earlier', () => {
  assertCase(eligible, cases.boundary);
  for (const item of cases.ordinary) assertCase(eligible, item);
});
