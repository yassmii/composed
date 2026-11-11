import { createHash } from 'node:crypto';
import {
  constants,
  closeSync,
  fstatSync,
  lstatSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  realpathSync,
} from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import { indexContract, readContract, validateContractDocument } from './contract-format.mjs';

const SCHEMAS = resolve(import.meta.dirname, '../../specs');
const ajv = new Ajv2020({ allErrors: true, strict: false });
const planValidator = ajv.compile(
  JSON.parse(readFileSync(join(SCHEMAS, 'validation-plan.schema.json'), 'utf8')),
);
const evidenceValidator = ajv.compile(
  JSON.parse(readFileSync(join(SCHEMAS, 'validation-evidence.schema.json'), 'utf8')),
);
const MAX_INPUT_BYTES = 2 * 1024 * 1024;
const MAX_ARTIFACT_BYTES = 16 * 1024 * 1024;
const MAX_TOTAL_BYTES = 64 * 1024 * 1024;
const MAX_ARTIFACTS = 512;
const HASH = /^[a-f0-9]{64}$/;
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const sorted = (values) => [...values].sort();
const pinMatches = (pin, document, digest) =>
  pin.id === document.id && pin.version === document.version && pin.sha256 === digest;
const samePin = (left, right) =>
  left.id === right.id && left.version === right.version && left.sha256 === right.sha256;
const tuple = (item) => JSON.stringify([item.acceptance_id, item.method, item.boundary, item.kind]);

function bounded(value) {
  let count = 0;
  const ancestors = new Set();
  const visit = (item, depth) => {
    if (++count > 100000 || depth > 64) throw new Error('Input exceeds 100000 nodes or depth 64.');
    if (!item || typeof item !== 'object') return;
    if (ancestors.has(item)) throw new Error('Input contains a cycle.');
    ancestors.add(item);
    for (const child of Object.values(item)) visit(child, depth + 1);
    ancestors.delete(item);
  };
  visit(value, 0);
}

