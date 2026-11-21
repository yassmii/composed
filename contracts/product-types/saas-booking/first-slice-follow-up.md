# Booking first-slice follow-up

Proposal for the next reviewed contract revision, based on gaps found while building a small
room-booking slice. The canonical baseline is [1.0.0 candidate](contracts/contract.yaml).

| Gap | Proposed contract change | Evidence impact |
| --- | --- | --- |
| Cancellation appears in scope and rules, with no capability or requirement of its own. | Add `CAP-BOOK-004` and `REQ-BOOK-005` for cancellation by the customer or an operator authorised for the resource, subject to the policy accepted for that booking. A successful cancellation releases capacity exactly once. | Link to `INV-BOOK-003`, `POL-BOOK-002` and `ACC-BOOK-009`. Verify the same outcome on repeated requests and separately exercise the three actor boundaries. |
| `REQ-BOOK-001` and `ACC-BOOK-003` refer to a configured booking limit without defining it. | Document each configured limit's subject, resource scope, counting unit, time window or absence of one, threshold and included reservation states. Projects choose the values. Apply the same rule to availability and the authoritative allocation decision. | Test below and at the configured threshold. A request based on stale availability must leave the allocation unchanged. Verify that unrelated subjects or resources are unaffected according to the declared scope. |

For external validation, start from an immutable lock of the selected contract revision in
`composed-validation`. The first runner should exercise `ACC-BOOK-001`, `ACC-BOOK-003` and the
customer subcases of `ACC-BOOK-009` against public product interfaces. Use isolated fixture data
and synchronized requests. Capture both outcomes and final availability or capacity evidence
through a documented interface. Record missing operator checks separately and keep the full
`ACC-BOOK-009` case unpassed until all actor and policy checks run. The complete profile should
enumerate all twelve acceptance cases, with explicit verdicts for uncovered cases.

Before promotion, review the proposed requirements against the existing research, update
traceability, and publish a new candidate with a migration note. Profile implementation and an
external run are separate deliverables.
