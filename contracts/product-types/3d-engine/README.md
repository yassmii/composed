# Real-time 3D Engine

Current canonical version: **1.0.0**, maturity **candidate**. The maintainer
requested integration on 2026-11-01. Read [contracts/contract.yaml](contracts/contract.yaml),
[traceability](contracts/traceability.yaml) and the [current review](contracts/review.md).
The previous 0.2.0 package is preserved under [history/0.2.0/](history/0.2.0/README.md).
Candidate authoring records below remain historical; independent review/stable
promotion and implementation acceptance remain pending.


The [shader/rendering pass](research/rendering-comparison.md) brings the current
candidate to **32 acceptance scenarios**, with explicit PBR materials, programmable
vertex/surface shaders, HDR/colour management, lighting and shadows. Its
[rendering profile](candidates/1.0.0/rendering-profile.md) covers optional GI,
reflections/ray tracing, temporal reconstruction, geometry detail/streaming,
volumetrics and compute, with capability limits and planned quality controls.
The prior performance-pass candidate is preserved as pass-3 history. Research
now contains 38 primary sources and 43 observations; no renderer was executed.

The existing [0.2.0 baseline](history/0.2.0/contracts/contract.yaml) and its
[traceability](history/0.2.0/contracts/traceability.yaml) are preserved byte-for-byte. The
[1.0.0 candidate](candidates/1.0.0/contracts/contract.yaml) is a separately stored,
breaking proposal with status **candidate**, ready for independent review.
Both contracts retain format **0.1**. Neither status establishes engine conformance.

Read the refreshed [research](research/README.md), [comparison](research/comparison.md),
[proposal and migration impact](candidates/1.0.0/proposal.md), and
[author review and verification](candidates/1.0.0/review.md). Candidate traceability
uses this family's shared research and the existing native checks.

The candidate strengthens asynchronous failure, closure/retirement, overload and
coherent-rendering behaviour while preserving agent discovery, declarative scenes,
inspection, deterministic stepping and file/resource boundaries. No language,
graphics API, engine vendor, asset format or implementation transport is selected.

Stable promotion requires independent review and a recorded maintainer decision.
Consumer adoption requires an explicit new pin and revalidation against the new
bytes; historical evidence and the separate implementation project's decisions do not
transfer automatically. No consumer repository is changed by this pass.

The [second-pass comparison](research/agent-comparison.md) distinguishes competitive
ambition from documented features and measured outcomes. The second pass
added revision-aware edit sets, checkpoints and aligned visual diagnostics, with
20 acceptance scenarios at that stage and a [planned eight-task agent evaluation](candidates/1.0.0/agent-comparison.md).
SOTA/best-of-breed status is **not established**. First-pass candidate bytes are
retained under candidates/1.0.0/history/; adoption always uses exact reviewed bytes.

The [performance pass](research/performance-comparison.md) brought the candidate
to 25 acceptance scenarios at that stage. Its [performance-envelope protocol](candidates/1.0.0/performance-profile.md)
requires completed-frame throughput, tail/max intervals, end-to-end response/image
latency, bounded saturation and memory/recovery evidence at frozen quality.
Concrete hardware, workload and new SLO budgets remain to be instantiated; no
performance result is claimed. The pre-performance candidate is retained as pass-2
history and previous byte pins do not transfer.
