# 3D engine research

The [shader/rendering pass](rendering-comparison.md) adds ten primary sources
(38 total / 43 observations). It covers PBR/material semantics, programmable
shaders, HDR/colour, many-light paths, GI/reflections, temporal reconstruction,
virtualised geometry and compute with explicit source limits and chosen contract
guarantees. The [rendering profile](../candidates/1.0.0/rendering-profile.md)
contains seven planned quality/resource control groups. Engine execution is not_run.

Supplemental 2026-11-01 [Unity source freshness check](refresh-2026-11-01.md):
OBS-3D-002 rechecked after a new source mismatch; baseline and candidate unchanged.

Status: **initial, refreshed 2026-11-01**. This is primary documentary research,
not an executed engine evaluation or a complete market synthesis.

Owner for this pass: Composed contract author. Budget: this existing family,
three source engines, twelve active pages (four refreshed, eight added).
Questions: hierarchy constraints, asynchronous readiness, destruction versus
reclamation, bounded scheduling and actual image rendering without a display.
Review again on relevant source change, implementation feedback or before stable
promotion; no recurring job or autonomous service is enabled.

Sources are official Godot, Unity and Epic documentation. Each source record has
an exact URL, locator, version or dated live-alias identity, consultation date and
an actual SHA-256 produced with the existing `html_article_text` normalization in
review-traceability.mjs. That normalization selects article/main text when available;
Godot responses also retain navigation text where neither wrapper is present.
A normalized match is content freshness evidence, not an immutable product build.

All twelve pages were retrieved and their relevant sections read on 2026-11-01.
The existing source IDs remain stable. Unity Transform is refreshed from 2022.1
to supported 6000.0 documentation, with the changed identity explicit. Godot's
`stable` alias is recorded as unpinned; Unreal pages identify 5.8 in metadata but
their URLs remain live. Raw page bodies are temporary local research artifacts,
not Git files. No immutable archive or vendor runtime test is claimed.

The prior source manifest is preserved exactly in
[history/sources-before-2026-11-01.yaml](history/sources-before-2026-11-01.yaml).
Prior page bodies were not available for a historical text diff. Relevant facts
were checked anew before updating hashes; the existing Unreal components
normalized hash still matches. No unrelated source hash was adjusted.

[observations.yaml](observations.yaml) retains OBS-3D-001–004 and adds 005–013.
OBS-3D-001 also cites the current Node class for its per-frame-callback statement.
The [comparison](comparison.md) gives the source locations and limits, and separates
convergence, explicit choices and unresolved questions. Attribution and third-party
rights remain with the documentation owners; no long excerpts are redistributed.

An attempted Epic `/actor-lifecycle` URL was inaccessible through the browsing
tool; the correct official `/unreal-engine-actor-lifecycle` page was subsequently
retrieved and reviewed. The browsing tool also timed out on Unity Transform;
direct retrieval of the official URL succeeded and its content was reviewed.
Only successful, reviewed retrievals enter the active manifest.

## Second pass: agent correction and comparative ambition — 2026-11-01

Budget: ten additional primary documents, limited to current project-owned bridges,
operator/non-destructive editing, visual diagnostic outputs and three benchmark
method references. No installation, broad rendering-engine shootout or model
training is undertaken. See [agent comparison](agent-comparison.md) for the evidence
matrix, per-source limitations, counterexamples and hypotheses.

The active manifest now has 22 sources and 26 observations. Existing twelve source
records and all original observations are preserved. The before-pass manifest is
retained in history/sources-before-agent-pass-2026-11-01.yaml. Five repository
sources use exact commit URLs and raw byte hashes; new live HTML/ArXiv sources use
the existing html_article_text normalization. Scope and task counts in the first
pass above remain historical. Revisit this comparative evidence before a claimed
advantage or stable promotion; no recurring service is configured.

Blender API retrieval failed through the browsing tool with HTTP 402 but direct
retrieval of the same official page succeeded and was reviewed. OpenUSD's release
glossary timed out in browsing; the actual source used is the reviewed dev intro.
Neither failed attempt is presented as a verified source.

## Performance pass — 2026-11-01

Six further official documents were retrieved and reviewed, within a bounded pass
on timing boundaries, warmup, profiling overhead and timestamp availability. Active
research is now 28 sources / 33 observations; previous records are retained in
history/sources-before-performance-2026-11-01.yaml. See
[performance comparison](performance-comparison.md) for precise observations,
counterexamples, explicit product choices and unmeasured questions. The failed
Vulkan Guide URL is recorded there; it is not a verified active source. No engine,
hardware tier or timing result was invented. Revisit before a performance claim or
profile confirmation; no background service is created.
