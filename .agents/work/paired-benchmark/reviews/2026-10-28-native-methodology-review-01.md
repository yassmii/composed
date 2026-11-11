# Paired benchmark methodology review 01 — 2026-10-28

## 1. Object and sources

Pre-implementation review of `.agents/work/paired-benchmark/plan.md` and the existing eval harness at base HEAD `d9a3fe6a821f9a490fbaccc1b81bbf959de3b348`. Sources were read directly; `sources-sha256.json` binds their observed bytes. Canonical context: root/contract AGENTS, draft REQ-ADH-016..020 and 024..026, QA-ADH-004, ACC-ADH-011/016/020, and the linked research comparison/observations. No normative contract was edited or promoted.

The current `build-kit/evals/run.mjs` grades declared skill/risk and phrases, and its command adapter has no built-in timeout or output bound. It is not an appropriate semantic code-delivery quality oracle without a separate bounded execution/grading layer. This is a limit of its existing documented purpose, not proof that the original fixture harness is defective.

## 2. Mode and independence

`native-subagent`, reviewer `/root/benchmark_methodology`, distinct from the parent and future benchmark implementation author. Read-only access to the repository; no source, fixture, account, model trial or contract writes. Only this task-owned temporary report directory was written. No subagents were launched. This is a design/methodology audit, not the required final implementation or final-head review.

## 3. Verdict

**Return needed on protocol precision before measured trials.** The planned local pilot is useful and proportionate. Its most important honest boundary is that a three-task synthetic engineering pilot can establish observed outcomes and harness feasibility, not general superiority or a complete product/UX/governance benefit. No implementation verdict is possible yet.

Two corrections should be made before freezing the measured protocol:

1. Explicitly separate development/calibration task IDs and confirmation task IDs. Testing a grader on its own correct/mutant implementations is required calibration, but does not by itself create an independent confirmation corpus. Freeze the confirmation prompts, seeds, public regression tests, grader and kit bytes before any confirmation model session. Do not modify them after seeing confirmation outputs; corrections require a new protocol/revision and retention of earlier results.
2. Replace “at most 12 model executions/calls” with “at most 12 measured trial sessions.” A `codex exec` session can contain multiple model turns and native child sessions. Declare session/time/output/optional token bounds and account class; do not represent those as an exact dollar spending ceiling. Child work must be included in usage totals where available, or coverage must be marked incomplete.

## 4. Concrete validity criteria

### Matched conditions and reproducibility

- Use the same configured requested model and reasoning effort, exact CLI version, Node/OS/tool versions, sandbox/approval/network policy and enabled capabilities for both arms. Record requested model separately from resolved backend model; unknown resolution stays null.
- Baseline means no project kit. Treatment uses the real current installer and exact kit source hashes, not an author-written “kit-like” prompt. Keep all synthetic application files, task text, user stack decisions and public tests byte-identical at the start of each pair. Treatment instruction files/catalog/memory are the intentional difference and must be inventoried.
- Disclose shared provider/global configuration, plugins, hooks, user instructions, skill discovery and inherited environment that cannot be isolated; do not call the baseline a clean bare-agent condition if those remain. Start fresh threads and repositories, never resume the previous arm. Record source seed, installed instruction hashes and protocol manifest.
- Freeze a schedule before dispatch. With two repetitions, run baseline→kit once and kit→baseline once per task; use one fixed seed for task/pair order. Sequential trials avoid concurrency contention. This balances some order effects but does not remove backend/cache drift. Capture available cached-token counts.
- Never compare two different models as evidence of kit effect. Do not change effort, tools, model alias or permissions for a failed treatment run and silently include the retry as its replacement.

### Corpus and graders

- Use three varied but bounded engineering tasks with explicit existing Node stack, expected behaviour, no material open product decision and no dependencies on production services. Make at least one task nontrivial enough to expose a plausible semantic defect beyond one-line syntax; keep public regression coverage that can catch collateral changes.
- Prefer distinct task categories such as a business-rule boundary, idempotent/retry state transition, and data transformation with preservation/error semantics. This does not measure discovery, UX or a long-lived delivery handoff.
- Every applicable grader must accept a known-correct reference, reject the untouched defective seed for the intended reason, and reject at least one plausible well-formed semantic mutant that exits/loads normally. Also run an existing-regression mutant so the regression gate is demonstrated, not inferred.
- Grade original protected tests and checks against selected delivered source copies. Do not trust candidate-edited package scripts, tests, “all tests passed” text or a zero exit alone. Record modifications to original tests/config as separate scope observations.
- Withheld graders are absent from the supplied task workspace; this is not proof of hostile filesystem isolation. Candidate code and grader subprocesses need their own deadline/output bounds. If graders cannot run, quality is unknown/blocked rather than passed.
- Freeze acceptance thresholds before confirmation: task acceptance requires all predeclared required behavioural groups, and regressions must remain a separate reported dimension. Avoid a single composite score that can hide a safety/regression failure behind many easy assertions.

