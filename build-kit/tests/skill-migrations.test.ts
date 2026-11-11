import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { runInit } from '../src/cli/init.ts';
import {
  SKILL_RENAMES,
  applyRetirementPlan,
  planLegacyBridges,
  planRenamedSkills,
} from '../src/cli/skill-migrations.ts';
import type { Skill } from '../src/cli/types.ts';
import { runUpdate } from '../src/cli/update.ts';
import { readVersion, writeVersion } from '../src/cli/version-tracker.ts';

const ROOT = resolve(__dirname, '..');
let project: string;

beforeEach(() => {
  project = mkdtempSync(join(tmpdir(), 'composed-skill-migration-'));
  mkdirSync(join(project, '.git'));
});

afterEach(() => rmSync(project, { recursive: true, force: true }));

function source(from: string, lang = 'fr'): string {
  return join(
    ROOT,
    from === 'sprint-cycle' ? 'skills/core/sprint-cycle' : `migrations/skills/${from}`,
    `SKILL.${lang}.md`,
  );
}

function legacyPath(from = 'technique', mirror = false): string {
  const rename = SKILL_RENAMES.find((entry) => entry.from === from);
  if (!rename) throw new Error(`Unknown migration ${from}`);
  return join(project, mirror ? '.cline/skills' : `skills/${rename.level}`, from, 'SKILL.md');
}

function addLegacy(from = 'technique', lang = 'fr', mirror = false): string {
  const path = legacyPath(from, mirror);
  mkdirSync(dirname(path), { recursive: true });
  cpSync(source(from, lang), path);
  return path;
}

async function install(lang = 'fr') {
  await runInit([
    '--yes',
    `--lang=${lang}`,
    '--agents=codex,cline',
    '--skills=core,support,extras',
    `--cwd=${project}`,
    `--kit-root=${ROOT}`,
  ]);
}

async function update(...flags: string[]) {
  await runUpdate(['--yes', ...flags, `--cwd=${project}`, `--kit-root=${ROOT}`]);
}

