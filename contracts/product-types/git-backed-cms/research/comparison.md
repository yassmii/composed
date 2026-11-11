# Initial comparison

This document separates three layers: source facts (observations), interpretation (convergence and divergence), and the product choices that follow. The choices are labelled `explicit_project_choice` in `contracts/traceability.yaml`.

## Source facts at a glance

| Concern | EmDash CMS | Decap CMS | TinaCMS |
| --- | --- | --- | --- |
| Canonical content store | Site database (OBS-GCMS-001, 002) | Git repository (OBS-GCMS-021, 023) | Repository files; database is a rebuildable index (OBS-GCMS-031) |
| Where the content model lives | Database, changed at runtime (OBS-GCMS-002, 004) | Configuration file (OBS-GCMS-022) | Version-controlled configuration (OBS-GCMS-030) |
| Field validation | Required, unique, typed rules, references (OBS-GCMS-005, 006) | Required by default, patterns (OBS-GCMS-026) | Required, client-side function (OBS-GCMS-032) |
| Draft vs published | Always separate (OBS-GCMS-008) | Direct commit by default; optional branch workflow (OBS-GCMS-024) | Optional branch workflow or draft field (OBS-GCMS-033, 034) |
| Preview | Signed, expiring, per-entry links (OBS-GCMS-010) | Live editor preview (OBS-GCMS-027) | Preview deployments of branches (OBS-GCMS-034) |
| History and restore | Revisions; restore adds a revision (OBS-GCMS-011) | Git history (OBS-GCMS-021) | Git history (OBS-GCMS-030, 031) |
| Permissions | Five roles plus ownership, enforced per action (OBS-GCMS-015, 016) | Repository push access; fork-based contribution (OBS-GCMS-028, 029) | Editor/administrator (OBS-GCMS-035) |

## Convergence

- **Typed, declared content models.** All three declare content types as collections of named, typed fields with rules (OBS-GCMS-001, 022, 030).
- **Validation before a write is kept.** All three stop a save that breaks required-field rules. EmDash also rejects invalid references and reports every failing field (OBS-GCMS-005, 006, 026, 032).
- **Unpublished work is separate from what visitors see.** The mechanisms differ, but every product offers a way to hold changes back from the published state and preview them (OBS-GCMS-008, 010, 024, 027, 033, 034).
- **Contributors without publish rights.** EmDash and Decap both let someone edit and submit without publishing (OBS-GCMS-015, 029).

## Divergence

- **Storage authority.** EmDash is database-first. Its version-controlled seed is ignored once a site exists, and its JSON export cannot be restored (OBS-GCMS-002, 019). Decap and TinaCMS make repository files canonical. TinaCMS still runs a database, but only as a derived index (OBS-GCMS-031).
- **Model evolution.** EmDash applies model changes to the live site immediately and separately from code (OBS-GCMS-004). Decap and TinaCMS version the model with the code (OBS-GCMS-022, 030).
- **Review is optional in both Git-backed tools.** Decap's default commits straight to the publication branch. TinaCMS's review workflow sits on a paid plan and depends on a Git host's review requests (OBS-GCMS-024, 033).
- **Where review state lives.** Decap writes workflow metadata into the repository, and some hosts add labels (OBS-GCMS-025). TinaCMS relies on the host's review requests (OBS-GCMS-033).
- **Deletion.** EmDash permanently deletes an entry and its revisions (OBS-GCMS-014). In a Git-backed history, earlier states stay reachable unless history is rewritten.
- **Permission granularity.** EmDash has ownership-aware roles (OBS-GCMS-015). Decap and TinaCMS mostly inherit the repository's write permission (OBS-GCMS-028, 035).

## Resulting product choices

1. **Git is the canonical content history for this product type** (POL-GCMS-001). This choice defines the `git-backed-cms` product type. It is not a claim that CMS products in general need Git. EmDash is a counter-example.
2. **Models are versioned with content.** Models follow the Decap and TinaCMS pattern, not EmDash's runtime schema, and model changes go through the same change, validation, and review flow as entries.
3. **Review before publication is mandatory** (POL-GCMS-003), even though both Git-backed references make it optional.
4. **Review records are stored in the repository and do not depend on any host** (POL-GCMS-004). A Git host's review requests are only an optional extension.
5. **History is append-only for CMS actions** (INV-GCMS-003). Deleting and restoring add revisions. This deliberately differs from EmDash's permanent delete.
6. **Validation runs again at publication**, including on revisions written directly to the repository (REQ-GCMS-011). No source shows this for out-of-band commits.

## Open questions

- Legal erasure. An append-only history conflicts with a legal obligation to erase content. A versioned extension should define how history is rewritten under explicit legal authority.
- How a commit's recorded author is bound to an authenticated CMS actor, given that repository author metadata is not proof of identity.
- Merge semantics when two approved changes touch the same entry. The contract requires revalidation, but not a conflict-resolution method.
- Evidence for ownership scopes below repository level in Git-backed products. Only EmDash evidences per-entry ownership.


## Corpus refresh — 2026-11-01

See the [dated refresh review](README.md#corpus-refresh--2026-11-01) and
[source-by-source impact record](refresh-2026-11-01.json).

All twenty-eight sources matched their recorded immutable pins. No drift was found at those pins. Existing comparison already separates repository-canonical storage, optional vendor review, mandatory Composed publication review and unverified identity attribution. No normative revision follows from an unchanged source snapshot.

Baseline obligations are unchanged. Deferred follow-up: Review newer EmDash, Decap and TinaCMS revisions; deepen authenticated author versus Git metadata, competing approved changes and legal erasure. Current pins are not claims about the latest deployed products.
