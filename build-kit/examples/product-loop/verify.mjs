import { assess } from './acceptance.mjs';
import { taskView } from './task-view.mjs';

// Plausible regression: both modes return all tasks, so basic all-view checks can still pass.
function wrongTaskView(tasks, mode = 'all') {
  if (mode !== 'all' && mode !== 'open') throw new RangeError('Unsupported task view mode');
  return { items: [...tasks], emptyReason: tasks.length === 0 ? 'no-tasks' : null };
}

const reference = assess(taskView);
const counterexample = assess(wrongTaskView);
const referenceAccepted = reference.every((check) => check.passed);
const counterexampleRejected = counterexample.some((check) => !check.passed);
console.log(
  JSON.stringify(
    {
      evaluation_kind: 'authored-synthetic-product-loop-example',
      reference: { passed: referenceAccepted, checks: reference },
      counterexample: { rejected: counterexampleRejected, checks: counterexample },
      product_effectiveness: 'not_assessed',
      limitations: [
        'Actual local execution of selected assertions against authored code; not a model trial.',
        'No implemented UI, real user study, deployment or independent review is established.',
        'learning.md is a fictional exercise card, not observations produced by this command.',
      ],
    },
    null,
    2,
  ),
);
if (!referenceAccepted || !counterexampleRejected) process.exitCode = 1;
