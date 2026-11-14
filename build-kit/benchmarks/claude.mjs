// Claude Code headless adapter. Event shapes were observed from Claude Code 2.1.183 with
// `-p --output-format stream-json --verbose`; a later CLI may change them, and an unrecognised
// stream is reported as not completed rather than guessed.

// The built-in tools a session is given. Web access, subagents, scheduling and the rest are not
// offered at all, so delegation is not exercised by this adapter.
export const claudeTools = [
  'Bash',
  'PowerShell',
  'Read',
  'Write',
  'Edit',
  'Glob',
  'Grep',
  'TodoWrite',
];

// What a session may do without asking. Any other command is denied by the dontAsk mode and
// counted in permission_denials, identically in both conditions. Claude Code still runs shell
// commands it classifies as read-only (observed with `whoami`), so this is an allowlist for
// writes and test runs, not a sandbox. The shell tool is Bash on POSIX and PowerShell on Windows.
const shellCommands = ['npm test', 'npm run test', 'node --test', 'git status', 'git diff'];
export const claudeAllowedTools = [
  'Read',
  'Glob',
  'Grep',
  'Edit',
  'Write',
  'TodoWrite',
  ...['Bash', 'PowerShell'].flatMap((shell) =>
    shellCommands.flatMap((command) => [`${shell}(${command})`, `${shell}(${command} *)`]),
  ),
];

export function claudeCommand({ executable = 'claude', model, effort }) {
  return {
    executable,
    args: [
      '-p',
      '--output-format',
      'stream-json',
      '--verbose',
      '--model',
      model,
      '--effort',
      effort,
      '--tools',
      claudeTools.join(','),
      '--permission-mode',
      'dontAsk',
      '--allowedTools',
      ...claudeAllowedTools,
      '--setting-sources',
      'project',
      '--strict-mcp-config',
      '--no-session-persistence',
    ],
  };
}

export function observeClaude(result) {
  const events = [];
  let invalidLines = 0;
  for (const line of result.stdout.split('\n').filter((value) => value.trim())) {
    try {
      const event = JSON.parse(line);
      if (
        !event ||
        typeof event !== 'object' ||
        Array.isArray(event) ||
        typeof event.type !== 'string'
      )
        invalidLines++;
      else events.push(event);
    } catch {
      invalidLines++;
    }
  }
  const results = events.filter((event) => event.type === 'result');
  const final = results.at(-1) ?? null;
  const reported =
    final?.usage && typeof final.usage === 'object' && !Array.isArray(final.usage)
      ? final.usage
      : null;
  const count = (key) =>
    reported && Number.isInteger(reported[key]) && reported[key] >= 0 ? reported[key] : null;
  const usage = {
    input_tokens: count('input_tokens'),
    cached_input_tokens: count('cache_read_input_tokens'),
    output_tokens: count('output_tokens'),
    reasoning_output_tokens: null,
  };
  const blocks = events
    .filter((event) => event.type === 'assistant' && Array.isArray(event.message?.content))
    .flatMap((event) => event.message.content);
  const models =
    final?.modelUsage && typeof final.modelUsage === 'object' ? Object.keys(final.modelUsage) : [];
  const cost = final?.total_cost_usd;
  return {
    completed:
      result.status === 'completed' &&
      result.exit_code === 0 &&
      results.length === 1 &&
      final.subtype === 'success' &&
      final.is_error === false &&
      invalidLines === 0,
    thread_id: events.find((event) => typeof event.session_id === 'string')?.session_id ?? null,
    invalid_json_lines: invalidLines,
    final_message: typeof final?.result === 'string' ? final.result : null,
    root_usage: Object.values(usage).some((value) => value !== null) ? usage : null,
    root_usage_extra: reported
      ? { cache_creation_input_tokens: count('cache_creation_input_tokens') }
      : null,
    root_usage_coverage: {
      completed_turns: results.length,
      turns_with_usage: reported ? 1 : 0,
      complete_root_usage:
        results.length === 1 &&
        ['input_tokens', 'cached_input_tokens', 'output_tokens'].every(
          (key) => usage[key] !== null,
        ),
    },
    usage_coverage:
      'final result event only; input_tokens excludes cache reads and cache creation, which are reported separately',
    native_commands: blocks
      .filter((block) => block?.type === 'tool_use' && ['Bash', 'PowerShell'].includes(block.name))
      .map((block) => ({ command: block.input?.command ?? null, exit_code: null })),
    permission_denials: Array.isArray(final?.permission_denials)
      ? final.permission_denials.length
      : null,
    turns: Number.isInteger(final?.num_turns) ? final.num_turns : null,
    cost_usd: Number.isFinite(cost) && cost >= 0 ? cost : null,
    cost_source:
      Number.isFinite(cost) && cost >= 0
        ? 'reported by the CLI as an API-price estimate; not an invoice, and not what a subscription is charged'
        : 'not_reported',
    resolved_backend_model: models.length === 1 ? models[0] : null,
    models_used: models,
  };
}
