import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runDoctor } from '../src/cli/doctor.ts';
import { runInit } from '../src/cli/init.ts';
import { MANIFEST_PATH, digest, readManagedManifest } from '../src/cli/managed-files.ts';
import { runRepair } from '../src/cli/repair.ts';
import { runUninstall } from '../src/cli/uninstall.ts';
import { runUpdate } from '../src/cli/update.ts';
import { readVersion } from '../src/cli/version-tracker.ts';

const kit = resolve(__dirname, '..');
const review = 'skills/core/product-designer/references/visual-review.md';
const mirror = '.cline/skills/product-designer/references/visual-review.md';
const exploration = 'skills/support/ux-shaping/references/visual-exploration.md';
let root: string;
let project: string;
const read = (path: string) => readFileSync(join(project, path), 'utf8');
function write(path: string, text: string) {
  mkdirSync(dirname(join(project, path)), { recursive: true });
  writeFileSync(join(project, path), text);
}
function snapshot(dir = project): Record<string, string> {
  return Object.assign(
    {},
    ...readdirSync(dir, { withFileTypes: true }).map((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? snapshot(path) : { [path]: digest(readFileSync(path)) };
    }),
  );
}
const update = (...args: string[]) =>
  runUpdate(['--yes', `--cwd=${project}`, `--kit-root=${kit}`, ...args]);
const install = (lang = 'fr', source = kit, levels = 'core,support') =>
  runInit([
    '--yes',
    `--lang=${lang}`,
    '--agents=codex,cline',
    `--skills=${levels}`,
    `--cwd=${project}`,
    `--kit-root=${source}`,
  ]);

// Prior design templates/catalog with the executing CLI unchanged: tests the old installed file
// shape and managed baselines, not execution of an archived CLI or an official released artifact.
function legacySource() {
  const source = join(root, 'old-kit');
  for (const tree of ['bin', 'src', 'bridges', 'skills', 'migrations', 'memory'])
    cpSync(join(kit, tree), join(source, tree), { recursive: true });
  for (const path of ['package.json', 'work/README.md']) {
    mkdirSync(dirname(join(source, path)), { recursive: true });
    cpSync(join(kit, path), join(source, path));
  }
  const catalogPath = join(source, 'skills/catalog.json');
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  catalog.version = '3.6.0';
  for (const skill of catalog.skills) Reflect.deleteProperty(skill, 'references');
  writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
  for (const [level, name] of [
    ['core', 'product-designer'],
    ['support', 'ux-shaping'],
  ]) {
    rmSync(join(source, `skills/${level}/${name}/references`), { recursive: true });
    for (const lang of ['fr', 'en'])
      cpSync(
        join(kit, `tests/fixtures/design-v1/${name}.${lang}.md`),
        join(source, `skills/${level}/${name}/SKILL.${lang}.md`),
      );
  }
  return source;
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'composed-design-upgrade-'));
  project = join(root, 'project');
  mkdirSync(join(project, '.git'), { recursive: true });
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  rmSync(root, { recursive: true, force: true });
});

