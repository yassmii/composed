import { createHash, randomUUID } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { type SourceProvenance, validateSourceProvenance } from './provenance.ts';
import { AGENT_SPECS, KIT_VERSION } from './types.ts';

export const MANIFEST_PATH = '.agents/.composed-kit-manifest.json';
export const TRACKING_PATH = '.agents/.composed-kit-version';
export const LEGACY_TRACKING_PATH = '.agents/.hunch-kit-version';
export const PROJECT_INSTRUCTIONS_PATH = '.agents/project-instructions.md';
export type PlannedFile = { path: string; content: string; seed?: boolean; retain?: boolean };
export type ManagedManifest = {
  format_version: 1;
  kit_version: string;
  files: Record<string, string>;
  source?: SourceProvenance;
  extensions?: { project_instructions: typeof PROJECT_INSTRUCTIONS_PATH };
};

export const digest = (content: string | Buffer): string =>
  createHash('sha256').update(content).digest('hex');

export function managedNamespace(path: string): boolean {
  return (
    path === TRACKING_PATH ||
    path === LEGACY_TRACKING_PATH ||
    path === 'skills/catalog.json' ||
    Object.values(AGENT_SPECS).some((agent) => agent.output === path) ||
    /^skills\/(core|support|extras)\/[a-z0-9]+(?:-[a-z0-9]+)*\/SKILL\.md$/.test(path) ||
    /^\.cline\/skills\/[a-z0-9]+(?:-[a-z0-9]+)*\/SKILL\.md$/.test(path)
  );
}

/** Project-local paths only. Refuse links, aliases and non-directory ancestors before reads/writes. */
export function safeProjectPath(root: string, path: string): string {
  if (
    path.includes('\\') ||
    path.includes('\0') ||
    isAbsolute(path) ||
    path.split('/').some((part) => !part || part === '.' || part === '..')
  ) {
    throw new Error(`Unsafe project path: ${path}`);
  }
  const destination = resolve(root, path);
  const rel = relative(resolve(root), destination);
  if (!rel || isAbsolute(rel) || rel === '..' || rel.startsWith(`..${sep}`)) {
    throw new Error(`Path escapes project: ${path}`);
  }
  let current = resolve(root);
  const parts = path.split('/');
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i] as string;
    if (existsSync(current)) {
      const variant = readdirSync(current).find(
        (name) => name !== part && name.toLowerCase() === part.toLowerCase(),
      );
      if (variant)
        throw new Error(
          `Case collision: ${join(current, variant)} conflicts with ${path}. Reconcile it first.`,
        );
    }
    current = join(current, part);
    try {
      const stat = lstatSync(current);
      if (stat.isSymbolicLink()) throw new Error(`Refusing symlink path: ${path}`);
      if (i < parts.length - 1 && !stat.isDirectory())
        throw new Error(`Parent is not a directory: ${path}`);
      if (i === parts.length - 1 && !stat.isFile())
        throw new Error(`Target is not a regular file: ${path}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      break;
    }
  }
  return destination;
}

export function readManagedManifest(root: string): ManagedManifest | null {
  const path = safeProjectPath(root, MANIFEST_PATH);
  if (!existsSync(path)) return null;
  const manifest = JSON.parse(readFileSync(path, 'utf8')) as ManagedManifest;
  if (
    manifest.format_version !== 1 ||
    typeof manifest.kit_version !== 'string' ||
    !manifest.files ||
    Array.isArray(manifest.files) ||
    typeof manifest.files !== 'object'
  ) {
    throw new Error('Invalid managed file manifest; preserve it and reconcile before continuing.');
  }
  for (const [name, hash] of Object.entries(manifest.files)) {
    if (!managedNamespace(name) || typeof hash !== 'string' || !/^[a-f0-9]{64}$/.test(hash)) {
      throw new Error(`Invalid managed file manifest entry: ${name}`);
    }
  }
  if (manifest.source !== undefined) validateSourceProvenance(manifest.source);
  if (
    manifest.extensions !== undefined &&
    manifest.extensions?.project_instructions !== PROJECT_INSTRUCTIONS_PATH
  )
    throw new Error('Invalid project instruction extension declaration.');
  return manifest;
}

function atomicWrite(root: string, path: string, content: string): void {
  const target = safeProjectPath(root, path);
  mkdirSync(dirname(target), { recursive: true });
  const temp = `${target}.composed-${randomUUID()}.tmp`;
  try {
    writeFileSync(temp, content, { encoding: 'utf8', flag: 'wx' });
    renameSync(temp, safeProjectPath(root, path));
  } finally {
    if (existsSync(temp)) unlinkSync(temp);
  }
}

/** Exact byte backups are complete before any conflicting target is replaced. */
export function backupFiles(root: string, paths: string[]): string | undefined {
  if (!paths.length) return undefined;
  const id = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID()}`;
  const base = `.agents/backups/${id}`;
  const hashes: Record<string, string> = {};
  for (const path of paths) {
    const bytes = readFileSync(safeProjectPath(root, path));
    const destination = safeProjectPath(root, `${base}/${path}`);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, bytes, { flag: 'wx' });
    hashes[path] = digest(bytes);
  }
  const index = safeProjectPath(root, `${base}/backup.json`);
  writeFileSync(index, `${JSON.stringify({ format_version: 1, files: hashes }, null, 2)}\n`, {
    flag: 'wx',
  });
  return base;
}

export type FilePlanOptions = {
  force: boolean;
  keepLocal: boolean;
  source?: SourceProvenance;
  declareProjectInstructions?: boolean;
};

