# agentic-delivery-harness 1.0.1 — English translation

Date: 2026-11-12. Status: **proposed**; contract maturity **candidate**, format **0.1**.
Decision authority: Composed maintainer, who requested the translation. This is the
author's proposed revision, not independent approval or stable promotion.

## What changes

The contract and its traceability are translated from French to English. Nothing else is
intended to change: clause identifiers, structure, priorities, clause order, the 26
acceptance cases, observation links and traceability bases are the same as in 1.0.0.

Under the repository's versioning rule, wording that changes without changing behaviour is
a **patch**. The [change record](changes.json) carries the fingerprints of both versions and
the [native impact report](impact.json) lists every clause as modified, which is expected:
the tool compares text, not meaning.

## What a translation can still change

A translation is not a proof of semantic equivalence. These points deserve a reviewer's
attention:

- **"Preuve"** is rendered as **"evidence"** throughout, and the verb "prouver" as "prove".
  "Preuve applicable" becomes the glossary term "applicable evidence".
- **"Contrôle imposé"** and **"effectivement imposé"** are rendered as **"enforced control"**
  and **"actually enforced"**: a mechanism that prevents the action, as opposed to an
  instruction or an observation.
- **"Périmètre"** and **"portée"** are both rendered as **"scope"**. The French separates the
  extent of a piece of work from the reach of a decision, authorisation or control; the
  English relies on context for that distinction.
- **"Recette native"** in ACC-ADH-014 is rendered as **"native acceptance check"**: the
  verification of a hook on the real runtime. It is distinct from the contract's own
  acceptance cases.
- **The contract name, actor names, entity names, glossary terms and quality-attribute
  names** are translated. Lifecycle labels were already English identifiers and are
  unchanged. An implementation that exposes the French labels verbatim either keeps its
  1.0.0 pin or maps them explicitly.
- If a reader finds a clause whose English says more or less than the French, the French
  1.0.0 text is the reference for resolving it, and the fix is a further patch.

The [author review](review.md) lists the remaining term choices clause by clause.

## Compatibility and migration

The 1.0.0 contract, traceability, review, integration record and research snapshot are
archived unchanged under [history/1.0.0](../../history/1.0.0/README.md). Existing consumer
pins and previous evidence stay attached to their original bytes. No proof transfers:
evidence produced against 0.1.0 or 1.0.0 is not rebound to 1.0.1.

Adopting 1.0.1 is an explicit pin change. Because the obligations are intended to be
identical, an implementation that conforms to 1.0.0 is expected to conform to 1.0.1, but
that expectation is not a verdict: run the suite against the new pin before claiming it.
No executable external profile is published for this product.

## Evaluation and decision boundary

All 26 product cases are **not_run**; no implementation target was supplied. Structural
validation passed. The translation was reviewed by its author only. Independent review,
including a bilingual check of the normative clauses, and a recorded maintainer decision
precede stable promotion.
