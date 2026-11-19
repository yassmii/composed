import { readFileSync, writeFileSync } from 'node:fs';
import type { SkillLevel } from './types.ts';

export type CatalogSkill = { name: string; level: SkillLevel; references?: string[] };
type SkillCatalog = { skills: CatalogSkill[] } & Record<string, unknown>;

/** Returns skills that are part of the published routing contract for the selected levels. */
export function readCatalogSkills(sourcePath: string, levels: SkillLevel[]): CatalogSkill[] {
  const catalog = JSON.parse(readFileSync(sourcePath, 'utf8')) as SkillCatalog;
  if (!Array.isArray(catalog.skills)) {
    throw new Error(`Invalid skill catalog: ${sourcePath}`);
  }
  const installedLevels = new Set(levels);
  const skills = catalog.skills.filter((skill) => installedLevels.has(skill.level));
  if (skills.some((skill) => !skill.name)) {
    throw new Error(`Invalid skill catalog: skill name missing in ${sourcePath}`);
  }
  for (const skill of skills) {
    if (
      skill.references !== undefined &&
      (!Array.isArray(skill.references) ||
        skill.references.some(
          (name) => typeof name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(name),
        ) ||
        new Set(skill.references).size !== skill.references.length)
    )
      throw new Error(`Invalid reference filenames for skill ${skill.name}`);
  }
  return skills;
}

/** Writes the routing contract applicable to the levels installed in a host project. */
export function writeFilteredCatalog(
  sourcePath: string,
  outputPath: string,
  levels: SkillLevel[],
): void {
  const catalog = JSON.parse(readFileSync(sourcePath, 'utf8')) as SkillCatalog;
  catalog.skills = readCatalogSkills(sourcePath, levels);
  writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
}
