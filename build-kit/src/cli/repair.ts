import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  type DoctorResult,
  type Finding,
  diagnosticOptions,
  inspectProject,
} from './diagnostics.ts';
import {
  applyFilePlan,
  managedNamespace,
  readManagedManifest,
  safeProjectPath,
} from './managed-files.ts';

export type RepairResult = {
  format_version: 1;
  dry_run: boolean;
  applied: string[];
  actions: { finding_id: string; path: string; action: Finding['remediation'] }[];
  remaining: DoctorResult;
};

function safeDestination(root: string, path: string): string {
  return safeProjectPath(root, path);
}

export async function runRepair(args: string[]): Promise<RepairResult> {
  const options = diagnosticOptions(args, true);
  const apply = args.includes('--apply');
  if (apply && args.includes('--dry-run'))
    throw new Error('Choose --apply or --dry-run, not both.');
  const before = inspectProject(options);
  const actions = before.result.findings.map((finding) => ({
    finding_id: finding.id,
    path: finding.path,
    action: finding.remediation,
  }));
  const applied: string[] = [];
  // Preview must expose the same unsafe destinations as application.
  for (const file of before.missingFiles) safeDestination(options.cwd, file.path);
  if (apply) {
    // Validate ownership metadata before restoring anything; only files actually restored are enrolled.
    if (before.missingFiles.length) readManagedManifest(options.cwd);
    for (const file of before.missingFiles) {
      const path = safeDestination(options.cwd, file.path);
      if (existsSync(path))
        throw new Error(`Repair target appeared during application: ${file.path}`);
      mkdirSync(dirname(path), { recursive: true });
      // Exclusive creation also rejects a file/link created after preflight.
      writeFileSync(safeDestination(options.cwd, file.path), file.content, {
        encoding: 'utf8',
        flag: 'wx',
      });
      applied.push(file.path);
    }
    if (applied.length)
      applyFilePlan(
        options.cwd,
        before.missingFiles.filter(
          (file) => applied.includes(file.path) && managedNamespace(file.path),
        ),
        { force: false, keepLocal: true, dryRun: false },
      );
  }
  const result: RepairResult = {
    format_version: 1,
    dry_run: !apply,
    applied,
    actions,
    remaining: apply ? inspectProject(options).result : before.result,
  };
  if (args.includes('--json')) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(
      apply
        ? `Restored ${applied.length} missing file(s).`
        : 'Repair preview. No files written; use --apply for eligible missing files.',
    );
    for (const action of actions)
      console.log(`  ${action.action}: ${action.path || '(kit source)'}`);
    for (const finding of result.remaining.findings)
      console.log(`  [${finding.id}] ${finding.message}`);
    console.log(
      `Remaining: ${result.remaining.errors.length} error(s), ${result.remaining.warnings.length} warning(s). Runtime behavior is not verified.`,
    );
  }
  return result;
}
