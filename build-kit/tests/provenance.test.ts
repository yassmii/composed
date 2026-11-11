import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  collectSourceProvenance,
  isSourceProvenance,
  validateSourceProvenance,
} from '../src/cli/provenance.ts';

let tmp: string;
let kit: string;
function write(path: string, content: string | Buffer) {
  const target = join(tmp, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}
function git(...args: string[]) {
  return execFileSync(
    'git',
    [
      '-c',
      'core.fsmonitor=false',
      '-c',
      'user.name=Provenance Test',
      '-c',
      'user.email=test@example.invalid',
      '-C',
      tmp,
      ...args,
    ],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  ).trim();
}
let gitAvailable = false;
try {
  execFileSync('git', ['--version'], { stdio: 'ignore' });
  gitAvailable = true;
} catch {
  /* Archive inspection also works without Git. */
}
function initGit() {
  git('init');
  git('add', '.');
  git('-c', 'commit.gpgsign=false', 'commit', '-m', 'Fixture');
}

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), 'composed-source-'));
  kit = join(tmp, 'build-kit');
  write('build-kit/package.json', '{"name":"composed-build-kit","version":"0.7.0"}\n');
  write('build-kit/skills/catalog.json', '{"version":"3.2.0","skills":[]}\n');
  write('build-kit/src/cli/__main__.ts', "console.log('fixture');\n");
  write('build-kit/bin/composed-kit.mjs', '// Fixture wrapper\n');
  write('build-kit/bridges/AGENTS.md.fr.tpl', '# Bridge\n');
  write('build-kit/migrations/skills/old/SKILL.fr.md', '# Old\n');
  write('build-kit/memory/MEMORY.md', '# Memory\n');
  write('build-kit/memory/_README.md', '# Notes guide\n');
  write('build-kit/work/README.md', '# Work guide\n');
});
afterEach(() => {
  vi.unstubAllEnvs();
  rmSync(tmp, { recursive: true, force: true });
});

