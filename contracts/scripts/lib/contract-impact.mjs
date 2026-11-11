import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import { indexContract, validateContractDocument } from './contract-format.mjs';

const schema = JSON.parse(readFileSync(resolve(import.meta.dirname, '../../specs/clause-correspondence.schema.json'), 'utf8'));
const validateMapping = new Ajv2020({ allErrors: true, strict: false }).compile(schema);
const order = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const sorted = (values) => [...new Set(values)].sort(order);
const canonical = (value) => JSON.stringify(sortKeys(value));
function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === 'object')
    return Object.fromEntries(Object.keys(value).sort(order).map((key) => [key, sortKeys(value[key])]));
  return value;
}

/** Context is deliberately conservative; no text parser guesses which domain fact matters. */
function globalContext(document) {
  return Object.fromEntries(['intent', 'scope', 'actors', 'domain', 'integrations', 'extensions', 'delivery']
    .map((key) => [key, document[key] ?? null]));
}
function capabilityContexts(document) {
  const contexts = new Map();
  for (const capability of document.capabilities) {
    const { requirements, ...context } = capability;
    for (const clause of requirements) contexts.set(clause.id, context);
  }
  return contexts;
}
function fieldChanges(before, after) {
  return sorted([...Object.keys(before), ...Object.keys(after)])
    .filter((key) => canonical(before[key] ?? null) !== canonical(after[key] ?? null));
}
function caseChanges(before, after) {
  const changes = { unchanged: [], modified: [], added: [], removed: [] };
  for (const id of sorted([...before.keys(), ...after.keys()])) {
    if (!before.has(id)) changes.added.push(id);
    else if (!after.has(id)) changes.removed.push(id);
    else if (canonical(before.get(id)) !== canonical(after.get(id))) changes.modified.push(id);
    else changes.unchanged.push(id);
  }
  return changes;
}

function checkCorrespondence(mapping, before, after, beforeIndex, afterIndex, context, findings) {
  if (mapping === null || mapping === undefined) return [];
  if (!validateMapping(mapping)) {
    for (const error of validateMapping.errors ?? [])
      findings.push({ code: 'mapping.schema', path: error.instancePath, message: error.message ?? 'Invalid correspondence.' });
    return [];
  }
  for (const [side, document, hash] of [
    ['before', before, context.beforeSha256], ['after', after, context.afterSha256],
  ]) {
    const pin = mapping[side];
    if (!/^[a-f0-9]{64}$/.test(hash ?? ''))
      findings.push({ code: 'mapping.unverifiable-pin', path: `/${side}/sha256`, message: 'Exact source-byte hash is required to inspect a correspondence.' });
    else if (pin.id !== document.id || pin.version !== document.version || pin.sha256 !== hash)
      findings.push({ code: 'mapping.stale-pin', path: `/${side}`, message: 'Correspondence does not target this exact contract identity, version and source bytes.' });
  }
  const fromClaims = new Set();
  const toClaims = new Set();
  const declarations = new Set();
  const links = [];
  for (const [position, link] of mapping.links.entries()) {
    const path = `/links/${position}`;
    const from = sorted(link.from);
    const to = sorted(link.to);
    const declaration = canonical({ from, to, relation: link.relation, status: link.status });
    if (declarations.has(declaration))
      findings.push({ code: 'mapping.duplicate', path, message: 'Duplicate correspondence declaration.' });
    declarations.add(declaration);
    const validCardinality = link.relation === 'renamed' ? from.length === 1 && to.length === 1 && from[0] !== to[0]
      : link.relation === 'split' ? from.length === 1 && to.length > 1
      : from.length > 1 && to.length === 1;
    if (!validCardinality)
      findings.push({ code: 'mapping.cardinality', path, message: 'Rename requires different one-to-one IDs; split is one-to-many; merge is many-to-one.' });
    for (const [ids, index, claims, side] of [
      [from, beforeIndex.clauses, fromClaims, 'from'], [to, afterIndex.clauses, toClaims, 'to'],
    ]) {
      for (const id of ids) {
        if (!index.has(id)) findings.push({ code: 'mapping.unknown-clause', path: `${path}/${side}`, message: `Unknown normative clause ${id}.` });
        // Rejected alternatives remain historical declarations; only active alternatives compete.
        if (link.status !== 'rejected') {
          if (claims.has(id)) findings.push({ code: 'mapping.competing', path, message: `Competing active correspondence for ${side} clause ${id}.` });
          claims.add(id);
        }
      }
    }
    links.push({ ...link, from, to, assessment: 'declared', proof_transfer: 'not_performed' });
  }
  return links;
}

function affectedClosure(seeds, ...indices) {
  const reverse = new Map();
  for (const index of indices) {
    for (const [id, clause] of index.clauses) {
      for (const dependency of clause.dependsOn) {
        if (!reverse.has(dependency)) reverse.set(dependency, new Set());
        reverse.get(dependency).add(id);
      }
    }
  }
  const affected = new Set(seeds);
  const pending = [...seeds];
  for (let position = 0; position < pending.length; position++) {
    for (const id of reverse.get(pending[position]) ?? []) {
      if (!affected.has(id)) { affected.add(id); pending.push(id); }
    }
  }
  return affected;
}