function safeRelative(path) {
  if (
    typeof path !== 'string' ||
    path.length > 1024 ||
    path.includes('\\') ||
    /[<>"|?*]/.test(path) ||
    Array.from(path).some(
      (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127 || char === ':',
    ) ||
    isAbsolute(path)
  )
    return false;
  const parts = path.split('/');
  return (
    parts.length <= 32 &&
    parts.every(
      (part) =>
        part &&
        part !== '.' &&
        part !== '..' &&
        !/[. ]$/.test(part) &&
        !/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part),
    ) &&
    parts[0].toLowerCase() !== '.git'
  );
}

function reportBase(context) {
  return {
    format_version: 1,
    scope: 'contract-evidence-consistency',
    claim_scope: 'selected-obligations',
    status: 'incomplete',
    healthy: false,
    full_contract_conformance: 'not_assessed',
    evidence_authenticity: 'not_assessed',
    execution_verification: 'not_performed',
    observation_source:
      context.observationSource === 'filesystem' ? 'filesystem' : 'supplied-or-missing',
    selected_clause_ids: [],
    effective_clause_ids: [],
    omitted_clause_ids: [],
    required_acceptance_ids: [],
    cases: [],
    obligations: [],
    findings: [],
    limitations: [
      'This evaluates declared case observations and their scoped applicability, not the truth of a producer or independent execution.',
      'Hashes establish byte applicability, not authenticated authorship, human approval or semantic sufficiency of the checker.',
      'Passing selected obligations does not certify full contract conformance or product effectiveness.',
    ],
  };
}

/** Pure consistency evaluation. Filesystem observations must be supplied by the read-only loader. */
export function evaluateCoverage(document, plan, evidence = null, context = {}) {
  const report = reportBase(context);
  const add = (code, message, category = 'incomplete', path = '') =>
    report.findings.push({ code, path, message, category });
  const finalize = () => {
    const categories = new Set(report.findings.map((item) => item.category));
    report.status =
      ['invalid', 'stale', 'failed', 'not_assessed', 'incomplete'].find((status) =>
        categories.has(status),
      ) ?? 'passed';
    report.healthy = report.status === 'passed';
    if (
      report.findings.some(
        (item) =>
          ['invalid', 'stale'].includes(item.category) ||
          ['contract.unobserved', 'plan.unobserved', 'artifact.unobserved'].includes(item.code),
      )
    ) {
      for (const item of report.obligations) {
        if (item.status === 'verified') item.status = 'open';
        if (item.own_status === 'verified') item.own_status = 'open';
      }
      const byId = new Map(report.obligations.map((item) => [item.clause_id, item]));
      for (const item of report.obligations)
        item.blocking_dependency_ids = item.dependency_ids.filter(
          (id) => byId.get(id)?.status !== 'verified',
        );
    }
    return report;
  };
  try {
    bounded(plan);
    if (evidence !== null) bounded(evidence);
  } catch (error) {
    add('input.limit', error.message, 'invalid');
    return finalize();
  }
  const contractFindings = validateContractDocument(document);
  if (contractFindings.length) {
    for (const item of contractFindings)
      add(`contract.${item.code}`, item.message, 'invalid', item.path);
    return finalize();
  }
  if (!planValidator(plan)) {
    for (const item of planValidator.errors ?? [])
      add('plan.schema', item.message, 'invalid', item.instancePath);
    return finalize();
  }
  const { clauses, acceptance } = indexContract(document);
  const effective = new Set();
  const pending = [...plan.scope.clause_ids];
  while (pending.length) {
    const id = pending.pop();
    if (effective.has(id)) continue;
    if (!clauses.has(id)) {
      add('scope.unknown-clause', `Unknown normative clause ${id}.`, 'invalid', id);
      continue;
    }
    effective.add(id);
    pending.push(...clauses.get(id).dependsOn);
  }
  report.selected_clause_ids = sorted(plan.scope.clause_ids);
  report.effective_clause_ids = sorted(effective);
  report.omitted_clause_ids = sorted([...clauses.keys()].filter((id) => !effective.has(id)));
  if (!HASH.test(context.contractSha256 ?? ''))
    add('contract.unobserved', 'Exact contract bytes have not been observed.');
  else if (!pinMatches(plan.contract, document, context.contractSha256))
    add(
      'contract.stale',
      'The plan does not pin the supplied contract bytes, identity and version.',
      'stale',
    );
  const planCases = new Map();
  for (const item of plan.cases) {
    if (planCases.has(item.id))
      add('plan.duplicate-case', `Duplicate case ${item.id}.`, 'invalid', item.id);
    planCases.set(item.id, item);
    if (!acceptance.has(item.acceptance_id))
      add(
        'plan.unknown-acceptance',
        `Unknown acceptance ${item.acceptance_id}.`,
        'invalid',
        item.id,
      );
  }
  if (document.schema_version !== '0.2') {
    add(
      'contract.verification-not-declared',
      'Contract 0.1 has no structured proof requirements. No expectations are inferred from prose.',
      'not_assessed',
    );
    return finalize();
  }
  const requiredAcceptance = new Map(
    [...acceptance].filter(([, item]) => item.verifies.some((id) => effective.has(id))),
  );
  report.required_acceptance_ids = sorted(requiredAcceptance.keys());
  const missing = new Set();
  const plannedTuples = new Set(plan.cases.map(tuple));
  for (const [id, item] of requiredAcceptance) {
    const policy = item.verification;
    for (const method of policy.methods)
      for (const kind of policy.case_kinds) {
        const expected = tuple({ acceptance_id: id, method, boundary: policy.boundary, kind });
        if (!plannedTuples.has(expected)) {
          missing.add(id);
          add(
            'plan.missing-case',
            `No planned ${method}/${policy.boundary}/${kind} case for ${id}.`,
            'incomplete',
            id,
          );
        }
      }
  }
  for (const item of plan.cases) {
    const policy = acceptance.get(item.acceptance_id)?.verification;
    if (
      policy &&
      (!policy.methods.includes(item.method) ||
        policy.boundary !== item.boundary ||
        !policy.case_kinds.includes(item.kind))
    )
      add(
        'plan.proof-policy',
        `Case ${item.id} does not meet the declared acceptance proof policy.`,
        'invalid',
        item.id,
      );
  }
  const relevantPlanCases = plan.cases.filter((item) => requiredAcceptance.has(item.acceptance_id));
  const suppliedCases = new Map();
  const outputArtifacts = new Map();
  const contradictions = new Set();
  const artifactEntries = [...plan.verifier.artifacts];
  if (evidence === null) add('evidence.missing', 'No case evidence was supplied.');
  else if (!evidenceValidator(evidence)) {
    for (const item of evidenceValidator.errors ?? [])
      add('evidence.schema', item.message, 'invalid', item.instancePath);
    return finalize();
  } else {
    if (!HASH.test(context.planSha256 ?? ''))
      add('plan.unobserved', 'Exact plan bytes have not been observed.');
    else if (evidence.plan_sha256 !== context.planSha256)
      add('plan.stale', 'Evidence applies to different validation plan bytes.', 'stale');
    if (
      !samePin(evidence.contract, plan.contract) ||
      (HASH.test(context.contractSha256 ?? '') &&
        !pinMatches(evidence.contract, document, context.contractSha256))
    )
      add(
        'evidence.contract-stale',
        'Evidence and plan do not pin the same observed contract.',
        'stale',
      );
    if (evidence.verifier.id !== plan.verifier.id)
      add('verifier.identity', 'Evidence names a different verifier.', 'invalid');
    if (evidence.execution) {
      const run = evidence.execution;
      const start = Date.parse(run.started_at);
      const end = Date.parse(run.finished_at);
      if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        !/T/.test(run.started_at) ||
        !/T/.test(run.finished_at)
      )
        add(
          'execution.timestamps',
          'Execution timestamps must be valid ISO timestamps.',
          'invalid',
        );
      else {
        const regressed = end < start;
        if (
          (regressed &&
            !(run.duration_source === 'monotonic' && run.wall_clock_regressed === true)) ||
          (run.wall_clock_regressed !== undefined && run.wall_clock_regressed !== regressed) ||
          (run.duration_source !== undefined) !== (run.wall_clock_regressed !== undefined)
        )
          add(
            'execution.clock',
            'Execution wall-clock metadata is missing or contradictory.',
            'invalid',
          );
      }
    }
    for (const item of evidence.artifacts) {
      if (outputArtifacts.has(item.id))
        add('artifact.duplicate-id', `Duplicate artifact id ${item.id}.`, 'invalid', item.id);
      outputArtifacts.set(item.id, item);
    }
    artifactEntries.push(...evidence.target.artifacts, ...evidence.artifacts);
    const checkerPaths = new Set(plan.verifier.artifacts.map((item) => item.path));
    const targetPaths = new Set(evidence.target.artifacts.map((item) => item.path));
    if (targetPaths.size !== evidence.target.artifacts.length)
      add('artifact.duplicate-target', 'Target artifacts contain duplicate paths.', 'invalid');
    for (const item of evidence.target.artifacts)
      if (checkerPaths.has(item.path))
        add(
          'artifact.target-is-verifier',
          'Target and verifier artifacts must remain independently identified.',
          'invalid',
          item.path,
        );
    for (const item of evidence.artifacts)
      if (checkerPaths.has(item.path) || targetPaths.has(item.path))
        add(
          'artifact.output-is-input',
          'Observation artifacts must be separate from target and verifier inputs.',
          'invalid',
          item.path,
        );
    for (const item of evidence.cases) {
      if (suppliedCases.has(item.case_id))
        add(
          'evidence.duplicate-case',
          `Duplicate case result ${item.case_id}.`,
          'invalid',
          item.case_id,
        );
      suppliedCases.set(item.case_id, item);
      if (!planCases.has(item.case_id))
        add(
          'evidence.unknown-case',
          `Unplanned case result ${item.case_id}.`,
          'invalid',
          item.case_id,
        );
      for (const id of item.artifact_ids)
        if (!outputArtifacts.has(id))
          add('artifact.unknown-id', `Unknown evidence artifact ${id}.`, 'invalid', item.case_id);
    }
    for (const item of evidence.contradictions) {
      for (const id of item.artifact_ids)
        if (!outputArtifacts.has(id))
          add('artifact.unknown-id', `Unknown contradiction artifact ${id}.`, 'invalid');
      for (const id of item.clause_ids) {
        if (!clauses.has(id))
          add('contradiction.unknown-clause', `Unknown contradicted clause ${id}.`, 'invalid', id);
        else if (effective.has(id)) {
          contradictions.add(id);
          add('evidence.contradiction', item.detail, 'failed', id);
        }
      }
    }
  }
  const byPath = new Map();
  if (
    new Set(plan.verifier.artifacts.map((item) => item.path)).size !==
    plan.verifier.artifacts.length
  )
    add('artifact.duplicate-verifier', 'Verifier artifacts contain duplicate paths.', 'invalid');
  for (const item of artifactEntries) {
    if (!safeRelative(item.path)) {
      add(
        'artifact.unsafe-path',
        'Artifact paths must be ordinary portable relative paths within the proof root.',
        'invalid',
        item.path,
      );
      continue;
    }
    if (byPath.has(item.path) && byPath.get(item.path) !== item.sha256)
      add(
        'artifact.conflicting-digest',
        'One artifact path has conflicting digests.',
        'invalid',
        item.path,
      );
    byPath.set(item.path, item.sha256);
  }
  if (byPath.size > MAX_ARTIFACTS)
    add('artifact.limit', 'At most 512 distinct artifacts can be inspected.', 'invalid');
  else
    for (const [path, expected] of byPath) {
      const observation =
        context.artifacts instanceof Map ? context.artifacts.get(path) : undefined;
      if (!observation)
        add('artifact.unobserved', 'Artifact bytes have not been observed.', 'incomplete', path);
      else if (observation.error)
        add(
          'artifact.unavailable',
          observation.message ?? observation.error,
          observation.error === 'unsafe' ? 'invalid' : 'stale',
          path,
        );
      else if (observation.sha256 !== expected)
        add('artifact.stale', 'Artifact bytes differ from their pinned digest.', 'stale', path);
    }
  for (const item of relevantPlanCases) {
    const observed = suppliedCases.get(item.id);
    const evaluated = {
      id: item.id,
      acceptance_id: item.acceptance_id,
      recorded_status: observed?.status ?? 'not_run',
      status: 'incomplete',
      findings: [],
    };
    const issue = (code, message, category = 'incomplete') => {
      evaluated.findings.push(code);
      add(code, message, category, item.id);
    };
    if (!observed) issue('case.not-run', 'Required case has no recorded outcome.');
    else {
      if (
        observed.method !== item.method ||
        observed.boundary !== item.boundary ||
        observed.kind !== item.kind
      )
        issue(
          'case.proof-policy',
          'Recorded proof does not have the required method, boundary and case kind.',
        );
      if (observed.coverage !== 'complete' || observed.limitations.length)
        issue('case.partial', 'Partial, unknown or limited proof cannot satisfy this case.');
      if (!observed.artifact_ids.length && observed.status !== 'not_run')
        issue('case.no-artifact', 'An observed outcome needs an evidence artifact.');
      if (item.method === 'manual' && observed.status === 'pass') {
        const review = observed.review;
        if (
          !review ||
          review.author_id === review.reviewer_id ||
          review.author_context === review.reviewer_context ||
          review.verdict !== 'accepted'
        )
          issue(
            'case.manual-review',
            'Manual proof requires a distinct declared reviewer/context and accepted verdict; actor authenticity remains unverified.',
          );
      }
      if (
        item.method === 'automated' &&
        observed.status === 'pass' &&
        (!evidence.execution || evidence.execution.exit_code !== 0)
      )
        issue(
          'case.execution-unverified',
          'Passing automated proof requires a declared completed exit-zero execution. Execution authenticity is not established.',
        );
      if (observed.status === 'fail') {
        evaluated.status = 'failed';
        issue('case.failed', 'A required case failed.', 'failed');
      } else if (observed.status !== 'pass')
        issue(`case.${observed.status}`, 'A required case was not successfully completed.');
      else if (!evaluated.findings.length) evaluated.status = 'passed';
    }
    report.cases.push(evaluated);
  }
  for (const id of report.effective_clause_ids) {
    const linked = [...requiredAcceptance]
      .filter(([, item]) => item.verifies.includes(id))
      .map(([key]) => key);
    const cases = report.cases.filter((item) => linked.includes(item.acceptance_id));
    const ownStatus =
      contradictions.has(id) || cases.some((item) => item.status === 'failed')
        ? 'failed'
        : linked.length &&
            !linked.some((key) => missing.has(key)) &&
            cases.length &&
            cases.every((item) => item.status === 'passed')
          ? 'verified'
          : 'open';
    report.obligations.push({
      clause_id: id,
      acceptance_ids: sorted(linked),
      case_ids: cases.map((item) => item.id),
      own_status: ownStatus,
      status: ownStatus,
      dependency_ids: sorted(clauses.get(id).dependsOn),
      blocking_dependency_ids: [],
    });
  }
  // Propagate only worsening states. Each node changes at most twice, so cycles terminate
  // and a mutually dependent set with all of its own proof passing remains verified.
  const rank = { verified: 0, open: 1, failed: 2 };
  const obligations = new Map(report.obligations.map((item) => [item.clause_id, item]));
  const dependents = new Map(report.effective_clause_ids.map((id) => [id, []]));
  for (const item of report.obligations)
    for (const dependency of item.dependency_ids) dependents.get(dependency)?.push(item.clause_id);
  const queue = report.obligations
    .filter((item) => item.status !== 'verified')
    .map((item) => item.clause_id);
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const dependency = obligations.get(queue[cursor]);
    for (const id of dependents.get(dependency.clause_id)) {
      const item = obligations.get(id);
      if (rank[item.status] >= rank[dependency.status]) continue;
      item.status = dependency.status;
      queue.push(id);
    }
  }
  for (const item of report.obligations) {
    item.blocking_dependency_ids = item.dependency_ids.filter(
      (id) => obligations.get(id)?.status !== 'verified',
    );
    if (item.blocking_dependency_ids.length)
      add(
        item.status === 'failed' ? 'obligation.dependency-failed' : 'obligation.dependency-open',
        `Dependencies are not verified: ${item.blocking_dependency_ids.join(', ')}.`,
        item.status === 'failed' ? 'failed' : 'incomplete',
        item.clause_id,
      );
  }
  report.case_counts = {
    required: relevantPlanCases.length,
    passed: report.cases.filter((item) => item.status === 'passed').length,
    failed: report.cases.filter((item) => item.status === 'failed').length,
    incomplete: report.cases.filter((item) => item.status === 'incomplete').length,
  };
  return finalize();
}

