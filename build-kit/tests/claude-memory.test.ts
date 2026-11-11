import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyClaudeMemory,
  claudeProjectSlug,
  planClaudeMemory,
} from '../src/cli/claude-memory.ts';
import { claudeMemoryMirrorPath, ensureSymlinkOrCopy } from '../src/cli/fs-helpers.ts';

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return { ...actual, symlinkSync: vi.fn(actual.symlinkSync) };
});

let root: string;
let project: string;
let home: string;
beforeEach(() => {
  // macOS temporary directories can have a linked /var ancestor. Ordinary fixtures
  // use the physical path; linked ancestors are exercised explicitly below.
  root = realpathSync(mkdtempSync(join(tmpdir(), 'composed-claude-memory-')));
  project = join(root, 'project');
  home = join(root, 'home');
  mkdirSync(join(project, '.agents/memory'), { recursive: true });
  mkdirSync(home);
});
afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});
const plan = (requested = false) =>
  planClaudeMemory({ projectRoot: project, homeDir: home, requested, env: {} });
function link(target: string, path: string) {
  mkdirSync(dirname(path), { recursive: true });
  symlinkSync(target, path, process.platform === 'win32' ? 'junction' : 'dir');
}
function expected() {
  return claudeMemoryMirrorPath(home, project);
}

describe('Claude project path adapter', () => {
  it('preserves each separator, initial dash, input case and replaces punctuation', () => {
    expect(claudeProjectSlug('/mnt/c/Users/alice/repos/sample-project')).toBe(
      '-mnt-c-Users-alice-repos-sample-project',
    );
    expect(claudeProjectSlug('c:\\Users\\alice\\repos\\sample-project')).toBe(
      'c--Users-alice-repos-sample-project',
    );
    expect(claudeProjectSlug('C:\\Users\\alice')).toBe('C--Users-alice');
    expect(claudeProjectSlug('/repo/a_b.c ç')).toBe('-repo-a-b-c--');
  });

  it('matches the observed 200-character boundary and rolling-hash suffix', () => {
    expect(claudeProjectSlug(`/${'a'.repeat(199)}`)).toBe(`-${'a'.repeat(199)}`);
    expect(claudeProjectSlug(`/${'a'.repeat(200)}`)).toBe(`-${'a'.repeat(199)}-b6ymvl`);
  });

  it('keeps Windows helper paths native and rejects a relative home', () => {
    expect(claudeMemoryMirrorPath('C:\\Users\\alice', 'c:\\Repos\\p')).toBe(
      'C:\\Users\\alice\\.claude\\projects\\c--Repos-p\\memory',
    );
    expect(() => claudeMemoryMirrorPath('', project)).toThrow(/absolute/);
    expect(
      planClaudeMemory({ projectRoot: project, homeDir: 'relative', requested: true }).status,
    ).toBe('unsafe');
  });

  it('uses os.homedir instead of a missing or relative HOME fallback', () => {
    const result = planClaudeMemory({ projectRoot: project, env: { HOME: '' } });
    expect(result.destination).toBe(claudeMemoryMirrorPath(homedir(), project));
    expect(result.action).toBe('none');
    expect(result.blocking).toBe(false);
  });
});

