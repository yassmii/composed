#!/usr/bin/env node
import { lstatSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readContract } from './lib/contract-format.mjs';
import { compareContracts } from './lib/contract-impact.mjs';

export function runContractComparison(args) {
  const values = new Map();
  let json = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--json' && !json) { json = true; continue; }
    const [key, ...tail] = arg.split('=');
    if (!['--before', '--after', '--mapping'].includes(key) || values.has(key)) throw new Error(`Unknown or repeated option: ${arg}`);
    const value = tail.length ? tail.join('=') : args[++i];
    if (!value || value.startsWith('--')) throw new Error(`Supply ${key} with a file path.`);
    values.set(key, resolve(value));
  }
  if (!values.has('--before') || !values.has('--after')) throw new Error('Usage: compare-contracts --before FILE --after FILE [--mapping FILE] [--json]');
  const before = readContract(values.get('--before'));
  const after = readContract(values.get('--after'));
  let mapping = null;
  if (values.has('--mapping')) {
    const filename = values.get('--mapping');
    const stat = lstatSync(filename);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 2 * 1024 * 1024) throw new Error('Mapping must be an ordinary JSON file no larger than 2 MiB.');
    const bytes = readFileSync(filename);
    if (bytes.length > 2 * 1024 * 1024) throw new Error('Mapping exceeds the 2 MiB read limit.');
    mapping = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  }
  const result = compareContracts(before.document, after.document, mapping, { beforeSha256: before.sha256, afterSha256: after.sha256 });
  if (json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`Contract impact: ${result.status}. ${result.changes.modified.length} modified, ${result.changes.added.length} added, ${result.changes.removed.length} removed.`);
    console.log(`Revalidate clauses: ${result.impact.clause_ids.join(', ') || '(none detected)'}`);
    console.log(`Acceptance impact (${result.impact.coverage}): ${result.impact.acceptance_ids.join(', ') || '(none detected)'}`);
    for (const finding of result.findings) console.log(`[${finding.code}] ${finding.path}: ${finding.message}`);
    console.log('Compatibility is not assessed; no evidence or approval is transferred.');
  }
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = runContractComparison(process.argv.slice(2));
    if (result.status === 'invalid') process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
