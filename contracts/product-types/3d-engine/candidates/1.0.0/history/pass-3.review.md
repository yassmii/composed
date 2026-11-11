# Author review — performance pass, ENG-2026-11

Date: 2026-11-01. Verdict: **candidate ready for independent review;
performance readiness unknown**. This is a separate author-review pass, not an
independent or human approval. Prior reviews are preserved as pass-1/pass-2 history;
none of their successful tooling checks proves actual engine or agent performance.

## Findings and corrections

- **QA-3D-001 / MET-3D-001:** a 16.7ms median alone never proved 60 completed FPS.
  Candidate now checks actual completed throughput and p95/p99/max/excursions at a
  declared completion/presentation boundary. The inherited numerical targets remain
  explicit product choices. New finite tail limits must be published in an actual
  workload/hardware profile before confirmation; no default is represented as tested.
- **Source limitations:** Godot describes CPU/GPU bottlenecks, Unity delayed frame
  timing/readback and incomplete prewarming, Unreal profiling overhead, and Khronos
  timestamp validity/availability. They justify measurement caution, not a vendor
  comparison or proof of Composed's speed. Six new sources bring totals to 28 sources
  and 33 observations. The failed Vulkan Guide URL returned 404 and is not used;
  the actual official sample was retrieved, read, hashed and verified instead.
- **REQ-3D-019:** operation/frame/revision correlation and units/clock domains are
  explicit. Delayed GPU counters cannot be assigned to the latest frame, missing
  counters cannot become zero, and overlapping CPU/GPU durations cannot simply be
  summed. Host-observed end-to-end completion remains required. Optional GPU
  instrumentation does not waive required completion/response evidence.
- **Image-ready boundary:** acknowledgement, GPU submission, GPU completion and a
  retrievable full image are distinct. ACC-3D-024 includes delayed readback/artifact
  work and separate cold/first-use and warmed populations. A prewarm call cannot
  erase unmeasured first-use work or justify a fixed assumed profiler subtraction.
- **REQ-3D-018:** finite admission/in-flight limits prevent hidden unbounded queues.
  Status/inspection/closure must meet the declared control bound while work is slow.
  Logical expiry before publication prevents a late commit/image success, while
  already committed work stays truthfully committed despite a late reply. GPU work
  may retire physically later and stays charged; no unsafe hard-cancellation
  mechanism or resource-freeing technology is prescribed.
- **Review correction, fast rejection:** response-time evidence could otherwise
  appear excellent by rejecting or expiring everything. The envelope, QA-3D-005 and
  ACC-3D-023 now also require positive minimum successful completion throughput and
  declared rejection/failure ceilings. Empty success samples cannot pass. Deliberate
  over-limit tests are separately classified negative controls, not normal capacity.
- **Memory and scale:** process RSS/driver estimates differ from engine ownership
  accounting. Scene/checkpoint/diagnostic/preparation/in-flight/pending-retirement
  allocation peaks and finite caches must be visible across declared repeated cycles
  and load points. Incomplete quiescence is not a leak-free pass. Failed cleanup is
  not hidden by calling retained allocations a cache.
- **Quality and fairness:** performance cannot be improved by hiding channels,
  lowering resolution, omitting work/failures or changing the workload after seeing
  results. Declared adaptive modes have frozen quality floors and separate profiles.
  Real-time dropped lag remains observable under the existing scheduling policy.
  The agent protocol's 120-second task cap is not a runtime responsiveness SLO.
- **Compatibility/neutrality:** new obligations are breaking relative to 0.2.0 and
  strengthen the explicitly revisable, unpromoted 1.0.0 candidate. Version 1.0.0,
  maturity candidate and format 0.1 are retained. No old IDs/cases are removed and
  no transport, graphics API, threading/queue/storage technology or hardware vendor
  is prescribed. All earlier exact-byte pins/evidence remain historical.

## Manual coverage and execution boundary

Unchanged lifecycle and agent clauses keep their prior manual mappings in the
preserved reviews. This table adds or strengthens the following intended evidence;
it is not format-0.2 static coverage or a record of executed acceptance.

