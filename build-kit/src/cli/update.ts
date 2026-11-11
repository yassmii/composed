import { resolve } from 'node:path';
import { parseFlags } from './flags.ts';
import { installationPlan } from './installation-plan.ts';
import { type LifecycleResult, executeInstallation } from './lifecycle.ts';
import { LEGACY_TRACKING_PATH, TRACKING_PATH, safeProjectPath } from './managed-files.ts';
import { promptLevels } from './prompts.ts';
import type { SkillLevel } from './types.ts';
import { readVersion } from './version-tracker.ts';

export async function runUpdate(args: string[]): Promise<LifecycleResult> {
  const flags = parseFlags(args);
  const cwd = resolve(flags.cwd ?? process.cwd());
  const kitRoot = resolve(flags.kitRoot ?? resolve(import.meta.dirname, '../..'));
  safeProjectPath(cwd, TRACKING_PATH);
  safeProjectPath(cwd, LEGACY_TRACKING_PATH);
  const installed = readVersion(cwd);
  if (!installed)
    throw new Error(`Composed Build Kit is not installed in ${cwd}. Run composed-kit init first.`);
  if (!['fr', 'en'].includes(installed.lang) || !installed.agents?.length)
    throw new Error('Invalid installation settings; reconcile the tracking record first.');
  const lang = flags.lang ?? installed.lang;
  let levels = (['core', 'support', 'extras'] as SkillLevel[]).filter(
    (level) => installed.skills[level] > 0,
  );
  if (flags.skills) levels = [...new Set([...levels, ...flags.skills])];
  else if (!flags.yes && !flags.dryRun && !flags.json && levels.length < 3)
    levels = [...new Set([...levels, ...(await promptLevels(levels))])];
  const plan = installationPlan({
    cwd,
    kitRoot,
    lang,
    agents: installed.agents,
    levels,
    keepLocal: flags.keepLocal,
  });
  return executeInstallation({
    command: 'update',
    cwd,
    kitRoot,
    flags,
    agents: installed.agents,
    ...plan,
  });
}
