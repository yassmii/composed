# prospecting-workspace 1.0.1 — English translation

Date: 2026-11-12. Status: **proposed**; contract maturity **candidate**, format **0.1**.
Decision authority: Composed maintainer, who requested the translation. This is the
author's proposed revision, not independent approval or stable promotion.

## What changes

The contract and its traceability are translated from French to English. Nothing else is
intended to change: clause identifiers, structure, priorities, clause order, the 34
acceptance cases, observation links and traceability bases are the same as in 1.0.0.

Under the repository's versioning rule, wording that changes without changing behaviour is
a **patch**. The [change record](changes.json) carries the fingerprints of both versions and
the [native impact report](impact.json) lists every clause as modified, which is expected:
the tool compares text, not meaning.

## What a translation can still change

A translation is not a proof of semantic equivalence. These points deserve a reviewer's
attention:

- **"Interlocuteur"** is rendered as **"contact person"**, and "coordonnée" as "contact
  detail", so that neither is confused with the act of contacting ("forbidden contact",
  "ability to contact").
- **"Sollicitation"** is rendered as **"solicitation"**: the prospecting message and its
  handover to a provider. It is kept distinct from "request" (demande), which a visitor
  submits.
- **"Opposition"** is rendered as **"objection"**, in the sense of the data-protection
  right to object. It covers a refusal of future solicitations, including a one-step
  unsubscribe; it is stronger than a preference.
- **"Liste repoussoir"** is rendered as **"suppression list (liste repoussoir)"**; the
  French term is kept because it is the CNIL's own. "Sous-traitant" is rendered as
  "processor" and "information" (of the person) as "notice".
- **"Prestataire"** is rendered as **"provider"** (the service a solicitation is handed
  to) and **"fournisseur"** as **"supplier"** (a data, enrichment or AI source), to keep
  the distinction the French text makes.
- **"Dossier"** is rendered as **"record"**, "responsable" as "owner", "file responsable"
  as "owning queue" and "attente" as "wait".
- **Lifecycle labels, criterion results, actor names, glossary terms and
  quality-attribute names** are translated. An implementation that exposes the French
  labels verbatim (for example `en_attente`, `écarté`, `satisfait`, `non_satisfait`,
  `inconnu`) either keeps its 1.0.0 pin or maps them explicitly.
- The text is translated as it stood, including wording that predates the candidate
  status: POL-PR-009 and the delivery section still say "draft", and the delivery section
  still names ACC-PR-001 to ACC-PR-032 next to the already-English paragraph that covers
  every retained and added case. Correcting these is not a translation matter.
- If a reader finds a clause whose English says more or less than the French, the French
  1.0.0 text is the reference for resolving it, and the fix is a further patch.

The [author review](review.md) lists the remaining term choices clause by clause.

## Compatibility and migration

The 1.0.0 contract, traceability, profile interface, review, integration record and
research snapshot are archived unchanged under [history/1.0.0](../../history/1.0.0/README.md).
Existing consumer pins and previous evidence stay attached to their original bytes. No proof
transfers: evidence produced against 0.1.0 or 1.0.0 is not rebound to 1.0.1.

Adopting 1.0.1 is an explicit pin change. Because the obligations are intended to be
identical, an implementation that conforms to 1.0.0 is expected to conform to 1.0.1, but
that expectation is not a verdict: run the suite against the new pin before claiming it.
The [profile interface](../../contracts/targeting-profile.md) keeps its own version 0.1.0
and is translated alongside; the illustrative profiles keep their keys and identifiers.

## Evaluation and decision boundary

All 34 product cases are **not_run**; no implementation target was supplied. Structural
validation passed. The translation was reviewed by its author only. Independent review,
including a bilingual check of the normative clauses, and a recorded maintainer decision
precede stable promotion.
