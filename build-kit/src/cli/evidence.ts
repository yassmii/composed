import { spawn, spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { KIT_VERSION } from './types.ts';

const MAX_REPORT_BYTES = 1024 * 1024;
const MAX_SUBJECT_BYTES = 16 * 1024 * 1024;
const MAX_SUBJECTS = 256;
const MAX_OUTPUT_BYTES = 128 * 1024;
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_TIMEOUT_MS = 300_000;
const DIGEST = /^[a-f0-9]{64}$/;
const LIMITATIONS = [
  'Unsigned local receipts establish consistency, not executor identity or authentic approval.',
  'Applicability covers the explicitly listed subject files, not undeclared dependencies or the full environment.',
  'Subject identity is sampled before and after execution; temporary changes restored before the final snapshot are not detected.',
  "Commands run with the caller's permissions; this is not a sandbox or a descendant-process supervisor.",
  'Review identities and context are declarations; independent review and human authority are not authenticated here.',
];

export type EvidenceSubject = { path: string; sha256: string; bytes: number };
export type EvidenceExecution = {
  executable: string;
  args: string[];
  started_at: string | null;
  finished_at: string | null;
  status: 'passed' | 'failed' | 'blocked' | 'not_run';
  exit_code: number | null;
  signal: string | null;
  error: string | null;
  duration_ms: number;
  duration_source?: 'monotonic';
  wall_clock_regressed?: boolean;
  stdout: string;
  stderr: string;
  output_truncated: boolean;
};
export type EvidenceReceipt = {
  format_version: 1;
  kind: 'local-command-receipt';
  id: string;
  kit_version: string;
  requirement_ids: string[];
  acceptance_ids: string[];
  subjects: EvidenceSubject[];
  subject_digest: string;
  repository: { head: string | null; subjects_dirty: boolean | null };
  runtime: { node: string; platform: string; arch: string };
  execution: EvidenceExecution;
  limitations: string[];
};

export type EvidenceReview = {
  format_version: 1;
  kind: 'local-review-declaration';
  receipt_sha256: string;
  subject_digest: string;
  author: string;
  reviewer: string;
  author_context: string;
  reviewer_context: string;
  mode: 'native-subagent' | 'fresh-session' | 'self-review';
  verdict: 'accepted' | 'return_needed' | 'blocked';
};

export type EvidenceReport = {
  format_version: 1;
  scope: 'local-command-evidence';
  healthy: boolean;
  receipt: string;
  recorded_status: EvidenceExecution['status'];
  applicability: 'current' | 'stale' | 'invalid';
  subject_digest: string;
  findings: { id: string; message: string }[];
  review: {
    applicability: 'not_provided' | 'current' | 'stale' | 'invalid';
    independence: 'not_assessed' | 'declared' | 'self_review';
  };
  closure: 'not_assessed';
  limitations: string[];
};

type Options = {
  root: string;
  json: boolean;
  subjects: string[];
  requirements: string[];
  acceptances: string[];
  output?: string;
  evidence?: string;
  review?: string;
  timeout: number;
  command: string[];
};

function sha256(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

/** Receipt paths use a portable project-relative slash form; no links are traversed. */
export function evidencePath(root: string, relative: string, allowMissing = false): string {
  if (
    !relative ||
    relative.includes('\\') ||
    relative.includes('\0') ||
    isAbsolute(relative) ||
    /^[A-Za-z]:/.test(relative) ||
    relative.split('/').some((part) => !part || part === '.' || part === '..')
  )
    throw new Error(`Invalid project-relative evidence path: ${relative}`);
  let current = root;
  const parts = relative.split('/');
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    try {
      const stat = lstatSync(current);
      if (stat.isSymbolicLink()) throw new Error(`Linked evidence path refused: ${relative}`);
      if (index < parts.length - 1 && !stat.isDirectory()) {
        throw new Error(`Non-directory evidence ancestor: ${relative}`);
      }
      if (index === parts.length - 1 && !stat.isFile()) {
        throw new Error(`Evidence path must be an ordinary file: ${relative}`);
      }
    } catch (error) {
      if (allowMissing && (error as NodeJS.ErrnoException).code === 'ENOENT') continue;
      throw error;
    }
  }
  return current;
}

function snapshot(root: string, paths: string[]): EvidenceSubject[] {
  if (!paths.length || paths.length > MAX_SUBJECTS || new Set(paths).size !== paths.length) {
    throw new Error(`Select between 1 and ${MAX_SUBJECTS} unique subject paths.`);
  }
  return [...paths].sort().map((path) => {
    const filename = evidencePath(root, path);
    if (lstatSync(filename).size > MAX_SUBJECT_BYTES) {
      throw new Error(`Subject exceeds the ${MAX_SUBJECT_BYTES}-byte read limit: ${path}`);
    }
    const bytes = readFileSync(filename);
    return { path, sha256: sha256(bytes), bytes: bytes.length };
  });
}

export function subjectDigest(subjects: EvidenceSubject[]): string {
  return sha256(
    JSON.stringify([...subjects].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))),
  );
}

