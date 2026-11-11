# Author review — ENG-2026-11, agent-oriented second pass

Date: 2026-11-01. Verdict: **revised candidate ready for independent review;
comparative excellence not established**. This is a distinct author-review pass,
not independent approval or a human verdict. The first-pass review and its
validation record are retained unchanged at history/pass-1.review.md.

## Findings and corrections

- **Positioning:** agent discovery and screenshots already exist in current
  community bridges. They cannot be advertised as a unique competitive advantage.
  The revision explicitly targets bounded scene assembly/correction; general DCC
  modelling, arbitrary-media reconstruction and universal rendering leadership
  remain outside scope. This choice comes from the existing agent contract, not
  from treating every competitor feature as a required engine capability.
- **Provenance:** ten newly retrieved primary documents supplement the original
  twelve. Community bridges are attributed to their project owners, not Blender
  Foundation/Unity Technologies. Three research references establish narrow
  evaluation-method observations only; their leaderboard scores and claimed
  speedups are not evidence of Composed's quality or performance.
- **REQ-3D-015:** batching and fail_fast do not establish atomic rollback. The
  contract deliberately chooses complete validation, property-level preview,
  all-or-none publication and expected revisions. Review identified ambiguity about
  which operations can be batched: simulation advancement, scene closure and asset
  loading are now explicitly excluded, with negative acceptance controls. Ordinary
  scene edits and ready bindings remain available without prescribing a transaction
  technology or command transport.
- **REQ-3D-016:** checkpoints restore reference content, not old revision identity,
  external effects or privileges. The capture names its coherent revision; restore
  revalidates current asset/root/profile/limits, preserves random generator state,
  and counts retained/preparation allocations. History is not a filesystem or
  process-crash backup. Closed-scene and stale/released references cannot bypass
  the existing lifecycle and file-boundary requirements.
- **REQ-3D-017:** Replicator's debug renderer IDs and labelled-entity limitations
  cannot be promoted into a stable-node guarantee. The latter is an explicit
  stronger choice. Camera-distance units, surface semantics, background, alignment
  and same-revision views are required; missing channels cannot masquerade as
  complete correction evidence. Diagnostic buffers obey the original resource and
  retirement rules. Geometry fixtures are opaque; transparency/effects are declared
  separately rather than implicitly promised as universal ground truth.
- **ACC-3D-019:** after restoring the deliberately unsuccessful edit, the agent must
  apply the intended correction again before final verification. Its sequence is
  now explicit so recovery cannot leave the originally incorrect scene while
  claiming final task success.
- **QA-3D-004 / POL-3D-003:** image resemblance, structural correctness, recovery,
  agent completion, cost and aesthetics are separate measures. Hard integrity or
  access failures cannot disappear in an average. The eight-task proposal is not
  yet instantiated into actual engine-schema fixtures or a runner, and all trials
  remain not_run; neither its existence nor a schema pass establishes SOTA.
- **Fair comparison:** the protocol distinguishes native vs adapter-provided
  capabilities, interactive-editor vs no-display strata, missing/unsupported vs
  failed results, request granularity and unknown cost. It does not declare that
  any comparator lacks an untested capability. Three proposed trials per task are
  a limited pilot, not statistical power. Confirmation hypotheses and margins must
  be fixed before running them; no empirical improvement threshold is invented.
- **Compatibility:** the 0.2.0 baseline remains exact. New mandatory agent/evidence
  requirements extend the breaking 1.0.0 candidate. Its previous exact bytes are
  preserved in history and identified in the current proposal. Keeping a provisional
  numeric version does not transfer proof; any prior byte pin needs explicit adoption.
  Format 0.1, the existing source IDs and all old acceptance IDs remain.

## Intended coverage and evidence boundaries

The first-pass mapping remains in history/pass-1.review.md for unchanged clauses.
The following additions/changed evidence are a manual mapping, not format-0.2
static coverage or an executed result:

