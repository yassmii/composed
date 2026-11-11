import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { conditions, readProtocol } from './protocol.mjs';

const outcomes = ['accepted', 'failed', 'blocked', 'timed_out', 'not_run'];
const median = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const ref = (value) => typeof value === 'string' && value.trim().length > 0;

function validateRecord(protocol, trial, record) {
  if (!outcomes.includes(record.outcome)) throw new Error(`Invalid outcome: ${trial.id}`);
  if (record.protocol_sha256 !== protocol.sha256)
    throw new Error(`Wrong protocol identity: ${trial.id}`);
  if (record.outcome === 'not_run') return;
  if (
    !Number.isFinite(record.duration_ms) ||
    record.duration_ms < 0 ||
    !Array.isArray(record.evidence) ||
    !record.evidence.length ||
    !record.evidence.every(ref) ||
    !ref(record.client) ||
    !ref(record.client_version) ||
    !ref(record.access_mode) ||
    !ref(record.requested_model) ||
    record.client !== protocol.environment.client ||
    record.client_version !== protocol.environment.client_version ||
    record.access_mode !== protocol.environment.access_mode ||
    !protocol.environment.allowed_models.includes(record.requested_model) ||
    (trial.condition !== 'C' && record.requested_model !== protocol.environment.fixed_model) ||
    !(record.observed_model === null || ref(record.observed_model)) ||
    record.revision !== protocol.revisions[trial.condition]
  )
    throw new Error(`Missing execution evidence: ${trial.id}`);
  if (
    record.outcome === 'accepted' &&
    (record.grade?.passed !== true || record.gates_passed !== true || record.duration_ms === 0)
  )
    throw new Error(`Acceptance without checks/gates: ${trial.id}`);
  if (record.outcome === 'accepted' && trial.family === 'risky-interface') {
    const review = record.review;
    if (
      !review ||
      !['native-subagent', 'fresh-session', 'external-agent'].includes(review.mode) ||
      !ref(review.author_id) ||
      !ref(review.reviewer_id) ||
      review.author_id === review.reviewer_id ||
      review.fresh_context !== true ||
      review.verdict !== 'accepted' ||
      !ref(review.evidence)
    )
      throw new Error(`Missing independent review: ${trial.id}`);
  }
  for (const key of ['cost_usd', 'tokens', 'human_interventions', 'retries']) {
    const value = record[key];
    if (!(value === null || (Number.isFinite(value) && value >= 0)))
      throw new Error(`Metric must be observed or null: ${key}`);
  }
}

export function summarize(protocol, records) {
  if (!Array.isArray(records)) throw new Error('Expected trial records array.');
  const byId = new Map();
  for (const record of records) {
    const trial = protocol.schedule.find((row) => row.id === record.id);
    if (!trial || byId.has(record.id)) throw new Error('Unknown or duplicate trial.');
    validateRecord(protocol, trial, record);
    byId.set(record.id, record);
  }
  const cohorts = {};
  let allComparable = true;
  for (const cohort of ['development', 'confirmation']) {
    const scheduled = protocol.schedule.filter((trial) => trial.cohort === cohort);
    const aggregates = {};
    for (const condition of conditions) {
      const trials = scheduled.filter((trial) => trial.condition === condition);
      const rows = trials.map((trial) => byId.get(trial.id) ?? { outcome: 'not_run' });
      aggregates[condition] = {
        scheduled: trials.length,
        outcomes: Object.fromEntries(
          outcomes.map((outcome) => [
            outcome,
            rows.filter((row) => row.outcome === outcome).length,
          ]),
        ),
        // These describe coverage; comparison below requires complete pairs and equal quality.
        accepted_median_ms: median(
          rows.filter((row) => row.outcome === 'accepted').map((row) => row.duration_ms),
        ),
        spent_ms: rows.reduce((total, row) => total + (row.duration_ms ?? 0), 0),
        cost_usd: rows.every((row) => Number.isFinite(row.cost_usd))
          ? rows.reduce((total, row) => total + row.cost_usd, 0)
          : null,
      };
    }
    const comparisons = {};
    for (const [left, right] of [
      ['A', 'B'],
      ['B', 'C'],
    ]) {
      const groups = { direct: [], complex: [] };
      let comparable = true;
      for (const trial of scheduled.filter((row) => row.condition === left)) {
        const other = scheduled.find(
          (row) =>
            row.task_id === trial.task_id &&
            row.repetition === trial.repetition &&
            row.condition === right,
        );
        const a = byId.get(trial.id);
        const b = byId.get(other.id);
        if (
          a?.outcome !== 'accepted' ||
          b?.outcome !== 'accepted' ||
          a.client !== b.client ||
          a.client_version !== b.client_version ||
          a.access_mode !== b.access_mode ||
          (left === 'A' && a.requested_model !== b.requested_model)
        ) {
          comparable = false;
          continue;
        }
        groups[trial.family === 'direct' ? 'direct' : 'complex'].push(
          1 - b.duration_ms / a.duration_ms,
        );
      }
      allComparable &&= comparable;
      comparisons[`${left}_to_${right}`] = {
        comparable,
        paired_complex_median_gain: comparable ? median(groups.complex) : null,
        paired_direct_median_gain: comparable ? median(groups.direct) : null,
      };
    }
    cohorts[cohort] = { conditions: aggregates, comparisons };
  }
  const confirmation = cohorts.confirmation.comparisons;
  const passes = (comparison) =>
    comparison.comparable &&
    comparison.paired_complex_median_gain >= protocol.thresholds.complex_median_gain &&
    comparison.paired_direct_median_gain >= -protocol.thresholds.direct_max_regression;
  return {
    format_version: 1,
    protocol_sha256: protocol.sha256,
    cohorts,
    complete_comparable_campaign: allComparable,
    organisation_target_observed: allComparable && passes(confirmation.A_to_B),
    adaptive_target_observed: allComparable && passes(confirmation.B_to_C),
    comparative_benefit: 'not_established',
    evidence_authenticity: 'local-unsigned-records-not-authenticated',
    limitations: [
      'Semantic judges check fixture code; delegation, access, review and elapsed acceptance time need cited session evidence.',
      'Unknown usage stays null. Failures and missing trials remain in outcome counts and block target claims.',
      'Small synthetic pilot; target observations do not establish general equivalence or model rankings.',
    ],
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 4)
      throw new Error('Usage: report.mjs <protocol.json> <records.json>');
    console.log(
      JSON.stringify(
        summarize(readProtocol(process.argv[2]), JSON.parse(readFileSync(process.argv[3], 'utf8'))),
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
