# Independent implementation review — pre-trial snapshot

## 1. Object and sources reviewed

New build-kit/benchmarks/*.mjs and README files; build-kit/tests/benchmark.test.ts; calibration CI addition, package scripts and output exclusions. Read root AGENTS.md, RTK.md, contracts/AGENTS.md, paired-benchmark plan/handoff/delegation records, skills/catalog.json, delivery-review/SKILL.en.md, and draft harness clauses REQ-ADH-016..020/024..026. Base HEAD: d9a3fe6a821f9a490fbaccc1b81bbf959de3b348 plus uncommitted source. Review applies to the source hashes below, not a final-head claim.

## 2. Review mode and independence

Mode: native-subagent. Reviewer /root/benchmark_review is a fresh non-author context. Parent authored runner/report/adapter; /root/benchmark_corpus authored corpus/graders. No implementation edits, subagents, model calls, billed requests, commits or publication. Scratch artifacts only under /tmp/composed-independent-review/snapshot-pOg4O6. Native Node v24.15.0 used. Persistent review placed in task-owned /tmp as explicitly requested by parent. Parent owns canonical handoff and repair.

## 3. Verdict

Return needed.

## 4. Evidence supporting it

The schedule has two repetitions with baseline-kit/kit-baseline ordering and separates one development task from two confirmation tasks. Prompt and seed bytes come from the same frozen task objects. Treatment uses the real source CLI with Codex EN core/support, and checks initial application hashes. Fresh temporary Git roots avoid Composed ancestry. Explicit requested model, effort, ignored user config, disabled memories and isolated auth home are consistent across conditions. Existing docs appropriately limit host isolation and grader secrecy.

Independently executed all nine calibration controls from a copied source snapshot: seed and semantic mutant rejected, known-correct reference accepted, with protected public regressions preserved, for all three tasks. Result: /tmp/composed-independent-review/snapshot-pOg4O6/calibration.json. Grader imports copied declared source files and does not execute candidate package scripts/public tests. Passing exit status alone is not accepted; runner checks complete IDs/kinds/boolean results and completed Codex events. Cohort denominators preserve completed failures, blocked and missing rows; pairs with absent evidence stay unknown; currency/backend versions stay null. No superiority claim is made.

Executed the full four-slot CSV pipeline with a deterministic fake executable, synthetic auth.json and zero model requests. Baseline seeds failed semantic grading. Actual CLI treatment correctly recorded blocked setup because canonical checkout currently has @esbuild/win32-x64 under Linux Node. Both kit sessions blocked; paired comparisons remained unknown. Evidence: /tmp/composed-independent-review/snapshot-pOg4O6/integration-control/. This is an environment prerequisite already documented, not a fabricated success or a new code defect. A positive native treatment-install integration remains unverified in this review.

## 5. Prioritised gaps

1. Medium — descendant processes survive a normally completed session. In process.mjs finish() (lines 21–37), close resolves and clears timeout; only stop() kills the process group. Reproduction: runProcess(Node, [-e, code]) where code spawns a child with stdio:ignore, calls child.unref(), prints its PID and exits. runProcess returned completed/exit 0 in 51 ms while descendant PID remained alive. Reviewer explicitly killed the child. Evidence: /tmp/composed-independent-review/snapshot-pOg4O6/edge-controls.json. A task that starts background test/service work can outlive the session, its deadline and sequential scheduling. Owner: runner author. Exit: bounded cleanup on normal completion plus a control for descendants with closed/inherited pipes.

2. Medium — early interruption cannot be faithfully recovered. run.mjs stores events and result records only after runProcess returns (lines 370–377 and 424–426), and does not initialize results.json. report.mjs line 128 unconditionally reads results.json. Retained protocol plus absent results (the state during calibration or first call) makes documented recovery exit 1 with ENOENT. Evidence: /tmp/composed-independent-review/snapshot-pOg4O6/missing-results-control.json and interrupted-before-first-result/. Even after simply treating absent results as [], a dispatched-but-interrupted call would be synthesized as not_run despite an actual attempted session. Owner: runner author. Exit: durably record attempt/dispatch before model invocation, preserve interrupted attempts separately from never-run slots, and recover a missing aggregate without deleting or silently replacing corrupt evidence. REQ-ADH-018/025.

3. Low — incomplete root usage coverage is not identified. observeCodex filters missing usage entries before summing (codex.mjs lines 48–62); one turn.completed with counts and another without produces numeric totals from only one turn while coverage text mentions only delegated incompleteness. Reproduced in edge-controls.json. Owner: adapter author. Exit: expose root completed/usage-event coverage or null incomplete totals; tokens remain observations rather than invoice estimates.

## 6. Exit condition and limits

Correct and independently recheck findings 1–2 (or explicitly bound any remaining limitation without claiming affected guarantees). Confirm native CLI treatment installation before dispatching measured pairs. Actual model completion, trial outputs, measured acceptance, delivered revisions and final-head source applicability have not been verified. Parent will request a bounded evidence recheck after actual trials; this pre-trial report makes no unrun-result claim. Source freeze checks exist, but are not identity attestation or an immutable OS sandbox, as docs already explain. No unsupported guarantee is requested.

## Reviewed source SHA-256

1778db066173eb53bbba3055d3c8ef4205a6964489f0fa5bb5c4d8956b46c7cc  README-corpus.md
c15dc4485067319bb350dc04abd4cfb1009eb9345e6cf099d091b55a1c47faea  README.md
11f7bbda4cd30ab5184f3b711231a25e7ab9ca52bc01de528b192d6c3987b91e  calibrate.mjs
2a0e5f0f9b0d875c31bd3f577adfdfb188a95cb36b5642a741e7b6cca3e8378f  codex.mjs
157b9fdb70eb8d057e3f29ba4946538193f4af090252f1fb4c4aab33bfbcc039  corpus.mjs
9f63da9d0ef33ccb0ee8517df2e9ff66e6ebdf249b6b71f11cc2ec3726bd7ab9  grade.mjs
84bebcfd0d0b4bd9b53dd1972888a50cfcd9d8b3809b4ac86509dd5e10a3cf22  graders.mjs
6e2e916897a0c0837f164a1f3ca7eb3c45bfcea0224ee1ca0dc2747e143d7f81  process.mjs
43b9da20e837d3a84df5b9ecbe0e1d68ebf3d6bb6a443f2a03e98349404dba17  report.mjs
a8ac123e64d1c0f938d09d6f69b57bc4e9aeebe922fd6ace5305876c721b5a2f  run.mjs
d65a50f2e79721ab4055af47e4d38235eeed837d1fb5bed1d380496ed97d6736  tests/benchmark.test.ts
86092014a18e1e1bce0ff917942387232547e497741ff4fe12e126883059502a  .github/workflows/validate.yml
fa754c818226598a5e425abe9cb0d0d48e12f9f64ba50fdf4f65df163a865fc2  build-kit/package.json
84d296e7d4bd524d9cc62924c37b4b45c50cb71515874bb6194220e6537b67ba  build-kit/.gitignore
3dfcffdbc3a1b61052e616357d53b7c9dad225f62b60b610539d25666dcdee24  build-kit/.npmignore
