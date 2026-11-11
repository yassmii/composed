# Validate the work you have

From the project, ask your agent:

> Check the change we just made. Tell me what passed, what remains unverified and the next action.

For a resume:

> Check whether the existing evidence still applies before running anything again.

The agent reads the project's instructions, current change and linked decisions or handoff. It finds
the native check commands and any pinned contract/profile. You do not need to assemble hashes,
acceptance IDs or a validation JSON file first. An inaccessible source or an unclear target leads to
a targeted question. A small correction can keep its check result inline.

## Use the check that answers the question

| Question | Tool or evidence to use | What a successful result means |
| --- | --- | --- |
| Does this change behave as intended? | The project's relevant native tests/manual checks. Use [evidence run](evidence.md#record-an-actual-check) when a durable command receipt is useful or required. | Those checks passed on the selected implementation and environment. |
| Does an earlier command result still apply? | [verify](evidence.md#verify-without-executing) reads the receipt and compares its selected files. | The recorded check passed and its selected files still match. No test was rerun. |
| Do supplied observations satisfy selected contract obligations? | [Contract coverage evaluation](../../contracts/docs/verification.md#evaluate-without-executing), with the existing pinned plan and compatible evidence export. | The selected obligations have sufficient supplied records; the evaluator did not execute the product. |
| Does this product satisfy an external validation profile? | The pinned suite in [Composed Validation](https://github.com/yassmii/composed-validation), its runner, public-interface adapter and required reviews. | Only the actual candidate results and their declared scope can support that claim. |

These are alternatives for different questions, not four mandatory stages. A Build Kit command
receipt is not a contract-evidence export or an external suite report. Do not relabel one as another.
For a durable receipt, the agent selects the relevant source, checker and dependency/configuration
files and reuses established rule/case IDs. Missing criteria must be resolved, not invented for flags.

## Read the result and take the next action

Expect a short answer naming **scope, actual result, remaining gap and next owner/action**, with a
link to the command output or report. Examples:

> The task-filter module passed A1–A6. Its counterexample failed A2/A4 as expected. No interface
> was tested. To validate a screen next, the product owner needs to identify its host application.

> The old check passed, but its checker has changed. That receipt is historical. The next action
> is to inspect the change and record a new run of the intended check, keeping the old receipt.

> The wealth-advisory suite is a proof plan. No wealth runner or adapter is supplied, so no
> application was tested. The next engineering task is to prepare the runner and candidate adapter;
> the required professional and human evidence remains separate.

`failed` calls for diagnosing the reported failure; `blocked` calls for resolving the missing
capability, input or review; `not_run` calls for executing the required check. None is a pass.
If evidence is stale, preserve it and obtain current evidence. If it is malformed, inspect the
input/integrity problem before relying on it. A successful check does not itself close required
review, authorise deployment or establish user benefit.

## Try the evidence path without a product

From a Composed checkout with its Build Kit dependencies installed:

```bash
node build-kit/evals/evidence-example.mjs
```

This creates an isolated temporary example and prints its retained result directory. Seven controls
exercise a correct check, a plausible wrong implementation, stale evidence, an unexecuted declaration
and self-review. The overall demonstration succeeds because it detects the negative controls;
their individual results remain failed/stale. It does not validate your application.

See [receipt commands and result meanings](evidence.md), the
[scoped contract example](../../contracts/examples/scoped-verification/README.md), or the
[worked task-filter result](../examples/starting-paths/README.md#an-existing-project-with-agreed-decisions)
for the concrete next step relevant to your work.
