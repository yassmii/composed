# Performance research — 2026-11-01

Third pass: six new official sources, bringing active research to **28 sources and
33 observations**. Questions concern valid measurement boundaries, first-use work,
responsiveness under load and memory/scalability evidence. These sources explain
mechanisms and limitations, not the speed of Composed. No engine was benchmarked.

| Observation | Source and locator | Fact / implication limit |
| --- | --- | --- |
| OBS-3D-027 | Godot General optimization tips, CPU/GPU bottlenecks and measuring | CPU and GPU work independently; CPU optimisation may leave a GPU-bound frame unchanged. This does not prescribe a threading model or validate a frame-time target. |
| OBS-3D-028 | Unity 6000.0 Frame timing manager introduction, limitations | Timing results arrive after later frames and can be unavailable/inaccurate. Counters must be correlated; no universal three/four-frame latency is inferred for another runtime. |
| OBS-3D-029 | Unity 6000.0 AsyncGPUReadback, Description | Avoiding CPU/GPU stalls can still add frames of latency. Nonblocking APIs do not prove that an agent already has an image. |
| OBS-3D-030 | Unreal performance profiling introduction, profiling tools | Profiling itself changes performance; target-device bottlenecks differ. No fixed overhead subtraction or vendor-independent latency number follows. |
| OBS-3D-031 | Unity 6000.0 ShaderVariantCollection.WarmUp, Remarks | Changed vertex/render-target state may still require driver work after prewarming. A warm-up call is not proof of universal cold-start coverage. |
| OBS-3D-032 | Khronos timestamp-query sample, support checks and delta conversion | Timestamp support, valid bits and device period govern meaning. This does not require Vulkan or make device timestamps directly comparable with a host clock. |
| OBS-3D-033 | Same sample, query-result retrieval/availability | Query results are asynchronous; availability must be handled. Missing timing cannot honestly be reported as zero GPU work. |

Exact URLs, versions/dates, locators and reviewed hashes are in sources.yaml. The
sources are first-party documentation, not runtime experiments. Unity pages are
versioned 6000.0, Unreal metadata identifies 5.8, Godot's stable and Khronos's latest
sample are live aliases. All six use the existing html_article_text normalization;
no long third-party contents are committed. The initially attempted Vulkan Guide
timestamp URL returned 404; only the successfully retrieved official sample enters
the active manifest. Earlier source hashes are preserved and unchanged.

## Convergence, divergence and explicit decisions

The narrow multi-product pattern is to measure the relevant bottleneck on target
hardware rather than infer end-to-end speed from one component. Timing availability,
GPU/CPU overlap, readback and first-use effects differ. No source establishes that
60 FPS, 16.7ms median, one screenshot time or a five-step cap is a universal SOTA
threshold. The old reference targets remain **product choices**, not research facts.

Candidate REQ-3D-018 deliberately adds finite admission/deadline semantics and usable
control operations during saturation. REQ-3D-019 adds correlated measurement records,
valid clocks/boundaries and unknown-sample handling. QA-3D-001 is strengthened from
median-only reporting to completed throughput plus tail/max/excursion budgets.
QA-3D-005/006 and POL-3D-004 require response, capacity, memory and recovery evidence
under frozen workloads without hidden quality reduction or missing failures.
These are justified product decisions, not claims that the reference engines
already implement the same guarantees or that Composed is faster.

The [performance protocol](../candidates/1.0.0/performance-profile.md) defines seven
planned workload/control groups. Concrete hardware/workloads and positive finite
latency/tail/capacity budgets must be chosen before confirmation. Until instantiated
and executed, performance readiness is unknown. Mandatory supported-throughput and
rejection budgets prevent an implementation from looking fast by rejecting all work.
Neither arbitrary request counts nor unknown GPU counters establish efficiency.

## Deferred questions

What actual device tiers, scene complexity and image-channel sizes should be
supported? What command and image-ready latency budgets make the intended agent
workflow useful? How much do data transfer, encoding, external asset I/O and model
reasoning dominate a complete task? Which tail targets remain feasible at the
required visual fidelity? These are workload/device choices and hypotheses to
confirm, not permission to relabel missing values as passed.

Device-loss recovery, general process-crash resilience, API-specific optimisation
and energy consumption are not silently added to the core. An implementation can
choose any stack or profiling mechanism that provides valid applicable evidence.
