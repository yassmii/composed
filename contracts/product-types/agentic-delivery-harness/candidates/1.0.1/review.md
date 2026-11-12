# Author review — agentic-delivery-harness 1.0.1

Date: 2026-11-12. Mode: **author self-review**, not independent review or human approval.

## Scope

Translation of the 1.0.0 contract and traceability from French to English, with no intended
behaviour change. Checked against the French text:

- every identifier present in 1.0.0 is present in 1.0.1, in the same order, with the same
  priority, actor and observation links; lifecycle labels and traceability bases are
  identical;
- no clause, requirement, invariant, policy, quality attribute or acceptance case is added,
  removed, split or merged;
- quantities (zero, the 26 cases) and modal strength (never, only, cannot, must) are kept;
  French infinitive and indicative statements are rendered as English imperatives and
  indicatives, without adding "must" or "should";
- the verification paragraph that was already in English is unchanged.

## Points for an independent reviewer

- "Preuve" → "evidence" (and "prouver" → "prove"); "contre-preuve" and "contre-evidence" →
  "counter-evidence"; "empreinte" → "fingerprint".
- "Contrôle imposé" → "enforced control"; "effectivement imposé" → "actually enforced";
  "réellement autorisée" → "actually authorised" in REQ-ADH-022, ACC-ADH-006 and ACC-ADH-026.
- "Périmètre" and "portée" → "scope" in both cases; "cadrage" → "framing" in REQ-ADH-008.
- "Responsable" → "responsible party" (REQ-ADH-027, REQ-ADH-036, ACC-ADH-007) and
  "propriétaire" → "owner", but the actor "Responsable du projet" → "Project owner" to match
  its identifier ACT-ADH-OWNER.
- "Passage" → "handover" (REQ-ADH-013, REQ-ADH-014, ACC-ADH-009), while the French "handoff"
  stays "handoff"; "reprise" → "resumption"; "clôture" → "closure".
- "Recette native" → "native acceptance check" in ACC-ADH-014.
- "Veille" → "watch" (glossary, ACC-ADH-018); "nouveautés" → "new developments".
- "Évolution" → "evolution" in the name of CAP-ADH-001 but "change" in ENT-ADH-CHANGE
  ("Change proposal"), ACT-ADH-MAINTAINER, REQ-ADH-029 and ACC-ADH-019.
- "Livraison" → "delivery" and "déploiement" → "deployment"; "déploiement progressif" →
  "progressive deployment" (REQ-ADH-036); "admissible à livraison" → "eligible for delivery".
- "Lot" → "batch" (ACC-ADH-007, ACC-ADH-008); "squelette" → "scaffolding" (REQ-ADH-005);
  "arbitrages" → "trade-off decisions" (ACT-ADH-ORCHESTRATOR); "réglage" → "tuning" and
  "faux blocages" → "false blocks" (REQ-ADH-025); "juge" → "judge" and "évaluateur" →
  "evaluator" (ACC-ADH-016).
- "Approbation usurpée" → "spoofed approval" in QA-ADH-001.
- "Une sortie réussie" → "a successful exit" in REQ-ADH-017 and "la sortie du processus" →
  "the exit of the process" in INV-ADH-003: read as process exit rather than output.
- "Dépasse son délai" → "exceeds its time limit" (REQ-ADH-022, ACC-ADH-014); "voie" →
  "path" (REQ-ADH-022, ACC-ADH-026).
- In REQ-ADH-002, "local" is placed before the whole list ("local decisions, work, evidence
  and adaptations"); in ACC-ADH-022, "protected" qualifies existence only, as in the French.
- The contract name, actor, entity, glossary and quality-attribute names are translated; see
  the proposal for the consequence on implementations that expose them.

## Validation

Candidate contract SHA-256: `3ec1686de5a77d37536923b45dee6c8daf0982474358ad0208f81151dbcd4d3e`.
Candidate traceability SHA-256: `b142003e13f3cf2b09e77cfe2fae7d5878b93aa272667d29c3931d1e87631f56`.
Baseline contract SHA-256: `d9cd1625bc525cbe57e2c98f342c630daca26c1aea2a28696234093bf76e7761`.
Baseline traceability SHA-256: `084281ca3dc4bad3b93c8c95dcbc56b03dd7a59d0ad9e159548432be3a105f78`.

Schema and traceability validation passed and the tooling regression tests passed. The
[native impact report](impact.json) marks every clause as modified with compatibility
not_assessed and proof transfer not_performed. All 26 product cases remain not_run.
