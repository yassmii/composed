import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { KIT_VERSION } from './types.ts';

const MAX_FILES = 512;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_TOTAL_BYTES = 16 * 1024 * 1024;
const MAX_ENTRIES = 2048;
const HASH = /^[a-f0-9]{64}$/;
const VERSION = /^\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?$/;
const SOURCE_TREES = ['src/cli', 'bin', 'bridges', 'skills', 'migrations'] as const;
const SOURCE_FILES = ['package.json', 'memory/MEMORY.md', 'memory/_README.md', 'work/README.md'];

/** Source identity is a local observation, not authentication or dependency/runtime attestation. */
export type SourceProvenance = {
  format_version: 1;
  scheme: 'sha256-crlf-normalized-v1';
  scope: 'build-kit-delivery-source';
  kit_version: string;
  catalog_version: string;
  content_sha256: string;
  files: Record<string, string>;
  git: { revision: string | null; worktree: 'clean' | 'modified' | 'unknown' };
  dependency_lock: 'included' | 'not_available';
  dependencies: 'not_verified';
};

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

function contentHash(files: Record<string, string>): string {
  return sha256(
    JSON.stringify(Object.entries(files).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))),
  );
}

function safePart(part: string): boolean {
  return (
    !!part &&
    part !== '.' &&
    part !== '..' &&
    !part.includes('\\') &&
    !Array.from(part).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)
  );
}

function sourceLabel(label: string): boolean {
  if (label.length > 1024 || !label.split('/').every(safePart)) return false;
  if (['workspace/package.json', 'workspace/package-lock.json'].includes(label)) return true;
  if (!label.startsWith('kit/')) return false;
  const path = label.slice(4);
  return SOURCE_FILES.includes(path) || SOURCE_TREES.some((tree) => path.startsWith(`${tree}/`));
}

/** The bounded full map is retained so consumers can independently recheck the declared files. */
export function validateSourceProvenance(value: unknown): asserts value is SourceProvenance {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid source provenance.');
  const p = value as Partial<SourceProvenance>;
  if (
    p.format_version !== 1 ||
    p.scheme !== 'sha256-crlf-normalized-v1' ||
    p.scope !== 'build-kit-delivery-source' ||
    p.dependencies !== 'not_verified' ||
    typeof p.kit_version !== 'string' ||
    !VERSION.test(p.kit_version) ||
    typeof p.catalog_version !== 'string' ||
    !VERSION.test(p.catalog_version) ||
    typeof p.content_sha256 !== 'string' ||
    !HASH.test(p.content_sha256) ||
    !['included', 'not_available'].includes(p.dependency_lock ?? '') ||
    !p.files ||
    typeof p.files !== 'object' ||
    Array.isArray(p.files) ||
    !p.git ||
    typeof p.git !== 'object' ||
    Array.isArray(p.git) ||
    !['clean', 'modified', 'unknown'].includes(p.git.worktree) ||
    (p.git.revision !== null &&
      (typeof p.git.revision !== 'string' ||
        !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(p.git.revision))) ||
    (p.git.worktree === 'unknown' ? p.git.revision !== null : p.git.revision === null)
  )
    throw new Error('Invalid source provenance fields.');
  const files = Object.entries(p.files);
  if (
    !files.length ||
    files.length > MAX_FILES ||
    files.some(([path, hash]) => !sourceLabel(path) || typeof hash !== 'string' || !HASH.test(hash))
  )
    throw new Error('Invalid source provenance file map.');
  for (const path of [...SOURCE_FILES, 'skills/catalog.json'])
    if (!Object.hasOwn(p.files, `kit/${path}`))
      throw new Error('Incomplete source provenance file map.');
  const locked = Object.hasOwn(p.files, 'workspace/package-lock.json');
  if (
    locked !== (p.dependency_lock === 'included') ||
    (locked && !Object.hasOwn(p.files, 'workspace/package.json'))
  )
    throw new Error('Invalid source provenance dependency scope.');
  if (p.content_sha256 !== contentHash(p.files))
    throw new Error('Source provenance fingerprint does not match its file map.');
}

