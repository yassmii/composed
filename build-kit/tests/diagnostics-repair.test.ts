import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { diagnosticOptions } from '../src/cli/diagnostics.ts';
import { runDoctor } from '../src/cli/doctor.ts';
import { runInit } from '../src/cli/init.ts';
import { runRepair } from '../src/cli/repair.ts';
import { KIT_VERSION } from '../src/cli/types.ts';

const kit = resolve(__dirname, '..');
let project: string;
let taskHome: string | undefined;

beforeEach(() => {
  project = mkdtempSync(join(tmpdir(), 'composed-diagnostic-'));
  mkdirSync(join(project, '.git'));
  taskHome = process.env.HOME;
  process.env.HOME = join(project, 'test-home');
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  if (taskHome === undefined) Reflect.deleteProperty(process.env, 'HOME');
  else process.env.HOME = taskHome;
  vi.restoreAllMocks();
  rmSync(project, { recursive: true, force: true });
});

const options = (agent = 'codex') => [
  `--cwd=${project}`,
  `--kit-root=${kit}`,
  `--agent=${agent}`,
  '--json',
];
const read = (path: string) => readFileSync(join(project, path), 'utf8');
async function install(agents = 'codex') {
  await runInit([
    '--yes',
    '--lang=fr',
    `--agents=${agents}`,
    '--skills=core',
    `--cwd=${project}`,
    `--kit-root=${kit}`,
  ]);
}