export type PreparedFilePlan = {
  written: string[];
  retained: string[];
  conflicts: string[];
  backups: string[];
  seed_notices: { path: string; reason: string }[];
  writes: PlannedFile[];
  observed: Map<string, string | null>;
  manifest: ManagedManifest;
  manifest_observed: string | null;
  manifest_changed: boolean;
};

/** Inspect every destination even when conflicts require a later explicit decision. No writes. */
export function prepareFilePlan(
  root: string,
  files: PlannedFile[],
  options: FilePlanOptions,
): PreparedFilePlan {
  if (options.force && options.keepLocal)
    throw new Error('Choose --force or --keep-local, not both.');
  const old = readManagedManifest(root);
  const hashes = { ...(old?.files ?? {}) };
  const conflicts: string[] = [];
  const retained: string[] = [];
  const writes: PlannedFile[] = [];
  const observed = new Map<string, string | null>();
  const seed_notices: PreparedFilePlan['seed_notices'] = [];
  if (new Set(files.map((file) => file.path)).size !== files.length)
    throw new Error('Duplicate installation destination.');
  const manifestPath = safeProjectPath(root, MANIFEST_PATH);
  const manifestBytes = existsSync(manifestPath) ? readFileSync(manifestPath) : null;
  for (const file of files) {
    if (!file.seed && !managedNamespace(file.path))
      throw new Error(`Unmanaged installation path: ${file.path}`);
    const path = safeProjectPath(root, file.path);
    const current = existsSync(path) ? digest(readFileSync(path)) : null;
    observed.set(file.path, current);
    if (file.seed && current !== null) {
      retained.push(file.path);
      if (file.path !== '.agents/memory/MEMORY.md' && current !== digest(file.content))
        seed_notices.push({
          path: file.path,
          reason:
            'Guide differs from the current seed; review manually. Existing bytes are preserved.',
        });
      continue;
    }
    const generated = digest(file.content);
    const changed = current !== null && current !== generated && current !== old?.files[file.path];
    if (current !== null && (file.retain || (changed && options.keepLocal))) {
      retained.push(file.path);
      // Retain the last generated baseline, never adopt customised bytes as kit-owned.
      continue;
    }
    if (changed) conflicts.push(file.path);
    if (current !== generated) writes.push(file);
    if (!file.seed) hashes[file.path] = generated;
  }
  const source = options.source ?? old?.source;
  const manifest: ManagedManifest = {
    format_version: 1,
    kit_version: KIT_VERSION,
    files: hashes,
    ...(source ? { source } : {}),
    ...(options.declareProjectInstructions || old?.extensions
      ? { extensions: { project_instructions: PROJECT_INSTRUCTIONS_PATH } }
      : {}),
  };
  const manifest_changed =
    manifestBytes?.toString('utf8') !== `${JSON.stringify(manifest, null, 2)}\n`;
  return {
    written: [...writes.map((file) => file.path), ...(manifest_changed ? [MANIFEST_PATH] : [])],
    retained,
    conflicts,
    backups: options.force ? [...conflicts] : [],
    seed_notices,
    writes,
    observed,
    manifest,
    manifest_observed: manifestBytes === null ? null : digest(manifestBytes),
    manifest_changed,
  };
}

export function applyPreparedFilePlan(
  root: string,
  plan: PreparedFilePlan,
  options: { force: boolean },
): { written: string[]; retained: string[]; backup: string | undefined } {
  const { conflicts, writes, observed, retained } = plan;
  if (conflicts.length && !options.force) {
    throw new Error(
      `Local file conflicts; no files written:\n${conflicts.join('\n')}\nUse --keep-local to preserve, or --force to back up and replace.`,
    );
  }
  // Recheck the entire inspected operation before a backup or the first write.
  const manifestPath = safeProjectPath(root, MANIFEST_PATH);
  const manifestCurrent = existsSync(manifestPath) ? digest(readFileSync(manifestPath)) : null;
  if (manifestCurrent !== plan.manifest_observed)
    throw new Error('Managed manifest changed after preflight.');
  for (const [path, expected] of observed) {
    const absolute = safeProjectPath(root, path);
    const actual = existsSync(absolute) ? digest(readFileSync(absolute)) : null;
    if (actual !== expected) throw new Error(`Target changed after preflight: ${path}`);
  }
  const backup = backupFiles(root, conflicts);
  for (const file of writes) {
    const path = safeProjectPath(root, file.path);
    const current = existsSync(path) ? digest(readFileSync(path)) : null;
    if (current !== observed.get(file.path))
      throw new Error(`Target changed after preflight: ${file.path}`);
    atomicWrite(root, file.path, file.content);
  }
  if (plan.manifest_changed)
    atomicWrite(root, MANIFEST_PATH, `${JSON.stringify(plan.manifest, null, 2)}\n`);
  return { written: plan.written, retained, backup };
}

export function applyFilePlan(
  root: string,
  files: PlannedFile[],
  options: FilePlanOptions & { dryRun: boolean },
): { written: string[]; retained: string[]; backup: string | undefined } {
  const plan = prepareFilePlan(root, files, options);
  if (options.dryRun) {
    if (plan.conflicts.length && !options.force)
      throw new Error(
        `Local file conflicts; no files written:\n${plan.conflicts.join('\n')}\nUse --keep-local to preserve, or --force to back up and replace.`,
      );
    return { written: plan.written, retained: plan.retained, backup: undefined };
  }
  return applyPreparedFilePlan(root, plan, options);
}

export function pruneEmptyParents(root: string, file: string): void {
  let parent = dirname(join(root, file));
  while (parent !== resolve(root) && relative(resolve(root), parent) && existsSync(parent)) {
    if (lstatSync(parent).isSymbolicLink() || readdirSync(parent).length) break;
    rmdirSync(parent);
    parent = dirname(parent);
  }
}
