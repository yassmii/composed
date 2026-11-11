import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { parse as parseYaml } from 'yaml';
import { evaluateCoverage, evaluateCoverageFiles } from '../scripts/lib/contract-coverage.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const encode = (value) => `${JSON.stringify(value, null, 2)}\n`;
const digest = (value) => createHash('sha256').update(value).digest('hex');
const copy = (value) => structuredClone(value);
function fixture() {
  const document = parseYaml(readFileSync(join(ROOT, 'templates/contract.yaml'), 'utf8'));
  document.schema_version = '0.2';
  document.id = 'proof-fixture-product';
  document.capabilities[0].requirements[0].depends_on = ['INV-001'];
  document.acceptance[0].verifies = ['REQ-001', 'INV-001', 'QA-001', 'POL-001'];
  document.acceptance[0].verification = {
    methods: ['automated'],
    boundary: 'public-interface',
    case_kinds: ['positive', 'negative'],
  };
  const files = new Map([
    ['checker.mjs', '/* verifier source, never imported by evaluator */\n'],
    ['candidate.mjs', 'export const authorized = false;\n'],
    ['observations.json', '{"observed":"fixture"}\n'],
  ]);
  const contractSha256 = digest(encode(document));
  const pin = { id: document.id, version: document.version, sha256: contractSha256 };
  const plan = {
    format_version: 1,
    kind: 'contract-validation-plan',
    contract: copy(pin),
    scope: { clause_ids: ['REQ-001'], description: 'Selected requirement and its dependency.' },
    verifier: {
      id: 'controlled-checker',
      artifacts: [{ path: 'checker.mjs', sha256: digest(files.get('checker.mjs')) }],
    },
    cases: ['positive', 'negative'].map((kind) => ({
      id: `CASE-${kind.toUpperCase()}`,
      acceptance_id: 'ACC-001',
      method: 'automated',
      boundary: 'public-interface',
      kind,
    })),
  };
  const evidence = {
    format_version: 1,
    kind: 'contract-validation-evidence',
    contract: copy(pin),
    plan_sha256: digest(encode(plan)),
    target: {
      revision: 'fixture-revision-1',
      artifacts: [{ path: 'candidate.mjs', sha256: digest(files.get('candidate.mjs')) }],
    },
    verifier: { id: 'controlled-checker' },
    artifacts: [
      { id: 'OBS-001', path: 'observations.json', sha256: digest(files.get('observations.json')) },
    ],
    cases: plan.cases.map((item) => ({
      case_id: item.id,
      status: 'pass',
      method: item.method,
      boundary: item.boundary,
      kind: item.kind,
      coverage: 'complete',
      artifact_ids: ['OBS-001'],
      limitations: [],
    })),
    contradictions: [],
    execution: {
      command: ['node', 'checker.mjs'],
      exit_code: 0,
      started_at: '2026-10-31T10:00:00.000Z',
      finished_at: '2026-10-31T10:00:00.010Z',
      duration_ms: 10,
      duration_source: 'monotonic',
      wall_clock_regressed: false,
      runtime: { platform: 'fixture', node: 'not-executed-by-this-evaluator' },
    },
  };
  const context = {
    contractSha256,
    planSha256: evidence.plan_sha256,
    artifacts: new Map([...files].map(([path, bytes]) => [path, { sha256: digest(bytes) }])),
  };
  return { document, plan, evidence, context, files };
}
const evaluate = (f) => evaluateCoverage(f.document, f.plan, f.evidence, f.context);
const finding = (result, code) => result.findings.some((item) => item.code === code);
function repin(f) {
  f.context.contractSha256 = digest(encode(f.document));
  f.plan.contract.sha256 = f.context.contractSha256;
  f.evidence.contract = copy(f.plan.contract);
  f.context.planSha256 = digest(encode(f.plan));
  f.evidence.plan_sha256 = f.context.planSha256;
}

