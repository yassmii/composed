import fs from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { TextDecoder } from 'node:util';
import { safeProjectPath } from './managed-files.ts';

const INDEX = '.agents/memory/MEMORY.md';
const MEMORY = '.agents/memory';
const LIMITS = {
  notes: 64,
  file_bytes: 64 * 1024,
  total_bytes: 1024 * 1024,
  links: 128,
  target_characters: 1024,
  path_segments: 32,
} as const;

type Finding = { id: string; path: string; message: string };
type Link = {
  source: string;
  line: number;
  target: string;
  status: 'passed' | 'blocked' | 'unverified';
  reason: string;
  resolved_path?: string;
  local_file: 'present' | 'blocked' | 'not_checked';
};
type CheckedFile = {
  path: string;
  kind: 'index' | 'note';
  status: 'read' | 'blocked';
  bytes?: number;
};
export type KnowledgeResult = {
  format_version: 1;
  scope: 'memory-index-and-local-link-integrity';
  status: 'passed' | 'blocked';
  semantic_freshness: 'not_assessed';
  context: { cwd: string; observed_at: string };
  files: CheckedFile[];
  links: Link[];
  findings: Finding[];
  coverage: {
    notes_selected: number;
    notes_read: number;
    bytes_read: number;
    local_file_checks: number;
    unverified_links: number;
    limits: typeof LIMITS;
  };
  limitations: string[];
};

export function knowledgeOptions(args: string[]): { cwd: string; json: boolean } {
  if (args[0] !== 'check') throw new Error('Usage: knowledge check [--cwd <project>] [--json]');
  let cwd = process.cwd();
  let json = false;
  const seen = new Set<string>();
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (!arg) throw new Error('Empty knowledge option.');
    const equals = arg.indexOf('=');
    const key = equals < 0 ? arg : arg.slice(0, equals);
    if (seen.has(key)) throw new Error(`Supply ${key} only once.`);
    seen.add(key);
    if (arg === '--json') json = true;
    else if (key === '--cwd') {
      const value = equals < 0 ? args[++i] : arg.slice(equals + 1);
      if (!value || value.startsWith('--')) throw new Error('--cwd requires a value.');
      cwd = resolve(value);
    } else throw new Error(`Unknown knowledge option: ${arg}`);
  }
  return { cwd, json };
}

function message(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).slice(0, 400);
}

function sameIdentity(a: fs.Stats, b: fs.Stats): boolean {
  return a.dev === b.dev && a.ino === b.ino;
}

