# Booking SaaS pilot

The consumer baseline remains [`0.1.0`](contracts/contract.yaml), with unchanged
bytes and identifiers. The proposed [`1.0.0` candidate](candidates/1.0.0/contracts/contract.yaml)
has status **candidate**: ready for independent review, not the default contract
and not an approved migration.
Both use contract format **0.1**.

Read the [research](research/README.md), [comparison](research/comparison.md),
[change proposal](candidates/1.0.0/proposal.md), and
[author review and validation](candidates/1.0.0/review.md).
Candidate traceability consumes this family's shared research; the native
validator checks both baseline and candidate on every contract validation run.

Do not change a consumer pin until it explicitly adopts the reviewed version.
The numeric candidate version reserves a breaking proposal; it does not declare
release readiness. Independent review remains required before promotion.
