# Author review — video-editorial-workflow 1.0.1

Date: 2026-11-12. Mode: **author self-review**, not independent review or human approval.

## Scope

Translation of the 1.0.0 contract and traceability from French to English, with no intended
behaviour change. Checked against the French text:

- every identifier present in 1.0.0 is present in 1.0.1, in the same order, with the same
  priority, actor and observation links;
- no clause, requirement, invariant, policy, quality attribute or acceptance case is added,
  removed, split or merged;
- quantities (100%, the nine cases) and modal strength (never, only, cannot) are kept;
- the delivery paragraph that was already in English is unchanged.

## Points for an independent reviewer

- "Recette" → "acceptance check" in REQ-VEW-008, QA-VEW-005, INT-VEW-001, ACC-VEW-003 and
  ACC-VEW-009. The term must stay distinct from the contract's acceptance cases.
- "Matière" → "material", "prise" → "take", "figé" → "frozen", "repère" → "marker",
  "cadence" → "frame rate".
- Lifecycle labels are translated; see the proposal for the consequence on implementations
  that expose them.

## Validation

Candidate contract SHA-256: `e3488a4ffc874b50ec43817648f4edccc97d76686832398877df825c2829f0ca`.
Candidate traceability SHA-256: `11d81b54e3cbe7feb47fd9bd29d371141fa9443649775e09b3c1bfcee128487a`.
Baseline contract SHA-256: `e922dca59c17f2a4ee9e8e955ef2ddd7304fce5ae701be570f3374113a42adea`.
Baseline traceability SHA-256: `e4d8f71698afa829fe0fb645c7a28634eec7d7c5ec9c72fa826dbf0177c684e5`.

Schema and traceability validation passed and the tooling regression tests passed. The
[native impact report](impact.json) marks every clause as modified with compatibility
not_assessed and proof transfer not_performed. All nine product cases remain not_run.
