import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '..');

function read(relativePath: string) {
  return readFileSync(join(ROOT, relativePath), 'utf8');
}

describe('host-stack neutrality', () => {
  it('keeps npm limited to the Build Kit and requires native project commands', () => {
    for (const lang of ['en', 'fr']) {
      const bridge = read(`bridges/AGENTS.md.${lang}.tpl`);
      const testGenerator = read(`skills/core/automated-testing/SKILL.${lang}.md`);

      expect(bridge).toContain('Cargo.toml');
      expect(bridge).toContain('Build Kit');
      expect(testGenerator).toContain('cargo test');
      expect(testGenerator).not.toContain('npm run test -- login.test.ts');
    }
  });
});