describe('design skill upgrade and reference lifecycle', () => {
  it.each(['fr', 'en'])(
    'upgrades prior %s design skills and preserves project decisions',
    async (lang) => {
      await install(lang, legacySource());
      expect(read('skills/core/product-designer/SKILL.md')).toContain('version: "1.0.0"');
      expect(read('skills/support/ux-shaping/SKILL.md')).toContain('version: "1.1.0"');
      expect(existsSync(join(project, review))).toBe(false);
      write('.agents/project-instructions.md', 'Keep the approved brand.');
      write('.agents/work/checkout/design.md', 'Accepted checkout layout.');
      const before = snapshot();
      const preview = await update('--dry-run', '--json');
      expect(preview.status).toBe('planned');
      expect(preview.writes).toEqual(expect.arrayContaining([review, mirror, exploration]));
      expect(snapshot()).toEqual(before);

      expect((await update()).status).toBe('applied');
      expect(read('skills/core/product-designer/SKILL.md')).toContain('version: "2.0.0"');
      expect(read('skills/support/ux-shaping/SKILL.md')).toContain('version: "2.0.0"');
      const expected = readFileSync(
        join(kit, `skills/core/product-designer/references/visual-review.${lang}.md`),
        'utf8',
      ).replace(/\r\n/g, '\n');
      expect(read(review)).toBe(expected);
      expect(read(mirror)).toBe(expected);
      expect(read(exploration)).toBe(
        readFileSync(
          join(kit, `skills/support/ux-shaping/references/visual-exploration.${lang}.md`),
          'utf8',
        ).replace(/\r\n/g, '\n'),
      );
      expect(read('.agents/project-instructions.md')).toBe('Keep the approved brand.');
      expect(read('.agents/work/checkout/design.md')).toBe('Accepted checkout layout.');
      expect(readManagedManifest(project)?.files[review]).toBe(digest(expected));
      expect(readVersion(project)).toMatchObject({ lang, agents: ['codex', 'cline'] });
      expect((await update('--dry-run', '--json')).writes).toEqual([]);
    },
  );

  it('adds support references to a core-only installation and switches their language', async () => {
    await install('fr', legacySource(), 'core');
    await update();
    expect(existsSync(join(project, exploration))).toBe(false);
    await update('--skills=support', '--lang=en');
    expect(read(exploration)).toContain('# Explore a visual direction');
    expect(read(review)).toContain('# Review visual decisions in context');
    expect(read(mirror)).toBe(read(review));
    expect(readVersion(project)?.skills.core).toBeGreaterThan(0);
    expect(readVersion(project)?.skills.support).toBeGreaterThan(0);
  });

  it('blocks unknown legacy content before writes and preserves it with keep-local', async () => {
    await install('fr', legacySource());
    rmSync(join(project, MANIFEST_PATH));
    const oldSkill = read('skills/core/product-designer/SKILL.md');
    const before = snapshot();
    const preview = await update('--dry-run', '--json');
    expect(preview.status).toBe('blocked');
    expect(preview.conflicts).toContain('skills/core/product-designer/SKILL.md');
    expect(snapshot()).toEqual(before);
    await expect(update()).rejects.toThrow(/conflicts/);
    expect(snapshot()).toEqual(before);
    await update('--keep-local');
    expect(read('skills/core/product-designer/SKILL.md')).toBe(oldSkill);
    expect(existsSync(join(project, review))).toBe(true);
    expect(
      readManagedManifest(project)?.files['skills/core/product-designer/SKILL.md'],
    ).toBeUndefined();
  });

  it('preserves customised references and backs up exact bytes on explicit replacement', async () => {
    await install();
    const baseline = readManagedManifest(project)?.files[review];
    write(review, 'Local shared reference\r\n');
    write(mirror, 'Local Cline reference\r\n');
    const before = snapshot();
    await expect(update()).rejects.toThrow(/conflicts/);
    expect(snapshot()).toEqual(before);
    await update('--keep-local', '--lang=en');
    expect(read(review)).toBe('Local shared reference\r\n');
    expect(read(mirror)).toBe('Local Cline reference\r\n');
    expect(readManagedManifest(project)?.files[review]).toBe(baseline);
    const result = await update('--force');
    expect(read(`${result.backups.directory}/${review}`)).toBe('Local shared reference\r\n');
    expect(read(`${result.backups.directory}/${mirror}`)).toBe('Local Cline reference\r\n');
    expect(read(review)).toContain('# Review visual decisions in context');
    expect(read(mirror)).toBe(read(review));
  });

  it('diagnoses and repairs missing references without replacing customised ones', async () => {
    await install();
    rmSync(join(project, exploration));
    rmSync(join(project, mirror));
    write(review, 'Local shared reference');
    const opts = [`--cwd=${project}`, `--kit-root=${kit}`, '--json'];
    const report = await runDoctor(opts);
    expect(
      report.findings.filter((f) => f.id.startsWith('file.missing:')).map((f) => f.path),
    ).toEqual(expect.arrayContaining([exploration, mirror]));
    const repaired = await runRepair([...opts, '--apply']);
    expect(repaired.applied).toEqual(expect.arrayContaining([exploration, mirror]));
    expect(read(mirror)).toBe('Local shared reference');
    expect(read(review)).toBe('Local shared reference');
    write(mirror, 'Separate mirror');
    expect(
      (await runDoctor(opts)).findings.some((f) => f.id === `cline.mirror-drift:${mirror}`),
    ).toBe(true);
  });

  it('uninstalls only unchanged managed references, retaining local files and design evidence', async () => {
    await install();
    write(review, 'Custom guidance');
    write('skills/core/product-designer/references/local-notes.md', 'Not managed');
    write('.agents/work/example/design.md', 'Accepted design');
    const result = await runUninstall([`--cwd=${project}`, '--apply', '--json']);
    expect(result.removed).toEqual(expect.arrayContaining([mirror, exploration]));
    expect(read(review)).toBe('Custom guidance');
    expect(read('skills/core/product-designer/references/local-notes.md')).toBe('Not managed');
    expect(read('.agents/work/example/design.md')).toBe('Accepted design');
  });

  it('rejects an incomplete reference source before updating a project', async () => {
    await install();
    const source = legacySource();
    cpSync(join(kit, 'skills/catalog.json'), join(source, 'skills/catalog.json'));
    const before = snapshot();
    await expect(
      runUpdate(['--yes', `--cwd=${project}`, `--kit-root=${source}`]),
    ).rejects.toThrow();
    expect(snapshot()).toEqual(before);
  });
});
