> The subsequent [shader/rendering pass](rendering-comparison.md) adds ten primary
> sources (38 active total), explicit shading and rendering quality controls.
> Earlier counts below remain historical.

> The [performance pass](performance-comparison.md) adds six official
> sources (28 active total) and scoped measurement, latency and capacity obligations.
> Earlier pass counts below remain historical.

> The lifecycle comparison below records pass 1 (12 sources). The current
> [agent-oriented second pass](agent-comparison.md) adds 10 sources, bringing the
> active manifest to 22, with separate capability/claim/evaluation analysis.

# 3D engine comparison — 2026-11-01

Scope: twelve current official pages across Godot, Unity and Unreal. All statements
below describe documentation. No vendor runtime, GPU benchmark, sandbox attack,
agent journey or image comparison was executed. See sources.yaml for exact URLs,
versions, dates, normalization and hashes. Previous research records are preserved
in research/history; prior source bodies are unavailable, so this pass does not
claim a complete historical behaviour diff.

## Observations and limits

| ID | Primary source / precise location | Supported fact and boundary |
| --- | --- | --- |
| OBS-3D-001 | Godot Nodes and Scenes, Nodes / Scenes; Node class, Processing | Rooted nodes and per-frame callbacks. Godot's scene/object model is not imposed on other engines. |
| OBS-3D-002 | Unity 6000.0 Transform, The Transform Component / Parenting | Parent-relative transforms and single-parent hierarchy. This does not specify Composed's matrix precision or concurrent reparenting semantics. |
| OBS-3D-003 | Unreal Components, Scene Components / Attachment | Single-parent attachment trees explicitly reject cycles. These sections alone do not show all three products' cycle-rejection APIs. |
| OBS-3D-004 | Godot Background loading, Using ResourceLoader | Background request, status and retrieval; early retrieval can still block. Nonblocking retrieval is a stronger chosen requirement. |
| OBS-3D-005 | Godot Node, queue_free method description | Deferred deletion invalidates node/child references when performed. It does not guarantee immediate GPU reclamation or close-race outcomes. |
| OBS-3D-006 | Godot Node, remove_child method description | Detaching does not delete a node or its children. Ownership and reference retention are separate decisions. |
| OBS-3D-007 | Unity Object.Destroy, Remarks | Destruction is deferred until after Update and before rendering. This is not proof that all device allocations are immediately freed. |
| OBS-3D-008 | Unity SceneManager.UnloadSceneAsync, Remarks / asset note | Scene removal destroys scene GameObjects but does not unload assets; completion has no guaranteed duration. A scene-close signal is not proof of memory reclamation. |
| OBS-3D-009 | Unreal Actor Lifecycle, End of Actor Lifecycle / Garbage Collection | EndPlay, graphics-proxy cleanup and eventual deallocation are distinct phases; IsReadyForFinishDestroy can defer reclamation. No Composed cleanup deadline follows. |
| OBS-3D-010 | Godot Idle and Physics Processing, processing types | Frame callbacks differ from fixed-rate physics, defaulting to 60Hz. Fixed rate alone does not prove determinism or cross-platform equality. |
| OBS-3D-011 | Unity Time.maximumDeltaTime, Remarks | A configurable limit bounds fixed updates per frame. Neither a universal five-step cap nor Composed's discarded-lag accounting is evidenced. |
| OBS-3D-012 | Unreal Actor Ticking, Tick Groups / Tick Group Order | Ordered groups and dependencies distinguish during-physics from post-physics state. This is not one universal update/render architecture. |
| OBS-3D-013 | Godot RenderingServer, Description / Headless mode | The headless flag disables rendering and returns dummy values for most rendering functions. This is counterevidence to equating headless execution with image production. |

Official source entry points: [Godot documentation](https://docs.godotengine.org/en/stable/),
[Unity 6000.0 reference](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/),
and [Epic documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/).
Per-page URLs are retained with each source ID in sources.yaml.

## Supported convergence

All three products expose spatial hierarchies, with different node/GameObject/
Actor-component models. Parent-relative spatial structure supports neutral scene
and node vocabulary; explicit cycle rejection is directly evidenced here by Unreal
only, so candidate REQ-3D-002 no longer claims unsupported multi-product convergence.

Godot, Unity and Unreal all document deferred destruction or reclamation phases.
The narrow convergence is that requesting removal is distinct from completed
reclamation. They do not share one ownership model, deletion barrier or asset-cache
policy. Godot detach and Unity unload supply concrete counterexamples to treating
all scene-graph removal as complete resource release.

Fixed-rate processing, catch-up bounds and phased updates are observed patterns
with materially different defaults and boundaries. They motivate explicit scheduling
rules but do not prove 600-step deterministic state or bit-identical images.

## Explicit candidate choices

- REQ-3D-002/003/004 choose rejection before cyclic mutation, nonblocking loading
  queries/retrieval, and controlled errors for failed-asset use. The 0.2.0 contract
  allowed either fallback or error; 1.0.0 selects error so success cannot conceal
  a missing resource. Independently ready scenes remain usable.
- REQ-3D-014 and INV-3D-002/003 separate logical closure from physical retirement.
  Late loads cannot reactivate a scene, repeated close cannot double-retire, and
  shared backing stays usable through other scenes' own valid bindings. Submitted
  GPU work must retire safely; memory pending retirement remains counted.
- REQ-3D-005/006 and POL-3D-001 require coherent revision consumption, at most five
  updates under the default cap, and explicit discarded whole-step lag rather than
  unbounded catch-up debt. Discarded wall time is not executed simulation time.
- REQ-3D-012 requires real offscreen images without a window or display server;
  a dummy backend cannot satisfy it. Required graphics capability remains mandatory,
  so a no-GPU simulation-only mode is not added silently.
- QA-3D-003 scopes equality to the same execution profile, inputs, asset contents
  and published numeric rules. Cross-platform equality is not inferred. Agent
  discovery, structured text, read-only inspection and asset-root confinement remain
  explicit product choices; these sources do not establish an agent-interface
  convergence or an operating-system sandbox.

The existing 60 FPS, 16.7ms median, five-step cap and 600-step comparison are product
choices, not measured or research-validated thresholds. A median alone does not
prove throughput; performance evidence reports both separately. No new vendor
performance threshold or fixed cleanup deadline is invented.

## Open questions and scope boundaries

Actual target hardware/driver, warm-up, benchmark sampling, workload cycle count,
quiescence observation, numeric tolerances and concrete interchange-format extension
belong in declared execution/validation profiles before running conformance cases.
This contract does not choose a vendor or substitute a schema check for those runs.

Device loss, process-crash recovery, cross-profile floating-point portability,
untrusted third-party code and a complete graphics-memory safety proof need separate
research and scoped design decisions. They are not new guarantees in this pass.
Godot live-alias sources and Epic live URLs remain freshness-limited; a normalized
hash is not an immutable upstream revision. Independent review decides whether
this evidence is sufficient for stable specification promotion. Lack of an existing
conforming engine does not by itself prevent stabilizing a specification.