describe('source provenance', () => {
  it('identifies an archive without inventing a Git revision or installed dependency attestation', () => {
    const p = collectSourceProvenance(kit);
    expect(p.kit_version).toBe('0.7.0');
    expect(p.catalog_version).toBe('3.2.0');
    expect(p.git).toEqual({ revision: null, worktree: 'unknown' });
    expect(p.dependency_lock).toBe('not_available');
    expect(p.dependencies).toBe('not_verified');
    expect(isSourceProvenance(p)).toBe(true);
    expect(collectSourceProvenance(kit)).toEqual(p);
    expect(Object.keys(p.files).every((key) => key.startsWith('kit/'))).toBe(true);
  });

  it('detects source changes even when package and CLI versions do not change', () => {
    const p = collectSourceProvenance(kit);
    write('build-kit/bridges/AGENTS.md.fr.tpl', '# Updated bridge\n');
    const updated = collectSourceProvenance(kit);
    expect(updated.kit_version).toBe(p.kit_version);
    expect(updated.content_sha256).not.toBe(p.content_sha256);
    expect(updated.files['kit/bridges/AGENTS.md.fr.tpl']).not.toBe(
      p.files['kit/bridges/AGENTS.md.fr.tpl'],
    );
  });

  it('normalizes only CRLF, preserving trailing spaces and terminal newlines', () => {
    const p = collectSourceProvenance(kit);
    write('build-kit/bridges/AGENTS.md.fr.tpl', '# Bridge\r\n');
    expect(collectSourceProvenance(kit).content_sha256).toBe(p.content_sha256);
    write('build-kit/bridges/AGENTS.md.fr.tpl', '# Bridge  \r\n');
    expect(collectSourceProvenance(kit).content_sha256).not.toBe(p.content_sha256);
    write('build-kit/bridges/AGENTS.md.fr.tpl', '# Bridge');
    expect(collectSourceProvenance(kit).content_sha256).not.toBe(p.content_sha256);
  });

  it('includes an adjacent recognized workspace manifest and lock, never installed node_modules', () => {
    write('package.json', '{"workspaces":["build-kit"]}\n');
    write('package-lock.json', '{"lockfileVersion":3,"packages":{}}\n');
    const p = collectSourceProvenance(kit);
    expect(p.dependency_lock).toBe('included');
    expect(p.files['workspace/package-lock.json']).toMatch(/^[a-f0-9]{64}$/);
    write('package-lock.json', '{"lockfileVersion":3,"packages":{"new":{}}}\n');
    expect(collectSourceProvenance(kit).content_sha256).not.toBe(p.content_sha256);
    const updated = collectSourceProvenance(kit);
    write('build-kit/node_modules/runtime/index.js', '// Different installed dependency\n');
    write('build-kit/tests/unrelated.test.ts', '// Test\n');
    write('.agents/work/evidence.md', '# Evidence\n');
    write('README.md', '# Root docs\n');
    expect(collectSourceProvenance(kit).content_sha256).toBe(updated.content_sha256);
  });

  it('does not mistake an unrelated parent package/lock for this kit workspace', () => {
    write('package.json', '{"name":"unrelated"}\n');
    write('package-lock.json', '{"lockfileVersion":3}\n');
    expect(collectSourceProvenance(kit).dependency_lock).toBe('not_available');
  });

  it('rejects linked source ancestors and files without reading their target contents', () => {
    const outside = join(tmp, 'outside');
    mkdirSync(outside);
    write('outside/__main__.ts', '// Outside\n');
    rmSync(join(kit, 'src'), { recursive: true });
    symlinkSync(outside, join(kit, 'src'), process.platform === 'win32' ? 'junction' : 'dir');
    expect(() => collectSourceProvenance(kit)).toThrow(/linked ancestors/);
    rmSync(join(kit, 'src'), { recursive: true });
    write('build-kit/src/cli/__main__.ts', '// Restored\n');
    const link = join(kit, 'bridges/linked');
    symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
    expect(() => collectSourceProvenance(kit)).toThrow(/linked paths/);
  });

  it('bounds bytes and rejects non-text source rather than claiming a partial identity', () => {
    write('build-kit/bin/large.mjs', Buffer.alloc(2 * 1024 * 1024 + 1, 65));
    expect(() => collectSourceProvenance(kit)).toThrow(/byte limit/);
    rmSync(join(kit, 'bin/large.mjs'));
    write('build-kit/bin/binary.mjs', Buffer.from([0xff, 0xfe]));
    expect(() => collectSourceProvenance(kit)).toThrow();
  });

  it('validates untrusted provenance fields, maps, paths and aggregate before enrollment', () => {
    const p = collectSourceProvenance(kit);
    for (const bad of [
      null,
      [],
      {},
      { ...p, format_version: 2 },
      { ...p, git: { revision: null, worktree: 'clean' } },
      { ...p, files: [] },
      { ...p, files: { '../outside': 'a'.repeat(64) } },
      { ...p, content_sha256: '0'.repeat(64) },
      { ...p, dependency_lock: 'included' },
    ]) {
      expect(isSourceProvenance(bad)).toBe(false);
      expect(() => validateSourceProvenance(bad)).toThrow(/provenance/i);
    }
    const reconstructed = JSON.parse(JSON.stringify(p));
    expect(isSourceProvenance(reconstructed)).toBe(true);
    expect(p.files['kit/package.json']).toBe(
      createHash('sha256')
        .update(readFileSync(join(kit, 'package.json')))
        .digest('hex'),
    );
  });

  it.skipIf(!gitAvailable)(
    'observes source-scoped Git dirt without counting unrelated docs/evidence',
    () => {
      write('package.json', '{"workspaces":["build-kit"]}\n');
      write('package-lock.json', '{"lockfileVersion":3}\n');
      initGit();
      const p = collectSourceProvenance(kit);
      expect(p.git).toEqual({
        revision: git('rev-parse', 'HEAD'),
        worktree: 'clean',
      });
      write('.agents/work/observed.md', '# Evidence\n');
      write('README.md', '# Unrelated\n');
      write('build-kit/tests/unrelated.test.ts', '// Test\n');
      expect(collectSourceProvenance(kit)).toEqual(p);
      write('build-kit/src/cli/new.ts', '// New source\n');
      expect(collectSourceProvenance(kit).git.worktree).toBe('modified');
      rmSync(join(kit, 'src/cli/new.ts'));
      write('package-lock.json', '{"lockfileVersion":3,"changed":true}\n');
      expect(collectSourceProvenance(kit).git.worktree).toBe('modified');
    },
  );

  it.skipIf(!gitAvailable)(
    'does not claim the enclosing consumer revision for an untracked archive',
    () => {
      write('README.md', '# Consumer\n');
      git('init');
      git('add', 'README.md');
      git('-c', 'commit.gpgsign=false', 'commit', '-m', 'Consumer');
      expect(collectSourceProvenance(kit).git).toEqual({
        revision: null,
        worktree: 'unknown',
      });
    },
  );

  it('keeps the fingerprint available when Git cannot be invoked', () => {
    vi.stubEnv('PATH', join(tmp, 'no-executables'));
    expect(collectSourceProvenance(kit).git).toEqual({
      revision: null,
      worktree: 'unknown',
    });
    expect(isSourceProvenance(collectSourceProvenance(kit))).toBe(true);
  });
});