function repositoryState(root: string, paths: string[]): EvidenceReceipt['repository'] {
  const options = { cwd: root, encoding: 'utf8' as const, timeout: 2_000, maxBuffer: 64 * 1024 };
  const head = spawnSync('git', ['rev-parse', 'HEAD'], options);
  const value = head.status === 0 ? head.stdout.trim() : '';
  const revision = /^[a-f0-9]{40,64}$/.test(value) ? value : null;
  if (!revision) return { head: null, subjects_dirty: null };
  const state = spawnSync(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=normal', '--', ...paths],
    options,
  );
  return { head: revision, subjects_dirty: state.status === 0 ? !!state.stdout.trim() : null };
}

function parseOptions(args: string[], mode: 'run' | 'verify'): Options {
  const options: Options = {
    root: process.cwd(),
    json: false,
    subjects: [],
    requirements: [],
    acceptances: [],
    timeout: DEFAULT_TIMEOUT_MS,
    command: [],
  };
  const seen = new Set<string>();
  for (let index = 0; index < args.length; index++) {
    const item = args[index];
    if (!item) continue;
    if (item === '--' && mode === 'run') {
      options.command = args.slice(index + 1);
      break;
    }
    if (item === '--json') {
      options.json = true;
      continue;
    }
    const separator = item.indexOf('=');
    const name = separator < 0 ? item : item.slice(0, separator);
    const allowed =
      mode === 'run'
        ? ['--cwd', '--subject', '--requirement', '--acceptance', '--output', '--timeout-ms']
        : ['--cwd', '--evidence', '--review'];
    if (!allowed.includes(name)) throw new Error(`Unknown ${mode} option: ${name}`);
    const value = separator < 0 ? args[++index] : item.slice(separator + 1);
    if (!value || value.startsWith('--')) throw new Error(`${name} requires a value.`);
    if (!['--subject', '--requirement', '--acceptance'].includes(name) && seen.has(name)) {
      throw new Error(`Supply ${name} only once.`);
    }
    seen.add(name);
    if (name === '--cwd') options.root = resolve(value);
    if (name === '--subject') options.subjects.push(value);
    if (name === '--requirement') options.requirements.push(value);
    if (name === '--acceptance') options.acceptances.push(value);
    if (name === '--output') options.output = value;
    if (name === '--evidence') options.evidence = value;
    if (name === '--review') options.review = value;
    if (name === '--timeout-ms') {
      const timeout = Number(value);
      if (
        !/^\d+$/.test(value) ||
        !Number.isSafeInteger(timeout) ||
        timeout < 1 ||
        timeout > MAX_TIMEOUT_MS
      ) {
        throw new Error(`--timeout-ms must be between 1 and ${MAX_TIMEOUT_MS}.`);
      }
      options.timeout = timeout;
    }
  }
  options.root = realpathSync(options.root);
  return options;
}