function localTarget(root: string, source: string, value: string): string {
  const path = decodeURIComponent(value);
  if (
    !path ||
    isAbsolute(path) ||
    path.includes('\\') ||
    /[<>:"|?*]/.test(path) ||
    [...path].some((character) => character.charCodeAt(0) < 32)
  )
    throw new Error('Expected a project-local relative file path.');
  const absolute = resolve(root, dirname(source), path);
  const target = relative(root, absolute).split(sep).join('/');
  const parts = target.split('/');
  if (
    !target ||
    isAbsolute(target) ||
    parts.length > LIMITS.path_segments ||
    parts.some(
      (part) =>
        !part ||
        part === '..' ||
        /[. ]$/.test(part) ||
        ['.git', '.hg', '.svn'].includes(part.toLowerCase()) ||
        /^(con|prn|aux|nul|conin\$|conout\$|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(part),
    )
  )
    throw new Error('Target escapes the project or uses an unsafe path.');
  return target;
}

/** A deliberately narrow inline-link reader, not a complete Markdown or YAML parser. */
function maskInlineCode(line: string): string {
  const runs = [...line.matchAll(/`+/g)];
  const nextByLength = new Map<number, number>();
  const next: (number | undefined)[] = [];
  for (let i = runs.length - 1; i >= 0; i--) {
    const length = (runs[i] as RegExpMatchArray)[0].length;
    next[i] = nextByLength.get(length);
    nextByLength.set(length, i);
  }
  const result: string[] = [];
  let position = 0;
  for (let i = 0; i < runs.length; i++) {
    const close = next[i];
    if (close === undefined) continue;
    const start = (runs[i] as RegExpMatchArray).index as number;
    const ending = runs[close] as RegExpMatchArray;
    const end = (ending.index as number) + ending[0].length;
    result.push(line.slice(position, start), ' '.repeat(end - start));
    position = end;
    i = close;
  }
  result.push(line.slice(position));
  return result.join('');
}

function visibleLines(text: string): string[] {
  const lines = text.split(/\r?\n/);
  if (lines[0] === '---') {
    const end = lines.findIndex((line, index) => index > 0 && /^(---|\.\.\.)$/.test(line));
    if (end < 0) throw new Error('Unclosed frontmatter; link coverage cannot be established.');
    for (let i = 0; i <= end; i++) lines[i] = '';
  }
  const withoutComments = lines
    .join('\n')
    .replace(/<!--[\s\S]*?(?:-->|$)/g, (match) => match.replace(/[^\n]/g, ' '));
  let fence: { character: string; length: number } | undefined;
  return withoutComments.split('\n').map((line) => {
    const marker = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence) {
      if (
        marker?.[1]?.[0] === fence.character &&
        marker[1].length >= fence.length &&
        !marker[2]?.trim()
      )
        fence = undefined;
      return '';
    }
    if (marker?.[1]) {
      fence = { character: marker[1][0] as string, length: marker[1].length };
      return '';
    }
    // Inline examples are not links. Match complete runs, including double-backtick examples.
    return maskInlineCode(line);
  });
}

type Candidate = { line: number; target: string; unsupported?: string };
function candidates(text: string): Candidate[] {
  const found: Candidate[] = [];
  for (const [index, line] of visibleLines(text).entries()) {
    const append = (target: string, unsupported?: string) => {
      if (found.length >= LIMITS.links + 1) return;
      found.push({ line: index + 1, target, ...(unsupported ? { unsupported } : {}) });
    };
    for (const match of line.matchAll(/!?\[[^[\]\n]*\](?:\(([^)[\n]*)\)|\[([^[\]\n]*)\])/g)) {
      const offset = match.index ?? 0;
      const slashes = /\\*$/.exec(line.slice(0, offset))?.[0].length ?? 0;
      if (slashes % 2) continue;
      if (match[2] !== undefined) append(match[0], 'reference-style');
      else if (match[0].startsWith('!')) append(match[0], 'image');
      else append(match[1] ?? '');
    }
    for (const match of line.matchAll(/\[\[[^[\]\n]*\]\]/g)) append(match[0], 'wiki');
    const definition = /^ {0,3}\[[^\]]+\]:/.exec(line);
    if (definition) append(line.trim(), 'reference-definition');
    for (const match of line.matchAll(/<(?:https?:\/\/|mailto:)[^>\n]+>/g))
      append(match[0], 'remote-autolink');
  }
  return found;
}

export async function runKnowledge(args: string[]): Promise<KnowledgeResult> {
  const options = knowledgeOptions(args);
  const initial = fs.lstatSync(options.cwd);
  if (initial.isSymbolicLink() || !initial.isDirectory())
    throw new Error('Select an existing ordinary project root.');
  const cwd = fs.realpathSync(options.cwd);
  if (cwd.split(sep).some((part) => ['.git', '.hg', '.svn'].includes(part.toLowerCase())))
    throw new Error('Source-control metadata is not a project root.');
  const identity = fs.lstatSync(cwd);
  const files: CheckedFile[] = [];
  const links: Link[] = [];
  const findings: Finding[] = [];
  const selectedNotes = new Set<string>();
  let bytesRead = 0;
  const fail = (id: string, path: string, detail: string) => {
    findings.push({ id, path, message: detail.slice(0, 400) });
  };
  const inspect = (path: string): string => {
    const rootNow = fs.lstatSync(cwd);
    if (!rootNow.isDirectory() || rootNow.isSymbolicLink() || !sameIdentity(rootNow, identity))
      throw new Error('Project root identity changed.');
    const absolute = safeProjectPath(cwd, path);
    if (!fs.lstatSync(absolute).isFile()) throw new Error('Target is not an ordinary file.');
    return absolute;
  };
  const read = (path: string, kind: CheckedFile['kind']): string | undefined => {
    const entry: CheckedFile = { path, kind, status: 'blocked' };
    files.push(entry);
    let descriptor: number | undefined;
    try {
      const absolute = inspect(path);
      const before = fs.lstatSync(absolute);
      descriptor = fs.openSync(absolute, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0));
      const opened = fs.fstatSync(descriptor);
      if (!opened.isFile() || !sameIdentity(before, opened))
        throw new Error('File identity changed.');
      if (opened.size > LIMITS.file_bytes) throw new Error('Per-file byte limit exceeded.');
      const buffer = Buffer.alloc(LIMITS.file_bytes + 1);
      let size = 0;
      while (size < buffer.length) {
        const count = fs.readSync(descriptor, buffer, size, buffer.length - size, size);
        if (count === 0) break;
        size += count;
      }
      bytesRead += size;
      if (size > LIMITS.file_bytes || bytesRead > LIMITS.total_bytes)
        throw new Error('Knowledge content byte limit exceeded.');
      const after = fs.fstatSync(descriptor);
      if (
        !sameIdentity(opened, after) ||
        opened.size !== after.size ||
        opened.mtimeMs !== after.mtimeMs
      )
        throw new Error('File changed during inspection.');
      const text = new TextDecoder('utf-8', { fatal: true }).decode(buffer.subarray(0, size));
      entry.status = 'read';
      entry.bytes = size;
      return text;
    } catch (error) {
      fail('knowledge.file_unchecked', path, message(error));
      return undefined;
    } finally {
      if (descriptor !== undefined) {
        try {
          fs.closeSync(descriptor);
        } catch (error) {
          entry.status = 'blocked';
          fail('knowledge.close_failed', path, message(error));
        }
      }
    }
  };
  const scan = (source: string, text: string) => {
    let parsed: Candidate[];
    try {
      parsed = candidates(text);
    } catch (error) {
      fail('knowledge.syntax_unchecked', source, message(error));
      return;
    }
    for (const candidate of parsed) {
      if (links.length >= LIMITS.links) {
        fail(
          'knowledge.link_limit',
          source,
          'Link limit exceeded; remaining links were not checked.',
        );
        break;
      }
      const target = candidate.target.trim();
      const link: Link = {
        source,
        line: candidate.line,
        target: target.slice(0, LIMITS.target_characters),
        status: 'unverified',
        reason: candidate.unsupported ?? 'unsupported-destination',
        local_file: 'not_checked',
      };
      links.push(link);
      if (target.length > LIMITS.target_characters) {
        link.status = 'blocked';
        link.reason = 'target-limit';
        fail('knowledge.target_limit', source, 'Link destination exceeds the character limit.');
        continue;
      }
      if (candidate.unsupported) continue;
      let value = target;
      if (value.startsWith('<') && value.endsWith('>')) value = value.slice(1, -1);
      else if (/\s|[()"']/.test(value)) continue;
      if (/^[a-z][a-z0-9+.-]*:/i.test(value) && !/^(file:|[a-z]:)/i.test(value)) {
        link.reason = 'remote-or-scheme';
        continue;
      }
      if (value.includes('?')) {
        link.reason = 'query';
        continue;
      }
      const hash = value.indexOf('#');
      const pathPart = hash < 0 ? value : value.slice(0, hash);
      if (!pathPart) {
        link.reason = 'fragment';
        continue;
      }
      try {
        const resolved = localTarget(cwd, source, pathPart);
        link.resolved_path = resolved;
        inspect(resolved);
        link.local_file = 'present';
        link.status = hash < 0 ? 'passed' : 'unverified';
        link.reason = hash < 0 ? 'local-file-present' : 'fragment-not-checked';
        if (
          source === INDEX &&
          dirname(resolved).split(sep).join('/') === MEMORY &&
          resolved !== INDEX &&
          resolved.toLowerCase().endsWith('.md')
        ) {
          if (selectedNotes.size >= LIMITS.notes && !selectedNotes.has(resolved)) {
            fail('knowledge.note_limit', source, 'Indexed-note limit exceeded; note was not read.');
          } else selectedNotes.add(resolved);
        }
      } catch (error) {
        link.status = 'blocked';
        link.local_file = 'blocked';
        link.reason = 'local-file-unchecked';
        fail('knowledge.link_unchecked', source, `${target}: ${message(error)}`);
      }
    }
  };
  const index = read(INDEX, 'index');
  if (index !== undefined) scan(INDEX, index);
  for (const path of selectedNotes) {
    if (bytesRead >= LIMITS.total_bytes) {
      fail('knowledge.coverage_limit', path, 'Coverage limit reached; selected note was not read.');
      break;
    }
    const text = read(path, 'note');
    if (text !== undefined) scan(path, text);
  }
  const result: KnowledgeResult = {
    format_version: 1,
    scope: 'memory-index-and-local-link-integrity',
    status: findings.length ? 'blocked' : 'passed',
    semantic_freshness: 'not_assessed',
    context: { cwd, observed_at: new Date().toISOString() },
    files,
    links,
    findings,
    coverage: {
      notes_selected: selectedNotes.size,
      notes_read: files.filter((file) => file.kind === 'note' && file.status === 'read').length,
      bytes_read: bytesRead,
      local_file_checks: links.filter((link) => link.local_file !== 'not_checked').length,
      unverified_links: links.filter((link) => link.status === 'unverified').length,
      limits: LIMITS,
    },
    limitations: [
      'Read-only structural checks of the index and directly indexed flat Markdown notes; note links are not traversed recursively.',
      'Plain inline local-file links are checked for ordinary-file presence only. Fragment anchors remain unverified even when their file exists.',
      'Comments, frontmatter and code examples are ignored. Wiki, reference-style, image, query and remote links are not resolved; unsupported forms are explicitly unverified.',
      'This is a bounded Markdown subset, not a complete parser; bare reference shortcuts and unusual multiline/escaped syntax are not interpreted.',
      'No YAML schema, note status, dates, semantic freshness, content truth or external-source freshness is assessed. All directly indexed notes are checked regardless of human status.',
      'No files are written, no URLs fetched and no commands executed. Filesystem identity/link checks are conventional protection, not an adversarial race-proof sandbox.',
    ],
  };
  if (options.json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`Scope: ${result.scope}. Supported checks: ${result.status}.`);
    console.log(
      `Files read: ${files.filter((file) => file.status === 'read').length}; unverified links: ${result.coverage.unverified_links}.`,
    );
    for (const finding of findings)
      console.log(`  [${finding.id}] ${finding.path}: ${finding.message}`);
    console.log('Semantic freshness and correctness: not assessed.');
  }
  return result;
}
