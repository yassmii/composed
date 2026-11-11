# Review: initial research revision

Mode: **self-review by the author**. This is not an independent review.

Status: **draft internally checked; independent review and promotion decision pending**.

- Traceability covers every capability, requirement, invariant, policy, and quality attribute. Each clause is either linked to observations or labelled `explicit_project_choice`, and each combined basis carries a note stating which part is a choice.
- "Git is the canonical content history" is POL-GCMS-001, an `explicit_project_choice` that defines this product type. It is not presented as a requirement for CMS products in general, and the database-backed EmDash reference shows it is not one.
- Validation before recording, draft isolation, preview, and scoped permissions are supported by the sources. Mandatory review (POL-GCMS-003), append-only history (INV-GCMS-003), protection of canonical references (POL-GCMS-005), revalidation of out-of-band revisions (REQ-GCMS-011), and review records held in the repository (POL-GCMS-004) are deliberate contract choices.
- The contract diverges from EmDash on purpose: models are versioned with content rather than changed at runtime, and permanent deletion of revisions is excluded.
- No language, runtime, framework, static-site generator, database, API style, Git hosting service, or hosting provider is prescribed. Git is the only named technology, as the defining product choice.
- Deferred and out of scope: database synchronisation or indexing, media asset storage, plugin marketplace, multi-site, localisation, full-text search, collaborative real-time editing, scheduled publication, and deployment vendor or rendering framework.

Before promotion:

- Define an extension for legal erasure, because INV-GCMS-003 forbids rewriting history.
- Specify how a repository revision's author is bound to an authenticated actor (INV-GCMS-005).
- Add evidence for ownership scopes below repository level in Git-backed products; only EmDash evidences them.
- Add evidence for, or keep as a choice, conflict handling when approved changes overlap (REQ-GCMS-016).
- Obtain a fresh-session independent review before promotion.

All sources are raw files pinned to exact commits, so their SHA-256 snapshots should stay stable under `npm run verify:research`.
