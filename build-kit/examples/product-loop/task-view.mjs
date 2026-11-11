/** Authored reference view model for the synthetic example; not a shipped interface. */
export function taskView(tasks, mode = 'all') {
  if (mode !== 'all' && mode !== 'open') throw new RangeError('Unsupported task view mode');
  const items = mode === 'all' ? [...tasks] : tasks.filter((task) => task.completed === false);
  const emptyReason = tasks.length === 0 ? 'no-tasks' : items.length === 0 ? 'no-open-tasks' : null;
  return { items, emptyReason };
}
