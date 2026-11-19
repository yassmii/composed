import { readFileSync } from 'node:fs';
import { safeProjectPath } from './managed-files.ts';
import type { CatalogSkill } from './skill-catalog.ts';
import type { Lang } from './types.ts';

/** Only explicitly catalogued bilingual Markdown is distributed, never arbitrary local resources. */
export function readSkillReferences(kitRoot: string, skill: CatalogSkill, lang: Lang) {
  return (skill.references ?? []).map((name) => {
    const path = `references/${name}`;
    const source = `skills/${skill.level}/${skill.name}/${path.replace(/\.md$/, `.${lang}.md`)}`;
    return {
      path,
      content: readFileSync(safeProjectPath(kitRoot, source), 'utf8').replace(/\r\n/g, '\n'),
    };
  });
}
