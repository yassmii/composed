# Independent corrected-source recheck — deterministic preflight

## 1. Object and sources reviewed

Corrected benchmark runner, process adapter, Codex observer, storage/report recovery, README and focused tests. Sources read directly, then copied to /tmp/composed-independent-review/recheck-PAPCNH/benchmarks for independent controls. Earlier review remains preserved at /tmp/composed-independent-review/snapshot-pOg4O6/review-66c66c34-b3b5-47fa-ac43-f27b33ca7e8f.md. Same base HEAD d9a3fe6a821f9a490fbaccc1b81bbf959de3b348 with uncommitted sources; this is source-hash applicability, not a final-head review.

## 2. Review mode and independence

Mode native-subagent; reviewer /root/benchmark_review is a distinct non-author context. Parent owns repairs. Scope was bounded recheck of earlier findings plus successful actual CLI treatment installation with a fake agent. No implementation edits, subagents, model invocations, billed calls, commits or publication. All new writes are in task-owned /tmp. Exact supplied pilot runtime Node v20.20.2 Linux used for passing controls and integration.

## 3. Verdict

Accepted — for corrected implementation and deterministic preflight within this bounded review. This does not assert completed measured trials, comparative effectiveness, full contract conformance or project closure.

## 4. Evidence supporting it

All earlier findings are resolved in the reviewed snapshot:

- Normal completion now signals the original POSIX process group. Independent repeat of the original unref() child with ignored pipes found no executing child after completion. Timeout/output controls remain bounded. Measurement explicitly rejects Windows; original group scope and escaped-process limitation are stated. Cleanup is not claimed to be full OS supervision.
- Output sinks receive bounded raw chunks while a child is active. The independent timeout control retained its started output before forced completion.
- The full planned schedule is atomically persisted before calibration; pre-dispatch blocked/unconfirmed markers and prompt bytes precede invocation; raw event chunks stream to retained files; grading-pending state is durable. Missing aggregate report recovery works, per-trial dispatch state overrides a stale planned aggregate, and corrupt JSON remains an error.
- Independently interrupted a live fake-agent runner after its first streamed event. The four scheduled rows existed before interruption, the dispatched first attempt remained blocked/agent_dispatch_interrupted_or_unconfirmed, the other three remained not_run, and prompt plus streamed event bytes survived. The controlled fake process group was explicitly cleaned by the reviewer after terminating the wrapper. Evidence: /tmp/composed-independent-review/recheck-PAPCNH/actual-interruption-control.json and interrupted-agent-control/.
- A completed event lacking usage now makes the aggregate root usage null with explicit completed_turns:2, turns_with_usage:1, complete_root_usage:false. No numeric missing total is invented.

Independent edge-control evidence: /tmp/composed-independent-review/recheck-PAPCNH/recheck-controls.json. Source inspection also confirms real regressions cover normal-close descendants, streaming output, absent/stale report recovery and partial root usage.

Positive actual CLI installation control: ran the entire four-slot CSV pipeline with a deterministic fake executable and synthetic auth file, using the Linux-native runtime worktree as kit root. Both actual kit installations exited 0; all four fake sessions completed, left the intentionally defective seed untouched and therefore correctly reported failed semantic delivery. Protected regression/acceptance denominators remained present and pairs were comparable ties. Zero model requests were made. Each run also executed the nine seed/reference/mutant calibration controls successfully before dispatch. Evidence: /tmp/composed-independent-review/recheck-PAPCNH/integration-control/{protocol.json,results.json,calibration.json,summary.json} and per-trial kit-install.json/event/grader files. Protocol digest: ee6740dd207ada468551001a08e930bc4b3483273aa3df6e796b05f450a3fadb.

The harness source hashes recorded by this integration equal the copied review snapshot hashes, and the copied benchmark source hashes still equalled canonical source at report creation. Treatment identities/initial file manifests and installed CLI output are retained in the integration evidence.

## 5. Prioritised gaps

No unresolved material finding within the bounded corrected-source review. Earlier findings are closed by the independent controls above. The initially failing Windows-esbuild/Linux installation environment was corrected in the native runtime worktree; positive installation now has direct evidence.

## 6. Exit condition and unverified evidence

The bounded implementation recheck is satisfied. Parent owns actual measured sessions, preservation/publication of bounded synthetic evidence, component-wide validation and final integration. No actual model completion, measured acceptance rates, measured costs/tokens, adverse real-session results or final-head applicability has been reviewed here. A later bounded evidence review is required before claiming those results. The small corpus remains selected API behavior evaluation, not broad product quality or complete delivery governance.

## Reviewed source SHA-256

1778db066173eb53bbba3055d3c8ef4205a6964489f0fa5bb5c4d8956b46c7cc  README-corpus.md
9e8b38c4a7e1fb65dc2f005292affcade4b8b2d83c94dba7670b1c5be6d49f1e  README.md
11f7bbda4cd30ab5184f3b711231a25e7ab9ca52bc01de528b192d6c3987b91e  calibrate.mjs
55faac9c875b44c0a15eeea16fec74bcc13beed4abac093e7effcd73339b2cc7  codex.mjs
157b9fdb70eb8d057e3f29ba4946538193f4af090252f1fb4c4aab33bfbcc039  corpus.mjs
9f63da9d0ef33ccb0ee8517df2e9ff66e6ebdf249b6b71f11cc2ec3726bd7ab9  grade.mjs
84bebcfd0d0b4bd9b53dd1972888a50cfcd9d8b3809b4ac86509dd5e10a3cf22  graders.mjs
4c2b9efc46520cf452203a067ec4b2cbb94b411a9439e026201344e058c73c22  process.mjs
c614a734d0335159f95c02a33bca4a39960e18ded9b12347f539712487e83b4b  report.mjs
02b07fb98c23a023a95d5e37fcc407cb250dad6aa57ae6d9a98ff8fc739cbdda  run.mjs
c581c011404b1f8e528e843e69eb95b545af8160fa373f5bc32954d09fe1515a  storage.mjs
3d41a62040e601b8a61146e9618e4758bbaf05e8f0022933e349dd5e1fa4965b  tests/benchmark.test.ts
86092014a18e1e1bce0ff917942387232547e497741ff4fe12e126883059502a  .github/workflows/validate.yml
fa754c818226598a5e425abe9cb0d0d48e12f9f64ba50fdf4f65df163a865fc2  build-kit/package.json
84d296e7d4bd524d9cc62924c37b4b45c50cb71515874bb6194220e6537b67ba  build-kit/.gitignore
3dfcffdbc3a1b61052e616357d53b7c9dad225f62b60b610539d25666dcdee24  build-kit/.npmignore
