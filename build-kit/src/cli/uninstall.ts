import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  LEGACY_TRACKING_PATH,
  MANIFEST_PATH,
  TRACKING_PATH,
  backupFiles,
  digest,
  pruneEmptyParents,
  readManagedManifest,
  safeProjectPath,
} from './managed-files.ts';

export type UninstallResult = {
  format_version: 1;
  dry_run: boolean;
  healthy: boolean;
  removed: string[];
  retained: { path: string; reason: string }[];
};

export async function runUninstall(args: string[]): Promise<UninstallResult> {
  let cwd = process.cwd();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string;
    if (arg.startsWith('--cwd=')) cwd = arg.slice(6);
    else if (arg === '--cwd') {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error('--cwd requires a value');
      cwd = value;
    } else if (!['--apply', '--dry-run', '--json'].includes(arg))
      throw new Error(`Unknown uninstall option: ${arg}`);
  }
  if (args.includes('--apply') && args.includes('--dry-run'))
    throw new Error('Choose --apply or --dry-run.');
  cwd = resolve(cwd);
  const apply = args.includes('--apply');
  const manifest = readManagedManifest(cwd);
  if (!manifest) {
    if (
      [TRACKING_PATH, LEGACY_TRACKING_PATH].some((path) => existsSync(safeProjectPath(cwd, path)))
    ) {
      throw new Error(
        'No managed manifest. Legacy files cannot be safely uninstalled; adopt with update and reconcile conflicts first.',
      );
    }
    const result: UninstallResult = {
      format_version: 1,
      dry_run: !apply,
      healthy: true,
      removed: [],
      retained: [],
    };
    console.log(
      args.includes('--json')
        ? JSON.stringify(result, null, 2)
        : 'No managed installation to remove.',
    );
    return result;
  }
  const removable: string[] = [];
  const retained: UninstallResult['retained'] = [];
  for (const [path, hash] of Object.entries(manifest.files)) {
    try {
      const target = safeProjectPath(cwd, path);
      if (!existsSync(target)) continue;
      if (digest(readFileSync(target)) === hash) removable.push(path);
      else retained.push({ path, reason: 'Modified since the last generated baseline.' });
    } catch (error) {
      retained.push({ path, reason: (error as Error).message });
    }
  }
  // Never remove the active record while another unowned/modified record could resurrect installation.
  for (const path of [TRACKING_PATH, LEGACY_TRACKING_PATH]) {
    const target = safeProjectPath(cwd, path);
    if (
      existsSync(target) &&
      !removable.includes(path) &&
      !retained.some((item) => item.path === path)
    ) {
      retained.push({ path, reason: 'Unowned installation record; reconcile manually.' });
    }
  }
  const blocked = retained.some((item) =>
    [TRACKING_PATH, LEGACY_TRACKING_PATH].includes(item.path),
  );
  const selected = blocked ? [] : removable;
  if (apply && !blocked) {
    // Archive administrative metadata even though work/memory and custom files are never removed.
    backupFiles(cwd, [
      MANIFEST_PATH,
      ...selected.filter((path) => [TRACKING_PATH, LEGACY_TRACKING_PATH].includes(path)),
    ]);
    for (const path of selected) {
      const target = safeProjectPath(cwd, path);
      if (digest(readFileSync(target)) !== manifest.files[path])
        throw new Error(`Target changed after preview: ${path}`);
      unlinkSync(target);
      pruneEmptyParents(cwd, path);
    }
    unlinkSync(safeProjectPath(cwd, MANIFEST_PATH));
  }
  const result: UninstallResult = {
    format_version: 1,
    dry_run: !apply,
    healthy: !blocked,
    removed: selected,
    retained,
  };
  if (args.includes('--json')) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(
      `${apply ? 'Removed' : 'Would remove'} ${selected.length} unchanged managed files. Memory, work evidence, backups and user-home mirrors are preserved.`,
    );
    for (const file of retained) console.log(`Retained ${file.path}: ${file.reason}`);
  }
  return result;
}
