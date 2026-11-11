import { lstatSync, mkdirSync, readFileSync, statSync, symlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, isAbsolute, join, parse, relative, resolve } from 'node:path';

export type ClaudeMemoryPlan = {
  scope: 'user-home';
  requested: boolean;
  destination: string | null;
  target: string;
  action: 'none' | 'create-link' | 'preserve';
  status:
    | 'missing'
    | 'linked'
    | 'legacy'
    | 'copy'
    | 'wrong-target'
    | 'broken'
    | 'unsafe'
    | 'ambiguous'
    | 'unsupported'
    | 'ready'
    | 'created'
    | 'failed';
  reason: string;
  legacy_paths: string[];
  alternate_paths: string[];
  link_type: 'symlink' | 'junction';
  blocking: boolean;
  inspection: {
    project_root: string;
    home_dir: string | null;
    config_dir: string | null;
    config_origin: 'explicit' | 'environment' | 'home';
    environment: 'process' | 'explicit';
  };
};

export type ClaudeMemoryOptions = {
  projectRoot: string;
  requested?: boolean;
  homeDir?: string;
  configDir?: string;
  env?: NodeJS.ProcessEnv;
};

/** Observed in Claude Code 2.1.263; this is an adapter, not a stable public API. */
export function claudeProjectSlug(absolutePath: string): string {
  const slug = absolutePath.replace(/[^a-zA-Z0-9]/g, '-');
  if (slug.length <= 200) return slug;
  let hash = 0;
  for (let i = 0; i < absolutePath.length; i++)
    hash = (Math.imul(31, hash) + absolutePath.charCodeAt(i)) | 0;
  return `${slug.slice(0, 200)}-${Math.abs(hash).toString(36)}`;
}

function nativeAbsolute(path: string): boolean {
  return (
    isAbsolute(path) &&
    (process.platform !== 'win32' || /^(?:[a-zA-Z]:[\\/]|\\\\[^\\]+\\[^\\]+)/.test(path))
  );
}

