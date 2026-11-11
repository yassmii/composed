// Oracle checks independently specified behavior through a child process's JSONL interface.
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const candidate = process.argv[2];
if (!candidate || process.argv.length !== 3) throw new Error('Usage: node checker.mjs CANDIDATE');
const transcripts = [];
function exercise(operations) {
  const command = [process.execPath, resolve(candidate)];
  const result = spawnSync(command[0], command.slice(1), {
    input: `${operations.map((operation) => JSON.stringify({ operation })).join('\n')}\n`,
    encoding: 'utf8', timeout: 3000, maxBuffer: 65536, shell: false,
  });
  const transcript = { operations, command, exit_code: result.status, signal: result.signal,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '', error: result.error?.message ?? null };
  transcripts.push(transcript);
  if (result.status !== 0 || result.error || result.signal) return null;
  try {
    const rows = result.stdout.trim().split(/\r?\n/).map((line) => JSON.parse(line));
    return rows.length === operations.length ? rows : null;
  } catch { return null; }
}
const reads = exercise(['read', 'revoke', 'read']);
const revocations = exercise(['revoke', 'revoke', 'history']);
const facts = [
  ['CASE-READ-POSITIVE', 'ACC-ACCESS-001', 'positive', reads?.[0]?.status === 'allowed' && reads?.[0]?.record === 'fictional-record'],
  ['CASE-READ-NEGATIVE', 'ACC-ACCESS-001', 'negative', reads?.[2]?.status === 'denied' && !Object.hasOwn(reads?.[2] ?? {}, 'record')],
  ['CASE-REVOKE-POSITIVE', 'ACC-ACCESS-002', 'positive', revocations?.[0]?.active === false && revocations?.[0]?.transitions === 1],
  ['CASE-REVOKE-BOUNDARY', 'ACC-ACCESS-002', 'boundary', revocations?.[1]?.active === false && revocations?.[1]?.transitions === 1],
  ['CASE-HISTORY-POSITIVE', 'ACC-ACCESS-003', 'positive', revocations?.[2]?.events?.length === 1 && revocations?.[2]?.events?.[0]?.event === 'revoked'],
];
const cases = facts.map(([id, acceptance_id, kind, passed]) => ({
  id, acceptance_id, kind, method: 'automated', boundary: 'public-interface',
  status: passed ? 'pass' : 'fail',
}));
console.log(JSON.stringify({ cases, transcripts }));
if (cases.some((entry) => entry.status !== 'pass')) process.exitCode = 1;
