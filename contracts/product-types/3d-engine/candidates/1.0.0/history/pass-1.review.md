# Author review — ENG-2026-11

Date: 2026-11-01. Verdict: **candidate ready for independent review; not stable**.
This is a separate author-review pass after primary research and drafting, not an
independent human or agent verdict. The prior 0.2.0 review and its recorded approval
remain historical and do not approve 1.0.0. No engine conformance is claimed.

## Findings and corrections

- **Provenance, REQ-3D-002:** previous traceability called cycle rejection a
  convergence while citing Unreal alone. Candidate classification is a supported
  pattern plus explicit no-mutation/concurrency choices. Hierarchical structure
  remains supported across all three products without importing their object models.
- **Provenance, REQ-3D-003:** Godot's background-loading API can block on early
  retrieval. Candidate traceability explicitly distinguishes the observed mechanism
  from the stronger chosen nonblocking status/retrieval guarantee. OBS-3D-001 adds
  the Node source for its callback claim rather than relying on tutorial navigation.
- **Consistency, REQ-3D-004 / INV-3D-002:** the old fallback-or-error option was
  underspecified relative to ready-only asset use. Candidate selects controlled
  structured errors. Independent ready content remains usable; a failed asset
  cannot masquerade as a ready resource or successful image.
- **Lifecycle, REQ-3D-014 / INV-3D-002–003:** source products distinguish detach,
  destruction, scene removal and physical reclamation. Candidate separates logical
  invalidation from retirement, preventing both late readiness publication and
  premature destruction of submitted graphics resources. Shared backing is distinct
  from scene-owned bindings and pending retirement remains counted against limits.
- **Race correction during review, REQ-3D-014 / ACC-3D-014:** an accepted render may
  still be unsubmitted when closure occurs. It must fail with scene-closed status
  rather than submit after closure. The fixture now distinguishes that case from
  work already submitted, which may finish safely. Repeated close cannot double-retire.
- **Scheduling, REQ-3D-005/006 / POL-3D-001:** explicit image rendering does not
  advance simulation; real-time updates complete before one coherent revision is
  consumed. Catch-up excess is reported and discarded, never counted as executed
  time or accumulated into unbounded debt. Five steps is a retained product choice.
- **Headless evidence, REQ-3D-012 / ACC-3D-009:** Godot's headless mode disables
  rendering, so it is counterevidence, not a vendor feature used to prove offscreen
  images. Two nonuniform camera-reference images guard against a dummy success.
  Missing required graphics capabilities still fail startup under INT-3D-001.
- **Proof scope, QA-3D-001/003:** fixed rate does not establish deterministic state;
  neither a median frame time nor logical closure proves FPS throughput or reclaimed
  GPU memory. Profile, numeric rules, workload and resource ledgers are explicit.
  Existing numeric targets are unchanged and have not been measured here.
- **Coverage correction, POL-3D-001/002:** the overload case now explicitly
  inspects the retained default interval and cap. Open-format loading is distinct
  from scene-schema round-trip: ACC-3D-004/012 require declared-extension loader
  fixtures and an unsupported-format negative control. No concrete format is chosen.
- **Neutrality / compatibility:** no language, graphics API, asset format, vendor,
  transport, database or architecture is prescribed. New mandatory behaviours and
  evidence are breaking; 1.0.0 stays separately stored with status candidate.
  Source history and baseline contract/traceability bytes are preserved. No consumer
  migration or old proof transfer occurs.

## Intended clause-to-case coverage

This manual mapping is reviewed intent, not format-0.2 static coverage or executed
proof. Capabilities are represented by their requirement rows. All engine cases
are **not_run** in this session; no implementation revision is assessed.

| Clause | Acceptance and required observation |
| --- | --- |
| REQ-3D-001 | ACC-3D-001, 005, 011: composed transforms and valid reparenting |
| REQ-3D-002 | ACC-3D-005, 011: cycles, self-parenting, competing reparenting and unchanged rejection state |
| REQ-3D-003 | ACC-3D-002, 012, 014: nonblocking pending status, successful readiness and close race |
| REQ-3D-004 | ACC-3D-002, 012: diagnostic stages and rejected failed-asset use, independent-scene control |
| REQ-3D-005 | ACC-3D-008, 009, 013: scheduled update order, coherent revision and no stepping for explicit images |
| REQ-3D-006 | ACC-3D-008, 013: cap, discarded-time report, counters and no hidden debt |
| REQ-3D-007 | ACC-3D-004: versioned-schema import/export, state equality and rejected import |
| REQ-3D-008 | ACC-3D-005, 012, 014: complete command coverage, correlation, errors and terminal asynchronous outcomes |
| REQ-3D-009 | ACC-3D-006: discovery-only agent journey, declared defaults, constraints and result structures |
| REQ-3D-010 | ACC-3D-007: repeated coherent read-only snapshots, no consumed diagnostics or load side effect |
| REQ-3D-011 | ACC-3D-008: pause, exact stepping, invalid count, command vs frame limits |
| REQ-3D-012 | ACC-3D-009: actual no-display images, metadata, tolerance, negative capabilities and camera cases |
| REQ-3D-013 | ACC-3D-010, 015: file boundary, transitive escape, decoded/rendering memory and pending-retirement accounting |
| REQ-3D-014 | ACC-3D-014, 015: close/load/submission ordering, repeated closure, shared bindings and cleanup failures |
| INV-3D-001 | ACC-3D-001, 005, 011: tree integrity and single parent |
| INV-3D-002 | ACC-3D-002, 009, 012, 014: ready valid bindings at submission and safe earlier work |
| INV-3D-003 | ACC-3D-003, 014, 015: no new closed-scene use, retirement and stale-reference rejection |
| POL-3D-001 | ACC-3D-008, 013: default interval, five-step cap and observable discarded lag |
| POL-3D-002 | ACC-3D-004/012 use the profile-declared open-format extension and loader fixtures; schema round-trip alone does not prove loader support |
| QA-3D-001 | ACC-3D-003: actual timed benchmark on the declared hardware/profile; FPS reported separately |
| QA-3D-002 | ACC-3D-002, 005, 012: asset, cause, corrective action and stage for each injected failure |
| QA-3D-003 | ACC-3D-004, 008: same-profile reference equality and 600-step seeded fixture |
| INT-3D-001 | ACC-3D-009: missing-capability startup failure, no dummy-success substitution |

