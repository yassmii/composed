import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const kit = resolve(__dirname, '..');
const { inspectPackedFiles } = await import(
  pathToFileURL(resolve(kit, 'scripts/check-package.mjs')).href
);
const pkg = JSON.parse(readFileSync(resolve(kit, 'package.json'), 'utf8'));
const catalog = JSON.parse(readFileSync(resolve(kit, 'skills/catalog.json'), 'utf8'));
const required = [
  'package.json',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'third-party/engineering-quality-sources.json',
  'third-party/licenses/unclebob-quality-tools-0BSD.txt',
  'README.md',
  'CHANGELOG.md',
  'bin/composed-kit.mjs',
  'src/cli/__main__.ts',
  'src/cli/types.ts',
  'src/cli/preflight.ts',
  'src/cli/knowledge.ts',
  'memory/MEMORY.md',
  'memory/_README.md',
  'work/README.md',
  'skills/catalog.json',
  'docs/getting-started.md',
  'docs/product-delivery.md',
  'docs/knowledge-lifecycle.md',
  'docs/releases.md',
  'docs/engineering-quality.md',
  'examples/engineering-quality/README.md',
  'examples/engineering-quality/verify.mjs',
  'examples/engineering-quality/tool-bridge.py',
  'examples/engineering-quality/requirements.txt',
  ...[
    'access.mjs',
    'assertions.mjs',
    'cases.json',
    'duplicates.ts',
    'fixture-spec.md',
    'labels.mjs',
    'strong.test.mjs',
    'weak.test.mjs',
  ].map((name) => `examples/engineering-quality/fixtures/${name}`),
  'examples/product-loop/README.md',
  ...catalog.skills.flatMap((s: { level: string; name: string }) =>
    ['fr', 'en'].map((lang) => `skills/${s.level}/${s.name}/SKILL.${lang}.md`),
  ),
  ...[
    'AGENTS.md',
    'CLAUDE.md',
    'GEMINI.md',
    'cline.md',
    'cursor.mdc',
    'windsurfrules',
    'CONVENTIONS.md',
  ].flatMap((name) => ['fr', 'en'].map((lang) => `bridges/${name}.${lang}.tpl`)),
];
const packed = (paths = required) => ({
  name: pkg.name,
  version: pkg.version,
  files: paths.map((path) => ({ path })),
});

describe('distribution content contract', () => {
  it('accepts a complete source CLI distribution without requiring publication', () => {
    expect(inspectPackedFiles(pkg, catalog, pkg.version, packed())).toEqual([]);
  });

  it.each([
    'src/cli/knowledge.ts',
    'skills/core/qa/SKILL.fr.md',
    'memory/_README.md',
    'THIRD_PARTY_NOTICES.md',
    'third-party/engineering-quality-sources.json',
    'third-party/licenses/unclebob-quality-tools-0BSD.txt',
    'examples/engineering-quality/verify.mjs',
    'examples/engineering-quality/tool-bridge.py',
    'examples/engineering-quality/fixtures/strong.test.mjs',
  ])('rejects an otherwise valid package missing %s', (path) => {
    expect(
      inspectPackedFiles(pkg, catalog, pkg.version, packed(required.filter((p) => p !== path))),
    ).toContain(`Required distribution file missing: ${path}`);
  });

  it.each([
    '.env',
    'src/auth.json',
    'benchmarks/runs/pilot.json',
    '.agents/memory/user.md',
    'tests/example.ts',
    'secrets/private.key',
    '../outside',
    'node_modules/dependency/index.js',
  ])('rejects accidentally packed private/development path %s', (path) => {
    expect(inspectPackedFiles(pkg, catalog, pkg.version, packed([...required, path]))).toContain(
      `Private, development or unsafe packed path: ${path}`,
    );
  });

  it('rejects mismatched source identities and altered public entry metadata', () => {
    const altered = { ...pkg, bin: { 'composed-kit': './absent.js' }, license: 'UNLICENSED' };
    const failures = inspectPackedFiles(altered, catalog, '0.0.0', packed());
    expect(failures).toHaveLength(3);
  });
});