describe('agent diagnostics and bounded repair', () => {
  it('diagnoses a manifest-less manual setup without inventing an installation', async () => {
    const instructions = '# Project rules\nLe Build Kit est une méthode de livraison éventuelle.\n';
    writeFileSync(join(project, 'AGENTS.md'), instructions);
    writeFileSync(
      join(project, 'IMPLEMENTATION-PROMPT.md'),
      'Choisir langage, framework et accès aux données avec une ADR.\n',
    );
    const result = await runDoctor(options());
    expect(result.installation).toBe('missing');
    expect(result.runtime_verification).toBe('not_performed');
    expect(result.findings.map((f) => f.id)).toEqual(
      expect.arrayContaining([
        'instructions.optional-kit:AGENTS.md',
        'instructions.bootstrap-missing:IMPLEMENTATION-PROMPT.md',
        'instructions.stack-review:IMPLEMENTATION-PROMPT.md',
      ]),
    );
    const repair = await runRepair([...options(), '--apply']);
    expect(repair.applied).toEqual([]);
    expect(repair.remaining.healthy).toBe(false);
    expect(read('AGENTS.md')).toBe(instructions);
    expect(existsSync(join(project, '.agents'))).toBe(false);
  });

  it('emits exactly one JSON report for machine consumers', async () => {
    await install();
    vi.mocked(console.log).mockClear();
    const result = await runDoctor(options());
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(vi.mocked(console.log).mock.calls[0]?.[0]))).toEqual(result);
    expect(result.healthy).toBe(true);
  });

  it('scopes bridge checks and restoration to the selected agent', async () => {
    await install('codex,claude-code,gemini');
    unlinkSync(join(project, 'CLAUDE.md'));
    unlinkSync(join(project, 'GEMINI.md'));
    expect((await runDoctor(options())).healthy).toBe(true);
    expect((await runDoctor(options('claude-code'))).healthy).toBe(false);
    const result = await runRepair([...options('claude-code'), '--apply']);
    expect(result.applied).toEqual(['CLAUDE.md']);
    expect(result.remaining.healthy).toBe(true);
    expect(existsSync(join(project, 'GEMINI.md'))).toBe(false);
  });

  it('previews by default and creates nothing until apply is supplied', async () => {
    await install();
    unlinkSync(join(project, 'skills/core/cadrage/SKILL.md'));
    const version = read('.agents/.composed-kit-version');
    for (const extra of [[], ['--dry-run']]) {
      const result = await runRepair([...options(), ...extra]);
      expect(result.dry_run).toBe(true);
      expect(result.applied).toEqual([]);
      expect(existsSync(join(project, 'skills/core/cadrage/SKILL.md'))).toBe(false);
    }
    expect(read('.agents/.composed-kit-version')).toBe(version);
    const result = await runRepair([...options(), '--apply']);
    expect(result.applied).toEqual(['skills/core/cadrage/SKILL.md']);
    expect(result.remaining.healthy).toBe(true);
    expect((await runRepair([...options(), '--apply'])).applied).toEqual([]);
  });

  it('preserves existing instructions, memory, work evidence and custom skills', async () => {
    await install();
    writeFileSync(
      join(project, 'AGENTS.md'),
      '# Project-owned rules\nKeep my architecture choices.\n',
    );
    writeFileSync(join(project, '.agents/memory/MEMORY.md'), '# My context\n');
    writeFileSync(join(project, '.agents/work/evidence.md'), '# My actual evidence\n');
    const custom = '---\nname: cadrage\ndescription: Local adaptation\n---\nKeep it.\n';
    writeFileSync(join(project, 'skills/core/cadrage/SKILL.md'), custom);
    unlinkSync(join(project, 'skills/catalog.json'));
    await runRepair([...options(), '--apply']);
    expect(read('AGENTS.md')).toContain('Project-owned rules');
    expect(read('.agents/memory/MEMORY.md')).toBe('# My context\n');
    expect(read('.agents/work/evidence.md')).toBe('# My actual evidence\n');
    expect(read('skills/core/cadrage/SKILL.md')).toBe(custom);
    expect(existsSync(join(project, 'skills/catalog.json'))).toBe(true);
  });

  it('restores missing Cline mirrors and flags custom mismatches without overwriting', async () => {
    await install('cline');
    unlinkSync(join(project, '.cline/skills/cadrage/SKILL.md'));
    expect((await runRepair([...options('cline'), '--apply'])).applied).toEqual([
      '.cline/skills/cadrage/SKILL.md',
    ]);
    writeFileSync(join(project, '.cline/skills/cadrage/SKILL.md'), '# Local mirror\n');
    const result = await runRepair([...options('cline'), '--apply']);
    expect(result.remaining.findings.some((f) => f.id.startsWith('cline.mirror-drift:'))).toBe(
      true,
    );
    expect(read('.cline/skills/cadrage/SKILL.md')).toBe('# Local mirror\n');
  });

  it('reports invalid records instead of crashing or repairing with invented settings', async () => {
    await install();
    writeFileSync(
      join(project, '.agents/.composed-kit-version'),
      'version: 0.6.0\nlang: unknown\nagents:\n  - unknown\n',
    );
    unlinkSync(join(project, 'AGENTS.md'));
    const result = await runRepair([...options(), '--apply']);
    expect(result.remaining.installation).toBe('invalid');
    expect(result.applied).toEqual([]);
    expect(existsSync(join(project, 'AGENTS.md'))).toBe(false);
  });

  it('requires an update before restoring files from a different kit version', async () => {
    await install();
    writeFileSync(
      join(project, '.agents/.composed-kit-version'),
      read('.agents/.composed-kit-version').replace(`version: ${KIT_VERSION}`, 'version: 0.1.0'),
    );
    unlinkSync(join(project, 'AGENTS.md'));
    const result = await runRepair([...options(), '--apply']);
    expect(result.applied).toEqual([]);
    expect(result.remaining.warnings.some((w) => w.includes('Version drift'))).toBe(true);
  });

  it('restores bridge indexes using the metadata of retained local skills', async () => {
    await install();
    writeFileSync(
      join(project, 'skills/core/cadrage/SKILL.md'),
      '---\nname: cadrage\ndescription: Project-specific framing\n---\nKeep it.\n',
    );
    unlinkSync(join(project, 'AGENTS.md'));
    await runRepair([...options(), '--apply']);
    expect(read('AGENTS.md')).toContain('Project-specific framing');
  });

  it('does not write with an unreadable or incompatible source kit', async () => {
    await install();
    unlinkSync(join(project, 'AGENTS.md'));
    const args = options().filter((arg) => !arg.startsWith('--kit-root='));
    const result = await runRepair([
      ...args,
      `--kit-root=${join(project, 'absent-kit')}`,
      '--apply',
    ]);
    expect(result.applied).toEqual([]);
    expect(result.remaining.findings.some((f) => f.id.startsWith('kit.unreadable:'))).toBe(true);
    expect(existsSync(join(project, 'AGENTS.md'))).toBe(false);
  });

  it('refuses symlink parents in preview and apply before creating any files', async () => {
    await install();
    const outside = mkdtempSync(join(tmpdir(), 'composed-outside-'));
    try {
      rmSync(join(project, '.agents/memory'), { recursive: true });
      symlinkSync(
        outside,
        join(project, '.agents/memory'),
        process.platform === 'win32' ? 'junction' : 'dir',
      );
      for (const mode of ['--dry-run', '--apply']) {
        await expect(runRepair([...options(), mode])).rejects.toThrow(/symlink/);
      }
      expect(existsSync(join(outside, 'MEMORY.md'))).toBe(false);
    } finally {
      rmSync(join(project, '.agents/memory'), { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  });

  it('keeps unconfigured agents explicit and rejects ambiguous command options', async () => {
    await install();
    expect(
      (await runDoctor(options('gemini'))).findings.some((f) =>
        f.id.startsWith('agent.unconfigured:'),
      ),
    ).toBe(true);
    expect(() => diagnosticOptions(['--agent=unknown'])).toThrow(/Unknown agent/);
    expect(() => diagnosticOptions(['--agent'])).toThrow(/exactly once/);
    expect(() => diagnosticOptions(['--agent=codex', '--agent=gemini'])).toThrow(/exactly once/);
    await expect(runRepair([...options(), '--dry-run', '--apply'])).rejects.toThrow(/Choose/);
  });
});
