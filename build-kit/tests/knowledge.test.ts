import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { knowledgeOptions, runKnowledge } from '../src/cli/knowledge.ts';

const CLI = resolve(__dirname, '../bin/composed-kit.mjs');
const SEED = resolve(__dirname, '../memory/MEMORY.md');
const INDEX = '.agents/memory/MEMORY.md';
let project: string;

function write(path: string, content: string | Buffer) {
  fs.mkdirSync(dirname(join(project, path)), { recursive: true });
  fs.writeFileSync(join(project, path), content);
}

function snapshot(root: string): Record<string, string> {
  const files: Record<string, string> = {};
  function visit(path: string, prefix = '') {
    for (const entry of fs.readdirSync(path, { withFileTypes: true })) {
      const name = `${prefix}${entry.name}`;
      if (entry.isDirectory()) visit(join(path, entry.name), `${name}/`);
      else if (entry.isFile())
        files[name] = fs.readFileSync(join(path, entry.name)).toString('base64');
      else files[name] = '<non-ordinary>';
    }
  }
  visit(root);
  return files;
}

const check = () => runKnowledge(['check', `--cwd=${project}`, '--json']);

beforeEach(() => {
  project = fs.realpathSync(fs.mkdtempSync(join(tmpdir(), 'composed-knowledge-')));
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(project, { recursive: true, force: true });
});

