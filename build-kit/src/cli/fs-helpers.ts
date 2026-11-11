import {
  type Stats,
  copyFileSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  realpathSync,
  symlinkSync,
} from 'node:fs';
import { dirname, isAbsolute, join, win32 } from 'node:path';
import { claudeProjectSlug } from './claude-memory.ts';
import type { Skill } from './types.ts';

export function copyDirRecursive(src: string, dest: string): void {
  cpSync(src, dest, { recursive: true });
}

export type SymlinkMode = 'symlink';

/** Compatibility helper: link failures are explicit; no divergent copy is created. */
export function ensureSymlinkOrCopy(target: string, linkPath: string): SymlinkMode {
  let existing: Stats | undefined;
  try {
    existing = lstatSync(linkPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  if (existing) {
    if (existing.isSymbolicLink() && realpathSync(linkPath) === realpathSync(target))
      return 'symlink';
    throw new Error(`${linkPath} already exists. Refusing to replace a user-owned mirror.`);
  }
  mkdirSync(dirname(linkPath), { recursive: true });
  symlinkSync(target, linkPath, process.platform === 'win32' ? 'junction' : 'dir');
  return 'symlink';
}

/** Claude Code's observed project encoding, including the leading separator. */
export const projectSlug = claudeProjectSlug;

export function claudeMemoryMirrorPath(homeDir: string, projectRoot: string): string {
  if (!isAbsolute(homeDir) && !win32.isAbsolute(homeDir))
    throw new Error('Claude home must be an absolute path.');
  const paths = win32.isAbsolute(homeDir) && !isAbsolute(homeDir) ? win32 : { join };
  return paths.join(homeDir, '.claude', 'projects', projectSlug(projectRoot), 'memory');
}

/** Cline discovers workspace skills from .cline/skills; keep this generated mirror aligned. */
export function syncClineSkills(projectRoot: string, skills: Skill[], keepLocal = false): void {
  for (const skill of skills) {
    const destination = join(projectRoot, '.cline', 'skills', skill.name, 'SKILL.md');
    if (keepLocal && existsSync(destination)) continue;
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(skill.path, destination);
  }
}
