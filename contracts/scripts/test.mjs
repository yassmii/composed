import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('../tests/', import.meta.url));
const files = readdirSync(directory).filter((name) => name.endsWith('.test.mjs')).sort()
  .map((name) => resolve(directory, name));
if (!files.length) throw new Error('No contract regression tests found.');
const result = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit', shell: false });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