async function execute(
  command: string[],
  root: string,
  timeout: number,
): Promise<EvidenceExecution> {
  const executable = command[0];
  if (!executable) throw new Error('Supply an explicit executable after --.');
  const started = Date.now();
  const elapsedStart = performance.now();
  const result: EvidenceExecution = {
    executable,
    args: command.slice(1),
    started_at: new Date(started).toISOString(),
    finished_at: null,
    status: 'blocked',
    exit_code: null,
    signal: null,
    error: null,
    duration_ms: 0,
    duration_source: 'monotonic',
    wall_clock_regressed: false,
    stdout: '',
    stderr: '',
    output_truncated: false,
  };
  return new Promise((resolveResult) => {
    const child = spawn(executable, result.args, {
      cwd: root,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let settled = false;
    let collected = 0;
    let forcedFinish: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      if (forcedFinish) clearTimeout(forcedFinish);
      const finished = Date.now();
      result.finished_at = new Date(finished).toISOString();
      result.duration_ms = Math.max(0, Math.round(performance.now() - elapsedStart));
      result.wall_clock_regressed = finished < started;
      resolveResult(result);
    };
    const abort = (reason: string) => {
      if (result.error) return;
      result.error = reason;
      result.status = 'blocked';
      child.kill('SIGKILL');
      // Inherited pipes from descendants must not make this local recorder wait indefinitely.
      forcedFinish = setTimeout(() => {
        child.stdout.destroy();
        child.stderr.destroy();
        child.unref();
        result.error = `${reason}; descendant cleanup is not established`;
        finish();
      }, 250);
    };
    const deadline = setTimeout(() => abort('command timeout'), timeout);
    const collect = (field: 'stdout' | 'stderr', chunk: Buffer) => {
      if (settled) return;
      const remaining = Math.max(0, MAX_OUTPUT_BYTES - collected);
      result[field] += chunk.subarray(0, remaining).toString('utf8');
      collected += chunk.length;
      if (collected > MAX_OUTPUT_BYTES) {
        result.output_truncated = true;
        abort('command output limit exceeded');
      }
    };
    child.stdout.on('data', (chunk: Buffer) => collect('stdout', chunk));
    child.stderr.on('data', (chunk: Buffer) => collect('stderr', chunk));
    child.on('error', (error) => {
      result.error = error.message;
      finish();
    });
    child.on('close', (code, signal) => {
      result.exit_code = code;
      result.signal = signal;
      if (!result.error) result.status = code === 0 ? 'passed' : 'failed';
      finish();
    });
  });
}

function emit(report: EvidenceReport, json: boolean, operation: 'run' | 'verify'): void {
  if (json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(`Result: ${report.healthy ? 'current passing record' : 'evidence needs attention'}`);
  console.log(
    operation === 'run'
      ? 'Action: attempted the supplied check and recorded its result.'
      : 'Action: inspected existing evidence; no command executed.',
  );
  console.log(
    `Recorded check: ${report.applicability === 'invalid' ? 'untrusted (invalid receipt)' : report.recorded_status}; selected files: ${report.applicability}`,
  );
  console.log(
    report.review.applicability === 'not_provided'
      ? 'Review: not supplied; review requirements not assessed.'
      : `Review: ${report.review.applicability}; independence: ${report.review.independence} (not authenticated).`,
  );
  console.log(`Receipt: ${report.receipt}`);
  for (const finding of report.findings) console.log(`  ${finding.id}: ${finding.message}`);

  if (report.applicability === 'invalid') {
    console.log(
      'Next: resolve the receipt path, format or integrity finding before using this record.',
    );
  } else if (report.recorded_status === 'failed') {
    console.log(
      'Next: inspect execution.stdout/stderr in the receipt, fix the failure, then record a new check.',
    );
  } else if (report.recorded_status === 'blocked') {
    console.log('Next: resolve the execution blocker shown above, then record a new check.');
  } else if (report.recorded_status === 'not_run') {
    console.log('Next: run the intended authorised check and record a new receipt.');
  } else if (report.applicability === 'stale') {
    console.log(
      'Next: inspect changed or unavailable files, then record the intended check again. Keep the old receipt.',
    );
  }
  if (report.review.applicability === 'invalid') {
    console.log('Next: locate a valid review declaration and its supporting review evidence.');
  } else if (report.review.independence === 'self_review') {
    console.log(
      'Next: obtain an actual independent review of the current receipt and files in a fresh context.',
    );
  } else if (report.review.applicability === 'stale') {
    console.log('Next: obtain a review of the current receipt and files; keep the earlier review.');
  } else if (report.findings.some((finding) => finding.id === 'review.not_accepted')) {
    console.log('Next: resolve the recorded review verdict with the reviewer.');
  }
  if (report.healthy) {
    console.log(
      'Next: use this scoped result; complete any acceptance or review still required by the project.',
    );
  }
  console.log(
    'Scope: selected files and recorded command only. Product acceptance and closure are not assessed.',
  );
}

/** Execute only the explicit argv supplied by the caller and record a new immutable filename. */
export async function runEvidence(args: string[]): Promise<EvidenceReport> {
  const options = parseOptions(args[0] === 'run' ? args.slice(1) : args, 'run');
  if (!options.output) throw new Error('--output <project-relative receipt.json> is required.');
  if (!options.requirements.length || !options.acceptances.length) {
    throw new Error('At least one --requirement and --acceptance identifier is required.');
  }
  for (const id of [...options.requirements, ...options.acceptances]) {
    if (!/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/.test(id))
      throw new Error(`Invalid requirement/case identifier: ${id}`);
  }
  const subjects = snapshot(options.root, options.subjects);
  const output = evidencePath(options.root, options.output, true);
  if (existsSync(output)) throw new Error('Evidence output exists; choose a new named receipt.');
  const repository = repositoryState(options.root, options.subjects);
  const execution = await execute(options.command, options.root, options.timeout);
  try {
    if (subjectDigest(snapshot(options.root, options.subjects)) !== subjectDigest(subjects)) {
      execution.status = 'blocked';
      execution.error = 'subject files changed during command execution';
    }
  } catch {
    execution.status = 'blocked';
    execution.error = 'subject files unavailable after command execution';
  }
  const receipt: EvidenceReceipt = {
    format_version: 1,
    kind: 'local-command-receipt',
    id: randomUUID(),
    kit_version: KIT_VERSION,
    requirement_ids: [...new Set(options.requirements)],
    acceptance_ids: [...new Set(options.acceptances)],
    subjects,
    subject_digest: subjectDigest(subjects),
    repository,
    runtime: { node: process.version, platform: process.platform, arch: process.arch },
    execution,
    limitations: [...LIMITATIONS],
  };
  const serialized = `${JSON.stringify(receipt, null, 2)}\n`;
  if (Buffer.byteLength(serialized) > MAX_REPORT_BYTES) {
    throw new Error(
      'The command ran, but its receipt exceeds the 1 MiB format limit; no passing evidence was written.',
    );
  }
  evidencePath(options.root, options.output, true);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, serialized, { encoding: 'utf8', flag: 'wx' });
  const report = verifyEvidence(options.root, options.output);
  emit(report, options.json, 'run');
  return report;
}

function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function strings(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === 'string' && item.length > 0)
  );
}

