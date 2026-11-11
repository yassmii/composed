import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const directories = process.argv.slice(2);
if (directories.length < 2) {
  throw new Error('Usage: node evals/compare.mjs <run-directory> <run-directory> [...]');
}

const summaries = directories.map((directory) => {
  const path = resolve(directory, 'summary.json');
  return { directory, ...JSON.parse(readFileSync(path, 'utf8')) };
});

console.log('| Adapter | Passed | Total | Score | Run directory |');
console.log('|---|---:|---:|---:|---|');
for (const summary of summaries) {
  console.log(
    `| ${summary.adapter} | ${summary.passed} | ${summary.total} | ${Math.round(summary.score * 100)}% | ${summary.directory} |`,
  );
}
