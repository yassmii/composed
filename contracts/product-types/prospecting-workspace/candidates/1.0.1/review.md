# Author review — prospecting-workspace 1.0.1

Date: 2026-11-12. Mode: **author self-review**, not independent review or human approval.

## Scope

Translation of the 1.0.0 contract and traceability from French to English, with no intended
behaviour change. Checked against the French text:

- every identifier present in 1.0.0 is present in 1.0.1, in the same order, with the same
  priority, actor and observation links, and every traceability basis is unchanged;
- no clause, requirement, invariant, policy, quality attribute or acceptance case is added,
  removed, split or merged;
- quantities (100%, 100,000 records, 50 users, 2 s, 320 CSS pixels, 200%, five and four
  users, the 34 cases) and modal strength (never, only, cannot, must) are kept;
- clause references inside acceptance evidence are the same, in the same order;
- the delivery paragraph that was already in English is unchanged.

The identifier, quantity and reference checks were also run mechanically: key structure,
identifier fields, clause references and digits were compared between the two files. That
comparison does not assess meaning.

## Points for an independent reviewer

- "Interlocuteur" → "contact person"; "coordonnée" → "contact detail"; "possibilité de
  contacter" → "ability to contact"; "contact interdit" → "forbidden contact".
- "Sollicitation" → "solicitation"; "permission de solliciter" → "permission to solicit";
  "remise au prestataire" → "handover to the provider" in REQ-PR-029/033/038, INV-PR-005,
  QA-PR-005 and ACC-PR-016/019/034.
- "Opposition" → "objection" throughout (ENT-PR-011, REQ-PR-004/027/029/033/038/040,
  INV-PR-005/006, QA-PR-005, ACC-PR-002/016/018/022/024/034). In REQ-PR-031, "une
  opposition simple sans connexion" → "a simple way to object without logging in".
- "Liste repoussoir" → "suppression list (liste repoussoir)" in ENT-PR-011 and ACC-PR-022.
- "Information" → "notice" in ENT-PR-011, REQ-PR-012/013/037; "sous-traitants" →
  "processors" in REQ-PR-040/041, ACC-PR-024 and delivery; "base de traitement" → "basis
  for processing"; "sources de droit" → "legal sources"; "contact physique" →
  "natural-person contact" in POL-PR-004.
- "Responsable" → "owner" for records, tasks, campaigns and policies, including the
  policy "responsable" of REQ-PR-037, which a reviewer may prefer to read as the data
  controller; "responsable métier" → "business owner".
- "Prestataire" → "provider"; "fournisseur" → "supplier" in REQ-PR-056, POL-PR-001,
  QA-PR-002, ACC-PR-032 and delivery.
- "Reprise" → "retry" for a repeated operation (MET-PR-003, REQ-PR-030/050, ACC-PR-017/034),
  "resume" for a run (REQ-PR-011, ACC-PR-005/029) and "recovery" after an incident
  (CAP-PR-015, REQ-PR-051, QA-PR-006). "Relance" → "follow-up"; "rappel" → "reminder";
  "rapprochement" → "matching" for identities and "reconciliation" for confirmations and
  operations.
- "Périmé" → "stale" and "expiré" → "expired"; "écarté" → "discarded" and "rejetée" →
  "rejected"; "conclu" → "concluded" and "clôturé" → "closed"; "réalisée" → "completed"
  and "terminée" → "ended".
- "Socle" → "core"; "argumentaire" → "sales argument"; "issue" → "outcome"; "barème
  métier" → "business scoring scale"; "cadence globale" → "global pacing"; "référence
  simple" → "simple baseline"; "Exécution" (ENT-PR-012) → "Run".
- "Copropriétés" → "co-owned buildings (copropriétés)" in ACC-PR-001 and "Cas
  copropriétés-syndic" → "Co-owned building and managing agent (copropriété-syndic) case"
  in ACC-PR-004.
- Actor names: "Chargé de prospection" → "Prospector"; "Responsable d'équipe" → "Team
  lead"; "Référent données et conformité" → "Data and compliance lead".
- Lifecycle labels and the criterion results `satisfied`, `not_satisfied`, `unknown` are
  translated; `en_attente` becomes `waiting` in ENT-PR-006, ENT-PR-010 and ENT-PR-012
  alike. See the proposal for the consequence on implementations that expose them.
- "Draft" in POL-PR-009 and in the delivery section, and the range "ACC-PR-001 to
  ACC-PR-032", are carried over as written in 1.0.0.

## Validation

Candidate contract SHA-256: `7d9659d16622dab87e75991e59bcdf2883c693b83b4b5a8bb518b7eba97b4513`.
Candidate traceability SHA-256: `09522259cc128f8e5ed7e5de34de42c912bfd8b60ccd027af1a76f9e2a23090a`.
Baseline contract SHA-256: `a2754f8c6f50a8a75dc585018bcb37bc81dfc9e55aee20b7d9e1bb345d09fe6e`.
Baseline traceability SHA-256: `49f7d4086700e3befbb23e251b994c83a83b4d925b77a26dcd8e22a6a4dc1836`.

Schema and traceability validation passed and the tooling regression tests passed. The
[native impact report](impact.json) marks every clause as modified with compatibility
not_assessed and proof transfer not_performed. All 34 product cases remain not_run.
