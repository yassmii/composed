import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function inspectPackedFiles(pkg, catalog, kitVersion, packed) {
  const failures = [];
  if (pkg.version !== kitVersion || packed.version !== pkg.version || packed.name !== pkg.name)
    failures.push('Package, CLI and packed metadata identity must agree.');
  if (pkg.license !== 'MIT')
    failures.push('The distributed Build Kit must declare its MIT license.');
  if (pkg.bin?.['composed-kit'] !== './bin/composed-kit.mjs')
    failures.push('The public CLI entry must resolve to the packaged wrapper.');
  if (!Array.isArray(packed.files) || !Array.isArray(catalog.skills))
    throw new Error('Invalid npm file manifest or skill catalog.');
  const paths = packed.files.map((file) => file.path);
  if (new Set(paths).size !== paths.length) failures.push('Duplicate packed paths.');
  const selected = new Set(paths);
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
  ];
  for (const skill of catalog.skills)
    for (const lang of ['fr', 'en'])
      required.push(`skills/${skill.level}/${skill.name}/SKILL.${lang}.md`);
  for (const bridge of [
    'AGENTS.md',
    'CLAUDE.md',
    'GEMINI.md',
    'cline.md',
    'cursor.mdc',
    'windsurfrules',
    'CONVENTIONS.md',
  ])
    for (const lang of ['fr', 'en']) required.push(`bridges/${bridge}.${lang}.tpl`);
  for (const path of required)
    if (!selected.has(path)) failures.push(`Required distribution file missing: ${path}`);
  for (const path of paths) {
    if (
      typeof path !== 'string' ||
      path.startsWith('/') ||
      path.includes('\\') ||
      path.split('/').includes('..') ||
      /(^|\/)(node_modules|tests|coverage|\.git|\.agents)(\/|$)/.test(path) ||
      /^(evals|benchmarks)\/runs\//.test(path) ||
      /^docs\/superpowers\//.test(path) ||
      /(^|\/)(\.env(?:\..*)?|\.npmrc|\.netrc|auth\.json|id_rsa)$/.test(path) ||
      /\.(?:pem|key|p12)$/.test(path)
    )
      failures.push(`Private, development or unsafe packed path: ${String(path)}`);
  }
  return failures;
}

export function checkPackage() {
  const kit = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const pkg = JSON.parse(readFileSync(resolve(kit, 'package.json'), 'utf8'));
  const catalog = JSON.parse(readFileSync(resolve(kit, 'skills/catalog.json'), 'utf8'));
  const kitVersion = /export const KIT_VERSION = '([^']+)'/.exec(
    readFileSync(resolve(kit, 'src/cli/types.ts'), 'utf8'),
  )?.[1];
  const npmCLI = process.env.npm_execpath;
  if (!npmCLI) throw new Error('Run through npm run release:check in the Build Kit workspace.');
  const output = execFileSync(
    process.execPath,
    [npmCLI, 'pack', '--workspace=composed-build-kit', '--dry-run', '--json', '--ignore-scripts'],
    { cwd: resolve(kit, '..'), encoding: 'utf8', timeout: 60000, maxBuffer: 4 * 1024 * 1024 },
  );
  const records = JSON.parse(output);
  if (!Array.isArray(records) || records.length !== 1)
    throw new Error('Expected one npm pack record.');
  const failures = inspectPackedFiles(pkg, catalog, kitVersion, records[0]);
  return {
    format_version: 1,
    scope: 'npm-package-selection',
    status: failures.length ? 'blocked' : 'passed',
    package: { name: pkg.name, version: pkg.version, private: pkg.private === true },
    files: records[0].files.length,
    selection_sha256: createHash('sha256').update(JSON.stringify(records[0].files)).digest('hex'),
    failures,
    artifact_created: false,
    publication_performed: false,
    release_readiness: 'not_assessed',
    limitations: [
      'Actual npm dry-run selection with lifecycle scripts disabled; no tarball was created or installed.',
      'A content pass does not attest a clean revision, hosted CI, secret contents or dependency security.',
      'Component version/tag, visibility, reporting channel and registry publication need separate release decisions.',
    ],
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 2) throw new Error('Usage: npm run release:check');
    const result = checkPackage();
    console.log(JSON.stringify(result, null, 2));
    if (result.status !== 'passed') process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
