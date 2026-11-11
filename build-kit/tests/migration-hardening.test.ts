import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { claudeProjectSlug } from '../src/cli/claude-memory.ts';
import { runDoctor } from '../src/cli/doctor.ts';
import { parseFlags } from '../src/cli/flags.ts';
import { runInit } from '../src/cli/init.ts';
import {
  MANIFEST_PATH,
  PROJECT_INSTRUCTIONS_PATH,
  applyPreparedFilePlan,
  prepareFilePlan,
  readManagedManifest,
} from '../src/cli/managed-files.ts';
import { runRepair } from '../src/cli/repair.ts';
import { runSource } from '../src/cli/source.ts';
import { runUninstall } from '../src/cli/uninstall.ts';
import { runUpdate } from '../src/cli/update.ts';

const KIT = resolve(__dirname, '..');
let area: string;
let project: string;
beforeEach(() => {
  area = mkdtempSync(join(tmpdir(), 'composed-migration-'));
  project = join(area, 'project');
  mkdirSync(join(project, '.git'), { recursive: true });
  vi.stubEnv('CLAUDE_CONFIG_DIR', join(area, 'claude-config'));
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  rmSync(area, { recursive: true, force: true });
});
function write(path: string, content: string) {
  mkdirSync(dirname(join(project, path)), { recursive: true });
  writeFileSync(join(project, path), content);
}
const read = (path: string) => readFileSync(join(project, path), 'utf8');
const args = (kit = KIT) => ['--yes', `--cwd=${project}`, `--kit-root=${kit}`];
const install = (extra: string[] = [], kit = KIT) =>
  runInit([...args(kit), '--agents=codex,claude-code', '--skills=core,support', ...extra]);

