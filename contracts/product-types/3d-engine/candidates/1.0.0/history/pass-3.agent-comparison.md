# Agent scene-correction evaluation — proposed protocol v1

Scope: bounded assembly, inspection and correction of scenes from supplied assets.
This is a **planned, unexecuted** comparison, not a benchmark result or an external
validation-runner implementation. It does not evaluate sculpting, rigging, arbitrary
media reconstruction, photorealistic rendering leadership or model creation.
Freeze this file's exact hash and instantiated fixtures in the run profile before
confirmation. Changes create a new corpus revision; do not tune on held-out results.

## Configurations and eligibility

Compare an identified Composed implementation with pinned Blender + MCP for Blender
and Unity + MCP for Unity configurations where the task is supported. The source
revisions in research/sources.yaml identify documentary candidates, not installed
binaries or successful runs. Record engine/build, bridge, plugins, asset digests,
model/version, agent instructions, tool descriptions, hardware/driver, runtime,
permissions, renderer and cold/warm start policy. Keep the same agent/model and task
information across paired runs. Do not silently replace a model for one backend.

Use a scripted reference implementation or manual oracle only as a **control**, not
an autonomous-agent competitor. OpenUSD and Replicator supply design patterns;
neither is automatically an end-to-end agent baseline. Public research benchmarks
are methodological references, not scores earned by this corpus or engine.

Classify each backend/task pairing before runs as supported, unsupported or unknown.
Record native support vs adapter-provided support and adapter revision. A wrapper
that implements checkpoints or transactions cannot be counted as native backend
support. Provide separate matched-capability results and a capability-gap table;
unsupported tasks are not hidden and are not silently scored as bad image quality.
A capability missing from Composed's required scope is a conformance gap even if
outside the matched ranking. Native interactive editor requirements and no-display
requirements are different evaluation strata; do not conflate their latency.

## Budget and controls

Proposed research budget: three paired trials per eligible task/configuration with
seeds 17, 29 and 43. These are chosen trial settings, not validated product targets.
Each trial has a 120-second monotonic wall-clock cap, 40 agent-to-tool requests,
eight rendered camera views and 12,000 cumulative model tokens where measurable.
Pin exact accounting before the run; unobservable usage is unknown, not zero. A
multi-view request consumes one request and all returned views count against eight.
Record primitive edits and batch sizes separately when observable. Arbitrary-code
and typed-command requests have different granularity: request count alone cannot
establish efficiency. Budget changes require another labelled profile, not retries
until a successful trial appears. Cold start and warmed execution are separate.

Publish input state, permitted assets, task wording, cameras, tolerances, rubric,
scoring/checker revision and budget before confirmation. Use supplied unit-cube and
plane mesh assets with fixed digests under each backend's allowed root; those
fixtures are prepared for the actual implementation's declared schema, not guessed
from this technology-neutral contract. Do not download unlicensed assets or copy
benchmark datasets without their terms. Local tasks below are original descriptions.
The profile must instantiate schemas and exact fixture bytes before any run; until
then the protocol is not runnable and all outcomes stay not_run.

| ID | Frozen task intent / fixture | Required outcomes and negative control |
| --- | --- | --- |
| AG-01 | Discover and assemble a floor, parent P and three supplied unit cubes A/B/C at distinct declared transforms, plus two cameras and a light. | Schema-valid export, known hierarchy/world transforms and two matching views. A scripted correct scene is the positive control; an empty scene cannot pass. |
| AG-02 | P is translated by (2,0,0); A has local (0,0,0), B (0,1,0), C (0,-1,0). Correct A's world centre to (3,0,0); preserve P, B/C, bindings, light and cameras. | Expected A local centre (1,0,0), unchanged protected state and two-view placement rubric. A visually plausible edit to P moving all cubes fails preservation. |
| AG-03 | Two editors read revision R; the second commits a B-only edit before the agent submits its R-based A-only edit. | Stale edit is rejected without losing B; re-inspection and an explicitly revised A edit succeed. An older snapshot overwriting B is a hard integrity failure. |
| AG-04 | A previewed edit set contains a valid A transform followed by a cycle-producing final edit. | Preview/state unchanged, indexed error, no partial A edit, no cycle. A fail-fast batch that retains earlier mutations does not satisfy atomicity. |
| AG-05 | Checkpoint a paused seeded scene, apply an incorrect A edit, restore, then advance the same ordered input sequence. | Fresh revision with checkpoint reference equality and random-state continuation; changed asset content or a released checkpoint fails without altering current reference state. |
| AG-06 | Two opaque cubes have analytically known camera-distance order and partial occlusion; use a front camera and an oblique second camera. | RGB/depth/entity channels align and identify visible stable nodes and background. A front-only image hiding wrong depth, swapped node labels or a renderer-ID-only map fails. Camera matrices and expected pixel regions are frozen in the profile. |
| AG-07 | Request an edit/checkpoint/diagnostic allocation exceeding a deliberately small declared budget. | Structured limit error, no published partial edit or silently omitted view, charged pending memory and usable inspection/closure. A crash or outside-root access is a hard failure. |
| AG-08 | From a supplied wrong placement and colour in an otherwise valid scene, discover, inspect, checkpoint, preview, correct and verify both views; recover a deliberately unsuccessful edit. | Structural and independent visual rubrics both pass, protected entities remain intact, recovery is recorded, and no hidden human editing occurs. An export-only or successful-tool-return-only transcript is insufficient. |

AG-08 is a composite final task, not a replacement for isolated failure controls.
Freeze distinct held-out placements, colours and camera poses before tuning the agent;
record those fixture hashes and use both the simple reference and semantic mutants
to validate each scorer. None of these controls has been executed here.

## Scoring and claim rule

Record every planned pairing and trial, including failed, unsupported, blocked,
interrupted and not_run. Report eligible population and original denominators.
Keep these axes separate:

- Functional completion: independently checked required predicates and actual output.
- Structural correctness/preservation: hierarchy, transforms, identity, seeded state,
  no lost edit, no partial publication and no boundary violation.
- Visual instruction compliance: per-view binary rubric with preset tolerances;
  aesthetic judgement, if used, is separate and independently reviewed/blinded.
- Recovery: safe failed-edit handling and reference restoration, not just a success flag.
- Resource use: monotonic time, requests, primitive/batch counts, rendered views,
  memory and observed model/renderer usage/cost; absent measurements stay unknown.
- Interventions and reproducibility: human help, configuration differences, retries
  and paired-seed variance. A helper's manual edit disqualifies autonomous success.

Use independent geometric/state checks where possible; a model judge alone is not
a state-integrity oracle. Report per-task results and paired differences with sample
size and uncertainty. Three trials are a bounded pilot, not a population-wide or
statistical-power guarantee. No universal aggregate weighting or improvement margin
is invented here. Any later superiority hypothesis, primary metric, non-regression
bounds and uncertainty criterion must be preregistered before its confirmation runs.
Post-hoc observations remain exploratory and cannot be relabelled confirmation.

Current verdict: **comparative status unknown; all AG-01–08 and ACC-3D-016–020
not_run**. Publication as SOTA/best-of-breed is unsupported. A later result may only
claim a dated advantage on its eligible tasks and measured axes under its profile.

## Performance boundary

Use [performance envelopes](performance-profile.md) for frame and command/image
latency, saturation and memory evaluation. The trial caps above bound this agent
experiment; they are not runtime responsiveness SLOs. Report model/bridge and engine
phases separately where observable, preserving the measured end-to-end task cost.
Do not infer a faster engine from fewer tool requests or a GPU-only timing.