describe('renamed skill installation and migration', () => {
  it.each(['fr', 'en'])(
    'replaces legacy canonical and Cline copies after installing replacements (%s)',
    async (lang) => {
      await install(lang);
      // Simulate a 0.6.0 installation; distribution depends on levels, not old skill counts.
      const installed = readVersion(project);
      if (!installed) throw new Error('Missing installation');
      writeVersion(project, { ...installed, skills: { core: 8, support: 4, extras: 1 } });
      for (const rename of SKILL_RENAMES) {
        addLegacy(rename.from, lang);
        addLegacy(rename.from, lang, true);
        rmSync(join(project, 'skills', rename.level, rename.to), { recursive: true });
        rmSync(join(project, '.cline/skills', rename.to), { recursive: true });
      }

      await update('--force');
      for (const rename of SKILL_RENAMES) {
        expect(existsSync(dirname(legacyPath(rename.from)))).toBe(false);
        expect(existsSync(dirname(legacyPath(rename.from, true)))).toBe(false);
        const canonical = readFileSync(
          join(project, 'skills', rename.level, rename.to, 'SKILL.md'),
          'utf8',
        );
        expect(canonical).toContain(`name: ${rename.to}`);
        expect(readFileSync(join(project, '.cline/skills', rename.to, 'SKILL.md'), 'utf8')).toBe(
          canonical,
        );
      }
      const catalog = JSON.parse(readFileSync(join(project, 'skills/catalog.json'), 'utf8'));
      expect(catalog.skills).toHaveLength(19);
      expect(readVersion(project)?.skills).toEqual({ core: 8, support: 10, extras: 1 });
      await update();
      expect(JSON.parse(readFileSync(join(project, 'skills/catalog.json'), 'utf8'))).toEqual(
        catalog,
      );
      for (const bridge of ['AGENTS.md', '.clinerules/composed-build-kit.md']) {
        expect(readFileSync(join(project, bridge), 'utf8')).toContain('software-engineering');
      }
    },
  );

  it('recognises CRLF legacy copies when switching language', async () => {
    await install('fr');
    const path = addLegacy();
    writeFileSync(path, readFileSync(path, 'utf8').replace(/\r?\n/g, '\r\n'));
    await update('--lang=en');
    expect(existsSync(path)).toBe(false);
    expect(
      readFileSync(join(project, 'skills/core/software-engineering/SKILL.md'), 'utf8'),
    ).toContain('# Software engineering');
  });

  it('preserves a modified legacy canonical file and independently migrates its unchanged mirror', async () => {
    await install();
    const canonical = addLegacy();
    const custom = `${readFileSync(canonical, 'utf8')}\nProject-specific engineering policy.\n`;
    writeFileSync(canonical, custom);
    const mirror = addLegacy('technique', 'fr', true);
    await update();
    expect(readFileSync(canonical, 'utf8')).toBe(custom);
    expect(existsSync(mirror)).toBe(false);
    expect(existsSync(join(project, 'skills/core/software-engineering/SKILL.md'))).toBe(true);
  });

  it('preserves modified Cline copies and any extra legacy resources', async () => {
    await install();
    const canonical = addLegacy();
    const extra = join(dirname(canonical), 'project-rules.md');
    writeFileSync(extra, 'Local resource');
    const mirror = addLegacy('technique', 'fr', true);
    writeFileSync(mirror, 'Custom native Cline instructions');
    await update();
    expect(readFileSync(extra, 'utf8')).toBe('Local resource');
    expect(existsSync(canonical)).toBe(true);
    expect(readFileSync(mirror, 'utf8')).toBe('Custom native Cline instructions');
  });

  it('preserves unchanged legacy copies with --keep-local while installing new skills', async () => {
    await install();
    const canonical = addLegacy();
    const mirror = addLegacy('technique', 'fr', true);
    rmSync(join(project, 'skills/core/software-engineering'), { recursive: true });
    rmSync(join(project, '.cline/skills/software-engineering'), { recursive: true });
    await update('--keep-local');
    expect(existsSync(canonical)).toBe(true);
    expect(existsSync(mirror)).toBe(true);
    expect(existsSync(join(project, '.cline/skills/software-engineering/SKILL.md'))).toBe(true);
  });

  it('keeps legacy directories and installation state unchanged in dry-run mode', async () => {
    await install();
    const canonical = addLegacy();
    const version = readFileSync(join(project, '.agents/.composed-kit-version'), 'utf8');
    const bridge = readFileSync(join(project, 'AGENTS.md'), 'utf8');
    await update('--dry-run', '--lang=en');
    expect(existsSync(canonical)).toBe(true);
    expect(readFileSync(join(project, '.agents/.composed-kit-version'), 'utf8')).toBe(version);
    expect(readFileSync(join(project, 'AGENTS.md'), 'utf8')).toBe(bridge);
  });

  it('does not follow a legacy skill directory or file symlink', async () => {
    await install();
    const target = join(project, 'user-owned');
    mkdirSync(target);
    cpSync(source('technique'), join(target, 'SKILL.md'));
    symlinkSync(target, dirname(legacyPath()), 'dir');
    const filePath = legacyPath('test-generator');
    mkdirSync(dirname(filePath), { recursive: true });
    symlinkSync(source('test-generator'), filePath);
    await update();
    expect(readFileSync(join(target, 'SKILL.md'), 'utf8')).toBe(
      readFileSync(source('technique'), 'utf8'),
    );
    expect(existsSync(legacyPath())).toBe(true);
    expect(existsSync(filePath)).toBe(true);
  });
});

function selectedSkills(): Skill[] {
  return SKILL_RENAMES.map((rename) => ({
    name: rename.to,
    level: rename.level,
    description: 'Selected replacement',
    path: join(project, 'skills', rename.level, rename.to, 'SKILL.md'),
  }));
}

function planSkills(keepLocal = false, cline = false) {
  return planRenamedSkills(project, ROOT, selectedSkills(), { keepLocal, cline });
}

function installReplacement(from = 'technique') {
  const rename = SKILL_RENAMES.find((entry) => entry.from === from);
  if (!rename) throw new Error('Unknown replacement');
  const path = join(project, 'skills', rename.level, rename.to, 'SKILL.md');
  mkdirSync(dirname(path), { recursive: true });
  cpSync(join(ROOT, 'skills', rename.level, rename.to, 'SKILL.fr.md'), path);
  return path;
}

