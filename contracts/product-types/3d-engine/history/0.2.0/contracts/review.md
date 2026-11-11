# Review: initial research revision

Status: **accepted as a draft, not ready for promotion**.

- Traceability covers every capability, requirement, invariant, policy, and quality attribute.
- The hierarchy contract is supported by Godot, Unity, and Unreal observations without adopting their incompatible object models.
- Resource lifecycle, fixed-step scheduling, performance targets, and error fallback remain explicit project choices.
- No language, framework, database, cloud provider, graphics API, or vendor is prescribed.

Before promotion, add source evidence for resource destruction, rendering lifecycle, and simulation scheduling across more than one engine.

Live snapshot verification currently detects a changing response body for the Unreal documentation source. Record an immutable archive before treating this evidence as promotion-grade.

## 0.2.0 agent-control revision — 2026-10-08

Status: **draft; awaiting human checkpoint 1; not ready for promotion**.

- Applied the user-approved draft using contract-author, then contract-reviewer.
- CAP-3D-004 declares ACT-AI-AGENT and REQ-3D-007 through REQ-3D-013.
- ACC-3D-004 through ACC-3D-010 provide the respective acceptance scenarios.
- All new capability, requirement and acceptance links are explicit_project_choice
  with no research observations. The new glossary definitions support these choices.
- MINOR adds agent-facing behaviour. Existing capabilities, requirements, invariants,
  policies, quality attributes, integration and acceptance scenarios are preserved.
- No implementation language, graphics API, exchange encoding, agent transport or
  hardware profile has been selected. engine.physics and engine.editor remain future extensions.
- Published equality rules must make REQ-3D-007 / QA-3D-003 comparisons reproducible;
  scene identifiers are preserved across import and runtime handles are excluded.
- REQ-3D-011 separates explicit stepping limits from the five-step real-time
  catch-up cap. REQ-3D-012 preserves readiness and graphics startup requirements.
- The author check is self-review, not an independent verdict. Independent review
  and exact validation output are recorded in the work item linked below.

### Unresolved choices and promotion limits

- MET-3D-001 / QA-3D-001: target hardware is undefined; benchmark performance is unproven.
- REQ-3D-004 / ACC-3D-002: documented fallback versus controlled error remains unselected.
- POL-3D-002: the open interchange format and its namespaced extension remain unselected.
- Research remains initial: multi-engine evidence for destruction, rendering lifecycle
  and scheduling, plus an immutable Unreal source archive, are still needed.
- research/README.md says research has not started, whereas sources.yaml and
  observations.yaml contain initial research. This existing inconsistency is recorded,
  not silently resolved by this contract change.
- Structural validation does not demonstrate runtime acceptance. No engine has been
  implemented; no benchmark, image comparison, resource test or agent demonstration has run.

Evidence and next owner: [phase-A handoff](../../../../.agents/work/contract-3d-agent-v0.2/handoff.md).
