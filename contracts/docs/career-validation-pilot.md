# Prepared CEP consumer pilot

This pilot describes the now-archived 0.1.0 contract and its proposed external
profile. The [canonical integration](candidate-integration-2026-11-01.md) now
selects 1.0.0 candidate; this pilot and its external 0.1.0 profile do not establish
coverage or acceptance of the new bytes. The earlier contract is preserved at
[history/0.1.0](../product-types/career-evidence-platform/history/0.1.0/contracts/contract.yaml).


This is a proposal for the next consumer exercise, **not** a new product requirement, validation
profile release, actual consumer product run or authorization to change a consumer pin.

The archived career contract is format 0.1, product version 0.1.0. Its external
`career-evidence-platform/conformance@0.1.0` profile already declares 28 cases covering 114
matrix anchors: 92 normative REQ/INV/POL/QA clauses and 22 acceptance scenarios. The external runner owns those cases, six external-review gates and its exact
validation assets. A complete declared matrix is not a candidate result.

| Pilot behavior | Existing normative anchors | Existing acceptance / runner case | Required observation |
| --- | --- | --- | --- |
| Revocation on subsequent protected access | REQ-CEP-036, INV-CEP-007 | ACC-CEP-012 / CEP-ACC-012 | A previously authorized recipient is refused after revocation, including the cached-link path. Retained/downloaded-copy limits remain explicit. |
| Retry without duplicate committed changes or charges | REQ-CEP-044 | ACC-CEP-015 / CEP-ACC-015 | Actual interrupted/retried operation, durable change and charge observations. The synthetic grant example does not establish metering behavior. |
| Preservation of a confirmed correction | INV-CEP-003 | ACC-CEP-006 / CEP-ACC-006 | A real correction survives regeneration, or enters explicit conflict review without silent overwrite; stale derived claims are identifiable. |

Read the current canonical contract and its research first; inspect the locked runner matrix for
the complete case claims rather than assuming these selected anchors exhaust them. Use the runner's
black-box adapter protocol and real product/admin interfaces. Actual candidate revision, adapter,
fixtures and any review bundle must be recorded independently. Fixture replay controls remain
validator self-tests and cannot stand in for consumer product observations.

Two separate adoption paths remain possible:

1. Run the existing independently pinned profile under its existing rules. This does not require
   upgrading a product contract's syntax or using the new evaluator.
2. Propose a format-0.2 migration with explicit reviewed `verifies`, dependencies and proof policies,
   retaining the same intended behavior and explaining any stronger evidence obligation. Review
   compatibility, profile/asset versions and consumer adoption before changing pins. The generic
   evaluator intentionally returns `not_assessed` for 0.1 instead of mining prose into requirements.

For either path, start with the selected cases and report omitted cases and required dependencies.
Do not call that complete profile conformance. Missing manual evidence, unavailable failure injection,
unsupported product operations or changed target/checker bytes remain blocked/unrun/stale as applicable.
The reviewer of an adapter must inspect that normalized facts come from real actions, not expected
assertions or private implementation imports.

Exit for this proposed pilot: actual candidate observations, exact input/output identities, meaningful
positive and negative controls, preservation of the unchanged contract and an independent scoped
review. Product usefulness and production readiness remain separate judgments. No candidate or
sibling validation repository is changed by the tooling implementation in Composed.