/** Compare declarations and conservative impact; never infer equivalence or transfer proof. */
export function compareContracts(before, after, correspondence = null, context = {}) {
  const findings = [];
  const result = {
    format_version: 1,
    kind: 'contract-impact-report',
    status: 'assessed',
    before: { id: before?.id ?? null, version: before?.version ?? null, sha256: context.beforeSha256 ?? null },
    after: { id: after?.id ?? null, version: after?.version ?? null, sha256: context.afterSha256 ?? null },
    changes: { unchanged: [], modified: [], added: [], removed: [] },
    context_changes: [],
    metadata_changes: [],
    acceptance_changes: { unchanged: [], modified: [], added: [], removed: [] },
    correspondences: [],
    impact: { clause_ids: [], before_clause_ids: [], after_clause_ids: [], acceptance_ids: [], before_acceptance_ids: [], after_acceptance_ids: [], coverage: 'unknown' },
    compatibility: 'not_assessed',
    proof_transfer: 'not_performed',
    findings,
    limitations: [
      'This is a structural and conservative context comparison, not natural-language semantic equivalence or a breaking-change determination.',
      'Correspondence statuses are caller declarations; identities and approval authority are not authenticated.',
      'No proof is transferred or rebound. Existing evidence remains pinned to its original contract and implementation bytes.',
      'Object member order is ignored; array order is preserved. Context changes can conservatively affect more clauses than strictly necessary.',
    ],
  };
  for (const [side, document] of [['before', before], ['after', after]])
    for (const finding of validateContractDocument(document)) findings.push({ ...finding, path: `/${side}${finding.path ? `/${finding.path.replace(/^\//, '')}` : ''}` });
  if (findings.length) { result.status = 'invalid'; return result; }
  if (before.id !== after.id) {
    findings.push({ code: 'contract.family-mismatch', path: '/after/id', message: 'Version impact comparison requires the same product contract identity.' });
    result.status = 'invalid'; return result;
  }
  const old = indexContract(before);
  const next = indexContract(after);
  result.correspondences = checkCorrespondence(correspondence, before, after, old, next, context, findings);
  if (findings.length) { result.status = 'invalid'; return result; }
  const oldContext = globalContext(before);
  const newContext = globalContext(after);
  result.context_changes = fieldChanges(oldContext, newContext);
  result.metadata_changes = fieldChanges(
    Object.fromEntries(['schema_version', 'name', 'version', 'status', 'license'].map((key) => [key, before[key] ?? null])),
    Object.fromEntries(['schema_version', 'name', 'version', 'status', 'license'].map((key) => [key, after[key] ?? null])),
  );
  const oldCapabilities = capabilityContexts(before);
  const newCapabilities = capabilityContexts(after);
  const changed = new Set();
  for (const id of sorted([...old.clauses.keys(), ...next.clauses.keys()])) {
    if (!old.clauses.has(id)) { result.changes.added.push(id); changed.add(id); continue; }
    if (!next.clauses.has(id)) { result.changes.removed.push(id); changed.add(id); continue; }
    const reasons = [];
    const oldClause = old.clauses.get(id);
    const newClause = next.clauses.get(id);
    if (oldClause.kind !== newClause.kind || canonical(oldClause.value) !== canonical(newClause.value)) reasons.push('clause-content');
    if (canonical(oldCapabilities.get(id) ?? null) !== canonical(newCapabilities.get(id) ?? null)) reasons.push('capability-context');
    if (result.context_changes.length) reasons.push('contract-context');
    if (reasons.length) { result.changes.modified.push({ id, reasons }); changed.add(id); }
    else result.changes.unchanged.push(id);
  }
  result.acceptance_changes = caseChanges(old.acceptance, next.acceptance);
  const acceptanceSeeds = [...result.acceptance_changes.modified, ...result.acceptance_changes.added, ...result.acceptance_changes.removed];
  for (const id of acceptanceSeeds) {
    for (const target of [...(old.acceptance.get(id)?.verifies ?? []), ...(next.acceptance.get(id)?.verifies ?? [])]) changed.add(target);
  }
  for (const link of result.correspondences) {
    if (link.status !== 'rejected') for (const id of [...link.from, ...link.to]) changed.add(id);
  }
  const structured = before.schema_version === '0.2' && after.schema_version === '0.2';
  const anyChange = changed.size > 0 || acceptanceSeeds.length > 0 || result.context_changes.length > 0 || result.metadata_changes.length > 0;
  if (!structured && anyChange) {
    for (const id of [...old.clauses.keys(), ...next.clauses.keys()]) changed.add(id);
    result.limitations.push('One or both contracts lack structured verifies/dependencies (format 0.1). Any detected change conservatively selects every normative clause and acceptance case; targeted coverage remains unknown.');
  }
  const affected = affectedClosure(changed, old, next);
  const relevantCases = (index) => sorted([...index.acceptance]
    .filter(([id, item]) => acceptanceSeeds.includes(id) || (!structured && anyChange) || (item.verifies ?? []).some((clause) => affected.has(clause)))
    .map(([id]) => id));
  result.impact = {
    clause_ids: sorted(affected),
    before_clause_ids: sorted([...affected].filter((id) => old.clauses.has(id))),
    after_clause_ids: sorted([...affected].filter((id) => next.clauses.has(id))),
    acceptance_ids: sorted([...relevantCases(old), ...relevantCases(next)]),
    before_acceptance_ids: relevantCases(old),
    after_acceptance_ids: relevantCases(next),
    coverage: structured ? 'structured' : 'unknown',
  };
  return result;
}
