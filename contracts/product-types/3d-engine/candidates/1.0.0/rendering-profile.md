# Rendering profile and planned quality protocol

Date: 2026-11-01. Status: proposed, **not_run**. This document accompanies
REQ-3D-020–025, QA-3D-007 and ACC-3D-026–032. It does not implement a renderer,
provide gold images or instantiate hardware-specific performance budgets.

## Required material and shader baseline

| Area | Required observable behaviour |
| --- | --- |
| PBR material | Base colour, metallic/roughness, normal, AO and HDR emission; opaque/cutout/blend; declared sidedness, texture coordinates, samplers and data conventions. |
| Instance editing | Typed discoverable parameters; independent overrides for two users of a shared material; state-preserving rejection of invalid updates. |
| Programmable shading | Documented vertex and surface/fragment representation; reflection, correlated preparation/errors and atomic ready-program binding. No mandated language or node editor. |
| Colour | Scene-linear HDR before output transformation, colour/data texture separation, declared exposure/tone map/primaries/transfer/alpha and a testable linear sample boundary. |
| Lighting/shadows | Directional and point lights, environment diffuse/specular response, opaque shadow casting/receiving, declared units/coverage/filtering/bias and finite limits. |
| Agent workflow | Discover, prepare, inspect, bind, edit, export/import and recover the same material/profile state through structured operations. |

The built-in PBR path is a documented model, not a claim that every arbitrary
custom shader is physically correct. No fixed BRDF implementation, texture pack,
shader compiler or interchange file format is selected.

## Modern technique matrix

Each implementation publishes actual support, prerequisites, limits and exclusions
for these families. Technique names below are categories or illustrative methods,
not a requirement to reproduce a vendor implementation.

| Family | Parameters/limits to declare when available | Evidence before a verified claim |
| --- | --- | --- |
| Many-light paths: clustered/tiled forward, deferred or documented alternative | Light/shadow/visibility bounds and supported material modes. | More than one light, occlusion/shadows, saturation and the declared per-view limits. |
| Ambient occlusion | Source, radius/units, sample/noise/filtering and edge handling. | Contact/edge controls plus disabled reference; no claim of full GI from AO alone. |
| Global illumination | Baked/dynamic, probe/voxel/screen/ray-based or other method, update/convergence, content restrictions. | Indirect-lit room, moved light/occluder, emissive-only and missing-coverage controls. |
| Reflections and ray tracing | Screen/offscreen coverage, software/hardware prerequisites, surface support, denoising/samples. | Offscreen/disoccluded object and material controls; missing hardware and unsupported surfaces stay visible. |
| Temporal AA/upscaling | Internal/output resolution, sample time, jitter, history, motion inputs, reset/priming and convergence. | Static detail, moving/deforming geometry, camera cuts and disocclusion; ghosting/blur measured separately from frame time. |
| Instancing, culling, LOD and streamed/virtualised geometry | Instance/detail/residency bounds, visibility policy, transition/error tolerance, streaming memory. | Camera sweep, fine geometry, occlusion and cold/missing residency with unchanged scene identity. |
| Volumetrics and compute-driven rendering | Inputs/outputs, dispatch/work limits, stage dependencies, supported drivers and memory. | Completion/readback correlation, correct image contribution, over-budget work, recovery and retirement. |
| Advanced materials: clearcoat, transmission, anisotropy, displacement or other models | Supported parameters, surface/diagnostic limits and profile compatibility. | Model-specific reference/negative images; geometry changes agree with depth/entity diagnostic semantics. |

Every family must have an explicit status; unsupported is a valid status for an
optional family. A positive feature claim requires its applicable controls. Core
PBR/shader/HDR/direct-light/shadow controls are always required. An unavailable
technique request fails unless the caller explicitly accepted a named alternative;
the image reports requested and effective settings. Selecting a lower-quality
profile after seeing timing results is not a performance pass.

