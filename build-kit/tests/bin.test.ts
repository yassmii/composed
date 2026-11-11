import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const binPath = fileURLToPath(new URL('../bin/composed-kit.mjs', import.meta.url));

describe('package binary', () => {
  it('loads the TypeScript CLI through the tsx package runtime', () => {
    const result = spawnSync(process.execPath, [binPath, 'unknown-command'], {
      encoding: 'utf8',
    });

    expect(result.error).toBeUndefined();
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('Unknown command: unknown-command');
  });
});
