# video-editorial-workflow 1.0.0 — Revision-bound notes and exact handoff evidence

Date: 2026-11-01. Status: **proposed**; contract maturity **candidate**, format **0.1**.
Owner: repository agent. Decision authority: Composed maintainer. This is the
author's proposed revision, not independent approval or stable promotion.

## Evidence and proposed behaviour

Frame.io supports media-specific annotations and comparison, but equal labels or linked playback do not identify immutable media coordinates. Native Adobe snapshots remain unavailable, so compatibility guarantees must stay explicit product choices rather than rely on the qualified historical EDL claim.

The dated research refresh and source-to-observation records support the limited patterns and counterevidence. Added safeguards remain labelled product choices.
Read [research](../../research/README.md), its [comparison](../../research/comparison.md)
and the [dated source-impact record](../../research/refresh-2026-11-01.json).
The [exact before/after record](changes.json) identifies every changed clause.
All existing clause identifiers and acceptance cases are retained.

| Changed clause | Planned acceptance |
| --- | --- |
| REQ-VEW-008 | ACC-VEW-009 |
| REQ-VEW-013 | ACC-VEW-008 |
| REQ-VEW-014 | ACC-VEW-008 |
| QA-VEW-005 | ACC-VEW-009 |

Acceptance increases from 7 to **9** cases.
The table maps changed clauses only; it is not complete format-0.2 static coverage.

## Compatibility and migration

These stronger obligations and mandatory evidence are conservatively breaking;
the separate proposed version is **1.0.0**, without stable promotion. No format
migration is performed. The 0.3.1 baseline contract and traceability stay
byte-for-byte unchanged; hashes are in changes.json. Existing consumer pins and
previous evidence remain attached to their original bytes. No proof transfers. The [native impact report](impact.json) records conservative
revalidation scope; it does not decide semantic compatibility.

Adoption requires an explicit consumer pin and a review of every changed clause
and its data/authority/evidence implications. Run the full retained and added suite
on the adopting implementation, because format 0.1 does not establish targeted
coverage closure. Publish configuration/fixture/target revisions and all outcomes.
Rollback retains/restores the old pin; each implementation must assess operational
state/data rollback rather than infer it from specification versioning.
No Build Kit change, provider selection or implementation adapter is introduced.

## Evaluation and decision boundary

Freeze fixture bytes, scope and success/negative controls before confirmation.
Exercise every added case with positive controls and its stated failure/boundary
variants; retain the existing suite, including failed cases. Publish missing,
partial and not_run outcomes without averaging them into a pass. Structural
validation, author review and actual product behaviour remain distinct.
Optional-module scope is retained. Record justified conditional not_applicable
cases separately; never exclude unconditional obligations or inconvenient failures.
All product acceptance is **not_run** here; no implementation target was supplied.

Session exit: concrete candidate, traceability, migration impact, author review and
observed tooling checks. Independent review and a recorded maintainer decision
precede stable promotion. No implementation conformance or deployment is claimed.

## Deferred deepening

Both native Adobe URLs still return HTTP 403 and VEW-REFRESH-001 remains open for the historical observation. No EDL fidelity, native import or editor performance is claimed. Range comments remain conditional; extra editorial workflows and actual environment fixtures await deepening.
