# Independent actual-result evidence review — Pilot 001

## 1. Object and sources reviewed

Actual 12-session run <repo>/build-kit/benchmarks/runs/2026-10-28-pilot-001; .agents/work/paired-benchmark/results.md; bounded selected archive .agents/work/paired-benchmark/evidence/pilot-001; frozen protocol/calibration/results/summary; every actual events.jsonl and stderr; initial hashes, prompts, original grader receipts and tracked diffs. Also reviewed final README/CHANGELOG/compatibility/eval-link wording. Protocol digest: 0aa5736a6fc4566d1a9ea2df926e5364634ca6ae0602214fb96bb884666f8580. The earlier preflight verdict c5463ec4 is historical and is not substituted for actual-result inspection.

## 2. Review mode and independence

Native-subagent, independent non-author /root/benchmark_review. Parent authored runner and analysis; distinct corpus author supplied graders. This final turn made no model calls, CLI benchmark invocations, source edits, subagents, commits or publication. Pure Node24 analysis and scratch Git diff application only; the recorded measured runtime remains native Node20. New reviewer artifacts only under /tmp/composed-review-actual-mteNWH. Previous /tmp Node20/runtime/workspace artifacts vanished across an environment restart; existing repository copies of historical review/evidence remain the durable source. Reviewer cannot attest executor identity or hidden backend behavior from local records.

## 3. Verdict

Accepted — the selected actual-run evidence and inconclusive interpretation are supported at the hashes below. This is acceptance of the bounded pilot report, not a claim of kit superiority, inferiority, complete product governance, or successful paired comparison.

## 4. Evidence supporting it

Frozen identity: protocol digest recomputes exactly. All 89 recorded kit/harness source entries match canonical current bytes; task prompt hashes, serialized seed hashes and source lists match frozen definitions. Every prompt.txt matches its frozen prompt. All baseline initial manifests contain exactly four application files and no project kit; all kit initial manifests contain 29 files, real CLI installation exits zero, and installed engineering-skill bytes match frozen source. All initial application files match common frozen seeds. All twelve threads have distinct actual thread IDs.

Calibration: original calibration process exits zero; nine seed/reference/mutant controls pass, with known-correct references accepted and seeds/mutants rejected while public regressions pass. This is calibration evidence, not comparative model success.

Actual outcomes independently recomputed from every raw event stream plus recorded process status: three completed-and-accepted baseline sessions (both development cart repetitions and retry confirmation repetition 1); four kit timeouts at about120 seconds, without turn.completed; five later incomplete sessions explicitly contain error and turn.failed messages reporting account usage limit. Twelve dispatched, zero not_run, nine blocked, zero completed semantic failures. No adverse attempt is excluded. Aggregate/per-trial JSON agree; observer output, source grader envelopes/expected check IDs and grader JSON agree. Summary recomputation is byte-structure equivalent. Every pair is non-comparable in both cohorts.

Source acceptance remains separate: all12 modules have ten semantic groups observed; five source snapshots pass all groups, but only three have completed sessions. Cart kit repetition2 passes10/10 yet times out; retry baseline repetition2 passes10/10 yet ends at quota. All24 protected public-regression groups pass, including untouched seeds. These are correlated assertion groups and do not turn incomplete delivery into success. Grade evidence is neither a success-looking final message nor a bare exit code.

Runtime-policy limitation is evidenced directly: each of the four timed-out kit stderr files records patch rejection under approval settings. Cart kit repetition2 also records read_only_file_system with path=unknown; its agent message reports moving .agents work notes into /tmp. Exact rejected paths and causal elapsed-time attribution are not established. results.md states this distinction and does not generalize timeout differences to kit inferiority.

Coverage: root usage exists for only three completed baseline turns. Missing usage remains null and incomplete cohorts/conditions do not get partial totals. Currency costs and resolved backend version remain unknown; observed process duration sums837640ms across twelve attempts, but censored timeouts and rapid quota refusals prevent interpreting condition means as successful-delivery speed. Zero automatic follow-up answers excludes setup/design labor; client timeout is not remote cancellation or an invoice cap.

Archive independently checked: all97 raw-run files are represented in raw hashes; all98 selected archive files are represented in archive hashes, with no unlisted selected files other than the manifest itself. Every listed SHA matches current bytes; retained original records copy byte-for-byte. All10 selected error events equal their exact cited JSONL lines. Full tool traces remain local/ignored, while selected stderr retains runtime-policy evidence.

Preservation limitation is explicit: temporary candidate directories disappeared before archival. Reviewer independently reconstructed all12 declared production modules from frozen seed plus retained tracked diff using Git in task-owned scratch; every SHA matches its original grader record and archived reconstructed copy. Added untracked tests are not recoverable from tracked diffs/file-change summaries. The report/archive label reconstruction and do not claim complete candidate snapshots or generated-test quality. Future durable snapshots are a bounded next-run correction, not a rewritten result.

## 5. Prioritised gaps

No unresolved material defect in the selected evidence report. Limits affecting future measurement are owned explicitly: durable complete source/test snapshots, intended-artifact-path sandbox probing, readiness/quota/usage coverage, realistic completion budgets and new confirmation cases. Current exposed confirmation cases are not represented as a fresh future holdout. No extra calls or skill/grader tuning replaced adverse outcomes.

## 6. Exit condition and unverified claims

This bounded actual-result review is satisfied at the recorded hashes. Final canonical integration, release/version policy and any broader campaign remain parent-owned. No final Git commit/head, hosted CI, exact remote cancellation, complete candidate tests, backend identity, authentic independent approval or superiority can be inferred. No missing observation is filled with fixture success. Historical verdicts remain preserved.

## Source and reviewed-artifact identity

Full source entries: /tmp/composed-review-actual-mteNWH/source-manifest.json
SHA-256 of that source manifest: f6486dbad5500a19c4b3c2e1b5cd62c9d052ac8ac49fe74a5fe14d52e2b7f218
Full raw evidence inventory: /tmp/composed-review-actual-mteNWH/raw-evidence-manifest.json
Per-trial event/outcome crosschecks: /tmp/composed-review-actual-mteNWH/trial-audit.json
Independent reconstruction inventory: /tmp/composed-review-actual-mteNWH/source-reconstruction.json
Archive verification: /tmp/composed-review-actual-mteNWH/archive-verification.json

Reviewed report/archive/document SHA-256:
b56f4222f002624f60a34d21da91030bb91b9ceef8dff6b037ef58f9429be557  .agents/work/paired-benchmark/results.md
dfa431653c89f66a7647ed35b9f458a75c5f0e213db30e4b2234f4f61c0400f6  .agents/work/paired-benchmark/evidence/pilot-001/archive-manifest.json
e96725e6a8c7adeafd15a2153566597f5b1b25a482a997f00042190c99a0647b  build-kit/CHANGELOG.md
7718ca9de520b97eb45f7bdf82b9642ed04990c6447efee3cf709529a6d72f02  build-kit/README.md
02a93d5addffa2ce57c8ea6e63f2ff8934dfbc4e15b66f4c2cd8a3af8a3537a5  build-kit/docs/compatibility.md
de56099d9a2777cada59bb02318d2f82bf8a1a702b5070cac35e1dbdfc67841d  build-kit/evals/README.md
