# Record checks and inspect existing evidence

A receipt keeps a native command's result tied to selected file bytes and existing rule/case IDs.
Use `evidence run` to execute a check and create a receipt; use `verify` to inspect an earlier receipt
without rerunning it. Ordinary small corrections can report focused checks inline. Start with
[validation by task](validation.md) if you are unsure which kind of proof your work needs.

## Read the result

The human CLI output separates the action, recorded check, current file applicability and supplied
review. It links the receipt and gives a next action. `--json` retains the structured report for tools.

| Result | Meaning | Next action |
| --- | --- | --- |
| Current passing record | The recorded command passed and selected files match; any supplied review has no detected mismatch. | Use this scoped result and finish any acceptance/review required by the project. |
| `failed` | The command completed unsuccessfully. | Read `execution.stdout` / `execution.stderr` in the receipt, diagnose and record a new run. |
| `blocked` | Execution could not establish a completed result, for example a missing executable, timeout or changed subjects. | Resolve the reported cause before a new run. |
| `not_run` | The record declares an unexecuted check. | Execute the intended authorised check and create a new receipt. |
| `stale` | Selected files changed or became unavailable; the historical result is preserved. | Inspect the changes and obtain a new result for the current files. |
| `invalid` | The receipt cannot be trusted as a valid record. | Resolve the path, format or integrity finding before using it. |
| Review finding | A supplied review is stale, malformed, not accepted or a self-review. | Locate valid review evidence, resolve the verdict with its reviewer or obtain a current independent review as needed. Editing IDs does not create one. |

A receipt can have more than one finding, for example a historical failure and changed files.
No supplied review means review requirements are **not assessed**, not waived. `verify` executes no
receipt command, even when it recommends obtaining new evidence. Both commands exit 1 when the
evidence report is unhealthy; inspect its findings to distinguish failure, blockage and stale proof.

## Record an actual check

From the consuming project, provide the source, checker and relevant configuration/dependency files
whose changes should invalidate the evidence. All subject and receipt paths use project-relative
forward slashes. Replace the kit path with your checkout:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs evidence run \
  --subject src/cancellation.mjs --subject tests/cancellation.mjs \
  --requirement REQ-CANCEL-001 --acceptance ACC-CANCEL-001 \
  --output .agents/work/cancellation/evidence/run-001.json \
  -- node tests/cancellation.mjs
```

Only the executable and individual arguments after `--` run, with `shell: false` and the chosen
project as cwd. Shell operators are not interpreted. `--cwd <directory>` selects the project;
`--json` prints one structured report without human-oriented prompts. Choose a new receipt filename
for every execution: an existing output is refused before running the command.

The recorder checks subject bytes before and after execution. A difference between those endpoint
snapshots blocks the result. Temporary changes restored before the final snapshot are not detected;
this recorder does not monitor every write or establish which intermediate bytes a command read.
Commands have a 30-second default deadline, configurable with `--timeout-ms` from 1 to
300000, and a combined 128 KiB stdout/stderr limit. Timeout, spawn failure or excess output is
`blocked`; a nonzero completed exit is `failed`. `not_run` is reserved for unexecuted declarations.
Neither failed, blocked nor not_run satisfies a successful check.

The command inherits the caller's permissions. It is not sandboxed and may have side effects; run
only the native checks authorised for that project. Termination controls only the direct child, not
arbitrary descendants. Do not supply secrets in arguments or output intended for sharing. Receipts
remain local; the kit does not export them.

## Verify without executing

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs verify \
  --evidence .agents/work/cancellation/evidence/run-001.json --json
```

Verification reads JSON and current file bytes. It never executes commands, imports checker code,
fetches references or performs mutations described by a receipt. Paths containing traversal,
absolute POSIX/Windows/UNC references or symbolic links at any component are refused. JSON reads are
bounded to 1 MiB. A run accepts at most 256 subjects, each at most 16 MiB; select the relevant
source/checker/configuration files rather than generated binaries or a whole dependency directory.

The report separates `recorded_status` from `applicability`: a historically passing execution can
now be `stale` because a selected subject or checker changed. The old receipt is preserved. The
subject-set digest identifies the exact listed working-tree bytes, including dirty/untracked files.
Git HEAD and the selected subjects' dirty state provide context when Git is available; they do not
replace the byte identity. Dependencies omitted from the selected subjects are outside the claim.

New receipts record elapsed duration from Node's monotonic clock (`duration_source: monotonic`).
Start/finish timestamps preserve the observed wall clock; if the finish precedes the start after
a clock adjustment, `wall_clock_regressed: true` makes that explicit without rewriting either time.
Verification checks this metadata for consistency. Older receipts without clock metadata retain
their existing validation rules and are not rewritten.

`healthy` means the supplied local record is consistent, its selected files are current, its check
passed, and any supplied review declaration has no detected mismatch. It is not a general product
readiness, safety, identity or authorisation certificate. The report always says `closure: not_assessed`.
An unsigned local receipt can be forged by someone able to rewrite it; hashes provide integrity
comparisons, not authenticated provenance.

## Review declarations

`verify --review <project-relative review.json>` additionally checks an explicit declaration against
the receipt's actual SHA-256 and subject digest. The declaration has this shape:

```json
{
  "format_version": 1,
  "kind": "local-review-declaration",
  "receipt_sha256": "<SHA-256 of the exact receipt file>",
  "subject_digest": "<subject_digest from that receipt>",
  "author": "author-runtime-id",
  "reviewer": "reviewer-runtime-id",
  "author_context": "author-session-id",
  "reviewer_context": "reviewer-session-id",
  "mode": "native-subagent",
  "verdict": "accepted"
}
```

A changed receipt/subject makes its review stale. A self-review mode, identical author/reviewer or
identical context is identified as self-review. A return-needed/blocked verdict is not accepted.
Distinct IDs remain declarations: the CLI cannot authenticate that another person or independent
runtime actually authored the review. Required independent review still needs the real delegation,
context and evidence specified by the project. An agent-written JSON file never creates human approval.

## Reproduce the acceptance example

From `build-kit`, run `node evals/evidence-example.mjs` (or pass `--output <new-directory>`). The
script uses the existing tsx dependency and creates an isolated local project with actual candidate
code and acceptance assertions. It writes receipts and a summary for:

- accepting the correct 24-hour cancellation boundary;
- rejecting a plausible `> 24` boundary bug despite that module loading with exit zero;
- making an earlier successful receipt stale after a subject change;
- preserving the historical execution result;
- rejecting an explicit not_run declaration and identifying self-review.

This tests the grader with a correct reference and a semantic counterexample. It is executable
behaviour evidence rather than the phrase-matching fixture suite, but it is not a comparative agent
benchmark. Its illustrative requirement/case IDs do not modify a normative Composed Contract.

This capability addresses selected evidence needs in the draft harness contract
(REQ-ADH-016–020 and ACC-ADH-010–013). It does not establish full contract conformance or implement
the optional supervisor.
