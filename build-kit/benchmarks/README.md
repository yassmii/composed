# Paired real-agent delivery pilot

This runner compares the same Codex runtime/requested model/effort with and without the **project**
Build Kit. It measures selected delivered behaviour, regressions, observed wall time and available
root usage. It does not rank providers, prove full methodology compliance or show that the kit performs better than a baseline.
The existing phrase fixture suite remains separate.

## Scope and controls

The frozen corpus contains one development task (`cart-totals`) and two confirmation tasks
(`retry-operation`, `csv-record`). Each is a bounded correction in an existing dependency-free Node
project, with one self-contained source module. Two repetitions give four sessions per task: baseline
then kit, followed by kit then baseline. Reports never pool development into confirmation.

Every session starts from the same application bytes in a new Git repository **outside** the Composed
tree, avoiding inherited repository instructions. The kit condition runs the actual source CLI to
install EN core/support skills and the Codex bridge. The baseline receives no project kit. Prompts,
native test command, requested model, effort, sandbox and approval policy match. Sessions are fresh
and ephemeral; user config is ignored, global memory is disabled, and the supplied runtime home must
have no global AGENTS.md. These are documented controls, not authenticated isolation from all host
configuration or adversarial filesystem reads.

Calibration runs before any measured session: for each task the actual grader must reject the seed
and a semantic mutant, and accept a known-correct reference. The grader copies only declared regular
source files into a separate temporary directory and calls their APIs. Its checks preserve original
public regressions independently of agent edits to tests/package scripts. Files are withheld from
supplied workspaces; they are not claimed inaccessible to an adversarial agent. Grading executes
candidate code with caller permissions and a bounded child process, not an OS security sandbox.

## Run locally

Use an isolated logged-in Codex runtime home outside the repository and the OS temporary directory;
Codex refuses helper aliases under some temporary locations. Keep its credentials private. Authenticate
there with the CLI's normal login flow; do not commit auth.json or include it in a run report.
The runner uses `--ignore-user-config`, so select the same explicit model/effort for all conditions.
See [official OpenAI non-interactive documentation](https://learn.chatgpt.com/docs/non-interactive-mode)
and the locally installed `codex exec --help`; installed-version capabilities take precedence.

Measured sessions currently require a POSIX runtime (Linux/macOS) for ordinary process-group cleanup.
Calibration, reporting and deterministic tests remain portable to Windows. Cleanup signals the original
process group on normal completion as well as timeout; processes that deliberately escape that group
are outside coverage. It is not a general process/OS sandbox.

From `build-kit/` with Node and Codex native to the same POSIX OS:

```bash
npm run benchmark:calibrate
node benchmarks/run.mjs --model YOUR_SELECTED_MODEL --effort high \
  --codex-home /private/path/to/runtime-home \
  --output benchmarks/runs/pilot-001
```

The default is two repetitions, 120 seconds per agent session, 20 minutes for the trial phase and
1 MiB combined agent output. Calibration/setup time is recorded separately where available. The
total phase deadline includes trial setup; no additional agent starts after it expires. At most
12 measured **sessions** run, each potentially making multiple requests or delegations. These
operational limits are not an exact dollar cap. Sessions are sequential; no calls run in GitHub CI.
`--task ID` selects a subset without changing its cohort; `--timeout-ms` and `--total-ms` can lower
bounds. Existing output directories are refused. Attempts/workspaces are preserved for inspection.

The native CLI dependencies must be installed for the same OS as Node (`npm ci`); do not reuse Windows
node_modules from native Linux. `--kit-root` selects the reviewed kit checkout and `--executable`
selects the Codex binary. The treatment and harness source hashes are frozen in protocol.json before
calibration/trials; a later relevant change blocks the next affected attempt.

## Interpret results

protocol.json records hashes, task split, schedule, runtime, requested model and limits. Each trial
retains its event stream, stderr, grader output, initial file hashes, delivered diff/source hashes
and outcome. `passed` requires both completed execution and all protected acceptance/regression
groups passing. `failed` is completed execution with failing behaviour; unavailable/incomplete
execution or invalid grading is `blocked`. Deadline-skipped sessions are `not_run`. A passing process
or success-looking final message does not substitute for code assertions.

summary.json and report.md separate cohorts, conditions, check coverage, outcomes and comparable pairs.
The summary records dispatched/observed-duration counts. Root token totals are available only when
every dispatched attempt has complete root usage; otherwise they stay null, not a partial sum.
Root usage coverage records completed turns and turns carrying usage; aggregate token totals stay
unknown when a completed turn omits its metrics. Raw root usage is not a complete delegated usage estimate or a currency
invoice. Missing costs and resolved backend model versions stay unknown. Zero observed follow-up
human interventions during the automated sessions excludes setup labour and experiment design.
Confirmation assertions are correlated groups, not independent statistical samples.

The full planned schedule is persisted before calibration. Immediately before dispatch, an atomic
attempt marker records that a call may have started; bounded event chunks are written during the run.
An interrupted attempt stays blocked/unconfirmed rather than being relabelled not_run. Per-trial
records recover a newer dispatch marker if the aggregate snapshot was interrupted. Corrupt JSON is
reported instead of silently discarded.

Rebuild the derived report from a retained run, including scheduled-but-missing rows after interruption:

```bash
node benchmarks/report.mjs benchmarks/runs/pilot-001
```

Default run output is Git/npm ignored and stays local. Inspect traces before sharing; generic runs
may contain private prompts/tool output. Commit only an authorised bounded synthetic summary/evidence
selection. Preserve unfavourable results. Fix a harness defect in a new protocol/run rather than
silently rewriting a measured result; skills are never tuned automatically from confirmation output.

CI executes only deterministic calibration and runner tests. Cross-provider campaigns, complex
multi-agent governance, product/UX judgement and long-term handoffs need a separately scoped corpus.
