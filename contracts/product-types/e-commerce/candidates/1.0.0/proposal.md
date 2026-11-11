# COM-2026-11 — payment and stock refresh

Date: 2026-11-01. Status: proposed; version 1.0.0, maturity candidate, format 0.1.
Author: repository agent. Decision authority: Composed maintainer. Independent
review and stable promotion are pending. The deeper research pass is deferred.

## Before and after

Baseline 0.1.0 has four requirements and two cases. Idempotency, expiry, refunds
and access have sparse acceptance; late success after reallocation has no policy.
The candidate keeps all original IDs and adds REQ-COM-005/006 and POL-COM-003:
all-or-none holds, one-time conversion, explicit expiry decision time, matched
payment verification, retries across restart and visible late-funds reconciliation
without resurrection. It clarifies aggregate refund accounting and separates
settlement, shipment and physical restocking. Twelve cases cover these obligations
and inherited checkout, access, audit and carrier behaviour.

Six current primary sources and eleven observations support this update. Three
Stripe integration pages complement the original storefront sources. Vendor facts
and stronger local choices are distinguished. The original manifest is preserved;
no historical behavioural diff or vendor concurrency guarantee is invented.

## Compatibility and migration

These stronger mandatory behaviours and evidence are breaking relative to 0.1.0;
1.0.0 is a separate candidate, not a stable release. Baseline contract/traceability
remain unchanged at repository commit `03a4bc1e3099046ab5b04cbdf344cb1a55d50ae3`:

- contract SHA-256: `5ee711446eb1772122f2eddacfe4a0499c77e78d5e11b50af035b4370f6e1625`
- traceability SHA-256: `d78acccee311b3993219f26dd9f2b6dfaf1e5fe93ef0c4eaa13e55041487aecf`

Adoption requires an explicit new consumer pin, review of stock/payment/refund
state mapping and execution of all twelve cases on the identified revision.
No consumer, Build Kit, technology or existing proof changes. Shared IDs do not
transfer proof. Rollback retains/restores the previous pin; adopting implementations
must assess their own data migration and operational rollback.

## Evaluation and boundary

Keep format 0.1: no implicit migration or structured coverage claim. The manual map
is in review.md. Confirmation must record implementation revision, fixtures,
provider/carrier simulation, clock decisions, amount/currency and complete order,
stock and refund histories, including concurrent, restart and negative controls.
All product cases are not_run. Tooling checks and the synthetic example establish
only their stated results, not a functioning store or human product acceptance.

Session exit: documentary candidate, provenance, validation and labelled author
review. Deepening questions are listed in research/README.md. No automatic refund
execution, dispute module, technology choice or benchmark is claimed. Independent
review precedes stable promotion; implementation conformance remains separate.
