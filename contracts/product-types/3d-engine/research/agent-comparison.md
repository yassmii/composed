> This records the agent pass (22 sources at that stage). Active research now has
> 28 sources after the [performance pass](performance-comparison.md); no comparative
> or performance result is established by either documentary comparison.

# Agent-oriented 3D comparison — second pass, 2026-11-01

Question: what would make this contract competitive for an agent's bounded
create-inspect-correct loop? The first pass improved core correctness but did not
establish excellence. This pass adds **ten primary sources**, bringing the active
manifest to **22**, and thirteen observations (OBS-3D-014–026, 26 total).
Source versions, locators, consultation dates and real hashes are in sources.yaml.

## Selection and evidence limits

Two current community-project bridges are compared at exact repository commits:
MCP for Blender and MCP for Unity. They are first-party sources for those projects,
not official Blender Foundation or Unity Technologies endorsements. Blender API,
OpenUSD and Replicator provide complementary operator/edit/diagnostic references.
BlenderGym (2025), 3DCodeBench (2026) and BlenderWorld (October 2026) inform evaluation
coverage; their published model scores are not transferred to Composed. Abstracts
support only the narrow benchmark-method observations recorded, not independent
replication or a full paper/dataset audit. No competitor was installed or executed.
This is a targeted current scan, not an exhaustive SOTA survey.

Three repository READMEs and two Unity tool references are pinned to the retrieved
HEAD commit and hashed as raw bytes. Other sources use the existing
html_article_text normalization. ArXiv records explicitly name v1. Blender's current
API and OpenUSD's 27.02 development docs remain live aliases; Replicator uses a
versioned 1.13.30 URL. No long third-party contents or datasets are redistributed.

## Capability matrix

“Documented” means supported by the cited project's source, not tested here.
“Unknown” means no guarantee established by the selected evidence, not absence.

| Comparison axis | MCP for Blender | MCP for Unity | Complementary evidence | Composed candidate decision |
| --- | --- | --- | --- | --- |
| Agent scene access | get_scene_info, selected object fields / queries (015) | Editor scene/assets/test workflow (018), paged hierarchy (020) | Blender operators depend on execution context and return/error semantics (014) | Keep typed discovery/read-only inspection; they are not unique innovations. |
| Visual feedback | look supports camera/viewport/multi-angle views (016) | Scene reference directs screenshots/multi-view to manage_camera (020) | Replicator depth and segmentation outputs (022/023) | Add aligned RGB/depth/entity feedback with stable scene identity and revision, REQ-3D-017. No general rendering-quality lead claimed. |
| Edit efficiency | Arbitrary Python can express rich operations (017) | Batching, limits and fail_fast documented (019) | Neither fact establishes whole-set atomic rollback or stale-revision protection | Choose previewed bounded atomic edit sets and explicit expected revisions, REQ-3D-015; comparative support remains unknown until tested. |
| Preserve/recover | README explicitly advises saving before arbitrary code (017) | Undoable scene validation is documented; arbitrary-state checkpoint guarantees remain unknown here (020) | USD non-destructive overrides preserve source layers (021) | Choose in-session reference checkpoints and seeded restore under current limits, REQ-3D-016. No USD, undo stack or persistence mechanism prescribed. |
| Performance/quality | No matched task result from this session | Batch reference advertises 10–100x reductions; no controlled matched evidence reviewed | 3DCodeBench separates execution, image, geometry and judge metrics (024); BlenderGym discusses inference-compute allocation (025) | Measure comparable tasks and budgets; do not import marketing speedups or model rankings. |
| Success definition | Tool success alone is not an independent scene-quality oracle | Same limitation; no bridge superiority result inferred | BlenderWorld uses multi-view task rubrics and separate visual-quality assessment (026) | Add QA-3D-004 and POL-3D-003 plus eight concrete planned tasks; executed results remain unknown. |

Primary links: [MCP for Blender](https://github.com/ahujasid/mcp-for-blender),
[MCP for Unity](https://github.com/CoplayDev/unity-mcp),
[Blender operators](https://docs.blender.org/api/current/bpy.ops.html),
[OpenUSD introduction](https://openusd.org/dev/intro.html),
[Replicator API](https://docs.omniverse.nvidia.com/kit/docs/omni_replicator/1.13.30/source/extensions/omni.replicator.core/docs/API.html),
[3DCodeBench](https://github.com/gaoypeng/3dcodebench),
[BlenderGym v1](https://arxiv.org/abs/2504.01786v1),
[BlenderWorld v1](https://arxiv.org/abs/2610.23986v1).
Use manifest URLs for exact pinned repository files and per-source locators.

## Divergence and counterexamples

- Arbitrary Python makes Blender extremely expressive, including modelling outside
  this core, but is not evidence of a bounded typed scene API. Composed does not
  add arbitrary execution to mimic it; file/resource rules still apply.
- Unity's fail_fast controls stopping, not a documented transactional rollback
  guarantee in the selected reference. Treating a batch as atomic would be an
  unsupported inference. The chosen candidate requires stronger observable semantics.
- USD non-destructive composition is not automatically an agent checkpoint,
  current-authority revalidation or stable entity-ID system. Its own introduction
  explicitly discusses the lack of GUIDs; Composed does not infer its identity
  guarantees from USD or prescribe USD as an implementation.
- Replicator has debug renderer-ID annotators and labelled-entity coverage limits.
  Composed's stable-node mapping and supported opaque-surface coverage are explicit
  stronger choices, not an equivalence claim.
- Multi-view rubrics, geometric predicates, aesthetics and task executability can
  disagree. A single image, successful script or averaged judge score cannot
  establish structural preservation, recovery or universal visual excellence.

## Ambition, evidence and hypotheses

| Proposed advantage | Evidence state | What could confirm or refute it |
| --- | --- | --- |
| More reliable targeted edits with less lost work | Chosen ambition; patterns motivate it, no measured advantage | Stale/invalid edit controls and matched correction tasks, including wrappers' true contribution. |
| More useful visual feedback for fixing occlusion or placement | Depth/segmentation and multi-view capabilities observed in different tools; exact integration chosen | Independent depth/entity checks and held-out multi-view task outcomes; RGB-only ablation under the same budget. |
| Faster recovery from a wrong edit | Chosen bounded checkpoint semantics; no timing evidence | State/seed restoration and resource ledger, then matched elapsed-time and intervention results. |
| Better task completion per resource budget | Open hypothesis, not a product fact | Paired fixed-agent trials with published populations, budgets, cost availability and uncertainty. |
| Best renderer or universal SOTA agent platform | Unsupported and outside this bounded scope | Requires a different, much broader task population and current external evidence; this corpus cannot justify it. |

The [evaluation protocol](../candidates/1.0.0/agent-comparison.md) declares eight
original tasks, proposed budgets, matched-capability strata, positive/negative
controls and scoring separation. It is not yet instantiated against an engine
schema or runner, so all tasks remain not_run. Before claiming an advantage,
preregister the exact hypothesis, primary metric, non-regression bounds and
uncertainty rule; a favourable post-hoc result is exploratory. No empirical
threshold or percentage improvement is invented by this pass.
