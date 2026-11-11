import { confirm, isCancel } from '@clack/prompts';
import { type ClaudeMemoryPlan, applyClaudeMemory, planClaudeMemory } from './claude-memory.ts';
import type { Flags } from './flags.ts';
import {
  PROJECT_INSTRUCTIONS_PATH,
  type PlannedFile,
  applyPreparedFilePlan,
  prepareFilePlan,
  safeProjectPath,
} from './managed-files.ts';
import { type SourceProvenance, collectInstallationSource } from './provenance.ts';
import {
  type RetirementAction,
  type RetirementResult,
  applyRetirementPlan,
  planLegacyBridges,
  planRenamedSkills,
} from './skill-migrations.ts';
import type { AgentId, Skill } from './types.ts';

export type LifecycleResult = {
  format_version: 1;
  command: 'init' | 'update';
  dry_run: boolean;
  healthy: boolean;
  status: 'planned' | 'blocked' | 'cancelled' | 'applied' | 'partial';
  writes: string[];
  conflicts: string[];
  retained: { path: string; reason: string }[];
  retirements: RetirementAction[];
  backups: { paths: string[]; authorized: boolean; directory: string | null };
  external_actions: ClaudeMemoryPlan[];
  source: SourceProvenance;
  notes: string[];
  applied: {
    written: string[];
    retirements: RetirementResult[];
    external_actions: ClaudeMemoryPlan[];
  };
};

export async function executeInstallation(options: {
  command: 'init' | 'update';
  cwd: string;
  kitRoot: string;
  flags: Flags;
  agents: AgentId[];
  files: PlannedFile[];
  skills: Skill[];
}): Promise<LifecycleResult> {
  const { cwd, kitRoot, flags, agents, command } = options;
  if (flags.json && !flags.dryRun && !flags.yes)
    throw new Error(
      'JSON application requires --yes; use --dry-run --json for a non-interactive preview.',
    );
  // Project-owned instructions are an explicit extension, never a managed baseline.
  safeProjectPath(cwd, PROJECT_INSTRUCTIONS_PATH);
  if (flags.claudeMemory === 'link' && !agents.includes('claude-code'))
    throw new Error('--claude-memory=link requires Claude Code in the installed agent list.');
  const source = collectInstallationSource(kitRoot);
  const filePlan = prepareFilePlan(cwd, options.files, {
    force: flags.force,
    keepLocal: flags.keepLocal,
    source,
    declareProjectInstructions: true,
  });
  const retirements =
    command === 'update'
      ? [
          ...planRenamedSkills(cwd, kitRoot, options.skills, {
            keepLocal: flags.keepLocal,
            cline: agents.includes('cline'),
          }),
          ...planLegacyBridges(cwd, options.files, { keepLocal: flags.keepLocal }),
        ]
      : [];
  const external = agents.includes('claude-code')
    ? [
        planClaudeMemory({
          projectRoot: cwd,
          requested: flags.claudeMemory === 'link',
        }),
      ]
    : [];
  const blocked =
    (filePlan.conflicts.length > 0 && !flags.force) || external.some((action) => action.blocking);
  const notes = [
    'The source record identifies the executing kit; retained files may still contain older instructions. It is not authenticated provenance or runtime validation.',
    'Project instructions are project-owned in .agents/project-instructions.md. Existing bridge preambles require explicit transfer and reconciliation; they are never adopted automatically.',
  ];
  if (filePlan.conflicts.length)
    notes.push(
      'Before backed-up replacement, review local rules. Backups can contain private instructions: exclude .agents/backups/ using the host .gitignore or .git/info/exclude. The CLI does not edit host ignore settings.',
    );
  if (retirements.length)
    notes.push(
      'Review every retired/preserved legacy file and its replacement before starting a fresh agent session. Retirements do not rewrite references in project documents.',
    );
  const result: LifecycleResult = {
    format_version: 1,
    command,
    dry_run: flags.dryRun,
    healthy: !blocked,
    status: blocked ? 'blocked' : 'planned',
    writes: filePlan.written,
    conflicts: filePlan.conflicts,
    retained: [
      ...filePlan.retained.map((path) => ({
        path,
        reason: 'Existing seed or local file preserved; not silently adopted.',
      })),
      ...filePlan.seed_notices,
    ],
    retirements,
    backups: { paths: filePlan.conflicts, authorized: flags.force, directory: null },
    external_actions: external,
    source,
    notes,
    applied: { written: [], retirements: [], external_actions: [] },
  };
  if (flags.dryRun || blocked) {
    printLifecycle(result, flags.json);
    if (blocked && !flags.dryRun && !flags.json)
      throw new Error(
        `Local file conflicts or unsafe external action; no files written:\n${filePlan.conflicts.join('\n')}\nReview the plan, then use --keep-local or --force with backup for managed conflicts.`,
      );
    return result;
  }
  if (!flags.yes) {
    printLifecycle(result, false);
    const choice = await confirm({
      message:
        'Apply the displayed installation plan, including its listed retirements and requested external actions?',
    });
    if (isCancel(choice) || !choice) {
      result.status = 'cancelled';
      if (flags.json) printLifecycle(result, true);
      return result;
    }
  }
  if (external.some((action) => action.requested)) {
    const current = planClaudeMemory({ projectRoot: cwd, requested: true });
    if (JSON.stringify(current) !== JSON.stringify(external[0]))
      throw new Error(
        'External memory configuration changed after preflight; no files written. Re-plan before applying.',
      );
  }
  const applied = applyPreparedFilePlan(cwd, filePlan, { force: flags.force });
  result.applied.written = applied.written;
  result.backups.directory = applied.backup ?? null;
  result.applied.retirements = applyRetirementPlan(cwd, retirements);
  result.applied.external_actions = external.map((action) => applyClaudeMemory(action));
  result.healthy =
    !result.applied.external_actions.some(
      (action) => action.blocking || action.status === 'failed',
    ) &&
    !result.applied.retirements.some(
      (action) => action.action === 'remove' && action.result !== 'removed',
    );
  result.status = result.healthy ? 'applied' : 'partial';
  printLifecycle(result, flags.json);
  return result;
}

function printLifecycle(result: LifecycleResult, json: boolean): void {
  if (json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(
    `${result.dry_run ? '[dry-run] ' : ''}${result.command}: ${result.status}. ${result.writes.length} planned write(s), ${result.conflicts.length} conflict(s).`,
  );
  for (const path of result.writes) console.log(`  write: ${path}`);
  for (const path of result.conflicts) console.log(`  conflict: ${path}`);
  for (const item of result.retained) console.log(`  retain: ${item.path}: ${item.reason}`);
  for (const item of result.applied.retirements.length
    ? result.applied.retirements
    : result.retirements)
    console.log(`  ${'result' in item ? item.result : item.action}: ${item.path}: ${item.reason}`);
  for (const path of result.backups.paths) console.log(`  backup before replacement: ${path}`);
  if (result.backups.directory) console.log(`Backup: ${result.backups.directory}`);
  for (const action of result.applied.external_actions.length
    ? result.applied.external_actions
    : result.external_actions)
    console.log(
      `  external ${action.action} (${action.status}): ${action.destination ?? '(unresolved)'}: ${action.reason}`,
    );
  for (const note of result.notes) console.log(note);
  if (result.dry_run) console.log('No changes made.');
}
