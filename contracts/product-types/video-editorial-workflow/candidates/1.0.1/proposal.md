# video-editorial-workflow 1.0.1 — English translation

Date: 2026-11-12. Status: **proposed**; contract maturity **candidate**, format **0.1**.
Decision authority: Composed maintainer, who requested the translation. This is the
author's proposed revision, not independent approval or stable promotion.

## What changes

The contract and its traceability are translated from French to English. Nothing else is
intended to change: clause identifiers, structure, priorities, clause order, the nine
acceptance cases, observation links and traceability bases are the same as in 1.0.0.

Under the repository's versioning rule, wording that changes without changing behaviour is
a **patch**. The [change record](changes.json) carries the fingerprints of both versions and
the [native impact report](impact.json) lists every clause as modified, which is expected:
the tool compares text, not meaning.

## What a translation can still change

A translation is not a proof of semantic equivalence. Three points deserve a reviewer's
attention:

- **"Recette"** is rendered as **"acceptance check"**: the verification of a handoff in the
  receiving editing environment. It is distinct from the contract's own acceptance cases.
- **Lifecycle labels, actor names, glossary terms and quality-attribute names** are
  translated. An implementation that exposes the French labels verbatim either keeps its
  1.0.0 pin or maps them explicitly.
- If a reader finds a clause whose English says more or less than the French, the French
  1.0.0 text is the reference for resolving it, and the fix is a further patch.

## Compatibility and migration

The 1.0.0 contract, traceability, review, changelog, integration record and research
snapshot are archived unchanged under [history/1.0.0](../../history/1.0.0/README.md).
Existing consumer pins and previous evidence stay attached to their original bytes. No proof
transfers: evidence produced against 0.3.1 or 1.0.0 is not rebound to 1.0.1.

Adopting 1.0.1 is an explicit pin change. Because the obligations are intended to be
identical, an implementation that conforms to 1.0.0 is expected to conform to 1.0.1, but
that expectation is not a verdict: run the suite against the new pin before claiming it.
The external conformance profile 0.1.0 still targets the 0.3.1 contract and is unaffected.

## Evaluation and decision boundary

All nine product cases are **not_run**; no implementation target was supplied. Structural
validation passed. The translation was reviewed by its author only. Independent review,
including a bilingual check of the normative clauses, and a recorded maintainer decision
precede stable promotion.
