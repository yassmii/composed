import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { InstalledVersion, Lang } from './types.ts';

const VERSION_FILE = '.agents/.composed-kit-version';
const LEGACY_VERSION_FILE = '.agents/.hunch-kit-version';

export function versionFilePath(projectRoot: string): string {
  return join(projectRoot, VERSION_FILE);
}

export function legacyVersionFilePath(projectRoot: string): string {
  return join(projectRoot, LEGACY_VERSION_FILE);
}

export function readVersion(projectRoot: string): InstalledVersion | null {
  const path = existsSync(versionFilePath(projectRoot))
    ? versionFilePath(projectRoot)
    : legacyVersionFilePath(projectRoot);
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, 'utf8');
  return parseYaml(raw);
}

export function writeVersion(projectRoot: string, data: InstalledVersion): void {
  const path = versionFilePath(projectRoot);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, serializeYaml(data), 'utf8');
}

export function serializeYaml(data: InstalledVersion): string {
  return [
    `version: ${data.version}`,
    `installed_at: ${data.installed_at}`,
    `lang: ${data.lang}`,
    'agents:',
    ...data.agents.map((a) => `  - ${a}`),
    'skills:',
    `  core: ${data.skills.core}`,
    `  support: ${data.skills.support}`,
    `  extras: ${data.skills.extras}`,
    '',
  ].join('\n');
}

function parseYaml(raw: string): InstalledVersion {
  const lines = raw.split('\n');
  const result: Partial<InstalledVersion> = {
    agents: [],
    skills: { core: 0, support: 0, extras: 0 },
  };
  let section: 'root' | 'agents' | 'skills' = 'root';

  for (const line of lines) {
    if (!line.trim()) continue;
    if (line.startsWith('agents:')) {
      section = 'agents';
      continue;
    }
    if (line.startsWith('skills:')) {
      section = 'skills';
      continue;
    }
    if (section === 'agents' && line.startsWith('  - ')) {
      result.agents?.push(line.slice(4).trim() as InstalledVersion['agents'][number]);
      continue;
    }
    if (section === 'skills' && line.startsWith('  ')) {
      const parts = line.trim().split(':');
      const key = parts[0]?.trim();
      const value = parts[1]?.trim();
      if (key === 'core' || key === 'support' || key === 'extras') {
        if (result.skills) result.skills[key] = Number(value);
      }
      continue;
    }
    if (section === 'root') {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key === 'version') result.version = value;
      if (key === 'installed_at') result.installed_at = value;
      if (key === 'lang') result.lang = value as Lang;
    }
  }

  return result as InstalledVersion;
}
