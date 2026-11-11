# Performance envelopes and confirmation protocol — proposal v1

Scope: runtime frame pacing, agent command and image latency, asset/first-use work,
bounded saturation, checkpoint/diagnostic memory and safe retirement/recovery.
No actual engine/hardware profile, benchmark result or performance superiority is
established here. This protocol must be instantiated before performance can pass.
Retained targets are **at least 60 completed frames/s** and **median completed-frame
interval at most 16.7ms** for the reference case; no newly invented latency value is
presented as a validated standard. New latency/tail/capacity budgets are mandatory
profile inputs, not universal timings guessed without hardware or a workload.

## Freeze before confirmation

A profile is complete only when each following field is concrete and versioned:

| Field group | Required definition |
| --- | --- |
| Identity | Contract exact bytes; engine/build, bridge, hardware/driver/OS, assets and fixture/scorer versions; instrumentation and timestamp capabilities. |
| Output/work | Logical and visible node/triangle counts, material/shader/texture load, light count, resolution, camera/view/channel count, quality/tolerance and adaptive-policy settings. Optimisation implementation remains free; hidden omission or degraded output cannot earn a pass. |
| Timing boundary | Frame completion/presentation boundary; command receipt, acknowledgement, state commit and complete image readiness; queueing and retrieval inclusion. Model generation and bridge/network/external I/O are separate labelled phases, not silently subtracted. |
| Clock/sample | Host monotonic clock and resolution, GPU domain/units/calibration/validity where available, frame/operation IDs, delayed-result correlation, sampling window, raw-record references, quantile method and censoring policy. Never subtract uncalibrated clocks or sum overlapping CPU/GPU phases. |
| State | Cold/cache-reset procedure, shader/pipeline coverage, first-use workload, warm-up duration and stop rule, pacing/VSync/queue depth, power/thermal settings where observable, background load and instrumentation mode. A prewarm call is not proof all first-use work disappeared. |
| Load | Scene-size points, offered operation mix/rate/burst shape, batch size, concurrency and finite admission/in-flight cap. Keep request granularity visible across bridges. |
| Budgets | Positive finite p95/p99/max frame-interval limits; acknowledgement/result/image-ready and saturated-control limits; completion deadlines; recovery limit; positive minimum successful completion throughput and finite allowed rejection/failure rates per supported point; host/device and cache ceilings. Empty/unknown/TBD/disabled values cannot pass. |
| Run design | Repetition count, fixed timed duration, cache/thermal reset between independent trials, order randomisation/pairing, interruption rules and all retained trials. A declared over-limit point is a separate negative case, not a supported capacity claim. |
| Memory | Engine-owned allocation categories, process/driver estimates, accounting precision, peak sampling, shared backing, retained caches and pending retirement; cycle count, quiescence criterion and maximum observation/recovery time. |

No profile can relax the retained reference thresholds, remove an existing integrity
invariant, silently change output quality or redefine queue admission as completion.
Actual product threshold values beyond the retained reference pair remain unset in
this repository pass. This makes performance readiness **unknown**, not compliant.
Profile authors must justify their supported workload and targets; passing a weak
profile never establishes a broad SOTA claim under POL-3D-003.

## Measurement and reporting

Use a 60-second timed reference window after the frozen warm-up, preserving the
existing ACC-3D-003 duration. Count completions within the declared window, report
boundary/drain treatment for work spanning it, and retain frame intervals and all
long stalls. Record cold/startup/first-ready/image-ready work separately rather than
warming it out of existence. Do not pool distinct trials or cold/warm populations
into a flattering quantile. Disclose repeated-run variation and instrumentation
baseline/control overhead; do not subtract an assumed profiler cost.

Report completed throughput as actual completions per elapsed monotonic time, with
queue/admission counts separate. For each operation class report offered, admitted,
rejected, started, committed, ready, failed, expired and still-pending work and their
denominators. Successful-operation latency quantiles must be labelled conditional
and accompanied by all failures/censored observations. Timeouts are right-censored
or deadline violations, not missing successes to discard. Insufficient samples do
not justify a population tail guarantee. Keep maxima, budget-excursion counts and
sample sizes alongside p50/p95/p99; even p99 can miss a rare severe stall.

