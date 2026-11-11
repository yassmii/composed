import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function saveJSON(path, value) {
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
    renameSync(temporary, path);
  } finally {
    rmSync(temporary, { force: true });
  }
}

export function readResults(root, protocol) {
  const path = join(root, 'results.json');
  const results = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : [];
  if (!Array.isArray(results)) throw new Error('Invalid results document.');
  const byId = new Map(results.map((row) => [row.id, row]));
  if (byId.size !== results.length) throw new Error('Duplicate trial records.');
  for (const trial of protocol.schedule) {
    const local = join(root, trial.id, 'result.json');
    if (existsSync(local)) byId.set(trial.id, JSON.parse(readFileSync(local, 'utf8')));
  }
  for (const [id, row] of byId) {
    const trial = protocol.schedule.find((entry) => entry.id === id);
    if (
      !trial ||
      ['id', 'task_id', 'cohort', 'condition', 'repetition'].some((key) => row[key] !== trial[key])
    )
      throw new Error('Trial identity does not match frozen schedule.');
  }
  return [...byId.values()];
}
