export function codexCommand({ executable = 'codex', workspace, model, effort }) {
  return {
    executable,
    args: [
      '-a',
      'never',
      '--no-daemon',
      '--disable',
      'memories',
      'exec',
      '--ignore-user-config',
      '--ephemeral',
      '--json',
      '--color',
      'never',
      '--sandbox',
      'workspace-write',
      '--model',
      model,
      '-c',
      `model_reasoning_effort="${effort}"`,
      '--cd',
      workspace,
      '-',
    ],
  };
}

export function observeCodex(result) {
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
  const completed = events.filter((event) => event.type === 'turn.completed');
  const usageEvents = completed
    .map((event) => event.usage)
    .filter((usage) => usage && typeof usage === 'object' && !Array.isArray(usage));
  const usage = {};
  for (const key of [
    'input_tokens',
    'cached_input_tokens',
    'output_tokens',
    'reasoning_output_tokens',
  ]) {
    usage[key] =
      completed.length &&
      usageEvents.length === completed.length &&
      usageEvents.every((entry) => Number.isInteger(entry[key]) && entry[key] >= 0)
        ? usageEvents.reduce((sum, entry) => sum + entry[key], 0)
        : null;
  }
  return {
    completed:
      result.status === 'completed' &&
      result.exit_code === 0 &&
      completed.length > 0 &&
      !events.some((event) => event.type === 'turn.failed') &&
      invalidLines === 0,
    thread_id: events.find((event) => event.type === 'thread.started')?.thread_id ?? null,
    invalid_json_lines: invalidLines,
    final_message:
      events
        .filter((event) => event.item?.type === 'agent_message')
        .map((event) => event.item.text)
        .at(-1) ?? null,
    root_usage: Object.values(usage).some((value) => value !== null) ? usage : null,
    root_usage_coverage: {
      completed_turns: completed.length,
      turns_with_usage: usageEvents.length,
      complete_root_usage:
        completed.length > 0 &&
        ['input_tokens', 'cached_input_tokens', 'output_tokens'].every(
          (key) => usage[key] !== null,
        ),
    },
    usage_coverage: 'root turn events only; delegated usage completeness is not established',
    native_commands: events
      .filter(
        (event) => event.type === 'item.completed' && event.item?.type === 'command_execution',
      )
      .map(({ item }) => ({ command: item.command, exit_code: item.exit_code ?? null })),
    cost_usd: null,
    cost_source: 'not_reported',
    resolved_backend_model: null,
  };
}
