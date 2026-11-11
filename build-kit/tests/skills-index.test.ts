import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseSkillFrontmatter, renderSkillsIndex } from '../src/cli/skills-index.ts';

const FIXTURES = resolve(__dirname, 'fixtures');

describe('parseSkillFrontmatter', () => {
  it('extracts name and description from a valid SKILL.md', () => {
    const content = readFileSync(resolve(FIXTURES, 'sample-skill.md'), 'utf8');
    const result = parseSkillFrontmatter(content);
    expect(result).toEqual({
      name: 'sample-skill',
      description: 'A sample skill for testing',
    });
  });

  it('accepts CRLF frontmatter', () => {
    const content = '---\r\nname: sample-skill\r\ndescription: A sample skill\r\n---\r\nbody';
    expect(parseSkillFrontmatter(content)).toEqual({
      name: 'sample-skill',
      description: 'A sample skill',
    });
  });

  it('throws on missing frontmatter', () => {
    expect(() => parseSkillFrontmatter('no frontmatter here')).toThrow(/frontmatter/i);
  });

  it('throws on missing name field', () => {
    const content = '---\ndescription: x\n---\nbody';
    expect(() => parseSkillFrontmatter(content)).toThrow(/name/i);
  });
});

describe('renderSkillsIndex', () => {
  it('renders a markdown table of skills grouped by level', () => {
    const skills = [
      {
        name: 'product-manager',
        level: 'core' as const,
        description: 'PM strategy',
        path: 'skills/core/product-manager/SKILL.md',
      },
      {
        name: 'cadrage',
        level: 'core' as const,
        description: 'Feature framing',
        path: 'skills/core/cadrage/SKILL.md',
      },
      {
        name: 'codebase-onboarding',
        level: 'support' as const,
        description: 'Legacy code archaeology',
        path: 'skills/support/codebase-onboarding/SKILL.md',
      },
    ];
    const out = renderSkillsIndex(skills);
    expect(out).toContain('### Core');
    expect(out).toContain('### Support');
    expect(out).toContain('| `product-manager` | PM strategy |');
    expect(out).toContain('| `cadrage` | Feature framing |');
    expect(out).toContain('| `codebase-onboarding` | Legacy code archaeology |');
  });
});
