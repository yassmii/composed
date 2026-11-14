import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { claudeAllowedTools, claudeCommand, claudeTools, observeClaude } from './claude.mjs';
import { codexCommand, observeCodex } from './codex.mjs';
import { geminiCommand, observeGemini } from './gemini.mjs';

// One entry per agent runtime the paired runner can drive. Every adapter gives the runner the
// same things: a literal command, the environment that points the CLI at an isolated runtime
// home, a check of that home, the kit bridge to install in the kit condition, and an observer
// that turns the CLI's event stream into the shared observation record.
//
// `evidence` states what the adapter rests on. Only an observed adapter has had its stream
// format checked against a real session.
export const adapters = {
  codex: {
    id: 'codex',
    executable: 'codex',
    kitAgent: 'codex',
    efforts: ['low', 'medium', 'high', 'xhigh'],
    prompt: 'stdin',
    evidence: 'observed: measured sessions in pilot 001 (Codex CLI 0.164.0-alpha.11.1)',
    command: codexCommand,
    observe: observeCodex,
    environment: (home) => ({ CODEX_HOME: home }),
    checkHome: (home) =>
      !existsSync(join(home, 'auth.json'))
        ? 'runtime home has no auth.json'
        : existsSync(join(home, 'AGENTS.md'))
          ? 'runtime home has a global AGENTS.md'
          : null,
    describe: () => ({
      adapter: 'codex-exec',
      user_config: 'ignored',
      memories: 'disabled',
      sandbox: 'workspace-write',
      approvals: 'never',
      sessions: 'fresh ephemeral',
    }),
  },
  'claude-code': {
    id: 'claude-code',
    executable: 'claude',
    kitAgent: 'claude-code',
    efforts: ['low', 'medium', 'high', 'xhigh', 'max'],
    prompt: 'stdin',
    evidence:
      'observed: two unscored tool-using sessions on Claude Code 2.1.183 under Windows (file write, allowed test run, denied commands); no measured or POSIX session yet',
    command: claudeCommand,
    observe: observeClaude,
    environment: (home) => ({ CLAUDE_CONFIG_DIR: home }),
    checkHome: (home, environment) =>
      existsSync(join(home, 'CLAUDE.md'))
        ? 'runtime home has a global CLAUDE.md'
        : !existsSync(join(home, '.credentials.json')) && !environment.ANTHROPIC_API_KEY
          ? 'runtime home has no .credentials.json and ANTHROPIC_API_KEY is not set'
          : null,
    describe: () => ({
      adapter: 'claude-print',
      user_config: 'project setting sources only; isolated config directory',
      memories: 'isolated config directory; not explicitly disabled',
      sandbox: 'none; restricted tool set and allowlist instead',
      approvals:
        'dontAsk: writes and commands outside the allowlist are denied; read-only shell commands still run',
      tools: claudeTools,
      allowed_tools: claudeAllowedTools,
      delegation: 'not available: the subagent tool is not offered',
      sessions: 'fresh, not persisted',
    }),
  },
  gemini: {
    id: 'gemini',
    executable: 'gemini',
    kitAgent: 'gemini',
    efforts: null,
    prompt: 'argument',
    evidence:
      'documented only: flags from the configuration reference, events from the stream-json source types; no session observed',
    command: geminiCommand,
    observe: observeGemini,
    environment: (home) => ({ GEMINI_CLI_HOME: home }),
    checkHome: (home) =>
      existsSync(join(home, '.gemini', 'GEMINI.md')) ? 'runtime home has a global GEMINI.md' : null,
    describe: () => ({
      adapter: 'gemini-prompt',
      user_config: 'isolated home; extensions disabled',
      memories: 'isolated home; not explicitly disabled',
      sandbox: 'CLI sandbox (container runtime or Seatbelt required)',
      approvals: 'yolo inside the sandbox',
      authentication: 'not checked by the runner',
      sessions: 'fresh',
    }),
  },
};
