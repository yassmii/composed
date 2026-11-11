import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { test } from 'node:test';
import { compareContracts } from '../scripts/lib/contract-impact.mjs';
import { readContract, validateContractDocument } from '../scripts/lib/contract-format.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const cli = resolve(ROOT, 'scripts/compare-contracts.mjs');
const context = { beforeSha256: 'a'.repeat(64), afterSha256: 'b'.repeat(64) };
function contract() {
  const doc = readContract(resolve(ROOT, 'templates/contract.yaml')).document;
  doc.schema_version = '0.2';
  doc.capabilities[0].requirements = [
    { id: 'REQ-001', statement: 'Deny the next protected read after revocation.' },
    { id: 'REQ-002', statement: 'Preserve refusal while cached context remains.', depends_on: ['REQ-001'] },
  ];
  doc.policies = [];
  doc.quality_attributes = [];
  doc.acceptance = [
    { id: 'ACC-001', given: 'An active grant.', when: 'The owner revokes it.', then: 'The protected read fails.', evidence: 'Read result observed at the public boundary.', verifies: ['REQ-001'], verification: { methods: ['automated'], boundary: 'public-interface', case_kinds: ['positive', 'negative'] } },
    { id: 'ACC-002', given: 'A cached read context.', when: 'The grant is revoked.', then: 'The next cached read fails.', evidence: 'Actual cached protected read.', verifies: ['REQ-002'], verification: { methods: ['automated'], boundary: 'public-interface', case_kinds: ['positive', 'negative'] } },
    { id: 'ACC-003', given: 'An active record.', when: 'It changes.', then: 'Its invariant remains true.', evidence: 'Invariant boundary results.', verifies: ['INV-001'], verification: { methods: ['automated'], boundary: 'public-interface', case_kinds: ['positive'] } },
  ];
  assert.deepEqual(validateContractDocument(doc), []);
  return doc;
}
function mapped(before, after, links) {
  return {
    format_version: 1, kind: 'clause-correspondence',
    before: { id: before.id, version: before.version, sha256: context.beforeSha256 },
    after: { id: after.id, version: after.version, sha256: context.afterSha256 },
    links,
  };
}
function rename(doc, from, to) {
  for (const cap of doc.capabilities)
    for (const req of cap.requirements) if (req.id === from) req.id = to;
  for (const cap of doc.capabilities)
    for (const req of cap.requirements) if (req.depends_on) req.depends_on = req.depends_on.map((id) => id === from ? to : id);
  for (const item of doc.acceptance) item.verifies = item.verifies.map((id) => id === from ? to : id);
}

test('equal contracts preserve IDs without claiming equivalence, compatibility or proof transfer', () => {
  const before = contract();
  const result = compareContracts(before, structuredClone(before));
  assert.equal(result.status, 'assessed');
  assert.deepEqual(result.changes.unchanged, ['INV-001', 'REQ-001', 'REQ-002']);
  assert.deepEqual(result.changes.modified, []);
  assert.deepEqual(result.impact.clause_ids, []);
  assert.equal(result.compatibility, 'not_assessed');
  assert.equal(result.proof_transfer, 'not_performed');
  assert.equal(result.before.sha256, null);
});

test('object member reordering does not change a clause or its context', () => {
  const before = contract();
  const after = JSON.parse(JSON.stringify(before, (key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) return Object.fromEntries(Object.entries(value).reverse());
    return value;
  }));
  const result = compareContracts(before, after);
  assert.deepEqual(result.changes.modified, []);
  assert.deepEqual(result.context_changes, []);
});

test('rule edits affect downstream clauses and linked acceptance, including dependency cycles', () => {
  const before = contract();
  before.capabilities[0].requirements[0].depends_on = ['REQ-002'];
  const after = structuredClone(before);
  after.capabilities[0].requirements[0].statement = 'Deny every protected read after revocation.';
  const result = compareContracts(before, after);
  assert.deepEqual(result.changes.modified, [{ id: 'REQ-001', reasons: ['clause-content'] }]);
  assert.deepEqual(result.impact.clause_ids, ['REQ-001', 'REQ-002']);
  assert.deepEqual(result.impact.acceptance_ids, ['ACC-001', 'ACC-002']);
  assert.equal(result.impact.coverage, 'structured');
});

test('capability priority and outcome changes affect its requirements without changing their text', () => {
  const before = contract();
  const after = structuredClone(before);
  after.capabilities[0].priority = 'could';
  after.capabilities[0].outcome = 'Support bounded read access.';
  const result = compareContracts(before, after);
  assert.deepEqual(result.changes.modified.map((x) => x.id), ['REQ-001', 'REQ-002']);
  assert.deepEqual(result.changes.modified[0].reasons, ['capability-context']);
  assert.deepEqual(result.changes.unchanged, ['INV-001']);
});

