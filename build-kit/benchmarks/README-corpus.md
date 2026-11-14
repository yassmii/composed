# Synthetic software corpus and semantic controls

This corpus supplies six bounded tasks in an already selected Node.js >=20 ESM stack.
It needs only built-in Node modules. The corpus and graders do not call models or access live services.

| Task | Cohort | Delivered API | Defects exercised |
| --- | --- | --- | --- |
| `cart-totals` | development | `calculateCart(items, options)` | Discount rounding, post-discount/inclusive shipping threshold, safe integers, validation and input preservation |
| `retry-operation` | confirmation | `withRetry(operation, options)` | Error selection/identity, attempt limits/numbers and abort handling |
| `csv-record` | confirmation | `parseCsvRecord(record)` | Quoted commas, escaped quotes, empty fields, malformed records and state isolation |
| `reservation-expiry` | contract-confirmation | `confirm(booking, now)` | Exact-expiry boundary, terminal states, metadata and input preservation |
| `revision-approval` | contract-confirmation | `approve(document, expectedRevision, role)` | Stale revision, role priority, idempotent approval and input preservation |
| `hold-decision` | contract-confirmation | `decide(hold, command, now)` | Six ordered rules: role, closed state, exact expiry, stale revision, capture and extension ranges, with revision increments and input preservation |

The `contract-confirmation` tasks also receive `CONTRACT.md`, a synthetic common contract slice
(`REQ/INV/ACC-CMP-001` to `-003`). Their prompts name clauses instead of restating the rules, so
both conditions must read the same contract to succeed. The slice is an experimental fixture: it is
not a Composed product contract and changes none. `reservation-expiry` and `revision-approval` are
one-line defects with one public regression test and two acceptance groups, so a ceiling effect on
correctness is likely there and duration and usage are the more informative measures.
`hold-decision` is deliberately harder: its seed has five defects against six ordered rules, and
its nine acceptance groups include the priority between successive rules. The first pilot's `confirmation` tasks have
been exposed to analysis and now serve as regressions, not as a fresh holdout.

`corpus.mjs` exports `tasks`. Every task has `id`, `title`, `cohort`, `prompt`, `files` and
`sources`. Only `files` are copied into an agent workspace. They contain a README with the full task,
the native `npm test` command, one source module and two public regression tests. Prompt and initial
application files must be identical across a matched pair. The project's kit installation is a
separate treatment owned by the runner. No complex-task delegation exception is embedded here.

The development task is for harness shakedown. Do not pool its measured results with confirmation.
Freeze input/grader hashes before measured confirmation trials and retain adverse results. A synthetic
corpus of two confirmation tasks does not establish broad real-project effectiveness.

## Calibrate before measuring

```bash
node benchmarks/calibrate.mjs --output /absolute/path/to/new-calibration.json
```

The command creates disposable code projects, invokes the real grader in fresh Node processes,
and verifies eighteen controls: each untouched seed fails, each known-correct reference passes and each
plausible mutant fails. All controls must retain the task's protected public regression behaviours.
Cart's mutant uses the pre-discount threshold, retry's mutant retries non-retryable errors, and CSV's
mutant preserves doubled quotes instead of decoding them. The reservation mutant re-evaluates
terminal states and the approval mutant lets a non-reviewer reach the stale-revision answer. The
hold mutant implements every rule but checks the revision before the expiry.
Existing output is never overwritten.
The calibration returns exit 1 if any control is unexpected. It is not a model benchmark result.

## Grade a delivered source

```bash
node benchmarks/grade.mjs --task retry-operation --candidate /absolute/path/to/project
```

The grader copies only the task's listed source into a fresh temporary directory, records its SHA-256,
imports that copy and exercises the task's behavioural groups: two `regression` and eight
`acceptance` for the first three tasks, one `regression` and two `acceptance` for
`reservation-expiry` and `revision-approval`, two `regression` and nine `acceptance` for
`hold-decision`.
The protected regression groups reproduce the supplied seed tests without executing agent-edited test
files or package scripts. Code generation and successful process completion do not substitute for the
assertions. IDs/kinds are available to the caller from `checkDefinitions[taskId]` in `graders.mjs`.

One JSON result is emitted with `format_version: 1`, `task_id`, `cohort`, `sources`, `source_digest`,
`source_status`, `checks` and `passed`. `checks` entries contain `id`, `kind`, `passed` and a bounded
failure `message` when applicable. A missing source, parse error or incompatible API fails candidate
checks. Grader exit 0 means the grader executed, including when the candidate fails. Invalid CLI/task
selection is an infrastructure error with exit 1. The caller must validate the full expected check
set and result envelope; it must not interpret exit 0 alone as accepted software.

Regular source files are limited to 256 KiB and symbolic-link source paths are refused. Asynchronous
checks have a 500 ms guard; the caller must additionally bound the entire grading child (calibration
uses eight seconds) because synchronous candidate code can block the event loop. A process timeout
is not evidence of a passing candidate. Temporary grading directories are cleaned on normal exit.

The grader runs candidate code with the caller's permissions. A fresh process and withheld grader
files are not an OS sandbox, authenticated provenance, or proof against malicious candidate code.
The corpus measures the listed behaviours; test assertions are not independent statistical samples.
No reviewer identity, human approval or product closure is inferred from a result.
