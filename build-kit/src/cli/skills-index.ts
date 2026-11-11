import type { Skill, SkillLevel } from './types.ts';

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

export type SkillFrontmatter = {
  name: string;
  description: string;
};

export function parseSkillFrontmatter(content: string): SkillFrontmatter {
  const match = FRONTMATTER_RE.exec(content);
  if (!match || !match[1]) {
    throw new Error('Missing YAML frontmatter in SKILL.md');
  }
  const yaml = match[1];
  const name = readYamlField(yaml, 'name');
  const description = readYamlField(yaml, 'description');
  if (!name) throw new Error('Missing `name` field in frontmatter');
  if (!description) throw new Error('Missing `description` field in frontmatter');
  return { name, description };
}

function readYamlField(yaml: string, field: string): string | undefined {
  // Supports `field: value` and `field: >\n  multi-line` (folded scalar)
  const lineRe = new RegExp(`^${field}:\\s*(.+)$`, 'm');
  const lineMatch = lineRe.exec(yaml);
  if (lineMatch?.[1] && !lineMatch[1].trim().startsWith('>')) {
    return lineMatch[1].trim().replace(/^["']|["']$/g, '');
  }
  // Folded scalar: gather indented continuation lines
  const blockRe = new RegExp(`^${field}:\\s*>\\s*\\n((?:  .+\\n?)+)`, 'm');
  const blockMatch = blockRe.exec(yaml);
  if (blockMatch?.[1]) {
    return blockMatch[1]
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .join(' ');
  }
  return undefined;
}

export function renderSkillsIndex(skills: Skill[]): string {
  const grouped: Record<SkillLevel, Skill[]> = {
    core: [],
    support: [],
    extras: [],
  };
  for (const s of skills) {
    grouped[s.level].push(s);
  }

  const sections: string[] = [];
  const labels: Record<SkillLevel, string> = {
    core: 'Core',
    support: 'Support',
    extras: 'Extras',
  };
  for (const level of ['core', 'support', 'extras'] as const) {
    const list = grouped[level];
    if (list.length === 0) continue;
    sections.push(`### ${labels[level]}\n`);
    sections.push('| Skill | Description |');
    sections.push('|---|---|');
    for (const s of list) {
      sections.push(`| \`${s.name}\` | ${s.description} |`);
    }
    sections.push('');
  }
  return sections.join('\n').trim();
}