export function isSourceProvenance(value: unknown): value is SourceProvenance {
  try {
    validateSourceProvenance(value);
    return true;
  } catch {
    return false;
  }
}

/** A template/source override must not claim a different CLI as the executing implementation. */
export function collectInstallationSource(kitRoot: string): SourceProvenance {
  const source = collectSourceProvenance(kitRoot);
  if (source.kit_version !== KIT_VERSION)
    throw new Error(
      'Selected kit source version differs from the executing CLI. Use its matching CLI.',
    );
  const executingRoot = resolve(import.meta.dirname, '../..');
  if (resolve(kitRoot) !== executingRoot) {
    const executing = collectSourceProvenance(executingRoot);
    const code = (value: SourceProvenance) =>
      Object.entries(value.files).filter(
        ([path]) => path.startsWith('kit/src/cli/') || path.startsWith('kit/bin/'),
      );
    if (JSON.stringify(code(source)) !== JSON.stringify(code(executing)))
      throw new Error(
        'Selected kit CLI/bin sources differ from the executing CLI. Use its matching CLI rather than mixing roots.',
      );
  }
  return source;
}

function gitObservation(kitRoot: string, workspaceFiles: string[]): SourceProvenance['git'] {
  const unknown: SourceProvenance['git'] = {
    revision: null,
    worktree: 'unknown',
  };
  // Do not inherit GIT_DIR/WORK_TREE/index overrides or configuration injection from the caller.
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith('GIT_')),
  );
  Object.assign(env, {
    GIT_OPTIONAL_LOCKS: '0',
    GIT_CONFIG_NOSYSTEM: '1',
    // Git for Windows rejects Node's \\.\nul device spelling with EINVAL.
    GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null',
    GIT_NO_REPLACE_OBJECTS: '1',
  });
  const git = (args: string[]) =>
    execFileSync(
      'git',
      ['-c', 'core.fsmonitor=false', '-c', 'core.untrackedCache=false', '-C', kitRoot, ...args],
      {
        env,
        encoding: 'utf8',
        timeout: 3000,
        maxBuffer: 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    ).trim();
  try {
    // A packed/installed kit inside another repository must not claim that consumer's revision.
    git(['ls-files', '--error-unmatch', '--', 'package.json']);
    const revision = git(['rev-parse', '--verify', 'HEAD']);
    if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(revision)) return unknown;
    const status = git([
      'status',
      '--porcelain=v1',
      '-z',
      '--untracked-files=all',
      '--',
      ...SOURCE_TREES,
      ...SOURCE_FILES,
      ...workspaceFiles,
    ]);
    return { revision, worktree: status ? 'modified' : 'clean' };
  } catch {
    return unknown;
  }
}