function separateDependencyCases(transitive = false) {
  const f = fixture();
  const source = copy(f.document.acceptance[0]);
  const groups = transitive
    ? [
        ['REQ', ['REQ-001', 'POL-001']],
        ['INV', ['INV-001']],
        ['QA', ['QA-001']],
      ]
    : [
        ['REQ', ['REQ-001', 'POL-001', 'QA-001']],
        ['INV', ['INV-001']],
      ];
  f.document.acceptance = groups.map(([name, verifies]) => ({
    ...copy(source),
    id: `ACC-${name}`,
    verifies,
    verification: {
      methods: ['automated'],
      boundary: 'public-interface',
      case_kinds: ['positive'],
    },
  }));
  if (transitive) f.document.invariants[0].depends_on = ['QA-001'];
  f.plan.cases = groups.map(([name]) => ({
    id: `CASE-${name}`,
    acceptance_id: `ACC-${name}`,
    method: 'automated',
    boundary: 'public-interface',
    kind: 'positive',
  }));
  f.evidence.cases = f.plan.cases.map((item) => ({
    case_id: item.id,
    status: 'pass',
    method: item.method,
    boundary: item.boundary,
    kind: item.kind,
    coverage: 'complete',
    artifact_ids: ['OBS-001'],
    limitations: [],
  }));
  repin(f);
  return f;
}
function withFiles(run) {
  const root = mkdtempSync(join(tmpdir(), 'composed-contract-coverage-'));
  const f = fixture();
  try {
    for (const [path, value] of f.files) writeFileSync(join(root, path), value);
    const writeInputs = () => {
      writeFileSync(join(root, 'contract.json'), encode(f.document));
      writeFileSync(join(root, 'plan.json'), encode(f.plan));
      writeFileSync(join(root, 'evidence.json'), encode(f.evidence));
    };
    writeInputs();
    const options = {
      root,
      contractPath: join(root, 'contract.json'),
      planPath: join(root, 'plan.json'),
      evidencePath: join(root, 'evidence.json'),
    };
    run({ root, f, writeInputs, options });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('scoped proof closes dependencies without claiming full conformance or authentic execution', () => {
  const result = evaluate(fixture());
  assert.equal(result.status, 'passed');
  assert.equal(result.healthy, true);
  assert.deepEqual(result.effective_clause_ids, ['INV-001', 'REQ-001']);
  assert.deepEqual(result.omitted_clause_ids, ['POL-001', 'QA-001']);
  assert.ok(result.obligations.every((item) => item.status === 'verified'));
  assert.equal(result.full_contract_conformance, 'not_assessed');
  assert.equal(result.execution_verification, 'not_performed');
  assert.equal(result.evidence_authenticity, 'not_assessed');
});

test('empty evidence and missing artifact observations never pass', () => {
  const f = fixture();
  const absent = evaluateCoverage(f.document, f.plan, null, f.context);
  assert.equal(absent.status, 'incomplete');
  assert.ok(absent.cases.every((item) => item.recorded_status === 'not_run'));
  const unobserved = evaluateCoverage(f.document, f.plan, f.evidence);
  assert.equal(unobserved.status, 'incomplete');
  assert.ok(unobserved.obligations.every((item) => item.status !== 'verified'));
});

test('planned case coverage requires each exact method and case kind', () => {
  const f = fixture();
  f.plan.cases.pop();
  f.evidence.cases.pop();
  repin(f);
  const result = evaluate(f);
  assert.equal(result.status, 'incomplete');
  assert.ok(finding(result, 'plan.missing-case'));
  assert.ok(result.obligations.every((item) => item.status === 'open'));
});

test('declared weaker proof does not satisfy public-interface observation', () => {
  const f = fixture();
  f.evidence.cases[0].boundary = 'component';
  assert.equal(evaluate(f).status, 'incomplete');
  f.plan.cases[0].boundary = 'component';
  repin(f);
  assert.equal(evaluate(f).status, 'invalid');
});

for (const [status, expected] of [
  ['blocked', 'incomplete'],
  ['not_run', 'incomplete'],
  ['fail', 'failed'],
]) {
  test(`one ${status} case cannot be averaged into success`, () => {
    const f = fixture();
    f.evidence.cases[1].status = status;
    assert.equal(evaluate(f).status, expected);
  });
}

test('partial or limited proof remains incomplete even with a pass declaration', () => {
  for (const mutate of [
    (item) => {
      item.coverage = 'partial';
    },
    (item) => {
      item.coverage = 'unknown';
    },
    (item) => {
      item.limitations = ['Only a subset was observed'];
    },
    (item) => {
      item.artifact_ids = [];
    },
  ]) {
    const f = fixture();
    mutate(f.evidence.cases[0]);
    assert.equal(evaluate(f).status, 'incomplete');
  }
});

test('relevant contradictions fail selected scope; unrelated contradictions do not expand it', () => {
  const f = fixture();
  f.evidence.contradictions.push({
    clause_ids: ['QA-001'],
    artifact_ids: ['OBS-001'],
    detail: 'Unselected quality observation.',
  });
  assert.equal(evaluate(f).status, 'passed');
  f.evidence.contradictions[0].clause_ids = ['INV-001'];
  const result = evaluate(f);
  assert.equal(result.status, 'failed');
  assert.equal(result.obligations.find((item) => item.clause_id === 'INV-001').status, 'failed');
});

test('exact contract, plan, target, checker and observation digests govern applicability', () => {
  const changes = [
    (f) => {
      f.context.contractSha256 = 'f'.repeat(64);
    },
    (f) => {
      f.context.planSha256 = 'f'.repeat(64);
    },
    (f) => {
      f.context.artifacts.set('candidate.mjs', { sha256: 'f'.repeat(64) });
    },
    (f) => {
      f.context.artifacts.set('checker.mjs', { sha256: 'f'.repeat(64) });
    },
    (f) => {
      f.context.artifacts.set('observations.json', { sha256: 'f'.repeat(64) });
    },
  ];
  for (const mutate of changes) {
    const f = fixture();
    mutate(f);
    const result = evaluate(f);
    assert.equal(result.status, 'stale');
    assert.ok(result.obligations.every((item) => item.status !== 'verified'));
  }
});

test('pin property ordering is not semantic identity', () => {
  const f = fixture();
  const { id, version, sha256 } = f.evidence.contract;
  f.evidence.contract = { sha256, version, id };
  assert.equal(evaluate(f).status, 'passed');
});

test('duplicate case IDs, unknown evidence refs and shared target/checker identities are invalid', () => {
  const changes = [
    (f) => {
      f.plan.cases.push(copy(f.plan.cases[0]));
    },
    (f) => {
      f.evidence.cases.push(copy(f.evidence.cases[0]));
    },
    (f) => {
      f.evidence.artifacts.push(copy(f.evidence.artifacts[0]));
    },
    (f) => {
      f.evidence.cases[0].artifact_ids = ['MISSING'];
    },
    (f) => {
      f.evidence.cases[0].case_id = 'UNPLANNED';
    },
    (f) => {
      f.evidence.target.artifacts = copy(f.plan.verifier.artifacts);
    },
    (f) => {
      f.plan.verifier.artifacts.push(copy(f.plan.verifier.artifacts[0]));
    },
    (f) => {
      f.evidence.target.artifacts.push(copy(f.evidence.target.artifacts[0]));
    },
    (f) => {
      f.evidence.artifacts[0].path = 'candidate.mjs';
      f.evidence.artifacts[0].sha256 = f.evidence.target.artifacts[0].sha256;
    },
  ];
  for (const mutate of changes) {
    const f = fixture();
    mutate(f);
    assert.equal(evaluate(f).status, 'invalid');
  }
});

test('manual proof requires accepted distinct declared reviewer and context', () => {
  const f = fixture();
  f.document.acceptance[0].verification.methods = ['manual'];
  for (const item of f.plan.cases) item.method = 'manual';
  for (const item of f.evidence.cases) {
    item.method = 'manual';
    item.review = {
      author_id: 'author',
      reviewer_id: 'reviewer',
      author_context: 'a',
      reviewer_context: 'b',
      verdict: 'accepted',
    };
  }
  Reflect.deleteProperty(f.evidence, 'execution');
  repin(f);
  assert.equal(evaluate(f).status, 'passed');
  f.evidence.cases[0].review.reviewer_context = 'a';
  assert.equal(evaluate(f).status, 'incomplete');
  Reflect.deleteProperty(f.evidence.cases[0], 'review');
  assert.equal(evaluate(f).status, 'incomplete');
});

test('automated passing observations require declared completed execution', () => {
  for (const mutate of [
    (f) => {
      Reflect.deleteProperty(f.evidence, 'execution');
    },
    (f) => {
      f.evidence.execution.exit_code = 1;
    },
    (f) => {
      f.evidence.execution.exit_code = null;
    },
  ]) {
    const f = fixture();
    mutate(f);
    const result = evaluate(f);
    assert.equal(result.status, 'incomplete');
    assert.ok(finding(result, 'case.execution-unverified'));
  }
});

test('monotonic timing explicitly preserves wall-clock regression instead of inventing order', () => {
  const f = fixture();
  f.evidence.execution.finished_at = '2026-10-31T09:59:59.000Z';
  assert.equal(evaluate(f).status, 'invalid');
  f.evidence.execution.wall_clock_regressed = true;
  assert.equal(evaluate(f).status, 'passed');
  f.evidence.execution.finished_at = 'not-a-date';
  assert.equal(evaluate(f).status, 'invalid');
});

test('legacy contracts remain not assessed rather than inferring proof policy from prose', () => {
  const f = fixture();
  f.document.schema_version = '0.1';
  Reflect.deleteProperty(f.document.capabilities[0].requirements[0], 'depends_on');
  Reflect.deleteProperty(f.document.acceptance[0], 'verifies');
  Reflect.deleteProperty(f.document.acceptance[0], 'verification');
  repin(f);
  assert.equal(evaluate(f).status, 'not_assessed');
});

test('cyclic dependencies terminate and do not silently drop required clauses', () => {
  const f = fixture();
  f.document.invariants[0].depends_on = ['REQ-001'];
  repin(f);
  assert.deepEqual(evaluate(f).effective_clause_ids, ['INV-001', 'REQ-001']);
});

for (const [outcome, expected] of [
  ['fail', 'failed'],
  ['blocked', 'open'],
  ['not_run', 'open'],
]) {
  test(`direct dependency ${outcome} blocks a separately passing dependent obligation`, () => {
    const f = separateDependencyCases();
    f.evidence.cases.find((item) => item.case_id === 'CASE-INV').status = outcome;
    const result = evaluate(f);
    const requirement = result.obligations.find((item) => item.clause_id === 'REQ-001');
    assert.equal(requirement.own_status, 'verified');
    assert.equal(requirement.status, expected);
    assert.deepEqual(requirement.blocking_dependency_ids, ['INV-001']);
    assert.equal(result.cases.find((item) => item.id === 'CASE-REQ').status, 'passed');
    assert.deepEqual(result.case_counts, {
      required: 2,
      passed: 1,
      failed: outcome === 'fail' ? 1 : 0,
      incomplete: outcome === 'fail' ? 0 : 1,
    });
    assert.equal(result.status, outcome === 'fail' ? 'failed' : 'incomplete');
  });
}

for (const [outcome, expected] of [
  ['fail', 'failed'],
  ['blocked', 'open'],
]) {
  test(`transitive dependency ${outcome} propagates through separately passing cases`, () => {
    const f = separateDependencyCases(true);
    f.evidence.cases.find((item) => item.case_id === 'CASE-QA').status = outcome;
    const result = evaluate(f);
    const byId = new Map(result.obligations.map((item) => [item.clause_id, item]));
    assert.equal(byId.get('REQ-001').own_status, 'verified');
    assert.equal(byId.get('INV-001').own_status, 'verified');
    assert.equal(byId.get('REQ-001').status, expected);
    assert.equal(byId.get('INV-001').status, expected);
    assert.deepEqual(byId.get('REQ-001').blocking_dependency_ids, ['INV-001']);
    assert.deepEqual(byId.get('INV-001').blocking_dependency_ids, ['QA-001']);
    assert.equal(result.case_counts.passed, 2);
    assert.equal(result.case_counts.required, 3);
  });
}

test('failed transitively dominates an already open obligation', () => {
  const f = separateDependencyCases(true);
  f.evidence.cases.find((item) => item.case_id === 'CASE-INV').status = 'blocked';
  f.evidence.cases.find((item) => item.case_id === 'CASE-QA').status = 'fail';
  const result = evaluate(f);
  const byId = new Map(result.obligations.map((item) => [item.clause_id, item]));
  assert.equal(byId.get('INV-001').own_status, 'open');
  assert.equal(byId.get('INV-001').status, 'failed');
  assert.equal(byId.get('REQ-001').status, 'failed');
  assert.deepEqual(result.case_counts, { required: 3, passed: 1, failed: 1, incomplete: 1 });
});

test('a dependency cycle with separate passing cases remains verified', () => {
  const f = separateDependencyCases();
  f.document.invariants[0].depends_on = ['REQ-001'];
  repin(f);
  const result = evaluate(f);
  assert.equal(result.status, 'passed');
  assert.ok(
    result.obligations.every(
      (item) => item.status === 'verified' && item.own_status === 'verified',
    ),
  );
  assert.ok(result.obligations.every((item) => item.blocking_dependency_ids.length === 0));
  f.evidence.cases.find((item) => item.case_id === 'CASE-INV').status = 'blocked';
  const blocked = evaluate(f);
  assert.equal(blocked.status, 'incomplete');
  assert.ok(blocked.obligations.every((item) => item.status === 'open'));
  assert.equal(blocked.case_counts.passed, 1);
});

test('stale bytes still remove verified own and effective status after dependency propagation', () => {
  const f = separateDependencyCases(true);
  f.context.artifacts.set('candidate.mjs', { sha256: 'f'.repeat(64) });
  const result = evaluate(f);
  assert.equal(result.status, 'stale');
  assert.ok(
    result.obligations.every(
      (item) => item.status !== 'verified' && item.own_status !== 'verified',
    ),
  );
  assert.equal(result.case_counts.passed, 3);
  assert.deepEqual(
    result.obligations.find((item) => item.clause_id === 'REQ-001').blocking_dependency_ids,
    ['INV-001'],
  );
});

test('filesystem evaluation is read-only and does not execute candidate or checker content', () =>
  withFiles(({ root, f, writeInputs, options }) => {
    const marker = join(root, 'executed');
    const script = `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'bad');\n`;
    f.files.set('checker.mjs', script);
    writeFileSync(join(root, 'checker.mjs'), script);
    f.plan.verifier.artifacts[0].sha256 = digest(script);
    repin(f);
    writeInputs();
    const before = readdirSync(root).sort();
    assert.equal(evaluateCoverageFiles(options).status, 'passed');
    assert.deepEqual(readdirSync(root).sort(), before);
    assert.equal(readdirSync(root).includes('executed'), false);
    writeFileSync(join(root, 'checker.mjs'), `${script}// changed\n`);
    assert.equal(evaluateCoverageFiles(options).status, 'stale');
  }));

test('portable path and symlink constraints reject unsafe proof artifacts', () =>
  withFiles(({ root, f, options, writeInputs }) => {
    for (const path of [
      '../outside',
      '/absolute',
      'C:\\outside',
      'nested/../outside',
      'NUL.txt',
      'target.',
      '.git/config',
      'wild*.txt',
      'what?.txt',
      'quote".txt',
      'pipe|.txt',
      'less<.txt',
      'greater>.txt',
    ]) {
      f.evidence.target.artifacts[0].path = path;
      writeInputs();
      assert.equal(evaluateCoverageFiles(options).status, 'invalid');
    }
    f.evidence.target.artifacts[0].path = 'alias/candidate.mjs';
    const external = join(root, 'external');
    mkdirSync(external);
    writeFileSync(join(external, 'candidate.mjs'), f.files.get('candidate.mjs'));
    symlinkSync(external, join(root, 'alias'), process.platform === 'win32' ? 'junction' : 'dir');
    writeInputs();
    assert.equal(evaluateCoverageFiles(options).status, 'invalid');
    assert.equal(lstatSync(join(root, 'alias')).isSymbolicLink(), true);
  }));

test('case aliases and absent proof bytes cannot pass filesystem validation', () =>
  withFiles(({ root, options, f, writeInputs }) => {
    f.evidence.target.artifacts[0].path = 'Candidate.mjs';
    writeInputs();
    assert.equal(evaluateCoverageFiles(options).status, 'invalid');
    f.evidence.target.artifacts[0].path = 'absent.mjs';
    writeInputs();
    assert.equal(evaluateCoverageFiles(options).status, 'stale');
  }));

test('non-portable Windows characters are rejected even with matching supplied hashes', () => {
  for (const character of ['<', '>', '"', '|', '?', '*']) {
    const f = fixture();
    const path = `candidate${character}.mjs`;
    f.evidence.target.artifacts[0].path = path;
    f.context.artifacts.set(path, { sha256: digest(f.files.get('candidate.mjs')) });
    assert.equal(evaluate(f).status, 'invalid');
  }
});

test(
  'an existing Linux-only question-mark filename cannot establish portable proof',
  { skip: process.platform === 'win32' },
  () =>
    withFiles(({ root, options, f, writeInputs }) => {
      writeFileSync(join(root, 'candidate?.mjs'), f.files.get('candidate.mjs'));
      f.evidence.target.artifacts[0].path = 'candidate?.mjs';
      writeInputs();
      const result = evaluateCoverageFiles(options);
      assert.equal(result.status, 'invalid');
      assert.ok(finding(result, 'artifact.unsafe-path'));
    }),
);

test('large artifacts are rejected without unbounded reads or a passing outcome', () =>
  withFiles(({ root, options, f, writeInputs }) => {
    writeFileSync(join(root, 'too-large.bin'), Buffer.alloc(16 * 1024 * 1024 + 1));
    f.evidence.target.artifacts[0] = { path: 'too-large.bin', sha256: '0'.repeat(64) };
    writeInputs();
    const result = evaluateCoverageFiles(options);
    assert.equal(result.status, 'stale');
    assert.ok(finding(result, 'artifact.unavailable'));
  }));

test('CLI prints one JSON report, returns nonzero for uncovered cases, and never writes outputs', () =>
  withFiles(({ root, options }) => {
    const cli = join(ROOT, 'scripts/evaluate-coverage.mjs');
    const argv = [
      cli,
      '--contract',
      options.contractPath,
      '--plan',
      options.planPath,
      '--root',
      root,
      '--json',
    ];
    const before = readdirSync(root).sort();
    const missing = spawnSync(process.execPath, argv, { encoding: 'utf8' });
    assert.equal(missing.status, 1);
    assert.equal(JSON.parse(missing.stdout).status, 'incomplete');
    const passing = spawnSync(process.execPath, [...argv, '--evidence', options.evidencePath], {
      encoding: 'utf8',
    });
    assert.equal(passing.status, 0);
    assert.equal(JSON.parse(passing.stdout).status, 'passed');
    const invalid = spawnSync(process.execPath, [...argv, '--json'], { encoding: 'utf8' });
    assert.equal(invalid.status, 1);
    assert.equal(JSON.parse(invalid.stdout).status, 'invalid');
    assert.deepEqual(readdirSync(root).sort(), before);
  }));

test('in-memory cyclic inputs are invalid rather than overflowing schema evaluation', () => {
  const f = fixture();
  f.plan.cycle = f.plan;
  assert.equal(evaluate(f).status, 'invalid');
});