function entry(path: string) {
  try {
    return lstatSync(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

function sameIdentity(left: string, right: string, follow: boolean): boolean {
  const read = follow ? statSync : lstatSync;
  const a = read(left, { bigint: true });
  const b = read(right, { bigint: true });
  return a.ino !== 0n && b.ino !== 0n && a.dev === b.dev && a.ino === b.ino;
}

/** No linked ancestor, even a dangling one, is followed when inspecting a mirror. */
function checkAncestors(path: string, includeLeaf = false): void {
  if (!nativeAbsolute(path) || path.includes('\0')) throw new Error('Expected an absolute path.');
  const absolute = resolve(path);
  const root = parse(absolute).root;
  let current = root;
  const parts = relative(root, absolute).split(/[\\/]/).filter(Boolean);
  if (!includeLeaf) parts.pop();
  for (const part of parts) {
    current = join(current, part);
    const stat = entry(current);
    if (stat && (!stat.isDirectory() || stat.isSymbolicLink()))
      throw new Error(`Linked or non-directory ancestor: ${current}`);
  }
}

function oldSlug(path: string): string {
  return path
    .replace(/^[\\/]+/, '')
    .replace(/[:\\/]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function rootVariants(projectRoot: string): string[] {
  if (!/^[a-zA-Z]:[\\/]/.test(projectRoot)) return [];
  return [
    projectRoot[0]?.toLowerCase() + projectRoot.slice(1),
    projectRoot[0]?.toUpperCase() + projectRoot.slice(1),
  ].filter((value) => value !== projectRoot);
}

/** Known local overrides are not resolved using a guessed trust/precedence policy. */
function configuredOverride(
  projectRoot: string,
  configDir: string,
  env: NodeJS.ProcessEnv,
): string | null {
  for (const name of [
    'CLAUDE_CODE_PROJECT_DIR_NAME',
    'CLAUDE_CODE_REMOTE_MEMORY_DIR',
    'CLAUDE_COWORK_MEMORY_PATH_OVERRIDE',
    'CLAUDE_CODE_AUTO_MEMORY_PATH',
  ]) {
    if (env[name]) return `${name} is set; inspect Claude Code /memory for the active directory.`;
  }
  for (const path of [
    join(configDir, 'settings.json'),
    join(projectRoot, '.claude/settings.json'),
    join(projectRoot, '.claude/settings.local.json'),
  ]) {
    checkAncestors(path);
    const stat = entry(path);
    if (!stat) continue;
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 131072)
      return `Cannot safely inspect settings: ${path}`;
    let settings: unknown;
    try {
      settings = JSON.parse(readFileSync(path, 'utf8'));
    } catch {
      return `Cannot parse settings: ${path}`;
    }
    if (settings && typeof settings === 'object' && 'autoMemoryDirectory' in settings)
      return `autoMemoryDirectory is configured in ${path}; inspect Claude Code /memory instead of creating a default mirror.`;
  }
  const git = entry(join(projectRoot, '.git'));
  if (git?.isFile())
    return 'A linked worktree or separate git directory may share the main repository memory; inspect Claude Code /memory before linking.';
  return null;
}

/** Read-only preview. Default layout only; no settings or native session are changed. */
export function planClaudeMemory(options: ClaudeMemoryOptions): ClaudeMemoryPlan {
  const requested = options.requested ?? false;
  const target = join(options.projectRoot, '.agents/memory');
  const plan: ClaudeMemoryPlan = {
    scope: 'user-home',
    requested,
    destination: null,
    target,
    action: 'none',
    status: 'missing',
    reason: 'Default Claude Code memory mirror is absent. No user-home mutation is requested.',
    legacy_paths: [],
    alternate_paths: [],
    link_type: process.platform === 'win32' ? 'junction' : 'symlink',
    blocking: false,
    inspection: {
      project_root: options.projectRoot,
      home_dir: null,
      config_dir: null,
      config_origin:
        options.configDir !== undefined
          ? 'explicit'
          : (options.env ?? process.env).CLAUDE_CONFIG_DIR !== undefined
            ? 'environment'
            : 'home',
      environment: options.env === undefined ? 'process' : 'explicit',
    },
  };
  const stop = (status: ClaudeMemoryPlan['status'], reason: string): ClaudeMemoryPlan => ({
    ...plan,
    status,
    reason,
    action: requested ? 'preserve' : 'none',
    blocking: requested,
  });
  try {
    const env = options.env ?? process.env;
    const home = options.homeDir ?? homedir();
    if (!nativeAbsolute(home) || home.includes('\0'))
      return stop(
        'unsafe',
        'Claude home must be an absolute path; no relative fallback is allowed.',
      );
    if (!nativeAbsolute(options.projectRoot))
      return stop('unsafe', 'Project root must be an absolute native path.');
    const config = options.configDir ?? env.CLAUDE_CONFIG_DIR ?? join(home, '.claude');
    plan.inspection.home_dir = home;
    plan.inspection.config_dir = config;
    if (
      !nativeAbsolute(config) ||
      config.includes('\0') ||
      resolve(config) === parse(resolve(config)).root
    )
      return stop(
        'unsafe',
        'CLAUDE_CONFIG_DIR must be an absolute directory below the filesystem root.',
      );
    const destination = join(config, 'projects', claudeProjectSlug(options.projectRoot), 'memory');
    plan.destination = destination;
    const overlap = relative(resolve(target), resolve(destination));
    if (!overlap || (!overlap.startsWith('..') && !isAbsolute(overlap)))
      return stop('unsafe', 'Mirror destination must not be inside shared memory.');
    checkAncestors(destination);
    checkAncestors(target, true);
    const override = configuredOverride(options.projectRoot, config, env);
    if (override) return stop('unsupported', override);
    const variants = rootVariants(options.projectRoot);
    const alternates = [
      ...new Set(
        variants.map((root) => join(config, 'projects', claudeProjectSlug(root), 'memory')),
      ),
    ];
    const legacy = [
      ...new Set(
        [options.projectRoot, ...variants].map((root) =>
          join(config, 'projects', oldSlug(root), 'memory'),
        ),
      ),
    ];
    for (const path of [...alternates, ...legacy]) checkAncestors(path);
    plan.legacy_paths = legacy.filter((path) => path !== destination && entry(path));
    plan.alternate_paths = alternates.filter((path) => entry(path));
    const stat = entry(destination);
    // On case-insensitive Windows, differing drive-letter candidates name the same entry.
    const distinctAlternates = plan.alternate_paths.filter((path) => {
      if (!stat) return true;
      try {
        // Windows realpath can retain input casing for ordinary directories. Compare entries,
        // including junctions, without losing precision in Windows file IDs.
        return !sameIdentity(path, destination, false);
      } catch {
        return true;
      }
    });
    if (distinctAlternates.length)
      return stop(
        'ambiguous',
        'A different drive-case mirror exists. Preserve all mirrors and verify the directory with Claude Code /memory.',
      );
    if (stat) {
      if (!stat.isSymbolicLink())
        return stop(
          'copy',
          'Existing memory directory is user-owned (possibly a copy); it is preserved and not synchronized.',
        );
      try {
        if (sameIdentity(destination, target, true)) {
          plan.status = 'linked';
          plan.reason =
            'Expected symlink or Windows junction targets the shared memory. No mirror write is needed; native loading is not verified.';
          return plan;
        }
        return stop('wrong-target', 'Existing mirror points elsewhere; it is preserved.');
      } catch {
        return stop(
          'broken',
          'Existing mirror is broken or its target cannot be inspected; it is preserved.',
        );
      }
    }
    if (plan.legacy_paths.length)
      return stop(
        'legacy',
        'Only an old Build Kit slug mirror exists. It is preserved; inspect and reconcile it explicitly.',
      );
    if (requested) {
      plan.status = 'ready';
      plan.action = 'create-link';
      plan.reason =
        'Explicitly requested creation of the shown default-layout memory link. No copy fallback; native loading is not verified.';
    }
    return plan;
  } catch (error) {
    return stop('unsafe', (error as Error).message);
  }
}

/** Apply the already previewed link only; never overwrite an existing user entry. */
export function applyClaudeMemory(plan: ClaudeMemoryPlan): ClaudeMemoryPlan {
  if (!plan.requested || plan.action !== 'create-link' || !plan.destination) return plan;
  try {
    const context = plan.inspection;
    if (!context.home_dir || !context.config_dir)
      throw new Error('Missing mirror inspection context.');
    const current = planClaudeMemory({
      projectRoot: context.project_root,
      requested: true,
      homeDir: context.home_dir,
      ...(context.config_origin === 'explicit' || context.environment === 'explicit'
        ? { configDir: context.config_dir }
        : {}),
      ...(context.environment === 'explicit' ? { env: {} } : {}),
    });
    if (
      current.action !== 'create-link' ||
      current.blocking ||
      current.destination !== plan.destination ||
      current.target !== plan.target
    )
      throw new Error(
        `Mirror inspection changed after preview: ${current.status}. ${current.reason}`,
      );
    checkAncestors(plan.destination);
    checkAncestors(plan.target, true);
    if (!entry(plan.target)?.isDirectory())
      throw new Error('Shared memory target is not a directory.');
    if (entry(plan.destination))
      throw new Error('Mirror destination appeared after preview; preserve it and re-plan.');
    mkdirSync(dirname(plan.destination), { recursive: true });
    checkAncestors(plan.destination);
    symlinkSync(plan.target, plan.destination, process.platform === 'win32' ? 'junction' : 'dir');
    return {
      ...plan,
      action: 'none',
      status: 'created',
      reason: 'Created the requested memory link. Native Claude Code loading is not verified.',
    };
  } catch (error) {
    return {
      ...plan,
      action: 'preserve',
      status: 'failed',
      blocking: true,
      reason: `Memory link was not created; no copy fallback: ${(error as Error).message}`,
    };
  }
}
