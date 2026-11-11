# Author review — COM-2026-11

Date: 2026-11-01. Verdict: **candidate ready for independent review**.
This is an author check, not independent approval, stable promotion, product
execution or human acceptance. The requested deepening pass is deferred.

## Findings and corrections

- **REQ-COM-002 / INV-COM-001:** a cart is not reserved inventory. Define all-or-none
  allocation, disjoint held/committed accounting and conversion of the existing
  hold without a second decrement. ACC-COM-001 requires an actual successful
  purchase and final zero availability, so rejecting every checkout cannot pass.
- **REQ-COM-003 / QA-COM-002:** provider key retention is not indefinite business
  deduplication. Keep a stable operation across restart and reconcile unknown
  outcomes. Safe provider retries are allowed under that identity; the guarantee
  is one capture operation, not an impossible ban on retrying a request.
- **REQ-COM-005 / POL-COM-001/003:** payment authorisation, browser return,
  verified success and stock commitment differ. Strict decision-time expiry
  covers exact E, delayed cleanup and payment/reallocation ordering. Late funds
  are recorded without resurrecting the order or taking another shopper's stock.
  The race fixture specifies the late branch; the before-E fixture covers the
  successful competing order. Failure and unknown-result controls are separate.
- **POL-COM-002:** use aggregate completed plus unresolved refunds, not only a
  per-request limit. Pending and failure cannot masquerade as returned funds;
  duplicate completion and failure release effects apply once. Authorised and
  unauthorised controls are required.
- **REQ-COM-004/006 / INV-COM-002:** paid snapshot immutability includes address,
  currency, tax and shipping. Refund records do not overwrite purchase facts or
  automatically restock shipped goods. Return processing cannot restock twice.
  Merchant authority includes refunds and recorded returns; system fulfilment
  acts under that authority. This does not add a returns-inspection module.
- **INT-COM-002:** clarify the inherited carrier outage/resume obligation with
  unknown-outcome reconciliation. One shipment effect is an explicit product
  choice; no carrier documentation or observed carrier conformance is claimed.
- **Provenance:** six bodies were read and hashed with native verifier rules.
  Original source metadata is retained. Vendor reservation/state descriptions
  do not prove atomicity, no-backorders or an expiry race guarantee; traceability
  marks these as local choices. Stripe is integration evidence, not another store.
- **Compatibility and scope:** keep format 0.1, baseline bytes and clause IDs.
  The three added clauses and stronger cases are breaking obligations, proposed
  separately as 1.0.0 candidate. No implementation stack or proof transfer follows.

## Manual clause-to-case map

Capabilities are represented by their requirements. This map describes planned
evidence, not format-0.2 static coverage or executed product results.

| Clauses | Planned cases |
| --- | --- |
| CAP-COM-001 / REQ-COM-001 | ACC-COM-009: estimates, accepted final values and changed-price rejection |
| CAP-COM-002 / REQ-COM-002 | ACC-COM-001/004/005: atomic allocation, own-hold conversion, boundary and race |
| REQ-COM-003 | ACC-COM-003/006: concurrent duplicates, distinct result events, restart, changed identity parameters, unknown outcome |
| REQ-COM-005 | ACC-COM-003/005/006: authenticated matching results and non-regression |
| CAP-COM-003 / REQ-COM-004 | ACC-COM-008/010/012: authorised progress, audit, stale results and carrier recovery |
| REQ-COM-006 | ACC-COM-011: protected allocations, repeated cancellation and separate restock |
| INV-COM-001 / MET-COM-002 | ACC-COM-001/004/005/011: stock conservation through allocation, expiry, cancellation and shipment |
| INV-COM-002 / MET-COM-001 | ACC-COM-002/007/009: preserved accepted snapshot and separate refund records |
| INV-COM-003 | ACC-COM-008: owner versus unrelated shopper, including guessed references |
| POL-COM-001 | ACC-COM-004/005: before/at/after expiry, delayed cleanup and reallocation race |
| POL-COM-002 | ACC-COM-007: aggregate cap, concurrent requests, retry, pending, failure and authority |
| POL-COM-003 | ACC-COM-005: late funds without resurrection and actionable reconciliation |
| QA-COM-001 | ACC-COM-007/010/011/012: refund, order, inventory and carrier correlations |
| QA-COM-002 / INT-COM-001 | ACC-COM-003/005/006/007: repeated/reordered results, outage and truthful uncertainty |
| INT-COM-002 | ACC-COM-012: unavailable carrier, unknown label result and recovery |

All ACC-COM-001–012 are **not_run**. No implementation revision, fixture execution,
performance measurement, live deployment or authenticated reviewer is supplied.
Wider domain and provider research remains in research/README.md for deepening.

## Observed tooling validation

Environment: existing Linux Node 24.15.0 and checkout dependencies; no install or
Build Kit change. Commands use the existing fnm Node installation on PATH.

| Check | Observed result |
| --- | --- |
| `npm run validate:contracts` | Pass: baseline/candidate schemas and source→observation→clause links. |
| `npm run test:contracts` | Pass: 68 contract-tooling tests; these do not test a storefront. |
| `npm run example:contracts` | Pass: synthetic reference accepted, semantic counterexample rejected, changed checker stale, dependent cases selected. |
| Native `review(unit, true)` for e-commerce plus candidate review against shared research | Pass: all six source hashes retrieved and matched, with no baseline/candidate traceability errors. |
| `npm run contracts:compare -- --before contracts/product-types/e-commerce/contracts/contract.yaml --after contracts/product-types/e-commerce/candidates/1.0.0/contracts/contract.yaml --json` | Assessed: REQ-COM-005/006 and POL-COM-003 added; no normative ID removed. Conservative selection of all clauses/cases; format-0.1 targeted coverage unknown, compatibility not_assessed by tool, proof_transfer not_performed. |
| Baseline and archived manifest preservation | Byte-for-byte comparison with HEAD passes for the baseline contract, traceability and original source manifest. |

The full cross-family network verification was not rerun. Previous reviews record
unrelated freshness/retrieval failures; their current state is not assessed by
this scoped update. No outside-family source hash was changed. Raw third-party
bodies and temporary research scripts remain outside Git.

Independent review and a maintainer decision are required for stable promotion.
Implementation acceptance is a separate task. No commit or push is performed.
