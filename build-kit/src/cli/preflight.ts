import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';

type ProbeFinding = { id: string; message: string; remediation: string };
export type WriteProbe = {
  path: string;
  status: 'passed' | 'blocked';
  write_read: 'passed' | 'not_performed' | 'failed';
  cleanup: 'passed' | 'failed' | 'not_needed';
  residual_paths: string[];
  findings: ProbeFinding[];
};

export type PreflightResult = {
  format_version: 1;
  scope: 'local-write-probes';
  status: 'passed' | 'blocked';
  runtime_readiness: 'not_assessed';
  context: { cwd: string; node: string; platform: string; observed_at: string };
  session_capabilities: {
    native_delegation: 'unknown';
    independent_review: 'unknown';
    account_quota: 'unknown';
  };
  probes: WriteProbe[];
  limitations: string[];
};

const metadata = new Set(['.git', '.hg', '.svn']);

function pathParts(value: string): string[] {
  if (value === '.') return [];
  const parts = value.split('/');
  if (
    value.length > 4096 ||
    parts.length > 32 ||
    isAbsolute(value) ||
    value.includes('\\') ||
    parts.some(
      (part) =>
        !part ||
        part === '.' ||
        part === '..' ||
        /[<>:"|?*]/.test(part) ||
        [...part].some((character) => character.charCodeAt(0) < 32) ||
        /[. ]$/.test(part) ||
        /^(con|prn|aux|nul|conin\$|conout\$|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(part) ||
        metadata.has(part.toLowerCase()),
    )
  )
    throw new Error(`Unsafe project-relative write path: ${value}`);
  return parts;
}

export function preflightOptions(args: string[]): {
  cwd: string;
  writePaths: string[];
  json: boolean;
} {
  const seen = new Set<string>();
  const writePaths: string[] = [];
  let cwd = process.cwd();
  let json = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) throw new Error('Empty preflight option.');
    const equals = arg.indexOf('=');
    const key = equals === -1 ? arg : arg.slice(0, equals);
    if (key !== '--write-path' && seen.has(key)) throw new Error(`Supply ${key} only once.`);
    seen.add(key);
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (key !== '--cwd' && key !== '--write-path')
      throw new Error(`Unknown preflight option: ${arg}`);
    const value = equals === -1 ? args[++i] : arg.slice(equals + 1);
    if (!value || value.startsWith('--')) throw new Error(`${key} requires a value.`);
    if (key === '--cwd') cwd = resolve(value);
    else {
      pathParts(value);
      if (writePaths.some((path) => path.toLowerCase() === value.toLowerCase()))
        throw new Error(`Duplicate or case-aliased write path: ${value}`);
      writePaths.push(value);
    }
  }
  if (writePaths.length === 0 || writePaths.length > 16)
    throw new Error('Supply between one and sixteen explicit --write-path directories.');
  return { cwd, writePaths, json };
}

function sameFile(left: fs.Stats, right: fs.Stats): boolean {
  return left.dev === right.dev && left.ino === right.ino;
}

