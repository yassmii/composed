# Shader and modern rendering research — 2026-11-01

The prior candidate defined resource correctness, agent correction and measurement
but barely specified shading. This pass adds ten primary sources, bringing the
manifest to **38 sources and 43 observations**. Owner: repository agent; decision
authority: Composed maintainer. Budget: ten documents, a bounded comparison,
one explicit candidate revision and planned quality controls. No recurring job,
renderer execution, benchmark or broader SOTA survey is created.

## Source facts and limits

| Observations / source | Supported fact | Boundary |
| --- | --- | --- |
| OBS-3D-034, [Godot spatial shaders](https://docs.godotengine.org/en/stable/tutorials/shaders/shader_reference/spatial_shader.html) | Programmable vertex/fragment/light stages; built-in time is not paused with scene pause. | Shader authoring and simulation time are distinct; this does not prove bounded execution of arbitrary shader code. |
| OBS-3D-035, [Godot materials](https://docs.godotengine.org/en/stable/tutorials/3d/standard_material_3d.html) | Metallic/roughness, normal, emission and transparency controls have explicit semantics. | Emissive appearance does not alone light other geometry; normal conventions vary. |
| OBS-3D-036, [Khronos glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) | PBR inputs distinguish colour transfer from linear numeric texture data. | This semantic reference does not select glTF or prescribe its complete material model for every shader. |
| OBS-3D-037, [Godot renderers](https://docs.godotengine.org/en/stable/tutorials/rendering/renderers.html) | GI, reflections, AA, compute and precision vary by renderer; fallback can alter appearance. | A renderer name is not a universal hardware/feature guarantee. |
| OBS-3D-038, [Unity variants](https://docs.unity3d.com/6000.0/Documentation/Manual/shader-variants.html) | Variant populations affect compilation, loading and memory costs. | Prior OBS-3D-031 also limits what prewarming establishes; no compile-time or stutter budget is measured here. |
| OBS-3D-039, [Unity Forward+](https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@17.0/manual/rendering/forward-plus-rendering-path.html) | Tiled light selection changes per-object limits but retains per-camera bounds. | Many-light rendering is not unlimited lighting and does not prescribe this rendering path. |
| OBS-3D-040, [Lumen details](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-technical-details-in-unreal-engine) | GI/reflection methods have screen-trace, ray-tracing and surface-cache constraints. | No vendor performance number, implementation or proprietary feature is adopted. |
| OBS-3D-041, [Nanite geometry](https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine) | Clustered geometry, streaming and automatic LOD have measurable content/hardware limits. | This is not identical to supporting hardware mesh shaders, nor proof of unlimited geometry. |
| OBS-3D-042, [temporal reconstruction](https://dev.epicgames.com/documentation/en-us/unreal-engine/temporal-super-resolution-in-unreal-engine) | Reconstruction trades internal resolution/history for convergence, motion and disocclusion behaviour. | Output dimensions alone do not establish native-detail quality; vendor demonstrations are not Composed results. |
| OBS-3D-043, [Godot compute](https://docs.godotengine.org/en/stable/tutorials/shaders/compute_shaders.html) | Compute has renderer/driver prerequisites; dispatch, synchronisation and readback differ. | Technical support does not promise portable performance or isolation of untrusted programs. |

Each exact URL, version description, locator, date and native-normalised SHA-256
is in sources.yaml. Godot stable aliases and vendor documentation are mutable;
Unity routes can redirect. The glTF page is a published semantic reference, not a
new engine asset dependency. The failed browser HDRP/registry attempts are not
invented sources: HDRP is not included; the actual registry body was obtained and
read through native retrieval. Raw bodies stay outside Git. Original source and
observation records are preserved in history/*before-rendering-2026-11-01.yaml.

## Product choices

The **mandatory baseline** is now PBR materials, custom vertex/surface shading,
scene-linear HDR with explicit output conversion, directional/point/environment
lighting and opaque shadows. Typed reflection, instance isolation, structured
build errors, atomic activation and agent inspection are stronger explicit choices.
No shader language, graphics API, compiler architecture or visual editor is selected.

Modern algorithms are **optional capability families with mandatory truthful
declaration and evidence when claimed**: clustered/tiled/deferred many-light paths,
AO, GI, reflections/ray tracing, temporal AA/upscaling, GPU-driven visibility/detail,
streamed/virtualised geometry, volumetrics and compute. Other documented techniques
can implement those outcomes. A capability matrix filled with unsupported entries
cannot waive baseline shading; an advertised technique is not verified merely by
being listed. Explicit fallback must disclose the effective quality/profile.

Temporal rendering needs its own state: view histories, jitter, shader time,
convergence and internal/output resolution. These do not advance simulation and
cannot silently contaminate a clean paused reference render or a restored scene.
Reference-state equality still excludes compiled handles/caches and does not
promise bit-identical images across hardware.

## Clause and verification impact

New CAP-3D-005/006, REQ-3D-020–025, QA-3D-007 and POL-3D-005; existing
REQ-3D-007/009/010/015/016/017 integrate materials/profile state into discovery,
round-trip, edits, recovery and diagnostics. ACC-3D-026–032 add seven planned cases.
The [rendering profile protocol](../candidates/1.0.0/rendering-profile.md) makes
quality, optional-feature applicability and performance controls concrete.

No shader was compiled, GPU workload dispatched or image compared in this pass.
All 32 product cases remain not_run. Concrete fixtures, tolerance values, hardware,
quality thresholds and independent review remain required before confirmation.
The retained 60-FPS target is not claimed for every possible advanced technique.
