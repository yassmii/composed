import { test } from 'node:test';
import { assertCase, cases } from '../checker/assertions.mjs';
import { eligible } from '../src/access.mjs';

test('accepts a later request and rejects an earlier request', () => {
  for (const item of cases.ordinary) assertCase(eligible, item);
});