describe('read-only knowledge integrity', () => {
  it('accepts the actual seed without treating commented examples as missing notes', async () => {
    write(INDEX, fs.readFileSync(SEED));
    const before = snapshot(project);
    const result = await check();
    expect(result.status).toBe('passed');
    expect(result.semantic_freshness).toBe('not_assessed');
    expect(result.files.map((file) => file.path)).toEqual([INDEX]);
    expect(result.links).toEqual([]);
    expect(result.coverage.notes_selected).toBe(0);
    expect(snapshot(project)).toEqual(before);
  });

  it('blocks a missing index without creating a memory directory or an empty success', async () => {
    const result = await check();
    expect(result.status).toBe('blocked');
    expect(result.files[0]?.status).toBe('blocked');
    expect(result.findings[0]?.id).toBe('knowledge.file_unchecked');
    expect(fs.readdirSync(project)).toEqual([]);
  });

  it('checks a legacy note and source without new metadata, source reads or mutation', async () => {
    write(INDEX, '[Operating context](project_context.md)\n');
    write(
      '.agents/memory/project_context.md',
      'Legacy note. [Decision](../../docs/decisions.md)\n',
    );
    write('docs/decisions.md', 'Canonical decision; not copied into memory.\n');
    const before = snapshot(project);
    const opens = vi.spyOn(fs, 'openSync');
    const result = await check();
    expect(result.status).toBe('passed');
    expect(result.coverage.notes_read).toBe(1);
    expect(result.coverage.local_file_checks).toBe(2);
    expect(opens.mock.calls.map((call) => String(call[0]))).toEqual([
      join(project, INDEX),
      join(project, '.agents/memory/project_context.md'),
    ]);
    expect(snapshot(project)).toEqual(before);
  });

  it('reports a missing indexed note and a missing canonical source as structural failures', async () => {
    write(INDEX, '[Missing](project_missing.md)\n[Context](project_context.md)\n');
    write('.agents/memory/project_context.md', '[Decision](../../docs/missing.md)\n');
    const result = await check();
    expect(result.status).toBe('blocked');
    expect(result.links.filter((link) => link.status === 'blocked')).toHaveLength(2);
    expect(result.coverage.notes_read).toBe(1);
    expect(result.findings.every((finding) => finding.id === 'knowledge.link_unchecked')).toBe(
      true,
    );
  });

  it('ignores frontmatter, comments and fenced/inline examples while reading visible links', async () => {
    write(INDEX, '[Context](project_context.md)\n');
    write(
      '.agents/memory/project_context.md',
      [
        '---',
        'name: project-context',
        'description: "[not a body link](missing-frontmatter.md)"',
        '---',
        '<!-- [comment](missing-comment.md) -->',
        '```markdown',
        '[fence](missing-fence.md)',
        '```',
        '~~~markdown',
        '[tilde](missing-tilde.md)',
        '~~~',
        '`[inline](missing-inline.md)` and ``[double](missing-double.md)``',
        '\\[escaped](missing-escaped.md)',
        '[Live](../../README.md)',
      ].join('\n'),
    );
    write('README.md', 'Current source');
    const result = await check();
    expect(result.status).toBe('passed');
    expect(result.links.map((link) => link.target)).toEqual([
      'project_context.md',
      '../../README.md',
    ]);
  });

  it('reports anchors and unsupported forms as unverified, never as semantic freshness', async () => {
    write(INDEX, '[Context](project_context.md#scope)\n');
    write(
      '.agents/memory/project_context.md',
      [
        '[Decision](../../docs/decisions.md#not-a-real-anchor)',
        '[[wiki-name]]',
        '[source][ref]',
        '[ref]: ../../missing-reference.md',
        '[Remote](https://example.invalid/private)',
        '<https://example.invalid/other>',
        '![Image](../../missing-image.png)',
        '[Query](../../README.md?version=old)',
      ].join('\n'),
    );
    write('docs/decisions.md', '# Current document\n');
    const result = await check();
    expect(result.status).toBe('passed');
    expect(result.coverage.notes_read).toBe(1);
    expect(result.coverage.unverified_links).toBe(9);
    expect(result.coverage.local_file_checks).toBe(2);
    expect(result.links.every((link) => link.status === 'unverified')).toBe(true);
    expect(result.semantic_freshness).toBe('not_assessed');
  });

  it('still blocks a missing file behind an unverified fragment', async () => {
    write(INDEX, '[Missing](project_missing.md#heading)');
    const result = await check();
    expect(result.status).toBe('blocked');
    expect(result.links[0]?.local_file).toBe('blocked');
  });

  it('refuses traversal, absolute paths and Windows aliases without reading outside the project', async () => {
    write(
      INDEX,
      [
        '[Outside](../../../secret.md)',
        '[Encoded](%2e%2e/%2e%2e/%2e%2e/secret.md)',
        '[Absolute](/tmp/secret.md)',
        '[Drive](C:/secret.md)',
        '[DriveRelative](C:secret.md)',
        '[Metadata](../../.git/config)',
        '[Reserved](../../nul.txt)',
        '[Slash](..\\..\\secret.md)',
      ].join('\n'),
    );
    const opens = vi.spyOn(fs, 'openSync');
    const result = await check();
    expect(result.status).toBe('blocked');
    expect(result.links).toHaveLength(8);
    expect(result.links.every((link) => link.status === 'blocked')).toBe(true);
    expect(opens.mock.calls.map((call) => String(call[0]))).toEqual([join(project, INDEX)]);
  });

  it.skipIf(process.platform === 'win32')('does not follow indexed file symlinks', async () => {
    const outside = fs.mkdtempSync(join(tmpdir(), 'composed-knowledge-outside-'));
    try {
      fs.writeFileSync(join(outside, 'project_private.md'), 'Do not read');
      write(INDEX, '[Linked](project_linked.md)');
      fs.symlinkSync(
        join(outside, 'project_private.md'),
        join(project, '.agents/memory/project_linked.md'),
      );
      const opens = vi.spyOn(fs, 'openSync');
      expect((await check()).status).toBe('blocked');
      expect(opens.mock.calls.map((call) => String(call[0]))).toEqual([join(project, INDEX)]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  it('does not follow linked memory directories, including Windows junctions', async () => {
    const outside = fs.mkdtempSync(join(tmpdir(), 'composed-knowledge-outside-'));
    try {
      fs.writeFileSync(join(outside, 'MEMORY.md'), 'Do not read');
      fs.mkdirSync(join(project, '.agents'));
      fs.symlinkSync(
        outside,
        join(project, '.agents/memory'),
        process.platform === 'win32' ? 'junction' : 'dir',
      );
      const opens = vi.spyOn(fs, 'openSync');
      expect((await check()).status).toBe('blocked');
      expect(opens).not.toHaveBeenCalled();
      expect(fs.readFileSync(join(outside, 'MEMORY.md'), 'utf8')).toBe('Do not read');
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  it('refuses directory targets and only reads flat notes directly indexed, not recursive note links', async () => {
    write(INDEX, '[First](project_first.md)\n[Docs](../../docs)');
    write('.agents/memory/project_first.md', '[Second](project_second.md)');
    write('.agents/memory/project_second.md', '[Not traversed](missing.md)');
    fs.mkdirSync(join(project, 'docs'));
    const result = await check();
    expect(result.status).toBe('blocked');
    expect(result.coverage.notes_read).toBe(1);
    expect(result.files.some((file) => file.path.endsWith('project_second.md'))).toBe(false);
    expect(result.links.find((link) => link.target === 'project_second.md')?.status).toBe('passed');
  });

  it('fails closed on invalid UTF-8 and incomplete frontmatter', async () => {
    write(INDEX, Buffer.from([0xc3, 0x28]));
    expect((await check()).status).toBe('blocked');
    write(INDEX, '---\nname: not-closed\n[Missing](project_missing.md)');
    const result = await check();
    expect(result.status).toBe('blocked');
    expect(result.findings[0]?.id).toBe('knowledge.syntax_unchecked');
  });

  it('enforces file, aggregate content and indexed-note bounds without claiming complete coverage', async () => {
    write(INDEX, 'x'.repeat(64 * 1024 + 1));
    expect((await check()).status).toBe('blocked');
    const names = Array.from({ length: 65 }, (_, i) => `project_${i}.md`);
    write(INDEX, names.map((name) => `[Note](${name})`).join('\n'));
    for (const name of names) write(`.agents/memory/${name}`, '');
    const noteBound = await check();
    expect(noteBound.status).toBe('blocked');
    expect(noteBound.coverage.notes_selected).toBe(64);
    expect(noteBound.findings.some((finding) => finding.id === 'knowledge.note_limit')).toBe(true);
    write(
      INDEX,
      names
        .slice(0, 18)
        .map((name) => `[Note](${name})`)
        .join('\n'),
    );
    for (const name of names.slice(0, 18)) write(`.agents/memory/${name}`, 'x'.repeat(60 * 1024));
    const bytesBound = await check();
    expect(bytesBound.status).toBe('blocked');
    expect(bytesBound.coverage.bytes_read).toBeGreaterThan(1024 * 1024);
  });

  it('bounds links and displayed destinations', async () => {
    write('README.md', 'source');
    write(INDEX, Array.from({ length: 129 }, () => '[Source](../../README.md)').join('\n'));
    const result = await check();
    expect(result.status).toBe('blocked');
    expect(result.links).toHaveLength(128);
    expect(result.findings.some((finding) => finding.id === 'knowledge.link_limit')).toBe(true);
    write(INDEX, `[Long](${'x'.repeat(1025)})`);
    const long = await check();
    expect(long.status).toBe('blocked');
    expect(long.links[0]?.target).toHaveLength(1024);
  });

  it('handles a bounded note containing unmatched bracket text without treating it as links', async () => {
    write(INDEX, '['.repeat(64 * 1024));
    const result = await check();
    expect(result.status).toBe('passed');
    expect(result.links).toEqual([]);
  });

  it('rejects ambiguous options and invalid project roots before reading memory', async () => {
    for (const args of [
      [],
      ['check', '--json=true'],
      ['check', '--cwd'],
      ['check', '--force'],
      ['check', '--json', '--json'],
      ['check', '--cwd=a', '--cwd=b'],
    ])
      expect(() => knowledgeOptions(args)).toThrow();
    expect(knowledgeOptions(['check']).cwd).toBe(process.cwd());
    await expect(runKnowledge(['check', `--cwd=${project}/missing`, '--json'])).rejects.toThrow();
    write('root-file', 'not a directory');
    await expect(runKnowledge(['check', `--cwd=${project}/root-file`, '--json'])).rejects.toThrow(
      /ordinary/,
    );
  });

  it('emits one JSON report and scoped CLI exit codes without writing to the project', () => {
    const blocked = spawnSync(
      process.execPath,
      [CLI, 'knowledge', 'check', '--json', `--cwd=${project}`],
      { encoding: 'utf8' },
    );
    expect(blocked.status, blocked.stderr).toBe(1);
    expect(JSON.parse(blocked.stdout).status).toBe('blocked');
    write(INDEX, '# Empty active index\n');
    const before = snapshot(project);
    const passed = spawnSync(
      process.execPath,
      [CLI, 'knowledge', 'check', '--json', `--cwd=${project}`],
      { encoding: 'utf8' },
    );
    expect(passed.status, passed.stderr).toBe(0);
    const result = JSON.parse(passed.stdout);
    expect(result.scope).toBe('memory-index-and-local-link-integrity');
    expect(result.semantic_freshness).toBe('not_assessed');
    expect(snapshot(project)).toEqual(before);
  });
});
