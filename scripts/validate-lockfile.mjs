import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const lockPath = fileURLToPath(new URL('../package-lock.json', import.meta.url));
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
if (lock.lockfileVersion !== 3 || !lock.packages) {
  throw new Error('Expected a version 3 workspace package-lock.json.');
}

function resolvePackage(from, dependency) {
  const parts = from ? from.split('/') : [];
  for (let length = parts.length; length >= 0; length--) {
    if (parts[length - 1] === 'node_modules') continue;
    const path = [...parts.slice(0, length), 'node_modules', dependency].join('/');
    if (lock.packages[path]) return lock.packages[path];
  }
}

const errors = [];
let checked = 0;
for (const [path, entry] of Object.entries(lock.packages)) {
  for (const [dependency, expected] of Object.entries(entry.optionalDependencies ?? {})) {
    checked++;
    const resolved = resolvePackage(path, dependency);
    if (!resolved) {
      errors.push(`${path || '(root)'}: missing ${dependency}@${expected}`);
    } else if (/^\d+\.\d+\.\d+(?:[-+].*)?$/.test(expected) && resolved.version !== expected) {
      errors.push(
        `${path || '(root)'}: ${dependency} requires ${expected}, resolves to ${resolved.version}`,
      );
    }
  }
}

if (errors.length) {
  console.error('Incomplete cross-platform lockfile:');
  for (const error of errors) console.error(`  ${error}`);
  console.error('Restore the missing optional-package records before running npm ci.');
  process.exitCode = 1;
} else {
  console.log(`Lockfile: ${checked} optional dependencies resolve across all declared platforms.`);
}
