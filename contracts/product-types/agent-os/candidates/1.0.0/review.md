# Author review — agent-os 1.0.0

Date: 2026-11-01. Mode: **author self-review**, not independent review or human
approval. Candidate wording is prepared for independent review; stable promotion
and implementation conformance are unclaimed.

## Scoped findings

- **REQ-AOS-012:** preserve the prior obligation and add its explicitly mapped evidence; review the before/after text in changes.json. Planned controls: ACC-AOS-019, ACC-AOS-020.
- **REQ-AOS-018:** preserve the prior obligation and add its explicitly mapped evidence; review the before/after text in changes.json. Planned controls: ACC-AOS-020.

The baseline checks requests and binds approval to inputs, but does not explicitly locate the last grant check after queue/confirmation waits or bind approval to a changed tool revision and resource scope. These are bounded authority gaps, not observed implementation defects.

Traceability preserves the source-supported pattern and labels the stronger
mandatory guarantees as product choices. No baseline clause or acceptance case
is removed. Existing quantitative budgets are not changed or presented as tested.
No language, framework, host, model vendor or new implementation technology is
mandated. 
## Manual changed-clause evidence map

| Changed clause | Planned acceptance |
| --- | --- |
| REQ-AOS-012 | ACC-AOS-019, ACC-AOS-020 |
| REQ-AOS-018 | ACC-AOS-020 |

This is a map of the changed scope only; unchanged obligations retain their cases
and still require full-suite revalidation on adoption. Optional-module applicability is retained; a conditional not_applicable verdict needs
its declared unmet condition, never an excuse to drop a failure. All 20 product cases
are **not_run**. No fake actor, native runtime, reviewer identity or test execution
is supplied by this document.

New upstream runtime versions, measured fairness and overhead, erasure/retention extensions and independent runtime execution remain deferred. No new timing budget, isolation technology or delegated approval is introduced.

## Validation

Candidate contract SHA-256: `098c6241428f09812ea59215b46e753e59f0ef3c9ace4b26b9ba6df20bb10f40`.
Baseline contract SHA-256: `e9e90d870d4899e089e8e0a6a4925d166592e4d87cc26afff1fc455aad98b12f`.
Baseline traceability SHA-256: `067182369a3340e85ba1bad86cc2027129622f9e403367b4c65345b50cc8e5d1`.

Observed structural, regression, impact and baseline-preservation results are
recorded in the [batch validation](../../../../docs/contract-updates-2026-11-01.md).
Candidate readiness is a specification review status, not product proof.

Observed: native schema/traceability validation passed; all 68 tooling regression
tests and the synthetic example passed. The [native impact report](impact.json)
selects 20 cases, with format-0.1 targeted coverage unknown, semantic
compatibility not_assessed and proof transfer not_performed. Baseline and candidate
fingerprints were checked against changes.json and the impact report.
All 20 product cases remain not_run; source freshness is the earlier scoped
research result, with the documented Adobe retrieval limitations.