function readJson(root: string, path: string): { data: unknown; digest: string } {
  const filename = evidencePath(root, path);
  if (lstatSync(filename).size > MAX_REPORT_BYTES)
    throw new Error('Evidence JSON exceeds the read limit.');
  const bytes = readFileSync(filename);
  return { data: JSON.parse(bytes.toString('utf8')) as unknown, digest: sha256(bytes) };
}

function parseReceipt(value: unknown): EvidenceReceipt {
  if (
    !object(value) ||
    value.format_version !== 1 ||
    value.kind !== 'local-command-receipt' ||
    typeof value.id !== 'string' ||
    !value.id ||
    typeof value.kit_version !== 'string' ||
    !strings(value.requirement_ids) ||
    !strings(value.acceptance_ids) ||
    !Array.isArray(value.subjects) ||
    !value.subjects.length ||
    typeof value.subject_digest !== 'string' ||
    !DIGEST.test(value.subject_digest) ||
    !object(value.execution) ||
    !object(value.repository) ||
    !object(value.runtime) ||
    !strings(value.limitations)
  )
    throw new Error('Invalid or unsupported evidence receipt.');
  const runtime = value.runtime;
  if (
    (value.repository.head !== null &&
      (typeof value.repository.head !== 'string' ||
        !/^[a-f0-9]{40,64}$/.test(value.repository.head))) ||
    (value.repository.subjects_dirty !== null &&
      typeof value.repository.subjects_dirty !== 'boolean') ||
    !['node', 'platform', 'arch'].every(
      (key) => typeof runtime[key] === 'string' && !!runtime[key],
    ) ||
    [...value.requirement_ids, ...value.acceptance_ids].some(
      (id) => !/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/.test(id),
    )
  )
    throw new Error('Invalid runtime, repository or requirement metadata.');
  for (const entry of value.subjects) {
    if (
      !object(entry) ||
      typeof entry.path !== 'string' ||
      typeof entry.sha256 !== 'string' ||
      !DIGEST.test(entry.sha256) ||
      !Number.isSafeInteger(entry.bytes) ||
      (entry.bytes as number) < 0
    )
      throw new Error('Invalid evidence subject.');
  }
  if (
    new Set(value.subjects.map((entry) => (entry as EvidenceSubject).path)).size !==
    value.subjects.length
  ) {
    throw new Error('Duplicate evidence subject.');
  }
  const run = value.execution;
  if (
    typeof run.executable !== 'string' ||
    !run.executable ||
    !Array.isArray(run.args) ||
    !run.args.every((arg) => typeof arg === 'string') ||
    !['passed', 'failed', 'blocked', 'not_run'].includes(String(run.status)) ||
    (run.exit_code !== null && !Number.isInteger(run.exit_code)) ||
    (run.error !== null && typeof run.error !== 'string') ||
    (run.signal !== null && typeof run.signal !== 'string') ||
    typeof run.stdout !== 'string' ||
    typeof run.stderr !== 'string' ||
    typeof run.output_truncated !== 'boolean' ||
    !Number.isSafeInteger(run.duration_ms) ||
    typeof run.duration_ms !== 'number' ||
    run.duration_ms < 0
  )
    throw new Error('Invalid command execution record.');
  if (
    run.status === 'passed' &&
    (run.exit_code !== 0 || run.error !== null || run.signal !== null || run.output_truncated)
  ) {
    throw new Error(
      'A passed record requires a completed, untruncated exit zero without an error.',
    );
  }
  for (const key of ['started_at', 'finished_at']) {
    if (
      run[key] !== null &&
      (typeof run[key] !== 'string' || !Number.isFinite(Date.parse(run[key] as string)))
    ) {
      throw new Error('Invalid execution timestamp.');
    }
  }
  if (run.status !== 'not_run' && (run.started_at === null || run.finished_at === null)) {
    throw new Error('Executed records need start and finish timestamps.');
  }
  const clockMetadata = run.duration_source !== undefined || run.wall_clock_regressed !== undefined;
  if (
    clockMetadata &&
    (run.duration_source !== 'monotonic' || typeof run.wall_clock_regressed !== 'boolean')
  )
    throw new Error('Invalid execution clock metadata.');
  if (run.started_at !== null && run.finished_at !== null) {
    const regressed = Date.parse(run.finished_at as string) < Date.parse(run.started_at as string);
    if (regressed && !(clockMetadata && run.wall_clock_regressed === true))
      throw new Error('Execution finishes before its start.');
    if (clockMetadata && run.wall_clock_regressed !== regressed)
      throw new Error('Execution clock metadata contradicts its timestamps.');
  }
  if (
    run.status === 'failed' &&
    (run.exit_code === 0 || (run.exit_code === null && run.signal === null))
  ) {
    throw new Error('A failed execution needs a nonzero exit or termination signal.');
  }
  if (run.status === 'blocked' && !run.error)
    throw new Error('A blocked execution needs a reason.');
  if (
    run.status === 'not_run' &&
    (run.started_at !== null || run.finished_at !== null || run.exit_code !== null)
  ) {
    throw new Error('A not_run record cannot claim command execution.');
  }
  return value as unknown as EvidenceReceipt;
}

