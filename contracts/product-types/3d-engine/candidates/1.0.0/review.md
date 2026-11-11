# Author review — shader and modern rendering pass

Date: 2026-11-01. Verdict: **candidate prepared for independent review**. This
is author self-review, not independent approval, human acceptance or engine proof.
Prior performance-pass artifacts are preserved as pass-3 history.

## Findings and resolutions

- **REQ-3D-020:** define the PBR baseline rather than assume all graphics programs
  share a material model. Conventions, alpha and typed parameters are explicit;
  a shared instance edit cannot mutate other users. HDR emission is not capped
  implicitly by a reference file format's defaults.
- **REQ-3D-021 / REQ-3D-004/015:** failed shader replacement must preserve the old
  valid binding, but an explicitly requested failed program cannot render a
  successful fallback image. Preparation is separate from atomic ready activation.
  A good replacement and negative build/interface/root/stale/closure controls
  are required. No safe execution of arbitrary untrusted GPU binaries is claimed.
- **REQ-3D-022/023:** numeric textures are not colour-decoded; above-white HDR is
  checked before output transformation. Emission and GI are distinct. Output
  metadata, actual light/shadow images and encoding errors are observable.
- **REQ-3D-024 / POL-3D-005:** technique support is not a marketing checklist.
  Requested/effective settings and hardware/content limits must agree with execution.
  Unavailable features fail unless an explicit named fallback was accepted. Optional
  advanced techniques do not make the mandatory baseline optional. No proprietary
  renderer, graphics API, shader language or universal algorithm is prescribed.
- **REQ-3D-025 / REQ-3D-016/017:** shader time need not equal scene pause in vendor
  products. Reference runs therefore fix time and reset/prime temporal history;
  cameras cannot reuse one another's history. Checkpoints preserve logical
  material/profile state, not compiled handles or hidden accumulated history.
  Required opaque depth/entity diagnostics remain real and aligned, including
  supported vertex deformation. No cross-platform bit-identical image promise.
- **QA-3D-007 / existing performance rules:** quality, compile/first-use cost,
  convergence, residency and completed requested render throughput are distinct.
  Lower internal resolution, fake frames, dropped samples or hidden cache growth
  cannot establish the prior performance target. Every advertised optional
  technique needs applicable positive and failure/quality controls.
- **Provenance and compatibility:** ten new sources and ten atomic observations;
  facts are separated from stronger choices. The baseline and all 25 prior cases
  remain unchanged. The revisable 1.0.0 candidate keeps format 0.1; no stable
  promotion, proof transfer or implicit consumer adoption.

## Planned evidence and limits

The [proposal map](proposal.md#clause-to-case-change-map) links all additions and
integration edits to seven new cases and retained cases. The detailed
[rendering protocol](rendering-profile.md) has seven fixture/control groups and a
technique matrix. This is manual intended coverage, not static 0.2 verification.
All **32 engine cases are not_run**; no compiler, GPU, concrete image fixtures,
scorer tolerances or hardware profile were executed. The glTF source is a colour/
material semantic reference, not a new required interchange implementation.

## Observed verification

Environment: existing Linux Node 24.15.0 and checkout dependencies, no install.

| Check | Observed result |
| --- | --- |
| `npm run validate:contracts` | Exit 0: all baseline/candidate schemas and traceability, including the expanded 3D candidate. |
| `npm run test:contracts` | Exit 0: 68 tooling tests pass; no renderer or shader tested. |
| `npm run example:contracts` | Exit 0: synthetic reference accepted, semantic counterexample rejected, changed checker stale and dependent cases selected. |
| Native source-content review for 3d-engine and candidate traceability | All 38 active source bodies retrieved and hashes matched; no baseline/candidate traceability errors. Other families were not re-fetched in this scoped pass. |
| Native comparison from pass-3 to current candidate | Assessed; REQ-3D-020–025, QA-3D-007 and POL-3D-005 added; none removed. All 32 cases conservatively selected, targeted format-0.1 coverage unknown, compatibility not_assessed by tool, proof_transfer not_performed. See rendering-impact.json. |
| Preservation and fingerprints | Baseline contract/traceability and all six pass-3 snapshots match prior tracked bytes (eight files). All 25 prior cases, 28 prior source records and 33 prior observations are unchanged; current candidate/change/impact hashes agree. |
| Document links / whitespace | 23 local links resolve; `git diff --check` passes. |

Ready shader assets and prewarming do not promise that all later driver/pipeline
first-use work has disappeared; its actual cost remains in cold/warm measurements.
The planned material, colour and temporal scorer controls were not executed on an
engine. Concrete fixtures, tolerances, device profiles and actual results remain
unknown. Earlier global source failures outside 3D are not reassessed here.
Raw third-party bodies and temporary research scripts/logs remain outside Git.

Current candidate SHA-256: `52ec015f39a88c0ab86603c362cab6b91b29f167cc3b996734bf8c2bd2e1bdc9`.
Previous performance-pass SHA-256: `2fb66e2aed161b3b43544c7a7b10ab1d7e749674f5b3d3b9acf2bcac76576d68`.

Independent review and a recorded maintainer decision remain required before
stable promotion. No commit, push, deployment or consumer implementation change.
