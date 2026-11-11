import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { projectSlug } from '../src/cli/fs-helpers.ts';
import { runInit } from '../src/cli/init.ts';
import { runUpdate } from '../src/cli/update.ts';

const FIXTURE = resolve(__dirname, 'fixtures/empty-project');
const KIT_ROOT = resolve(__dirname, '..');

let tmp: string;
let originalHome: string | undefined;

beforeEach(async () => {
  tmp = realpathSync(mkdtempSync(join(tmpdir(), 'hunch-update-')));
  originalHome = process.env.HOME;
  process.env.HOME = join(tmp, 'home');
  cpSync(FIXTURE, tmp, { recursive: true });
  mkdirSync(join(tmp, '.git'), { recursive: true });
  await runInit([
    '--yes',
    '--lang=fr',
    '--agents=claude-code',
    '--skills=core',
    `--cwd=${tmp}`,
    `--kit-root=${KIT_ROOT}`,
  ]);
});

afterEach(() => {
  if (originalHome === undefined) Reflect.deleteProperty(process.env, 'HOME');
  else process.env.HOME = originalHome;
  rmSync(tmp, { recursive: true, force: true });
});

describe('runUpdate', () => {
  it('preserves .agents/memory contents', async () => {
    const userMemPath = join(tmp, '.agents/memory/user_test.md');
    writeFileSync(
      userMemPath,
      '---\nname: user-test\ndescription: x\nmetadata:\n  type: user\n---\nMy custom memory',
    );

    await runUpdate(['--yes', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    expect(readFileSync(userMemPath, 'utf8')).toContain('My custom memory');
  });

  it('requires explicit backed-up replacement of a locally changed bridge', async () => {
    writeFileSync(join(tmp, 'AGENTS.md'), '# stale content');
    await expect(runUpdate(['--yes', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`])).rejects.toThrow(
      /conflicts/,
    );
    expect(readFileSync(join(tmp, 'AGENTS.md'), 'utf8')).toBe('# stale content');
    await runUpdate(['--yes', '--force', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    const content = readFileSync(join(tmp, 'AGENTS.md'), 'utf8');
    expect(content).not.toBe('# stale content');
    expect(content).toContain('Method Guide');
  });

  it('installs the routing contract and work-artifact convention on update', async () => {
    rmSync(join(tmp, 'skills/catalog.json'));
    rmSync(join(tmp, '.agents/work'), { recursive: true, force: true });

    await runUpdate(['--yes', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    expect(existsSync(join(tmp, 'skills/catalog.json'))).toBe(true);
    expect(existsSync(join(tmp, '.agents/work/README.md'))).toBe(true);
  });

  it('refreshes the work convention without replacing active work artifacts', async () => {
    const activeArtifact = join(tmp, '.agents/work/example/brief.md');
    mkdirSync(join(tmp, '.agents/work/example'), { recursive: true });
    writeFileSync(activeArtifact, 'Keep this work evidence');

    await runUpdate(['--yes', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    expect(readFileSync(activeArtifact, 'utf8')).toBe('Keep this work evidence');
    const workGuide = readFileSync(join(tmp, '.agents/work/README.md'), 'utf8');
    expect(workGuide).toContain('handoff.md');
    expect(workGuide).toContain('reviews/');
  });

  it('creates a missing Claude Code memory mirror only when explicitly requested', async () => {
    const config = join(tmp, 'claude-config');
    const previousConfig = process.env.CLAUDE_CONFIG_DIR;
    process.env.CLAUDE_CONFIG_DIR = config;
    const mirror = join(config, 'projects', projectSlug(tmp), 'memory');
    rmSync(mirror, { recursive: true, force: true });

    await runUpdate(['--yes', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    expect(existsSync(mirror)).toBe(false);
    try {
      await runUpdate(['--yes', '--claude-memory=link', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);
      expect(existsSync(mirror)).toBe(true);
    } finally {
      if (previousConfig === undefined) Reflect.deleteProperty(process.env, 'CLAUDE_CONFIG_DIR');
      else process.env.CLAUDE_CONFIG_DIR = previousConfig;
    }
  });

  it('refuses to run when no install is detected', async () => {
    rmSync(join(tmp, '.agents/.composed-kit-version'));
    await expect(runUpdate(['--yes', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`])).rejects.toThrow(
      /not installed/i,
    );
  });

  it('updates an installation tracked under the legacy Hunch filename', async () => {
    const current = join(tmp, '.agents/.composed-kit-version');
    const legacy = join(tmp, '.agents/.hunch-kit-version');
    renameSync(current, legacy);

    await runUpdate(['--yes', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    expect(existsSync(current)).toBe(true);
    expect(existsSync(legacy)).toBe(true);
  });

  it('adds a skill level via --skills without removing the installed ones', async () => {
    // Installed with core only
    expect(existsSync(join(tmp, 'skills/core'))).toBe(true);
    expect(existsSync(join(tmp, 'skills/support'))).toBe(false);

    await runUpdate(['--yes', '--skills=support', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    // Support added, core preserved (union, not replace)
    expect(existsSync(join(tmp, 'skills/support/codebase-onboarding/SKILL.md'))).toBe(true);
    expect(existsSync(join(tmp, 'skills/core/product-manager/SKILL.md'))).toBe(true);

    // Version file reflects both levels
    const versionFile = readFileSync(join(tmp, '.agents/.composed-kit-version'), 'utf8');
    expect(versionFile).toMatch(/^ {2}core: 8$/m);
    expect(versionFile).toMatch(/^ {2}support: 10$/m);

    const catalog = JSON.parse(readFileSync(join(tmp, 'skills/catalog.json'), 'utf8')) as {
      skills: { level: string }[];
    };
    expect(catalog.skills.some((skill) => skill.level === 'support')).toBe(true);
  });

  it('switches lang when --lang differs from installed', async () => {
    // Initially installed as FR
    let agents = readFileSync(join(tmp, 'AGENTS.md'), 'utf8');
    expect(agents).toContain('Persona attendu');

    await runUpdate(['--yes', '--lang=en', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    agents = readFileSync(join(tmp, 'AGENTS.md'), 'utf8');
    expect(agents).toContain('Expected persona');
    expect(agents).not.toContain('Persona attendu');

    // Version file updated
    const versionFile = readFileSync(join(tmp, '.agents/.composed-kit-version'), 'utf8');
    expect(versionFile).toMatch(/^lang: en$/m);
  });

  it('refreshes the Cline mirror and honours --keep-local', async () => {
    await runInit([
      '--yes',
      '--force',
      '--lang=fr',
      '--agents=cline',
      '--skills=core',
      `--cwd=${tmp}`,
      `--kit-root=${KIT_ROOT}`,
    ]);
    const mirroredSkill = join(tmp, '.cline/skills/product-manager/SKILL.md');
    writeFileSync(mirroredSkill, 'local Cline skill');

    await runUpdate(['--yes', '--keep-local', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    expect(readFileSync(mirroredSkill, 'utf8')).toBe('local Cline skill');
    expect(existsSync(join(tmp, '.clinerules/composed-build-kit.md'))).toBe(true);
  });

  it('migrates the legacy Cline bridge filename on update', async () => {
    await runInit([
      '--yes',
      '--force',
      '--lang=fr',
      '--agents=cline',
      '--skills=core',
      `--cwd=${tmp}`,
      `--kit-root=${KIT_ROOT}`,
    ]);
    const current = join(tmp, '.clinerules/composed-build-kit.md');
    const legacy = join(tmp, '.clinerules/hunch-build-kit.md');
    renameSync(current, legacy);

    await runUpdate(['--yes', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    expect(existsSync(current)).toBe(true);
    expect(existsSync(legacy)).toBe(false);
  });

  it('migrates an unchanged legacy sprint-cycle skill to delivery-orchestrator', async () => {
    const legacyDir = join(tmp, 'skills/core/sprint-cycle');
    mkdirSync(legacyDir, { recursive: true });
    cpSync(join(KIT_ROOT, 'skills/core/sprint-cycle/SKILL.fr.md'), join(legacyDir, 'SKILL.md'));

    await runUpdate(['--yes', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    expect(existsSync(legacyDir)).toBe(false);
    expect(existsSync(join(tmp, 'skills/core/delivery-orchestrator/SKILL.md'))).toBe(true);
  });

  it('preserves a locally modified legacy sprint-cycle skill', async () => {
    const legacyDir = join(tmp, 'skills/core/sprint-cycle');
    mkdirSync(legacyDir, { recursive: true });
    writeFileSync(join(legacyDir, 'SKILL.md'), 'locally modified legacy skill');

    await runUpdate(['--yes', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    expect(readFileSync(join(legacyDir, 'SKILL.md'), 'utf8')).toBe('locally modified legacy skill');
    expect(existsSync(join(tmp, 'skills/core/delivery-orchestrator/SKILL.md'))).toBe(true);
  });

  it('honours --keep-local while still installing new skills', async () => {
    const localSkill = join(tmp, 'skills/core/product-manager/SKILL.md');
    const localContent = `${readFileSync(localSkill, 'utf8')}\n## Project-owned guidance\nPreserve this local adaptation byte-for-byte.\n`;
    writeFileSync(localSkill, localContent);
    rmSync(join(tmp, 'skills/core/delivery-orchestrator'), { recursive: true });
    expect(existsSync(join(tmp, 'skills/core/delivery-orchestrator/SKILL.md'))).toBe(false);

    await runUpdate(['--yes', '--keep-local', `--cwd=${tmp}`, `--kit-root=${KIT_ROOT}`]);

    expect(readFileSync(localSkill, 'utf8')).toBe(localContent);
    expect(existsSync(join(tmp, 'skills/core/delivery-orchestrator/SKILL.md'))).toBe(true);
  });
});
