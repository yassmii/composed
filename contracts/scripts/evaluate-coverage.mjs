#!/usr/bin/env node
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateCoverageFiles } from './lib/contract-coverage.mjs';

export function runCoverage(args) {
  const values = new Map();
  let json = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--json' && !json) {
      json = true;
      continue;
    }
    const [key, ...tail] = arg.split('=');
    if (!['--contract', '--plan', '--evidence', '--root'].includes(key) || values.has(key))
      throw new Error(`Unknown or repeated option: ${arg}`);
    const value = tail.length ? tail.join('=') : args[++i];
    if (!value || value.startsWith('--')) throw new Error(`${key} requires a value.`);
    values.set(key, value);
  }
  for (const key of ['--contract', '--plan', '--root'])
    if (!values.has(key)) throw new Error(`${key} is required.`);
  const report = evaluateCoverageFiles({
    contractPath: values.get('--contract'),
    planPath: values.get('--plan'),
    evidencePath: values.get('--evidence'),
    root: values.get('--root'),
  });
  if (json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(
      `Scoped contract evidence: ${report.status}. Full contract conformance: not assessed.`,
    );
    for (const item of report.obligations) console.log(`  ${item.clause_id}: ${item.status}`);
    for (const item of report.findings)
      console.log(`  [${item.code}] ${item.path}: ${item.message}`);
  }
  return report;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const report = runCoverage(process.argv.slice(2));
    if (!report.healthy) process.exitCode = 1;
  } catch (error) {
    if (process.argv.includes('--json'))
      console.log(
        JSON.stringify(
          {
            format_version: 1,
            scope: 'contract-evidence-consistency',
            status: 'invalid',
            healthy: false,
            full_contract_conformance: 'not_assessed',
            findings: [{ code: 'input.invalid', message: error.message }],
          },
          null,
          2,
        ),
      );
    else console.error(error.message);
    process.exitCode = 1;
  }
}