### Execution outcomes and false blocks

- Record at least process spawn/exit, final turn state, grader state, behavioural assertions and regression state separately. Correct code plus a timed-out session can retain observed code quality while session execution remains blocked; an exit-zero session plus wrong code is an acceptance failure.
- Distinguish `passed`, `failed`, `blocked` and `not_run`. Auth/startup/capability failures are not failures of business logic. Preserve all root attempts; any rerun gets a new immutable identity and explicit reason. Do not reuse an output directory or replace unfavourable trials.
- A timeout is a censored observation at the deadline, not the ordinary completion time of a successful trial. Terminate supported process groups/descendants and record any cleanup limit. A surviving child must not alter the next trial.
- Do not waive the kit's delegation or independent-review policy merely to avoid a blocked score. Record observed tool availability and actual native IDs when the task requires delegation. A block can be a correct policy outcome or a candidate false block; label the reason and have a human review it before calling it unjustified.

### Metrics and aggregation

- Publish all intended task/arm/repetition rows. Show acceptance per intended trials, the evaluated subset, execution/blocked/not_run counts and regressions; make every denominator explicit. Do not drop failed/censored/missing trials from a speed/cost comparison without showing coverage.
- Show raw paired differences for each task/repetition. Three distinct tasks × two repeats provide six pairs but only three task contexts; these are not six independent product/project samples. Do not infer statistical significance or generalise a small average into a universal percentage gain.
- Measure wall duration with a monotonic clock, separately reporting setup/install, agent execution and grading. This prevents installer overhead from contaminating an agent-only latency claim, while allowing a separate end-to-end cost view.
- Usage should retain provider-reported input/output/cached/reasoning fields as returned. Aggregate all turns and delegated work only when trace coverage supports it; distinguish unavailable from zero and possible parent/child double-counting. Subscription usage is not an API invoice. Monetary cost stays null unless an actual bill or an explicit, versioned pricing calculation is available and clearly labelled estimated.
- Human intervention means actual clarification/repair/help during a measured trial; record operator retries and any assistance. Automated no-human operation may report zero observed interventions, not “zero human effort” for benchmark design/setup/review.
- Capture change size and path scope only as descriptive maintenance proxies. Do not call more/less code, more artifacts or a judge's preferred prose “maintainability quality” without an independent blinded rubric.

## 5. Priority gaps and owners

Parent/orchestrator owns protocol precision, schedule freeze, honest scope and account/runtime readiness. Corpus author owns semantic assertions and calibration evidence. Runner author owns operational limits, outcome taxonomy, immutable records and coverage-aware metrics. A fresh non-author final reviewer must inspect the implemented runner, source hashes, positive/negative tests and actual trial artefacts; this report does not replace that gate.

Do not consume the entire trial allowance merely to diagnose a broken adapter. A separate minimal readiness probe is diagnostic, recorded outside the confirmation set; if readiness fails, stop dependent dispatch and mark planned trials not_run with the concrete cause. Other independent harness implementation/test work can continue.

## 6. Exit and prohibited claims

Protocol may proceed to a measured pilot once its manifest identifies development versus confirmation IDs, exact arm deltas/configuration, ordered schedule, limits, outcome/metric definitions and predeclared thresholds, and the graders pass positive/negative controls. The final implementation still needs meaningful tests and independent review.

Permitted conclusion: “On these versioned synthetic tasks, this runtime/configuration produced these raw outcomes, times, usage coverage and limitations.” Prohibited conclusions include best-of-breed/SOTA superiority, production readiness, full draft-contract conformance, authenticated independent review from an unsigned JSON declaration, zero dollars from missing cost data, and actual native delegation from agent-authored prose alone.

Raw prompts/tool traces stay local/ignored by default; only synthetic selected artefacts and bounded aggregate reports may be shared in the authorised repository scope. Auth material must never enter reports, argv, committed fixtures or emitted logs. No automatic model-calling CI job is implied by this benchmark feature.
