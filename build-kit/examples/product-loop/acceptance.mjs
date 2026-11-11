import assert from 'node:assert/strict';

const sample = () => [
  { id: 'done-first', completed: true },
  { id: 'open-first', completed: false },
  { id: 'open-second', completed: false },
  { id: 'done-last', completed: true },
];

const checks = [
  [
    'A1',
    (view) => {
      const tasks = sample();
      for (const result of [view(tasks), view(tasks, 'all')]) {
        assert.deepEqual(result.items, tasks);
        assert.notEqual(result.items, tasks);
        assert.equal(result.emptyReason, null);
      }
    },
  ],
  [
    'A2',
    (view) => {
      const tasks = sample();
      const result = view(tasks, 'open');
      assert.deepEqual(
        result.items.map((task) => task.id),
        ['open-first', 'open-second'],
      );
      assert.equal(result.items[0], tasks[1]);
      assert.equal(result.items[1], tasks[2]);
      assert.equal(result.emptyReason, null);
    },
  ],
  [
    'A3',
    (view) => {
      for (const mode of ['all', 'open']) {
        assert.deepEqual(view([], mode), { items: [], emptyReason: 'no-tasks' });
      }
    },
  ],
  [
    'A4',
    (view) => {
      const tasks = [{ id: 'done', completed: true }];
      assert.deepEqual(view(tasks, 'open'), { items: [], emptyReason: 'no-open-tasks' });
      assert.equal(view(tasks, 'all').items[0], tasks[0]);
    },
  ],
  [
    'A5',
    (view) => {
      const tasks = sample();
      const original = structuredClone(tasks);
      for (const task of tasks) Object.freeze(task);
      Object.freeze(tasks);
      view(tasks, 'open');
      assert.deepEqual(tasks, original);
      const restored = view(tasks, 'all');
      assert.deepEqual(restored.items, tasks);
      restored.items.forEach((task, index) => assert.equal(task, tasks[index]));
    },
  ],
  [
    'A6',
    (view) => {
      const tasks = sample();
      const before = structuredClone(tasks);
      assert.throws(() => view(tasks, 'recent'), RangeError);
      assert.deepEqual(tasks, before);
    },
  ],
];

/** Selected behaviour checks, deliberately separate from product-effectiveness evaluation. */
export function assess(view) {
  return checks.map(([criterion, run]) => {
    try {
      run(view);
      return { criterion, passed: true };
    } catch (error) {
      return { criterion, passed: false, message: error.message };
    }
  });
}
