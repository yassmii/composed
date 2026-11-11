import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import {
  LEGACY_TRACKING_PATH,
  type PlannedFile,
  TRACKING_PATH,
  safeProjectPath,
} from './managed-files.ts';
import { renderTemplate } from './render-bridge.ts';
import { readCatalogSkills } from './skill-catalog.ts';
import { parseSkillFrontmatter, renderSkillsIndex } from './skills-index.ts';
import {
  AGENT_SPECS,
  type AgentId,
  KIT_VERSION,
  type Lang,
  type Skill,
  type SkillLevel,
} from './types.ts';
import { serializeYaml } from './version-tracker.ts';
import { readVersion } from './version-tracker.ts';

export function installationPlan(options: {
  cwd: string;
  kitRoot: string;
  lang: Lang;
  agents: AgentId[];
  levels: SkillLevel[];
  keepLocal: boolean;
}): { files: PlannedFile[]; skills: Skill[] } {
  const { cwd, kitRoot, lang, agents, levels, keepLocal } = options;
  const selected = readCatalogSkills(join(kitRoot, 'skills/catalog.json'), levels);
  const catalog = JSON.parse(readFileSync(join(kitRoot, 'skills/catalog.json'), 'utf8'));
  catalog.skills = catalog.skills.filter((skill: { level: SkillLevel }) =>
    levels.includes(skill.level),
  );
  const files: PlannedFile[] = [
    { path: 'skills/catalog.json', content: `${JSON.stringify(catalog, null, 2)}\n` },
  ];
  const skills: Skill[] = [];
  for (const item of selected) {
    const path = `skills/${item.level}/${item.name}/SKILL.md`;
    const local = safeProjectPath(cwd, path);
    const content = readFileSync(
      join(kitRoot, 'skills', item.level, item.name, `SKILL.${lang}.md`),
      'utf8',
    ).replace(/\r\n/g, '\n');
    const retained = keepLocal && existsSync(local);
    const actual = retained ? readFileSync(local, 'utf8') : content;
    const metadata = parseSkillFrontmatter(actual);
    if (metadata.name !== item.name)
      throw new Error(`Skill identifier differs from catalog: ${path}`);
    skills.push({ ...metadata, level: item.level, path: local });
    files.push({ path, content, retain: retained });
    if (agents.includes('cline'))
      files.push({
        path: `.cline/skills/${item.name}/SKILL.md`,
        content: actual,
        retain: keepLocal,
      });
  }
  const vars = {
    PROJECT_NAME: basename(cwd),
    KIT_VERSION,
    INSTALLED_AGENTS: agents.join(', '),
    SKILLS_INDEX: renderSkillsIndex(skills),
  };
  const bridges = new Map([['AGENTS.md', 'AGENTS.md']]);
  for (const agent of agents)
    bridges.set(AGENT_SPECS[agent].output, AGENT_SPECS[agent].templateBase);
  for (const [path, template] of bridges)
    files.push({
      path,
      content: renderTemplate(
        readFileSync(join(kitRoot, 'bridges', `${template}.${lang}.tpl`), 'utf8'),
        vars,
      ),
    });
  for (const path of ['memory/MEMORY.md', 'memory/_README.md', 'work/README.md'])
    files.push({
      path: `.agents/${path}`,
      content: readFileSync(join(kitRoot, path), 'utf8'),
      seed: true,
    });
  // Track existing legacy installation metadata so uninstall cannot resurrect it via readVersion's fallback.
  const legacy = safeProjectPath(cwd, LEGACY_TRACKING_PATH);
  if (existsSync(legacy))
    files.push({ path: LEGACY_TRACKING_PATH, content: readFileSync(legacy, 'utf8') });
  files.push({
    path: TRACKING_PATH,
    content: serializeYaml({
      version: KIT_VERSION,
      installed_at: readVersion(cwd)?.installed_at ?? new Date().toISOString(),
      lang,
      agents,
      skills: {
        core: skills.filter((skill) => skill.level === 'core').length,
        support: skills.filter((skill) => skill.level === 'support').length,
        extras: skills.filter((skill) => skill.level === 'extras').length,
      },
    }),
  });
  return { files, skills };
}
