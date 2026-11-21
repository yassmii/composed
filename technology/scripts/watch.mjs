import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadCatalog, root, validateCatalog } from './validate.mjs';

export async function observe(source, previous, fetcher = fetch) {
  try {
    const response = await fetcher(source.url, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Composed-Technology-Watch/0.1' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = await response.text();
    if (!body.trim()) throw new Error('Empty response');
    const sha256 = createHash('sha256').update(body).digest('hex');
    const status = !previous || previous.url !== source.url ? 'new' : previous.sha256 === sha256 ? 'unchanged' : 'changed';
    return { ...source, status, sha256 };
  } catch (error) {
    return { ...source, status: 'unavailable', error: error.message };
  }
}

export function candidateBaseline(results, previous, observedOn) {
  const candidate = {};
  for (const item of results) {
    if (item.status !== 'unavailable') candidate[item.id] = { url: item.url, sha256: item.sha256, observed_on: observedOn };
    else if (previous[item.id]?.url === item.url) candidate[item.id] = previous[item.id];
  }
  return candidate;
}

function reportMarkdown(report) {
  const lines = ['# Technology source review proposals', '', `Observed: ${report.observed_on}`, '',
    'Content changes are signals, not reviewed facts. Inspect sources and affected claims before changing recommendations.', '',
    '| Entry | Source | Status | Action |', '| --- | --- | --- | --- |'];
  for (const item of report.sources) {
    const action = item.status === 'unchanged' ? 'No byte change; scheduled semantic review still applies' : item.status === 'unavailable' ? 'Retry source; freshness unknown' : 'Review release/support/security impact and affected studies';
    lines.push(`| ${item.entry} | [${item.id}](${item.url}) | ${item.status} | ${action} |`);
  }
  lines.push('', '## Due reviews', '', ...report.freshness.map((warning) => `- ${warning}`));
  return `${lines.join('\n')}\n`;
}

async function main() {
  const catalog = loadCatalog();
  const validation = validateCatalog(catalog);
  if (validation.errors.length) throw new Error(validation.errors.join('; '));
  const channels = JSON.parse(readFileSync(path.join(root, 'watch-sources.json'), 'utf8'));
  const baseline = JSON.parse(readFileSync(path.join(root, 'watch-baseline.json'), 'utf8'));
  const sources = [...channels, ...catalog.entries.flatMap((entry) => [
    ...entry.sources.map((source) => ({ ...source, id: `doc-${source.id}`, entry: entry.id, kind: 'documentation' })),
    { id: `license-${entry.id}`, entry: entry.id, kind: 'license', url: entry.license.source },
  ])];
  if (new Set(sources.map((s) => s.id)).size !== sources.length) throw new Error('Duplicate watch ID');
  for (const source of sources) {
    if (!catalog.entries.some((e) => e.id === source.entry) || !source.url.startsWith('https://')) throw new Error(`Invalid watch source ${source.id}`);
  }
  const results = [];
  for (let start = 0; start < sources.length; start += 4) results.push(...await Promise.all(sources.slice(start, start + 4).map((s) => observe(s, baseline[s.id]))));
  writeReports(results, baseline, validation.warnings);
  if (results.some((r) => r.status === 'unavailable')) process.exitCode = 1;
}

function writeReports(results, baseline, freshness) {
  const observedOn = new Date().toISOString();
  const report = { observed_on: observedOn, freshness, sources: results };
  const output = path.join(root, 'reports');
  mkdirSync(output, { recursive: true });
  writeFileSync(path.join(output, 'watch.json'), JSON.stringify(report, null, 2) + '\n');
  writeFileSync(path.join(output, 'watch.md'), reportMarkdown(report));
  writeFileSync(path.join(output, 'watch-baseline.candidate.json'), JSON.stringify(candidateBaseline(results, baseline, observedOn), null, 2) + '\n');
  console.log(`Observed ${results.length} sources; ${results.filter((r) => r.status === 'unavailable').length} unavailable. Report: technology/reports/watch.md`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(`Technology watch failed: ${error.message}`); process.exitCode = 1; });
}
