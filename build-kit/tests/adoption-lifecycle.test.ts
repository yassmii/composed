import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  renameSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runInit } from '../src/cli/init.ts';
import { MANIFEST_PATH, digest, readManagedManifest } from '../src/cli/managed-files.ts';
import { runRepair } from '../src/cli/repair.ts';
import { runUninstall } from '../src/cli/uninstall.ts';
import { runUpdate } from '../src/cli/update.ts';
import { readVersion } from '../src/cli/version-tracker.ts';

const ROOT = resolve(__dirname, '..');
let project: string;
beforeEach(() => {
  project = mkdtempSync(join(tmpdir(), 'composed-adoption-'));
  mkdirSync(join(project, '.git'));
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  rmSync(project, { recursive: true, force: true });
});
const read = (path: string) => readFileSync(join(project, path), 'utf8');
function write(path: string, content: string) {
  mkdirSync(dirname(join(project, path)), { recursive: true });
  writeFileSync(join(project, path), content);
}
function snapshot(root = project): Record<string, string> {
  const files: Record<string, string> = {};
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) files[path] = `link:${readlinkSync(path)}`;
    else if (stat.isDirectory()) Object.assign(files, snapshot(path));
    else files[path] = digest(readFileSync(path));
  }
  return files;
}
const init = (extra: string[] = []) =>
  runInit([
    '--yes',
    ...(!extra.some((arg) => arg.startsWith('--agents')) ? ['--agents=codex,cline'] : []),
    '--skills=core,support',
    ...extra,
    `--cwd=${project}`,
    `--kit-root=${ROOT}`,
  ]);
const update = (extra: string[] = []) =>
  runUpdate(['--yes', ...extra, `--cwd=${project}`, `--kit-root=${ROOT}`]);