function inspectDirectory(root: string, identity: fs.Stats, parts: string[]): string {
  const rootNow = fs.lstatSync(root);
  if (rootNow.isSymbolicLink() || !rootNow.isDirectory() || !sameFile(rootNow, identity))
    throw new Error('Project root changed during the probe.');
  let current = root;
  for (const part of parts) {
    const alias = fs
      .readdirSync(current)
      .find((name) => name !== part && name.toLowerCase() === part.toLowerCase());
    if (alias) throw new Error(`Case-aliased directory: ${join(current, alias)}`);
    current = join(current, part);
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink() || !stat.isDirectory())
      throw new Error(`Expected an ordinary directory: ${current}`);
  }
  return current;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function probeDirectory(root: string, identity: fs.Stats, path: string): WriteProbe {
  const parts = pathParts(path);
  const result: WriteProbe = {
    path,
    status: 'blocked',
    write_read: 'not_performed',
    cleanup: 'not_needed',
    residual_paths: [],
    findings: [],
  };
  const created: { parts: string[]; identity: fs.Stats | undefined }[] = [];
  let probe: { path: string; identity: fs.Stats | undefined } | undefined;
  let descriptor: number | undefined;
  try {
    for (let index = 0; index < parts.length; index++) {
      const parent = inspectDirectory(root, identity, parts.slice(0, index));
      const part = parts[index] as string;
      const destination = join(parent, part);
      // Check case aliases before creating an absent segment on a case-sensitive host.
      if (
        fs
          .readdirSync(parent)
          .some((name) => name !== part && name.toLowerCase() === part.toLowerCase())
      )
        throw new Error(`Case-aliased directory: ${destination}`);
      try {
        fs.lstatSync(destination);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
        fs.mkdirSync(destination, { mode: 0o700 });
        const owned = {
          parts: parts.slice(0, index + 1),
          identity: undefined as fs.Stats | undefined,
        };
        created.push(owned);
        owned.identity = fs.lstatSync(destination);
      }
      inspectDirectory(root, identity, parts.slice(0, index + 1));
    }
    const target = inspectDirectory(root, identity, parts);
    const file = join(target, `.composed-preflight-${randomUUID()}.tmp`);
    result.write_read = 'failed';
    descriptor = fs.openSync(file, 'wx+', 0o600);
    probe = { path: file, identity: undefined };
    probe.identity = fs.fstatSync(descriptor);
    const payload = Buffer.from(`composed-preflight:${randomUUID()}\n`);
    fs.writeFileSync(descriptor, payload);
    const observed = Buffer.alloc(payload.length);
    if (
      fs.readSync(descriptor, observed, 0, observed.length, 0) !== payload.length ||
      !observed.equals(payload)
    )
      throw new Error('Probe read did not match its written bytes.');
    result.write_read = 'passed';
  } catch (error) {
    result.findings.push({
      id: 'probe.write_read_failed',
      message: errorMessage(error),
      remediation:
        'Inspect the selected path and the actual tool/sandbox permissions. Resolve the required access before dependent work; do not relocate evidence or bypass the policy silently.',
    });
  } finally {
    const cleanupFailure = (path: string, error: unknown) => {
      result.cleanup = 'failed';
      const residual = relative(root, path).split(sep).join('/');
      if (!result.residual_paths.includes(residual)) result.residual_paths.push(residual);
      result.findings.push({
        id: 'probe.cleanup_failed',
        message: `${path}: ${errorMessage(error)}`,
        remediation:
          'Inspect the remaining path and ownership before any manual cleanup. Existing or concurrently added content was preserved.',
      });
    };
    if (descriptor !== undefined) {
      try {
        fs.closeSync(descriptor);
      } catch (error) {
        cleanupFailure(probe?.path ?? root, error);
      }
    }
    if (probe) {
      if (result.cleanup !== 'failed') result.cleanup = 'passed';
      try {
        inspectDirectory(root, identity, parts);
        const current = fs.lstatSync(probe.path);
        if (
          !probe.identity ||
          current.isSymbolicLink() ||
          !current.isFile() ||
          !sameFile(current, probe.identity)
        )
          cleanupFailure(
            probe.path,
            new Error('Probe path ownership changed; refusing to delete it.'),
          );
        else fs.unlinkSync(probe.path);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') cleanupFailure(probe.path, error);
      }
    }
    for (const directory of created.reverse()) {
      const absolute = join(root, ...directory.parts);
      if (result.cleanup !== 'failed') result.cleanup = 'passed';
      try {
        inspectDirectory(root, identity, directory.parts);
        if (!directory.identity || !sameFile(fs.lstatSync(absolute), directory.identity))
          cleanupFailure(
            absolute,
            new Error('Directory ownership changed; refusing to delete it.'),
          );
        else fs.rmdirSync(absolute);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') cleanupFailure(absolute, error);
      }
    }
  }
  if (result.write_read === 'passed' && result.cleanup === 'passed') result.status = 'passed';
  return result;
}

export async function runPreflight(args: string[]): Promise<PreflightResult> {
  const options = preflightOptions(args);
  const initial = fs.lstatSync(options.cwd);
  if (initial.isSymbolicLink() || !initial.isDirectory())
    throw new Error('Select an existing ordinary project root directory.');
  // Canonicalize ancestors (e.g. macOS /var) while refusing a linked root itself.
  const cwd = fs.realpathSync(options.cwd);
  if (cwd.split(sep).some((part) => metadata.has(part.toLowerCase())))
    throw new Error('Source-control metadata is not a project root.');
  const identity = fs.lstatSync(cwd);
  const probes = options.writePaths.map((path) => probeDirectory(cwd, identity, path));
  const result: PreflightResult = {
    format_version: 1,
    scope: 'local-write-probes',
    status: probes.every((probe) => probe.status === 'passed') ? 'passed' : 'blocked',
    runtime_readiness: 'not_assessed',
    context: {
      cwd,
      node: process.version,
      platform: process.platform,
      observed_at: new Date().toISOString(),
    },
    session_capabilities: {
      native_delegation: 'unknown',
      independent_review: 'unknown',
      account_quota: 'unknown',
    },
    probes,
    limitations: [
      'Only the selected directory create/write/read/delete probes were attempted, in this process context at the observed time.',
      'Run through the same agent tool and sandbox intended for work. An outer-shell success does not establish agent write access.',
      'Standalone CLI cannot observe native session delegation, reviewer independence or account quota; runtime readiness is not assessed.',
      'No existing project content or permissions are changed. Missing directories may be created transiently; cleanup removes only owned files and still-empty directories.',
      'Link and identity checks cover conventional filesystem changes; they are not an adversarial race-proof OS sandbox.',
    ],
  };
  if (options.json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log('Scope: local write probes only. Overall runtime readiness is not assessed.');
    for (const probe of probes) {
      console.log(`${probe.status === 'passed' ? '✓' : '✗'} ${probe.path}: ${probe.status}`);
      for (const finding of probe.findings)
        console.log(`  [${finding.id}] ${finding.message}\n  ${finding.remediation}`);
    }
    console.log('Native delegation, independent review and account quota: unknown.');
  }
  return result;
}