Before a conformance run, publish the actual workload, warm-up, cycle count,
asset-format extension, numeric rules, image tolerances, retirement/quiescence
procedure and all reference artifacts. Absent profiles, incomplete cleanup and
unexecuted controls cannot be counted as passed. Selection of a concrete engine
stack or transport is outside this contract revision.

## Actual verification

Native Linux Node 24.15.0 from the existing fnm installation, with existing checkout
dependencies. No install, Build Kit change or unrelated hash refresh. Raw logs and
third-party page bodies remain outside Git.

| Command / check | Actual result |
| --- | --- |
| `npm run validate:contracts` | Exit 0, including baseline and candidate schemas and source→observation→clause traceability. |
| `npm run test:contracts` | Exit 0, 68 tests passed. Contract-tool regressions, not engine acceptance tests. |
| `npm run example:contracts` | Exit 0: synthetic reference accepted, semantic counterexample rejected, changed checker marked stale and dependent cases selected. No 3D-engine conformance assessed. |
| `npm run verify:research` | Exit 1 globally; all twelve 3d-engine sources match. Seventeen hash mismatches and three retrieval failures remain in unchanged outside-pilot manifests. |
| Scoped native `review(unit, true, candidateDirectory)` | Empty error list, exit 0: candidate traceability and all twelve source hashes match. This additionally covers the candidate created after the global retrieval began. |
| `npm run contracts:compare -- --before contracts/product-types/3d-engine/contracts/contract.yaml --after contracts/product-types/3d-engine/candidates/1.0.0/contracts/contract.yaml --json` | Exit 0, assessed: REQ-3D-014 added, no normative ID removed; all clauses and fifteen acceptance cases conservatively selected. Format-0.1 targeted coverage unknown; compatibility not_assessed by the tool; proof_transfer not_performed. Breaking-version analysis above is the author's semantic assessment. |
| Baseline and local-change preservation | Both 0.2.0 files match HEAD and the start-of-pass bytes; prior source manifest retained exactly. All earlier workspace files outside this family, except the intentionally extended contracts/README.md and contracts/CHANGELOG.md, remain unchanged. |
| Engine cases ACC-3D-001–015 | **not_run**; no engine implementation revision, benchmark, graphics execution, image result or runtime safety evidence supplied by this session. |

The outside-pilot failures match those recorded in the booking pass; their
behavioural relevance has not been investigated here:

| Family | Remaining failures |
| --- | --- |
| agentic-delivery-harness | 1 hash mismatch: Claude hooks |
| career-evidence-platform | 3 hash mismatches: SkillSpan, Career RAG, ESCO EQF |
| collaborative-workspace | 4 hash mismatches: Notion permissions/history, Airtable history/automations |
| e-commerce | 1 hash mismatch: Shopify cart |
| prospecting-workspace | 6 hash mismatches: CNIL FAQ, Stripe idempotency/events, RNIC, Pipedrive and forms; COPRO retrieval ECONNRESET |
| video-editorial-workflow | 2 hash mismatches: Frame.io comments/compare; Premiere EDL and formats retrieval HTTP 403 |

No outside-pilot source or hash was modified to obtain a green result. A failed
retrieval is not verified content, and a mismatch is not by itself a product failure.

## Research limits and review boundary

Godot's stable alias and Epic's live URLs are not immutable upstream pins. Their
normalized hashes were checked, but no immutable archive is claimed. The previous
review's archive concern remains a stable-review input. Unity's versioned 6000.0
pages remain maintained documentation, not frozen runtime binaries. No long
third-party content is redistributed.

Additional device-loss/crash recovery, cross-platform equality, code sandboxing
and upstream performance benchmarking remain outside this pass. Concrete execution
profiles are needed before implementation validation, not proof that an engine
must already exist before the specification can be stable.

Independent review and a recorded maintainer decision remain required for stable
promotion. This author review does not fulfill them. This pass stops at the existing
3d-engine family and does not alter the earlier booking candidate or consumer pins.
