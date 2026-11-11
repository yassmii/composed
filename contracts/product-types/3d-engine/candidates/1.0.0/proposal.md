# ENG-2026-11 — programmable shading and modern rendering

Date: 2026-11-01. Status: **proposed**, product version **1.0.0**, maturity
**candidate**, format **0.1**. Owner: repository agent. Decision authority:
Composed maintainer. Independent review and stable promotion remain pending.

## Problem and resulting behaviour

The previous candidate offered coherent headless images and strong lifecycle,
agent correction and performance rules, but did not define a material model,
programmable shading or modern rendering capability/quality semantics. A generic
ready graphics program and a shader warmup cost were insufficient product coverage.

The candidate now adds a mandatory PBR/custom-shader/HDR/lighting/shadow baseline
and explicit optional technique profiles. No vendor engine, graphics API, shader
language, visual editor, compiler implementation or asset format is selected.
The earlier lifecycle, correction and performance guarantees remain mandatory.

Ten new primary sources bring the research to **38 sources / 43 observations**.
Read [research comparison](../../research/rendering-comparison.md) and
[rendering profile and controls](rendering-profile.md). Vendor capabilities and
limitations motivate the scope; the stronger guarantees are labelled product
choices in traceability. No shader or rendering benchmark was executed.

## Clause-to-case change map

| Clauses | New obligation / planned evidence |
| --- | --- |
| CAP-3D-005 / REQ-3D-020 | Typed PBR materials, alpha/sampler conventions and isolated instances; ACC-3D-026/028/029. |
| REQ-3D-021 | Custom vertex/surface shading, diagnostics, bounded preparation and atomic ready binding; ACC-3D-027/032. |
| CAP-3D-006 / REQ-3D-022 | Scene-linear HDR and truthful output conversion; ACC-3D-028. |
| REQ-3D-023 | Direct/environment lighting, opaque shadows and declared limits; ACC-3D-029. |
| REQ-3D-024 / POL-3D-005 | Baseline versus advanced support, hardware limits and explicit fallback; ACC-3D-030/032. |
| REQ-3D-025 | Explicit shader time/history, geometry residency and native versus reconstructed rendering; ACC-3D-031/032. |
| QA-3D-007 | Frozen material/colour/spatial/temporal quality controls alongside speed/memory; ACC-3D-026–032. |
| REQ-3D-007/009/010/015 | Material/program/profile round-trip, discovery, inspection and edit integration; ACC-3D-026/027/030 and retained cases. |
| REQ-3D-016/017 | Checkpoint history reset and coherent diagnostic views; ACC-3D-031 and retained cases. |

The suite grows from 25 to **32** cases, with all earlier cases preserved unchanged.
The [exact before/after record](rendering-changes.json) and native impact report
record changed identities; this manual map is not format-0.2 static coverage.
Conditional technique subcases cannot waive baseline shading or opaque diagnostics.

## Compatibility, history and migration

Baseline **0.2.0** contract and traceability remain byte-for-byte unchanged.
The unpromoted **1.0.0 candidate** is explicitly revised at the maintainer's
request; the previous performance-pass contract, traceability, proposal, review,
performance protocol and agent protocol are preserved as **pass-3** history.
Earlier pass-1/pass-2 records remain intact.

Previous contract SHA-256: `2fb66e2aed161b3b43544c7a7b10ab1d7e749674f5b3d3b9acf2bcac76576d68`.
Current contract SHA-256: `52ec015f39a88c0ab86603c362cab6b91b29f167cc3b996734bf8c2bd2e1bdc9`.

New baseline shading and evidence are breaking obligations relative to earlier
bytes. Keeping the provisional candidate number does not transfer proof or rewrite
a consumer pin. Adoption explicitly selects the newly reviewed bytes and runs the
whole applicable 32-case suite, including the earlier performance/correction tests.
The [native rendering-pass impact report](rendering-impact.json) conservatively
selects all format-0.1 clauses/cases and does not decide semantic compatibility.

Review existing scene/material schemas, program bindings, profile identity and
checkpoint metadata before adoption. Shader compilation is asset preparation,
not an edit-set side effect; only ready-program activation is atomic scene editing.
Rollback retains the old pin; implementations assess their own state compatibility.
No Build Kit, consumer repository or other product family is changed.

## Evaluation and exit

Freeze hardware, shader/assets/fixture/checker bytes, colour/model conventions,
quality tolerances, history priming, optional-feature eligibility and finite resource
budgets before confirmation. Use positive and negative images, analytic samples,
metadata and invocation/resource histories; do not substitute an attractive still
for shader failure, temporal quality or real image readiness controls.

The [performance protocol](performance-profile.md) retains reference targets;
compile/variant/priming/residency costs are measured at actual quality rather than
hidden in a warmed result. The [agent comparison](agent-comparison.md) remains its
existing bounded task proposal; rendering controls complement it without inventing
a new comparative score. Every engine/product case remains **not_run**.

Session exit is concrete researched wording, traceability, planned controls,
validation and an author review. Stable promotion needs independent review and a
maintainer decision. Actual shader/render quality, speed and SOTA status are unknown.
