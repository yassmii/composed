import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readResults, saveJSON } from './storage.mjs';

const mean = (values) =>
  values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;

export function summarize(protocol, results) {
  if (
    new Set(results.map((row) => row.id)).size !== results.length ||
    results.some((row) => !protocol.schedule.some((trial) => trial.id === row.id))
  )
    throw new Error('Duplicate or unknown trial records.');
  const allResults = protocol.schedule.map(
    (trial) => results.find((row) => row.id === trial.id) ?? { ...trial, outcome: 'not_run' },
  );
  const cohorts = {};
  for (const cohort of [...new Set(protocol.schedule.map((trial) => trial.cohort))]) {
    const rows = allResults.filter((result) => result.cohort === cohort);
    const conditions = {};
    for (const condition of ['baseline', 'kit']) {
      const selected = rows.filter((result) => result.condition === condition);
      const checks = selected.flatMap((result) => result.grade?.checks ?? []);
      const dispatched = selected.filter((result) => result.dispatch_requested_at);
      const usageComplete =
        dispatched.length > 0 &&
        dispatched.every(
          (result) => result.observation?.root_usage_coverage?.complete_root_usage === true,
        );
      const rootTokens = Object.fromEntries(
        ['input_tokens', 'cached_input_tokens', 'output_tokens', 'reasoning_output_tokens'].map(
          (key) => [
            key,
            usageComplete &&
            dispatched.every((result) => Number.isFinite(result.observation?.root_usage?.[key]))
              ? dispatched.reduce((sum, result) => sum + result.observation.root_usage[key], 0)
              : null,
          ],
        ),
      );
      conditions[condition] = {
        scheduled: selected.length,
        passed: selected.filter((result) => result.outcome === 'passed').length,
        failed: selected.filter((result) => result.outcome === 'failed').length,
        blocked: selected.filter((result) => result.outcome === 'blocked').length,
        not_run: selected.filter((result) => result.outcome === 'not_run').length,
        acceptance: {
          passed: checks.filter((check) => check.kind === 'acceptance' && check.passed).length,
          observed: checks.filter((check) => check.kind === 'acceptance').length,
        },
        regression: {
          passed: checks.filter((check) => check.kind === 'regression' && check.passed).length,
          observed: checks.filter((check) => check.kind === 'regression').length,
        },
        mean_agent_ms: mean(
          selected.map((result) => result.agent?.duration_ms).filter(Number.isFinite),
        ),
        dispatched: dispatched.length,
        agent_duration_observed_trials: selected.filter((result) =>
          Number.isFinite(result.agent?.duration_ms),
        ).length,
        root_tokens_if_all_dispatched_known: rootTokens,
        root_usage_observed_trials: selected.filter((result) => result.observation?.root_usage)
          .length,
        root_usage_incomplete_trials: selected.filter(
          (result) => result.observation?.root_usage_coverage?.complete_root_usage === false,
        ).length,
        cost_usd: null,
      };
    }
    const paired = [];
    for (const row of rows.filter((result) => result.condition === 'baseline')) {
      const kit = rows.find(
        (result) =>
          result.task_id === row.task_id &&
          result.repetition === row.repetition &&
          result.condition === 'kit',
      );
      const comparable = Boolean(
        kit &&
          row.observation?.completed &&
          kit.observation?.completed &&
          row.grade &&
          kit.grade &&
          ['passed', 'failed'].includes(row.outcome) &&
          ['passed', 'failed'].includes(kit.outcome),
      );
      paired.push({
        task_id: row.task_id,
        repetition: row.repetition,
        comparable,
        delivery: !comparable
          ? 'unknown'
          : row.outcome === kit.outcome
            ? 'tie'
            : kit.outcome === 'passed'
              ? 'kit'
              : 'baseline',
        agent_ms_delta_kit_minus_baseline: comparable
          ? kit.agent.duration_ms - row.agent.duration_ms
          : null,
      });
    }
    cohorts[cohort] = { conditions, pairs: paired };
  }
  return {
    format_version: 1,
    evaluation_kind: 'paired-agent-delivery-pilot',
    protocol_digest: protocol.digest,
    cohorts,
    cost_usd: null,
    usage_scope: 'root session usage where emitted; completeness of delegated usage is unknown',
    human_interventions_during_trials: 0,
    human_intervention_scope:
      'No follow-up answers are supplied during automated sessions; setup labour is not measured.',
    comparative_benefit: 'not_established',
    limitations: [
      'A small local synthetic pilot is not a cross-provider ranking or a statistically supported advantage.',
      'Development and confirmation cohorts are separate; grader calibration is not a model trial.',
      'Root token counts are not an invoice and may omit delegated work. Monetary cost is unknown.',
      'Withheld grader files are not an adversarially sealed sandbox. Only declared source interfaces are tested.',
      'Methodology instructions and a completed process do not establish complete delivery governance.',
    ],
  };
}

export function markdownReport(protocol, summary) {
  const lines = [
    '# Paired agent delivery pilot',
    '',
    `Protocol: ${protocol.digest}. Requested model: ${protocol.agent.model}; effort: ${protocol.agent.effort}.`,
    '',
    '| Cohort | Condition | Passed | Failed | Blocked | Not run | Mean agent ms |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: |',
  ];
  for (const [cohort, data] of Object.entries(summary.cohorts)) {
    for (const [condition, row] of Object.entries(data.conditions)) {
      lines.push(
        `| ${cohort} | ${condition} | ${row.passed} | ${row.failed} | ${row.blocked} | ${row.not_run} | ${row.mean_agent_ms ?? 'unknown'} |`,
      );
    }
  }
  lines.push(
    '',
    'Currency cost: unknown. Root-token observations, where present, are in individual trial records.',
    '',
    'Comparative benefit: not established.',
    '',
  );
  for (const limitation of summary.limitations) lines.push(`- ${limitation}`);
  return `${lines.join('\n')}\n`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 3)
    throw new Error('Usage: node benchmarks/report.mjs <run-directory>');
  const root = resolve(process.argv[2]);
  const protocol = JSON.parse(readFileSync(resolve(root, 'protocol.json'), 'utf8'));
  const results = readResults(root, protocol);
  const summary = summarize(protocol, results);
  saveJSON(resolve(root, 'summary.json'), summary);
  writeFileSync(resolve(root, 'report.md'), markdownReport(protocol, summary));
  console.log(JSON.stringify(summary, null, 2));
}
