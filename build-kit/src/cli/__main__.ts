import { runDoctor } from './doctor.ts';
import { runEvidence, runVerify } from './evidence.ts';
import { runInit } from './init.ts';
import { runKnowledge } from './knowledge.ts';
import { runPreflight } from './preflight.ts';
import { runRepair } from './repair.ts';
import { runSource } from './source.ts';
import { KIT_VERSION } from './types.ts';
import { runUninstall } from './uninstall.ts';
import { runUpdate } from './update.ts';

const command = process.argv[2] ?? 'init';
const args = process.argv.slice(3);

if (['help', '--help', '-h'].includes(command)) {
  console.log(
    'Usage: composed-kit <init|update|doctor|source|preflight|knowledge|repair|uninstall|evidence|verify> [options]',
  );
  console.log(
    'Init/update: --agents --lang --skills --cwd --kit-root --dry-run --json --yes --keep-local --force --claude-memory=none|link',
  );
  console.log('Uninstall previews by default; --apply removes unchanged managed files.');
  console.log(
    'Evidence: evidence run --subject <path> --requirement <id> --acceptance <id> --output <path> -- <executable> [args]',
  );
  console.log('Verify: verify --evidence <path> [--review <path>] [--json]');
  console.log(
    'Preflight: preflight --write-path <relative-directory> [--write-path <directory>] [--cwd <project>] [--json]',
  );
  console.log('Knowledge: knowledge check [--cwd <project>] [--json]');
  console.log(
    'Source: source [--kit-root <kit>] [--json] (read-only fingerprints and Git observation)',
  );
  process.exit(0);
}
if (command === '--version') {
  console.log(KIT_VERSION);
  process.exit(0);
}

const handlers: Record<string, (args: string[]) => Promise<unknown>> = {
  init: async (options) => {
    const result = await runInit(options);
    if (!result.healthy) process.exitCode = 1;
    return result;
  },
  update: async (options) => {
    const result = await runUpdate(options);
    if (!result.healthy) process.exitCode = 1;
    return result;
  },
  source: runSource,
  evidence: async (options) => {
    const result = await runEvidence(options);
    if (!result.healthy) process.exitCode = 1;
    return result;
  },
  verify: async (options) => {
    const result = await runVerify(options);
    if (!result.healthy) process.exitCode = 1;
    return result;
  },
  uninstall: async (options) => {
    const result = await runUninstall(options);
    if (!result.healthy) process.exitCode = 1;
    return result;
  },
  doctor: async (options) => {
    const result = await runDoctor(options);
    if (!result.healthy) process.exitCode = 1;
    return result;
  },
  preflight: async (options) => {
    const result = await runPreflight(options);
    if (result.status !== 'passed') process.exitCode = 1;
    return result;
  },
  knowledge: async (options) => {
    const result = await runKnowledge(options);
    if (result.status !== 'passed') process.exitCode = 1;
    return result;
  },
  repair: async (options) => {
    const result = await runRepair(options);
    if (!result.remaining.healthy) process.exitCode = 1;
    return result;
  },
};

const handler = handlers[command];
if (!handler) {
  console.error(`Unknown command: ${command}`);
  console.error(
    'Usage: composed-kit <init|update|doctor|source|preflight|knowledge|repair|uninstall|evidence|verify> [options]',
  );
  process.exit(2);
}

handler(args).catch((err: Error) => {
  console.error(`✗ ${err.message}`);
  process.exit(1);
});