describe('safe adoption and managed lifecycle', () => {
  it('refuses force combined with keep-local without replacing manual instructions', async () => {
    write('AGENTS.md', 'User-owned instructions');
    const before = snapshot();
    await expect(init(['--force', '--keep-local'])).rejects.toThrow(/Choose/);
    expect(snapshot()).toEqual(before);
  });
  it('rejects a repair case alias before any missing-file write', async () => {
    await init();
    renameSync(join(project, 'AGENTS.md'), join(project, 'Agents.md'));
    unlinkSync(join(project, 'skills/catalog.json'));
    const before = snapshot();
    for (const mode of ['--dry-run', '--apply']) {
      const report = await runRepair([`--cwd=${project}`, `--kit-root=${ROOT}`, mode]);
      expect(report.applied).toEqual([]);
      expect(report.remaining.healthy).toBe(false);
      expect(
        report.remaining.findings.some((finding) => finding.id.startsWith('managed.unsafe:')),
      ).toBe(true);
      expect(snapshot()).toEqual(before);
    }
  });
  it.each([
    'AGENTS.md',
    'CLAUDE.md',
    'skills/core/cadrage/SKILL.md',
    '.cline/skills/cadrage/SKILL.md',
  ])('detects a late collision without any writes: %s', async (path) => {
    write(path, 'User-owned instructions');
    const before = snapshot();
    await expect(init(['--agents=codex,cline,claude-code'])).rejects.toThrow(/conflicts/);
    expect(snapshot()).toEqual(before);
  });

  it('backs up exact conflicting bytes before a forced adoption and leaves unrelated files intact', async () => {
    const custom = '# Project policy\nDo not replace my stack.\n';
    write('AGENTS.md', custom);
    write('README.md', 'My product');
    await init(['--force']);
    const backups = readdirSync(join(project, '.agents/backups'));
    expect(backups).toHaveLength(1);
    expect(read(`.agents/backups/${backups[0]}/AGENTS.md`)).toBe(custom);
    expect(read('README.md')).toBe('My product');
    expect(read('AGENTS.md')).toContain('Method Guide');
    expect(readManagedManifest(project)?.files['AGENTS.md']).toBe(digest(read('AGENTS.md')));
  });

  it('preserves changes across keep-local updates without claiming their bytes as owned', async () => {
    await init();
    const before = readManagedManifest(project);
    const custom = `${read('skills/core/cadrage/SKILL.md')}\nMy local rule.\n`;
    write('skills/core/cadrage/SKILL.md', custom);
    write('AGENTS.md', '# My local governance');
    write('.cline/skills/cadrage/SKILL.md', 'My native Cline adaptation');
    await update(['--keep-local']);
    await update(['--keep-local']);
    expect(readManagedManifest(project)?.files['skills/core/cadrage/SKILL.md']).toBe(
      before?.files['skills/core/cadrage/SKILL.md'],
    );
    const result = await runUninstall([`--cwd=${project}`, '--apply', '--json']);
    expect(result.healthy).toBe(true);
    expect(read('skills/core/cadrage/SKILL.md')).toBe(custom);
    expect(read('AGENTS.md')).toBe('# My local governance');
    expect(read('.cline/skills/cadrage/SKILL.md')).toBe('My native Cline adaptation');
    expect(readVersion(project)).toBeNull();
  });

  it.each(['fr', 'en'])(
    'runs install → update → repair → uninstall with preserved work and memory (%s)',
    async (lang) => {
      await init([`--lang=${lang}`]);
      write('.agents/memory/MEMORY.md', '# Private context');
      write('.agents/work/feature/validation.md', 'Real evidence');
      write('skills/core/cadrage/project-notes.md', 'Keep extra resource');
      await update();
      unlinkSync(join(project, 'skills/core/cadrage/SKILL.md'));
      await runRepair([`--cwd=${project}`, `--kit-root=${ROOT}`, '--apply', '--json']);
      expect(readManagedManifest(project)?.files['skills/core/cadrage/SKILL.md']).toBe(
        digest(read('skills/core/cadrage/SKILL.md')),
      );
      const before = snapshot();
      const preview = await runUninstall([`--cwd=${project}`, '--json']);
      expect(preview.dry_run).toBe(true);
      expect(snapshot()).toEqual(before);
      await runUninstall([`--cwd=${project}`, '--apply']);
      expect(read('.agents/memory/MEMORY.md')).toBe('# Private context');
      expect(read('.agents/work/feature/validation.md')).toBe('Real evidence');
      expect(read('skills/core/cadrage/project-notes.md')).toBe('Keep extra resource');
      expect(existsSync(join(project, 'AGENTS.md'))).toBe(false);
      expect(existsSync(join(project, MANIFEST_PATH))).toBe(false);
      expect((await runUninstall([`--cwd=${project}`, '--apply'])).removed).toEqual([]);
    },
  );

  it('does not enrol a previously unowned local skill on a keep-local legacy adoption', async () => {
    await init();
    unlinkSync(join(project, MANIFEST_PATH));
    const custom = `${read('skills/core/cadrage/SKILL.md')}\nUnowned project policy.\n`;
    write('skills/core/cadrage/SKILL.md', custom);
    // Force is a deliberate first adoption of legacy generated bridges/metadata, with backups.
    await expect(update()).rejects.toThrow(/conflicts/);
    await update(['--keep-local']);
    expect(readManagedManifest(project)?.files['skills/core/cadrage/SKILL.md']).toBeUndefined();
    expect(read('skills/core/cadrage/SKILL.md')).toBe(custom);
  });

  it('dry-run and an invalid flag leave the complete tree unchanged', async () => {
    const fresh = snapshot();
    await init(['--dry-run']);
    expect(snapshot()).toEqual(fresh);
    await init();
    const before = snapshot();
    await update(['--dry-run', '--lang=en']);
    expect(snapshot()).toEqual(before);
    await expect(update(['--kepp-local'])).rejects.toThrow(/Unknown option/);
    expect(snapshot()).toEqual(before);
  });

  it('refuses case aliases and link destinations even with force before writing', async () => {
    write('Agents.md', 'Case-variant policy');
    const before = snapshot();
    await expect(init(['--force'])).rejects.toThrow(/Case collision/);
    expect(snapshot()).toEqual(before);
    unlinkSync(join(project, 'Agents.md'));
    const outside = mkdtempSync(join(tmpdir(), 'composed-owner-'));
    try {
      symlinkSync(
        outside,
        join(project, 'skills'),
        process.platform === 'win32' ? 'junction' : 'dir',
      );
      await expect(init(['--force'])).rejects.toThrow(/symlink/);
      expect(readdirSync(outside)).toEqual([]);
      expect(existsSync(join(project, 'AGENTS.md'))).toBe(false);
    } finally {
      rmSync(join(project, 'skills'), { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  });

  it('rejects a manifest that attempts to take ownership of project data', async () => {
    await init();
    write('README.md', 'User data');
    const manifest = readManagedManifest(project);
    if (!manifest) throw new Error('Missing manifest');
    manifest.files['README.md'] = digest('User data');
    write(MANIFEST_PATH, JSON.stringify(manifest));
    const before = snapshot();
    await expect(runUninstall([`--cwd=${project}`, '--apply'])).rejects.toThrow(/manifest entry/);
    expect(snapshot()).toEqual(before);
  });

  it('retires both owned tracking records so uninstall cannot resurrect a legacy installation', async () => {
    await init();
    write('.agents/.hunch-kit-version', read('.agents/.composed-kit-version'));
    await update();
    await runUninstall([`--cwd=${project}`, '--apply']);
    expect(readVersion(project)).toBeNull();
    expect(existsSync(join(project, '.agents/.hunch-kit-version'))).toBe(false);
  });
});