export function collectSourceProvenance(kitRoot: string): SourceProvenance {
  const root = resolve(kitRoot);
  const rootStat = lstatSync(root);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink())
    throw new Error('Source root must be an ordinary directory.');
  const files: Record<string, string> = {};
  const texts = new Map<string, string>();
  let totalBytes = 0;
  let entries = 0;
  const add = (absolute: string, label: string): void => {
    if (Object.keys(files).length >= MAX_FILES)
      throw new Error('Source provenance file limit exceeded.');
    const stat = lstatSync(absolute);
    if (!stat.isFile() || stat.isSymbolicLink())
      throw new Error(`Source provenance requires ordinary files: ${label}`);
    if (stat.size > MAX_FILE_BYTES || totalBytes + stat.size > MAX_TOTAL_BYTES)
      throw new Error('Source provenance byte limit exceeded.');
    const bytes = readFileSync(absolute);
    if (bytes.length > MAX_FILE_BYTES || totalBytes + bytes.length > MAX_TOTAL_BYTES)
      throw new Error('Source provenance byte limit exceeded.');
    totalBytes += bytes.length;
    const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true })
      .decode(bytes)
      .replace(/\r\n/g, '\n');
    if (text.includes('\0')) throw new Error(`Source provenance requires UTF-8 text: ${label}`);
    files[label] = sha256(text);
    if (label.endsWith('/package.json') || label === 'kit/skills/catalog.json')
      texts.set(label, text);
  };
  const walk = (absolute: string, label: string, depth: number): void => {
    if (depth > 16 || !sourceLabel(`${label}/entry`))
      throw new Error('Unsafe source provenance path.');
    const stat = lstatSync(absolute);
    if (stat.isSymbolicLink() || !stat.isDirectory())
      throw new Error(`Source provenance requires ordinary directories: ${label}`);
    const names = readdirSync(absolute).sort();
    entries += names.length;
    if (names.length > MAX_FILES || entries > MAX_ENTRIES)
      throw new Error('Source provenance entry limit exceeded.');
    for (const name of names) {
      if (!safePart(name) || name.length > 255)
        throw new Error('Unsafe source provenance filename.');
      const path = join(absolute, name);
      const next = `${label}/${name}`;
      const entry = lstatSync(path);
      if (entry.isSymbolicLink())
        throw new Error(`Source provenance refuses linked paths: ${next}`);
      if (entry.isDirectory()) walk(path, next, depth + 1);
      else add(path, next);
    }
  };
  for (const tree of SOURCE_TREES) {
    // Check the src ancestor as well as src/cli, rather than following a linked parent.
    let ancestor = root;
    for (const part of tree.split('/')) {
      ancestor = join(ancestor, part);
      const stat = lstatSync(ancestor);
      if (stat.isSymbolicLink() || !stat.isDirectory())
        throw new Error(`Source provenance refuses linked ancestors: ${tree}`);
    }
    walk(join(root, tree), `kit/${tree}`, 0);
  }
  for (const file of SOURCE_FILES) {
    const parts = file.split('/');
    let ancestor = root;
    for (const part of parts.slice(0, -1)) {
      ancestor = join(ancestor, part);
      const stat = lstatSync(ancestor);
      if (stat.isSymbolicLink() || !stat.isDirectory())
        throw new Error(`Source provenance refuses linked ancestors: ${file}`);
    }
    add(join(root, file), `kit/${file}`);
  }
  const workspaceFiles: string[] = [];
  const parent = dirname(root);
  const parentPackage = join(parent, 'package.json');
  try {
    const stat = lstatSync(parentPackage);
    if (stat.isSymbolicLink() || !stat.isFile())
      throw new Error('Source workspace manifest must be an ordinary file.');
    if (stat.size > MAX_FILE_BYTES)
      throw new Error('Source workspace manifest byte limit exceeded.');
    const pkg = JSON.parse(
      new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(
        readFileSync(parentPackage),
      ),
    );
    const workspaces = Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces?.packages;
    if (Array.isArray(workspaces) && workspaces.includes(basename(root))) {
      add(parentPackage, 'workspace/package.json');
      workspaceFiles.push('../package.json');
      try {
        add(join(parent, 'package-lock.json'), 'workspace/package-lock.json');
        workspaceFiles.push('../package-lock.json');
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  const kit = JSON.parse(texts.get('kit/package.json') ?? 'null');
  const catalog = JSON.parse(texts.get('kit/skills/catalog.json') ?? 'null');
  const result: SourceProvenance = {
    format_version: 1,
    scheme: 'sha256-crlf-normalized-v1',
    scope: 'build-kit-delivery-source',
    kit_version: kit?.version,
    catalog_version: catalog?.version,
    content_sha256: contentHash(files),
    files: Object.fromEntries(
      Object.entries(files).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
    ),
    git: gitObservation(root, workspaceFiles),
    dependency_lock: Object.hasOwn(files, 'workspace/package-lock.json')
      ? 'included'
      : 'not_available',
    dependencies: 'not_verified',
  };
  validateSourceProvenance(result);
  return result;
}
