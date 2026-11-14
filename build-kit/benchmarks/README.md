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

A separate `contract-confirmation` cohort (`reservation-expiry`, `revision-approval`,
`hold-decision`) asks a narrower question: with the same contract slice in both workspaces, does adding the kit change delivery? Both
conditions receive `CONTRACT.md`; the baseline is that contract with the task and no kit. Run it on
its own with `--cohort contract-confirmation`: three tasks at two repetitions are 12 sessions.
`--repetitions 3` is accepted for a selection of at most two tasks; with an odd count, successive
tasks start with opposite conditions so the order stays balanced across the selection.
The six tasks together exceed the 12-session bound, so a run must name a cohort or tasks.

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

## Agent runtimes

`--agent` selects the CLI the runner drives; the default is `codex`. A comparison is only ever
between the two conditions of one run, with one agent, model and effort. Runs with different agents
are separate experiments and must not be pooled or ranked.

| `--agent` | CLI and mode | Kit bridge installed | Containment | What the adapter rests on |
| --- | --- | --- | --- | --- |
| `codex` | `codex exec --json` | `AGENTS.md` | CLI sandbox `workspace-write`, approvals never | Measured sessions in pilot 001 |
| `claude-code` | `claude -p --output-format stream-json` | `CLAUDE.md` | No sandbox. Eight built-in tools; `dontAsk` denies every write or command outside an allowlist (file edits, `npm test`, `node --test`, `git status`, `git diff`) | Two unscored tool-using sessions on Claude Code 2.1.183 under Windows; no measured or POSIX session yet |
| `gemini` | `gemini --output-format stream-json` | `GEMINI.md` | CLI sandbox (needs a container runtime or macOS Seatbelt) with auto-approval inside it | Documentation and source types only; no session observed |

`--runtime-home` (formerly `--codex-home`) names an isolated, logged-in configuration directory for
the selected CLI. It is passed as `CODEX_HOME`, `CLAUDE_CONFIG_DIR` or `GEMINI_CLI_HOME`, and must
not contain global instructions (`AGENTS.md`, `CLAUDE.md`, `.gemini/GEMINI.md`). For Claude Code it
must hold `.credentials.json`, unless `ANTHROPIC_API_KEY` is set; Gemini authentication is not
checked. `--effort` applies to Codex and Claude Code; Gemini CLI has no such option and rejects it.

Differences to keep in mind when reading a run:

- Claude Code is not given the subagent tool, web access or scheduling, so delegation is not
  exercised. It still runs shell commands it classifies as read-only. Denied calls are counted per
  trial in `permission_denials`; a kit instruction that needs a denied command shows up there.
- Claude Code prints a cost estimate at API prices, recorded per trial as `cost_usd` with its
  source. It is not an invoice and does not describe what a subscription is charged. Codex and
  Gemini report none.
- Token fields are not equivalent across CLIs. Claude Code reports cache reads and cache creation
  apart from `input_tokens`; Gemini's `cached` is a part of its `input_tokens`.
- The Gemini adapter has never run. Do an unscored readiness session and inspect `events.jsonl`
  before any measured run; an event stream it does not recognise is reported as not completed.

Cursor, Cline, Windsurf and Aider have kit bridges but no adapter here. Windsurf has no headless
CLI. The others need an observed session to establish how completion and usage are reported;
an adapter that infers completion from an exit code alone is not accepted by this runner.

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
node benchmarks/run.mjs --agent codex --model YOUR_SELECTED_MODEL --effort high \
  --runtime-home /private/path/to/runtime-home \
  --cohort contract-confirmation \
  --output benchmarks/runs/contract-001
```

`--cohort` selects one cohort and repeated `--task` options select tasks; given together, a task
must satisfy both. The first pilot's selection is `--task cart-totals --task retry-operation
--task csv-record`.

In the first pilot every kit session hit the 120-second limit while baseline sessions took 97 to
107 seconds, so that limit censored the comparison. Set `--timeout-ms` (up to 300000) from an
unscored readiness session in each condition before a measured run, and raise `--total-ms` to match.

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
and outcome. It also keeps a bounded copy of the delivered workspace under `delivered/`, with
`delivered-files.json` listing each file's hash and anything not copied (links, files over 256 KiB,
or beyond 400 files / 4 MiB). Unlike the diff, this copy includes untracked files such as added
tests, and it does not depend on the temporary workspace surviving. `passed` requires both
completed execution and all protected acceptance/regression groups passing. Each result also
records `session_completed` and `source_accepted` separately, and the report counts them apart: a
source that satisfies every check in a session that timed out is not a completed delivery. `failed` is completed execution with failing behaviour; unavailable/incomplete
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
