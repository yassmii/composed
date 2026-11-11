import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { runInit } from '../src/cli/init.ts';
import { runUpdate } from '../src/cli/update.ts';

const ROOT = resolve(__dirname, '..');
const sourceCatalog = JSON.parse(readFileSync(join(ROOT, 'skills/catalog.json'), 'utf8'));
let project: string;

beforeEach(() => {
  project = mkdtempSync(join(tmpdir(), 'composed-stack-selection-'));
  mkdirSync(join(project, '.git'));
});

afterEach(() => {
  rmSync(project, { recursive: true, force: true });
});

function installedPolicy() {
  return JSON.parse(readFileSync(join(project, 'skills/catalog.json'), 'utf8'))
    .stack_selection_policy;
}

function assertPendingDecisionBlocksDependentWork() {
  const policy = installedPolicy();
  expect(policy.default).toBe('ask-user-before-selection');
  expect(policy.applies_to).toEqual(expect.arrayContaining(['new-project', 'poc', 'stack-change']));
  expect(policy.decision_states).toContain('pending');
  expect(policy.ready_states).not.toContain('pending');
  expect(policy.ready_states).toEqual(
    expect.arrayContaining(['user-selected', 'user-delegated', 'existing-project']),
  );
  expect(policy.pending_blocks).toEqual(
    expect.arrayContaining([
      'stack-selection',
      'scaffolding',
      'dependency-installation',
      'dependent-implementation',
    ]),
  );
  expect(policy.delegation).toBe('explicit-stack-delegation-only');
  expect(policy.recommendation).toBe('study-options-and-recommend-then-wait-for-user-choice');
}

function assertDistributedInstructions(lang: string) {
  // Check delivery of the entire policy section, not isolated keywords. These are structural
  // installation checks; the behavioural scenarios require a real agent to establish compliance.
  const template = readFileSync(join(ROOT, `bridges/AGENTS.md.${lang}.tpl`), 'utf8');
  const section =
    lang === 'fr' ? '### Choix explicite de la stack' : '### Explicit stack selection';
  const sectionStart = template.indexOf(section);
  expect(sectionStart).toBeGreaterThan(0);
  const policySection = template.slice(sectionStart, template.indexOf('\n## 4.', sectionStart));
  expect(readFileSync(join(project, 'AGENTS.md'), 'utf8')).toContain(policySection);

  for (const skill of ['delivery-orchestrator', 'software-engineering']) {
    const expected = readFileSync(
      join(ROOT, `skills/core/${skill}/SKILL.${lang}.md`),
      'utf8',
    ).replace(/\r\n/g, '\n');
    expect(readFileSync(join(project, `skills/core/${skill}/SKILL.md`), 'utf8')).toBe(expected);
  }
}

describe('stack-selection policy distribution', () => {
  it.each(['fr', 'en'])('installs the study-and-wait policy with --yes (%s)', async (lang) => {
    await runInit([
      '--yes',
      `--lang=${lang}`,
      '--agents=codex',
      '--skills=core',
      `--cwd=${project}`,
      `--kit-root=${ROOT}`,
    ]);

    assertPendingDecisionBlocksDependentWork();
    expect(installedPolicy()).toEqual(sourceCatalog.stack_selection_policy);
    assertDistributedInstructions(lang);
  });

  it.each(['fr', 'en'])(
    'updates stale instructions while preserving the user decision (%s)',
    async (lang) => {
      const decision = '# Existing project\n\nUser decision: keep the established Rust stack.\n';
      writeFileSync(join(project, 'README.md'), decision);
      await runInit([
        '--yes',
        '--agents=codex',
        '--skills=core',
        `--cwd=${project}`,
        `--kit-root=${ROOT}`,
      ]);
      const catalogPath = join(project, 'skills/catalog.json');
      const staleCatalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
      staleCatalog.stack_selection_policy = undefined;
      writeFileSync(catalogPath, JSON.stringify(staleCatalog));
      writeFileSync(join(project, 'AGENTS.md'), '# Old instructions without a stack decision gate');
      writeFileSync(
        join(project, 'skills/core/software-engineering/SKILL.md'),
        '# Old engineering instructions',
      );

      await runUpdate([
        '--yes',
        '--force',
        `--lang=${lang}`,
        `--cwd=${project}`,
        `--kit-root=${ROOT}`,
      ]);

      assertPendingDecisionBlocksDependentWork();
      assertDistributedInstructions(lang);
      expect(readFileSync(join(project, 'README.md'), 'utf8')).toBe(decision);
    },
  );
});