| Clause / concern | Planned evidence |
| --- | --- |
| REQ-3D-015 | ACC-3D-016 and AG-02/03/04/07/08: preview, successful edit, stale/concurrent/invalid/over-limit rejection and unaffected-state preservation |
| REQ-3D-016 | ACC-3D-017 and AG-05/07/08: coherent capture, fresh-revision restore, seed continuation, incompatible/changed/released asset or checkpoint controls and memory |
| REQ-3D-017 | ACC-3D-018 and AG-06/07/08: two cameras, RGB/depth/entity mappings, independent depth/visibility expectations, stale/unsupported/over-limit results |
| REQ-3D-009/010 | ACC-3D-006/007/019 and AG-01/08: discovery-only correction and read-only inspection, not a unique-feature or task-quality assertion |
| QA-3D-004 / MET-3D-003 | ACC-3D-019/020 and all AG tasks: actual completion/denominators, structural/visual/recovery rubrics and measured budgets/interventions |
| POL-3D-003 | ACC-3D-020: invalid/incomplete/incomparable report controls, dated scope, separate dimensions and explicit unknown status |
| Existing invariants and REQ-3D-013/014 | Original cases plus ACC-3D-016–019: no partial edit, lost update, lifecycle revival, arbitrary outside access or uncounted checkpoint/diagnostic allocation |

The first pass has 15 scenarios, the current candidate **20**. All twenty engine
scenarios and eight proposed agent tasks are **not_run**. No actual engine build,
bridge installation, agent/model comparison, visual-quality score or resource
performance is established by this session. A report labelled not_run is an honest
status artifact, not a passed ACC-3D-020 execution or product conformance result.

## Actual checks

Native Linux Node 24.15.0 and existing dependencies. No Build Kit/tooling/schema
change, package installation or consumer-repository mutation. The command results below were observed during this pass. Third-party bodies and raw check logs remain in
/tmp, outside Git; committed history consists of prior contract/traceability/docs
and source metadata, not raw check archives.

## Review and promotion limits

A prototype/adapter, concrete task fixtures, scorer controls and budget profiles
are needed to execute the comparison. Before stable specification promotion,
independent review and a recorded maintainer decision remain required. Published
benchmark references have not been replicated or fully audited; live documentation
aliases remain freshness-limited. Current claims are **chosen ambition** and
**source-supported capabilities**; **measured advantage is unknown**.

## Observed validation results

| Check | Result and scope |
| --- | --- |
| `npm run validate:contracts` | Exit 0, including current 3d-engine baseline/candidate schemas and source→observation→clause links. |
| `npm run test:contracts` | Exit 0, **68 tests passed**. Tests exercise contract tooling, not an engine or agent benchmark. |
| `npm run example:contracts` | Exit 0: synthetic reference passes, semantic counterexample fails, changed checker is stale and dependent cases are selected; no 3D or agent conformance assessed. |
| `npm run verify:research` | Exit 1 globally; baseline and candidate **pass**, all 22 active 3d-engine source hashes match. Outside this family: the same 17 hash differences and 3 retrieval errors recorded in the first pass (COPRO ECONNRESET, two Premiere URLs HTTP 403). Unrelated hashes are untouched. |
| `npm run contracts:compare -- --before contracts/product-types/3d-engine/candidates/1.0.0/history/pass-1.contract.yaml --after contracts/product-types/3d-engine/candidates/1.0.0/contracts/contract.yaml --json` | Exit 0, assessed: REQ-3D-015/016/017, QA-3D-004 and POL-3D-003 added; no normative ID removed. Conservative format-0.1 impact selects all clauses/cases; targeted coverage unknown, compatibility not_assessed by tool and proof_transfer not_performed. |
| Exact preservation audit | 0.2.0 contract/traceability match HEAD and start-of-pass bytes; pass-1 candidate/traceability/proposal/review and source manifest are preserved exactly. Existing work outside this family is unchanged except intentional README/changelog extensions. |
| Engine/agent task execution | **not_run**: no implementation/adapter/scorer execution or comparative measurements. The corpus is a proposed protocol requiring concrete profiles and fixture bytes. |

Current candidate contract SHA-256:
`621cc2fbb99cc3ea11b1d372021571c2cd6ac57804394f0959950cf964f4afe1`.
Protocol manuscript SHA-256 (identifies text, not instantiated engine fixtures):
`1f466b976087595a2ec00678e40ce6f7c8123d83c8b00b70105b0ec83b43c9c1`.
