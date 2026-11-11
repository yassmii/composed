import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { preflightOptions, runPreflight } from '../src/cli/preflight.ts';

const CLI = resolve(__dirname, '../bin/composed-kit.mjs');
let project: string;

beforeEach(() => {
  project = fs.mkdtempSync(join(tmpdir(), 'composed-preflight-test-'));
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(project, { recursive: true, force: true });
});

const run = (paths: string[]) =>
  runPreflight([`--cwd=${project}`, '--json', ...paths.flatMap((path) => ['--write-path', path])]);

describe('preflight local write probes', () => {
  it('exercises missing and existing paths and preserves original project bytes', async () => {
    fs.mkdirSync(join(project, 'src'));
    fs.writeFileSync(join(project, 'src/main.txt'), 'original\n');
    const result = await run(['src', '.agents/work/topic', '.']);
    expect(result.status).toBe('passed');
    expect(result.probes.every((probe) => probe.write_read === 'passed')).toBe(true);
    expect(result.probes.every((probe) => probe.cleanup === 'passed')).toBe(true);
    expect(fs.readdirSync(project)).toEqual(['src']);
    expect(fs.readdirSync(join(project, 'src'))).toEqual(['main.txt']);
    expect(fs.readFileSync(join(project, 'src/main.txt'), 'utf8')).toBe('original\n');
    expect(result.scope).toBe('local-write-probes');
    expect(result.runtime_readiness).toBe('not_assessed');
    expect(Object.values(result.session_capabilities)).toEqual(['unknown', 'unknown', 'unknown']);
  });

  it('validates all syntax before probing any earlier valid path', async () => {
    const mkdir = vi.spyOn(fs, 'mkdirSync');
    for (const unsafe of [
      '../outside',
      '/absolute',
      'C:/outside',
      'src\\nested',
      'a/../b',
      './src',
      '.git',
      'x/.GIT/objects',
      '.hg',
      '.svn',
      'nul.txt',
      'COM1',
      'LPT²',
      'src:stream',
      'src.',
      'src ',
      'src//x',
      'src/',
      'bad\0path',
      Array.from({ length: 33 }, () => 'deep').join('/'),
      'x'.repeat(4097),
    ]) {
      await expect(run(['new/dir', unsafe])).rejects.toThrow(/Unsafe/);
    }
    expect(mkdir).not.toHaveBeenCalled();
    expect(fs.readdirSync(project)).toEqual([]);
  });

  it('requires bounded explicit paths and rejects ambiguous or unknown options', () => {
    expect(() => preflightOptions([])).toThrow(/one and sixteen/);
    expect(() => preflightOptions(['--write-path'])).toThrow(/requires a value/);
    expect(() => preflightOptions(['--write-path=a', '--write-path=A'])).toThrow(/case-aliased/);
    expect(() => preflightOptions(['--cwd=a', '--cwd=b', '--write-path=src'])).toThrow(/only once/);
    expect(() => preflightOptions(['--json', '--json', '--write-path=src'])).toThrow(/only once/);
    expect(() => preflightOptions(['--json=true', '--write-path=src'])).toThrow(/Unknown/);
    expect(() => preflightOptions(['--force', '--write-path=src'])).toThrow(/Unknown/);
    expect(() =>
      preflightOptions(Array.from({ length: 17 }, (_, i) => `--write-path=p${i}`)),
    ).toThrow(/sixteen/);
  });

  it('reports a blocked non-directory ancestor without changing it', async () => {
    fs.writeFileSync(join(project, 'file'), 'keep');
    const result = await run(['file/nested']);
    expect(result.status).toBe('blocked');
    expect(result.probes[0]?.write_read).toBe('not_performed');
    expect(result.probes[0]?.findings[0]?.id).toBe('probe.write_read_failed');
    expect(fs.readFileSync(join(project, 'file'), 'utf8')).toBe('keep');
    expect(fs.readdirSync(project)).toEqual(['file']);
  });

  it('refuses case-aliased directories instead of creating a second spelling', async () => {
    fs.mkdirSync(join(project, 'Actual'));
    const result = await run(['actual/new']);
    expect(result.status).toBe('blocked');
    expect(fs.readdirSync(project)).toEqual(['Actual']);
    expect(fs.readdirSync(join(project, 'Actual'))).toEqual([]);
  });

  it('refuses linked paths without writing to their external destination', async () => {
    const outside = fs.mkdtempSync(join(tmpdir(), 'composed-preflight-outside-'));
    try {
      fs.symlinkSync(
        outside,
        join(project, 'linked'),
        process.platform === 'win32' ? 'junction' : 'dir',
      );
      const result = await run(['linked/new']);
      expect(result.status).toBe('blocked');
      expect(fs.readdirSync(outside)).toEqual([]);
      expect(fs.lstatSync(join(project, 'linked')).isSymbolicLink()).toBe(true);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  it('rejects absent, file and linked project roots before probing', async () => {
    await expect(
      runPreflight([`--cwd=${project}/absent`, '--write-path=x', '--json']),
    ).rejects.toThrow();
    fs.writeFileSync(join(project, 'file'), 'root');
    await expect(
      runPreflight([`--cwd=${project}/file`, '--write-path=x', '--json']),
    ).rejects.toThrow(/ordinary/);
    fs.mkdirSync(join(project, 'real'));
    fs.symlinkSync(
      join(project, 'real'),
      join(project, 'link'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    await expect(
      runPreflight([`--cwd=${project}/link`, '--write-path=x', '--json']),
    ).rejects.toThrow(/ordinary/);
    expect(fs.readdirSync(join(project, 'real'))).toEqual([]);
  });

  it('preserves concurrently added content and reports all incomplete directory cleanup', async () => {
    const removeDirectory = fs.rmdirSync.bind(fs);
    let injected = false;
    vi.spyOn(fs, 'rmdirSync').mockImplementation((path) => {
      if (!injected) {
        injected = true;
        fs.writeFileSync(join(String(path), 'other-owner.txt'), 'keep');
      }
      return removeDirectory(path);
    });
    const result = await run(['created/nested']);
    expect(result.status).toBe('blocked');
    expect(result.probes[0]?.write_read).toBe('passed');
    expect(result.probes[0]?.cleanup).toBe('failed');
    expect(result.probes[0]?.residual_paths).toEqual(['created/nested', 'created']);
    expect(fs.readFileSync(join(project, 'created/nested/other-owner.txt'), 'utf8')).toBe('keep');
    expect(fs.readdirSync(join(project, 'created/nested'))).toEqual(['other-owner.txt']);
  });

  it('reports an owned probe left by unlink failure instead of claiming cleanup', async () => {
    fs.mkdirSync(join(project, 'target'));
    vi.spyOn(fs, 'unlinkSync').mockImplementation(() => {
      throw Object.assign(new Error('denied cleanup'), { code: 'EACCES' });
    });
    const result = await run(['target']);
    expect(result.status).toBe('blocked');
    expect(result.probes[0]?.cleanup).toBe('failed');
    expect(result.probes[0]?.residual_paths).toHaveLength(1);
    expect(result.probes[0]?.findings[0]?.id).toBe('probe.cleanup_failed');
    expect(fs.readdirSync(join(project, 'target'))).toHaveLength(1);
  });

  it('records a created probe even if its ownership inspection fails', async () => {
    fs.mkdirSync(join(project, 'target'));
    vi.spyOn(fs, 'fstatSync').mockImplementationOnce(() => {
      throw Object.assign(new Error('failed ownership inspection'), { code: 'EIO' });
    });
    const result = await run(['target']);
    expect(result.status).toBe('blocked');
    expect(result.probes[0]?.cleanup).toBe('failed');
    expect(result.probes[0]?.residual_paths).toHaveLength(1);
    expect(fs.readdirSync(join(project, 'target'))).toHaveLength(1);
  });

  it('exposes JSON and nonzero CLI status for actual blocked paths', () => {
    fs.writeFileSync(join(project, 'blocked'), 'keep');
    const blocked = spawnSync(
      process.execPath,
      [CLI, 'preflight', '--json', `--cwd=${project}`, '--write-path=blocked/x'],
      { encoding: 'utf8' },
    );
    expect(blocked.status, blocked.stderr).toBe(1);
    expect(JSON.parse(blocked.stdout).status).toBe('blocked');
    const success = spawnSync(
      process.execPath,
      [CLI, 'preflight', '--json', `--cwd=${project}`, '--write-path=src'],
      { encoding: 'utf8' },
    );
    expect(success.status, success.stderr).toBe(0);
    expect(JSON.parse(success.stdout).runtime_readiness).toBe('not_assessed');
    expect(fs.readdirSync(project)).toEqual(['blocked']);
  });

  it.skipIf(process.platform === 'win32')(
    'observes actual denied writes under an unprivileged POSIX identity',
    () => {
      fs.chmodSync(project, 0o755);
      fs.mkdirSync(join(project, 'readonly'), { mode: 0o555 });
      const execution = spawnSync(
        process.execPath,
        [CLI, 'preflight', '--json', `--cwd=${project}`, '--write-path=readonly'],
        {
          encoding: 'utf8',
          ...(process.getuid?.() === 0 ? { uid: 65534, gid: 65534 } : {}),
        },
      );
      try {
        expect(execution.status, execution.stderr).toBe(1);
        const result = JSON.parse(execution.stdout);
        expect(result.probes[0].write_read).toBe('failed');
        expect(result.probes[0].findings[0].message).toMatch(/EACCES|EPERM/);
        expect(fs.readdirSync(join(project, 'readonly'))).toEqual([]);
      } finally {
        fs.chmodSync(join(project, 'readonly'), 0o755);
      }
    },
  );
});
