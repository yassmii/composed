import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { runInit } from '../src/cli/init.ts';

const KIT_ROOT = resolve(__dirname, '..');
const projects: string[] = [];

afterEach(() => {
  for (const project of projects.splice(0)) rmSync(project, { recursive: true, force: true });
});

describe('acceptance-led delivery path', () => {
  for (const lang of ['fr', 'en']) {
    it(`installs the optional path without removing review gates in ${lang}`, async () => {
      const project = mkdtempSync(join(tmpdir(), 'composed-acceptance-led-'));
      projects.push(project);
      mkdirSync(join(project, '.git'));
      await runInit([
        '--yes',
        `--lang=${lang}`,
        '--agents=codex',
        '--skills=core,support',
        `--cwd=${project}`,
        `--kit-root=${KIT_ROOT}`,
      ]);
      const read = (path: string) => readFileSync(join(project, path), 'utf8');

      const doctrine = read('AGENTS.md');
      expect(doctrine).toContain('acceptance.md');
      expect(doctrine).toContain(lang === 'en' ? 'once per' : 'une fois par jalon');
      // The independent gate and the author-check rule stay in force.
      expect(doctrine).toContain('self-review');
      expect(doctrine).toContain(lang === 'en' ? 'closure gate' : 'obligatoire avant clôture');

      for (const skill of [
        'skills/core/delivery-orchestrator/SKILL.md',
        'skills/support/delivery-review/SKILL.md',
      ]) {
        expect(read(skill)).toContain('acceptance.md');
        expect(read(skill)).toContain('self-review');
      }
      expect(read('.agents/work/README.md')).toContain('acceptance.md');
    });
  }

  it('declares the path as optional in the catalog and keeps the review policy', () => {
    const catalog = JSON.parse(readFileSync(join(KIT_ROOT, 'skills/catalog.json'), 'utf8'));
    const path = catalog.delivery_policy.acceptance_led;
    expect(path.when).toMatch(/^Optional/);
    expect(path.artifact).toBe('.agents/work/<work-item>/acceptance.md');
    expect(path.full_review_when).toEqual(
      expect.arrayContaining([
        'explicit full-review request',
        'cases amended without a recorded reason',
        'stale, failed or missing evidence',
      ]),
    );
    expect(catalog.artifact_protocol.files).toContain('acceptance.md');
    expect(catalog.execution_policy.review).toContain('Self-review');
    expect(catalog.delivery_policy.planned.evidence).toContain('Independent review is required');
  });

  it('documents the path and links it from the kit entry points', () => {
    const read = (path: string) => readFileSync(join(KIT_ROOT, path), 'utf8');
    const guide = read('docs/acceptance-led-delivery.md');
    expect(guide).toContain('## The local contract extension');
    expect(guide).toContain('not conformance to a product contract');
    expect(read('README.md')).toContain('docs/acceptance-led-delivery.md');
    expect(read('docs/proportionate-delivery.md')).toContain('acceptance-led-delivery.md');
  });
});
