import type { AgentId, Lang, SkillLevel } from './types.ts';

export type Flags = {
  yes: boolean;
  dryRun: boolean;
  force: boolean;
  keepLocal: boolean;
  json: boolean;
  claudeMemory: 'none' | 'link';
  lang: Lang | undefined;
  agents: AgentId[] | undefined;
  skills: SkillLevel[] | undefined;
  cwd: string | undefined;
  kitRoot: string | undefined;
};

const KNOWN_AGENTS: ReadonlySet<AgentId> = new Set([
  'claude-code',
  'codex',
  'cursor',
  'gemini',
  'windsurf',
  'aider',
  'cline',
]);

const KNOWN_LEVELS: ReadonlySet<SkillLevel> = new Set(['core', 'support', 'extras']);
const KNOWN_LANGS: ReadonlySet<Lang> = new Set(['fr', 'en']);

export function parseFlags(argv: string[]): Flags {
  const flags: Flags = {
    yes: false,
    dryRun: false,
    force: false,
    keepLocal: false,
    json: false,
    claudeMemory: 'none',
    lang: undefined,
    agents: undefined,
    skills: undefined,
    cwd: undefined,
    kitRoot: undefined,
  };

  const seen = new Set<string>();
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg) continue;
    const key = arg === '-y' ? '--yes' : (arg.split('=')[0] as string);
    if (seen.has(key)) throw new Error(`Supply ${key} only once.`);
    seen.add(key);

    if (arg === '--yes' || arg === '-y') flags.yes = true;
    else if (arg === '--dry-run') flags.dryRun = true;
    else if (arg === '--force') flags.force = true;
    else if (arg === '--keep-local') flags.keepLocal = true;
    else if (arg === '--json') flags.json = true;
    else if (arg === '--claude-memory' || arg.startsWith('--claude-memory=')) {
      const value = arg.startsWith('--claude-memory=') ? arg.slice(16) : argv[++i];
      if (value !== 'none' && value !== 'link')
        throw new Error('--claude-memory requires none or link.');
      flags.claudeMemory = value;
    } else if (arg === '--cwd' || arg.startsWith('--cwd=')) {
      const value = arg.startsWith('--cwd=') ? arg.slice(6) : argv[++i];
      if (!value || value.startsWith('--')) throw new Error('--cwd requires a value');
      flags.cwd = value;
    } else if (arg === '--kit-root' || arg.startsWith('--kit-root=')) {
      const value = arg.startsWith('--kit-root=') ? arg.slice(11) : argv[++i];
      if (!value || value.startsWith('--')) throw new Error('--kit-root requires a value');
      flags.kitRoot = value;
    } else if (arg === '--lang' || arg.startsWith('--lang=')) {
      const value = arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : argv[++i];
      flags.lang = parseLang(value);
    } else if (arg === '--agents' || arg.startsWith('--agents=')) {
      const value = arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : argv[++i];
      flags.agents = parseAgentList(value);
    } else if (arg === '--skills' || arg.startsWith('--skills=')) {
      const value = arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : argv[++i];
      flags.skills = parseLevelList(value);
    } else throw new Error(`Unknown option: ${arg}`);
  }

  if (flags.force && flags.keepLocal) throw new Error('Choose --force or --keep-local, not both.');
  return flags;
}

function parseLang(value: string | undefined): Lang {
  if (!value) throw new Error('--lang requires a value');
  if (!KNOWN_LANGS.has(value as Lang)) {
    throw new Error(`Unknown lang: "${value}". Valid: ${[...KNOWN_LANGS].join(', ')}`);
  }
  return value as Lang;
}

function parseAgentList(value: string | undefined): AgentId[] {
  if (!value) throw new Error('--agents requires a value');
  const list = value.split(',').map((s) => s.trim());
  for (const a of list) {
    if (!KNOWN_AGENTS.has(a as AgentId)) {
      throw new Error(`Unknown agent: "${a}". Valid: ${[...KNOWN_AGENTS].join(', ')}`);
    }
  }
  return [...new Set(list)] as AgentId[];
}

function parseLevelList(value: string | undefined): SkillLevel[] {
  if (!value) throw new Error('--skills requires a value');
  const list = value.split(',').map((s) => s.trim());
  for (const l of list) {
    if (!KNOWN_LEVELS.has(l as SkillLevel)) {
      throw new Error(`Unknown skill level: "${l}". Valid: ${[...KNOWN_LEVELS].join(', ')}`);
    }
  }
  return [...new Set(list)] as SkillLevel[];
}