describe('migration planning and project extension', () => {
  it('prints one JSON object and never creates user configuration by default', async () => {
    const report = await install(['--json']);
    expect(report.status).toBe('applied');
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(vi.mocked(console.log).mock.calls[0]?.[0]))).toEqual(report);
    expect(report.external_actions[0]?.action).toBe('none');
    expect(existsSync(join(area, 'claude-config'))).toBe(false);
    expect(read('AGENTS.md').indexOf(PROJECT_INSTRUCTIONS_PATH)).toBeLessThan(150);
    expect(readManagedManifest(project)?.extensions?.project_instructions).toBe(
      PROJECT_INSTRUCTIONS_PATH,
    );
  });

  it('keeps explicit project instructions across language updates and uninstall without owning them', async () => {
    const custom = 'Read docs/PROJECT-RULES.md first.\r\nPreserve ADR 0005.\r\n';
    write(PROJECT_INSTRUCTIONS_PATH, custom);
    await install();
    expect(read(PROJECT_INSTRUCTIONS_PATH)).toBe(custom);
    expect(readManagedManifest(project)?.files[PROJECT_INSTRUCTIONS_PATH]).toBeUndefined();
    await runUpdate([...args(), '--lang=en']);
    const doctor = await runDoctor([
      `--cwd=${project}`,
      `--kit-root=${KIT}`,
      '--agent=codex',
      '--json',
    ]);
    expect(doctor.findings.some((f) => f.id === 'managed.modified:AGENTS.md')).toBe(false);
    expect(read(PROJECT_INSTRUCTIONS_PATH)).toBe(custom);
    await runUninstall([`--cwd=${project}`, '--apply', '--json']);
    expect(read(PROJECT_INSTRUCTIONS_PATH)).toBe(custom);
  });

  it('does not adopt an unmarked existing preamble as an extension', async () => {
    await install();
    write('AGENTS.md', `# Mandatory local rules\n${read('AGENTS.md')}`);
    const report = await runUpdate([...args(), '--dry-run', '--json']);
    expect(report.healthy).toBe(false);
    expect(report.conflicts).toContain('AGENTS.md');
    expect(existsSync(join(project, PROJECT_INSTRUCTIONS_PATH))).toBe(false);
    expect(read('AGENTS.md')).toMatch(/^# Mandatory local rules/);
  });

  it('exposes a stable complete legacy plan before force, including retirements and preserved trailing spaces', async () => {
    await install();
    unlinkSync(join(project, MANIFEST_PATH));
    write('AGENTS.md', '# Local preamble\nOld generated bridge.\n');
    write(
      'skills/core/technique/SKILL.md',
      readFileSync(join(KIT, 'migrations/skills/technique/SKILL.fr.md'), 'utf8'),
    );
    const reference = readFileSync(
      join(KIT, 'migrations/skills/refactor/SKILL.fr.md'),
      'utf8',
    ).replace(/\r\n/g, '\n');
    write('skills/core/refactor/SKILL.md', reference.replace(/\n/g, ' \n'));
    const before = read('AGENTS.md');
    const first = await runUpdate([...args(), '--dry-run', '--json']);
    const second = await runUpdate([...args(), '--dry-run', '--json']);
    expect(first).toEqual(second);
    expect(first.status).toBe('blocked');
    expect(first.writes).toEqual(expect.arrayContaining(['AGENTS.md', MANIFEST_PATH]));
    expect(first.conflicts).toContain('AGENTS.md');
    expect(first.retirements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'skills/core/technique/SKILL.md', action: 'remove' }),
        expect.objectContaining({
          path: 'skills/core/refactor/SKILL.md',
          action: 'retain',
          reason: 'trailing-whitespace-only-review-required',
        }),
      ]),
    );
    expect(first.applied.written).toEqual([]);
    expect(existsSync(join(project, '.agents/backups'))).toBe(false);
    expect(existsSync(join(project, MANIFEST_PATH))).toBe(false);
    expect(read('AGENTS.md')).toBe(before);
    const force = await runUpdate([...args(), '--dry-run', '--json', '--force']);
    expect(force.backups.paths).toContain('AGENTS.md');
    expect(force.status).toBe('planned');
    expect(force.notes.join('\n')).toContain('.git/info/exclude');
    expect(existsSync(join(project, '.gitignore'))).toBe(false);
  });

  it('backs up a legacy bridge exactly after explicitly transferring its rules, then updates without repeat conflicts', async () => {
    await install();
    unlinkSync(join(project, MANIFEST_PATH));
    const local = '# Read docs/PROJECT-RULES.md first.\r\n';
    write('AGENTS.md', `${local}# Old bridge\r\n`);
    const original = read('AGENTS.md');
    write(PROJECT_INSTRUCTIONS_PATH, local);
    const applied = await runUpdate([...args(), '--force', '--json']);
    expect(applied.healthy).toBe(true);
    expect(read(`${applied.backups.directory}/AGENTS.md`)).toBe(original);
    expect(read(PROJECT_INSTRUCTIONS_PATH)).toBe(local);
    expect(read('AGENTS.md')).toContain(PROJECT_INSTRUCTIONS_PATH);
    const again = await runUpdate([...args(), '--dry-run', '--json']);
    expect(again.conflicts).toEqual([]);
    expect(again.writes).toEqual([]);
    expect(readdirSync(join(project, '.agents/backups'))).toHaveLength(1);
  });

  it('preserves outdated/custom seed guides and MEMORY.md, reporting only guide differences', async () => {
    await install();
    write('.agents/memory/_README.md', '# Old guide\n');
    write('.agents/work/README.md', '# Project guide\n');
    write('.agents/memory/MEMORY.md', '# Private pointer\n');
    const preview = await runUpdate([...args(), '--dry-run', '--json']);
    expect(preview.retained).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '.agents/work/README.md',
          reason: expect.stringContaining('current seed'),
        }),
      ]),
    );
    await runUpdate([...args(), '--force']);
    expect(read('.agents/memory/_README.md')).toBe('# Old guide\n');
    expect(read('.agents/work/README.md')).toBe('# Project guide\n');
    expect(read('.agents/memory/MEMORY.md')).toBe('# Private pointer\n');
    const doctor = await runDoctor([`--cwd=${project}`, `--kit-root=${KIT}`, '--json']);
    expect(
      doctor.findings
        .filter((f) => f.id.startsWith('seed.review:'))
        .map((f) => f.path)
        .sort(),
    ).toEqual(['.agents/memory/_README.md', '.agents/work/README.md']);
  });

  it('reports same-version source drift and refuses missing-file repair until update', async () => {
    const clonedKit = join(area, 'kit');
    cpSync(KIT, clonedKit, { recursive: true, filter: (path) => !path.includes('node_modules') });
    await install([], clonedKit);
    writeFileSync(
      join(clonedKit, 'bridges/AGENTS.md.fr.tpl'),
      `${readFileSync(join(clonedKit, 'bridges/AGENTS.md.fr.tpl'), 'utf8')}\nNew source rule.\n`,
    );
    unlinkSync(join(project, 'AGENTS.md'));
    const repair = await runRepair([
      `--cwd=${project}`,
      `--kit-root=${clonedKit}`,
      '--apply',
      '--json',
    ]);
    expect(
      repair.remaining.findings.some((f) => f.id.startsWith('installation.source-drift:')),
    ).toBe(true);
    expect(repair.applied).toEqual([]);
    await runUpdate([...args(clonedKit), '--json']);
    expect(read('AGENTS.md')).toContain('New source rule.');
    const source = await runSource([`--kit-root=${clonedKit}`, '--json']);
    expect(readManagedManifest(project)?.source?.content_sha256).toBe(source.content_sha256);
    expect(source.git.worktree).toBe('unknown');
  });

  it('rechecks all planned files before the first backup or write', () => {
    write('AGENTS.md', '# Original');
    write('CLAUDE.md', '# Original Claude');
    const plan = prepareFilePlan(
      project,
      [
        { path: 'AGENTS.md', content: '# New' },
        { path: 'CLAUDE.md', content: '# New Claude' },
      ],
      { force: true, keepLocal: false },
    );
    write('CLAUDE.md', '# Concurrent edit');
    expect(() => applyPreparedFilePlan(project, plan, { force: true })).toThrow(
      /changed after preflight/,
    );
    expect(read('AGENTS.md')).toBe('# Original');
    expect(existsSync(join(project, '.agents/backups'))).toBe(false);
  });

  it('refuses mixed CLI/source roots before writes and prevents doctor repair from them', async () => {
    const clone = join(area, 'mixed-kit');
    cpSync(KIT, clone, { recursive: true, filter: (path) => !path.includes('node_modules') });
    await install([], clone);
    writeFileSync(
      join(clone, 'src/cli/__main__.ts'),
      `${readFileSync(join(clone, 'src/cli/__main__.ts'), 'utf8')}\n// Different executable source\n`,
    );
    unlinkSync(join(project, 'AGENTS.md'));
    const report = await runRepair([
      `--cwd=${project}`,
      `--kit-root=${clone}`,
      '--apply',
      '--json',
    ]);
    expect(report.applied).toEqual([]);
    expect(
      report.remaining.findings.some(
        (f) =>
          f.id.startsWith('kit.source-unreadable:') &&
          f.message.includes('differ from the executing CLI'),
      ),
    ).toBe(true);
    await expect(runUpdate([...args(clone), '--force'])).rejects.toThrow(
      /differ from the executing CLI/,
    );
    expect(existsSync(join(project, 'AGENTS.md'))).toBe(false);
    expect(existsSync(join(project, '.agents/backups'))).toBe(false);
    const source = await runSource([`--kit-root=${clone}`, '--json']);
    expect(source.scope).toBe('build-kit-delivery-source');
  });

  it('refuses a different source package version even when its CLI files match', async () => {
    const clone = join(area, 'other-version');
    cpSync(KIT, clone, { recursive: true, filter: (path) => !path.includes('node_modules') });
    const pkg = JSON.parse(readFileSync(join(clone, 'package.json'), 'utf8'));
    writeFileSync(join(clone, 'package.json'), JSON.stringify({ ...pkg, version: '0.7.1' }));
    await expect(install([], clone)).rejects.toThrow(/source version differs/);
    expect(existsSync(join(project, 'AGENTS.md'))).toBe(false);
  });

  it('validates mirror options and rejects implicit registration of Claude', async () => {
    expect(parseFlags(['--json', '--claude-memory=link']).claudeMemory).toBe('link');
    expect(parseFlags([]).claudeMemory).toBe('none');
    expect(() => parseFlags(['--claude-memory=copy'])).toThrow(/none or link/);
    expect(() => parseFlags(['--json', '--json'])).toThrow(/only once/);
    await expect(runInit([...args(), '--agents=codex', '--claude-memory=link'])).rejects.toThrow(
      /requires Claude/,
    );
    expect(existsSync(join(project, 'AGENTS.md'))).toBe(false);
  });

  it('refuses a requested existing user mirror before any project adoption or backup', async () => {
    const slug = claudeProjectSlug(project);
    const copy = join(area, 'claude-config', 'projects', slug, 'memory');
    mkdirSync(copy, { recursive: true });
    writeFileSync(join(copy, 'private.md'), 'Preserve user instructions');
    const preview = await install(['--dry-run', '--json', '--claude-memory=link']);
    expect(preview.healthy).toBe(false);
    const applied = await install(['--json', '--claude-memory=link', '--force']);
    expect(applied.status).toBe('blocked');
    expect(existsSync(join(project, 'AGENTS.md'))).toBe(false);
    expect(existsSync(join(project, '.agents'))).toBe(false);
    expect(readFileSync(join(copy, 'private.md'), 'utf8')).toBe('Preserve user instructions');
  });
});
