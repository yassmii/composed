# BOOK-2026-10: capacity and payment-boundary pilot

- Status: **proposed**; candidate version 1.0.0, contract status **candidate** (updated 2026-11-01).
- Scope: existing saas-booking family; baseline 0.1.0, format 0.1.
- Trigger: user-requested primary research refresh, 2026-10-31.
- Classification: contract and verification gaps; no implementation incident claimed.
- Author: repository agent. Decision authority: Composed maintainer; no independent
  approval or promotion has been recorded.

## Evidence and behaviour

Eight current first-party pages (four refreshed), seven new observations, and their exact hashes are in
shared research. The comparison records a narrow availability convergence and
administrator bypasses as counterevidence. Existing transaction guarantees
are deliberate choices, not facts inferred from vendor feature names.

The 0.1.0 capacity-reduction requirement protects confirmed bookings only, while
its invariant also protects holds. Candidate REQ-BOOK-004 makes both explicit.
REQ-BOOK-002 distinguishes allocation from hold conversion. POL-BOOK-001 defines
the expiry boundary and duplicate-result effects; new POL-BOOK-003 covers late
successful payment without resurrection. Cancellation releases once and original
commitment data survives display-zone changes. INT-BOOK-001 distinguishes trusted,
matching success from unavailable or invalid results. Acceptance grows from two
to twelve scenarios, with capacity, clock, actor and failure observations.

## Compatibility and migration

These are new mandatory behaviours and evidence obligations, not an editorial
patch. The conservative proposed version is **1.0.0**, in a separate candidate
folder; the number does not promote the candidate to stable. Existing identifiers are retained
where they refer to the same booking concept; their strengthened meanings and
new POL-BOOK-003 require revalidation. No clause is deleted. Scope explicitly
excludes automatic refunds and disputes. The original contract and traceability
remain byte-for-byte intact; previous research source records are retained in
research/history/sources-2026-10-14.yaml:

- contract.yaml SHA-256: `c9f9e904483f2744a53124e5b9926087e333de941bc361d6f4749b74838872a3`
- traceability.yaml SHA-256: `b7771578a3c5b6f3871fd4e006e5d4105b73caf02103c6f12607a47ab50e5ae6`
- repository baseline: `168f198f0f6c433aca720e09033cf6ba8f84ce91`

No consumer reference, lock, stack or Build Kit file changes. Adoption requires an
explicit new pin to the reviewed candidate and execution of its whole acceptance
suite plus the retained concurrency and accessibility targets. Old proof remains
historical. Rollback keeps/restores the consumer's old pin; it does not make new
behaviour conform to the old version automatically.

## Format decision and evaluation

Keep format 0.1 for this bounded research pilot. A prose clause-to-case matrix is
reviewable without changing the proof format or requiring an implementation
adapter. Format 0.2 would help machine-check proof dimensions in a later explicit
migration; no equivalent structured coverage is claimed for this matrix.

Frozen candidate controls: last-seat race (2 and 100 requests), capacity reduction
at/below allocated quantity, expiry just before/at/after E, pre-expiry success and
duplicates, late success after reallocation, invalid/missing/mismatched results,
authorised/unauthorised/repeated cancellation, changed display zone, and keyboard
booking. Record revision, configuration, outcomes, clock and capacity observations, including a payment/expiry/reallocation race.
A confirmation run must not silently drop negative cases or change fixtures.
No implementation is provided in this session: all product cases are **not_run**,
with unknown duration and field outcomes. Structural checks and the synthetic
repository example are reported separately in review.md.

Exit condition for this session: concrete draft, research, traceability, validation,
and a labelled author review. Promotion to stable remains pending independent review and a recorded maintainer
decision. Implementation evidence is required to assess a product, not to
stabilize the specification. No schedule or background service is created.