test('actor permission changes conservatively select all potentially affected rules', () => {
  const before = contract();
  const after = structuredClone(before);
  after.actors[0].permissions.push('Manage sharing grants.');
  const result = compareContracts(before, after);
  assert.deepEqual(result.context_changes, ['actors']);
  assert.deepEqual(result.impact.clause_ids, ['INV-001', 'REQ-001', 'REQ-002']);
  assert.deepEqual(result.impact.acceptance_ids, ['ACC-001', 'ACC-002', 'ACC-003']);
});

test('domain or integration changes cannot yield a silently unchanged impact', () => {
  const before = contract();
  for (const mutate of [
    (doc) => { doc.domain.entities[0].description = 'A persisted resource with revocable grants.'; },
    (doc) => { doc.integrations = [{ id: 'INT-001', system: 'External reader', purpose: 'Read shared records.', degradation: 'Report unavailable reads.' }]; },
  ]) {
    const after = structuredClone(before); mutate(after);
    const result = compareContracts(before, after);
    assert.equal(result.changes.modified.length, 3);
    assert.equal(result.impact.acceptance_ids.length, 3);
  }
});

test('array order is preserved rather than assuming every ordered value is a set', () => {
  const before = contract();
  const after = structuredClone(before);
  after.domain.entities[0].lifecycle.reverse();
  assert.deepEqual(compareContracts(before, after).context_changes, ['domain']);
});

test('validation profile changes revalidate clauses even when acceptance text is identical', () => {
  const before = contract();
  before.delivery.validation_profile = { id: 'sample/conformance', version: '1.0.0' };
  const after = structuredClone(before);
  after.delivery.validation_profile.version = '2.0.0';
  const result = compareContracts(before, after);
  assert.deepEqual(result.context_changes, ['delivery']);
  assert.deepEqual(result.impact.acceptance_ids, ['ACC-001', 'ACC-002', 'ACC-003']);
  assert.equal(result.compatibility, 'not_assessed');
});

test('acceptance-only requirement changes still revalidate the linked obligations', () => {
  const before = contract();
  const after = structuredClone(before);
  after.acceptance[0].verification.case_kinds.push('recovery');
  const result = compareContracts(before, after);
  assert.deepEqual(result.acceptance_changes.modified, ['ACC-001']);
  assert.deepEqual(result.changes.modified, []);
  assert.deepEqual(result.impact.clause_ids, ['REQ-001', 'REQ-002']);
  assert.deepEqual(result.impact.acceptance_ids, ['ACC-001', 'ACC-002']);
});

test('metadata-only version changes do not pretend to transfer old evidence', () => {
  const before = contract();
  const after = structuredClone(before); after.version = '0.2.0';
  const result = compareContracts(before, after);
  assert.deepEqual(result.metadata_changes, ['version']);
  assert.deepEqual(result.impact.clause_ids, []);
  assert.equal(result.proof_transfer, 'not_performed');
  assert.equal(result.compatibility, 'not_assessed');
});

test('added and removed IDs remain visible even with an accepted explicit rename', () => {
  const before = contract();
  const after = structuredClone(before); rename(after, 'REQ-001', 'REQ-NEW');
  const mapping = mapped(before, after, [{ from: ['REQ-001'], to: ['REQ-NEW'], relation: 'renamed', status: 'accepted', reason: 'Reviewed naming correction.' }]);
  const result = compareContracts(before, after, mapping, context);
  assert.equal(result.status, 'assessed');
  assert.deepEqual(result.changes.removed, ['REQ-001']);
  assert.deepEqual(result.changes.added, ['REQ-NEW']);
  assert.equal(result.correspondences[0].assessment, 'declared');
  assert.equal(result.correspondences[0].proof_transfer, 'not_performed');
  assert.deepEqual(result.impact.acceptance_ids, ['ACC-001', 'ACC-002']);
});

test('split and merged correspondences require every target to be revalidated', () => {
  const before = contract();
  const after = structuredClone(before);
  const split = mapped(before, after, [{ from: ['REQ-001'], to: ['REQ-001', 'REQ-002'], relation: 'split', status: 'proposed', reason: 'Proposed decomposition.' }]);
  const merged = mapped(before, after, [{ from: ['REQ-001', 'REQ-002'], to: ['REQ-001'], relation: 'merged', status: 'accepted', reason: 'Reviewed consolidation.' }]);
  for (const mapping of [split, merged]) {
    const result = compareContracts(before, after, mapping, context);
    assert.equal(result.status, 'assessed');
    assert.deepEqual(result.impact.clause_ids, ['REQ-001', 'REQ-002']);
    assert.deepEqual(result.impact.acceptance_ids, ['ACC-001', 'ACC-002']);
    assert.equal(result.proof_transfer, 'not_performed');
  }
});

test('rejected mapping history remains visible beside a distinct active alternative', () => {
  const before = contract();
  const after = structuredClone(before); rename(after, 'REQ-001', 'REQ-NEW');
  const mapping = mapped(before, after, [
    { from: ['REQ-001'], to: ['REQ-002'], relation: 'renamed', status: 'rejected', reason: 'Wrong correspondence.' },
    { from: ['REQ-001'], to: ['REQ-NEW'], relation: 'renamed', status: 'accepted', reason: 'Actual renamed clause.' },
  ]);
  const result = compareContracts(before, after, mapping, context);
  assert.equal(result.status, 'assessed');
  assert.equal(result.correspondences.length, 2);
});

