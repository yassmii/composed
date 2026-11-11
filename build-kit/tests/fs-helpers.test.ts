import { lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  claudeMemoryMirrorPath,
  copyDirRecursive,
  ensureSymlinkOrCopy,
  projectSlug,
} from '../src/cli/fs-helpers.ts';

let tmp: string;

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), 'hunch-fs-'));
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe('copyDirRecursive', () => {
  it('copies nested directory structure', () => {
    const src = join(tmp, 'src');
    const dest = join(tmp, 'dest');
    mkdirSync(join(src, 'sub'), { recursive: true });
    writeFileSync(join(src, 'a.md'), 'A');
    writeFileSync(join(src, 'sub', 'b.md'), 'B');

    copyDirRecursive(src, dest);

    expect(readFileSync(join(dest, 'a.md'), 'utf8')).toBe('A');
    expect(readFileSync(join(dest, 'sub', 'b.md'), 'utf8')).toBe('B');
  });
});

describe('ensureSymlinkOrCopy', () => {
  it('creates a symlink when target dir exists', () => {
    const target = join(tmp, 'target');
    const link = join(tmp, 'link');
    mkdirSync(target);
    writeFileSync(join(target, 'file.md'), 'content');

    const mode = ensureSymlinkOrCopy(target, link);

    expect(mode).toBe('symlink');
    expect(lstatSync(link).isSymbolicLink()).toBe(true);
    expect(readFileSync(join(link, 'file.md'), 'utf8')).toBe('content');
  });
});

describe('projectSlug', () => {
  it('converts absolute path to dash-separated slug', () => {
    expect(projectSlug('/home/alice/repos/hunch-build-kit')).toBe(
      '-home-alice-repos-hunch-build-kit',
    );
  });

  it('converts a Windows absolute path to a safe slug', () => {
    expect(projectSlug('C:\\Users\\alice\\repos\\test-build-kit')).toBe(
      'C--Users-alice-repos-test-build-kit',
    );
  });

  it('places a Windows project mirror beneath the Claude projects directory', () => {
    const mirror = claudeMemoryMirrorPath(
      'C:\\Users\\alice',
      'C:\\Users\\alice\\repos\\test-build-kit',
    );
    expect(mirror).toContain('C--Users-alice-repos-test-build-kit');
    expect(mirror).toContain('.claude');
  });
});