describe('read-only retirement plans', () => {
  it('previews absent replacements without changing files and applies that plan only after installation', () => {
    const legacy = addLegacy();
    const bytes = readFileSync(legacy);
    const first = planSkills();
    expect(first).toEqual(planSkills());
    expect(first).toHaveLength(1);
    expect(first[0]).toMatchObject({
      path: 'skills/core/technique/SKILL.md',
      replacement: 'skills/core/software-engineering/SKILL.md',
      action: 'remove',
      reason: 'recognized-historical-copy',
    });
    expect(readFileSync(legacy)).toEqual(bytes);
    expect(existsSync(join(project, 'skills/core/software-engineering/SKILL.md'))).toBe(false);
    expect(applyRetirementPlan(project, first)[0]).toMatchObject({ result: 'retained' });
    expect(readFileSync(legacy)).toEqual(bytes);
    installReplacement();
    expect(applyRetirementPlan(project, first)[0]).toMatchObject({ result: 'removed' });
    expect(existsSync(dirname(legacy))).toBe(false);
  });

  it('distinguishes CRLF copies, trailing whitespace and actual custom content', () => {
    const crlf = addLegacy('technique');
    writeFileSync(crlf, readFileSync(crlf, 'utf8').replace(/\r?\n/g, '\r\n'));
    const spaces = addLegacy('refactor');
    const spaced = readFileSync(spaces, 'utf8').replace(/\r?\n/g, '  \n');
    writeFileSync(spaces, spaced);
    const custom = addLegacy('test-generator');
    writeFileSync(custom, `${readFileSync(custom, 'utf8')}\nKeep project policy.\n`);
    const actions = planSkills();
    expect(actions.find((action) => action.path.includes('/technique/'))?.action).toBe('remove');
    expect(actions.find((action) => action.path.includes('/refactor/'))).toMatchObject({
      action: 'retain',
      reason: 'trailing-whitespace-only-review-required',
    });
    expect(actions.find((action) => action.path.includes('/test-generator/'))).toMatchObject({
      action: 'retain',
      reason: 'modified-legacy-content',
    });
    installReplacement('refactor');
    applyRetirementPlan(project, actions);
    expect(readFileSync(spaces, 'utf8')).toBe(spaced);
    expect(readFileSync(custom, 'utf8')).toContain('Keep project policy.');
  });

  it('preserves files or resources changed after the preview', () => {
    const legacy = addLegacy();
    installReplacement();
    const plan = planSkills();
    const custom = `${readFileSync(legacy, 'utf8')}\nNew local policy.\n`;
    writeFileSync(legacy, custom);
    expect(applyRetirementPlan(project, plan)[0]).toMatchObject({
      result: 'retained',
      reason: 'legacy-changed-after-plan',
    });
    expect(readFileSync(legacy, 'utf8')).toBe(custom);
    cpSync(source('technique'), legacy);
    const next = planSkills();
    const resource = join(dirname(legacy), 'local.md');
    writeFileSync(resource, 'Owned by project.');
    expect(applyRetirementPlan(project, next)[0]).toMatchObject({
      result: 'retained',
      reason: 'legacy-changed-after-plan',
    });
    expect(readFileSync(resource, 'utf8')).toBe('Owned by project.');
    expect(existsSync(legacy)).toBe(true);
  });

  it('does not follow linked legacy ancestors, including Windows junctions', () => {
    const outside = join(project, 'outside');
    mkdirSync(outside);
    const owned = join(outside, 'SKILL.md');
    cpSync(source('technique'), owned);
    mkdirSync(join(project, 'skills/core'), { recursive: true });
    const link = dirname(legacyPath());
    symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
    installReplacement();
    const actions = planSkills();
    expect(actions[0]).toMatchObject({
      action: 'retain',
      reason: 'unsafe-or-uninspectable-legacy-path',
    });
    expect(applyRetirementPlan(project, actions)[0]?.result).toBe('retained');
    expect(readFileSync(owned)).toEqual(readFileSync(source('technique')));
    expect(existsSync(link)).toBe(true);
  });

  it('reports case aliases and dangling links without retiring them', () => {
    mkdirSync(join(project, 'skills/core/Technique'), { recursive: true });
    cpSync(source('technique'), join(project, 'skills/core/Technique/SKILL.md'));
    const dangling = dirname(legacyPath('refactor'));
    symlinkSync(
      join(project, 'missing'),
      dangling,
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    const actions = planSkills();
    expect(actions).toHaveLength(2);
    expect(actions.every((action) => action.action === 'retain')).toBe(true);
    expect(actions.every((action) => action.reason === 'unsafe-or-uninspectable-legacy-path')).toBe(
      true,
    );
    expect(readFileSync(join(project, 'skills/core/Technique/SKILL.md'))).toEqual(
      readFileSync(source('technique')),
    );
  });

  it('preserves a legacy file if its installed replacement becomes a link', () => {
    const legacy = addLegacy();
    const replacement = installReplacement();
    const actions = planSkills();
    rmSync(dirname(replacement), { recursive: true });
    symlinkSync(
      dirname(legacy),
      dirname(replacement),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    expect(applyRetirementPlan(project, actions)[0]).toMatchObject({
      result: 'retained',
      reason: 'replacement-not-installed-or-unsafe',
    });
    expect(existsSync(legacy)).toBe(true);
  });

  it('shows canonical and native legacy actions independently and respects keep-local', () => {
    addLegacy();
    addLegacy('technique', 'fr', true);
    const actions = planSkills(true, true);
    expect(actions).toHaveLength(2);
    expect(actions.map((action) => action.path)).toEqual([
      'skills/core/technique/SKILL.md',
      '.cline/skills/technique/SKILL.md',
    ]);
    expect(actions.every((action) => action.reason === 'keep-local')).toBe(true);
  });
});

describe('legacy bridge retirement plans', () => {
  const legacy = '.cursor/rules/hunch-method.mdc';
  const replacement = '.cursor/rules/composed-build-kit.mdc';
  function writeBridge(path: string, text: string) {
    mkdirSync(dirname(join(project, path)), { recursive: true });
    writeFileSync(join(project, path), text);
  }

  it('previews and removes a byte-identical legacy bridge after its replacement is installed', () => {
    writeBridge(legacy, 'Generated instructions.\n');
    const files = [{ path: replacement, content: 'Generated instructions.\n' }] as const;
    const actions = planLegacyBridges(project, files, { keepLocal: false });
    expect(actions).toEqual(planLegacyBridges(project, files, { keepLocal: false }));
    expect(actions[0]).toMatchObject({ kind: 'bridge', action: 'remove', path: legacy });
    expect(existsSync(join(project, replacement))).toBe(false);
    expect(applyRetirementPlan(project, actions)[0]?.result).toBe('retained');
    writeBridge(replacement, files[0].content);
    expect(applyRetirementPlan(project, actions)[0]?.result).toBe('removed');
    expect(existsSync(join(project, legacy))).toBe(false);
    expect(readFileSync(join(project, replacement), 'utf8')).toBe(files[0].content);
  });

  it('keeps custom bridges and refuses a changed replacement after preview', () => {
    writeBridge(legacy, 'Custom instructions.\n');
    const files = [{ path: replacement, content: 'Current instructions.\n' }] as const;
    expect(planLegacyBridges(project, files, { keepLocal: false })[0]).toMatchObject({
      action: 'retain',
      reason: 'modified-legacy-content',
    });
    writeBridge(legacy, files[0].content);
    const actions = planLegacyBridges(project, files, { keepLocal: false });
    writeBridge(replacement, 'Changed after preview.\n');
    expect(applyRetirementPlan(project, actions)[0]).toMatchObject({
      result: 'retained',
      reason: 'replacement-changed-after-plan',
    });
    expect(readFileSync(join(project, legacy), 'utf8')).toBe(files[0].content);
  });

  it('compares retained replacement bytes without silently adopting generated content', () => {
    writeBridge(legacy, 'Owned instructions.\n');
    writeBridge(replacement, 'Owned instructions.\n');
    const actions = planLegacyBridges(
      project,
      [
        {
          path: replacement,
          content: 'Generated instructions.\n',
          retain: true,
        },
      ],
      { keepLocal: false },
    );
    expect(actions[0]?.action).toBe('remove');
    expect(applyRetirementPlan(project, actions)[0]?.result).toBe('removed');
    expect(readFileSync(join(project, replacement), 'utf8')).toBe('Owned instructions.\n');
  });
});
