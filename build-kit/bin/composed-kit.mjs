#!/usr/bin/env node
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { register } from 'tsx/esm/api';

const __dirname = dirname(fileURLToPath(import.meta.url));
const entry = resolve(__dirname, '..', 'src/cli/__main__.ts');

// Do not resolve `node_modules/.bin/tsx` ourselves: npm and pnpm lay out
// transitive binaries differently for Git-based `npx` installs on Windows.
// Importing the runtime as a package follows Node's normal dependency resolver.
const unregister = register();
try {
  await import(pathToFileURL(entry).href);
} finally {
  unregister();
}
