// Independent literal case observations, not a second implementation of the threshold rule.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { caseLabel } from './labels.mjs';

export const cases = JSON.parse(readFileSync(new URL('./cases.json', import.meta.url), 'utf8'));

export function assertCase(candidate, item) {
  assert.equal(candidate(item.hours), item.expected, caseLabel(item.hours));
}
