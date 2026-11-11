# git-backed-cms 1.0.0 — Approval of integrated revisions and authenticated transitions

Date: 2026-11-01. Status: **proposed**; contract maturity **candidate**, format **0.1**.
Owner: repository agent. Decision authority: Composed maintainer. This is the
author's proposed revision, not independent approval or stable promotion.

## Evidence and proposed behaviour

The existing comparison leaves authenticated actor binding and concurrent approved changes open. Revalidation of a clean merge does not prove that anyone approved the actual integrated revision.

All existing source pins were re-fetched unchanged; this is a deliberate refinement of already documented open questions, not a claim of new upstream behaviour.
Read [research](../../research/README.md), its [comparison](../../research/comparison.md)
and the [dated source-impact record](../../research/refresh-2026-11-01.json).
The [exact before/after record](changes.json) identifies every changed clause.
All existing clause identifiers and acceptance cases are retained.

| Changed clause | Planned acceptance |
| --- | --- |
| REQ-GCMS-012 | ACC-GCMS-014 |
| REQ-GCMS-014 | ACC-GCMS-013 |
| REQ-GCMS-015 | ACC-GCMS-013, ACC-GCMS-014 |
| REQ-GCMS-016 | ACC-GCMS-013 |

Acceptance increases from 12 to **14** cases.
The table maps changed clauses only; it is not complete format-0.2 static coverage.

## Compatibility and migration

These stronger obligations and mandatory evidence are conservatively breaking;
the separate proposed version is **1.0.0**, without stable promotion. No format
migration is performed. The 0.1.0 baseline contract and traceability stay
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

New upstream revisions, independent identity architecture assessment, legal-erasure extensions and real host execution remain deferred. Git remains the existing defining product constraint; no host, authentication vendor or signature mechanism is added.