Hardware mesh-shader stages, virtualised geometry and GPU-driven visibility are
different capabilities; one label cannot prove all three. Ray tracing is a method,
not a promise of path-traced ground truth or an immunity to missing data/noise.

## Freeze before execution

Record exact contract/engine/driver/hardware/graphics-profile identities, shader
source and transitive include contents, prepared variants, material/texture/mesh
contents, colour pipeline, camera paths, scene/sample times, random seeds,
resolution/channels, optional features and fallback permissions. Freeze checker
bytes, image/geometry/colour tolerances, history reset/priming and all quality
thresholds before confirmation. Missing required values make readiness unknown.

Use numeric/analytic colour and geometry controls alongside images; tone mapping
can hide double decoding or clipped HDR. Compare linear samples at the declared
boundary and final display-encoded values at their actual encoding. Ground truth,
normal orientation, alpha edges and supported shadow coverage must be explicit.
Cross-engine screenshots are not pixel-equal truth unless a compatible model,
exposure and comparison procedure have actually been established.

## Seven fixture/control groups

| Group | Cases / controls | Planned outcomes |
| --- | --- | --- |
| RQ-01 Materials and state | ACC-3D-026: metallic/roughness swatches, normal/AO/emission changes, alpha modes, two shared instances, invalid types and round-trip. | Actual model response, isolated edits and preserved logical state; no silent parameter fallback. |
| RQ-02 Program preparation | ACC-3D-027: valid vertex displacement/surface shading; syntax/type/interface errors; forbidden include; stale activation; close during build. | Correct rendered changes and diagnostics; prior good state survives failure; required failed program cannot render as success. |
| RQ-03 Colour/HDR | ACC-3D-028: analytic colour swatches, numeric textures, above-white emission, output transforms and unsupported encoding. | Declared tolerance at linear and display boundaries, truthful encoding metadata and no early HDR clipping. |
| RQ-04 Lighting/shadows | ACC-3D-029: direct/environment response, opaque occluder/receiver and emission without GI. | Declared shadow coverage and lighting behaviour; emission is not silently called GI. |
| RQ-05 Feature negotiation | ACC-3D-030: actual baseline, absent optional feature/hardware and explicit fallback. | Baseline really renders; availability and requested/effective profiles match reality. |
| RQ-06 Temporal/reference state | ACC-3D-031: paused wall-clock waits, two views, camera cut, deformation, shader change and checkpoint restore. | Explicit sample time and clean-history behaviour; diagnostic alignment and no simulation advance. Temporal feature subcases are conditional. |
| RQ-07 Resource and performance | ACC-3D-032 plus ACC-3D-021–025: cold/warm variants, variant overflow, compute/geometry residency if advertised, saturation and closure. | Frozen quality and actual image readiness, finite caches/queues, counted memory/retirement and separated first-use costs. |

Run positive and negative controls. The entire pre-rendering 25-case suite stays
required under its existing conditions. A conditional subcase is not_applicable
only with a published unmet capability condition; failure and not_run cannot be
renamed not_applicable. In particular, absence of temporal upscaling cannot skip
baseline time/view isolation or make compile/colour/shadow controls optional.

## Measurement and decision

Use the existing [performance envelope](performance-profile.md) without relaxing
its reference budgets or quality floors. Attribute shader compilation, pipeline
creation, variant/cache warming, geometry/texture preparation, temporal priming,
GPU completion and readback to their actual populations. Cold complete-image time
includes required priming/convergence; show first-image and converged quality
separately. Report native requested render throughput independently from output
dimensions or synthetic/interpolated presentation frames.

For each trial retain requested/effective settings, images/linear samples,
revision/time/history/geometry-residency metadata, compiler diagnostics, memory,
latency and result. Report quality errors and hard lifecycle/root violations
separately from speed. Success requires applicable quality and resource controls;
fast failure, an attractive still or a vendor technique name is insufficient.
All groups are currently **not_run**, with no measured latency, memory, fidelity
or comparative advantage claimed.
