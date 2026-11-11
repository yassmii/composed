import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { readContract } from '../../scripts/lib/contract-format.mjs';
import { evaluateCoverageFiles } from '../../scripts/lib/contract-coverage.mjs';
import { compareContracts } from '../../scripts/lib/contract-impact.mjs';

const example = fileURLToPath(new URL('.', import.meta.url));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
let output;
let temporary = false;
if (process.argv.length === 2) {
  output = mkdtempSync(join(tmpdir(), 'composed-contract-example-'));
  temporary = true;
} else if (process.argv.length === 4 && process.argv[2] === '--output') {
  output = resolve(process.argv[3]);
  mkdirSync(output); // Explicit output must be new; existing evidence is never replaced.
} else throw new Error('Usage: node run.mjs [--output NEW_DIRECTORY]');

const cases = [
  { id: 'CASE-READ-POSITIVE', acceptance_id: 'ACC-ACCESS-001', kind: 'positive' },
  { id: 'CASE-READ-NEGATIVE', acceptance_id: 'ACC-ACCESS-001', kind: 'negative' },
  { id: 'CASE-REVOKE-POSITIVE', acceptance_id: 'ACC-ACCESS-002', kind: 'positive' },
  { id: 'CASE-REVOKE-BOUNDARY', acceptance_id: 'ACC-ACCESS-002', kind: 'boundary' },
  { id: 'CASE-HISTORY-POSITIVE', acceptance_id: 'ACC-ACCESS-003', kind: 'positive' },
].map((entry) => ({ ...entry, method: 'automated', boundary: 'public-interface' }));

function runCandidate(name, candidateFile) {
  const directory = join(output, name);
  mkdirSync(directory);
  for (const [source, destination] of [
    ['contract.yaml', 'contract.yaml'], ['checker.mjs', 'checker.mjs'], [candidateFile, 'candidate.mjs'],
  ]) copyFileSync(join(example, source), join(directory, destination));
  const contract = readContract(join(directory, 'contract.yaml'));
  const pin = { id: contract.document.id, version: contract.document.version, sha256: contract.sha256 };
  const plan = {
    format_version: 1, kind: 'contract-validation-plan', contract: pin,
    // REQ-ACCESS-001 and INV-ACCESS-001 enter scope through the declared dependencies.
    scope: { clause_ids: ['REQ-ACCESS-002', 'POL-ACCESS-001'], description: 'Synthetic grant revocation, repeat revocation and history.' },
    verifier: { id: 'synthetic-public-interface-checker', artifacts: [{ path: 'checker.mjs', sha256: hash(readFileSync(join(directory, 'checker.mjs'))) }] },
    cases,
  };
  writeJson(join(directory, 'plan.json'), plan);
  const command = [process.execPath, join(directory, 'checker.mjs'), join(directory, 'candidate.mjs')];
  const started = Date.now();
  const monotonic = performance.now();
  const execution = spawnSync(command[0], command.slice(1), {
    cwd: directory, encoding: 'utf8', timeout: 20000, maxBuffer: 1024 * 1024, shell: false,
  });
  const duration = Math.max(0, Math.round(performance.now() - monotonic));
  const finished = Date.now();
  if (execution.error || execution.signal || ![0, 1].includes(execution.status))
    throw new Error(`Checker did not complete for ${name}: ${execution.error?.message ?? execution.signal ?? execution.status}`);
  const observed = JSON.parse(execution.stdout);
  writeJson(join(directory, 'observations.json'), observed);
  const evidence = {
    format_version: 1, kind: 'contract-validation-evidence', contract: pin,
    plan_sha256: hash(readFileSync(join(directory, 'plan.json'))),
    target: { revision: `synthetic-${name}`, artifacts: [{ path: 'candidate.mjs', sha256: hash(readFileSync(join(directory, 'candidate.mjs'))) }] },
    verifier: { id: plan.verifier.id },
    artifacts: [{ id: 'OBSERVATIONS', path: 'observations.json', sha256: hash(readFileSync(join(directory, 'observations.json'))) }],
    cases: observed.cases.map(({ id, acceptance_id, ...entry }) => ({
      case_id: id, ...entry, coverage: 'complete', artifact_ids: ['OBSERVATIONS'], limitations: [],
    })),
    contradictions: [],
    execution: {
      command, exit_code: execution.status,
      started_at: new Date(started).toISOString(), finished_at: new Date(finished).toISOString(),
      duration_ms: duration, duration_source: 'monotonic', wall_clock_regressed: finished < started,
      runtime: { platform: process.platform, node: process.version, arch: process.arch },
    },
  };
  writeJson(join(directory, 'evidence.json'), evidence);
  const result = evaluateCoverageFiles({ contractPath: join(directory, 'contract.yaml'), planPath: join(directory, 'plan.json'), evidencePath: join(directory, 'evidence.json'), root: directory });
  writeJson(join(directory, 'report.json'), result);
  return { directory, result, contract, evidence };
}

try {
  const reference = runCandidate('reference', 'access-service.mjs');
  const mutant = runCandidate('mutant', 'access-service-mutant.mjs');
  if (reference.result.status !== 'passed') throw new Error(`Reference rejected: ${JSON.stringify(reference.result)}`);
  if (mutant.result.status !== 'failed') throw new Error(`Semantic counterexample not rejected: ${JSON.stringify(mutant.result)}`);

  const stale = join(output, 'stale-checker');
  cpSync(reference.directory, stale, { recursive: true });
  writeFileSync(join(stale, 'checker.mjs'), `${readFileSync(join(stale, 'checker.mjs'), 'utf8')}\n// Changed checker bytes.\n`);
  const staleReport = evaluateCoverageFiles({ contractPath: join(stale, 'contract.yaml'), planPath: join(stale, 'plan.json'), evidencePath: join(stale, 'evidence.json'), root: stale });
  if (staleReport.status !== 'stale') throw new Error(`Checker drift not detected: ${JSON.stringify(staleReport)}`);
  writeJson(join(output, 'stale-report.json'), staleReport);

  const after = structuredClone(reference.contract.document);
  after.version = '1.0.0';
  after.capabilities[0].requirements[0].statement = 'A revoked fixture reader may read once more before further reads are refused.';
  const afterBytes = Buffer.from(stringify(after));
  writeFileSync(join(output, 'after-contract.yaml'), afterBytes, { flag: 'wx' });
  const impact = compareContracts(reference.contract.document, after, null, { beforeSha256: reference.contract.sha256, afterSha256: hash(afterBytes) });
  if (!impact.impact.clause_ids.includes('REQ-ACCESS-002') || !impact.impact.acceptance_ids.includes('ACC-ACCESS-002') || impact.proof_transfer !== 'not_performed')
    throw new Error('Changed dependency did not produce the expected revalidation impact.');
  writeJson(join(output, 'impact-report.json'), impact);

  const summary = {
    format_version: 1, scope: 'synthetic-public-interface-example', status: 'passed',
    observations: { reference: reference.result.status, semantic_counterexample: mutant.result.status, changed_checker: staleReport.status, dependent_case_revalidation: true },
    full_contract_conformance: 'not_assessed', consumer_conformance: 'not_assessed',
    limitations: ['Synthetic volatile fixture, not real authentication or a product candidate.', 'Evaluator checks supplied records and current bytes; producer honesty and review identity are not authenticated.'],
  };
  writeJson(join(output, 'summary.json'), summary);
  console.log(JSON.stringify({ ...summary, artifacts: temporary ? 'temporary files removed after completion' : output }, null, 2));
} finally {
  if (temporary) rmSync(output, { recursive: true, force: true });
}
