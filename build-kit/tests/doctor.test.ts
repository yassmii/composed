import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { runDoctor } from '../src/cli/doctor.ts';
import { runInit } from '../src/cli/init.ts';
import { KIT_VERSION } from '../src/cli/types.ts';

const FIXTURE = resolve(__dirname, 'fixtures/empty-project');
const KIT_ROOT = resolve(__dirname, '..');

let tmp: string;
let originalHome: string | undefined;

beforeEach(async () => {
  tmp = mkdtempSync(join(tmpdir(), 'hunch-doctor-'));
  originalHome = process.env.HOME;
  process.env.HOME = join(tmp, 'home');
  cpSync(FIXTURE, tmp, { recursive: true });
  mkdirSync(join(tmp, '.git'), { recursive: true });
  await runInit([
    '--yes',
    '--lang=fr',
    '--agents=claude-code',
    '--skills=core',
    `--cwd=${tmp}`,
    `--kit-root=${KIT_ROOT}`,
  ]);
});

afterEach(() => {
  if (originalHome === undefined) Reflect.deleteProperty(process.env, 'HOME');
  else process.env.HOME = originalHome;
  rmSync(tmp, { recursive: true, force: true });
});

describe('runDoctor', () => {
  it('reports a healthy install', async () => {
    const result = await runDoctor([`--cwd=${tmp}`, '--json']);
    expect(result.healthy).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.scope).toBe('installation-and-instructions');
    expect(result.runtime_verification).toBe('not_performed');
  });

  it('detects missing AGENTS.md', async () => {
    unlinkSync(join(tmp, 'AGENTS.md'));
    const result = await runDoctor([`--cwd=${tmp}`, '--json']);
    expect(result.healthy).toBe(false);
    expect(result.errors.some((e: string) => /AGENTS\.md/.test(e))).toBe(true);
  });

  it('detects missing version file', async () => {
    unlinkSync(join(tmp, '.agents/.composed-kit-version'));
    const result = await runDoctor([`--cwd=${tmp}`, '--json']);
    expect(result.healthy).toBe(false);
    expect(result.errors.some((e: string) => /\.composed-kit-version/.test(e))).toBe(true);
  });

  it('warns when the agentic routing contract is missing', async () => {
    unlinkSync(join(tmp, 'skills/catalog.json'));
    const result = await runDoctor([`--cwd=${tmp}`, '--json']);
    expect(result.healthy).toBe(true);
    expect(result.warnings.some((warning: string) => /catalog\.json/.test(warning))).toBe(true);
  });

  it('warns when the installed kit version differs from the current kit', async () => {
    const versionPath = join(tmp, '.agents/.composed-kit-version');
    const installedVersion = readFileSync(versionPath, 'utf8');
    writeFileSync(
      versionPath,
      installedVersion.replace(`version: ${KIT_VERSION}`, 'version: 0.1.0'),
    );

    const result = await runDoctor([`--cwd=${tmp}`, '--json']);
    expect(result.healthy).toBe(true);
    expect(result.warnings.some((warning: string) => /Version drift/.test(warning))).toBe(true);
  });

  it('reports delivery-policy drift without rewriting the installed policy', async () => {
    const path = join(tmp, 'skills/catalog.json');
    const catalog = JSON.parse(readFileSync(path, 'utf8'));
    Reflect.deleteProperty(catalog, 'delivery_policy');
    const retained = JSON.stringify(catalog);
    writeFileSync(path, retained);
    const result = await runDoctor([`--cwd=${tmp}`, '--json']);
    expect(
      result.findings.some((finding) =>
        finding.id.startsWith('catalog.policy-drift.delivery_policy:'),
      ),
    ).toBe(true);
    expect(result.runtime_verification).toBe('not_performed');
    expect(readFileSync(path, 'utf8')).toBe(retained);
  });
});