Image-ready latency ends only when all promised output channels/data or managed
artifacts can actually be retrieved. CPU submission, a GPU timestamp and tool
acknowledgement have different boundaries. Separate queueing, preparation, graphics,
readback, encoding and delivery where observable, and mark unobservable components
unknown. Their overlap means their durations need not sum to wall time.
GPU result unavailability is not zero execution time; invalid/unavailable counters
cannot replace host-observed completion. GPU counters may be optional instrumentation,
but required end-to-end/throughput/budget evidence is not optional.

## Planned workloads and negative controls

These original workload descriptions require actual schema-valid fixtures and an
implementation adapter before execution. All are **not_run** in this session.

| Case | Workload and observations | Failure/measurement control |
| --- | --- | --- |
| PF-01 / ACC-3D-003/021 | Frozen real-time reference with completed-frame timing and fixed visual/state checks; separate CPU/GPU diagnostics where valid. | Reject a median-only pass, submission-count throughput, dropped long intervals or changed pacing/quality. |
| PF-02 / ACC-3D-024 | Cold asset/pipeline/texture work, first ready asset, first complete RGB/depth/entity result, then warmed repeats. | Delayed readback/retrieval must remain inside image-ready latency; a warm result cannot be labelled cold. |
| PF-03 / ACC-3D-022 | Agent inspection, preview/edit, checkpoint restore and diagnostic requests under a supported load, then an admission-cap burst. | Bound queueing and preserve timely status/closure. Fast reject-all or expire-all fails the supported completion-throughput/rejection budgets. |
| PF-04 / ACC-3D-022/024 | Delayed asset/GPU work concurrent with edits and deadline expiry; correlate operation, frame and revision. | No commit or image success after logical pre-publication expiry; already committed work is not falsely rolled back because its reply is late. |
| PF-05 / ACC-3D-023 | Independent sweeps of visible/logical scene complexity, geometry/texture pressure, image resolution/views/channels and command rate, plus combined declared points. | Preserve output, expose bottleneck/unknown counters and report every point; do not infer scalability from one tiny scene or only one scaling dimension. |
| PF-06 / ACC-3D-025 | Repeated create/load/edit/checkpoint/multi-view/close cycles, delayed retirement, bounded reusable caches, injected cleanup failure and overload recovery. | Resource ledger must not hide ownership growth as cache. Process RSS or driver-resident memory alone does not prove a leak or successful reclamation. Missing quiescence is incomplete, not success. |
| PF-07 / ACC-3D-021 | Known arithmetic and reporting controls, independent from real engine timing. | For 99 intervals of 10ms and one of 1010ms, total is 2000ms: 100 completed frames/2s = 50 FPS while the median is 10ms. Nearest-rank p95/p99 are still 10ms; max 1010ms and the excursion count expose the stall. This defeats both median-only and tail-only cherry-picking. |

Additional report controls: unavailable GPU samples (unknown, never zero); a delayed
sample attached to the wrong frame; CPU and GPU each 8ms overlapping in a 9ms host
interval (do not invent 16ms end-to-end); missing profile budgets; post-hoc resolution
reduction; uncounted checkpoint/diagnostic memory; a completion reported only after
a client timeout despite an earlier confirmed commit. Controls are expected outcomes,
not an assertion that a checker or engine has executed them here.

## Acceptance and comparison

Within each supported point, the frame, response, successful throughput, rejection,
memory and recovery budgets all apply. Hard correctness/access/lifecycle failures
remain failures regardless of speed. Over-limit tests are expected to demonstrate
safe bounded backpressure, not to meet supported-load throughput. Cold, warmed,
interactive, offscreen, instrumented and uninstrumented results are separately
labelled strata. Retain all repetitions and exact trial denominators.

For comparative claims use the agent-comparison protocol's matching and uncertainty
rules. Same-quality workloads, matched assets and disclosed backend/adapter support
are prerequisites; generic frame-rate or batch marketing numbers cannot stand in
for executed matched measurements. This document is a measurement/acceptance design,
not an implementation prescription or a measured performance advantage.