function readJson(filename) {
  const bytes = readBounded(filename, MAX_INPUT_BYTES);
  return {
    value: JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)),
    sha256: sha256(bytes),
  };
}

function readBounded(filename, limit) {
  const leaf = lstatSync(filename, { bigint: true });
  if (!leaf.isFile() || leaf.isSymbolicLink() || leaf.size > BigInt(limit))
    throw new Error('Input must be an ordinary file within its byte limit.');
  const fd = openSync(filename, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const opened = fstatSync(fd, { bigint: true });
    if (
      !opened.isFile() ||
      opened.size > BigInt(limit) ||
      opened.dev !== leaf.dev ||
      opened.ino !== leaf.ino
    )
      throw new Error('Input changed during opening or exceeds its byte limit.');
    const chunks = [];
    let read = 0;
    while (read <= limit) {
      const chunk = Buffer.alloc(Math.min(65536, limit + 1 - read));
      const count = readSync(fd, chunk);
      if (!count) break;
      read += count;
      if (read > limit) throw new Error('Input byte limit exceeded during read.');
      chunks.push(chunk.subarray(0, count));
    }
    return Buffer.concat(chunks, read);
  } finally {
    closeSync(fd);
  }
}

function artifactPath(root, path) {
  if (!safeRelative(path))
    throw Object.assign(new Error('Unsafe artifact path.'), { unsafe: true });
  let current = root;
  const parts = path.split('/');
  for (let i = 0; i < parts.length; i++) {
    const names = readdirSync(current);
    if (names.some((name) => name !== parts[i] && name.toLowerCase() === parts[i].toLowerCase()))
      throw Object.assign(new Error('Case-aliased artifact path.'), { unsafe: true });
    current = join(current, parts[i]);
    const stat = lstatSync(current);
    if (
      stat.isSymbolicLink() ||
      (i < parts.length - 1 && !stat.isDirectory()) ||
      (i === parts.length - 1 && !stat.isFile())
    )
      throw Object.assign(new Error('Linked or non-ordinary artifact path.'), { unsafe: true });
  }
  return current;
}