test('ambiguous active correspondence cannot silently select an owner', () => {
  const before = contract();
  const after = structuredClone(before); rename(after, 'REQ-001', 'REQ-NEW');
  const mapping = mapped(before, after, [
    { from: ['REQ-001'], to: ['REQ-NEW'], relation: 'renamed', status: 'accepted', reason: 'First.' },
    { from: ['REQ-002'], to: ['REQ-NEW'], relation: 'renamed', status: 'proposed', reason: 'Competing.' },
  ]);
  const result = compareContracts(before, after, mapping, context);
  assert.equal(result.status, 'invalid');
  assert.ok(result.findings.some((x) => x.code === 'mapping.competing'));
});

test('stale or unavailable exact-byte pins invalidate correspondence declarations', () => {
  const before = contract();
  const after = structuredClone(before); rename(after, 'REQ-001', 'REQ-NEW');
  const mapping = mapped(before, after, [{ from: ['REQ-001'], to: ['REQ-NEW'], relation: 'renamed', status: 'accepted', reason: 'Reviewed.' }]);
  const stale = structuredClone(mapping); stale.after.sha256 = 'c'.repeat(64);
  assert.ok(compareContracts(before, after, stale, context).findings.some((x) => x.code === 'mapping.stale-pin'));
  assert.ok(compareContracts(before, after, mapping).findings.some((x) => x.code === 'mapping.unverifiable-pin'));
  assert.equal(compareContracts(before, after, stale, context).status, 'invalid');
});

test('unknown IDs, duplicate declarations and invalid cardinalities are rejected', () => {
  const before = contract(); const after = structuredClone(before);
  const cases = [
    [{ from: ['REQ-NONE'], to: ['REQ-001'], relation: 'renamed', status: 'accepted', reason: 'Unknown.' }],
    [{ from: ['REQ-001'], to: ['REQ-001'], relation: 'renamed', status: 'accepted', reason: 'Not a rename.' }],
    [{ from: ['REQ-001'], to: ['REQ-002'], relation: 'split', status: 'proposed', reason: 'Not a split.' }],
    Array(2).fill({ from: ['REQ-001'], to: ['REQ-002'], relation: 'renamed', status: 'rejected', reason: 'Duplicate history.' }),
  ];
  for (const links of cases) assert.equal(compareContracts(before, after, mapped(before, after, links), context).status, 'invalid');
});

test('0.1 changes explicitly keep targeted case/dependency coverage unknown', () => {
  const before = readContract(resolve(ROOT, 'templates/contract.yaml')).document;
  const after = structuredClone(before);
  after.capabilities[0].requirements[0].statement = 'Changed required behavior without structured case links.';
  const result = compareContracts(before, after);
  assert.equal(result.status, 'assessed');
  assert.equal(result.impact.coverage, 'unknown');
  assert.deepEqual(result.impact.clause_ids, ['INV-001', 'POL-001', 'QA-001', 'REQ-001']);
  assert.deepEqual(result.impact.acceptance_ids, ['ACC-001']);
  assert.ok(result.limitations.some((x) => x.includes('lack structured')));
});

test('invalid contracts and cross-family comparisons do not yield impact verdicts', () => {
  const before = contract(); const after = structuredClone(before);
  after.id = 'another-family';
  assert.equal(compareContracts(before, after).status, 'invalid');
  assert.equal(compareContracts(before, null).status, 'invalid');
});

test('public CLI returns one JSON report and makes no filesystem changes', () => {
  const area = mkdtempSync(join(tmpdir(), 'composed-contract-impact-'));
  try {
    const before = contract(); const after = structuredClone(before);
    after.capabilities[0].requirements[0].statement = 'Changed but independently reviewable behavior.';
    writeFileSync(join(area, 'before.json'), JSON.stringify(before));
    writeFileSync(join(area, 'after.json'), JSON.stringify(after));
    const initial = readdirSync(area).map((name) => [name, readFileSync(join(area, name), 'utf8')]);
    const result = spawnSync(process.execPath, [cli, '--before', join(area, 'before.json'), '--after', join(area, 'after.json'), '--json'], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.kind, 'contract-impact-report');
    assert.equal(report.status, 'assessed');
    assert.match(report.before.sha256, /^[a-f0-9]{64}$/);
    assert.deepEqual(readdirSync(area).map((name) => [name, readFileSync(join(area, name), 'utf8')]), initial);
    const invalid = spawnSync(process.execPath, [cli, '--before', join(area, 'before.json'), '--after', join(area, 'after.json'), '--json', '--json'], { encoding: 'utf8' });
    assert.equal(invalid.status, 1);
  } finally { rmSync(area, { recursive: true, force: true }); }
});
