---
name: contract-reviewer
description: Review a Composed Contract for evidence traceability, technology neutrality, internal consistency, and testable acceptance criteria.
---

# Contract reviewer

Use this skill to review a product-type unit before a contract is promoted or materially changed.

Check that important clauses link to research observations or are clearly marked as project choices. Check that every capability actor exists, invariants can actually remain true, policies have a consequence, and acceptance scenarios prove the claimed behaviour.

Reject hidden technology prescriptions: a contract may state a required external integration or measurable constraint, but it must not mandate an implementation language, framework, database, or cloud provider without explicit product authority.

For delivery evidence, check that each claimed acceptance or quality proof is observable by
a third party. If `delivery.validation_profile` is present, verify that it is a versioned,
technology-neutral reference to external evidence; reject a profile entry that smuggles in
an adapter transport, framework, or privileged test bypass. Distinguish a planned external
case from an executed conformance result.

Report findings by contract identifier. From the Composed repository root, run `npm run validate:contracts` and distinguish schema failures from product-design concerns.

For format 0.2 or proof/impact reports, read `../../docs/verification.md`. Check explicit acceptance
links and dependencies, selected versus omitted scope, required proof dimensions, exact contract/
checker/target applicability and unresolved contradictions. Missing, partial or unexecuted cases
cannot pass. Distinct reviewer IDs remain declarations, and accepted clause correspondence does
not transfer proof. Keep structural validity, scoped evidence consistency, actual product behavior
and human product acceptance distinct.

For evolution proposals, inspect source freshness and counterevidence, the pinned
baseline, migration impact and evaluation controls using `../../docs/continuous-evolution.md`.
Do not accept removal of failing cases merely to improve a score. Separate author
checks from independent review, and review verdicts from deployment authorization.