/** Bounded filesystem observation, without executing a checker, candidate, receipt command or network read. */
export function evaluateCoverageFiles({ contractPath, planPath, evidencePath, root }) {
  const contract = readContract(resolve(contractPath));
  const plan = readJson(resolve(planPath));
  const evidence = evidencePath ? readJson(resolve(evidencePath)) : null;
  const context = {
    contractSha256: contract.sha256,
    planSha256: plan.sha256,
    artifacts: new Map(),
    observationSource: 'filesystem',
  };
  const preflight = evaluateCoverage(
    contract.document,
    plan.value,
    evidence?.value ?? null,
    context,
  );
  if (preflight.status === 'invalid' || preflight.status === 'not_assessed') return preflight;
  const rootPath = resolve(root);
  const stat = lstatSync(rootPath);
  if (!stat.isDirectory() || stat.isSymbolicLink())
    throw new Error('Proof root must be an ordinary directory.');
  const canonical = realpathSync(rootPath);
  const artifacts = [
    ...plan.value.verifier.artifacts,
    ...(evidence?.value.target.artifacts ?? []),
    ...(evidence?.value.artifacts ?? []),
  ];
  if (new Set(artifacts.map((item) => item.path)).size > MAX_ARTIFACTS) return preflight;
  let total = 0;
  for (const item of artifacts) {
    if (context.artifacts.has(item.path)) continue;
    try {
      const path = artifactPath(canonical, item.path);
      const size = lstatSync(path).size;
      if (size > MAX_ARTIFACT_BYTES || total + size > MAX_TOTAL_BYTES)
        throw new Error('Artifact read limits exceeded (16 MiB/file, 64 MiB total).');
      const bytes = readBounded(path, Math.min(MAX_ARTIFACT_BYTES, MAX_TOTAL_BYTES - total));
      total += bytes.length;
      context.artifacts.set(item.path, { sha256: sha256(bytes) });
    } catch (error) {
      context.artifacts.set(item.path, {
        error: error.unsafe ? 'unsafe' : 'unavailable',
        message: error.message,
      });
    }
  }
  return evaluateCoverage(contract.document, plan.value, evidence?.value ?? null, context);
}
