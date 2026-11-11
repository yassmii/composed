import { spawnSync } from 'node:child_process';
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
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseSkillFrontmatter } from '../src/cli/skills-index.ts';

type CatalogSkill = {
  name: string;
  level: string;
  when: string;
  not_when: string;
  risk: string;
};

type Catalog = {
  skills: CatalogSkill[];
  artifact_protocol: { files: string[] };
  execution_policy: {
    default_mode: string;
    minimum_native_delegations: number;
    unavailable: string;
    single_agent_override: string;
    direct_for: string[];
    delegation_record: string;
  };
};

const ROOT = resolve(__dirname, '..');
const catalog = JSON.parse(readFileSync(join(ROOT, 'skills/catalog.json'), 'utf8')) as Catalog;

describe('agentic skill catalog', () => {
  it('requires real delegation for complex work without imposing a fixed team size', () => {
    const policy = catalog.execution_policy;
    expect(policy.default_mode).toBe('multi-agent-required');
    expect(policy.minimum_native_delegations).toBe(1);
    expect(policy.unavailable).toBe('block-before-implementation');
    expect(policy.single_agent_override).toBe('explicit-user-request-only');
    expect(policy.direct_for).toContain('bounded small fix');
    expect(policy.delegation_record).toBe('.agents/work/<work-item>/agents.md');
    expect(catalog.artifact_protocol.files).toContain('agents.md');
  });

  it('maps every distributed skill to a complete routing contract', () => {
    expect(catalog.skills).toHaveLength(19);
    expect(new Set(catalog.skills.map((skill) => skill.name)).size).toBe(catalog.skills.length);

    for (const skill of catalog.skills) {
      expect(skill.when).not.toHaveLength(0);
      expect(skill.not_when).not.toHaveLength(0);
      expect(['low', 'medium', 'high']).toContain(skill.risk);
      for (const lang of ['fr', 'en']) {
        const path = join(ROOT, 'skills', skill.level, skill.name, `SKILL.${lang}.md`);
        expect(existsSync(path)).toBe(true);
        expect(parseSkillFrontmatter(readFileSync(path, 'utf8')).name).toBe(skill.name);
      }
    }
  });

  it('ships the same section structure in both languages for the new technical workflows', () => {
    for (const skill of catalog.skills.filter((skill) =>
      [
        'delivery-orchestrator',
        'software-engineering',
        'automated-testing',
        'refactoring',
        'codebase-onboarding',
        'technical-documentation',
        'security-review',
        'systematic-debugging',
        'api-contracts',
        'data-migrations',
        'release-engineering',
        'market-research',
      ].includes(skill.name),
    )) {
      const structures = ['fr', 'en'].map((lang) =>
        [
          ...readFileSync(
            join(ROOT, 'skills', skill.level, skill.name, `SKILL.${lang}.md`),
            'utf8',
          ).matchAll(/^(#+) /gm),
        ].map((match) => match[1]),
      );
      expect(structures[0]).toEqual(structures[1]);
    }
  });

  it('keeps product-manager routing aligned with canonical product documents', () => {
    const productManager = catalog.skills.find((skill) => skill.name === 'product-manager') as
      | (CatalogSkill & { artifacts?: string[] })
      | undefined;

    expect(productManager?.artifacts).toEqual(
      expect.arrayContaining(['docs/cadrage.md', 'docs/decisions.md', 'docs/backlog.md']),
    );
  });

  it('routes cross-disciplinary work through the orchestrator and independent review', () => {
    const names = catalog.skills.map((skill) => skill.name);
    expect(names).toContain('delivery-orchestrator');
    expect(names).toContain('delivery-review');
    expect(names).not.toContain('sprint-cycle');
  });

  it('makes cross-session handoff and review persistence explicit', () => {
    const orchestrator = catalog.skills.find((skill) => skill.name === 'delivery-orchestrator') as
      | (CatalogSkill & { artifacts?: string[] })
      | undefined;
    const review = catalog.skills.find((skill) => skill.name === 'delivery-review') as
      | (CatalogSkill & { artifacts?: string[] })
      | undefined;

    expect(orchestrator?.artifacts).toEqual(
      expect.arrayContaining(['handoff.md', 'reviews/<review-id>.md']),
    );
    expect(review?.artifacts).toEqual(expect.arrayContaining(['reviews/<review-id>.md']));
  });
});

// These exercise the catalog validator's rejection behaviour, not model-agent compliance.
describe('model assignment policy validation', () => {
  function validate(mutate: (value: Record<string, unknown>) => void) {
    const project = mkdtempSync(join(tmpdir(), 'composed-assignment-'));
    try {
      mkdirSync(join(project, 'skills'));
      mkdirSync(join(project, 'evals'));
      const value = JSON.parse(readFileSync(join(ROOT, 'skills/catalog.json'), 'utf8'));
      mutate(value);
      writeFileSync(join(project, 'skills/catalog.json'), JSON.stringify(value));
      cpSync(join(ROOT, 'evals/scenarios.json'), join(project, 'evals/scenarios.json'));
      for (const level of ['core', 'support', 'extras']) {
        symlinkSync(join(ROOT, 'skills', level), join(project, 'skills', level), 'dir');
      }
      return spawnSync(process.execPath, [join(ROOT, 'evals/validate-catalog.mjs')], {
        cwd: project,
        encoding: 'utf8',
      });
    } finally {
      rmSync(project, { recursive: true, force: true });
    }
  }

  it('accepts the distributed assignment policy while retaining native delegation', () => {
    expect(validate(() => {}).status).toBe(0);
  });

  for (const field of ['eligibility', 'capability_states', 'brief', 'record', 'authority']) {
    it(`rejects missing ${field} assignment constraints`, () => {
      const result = validate((value) => {
        const assignment = value.model_assignment_policy as Record<string, unknown>;
        assignment[field] = [];
      });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(`model_assignment_policy.${field}`);
    });
  }

  it('rejects silent remote fallback and inverted constraint precedence', () => {
    const result = validate((value) => {
      const assignment = value.model_assignment_policy as Record<string, unknown>;
      assignment.no_remote_fallback = false;
      assignment.authority = [
        'local_defaults',
        'session_choices_within_scope',
        'applicable_user_and_project_constraints',
      ];
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('silent local-to-remote fallback');
    expect(result.stderr).toContain('constraint/session/default precedence');
  });

  it('does not admit external-only startup by adding optional assignment', () => {
    const result = validate((value) => {
      const execution = value.execution_policy as Record<string, unknown>;
      execution.minimum_native_delegations = undefined;
      execution.minimum_verified_delegations = 1;
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('real native delegation');
  });
});
