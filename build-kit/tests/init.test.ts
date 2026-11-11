import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { runInit } from '../src/cli/init.ts';

const FIXTURE_PROJECT = resolve(__dirname, 'fixtures/empty-project');
const KIT_ROOT = resolve(__dirname, '..');

let tmpProject: string;
let originalHome: string | undefined;

beforeEach(() => {
  tmpProject = mkdtempSync(join(tmpdir(), 'hunch-init-'));
  originalHome = process.env.HOME;
  process.env.HOME = join(tmpProject, 'home');
  cpSync(FIXTURE_PROJECT, tmpProject, { recursive: true });
  // Mark the tmp project as a git repo (init only checks for .git existence).
  mkdirSync(join(tmpProject, '.git'), { recursive: true });
});

afterEach(() => {
  if (originalHome === undefined) Reflect.deleteProperty(process.env, 'HOME');
  else process.env.HOME = originalHome;
  rmSync(tmpProject, { recursive: true, force: true });
});

describe('runInit (non-interactive)', () => {
  it('creates AGENTS.md, CLAUDE.md, skills/, .agents/memory/, version file (FR)', async () => {
    await runInit([
      '--yes',
      '--lang=fr',
      '--agents=claude-code',
      '--skills=core',
      `--cwd=${tmpProject}`,
      `--kit-root=${KIT_ROOT}`,
    ]);

    expect(existsSync(join(tmpProject, 'AGENTS.md'))).toBe(true);
    expect(existsSync(join(tmpProject, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(tmpProject, 'skills/core/cadrage/SKILL.md'))).toBe(true);
    expect(existsSync(join(tmpProject, 'skills/core/delivery-orchestrator/SKILL.md'))).toBe(true);
    expect(existsSync(join(tmpProject, 'skills/core/sprint-cycle/SKILL.md'))).toBe(false);
    expect(existsSync(join(tmpProject, 'skills/catalog.json'))).toBe(true);
    expect(existsSync(join(tmpProject, '.agents/memory/MEMORY.md'))).toBe(true);
    expect(existsSync(join(tmpProject, '.agents/work/README.md'))).toBe(true);
    const workGuide = readFileSync(join(tmpProject, '.agents/work/README.md'), 'utf8');
    expect(workGuide).toContain('handoff.md');
    expect(workGuide).toContain('reviews/');
    expect(existsSync(join(tmpProject, '.agents/.composed-kit-version'))).toBe(true);

    const catalog = JSON.parse(readFileSync(join(tmpProject, 'skills/catalog.json'), 'utf8')) as {
      skills: { level: string }[];
    };
    expect(catalog.skills).toHaveLength(8);
    expect(catalog.skills.every((skill) => skill.level === 'core')).toBe(true);
  });

  it('substitutes PROJECT_NAME into generated AGENTS.md (FR)', async () => {
    await runInit([
      '--yes',
      '--lang=fr',
      '--agents=claude-code',
      '--skills=core',
      `--cwd=${tmpProject}`,
      `--kit-root=${KIT_ROOT}`,
    ]);

    const content = readFileSync(join(tmpProject, 'AGENTS.md'), 'utf8');
    expect(content).toContain('Method Guide');
    expect(content).not.toContain('{{PROJECT_NAME}}');
    expect(content).not.toContain('{{SKILLS_INDEX}}');
    // FR content: "Persona attendu" should be present
    expect(content).toContain('Persona attendu');
  });

  it('produces English AGENTS.md when --lang=en', async () => {
    await runInit([
      '--yes',
      '--lang=en',
      '--agents=claude-code',
      '--skills=core',
      `--cwd=${tmpProject}`,
      `--kit-root=${KIT_ROOT}`,
    ]);

    const agents = readFileSync(join(tmpProject, 'AGENTS.md'), 'utf8');
    expect(agents).toContain('Expected persona');
    expect(agents).not.toContain('Persona attendu');

    // Skills are also in EN: cadrage SKILL.md should match what was in SKILL.en.md (English boundary block + body)
    const cadrage = readFileSync(join(tmpProject, 'skills/core/cadrage/SKILL.md'), 'utf8');
    expect(cadrage).toBe(
      readFileSync(join(KIT_ROOT, 'skills/core/cadrage/SKILL.en.md'), 'utf8').replace(
        /\r\n/g,
        '\n',
      ),
    );
  });

  it('only installs requested skill levels', async () => {
    await runInit([
      '--yes',
      '--lang=fr',
      '--agents=claude-code',
      '--skills=core',
      `--cwd=${tmpProject}`,
      `--kit-root=${KIT_ROOT}`,
    ]);

    expect(existsSync(join(tmpProject, 'skills/core'))).toBe(true);
    expect(existsSync(join(tmpProject, 'skills/support'))).toBe(false);
    expect(existsSync(join(tmpProject, 'skills/extras'))).toBe(false);
  });

  it('only generates bridges for requested agents', async () => {
    await runInit([
      '--yes',
      '--lang=fr',
      '--agents=claude-code,codex',
      '--skills=core',
      `--cwd=${tmpProject}`,
      `--kit-root=${KIT_ROOT}`,
    ]);

    expect(existsSync(join(tmpProject, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(tmpProject, 'AGENTS.md'))).toBe(true);
    expect(existsSync(join(tmpProject, 'GEMINI.md'))).toBe(false);
    expect(existsSync(join(tmpProject, '.cursor/rules/composed-build-kit.mdc'))).toBe(false);
  });

  it('installs the Cline bridge and its native skill mirror', async () => {
    await runInit([
      '--yes',
      '--lang=fr',
      '--agents=cline',
      '--skills=core',
      `--cwd=${tmpProject}`,
      `--kit-root=${KIT_ROOT}`,
    ]);

    expect(existsSync(join(tmpProject, '.clinerules/composed-build-kit.md'))).toBe(true);
    expect(existsSync(join(tmpProject, '.cline/skills/cadrage/SKILL.md'))).toBe(true);
    expect(readFileSync(join(tmpProject, '.clinerules/composed-build-kit.md'), 'utf8')).toContain(
      'use_subagents',
    );
  });

  it('writes lang in the version file', async () => {
    await runInit([
      '--yes',
      '--lang=en',
      '--agents=claude-code',
      '--skills=core',
      `--cwd=${tmpProject}`,
      `--kit-root=${KIT_ROOT}`,
    ]);

    const version = readFileSync(join(tmpProject, '.agents/.composed-kit-version'), 'utf8');
    expect(version).toMatch(/^lang: en$/m);
  });

  it('SKILL.md in project does not contain language suffix', async () => {
    await runInit([
      '--yes',
      '--lang=fr',
      '--agents=claude-code',
      '--skills=core',
      `--cwd=${tmpProject}`,
      `--kit-root=${KIT_ROOT}`,
    ]);

    // No SKILL.fr.md or SKILL.en.md should leak to the project
    expect(existsSync(join(tmpProject, 'skills/core/cadrage/SKILL.fr.md'))).toBe(false);
    expect(existsSync(join(tmpProject, 'skills/core/cadrage/SKILL.en.md'))).toBe(false);
    expect(existsSync(join(tmpProject, 'skills/core/cadrage/SKILL.md'))).toBe(true);
  });
});