describe('explicit external memory action', () => {
  it('default inspection, repeated preview and default application never create anything', () => {
    expect(plan()).toEqual(plan());
    expect(plan().status).toBe('missing');
    expect(applyClaudeMemory(plan()).action).toBe('none');
    expect(readdirSync(home)).toEqual([]);
    expect(plan(true).action).toBe('create-link');
    expect(readdirSync(home)).toEqual([]);
  });

  it('creates only the requested symlink/junction and observes future shared changes', () => {
    const result = applyClaudeMemory(plan(true));
    expect(result.status).toBe('created');
    expect(lstatSync(expected()).isSymbolicLink()).toBe(true);
    writeFileSync(join(project, '.agents/memory/live.md'), 'after link');
    expect(readFileSync(join(expected(), 'live.md'), 'utf8')).toBe('after link');
    expect(plan(true).status).toBe('linked');
    expect(plan(true).action).toBe('none');
  });

  it('preserves copies and never overwrites their independent contents', () => {
    mkdirSync(expected(), { recursive: true });
    writeFileSync(join(expected(), 'local.md'), 'user owned');
    expect(plan(true).status).toBe('copy');
    expect(plan(true).blocking).toBe(true);
    expect(applyClaudeMemory(plan(true)).action).toBe('preserve');
    expect(readFileSync(join(expected(), 'local.md'), 'utf8')).toBe('user owned');
  });

  it('preserves a correct mirror and separately reports the old slug', () => {
    link(join(project, '.agents/memory'), expected());
    const old = join(
      home,
      '.claude/projects',
      project.replace(/^[\\/]+/, '').replace(/[:\\/]+/g, '-'),
      'memory',
    );
    link(join(project, '.agents/memory'), old);
    const result = plan(true);
    expect(result.status).toBe('linked');
    expect(result.legacy_paths).toContain(old);
    expect(readlinkSync(old)).toBeTruthy();
  });

  it('preserves legacy-only mirrors and reports them instead of claiming expected health', () => {
    const old = join(
      home,
      '.claude/projects',
      project.replace(/^[\\/]+/, '').replace(/[:\\/]+/g, '-'),
      'memory',
    );
    link(join(project, '.agents/memory'), old);
    expect(plan().status).toBe('legacy');
    expect(plan(true).blocking).toBe(true);
    expect(applyClaudeMemory(plan(true)).action).toBe('preserve');
    expect(existsSync(expected())).toBe(false);
    expect(lstatSync(old).isSymbolicLink()).toBe(true);
  });

  it('preserves both wrong-target and dangling links', () => {
    const outside = join(root, 'outside');
    mkdirSync(outside);
    link(outside, expected());
    expect(plan(true).status).toBe('wrong-target');
    expect(readlinkSync(expected())).toContain('outside');
    rmSync(expected(), { recursive: true });
    link(join(root, 'absent'), expected());
    expect(plan(true).status).toBe('broken');
    expect(lstatSync(expected()).isSymbolicLink()).toBe(true);
  });

  it('refuses linked config ancestors, linked targets and relative config paths', () => {
    const outside = join(root, 'outside');
    mkdirSync(outside);
    link(outside, join(home, '.claude'));
    expect(plan(true).status).toBe('unsafe');
    expect(readdirSync(outside)).toEqual([]);
    rmSync(join(home, '.claude'), { recursive: true });
    expect(
      planClaudeMemory({
        projectRoot: project,
        homeDir: home,
        configDir: 'relative',
        requested: true,
      }).status,
    ).toBe('unsafe');
    rmSync(join(project, '.agents/memory'), { recursive: true });
    link(outside, join(project, '.agents/memory'));
    expect(plan(true).status).toBe('unsafe');
  });

  it('refuses a linked project ancestor even when its target is a valid directory', () => {
    const alias = join(root, 'project-alias');
    link(project, alias);
    const preview = planClaudeMemory({
      projectRoot: alias,
      homeDir: home,
      requested: true,
      env: {},
    });
    expect(preview.status).toBe('unsafe');
    expect(preview.reason).toContain(`Linked or non-directory ancestor: ${alias}`);
    expect(applyClaudeMemory(preview).action).toBe('preserve');
    expect(readdirSync(home)).toEqual([]);
  });

  it('reports the configured config root and declines unsupported memory overrides/worktrees', () => {
    const config = join(home, 'custom-config');
    const custom = planClaudeMemory({
      projectRoot: project,
      homeDir: home,
      configDir: config,
      env: {},
    });
    expect(custom.destination).toBe(join(config, 'projects', claudeProjectSlug(project), 'memory'));
    for (const name of [
      'CLAUDE_CODE_PROJECT_DIR_NAME',
      'CLAUDE_CODE_REMOTE_MEMORY_DIR',
      'CLAUDE_COWORK_MEMORY_PATH_OVERRIDE',
    ]) {
      expect(
        planClaudeMemory({
          projectRoot: project,
          homeDir: home,
          requested: true,
          env: { [name]: 'custom' },
        }).status,
      ).toBe('unsupported');
    }
    mkdirSync(join(project, '.claude'));
    writeFileSync(
      join(project, '.claude/settings.local.json'),
      JSON.stringify({ autoMemoryDirectory: outsidePath() }),
    );
    expect(plan(true).status).toBe('unsupported');
    rmSync(join(project, '.claude/settings.local.json'));
    writeFileSync(join(project, '.git'), 'gitdir: /external/worktrees/project');
    expect(plan(true).status).toBe('unsupported');
  });

  it('rechecks the preview, preserving an entry that appeared before application', () => {
    const preview = plan(true);
    mkdirSync(expected(), { recursive: true });
    writeFileSync(join(expected(), 'private.md'), 'keep');
    expect(applyClaudeMemory(preview).status).toBe('failed');
    expect(readFileSync(join(expected(), 'private.md'), 'utf8')).toBe('keep');
  });

  it('rechecks settings changed after preview before creating the requested link', () => {
    const preview = plan(true);
    mkdirSync(join(project, '.claude'));
    writeFileSync(
      join(project, '.claude/settings.local.json'),
      JSON.stringify({ autoMemoryDirectory: outsidePath() }),
    );
    expect(plan(true).status).toBe('unsupported');
    const result = applyClaudeMemory(preview);
    expect(result.status).toBe('failed');
    expect(result.reason).toContain('changed after preview');
    expect(readdirSync(home)).toEqual([]);
  });

  it('reports a link failure without copying target files', () => {
    const preview = plan(true);
    const invalid = join(root, 'ordinary-file');
    writeFileSync(invalid, 'not directory');
    const result = applyClaudeMemory({ ...preview, target: invalid });
    expect(result.status).toBe('failed');
    expect(result.reason).toContain('no copy fallback');
    expect(existsSync(expected())).toBe(false);
  });

  it('a denied symlink syscall reports failure and never creates a copy', () => {
    writeFileSync(join(project, '.agents/memory/private.md'), 'shared only');
    const denied = Object.assign(new Error('denied'), { code: 'EACCES' });
    vi.mocked(symlinkSync).mockImplementationOnce(() => {
      throw denied;
    });
    const result = applyClaudeMemory(plan(true));
    expect(result.status).toBe('failed');
    expect(result.reason).toContain('no copy fallback');
    expect(existsSync(expected())).toBe(false);
    expect(readFileSync(join(project, '.agents/memory/private.md'), 'utf8')).toBe('shared only');
  });

  it.skipIf(process.platform !== 'win32')(
    'recognizes an existing lowercase drive mirror from an uppercase CLI path',
    () => {
      const lower = project[0]?.toLowerCase() + project.slice(1);
      const upper = project[0]?.toUpperCase() + project.slice(1);
      const destination = join(home, '.claude/projects', claudeProjectSlug(lower), 'memory');
      link(join(project, '.agents/memory'), destination);
      const result = planClaudeMemory({
        projectRoot: upper,
        homeDir: home,
        env: {},
        requested: true,
      });
      expect(result.status).toBe('linked');
      expect(result.action).toBe('none');
      expect(result.blocking).toBe(false);
    },
  );

  it('the compatibility helper also preserves a broken existing link', () => {
    const path = join(root, 'broken');
    link(join(root, 'absent'), path);
    expect(() => ensureSymlinkOrCopy(join(project, '.agents/memory'), path)).toThrow();
    expect(lstatSync(path).isSymbolicLink()).toBe(true);
  });
});
function outsidePath() {
  return resolve(root, 'custom-memory');
}
