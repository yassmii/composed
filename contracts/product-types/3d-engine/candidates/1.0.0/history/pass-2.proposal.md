# ENG-2026-11: agent-oriented 3D candidate, second pass

- Status: **proposed**; product version **1.0.0**, maturity **candidate**, format 0.1.
- Date: 2026-11-01. Trigger: maintainer asks to pursue best-of-breed/SOTA ambition
  beyond a correctness-focused research refresh.
- Scope: existing 3d-engine family, focused on bounded create-inspect-correct
  workflows; no new product family or model-creation contract.
- Author: repository agent. Stable promotion needs independent review and a
  recorded maintainer decision. Neither is claimed by this author pass.

## Product direction and evidence

The core now makes discoverable, bounded, recoverable scene correction the explicit
agent promise. This is a product positioning choice based on the existing agent
requirements, not a demonstrated universal rendering advantage. General-purpose
sculpting, rigging, arbitrary-media reconstruction and leaderboard leadership are
outside this core. No language, engine vendor, transport, USD dependency, asset
format or model provider is selected.

Research now comprises 22 primary sources and 26 observations. Ten documents added
in this pass cover exact revisions of community Blender/Unity bridges, Blender
operator semantics, OpenUSD preservation, Replicator diagnostic channels and recent
published benchmark methods. See research/agent-comparison.md for facts, divergences,
source limits and the ambition/evidence/hypothesis matrix. No comparator or engine
was executed; literature results are not scores earned by Composed.

## Concrete change

The first pass's lifecycle, scheduling, error, no-display rendering and resource
requirements remain. This pass adds:

- REQ-3D-015: property-level preview and bounded all-or-none scene edits with expected
  revisions, preserving unaffected state and rejecting stale writes.
- REQ-3D-016: bounded in-session checkpoints, reference/seed restoration as a fresh
  revision, current asset/root/profile/limit validation and safe release.
- REQ-3D-017: aligned multi-view RGB/depth/entity feedback at one paused revision,
  stable node mapping, explicit surface semantics and shared resource limits.
- QA-3D-004 / POL-3D-003 / MET-3D-003: separate task, state, visual, recovery and
  resource evidence; disclose unsupported/unexecuted trials and scope any
  comparative claim to actual matched evidence.
- ACC-3D-016–020: edit, recovery, diagnostic, full correction-loop and comparative
  report controls, for twenty scenarios total.

The original eight-task agent protocol is in agent-comparison.md. It describes
fixtures, comparators, eligibility, chosen trial budgets, scoring and controls;
it is not a runnable engine benchmark until concrete schemas, fixture bytes,
checker and run profiles are instantiated. Every task/result remains not_run.

## Compatibility and preserved identities

Baseline 0.2.0 remains byte-for-byte unchanged, as do its traceability and consumer
references. The proposed 1.0.0 remains candidate and format 0.1; no automatic 0.2
proof migration or stable promotion occurs. New mandatory behaviour and evidence
are breaking relative to 0.2.0, so the proposed major version is retained.

The unpromoted 1.0.0 candidate is revised explicitly at the maintainer's request.
Its first-pass bytes and documents are preserved under history/:

- pass-1.contract.yaml SHA-256: `22aa21b25ee059beaad49c22951f3814b4cb4f3ff99a3e1c92801fcd28c32cab`
- pass-1.traceability.yaml SHA-256: `1dfae12ebe56932e1e2c69623f969c384f63aafc4037da7c20e2347d2be324e5`
- pass-1.proposal.md and pass-1.review.md preserve the prior design and verdict.

Those exact candidate identities remain historical. A consumer pinned to any
previous bytes must explicitly adopt the new bytes and revalidate; no proof is
rebound merely because the provisional numeric version is unchanged. Old IDs
retain their subject; new IDs are REQ-3D-015–017, QA-3D-004, POL-3D-003,
MET-3D-003 and ACC-3D-016–020. No old clause or acceptance ID is removed.

Format 0.1 is retained to keep this product/research revision separate from an
optional proof-format migration. Manual mappings cover the new clauses; they are
not format-0.2 static coverage. No Build Kit, consumer implementation, lock,
project decision or unrelated local change is modified.

## Evaluation and decision

Before confirmation, freeze corpus/profile/fixture/checker hashes, model/bridge/
engine versions, eligible baseline pairings, trials, budgets and scoring. Publish
per-trial outcomes and hard failures separately from image/aesthetic scores and
resource measures. The selected eight-task corpus is a bounded pilot, not a
universal SOTA test. Any superiority hypothesis and margin must be declared before
its confirmation trials; absent measurements stay unknown, not zero or pass.

This pass completes a researched revision, observable clauses, planned controls and
labelled author review. Stable specification promotion remains an independent
review/maintainer decision. Implementation conformance and comparative leadership
need their own executed evidence. No deployment, commit or push is performed.
