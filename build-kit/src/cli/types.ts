export type Lang = 'fr' | 'en';

export type SkillLevel = 'core' | 'support' | 'extras';

export type Skill = {
  name: string;
  level: SkillLevel;
  description: string;
  path: string;
};

export type AgentId =
  | 'claude-code'
  | 'codex'
  | 'cursor'
  | 'gemini'
  | 'windsurf'
  | 'aider'
  | 'cline';

export type AgentSpec = {
  id: AgentId;
  label: string;
  /** Template filename WITHOUT lang suffix. Resolved at install time. */
  templateBase: string;
  /** Output path relative to the target project root. */
  output: string;
};

export type InstalledVersion = {
  version: string;
  installed_at: string;
  lang: Lang;
  agents: AgentId[];
  skills: {
    core: number;
    support: number;
    extras: number;
  };
};

export type InitOptions = {
  cwd: string;
  kitRoot: string;
  lang: Lang;
  agents: AgentId[];
  levels: SkillLevel[];
  dryRun: boolean;
  force: boolean;
  yes: boolean;
};

export const AGENT_SPECS: Record<AgentId, AgentSpec> = {
  'claude-code': {
    id: 'claude-code',
    label: 'Claude Code',
    templateBase: 'CLAUDE.md',
    output: 'CLAUDE.md',
  },
  codex: { id: 'codex', label: 'Codex', templateBase: 'AGENTS.md', output: 'AGENTS.md' },
  cursor: {
    id: 'cursor',
    label: 'Cursor',
    templateBase: 'cursor.mdc',
    output: '.cursor/rules/composed-build-kit.mdc',
  },
  gemini: { id: 'gemini', label: 'Gemini CLI', templateBase: 'GEMINI.md', output: 'GEMINI.md' },
  windsurf: {
    id: 'windsurf',
    label: 'Windsurf',
    templateBase: 'windsurfrules',
    output: '.windsurfrules',
  },
  aider: { id: 'aider', label: 'Aider', templateBase: 'CONVENTIONS.md', output: 'CONVENTIONS.md' },
  cline: {
    id: 'cline',
    label: 'Cline',
    templateBase: 'cline.md',
    output: '.clinerules/composed-build-kit.md',
  },
};

export const KIT_VERSION = '0.7.0';
