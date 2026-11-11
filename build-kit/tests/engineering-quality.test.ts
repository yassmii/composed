import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const example = resolve(__dirname, '../examples/engineering-quality/verify.mjs');

describe('optional engineering-quality example boundaries', () => {
  it('preserves an existing output directory before attempting tool execution', () => {
    const directory = mkdtempSync(join(tmpdir(), 'composed-quality-existing-'));
    try {
      const sentinel = join(directory, 'retained-evidence.json');
      writeFileSync(sentinel, '{"history":"retain exactly"}\n');
      const before = readFileSync(sentinel);
      const result = spawnSync(
        process.execPath,
        [example, '--tools-root', directory, '--python', process.execPath, '--output', directory],
        { encoding: 'utf8' },
      );
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('Output already exists');
      expect(readFileSync(sentinel)).toEqual(before);
      expect(existsSync(join(directory, 'summary.json'))).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it('does not create passing evidence when a prepared interpreter is unavailable', () => {
    const directory = mkdtempSync(join(tmpdir(), 'composed-quality-missing-'));
    try {
      const output = join(directory, 'new-run');
      const result = spawnSync(
        process.execPath,
        [
          example,
          '--tools-root',
          directory,
          '--python',
          join(directory, 'missing-python'),
          '--output',
          output,
        ],
        { encoding: 'utf8' },
      );
      expect(result.status).toBe(1);
      expect(existsSync(output)).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
