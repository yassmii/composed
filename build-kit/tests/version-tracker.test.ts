import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { InstalledVersion } from '../src/cli/types.ts';
import { legacyVersionFilePath, readVersion, writeVersion } from '../src/cli/version-tracker.ts';

let tmp: string;

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), 'hunch-test-'));
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

const sample: InstalledVersion = {
  version: '0.1.0',
  installed_at: '2026-05-24T14:23:00Z',
  lang: 'fr',
  agents: ['claude-code', 'codex'],
  skills: { core: 8, support: 3, extras: 0 },
};

describe('version-tracker', () => {
  it('writes and reads back a version record', () => {
    writeVersion(tmp, sample);
    const read = readVersion(tmp);
    expect(read).toEqual(sample);
  });

  it('returns null when no version file exists', () => {
    expect(readVersion(tmp)).toBeNull();
  });

  it('round-trips an EN install', () => {
    const enRecord: InstalledVersion = { ...sample, lang: 'en' };
    writeVersion(tmp, enRecord);
    expect(readVersion(tmp)).toEqual(enRecord);
  });

  it('reads a legacy Hunch tracking record during migration', () => {
    const path = legacyVersionFilePath(tmp);
    mkdirSync(join(tmp, '.agents'), { recursive: true });
    writeFileSync(
      path,
      [
        `version: ${sample.version}`,
        `installed_at: ${sample.installed_at}`,
        `lang: ${sample.lang}`,
        'agents:',
        ...sample.agents.map((agent) => `  - ${agent}`),
        'skills:',
        `  core: ${sample.skills.core}`,
        `  support: ${sample.skills.support}`,
        `  extras: ${sample.skills.extras}`,
        '',
      ].join('\n'),
    );

    expect(readVersion(tmp)).toEqual(sample);
  });
});
