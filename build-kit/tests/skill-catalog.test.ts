import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { writeFilteredCatalog } from '../src/cli/skill-catalog.ts';

const ROOT = resolve(__dirname, '..');
let tmp: string;

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), 'hunch-catalog-'));
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe('writeFilteredCatalog', () => {
  it('keeps only contracts for installed levels', () => {
    const output = join(tmp, 'catalog.json');
    writeFilteredCatalog(join(ROOT, 'skills/catalog.json'), output, ['core', 'extras']);

    const catalog = JSON.parse(readFileSync(output, 'utf8'));
    expect(catalog.skills).toHaveLength(9);
    expect(catalog.skills.every((skill: { level: string }) => skill.level !== 'support')).toBe(
      true,
    );
    const source = JSON.parse(readFileSync(join(ROOT, 'skills/catalog.json'), 'utf8'));
    expect(catalog.model_assignment_policy).toEqual(source.model_assignment_policy);
    expect(catalog.execution_policy.minimum_native_delegations).toBe(1);
  });
});
