// Gemini CLI headless adapter. Unlike the Codex and Claude Code adapters, no real session has
// been observed: flags come from the CLI configuration reference and event shapes from the
// stream-json types in the gemini-cli source (init, message, tool_use, tool_result, error,
// result). Run an unscored readiness session before trusting a measured run.

export function geminiCommand({ executable = 'gemini', model, prompt }) {
  return {
    executable,
    args: [
      '--output-format',
      'stream-json',
      '--model',
      model,
      '--approval-mode',
      'yolo',
      // Auto-approval is only acceptable inside the CLI's own sandbox, which needs a container
      // runtime (or macOS Seatbelt) on the host.
      '--sandbox',
      '--extensions',
      'none',
      '--prompt',
      prompt,
    ],
  };
}

export function observeGemini(result) {
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
  const stats =
    final?.stats && typeof final.stats === 'object' && !Array.isArray(final.stats)
      ? final.stats
      : null;
  const count = (key) =>
    stats && Number.isInteger(stats[key]) && stats[key] >= 0 ? stats[key] : null;
  const usage = {
    input_tokens: count('input_tokens'),
    cached_input_tokens: count('cached'),
    output_tokens: count('output_tokens'),
    reasoning_output_tokens: null,
  };
  // Assistant text arrives as whole messages or as delta chunks; keep the text after the last
  // tool event, which is the closing answer.
  let closing = '';
  for (const event of events) {
    if (event.type === 'tool_use' || event.type === 'tool_result') closing = '';
    else if (
      event.type === 'message' &&
      event.role === 'assistant' &&
      typeof event.content === 'string'
    )
      closing = event.delta ? closing + event.content : event.content;
  }
  const outcomes = new Map(
    events
      .filter((event) => event.type === 'tool_result' && typeof event.tool_id === 'string')
      .map((event) => [event.tool_id, event.status]),
  );
  const models = stats?.models && typeof stats.models === 'object' ? Object.keys(stats.models) : [];
  const init = events.find((event) => event.type === 'init');
  return {
    completed:
      result.status === 'completed' &&
      result.exit_code === 0 &&
      results.length === 1 &&
      final.status === 'success' &&
      !events.some((event) => event.type === 'error' && event.severity === 'error') &&
      invalidLines === 0,
    thread_id: typeof init?.session_id === 'string' ? init.session_id : null,
    invalid_json_lines: invalidLines,
    final_message: closing || null,
    root_usage: Object.values(usage).some((value) => value !== null) ? usage : null,
    root_usage_coverage: {
      completed_turns: results.length,
      turns_with_usage: stats ? 1 : 0,
      complete_root_usage:
        results.length === 1 &&
        ['input_tokens', 'cached_input_tokens', 'output_tokens'].every(
          (key) => usage[key] !== null,
        ),
    },
    usage_coverage:
      'final result event only; cached_input_tokens is the cached part of input_tokens',
    native_commands: events
      .filter((event) => event.type === 'tool_use' && event.tool_name === 'run_shell_command')
      .map((event) => ({
        command: event.parameters?.command ?? null,
        exit_code: null,
        status: outcomes.get(event.tool_id) ?? null,
      })),
    cost_usd: null,
    cost_source: 'not_reported',
    resolved_backend_model:
      models.length === 1 ? models[0] : typeof init?.model === 'string' ? init.model : null,
    models_used: models,
  };
}