function parseReview(value: unknown): EvidenceReview {
  if (
    !object(value) ||
    value.format_version !== 1 ||
    value.kind !== 'local-review-declaration' ||
    typeof value.receipt_sha256 !== 'string' ||
    !DIGEST.test(value.receipt_sha256) ||
    typeof value.subject_digest !== 'string' ||
    !DIGEST.test(value.subject_digest) ||
    !['author', 'reviewer', 'author_context', 'reviewer_context'].every(
      (key) => typeof value[key] === 'string' && !!value[key],
    ) ||
    !['native-subagent', 'fresh-session', 'self-review'].includes(String(value.mode)) ||
    !['accepted', 'return_needed', 'blocked'].includes(String(value.verdict))
  )
    throw new Error('Invalid review declaration.');
  return value as unknown as EvidenceReview;
}

/** Inspect bytes and recorded outcomes only. No command or module in a receipt is executed. */
export function verifyEvidence(
  root: string,
  receiptPath: string,
  reviewPath?: string,
): EvidenceReport {
  const report: EvidenceReport = {
    format_version: 1,
    scope: 'local-command-evidence',
    healthy: false,
    receipt: receiptPath,
    recorded_status: 'not_run',
    applicability: 'invalid',
    subject_digest: '',
    findings: [],
    review: { applicability: 'not_provided', independence: 'not_assessed' },
    closure: 'not_assessed',
    limitations: [...LIMITATIONS],
  };
  const finding = (id: string, message: string) => report.findings.push({ id, message });
  try {
    const { data, digest } = readJson(root, receiptPath);
    const receipt = parseReceipt(data);
    report.recorded_status = receipt.execution.status;
    report.subject_digest = receipt.subject_digest;
    if (subjectDigest(receipt.subjects) !== receipt.subject_digest) {
      throw new Error('Receipt subject-set digest does not match its listed subjects.');
    }
    report.applicability = 'current';
    try {
      const current = snapshot(
        root,
        receipt.subjects.map((subject) => subject.path),
      );
      if (subjectDigest(current) !== receipt.subject_digest) {
        report.applicability = 'stale';
        finding(
          'evidence.stale',
          'One or more selected subjects differ from the recorded revision.',
        );
      }
    } catch (error) {
      report.applicability = 'stale';
      finding('evidence.unavailable', (error as Error).message);
    }
    if (receipt.execution.status !== 'passed') {
      finding(
        `execution.${receipt.execution.status}`,
        receipt.execution.error ?? 'The recorded check did not pass.',
      );
    }
    if (reviewPath) {
      report.review.applicability = 'invalid';
      try {
        const review = parseReview(readJson(root, reviewPath).data);
        report.review.applicability =
          review.receipt_sha256 === digest &&
          review.subject_digest === receipt.subject_digest &&
          report.applicability === 'current'
            ? 'current'
            : 'stale';
        report.review.independence =
          review.mode === 'self-review' ||
          review.author === review.reviewer ||
          review.author_context === review.reviewer_context
            ? 'self_review'
            : 'declared';
        if (report.review.applicability !== 'current')
          finding(
            'review.stale',
            'Review does not apply to the current receipt and subject revision.',
          );
        if (report.review.independence === 'self_review')
          finding('review.self_review', 'Declared self-review cannot satisfy independent review.');
        if (review.verdict !== 'accepted')
          finding('review.not_accepted', `Recorded review verdict: ${review.verdict}.`);
      } catch (error) {
        finding('review.invalid', (error as Error).message);
      }
    }
    report.healthy =
      report.applicability === 'current' &&
      receipt.execution.status === 'passed' &&
      report.findings.length === 0;
  } catch (error) {
    finding('evidence.invalid', (error as Error).message);
  }
  return report;
}

export async function runVerify(args: string[]): Promise<EvidenceReport> {
  const options = parseOptions(args, 'verify');
  if (!options.evidence) throw new Error('--evidence <project-relative receipt.json> is required.');
  const report = verifyEvidence(options.root, options.evidence, options.review);
  emit(report, options.json, 'verify');
  return report;
}
