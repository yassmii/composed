import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseFlags } from './flags.ts';
import { installationPlan } from './installation-plan.ts';
import { type LifecycleResult, executeInstallation } from './lifecycle.ts';
import { LEGACY_TRACKING_PATH, TRACKING_PATH, safeProjectPath } from './managed-files.ts';
import { promptAgents, promptLanguage, promptLevels } from './prompts.ts';
import { readVersion } from './version-tracker.ts';

export async function runInit(args: string[]): Promise<LifecycleResult> {
  const flags = parseFlags(args);
  if (flags.keepLocal)
    throw new Error(
      '--keep-local applies to update; init refuses manual collisions unless --force is explicitly selected.',
    );
  const cwd = resolve(flags.cwd ?? process.cwd());
  const kitRoot = resolve(flags.kitRoot ?? resolve(import.meta.dirname, '../..'));
  if (!existsSync(resolve(cwd, '.git')))
    throw new Error(`${cwd} is not a git repository. Run git init first.`);
  safeProjectPath(cwd, TRACKING_PATH);
  safeProjectPath(cwd, LEGACY_TRACKING_PATH);
  if (readVersion(cwd) && !flags.force)
    throw new Error(
      'Composed Build Kit is already installed. Use composed-kit update or --force with backup.',
    );
  const nonInteractive = flags.yes || flags.dryRun || flags.json;
  const lang = flags.lang ?? (nonInteractive ? 'fr' : await promptLanguage());
  const agents =
    flags.agents ?? (nonInteractive ? (['claude-code'] as const) : await promptAgents());
  const levels = flags.skills ?? (nonInteractive ? (['core'] as const) : await promptLevels());
  const plan = installationPlan({
    cwd,
    kitRoot,
    lang,
    agents: [...agents],
    levels: [...levels],
    keepLocal: false,
  });
  return executeInstallation({
    command: 'init',
    cwd,
    kitRoot,
    flags,
    agents: [...agents],
    ...plan,
  });
}