| Clause | Planned cases / observation |
| --- | --- |
| QA-3D-001 / MET-3D-001 | ACC-3D-003/021, PF-01/07: actual completed throughput, full intervals, tail/max/excursions and required profile limits |
| REQ-3D-018 | ACC-3D-022/023/025, PF-03/04/06: admission cap, deadline/commit ordering, control response, safe charged retirement and recovery |
| REQ-3D-019 | ACC-3D-021/024, PF-01/02/04/07: correlation, monotonic boundaries, valid/unavailable counters and complete image readiness |
| QA-3D-005 / MET-3D-004 | ACC-3D-022/023/024: response quantiles/max, successful throughput, rejection/failure denominators and delayed/censored work |
| QA-3D-006 | ACC-3D-023/025: multidimensional load sweep, memory high-water categories, finite caches, quiescence and return-to-load recovery |
| POL-3D-004 | ACC-3D-021–025: frozen quality/profile, all samples/trials, cold/warm/instrumentation strata and no unmeasured pass |
| Existing REQ-3D-013/014/015/016/017 and invariants | Performance workloads must preserve root/limit/closure/atomicity/recovery/output guarantees; speed cannot compensate for a hard failure |

The candidate now has **25 scenarios**; its performance protocol has seven proposed
workload/control groups. All engine/agent/performance cases are **not_run** here.
Actual hardware profiles, fixture/checker bytes, load points and finite new SLO
values must be instantiated before confirmation. No latency, throughput, scalability,
recovery-time or memory-budget result is invented. The known arithmetic series in
PF-07 is a future scorer control, not an observed benchmark or checker execution.

## Observed validation

Environment: existing Linux Node 24.15.0 and checkout dependencies. No install,
Build Kit, schema/tooling, consumer repository or unrelated source hash was changed.

| Command / check | Observed result |
| --- | --- |
| `npm run validate:contracts` | Exit 0: baseline/candidate schema and source→observation→clause traceability checks pass. |
| `npm run test:contracts` | Exit 0, 68 tooling regression tests pass. No engine performance measured. |
| `npm run example:contracts` | Exit 0: synthetic reference accepted, semantic counterexample rejected, changed checker stale, dependent cases selected; no 3D conformance assessed. |
| `npm run verify:research` | Exit 1 globally; all 28 active 3d-engine source hashes match for baseline/candidate. Outside this family: 17 hash mismatches and two Premiere retrieval HTTP 403 errors. The previously transient COPRO ECONNRESET did not recur and its unchanged source now passes. |
| `npm run contracts:compare -- --before contracts/product-types/3d-engine/candidates/1.0.0/history/pass-2.contract.yaml --after contracts/product-types/3d-engine/candidates/1.0.0/contracts/contract.yaml --json` | Exit 0: REQ-3D-018/019, QA-3D-005/006 and POL-3D-004 added; no normative ID removed. All clauses/cases conservatively affected, format-0.1 coverage unknown; tool compatibility not_assessed and proof_transfer not_performed. |
| Engine/agent/performance execution | not_run, no implementation revision or hardware/profile tested. |

The remaining global hash failures concern unchanged Claude hooks, career-evidence
research, Notion/Airtable, Shopify, prospecting and Frame.io records as listed in
pass-2 review. Only the actual six performance sources were added; no outside hash
was altered to obtain a green result. Third-party bodies and raw logs remain outside
Git. Committed-intent history contains prior contracts, traceability, docs and source
metadata, not raw check archives.

Current candidate contract SHA-256:
`2fb66e2aed161b3b43544c7a7b10ab1d7e749674f5b3d3b9acf2bcac76576d68`.

## Decision boundary

This is a concrete performance-aware specification and evaluation design, not a
measured fast engine or a SOTA result. Stable specification promotion still needs
independent review and a recorded maintainer decision. Actual performance acceptance
needs fully instantiated profiles and engine executions; missing values remain
unknown. Work stops at this existing candidate; no commit or push is performed.
