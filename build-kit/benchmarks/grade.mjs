import { createHash } from 'node:crypto';
import { copyFileSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tasks } from './corpus.mjs';
import { checkDefinitions, evaluateModule } from './graders.mjs';

const args = process.argv.slice(2);
if (args.length !== 4 || args[0] !== '--task' || args[2] !== '--candidate') {
  console.error('Usage: node grade.mjs --task <id> --candidate <absolute-directory>');
  process.exit(1);
}
const task = tasks.find((entry) => entry.id === args[1]);
if (!task || !isAbsolute(args[3])) {
  console.error('Supply a known task and an absolute candidate directory.');
  process.exit(1);
}

const scratch = mkdtempSync(join(tmpdir(), 'composed-benchmark-grade-'));
try {
  const candidateRoot = resolve(args[3]);
  const sources = [];
  let candidate;
  let loadError;
  try {
    if (!lstatSync(candidateRoot).isDirectory() || lstatSync(candidateRoot).isSymbolicLink()) {
      throw new Error('Candidate root must be a regular directory.');
    }
    for (const relative of task.sources) {
      let from = candidateRoot;
      const parts = relative.split('/');
      for (const [index, part] of parts.entries()) {
        from = join(from, part);
        const stat = lstatSync(from);
        if (
          stat.isSymbolicLink() ||
          (index === parts.length - 1 ? !stat.isFile() : !stat.isDirectory())
        ) {
          throw new Error(`Source is not a regular file path: ${relative}`);
        }
        if (stat.size > 256 * 1024) throw new Error(`Source exceeds 256 KiB: ${relative}`);
      }
      const to = join(scratch, relative);
      mkdirSync(dirname(to), { recursive: true });
      copyFileSync(from, to);
      sources.push({
        path: relative,
        sha256: createHash('sha256').update(readFileSync(to)).digest('hex'),
      });
    }
    candidate = await import(pathToFileURL(join(scratch, task.sources[0])).href);
  } catch (error) {
    loadError = String(error?.message ?? error).slice(0, 600);
  }

  const checks = loadError
    ? checkDefinitions[task.id].map(({ id, kind }) => ({
        id,
        kind,
        passed: false,
        message: `Candidate source unusable: ${loadError}`,
      }))
    : await evaluateModule(task.id, candidate);
  console.log(
    JSON.stringify({
      format_version: 1,
      task_id: task.id,
      cohort: task.cohort,
      sources,
      source_digest: createHash('sha256').update(JSON.stringify(sources)).digest('hex'),
      source_status: loadError ? 'unusable' : 'usable',
      checks,
      passed:
        checks.length === checkDefinitions[task.id].length && checks.every((entry) => entry.passed),
    }),
  );
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
