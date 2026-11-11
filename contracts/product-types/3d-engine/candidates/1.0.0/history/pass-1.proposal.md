# ENG-2026-11: lifecycle, scheduling and offscreen-rendering candidate

- Status: **proposed**; contract 1.0.0 has maturity **candidate**.
- Date/trigger: maintainer-requested application of the booking research method,
  2026-11-01.
- Scope: existing 3d-engine family only; format 0.1 retained.
- Author: repository agent; stable promotion authority: Composed maintainer after
  independent review. No independent approval is claimed in this session.
- Classification: provenance and verification gaps; lifecycle/scheduling ambiguity,
  not an implementation incident or a new engine family.

## Research and changes

Twelve official pages (four refreshed, eight added), three products and thirteen
atomic observations underpin the comparison. New observations 005–013 cover deferred
node destruction, non-destructive detach, separate asset lifetime, bounded fixed
updates and non-rendering headless modes. Previous source records are preserved
exactly; new hashes were produced only after retrieving and reviewing current content.

The 0.2.0 baseline leaves closure versus actual resource retirement unspecified and
allows either failed-asset fallback or controlled error. The candidate chooses a
controlled failure, prevents late loads from publishing into closed scenes, keeps
in-flight resources safe and counted, and exposes incomplete cleanup. New
REQ-3D-014 makes closure behaviour observable. Existing rendering invariants are
reworded to distinguish new submissions from safe completion of prior submissions.

Bounded catch-up now specifies discarded whole-step lag and coherent frame revisions.
Actual no-display image production is distinguished from a dummy headless backend.
Reference-state equality is scoped to a published execution profile. Acceptance
expands from ten to fifteen scenarios without deleting old IDs; negative,
concurrency, overload and delayed-cleanup controls are explicit.

## Compatibility and migration

Proposed product version: **1.0.0 candidate**, not stable. New mandatory failure,
closure, accounting and evidence requirements are breaking under the repository's
SemVer rule. Format remains **0.1** because this pass targets behaviour and research,
not a new machine-readable proof protocol. A manual coverage matrix records the
intended cases; no format-0.2 coverage or scoped proof assessment is claimed.

Existing IDs retain their subject; strengthened or narrowed meanings are described
in candidate traceability and review. REQ-3D-014 and ACC-3D-011–015 are new. No old
identifier is removed. Original files remain unchanged:

- baseline contract version: 0.2.0
- contract SHA-256: `b4fa6dc5e94badcebb73940af1575823a15a403814c19d5600c488c70098aeb2`
- traceability SHA-256: `98f256c220793c5591dea4a921064bfa0141f42ee617e5c5eca5ba4c62fc4f2d`
- repository baseline: `168f198f0f6c433aca720e09033cf6ba8f84ce91`

Consumer adoption requires an explicit reviewed 1.0.0 pin and new evidence for all
fifteen cases against an immutable engine revision and published execution profiles.
No proof transfers automatically. Rollback restores the prior consumer pin and its
own applicable evidence; it does not certify changed behaviour against 0.2.0.
No consumer repository, implementation, stack, original work-item decision or Build
Kit file is changed. Prior 0.2.0 review records remain historical, not 1.0.0 approval.

## Evaluation and decision boundaries

Freeze the proposed fixtures before confirmation: valid hierarchy plus cycle and
concurrent reparenting controls; delayed and failed loads; one-revision rendering;
default ten-step lag with five executed/five discarded; same-profile 600-step
reproducibility; nonuniform offscreen images with two camera poses; close/load/render
races; repeated close; delayed retirement and cleanup failure; existing schema,
discovery, agent, inspection and file/resource-boundary scenarios.

Each run needs actual outcomes, correlated operation/revision identifiers, resource
ledger, profile and implementation revision. Incomplete cleanup or unexecuted cases
cannot count as passes. Do not remove failing controls or change image tolerances
after observing results. All engine cases remain **not_run** here; duration,
performance, safety and field outcomes are unknown. Structural checks and the
repository's synthetic example have separate meanings recorded in review.md.

This session delivers a researched candidate and labelled author review. Stable
promotion requires independent review and a recorded maintainer decision, not a
claim that an engine already conforms. Stop after this family; no deployment,
consumer migration, commit or push is authorised by this proposal.
