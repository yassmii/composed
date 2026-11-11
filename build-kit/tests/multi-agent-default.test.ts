import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { runInit } from '../src/cli/init.ts';
import { AGENT_SPECS, KIT_VERSION } from '../src/cli/types.ts';
import { runUpdate } from '../src/cli/update.ts';

const KIT_ROOT = resolve(__dirname, '..');
const projects: string[] = [];

afterEach(() => {
  for (const project of projects.splice(0)) rmSync(project, { recursive: true, force: true });
});

describe('installed multi-agent default policy', () => {
  for (const lang of ['fr', 'en']) {
    it(`installs mandatory native delegation, evidence and review gates in ${lang}`, async () => {
      const project = mkdtempSync(join(tmpdir(), 'composed-multi-agent-'));
      projects.push(project);
      mkdirSync(join(project, '.git'));
      // All non-Claude bridges, avoiding any user-home memory mirror mutation.
      await runInit([
        '--yes',
        `--lang=${lang}`,
        '--agents=codex,cline,cursor,gemini,windsurf,aider',
        '--skills=core,support',
        `--cwd=${project}`,
        `--kit-root=${KIT_ROOT}`,
      ]);

      const read = (path: string) => readFileSync(join(project, path), 'utf8');
      const doctrine = read('AGENTS.md');
      expect(doctrine).toContain('multi-agent-required');
      expect(doctrine).toContain('agents.md');
      expect(doctrine).toContain('handoff.md');
      expect(doctrine).toContain('self-review');
      expect(doctrine).toContain(lang === 'en' ? 'explicit user request' : 'demande explicite');
      expect(read('skills/core/delivery-orchestrator/SKILL.md')).toContain('multi-agent-required');
      expect(read('skills/support/delivery-review/SKILL.md')).toContain('multi-agent-required');
      expect(read('.cline/skills/delivery-orchestrator/SKILL.md')).toBe(
        read('skills/core/delivery-orchestrator/SKILL.md'),
      );
      expect(read('.clinerules/composed-build-kit.md')).toContain('multi-agent-required');
      expect(read('.agents/work/README.md')).toContain('runtime-returned ID');
      const catalog = JSON.parse(read('skills/catalog.json'));
      expect(catalog.execution_policy.default_mode).toBe('multi-agent-required');
      expect(catalog.execution_policy.minimum_native_delegations).toBe(1);
      expect(catalog.model_assignment_policy.no_remote_fallback).toBe(true);
      expect(catalog.model_assignment_policy.record).toEqual(
        expect.arrayContaining(['requested_model', 'observed_model', 'runtime_id']),
      );
      expect(doctrine).toContain('model_assignment_policy');
      expect(read('skills/core/delivery-orchestrator/SKILL.md')).toContain(
        'model_assignment_policy',
      );

      // Updating an older doctrine must preserve memory and real work evidence.
      const preferencesPath = join(project, '.agents/project-instructions.md');
      const preferences = '# Local preferences\nKeep data local; no remote fallback.\n';
      writeFileSync(preferencesPath, preferences);
      const memoryPath = join(project, '.agents/memory/MEMORY.md');
      const evidencePath = join(project, '.agents/work/example/agents.md');
      mkdirSync(join(project, '.agents/work/example'));
      writeFileSync(memoryPath, '# Existing user context\n');
      writeFileSync(evidencePath, '# Existing delegation evidence\n');
      writeFileSync(join(project, 'AGENTS.md'), '# Old optional delegation doctrine\n');
      const versionPath = join(project, '.agents/.composed-kit-version');
      writeFileSync(
        versionPath,
        readFileSync(versionPath, 'utf8').replace(`version: ${KIT_VERSION}`, 'version: 0.4.0'),
      );
      await runUpdate(['--force', '--yes', `--cwd=${project}`, `--kit-root=${KIT_ROOT}`]);
      expect(read('AGENTS.md')).toBe(doctrine);
      expect(readFileSync(preferencesPath, 'utf8')).toBe(preferences);
      expect(JSON.parse(read('skills/catalog.json')).model_assignment_policy).toEqual(
        catalog.model_assignment_policy,
      );
      expect(readFileSync(memoryPath, 'utf8')).toBe('# Existing user context\n');
      expect(readFileSync(evidencePath, 'utf8')).toBe('# Existing delegation evidence\n');
      expect(readFileSync(versionPath, 'utf8')).toContain(`version: ${KIT_VERSION}`);
    });

    it(`makes every ${lang} bridge load the universal doctrine`, () => {
      for (const spec of Object.values(AGENT_SPECS)) {
        const template = readFileSync(
          join(KIT_ROOT, 'bridges', `${spec.templateBase}.${lang}.tpl`),
          'utf8',
        );
        expect(template).toContain(
          spec.templateBase === 'AGENTS.md' ? 'multi-agent-required' : 'AGENTS.md',
        );
      }
      const claude = readFileSync(join(KIT_ROOT, 'bridges', `CLAUDE.md.${lang}.tpl`), 'utf8');
      expect(claude).toContain('multi-agent-required');
    });
  }
});
