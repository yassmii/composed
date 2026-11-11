# Git-backed CMS research

Status: **initial**.

- `sources.yaml` records every source with a raw URL pinned to an exact commit, a locator, the retrieval date, and a SHA-256 snapshot of the file bytes at that commit.
- `observations.yaml` holds atomic, paraphrased facts about observable product behaviour. It does not carry interpretation or product choices.
- `comparison.md` separates convergence, divergence, and the resulting product choices.

The primary reference is EmDash CMS (`emdash-cms/emdash`, MIT licence), inspected read-only from a local clone at commit `4ec13c34192dc0bafc2878af5b1129152e8dc990`. EmDash is database-backed. It is evidence for content-model, validation, draft, preview, revision, and permission behaviour, not for storage. Decap CMS and TinaCMS are the Git-backed comparison references, read from their official documentation repositories at pinned commits.

An unrelated project also called Emdash (`generalaction/emdash`, a desktop app for coding agents) was examined first and excluded because it is not a CMS.


## Corpus refresh — 2026-11-01

Status: **recorded corpus rechecked**. This is a bounded update of 28 existing sources: 28 initial hashes unchanged, 0 changed and reviewed, 0 unavailable.

All twenty-eight sources matched their recorded immutable pins. No drift was found at those pins. Existing comparison already separates repository-canonical storage, optional vendor review, mandatory Composed publication review and unverified identity attribution. No normative revision follows from an unchanged source snapshot.

Review newer EmDash, Decap and TinaCMS revisions; deepen authenticated author versus Git metadata, competing approved changes and legal erasure. Current pins are not claims about the latest deployed products.

[Source-by-source record](refresh-2026-11-01.json) includes previous/current hashes,
retrieval errors, dependent observations and affected clauses.
[Original source manifest](history/sources-before-refresh-2026-11-01.yaml) preserves prior records.
Old response bodies are unavailable: hash drift does not date or classify a historical
behaviour change. New observations are research inputs, with no automatic normative adoption.

Owner for this manual pass: repository agent; decision authority: Composed maintainer.
Budget: the recorded corpus and changed passages, with a second retrieval of changed
sources; no new provider survey, runtime experiment or background schedule. Revisit
on source drift or the requested deepening pass. Research maturity remains initial;
this author review does not promote a contract or certify an implementation.
Baseline contract/traceability bytes, consumer pins and Build Kit remain unchanged.
All product cases are not_run; existing proof is not transferred.
