# Author review — BOOK-2026-10

Date: 2026-10-31. Verdict: **draft internally reviewed; not promoted**.
This is a separate author-review pass after research and drafting, not an
independent human or agent approval. Independent review remains pending before
promotion under continuous-evolution.md. No implementation conformance is claimed.

## Findings and corrections

- **Provenance / INV-BOOK-001, CAP-BOOK-002:** vendor availability validation,
  seated acceptance and event names do not prove atomicity or unconditional
  rejection. Candidate traceability labels chosen guarantees and records Acuity's
  administrator bypass. Reviewing refreshed Cal.com limits found another exception
  (`skipBookingLimits`, OBS-BOOK-011); a booking-limit bypass is not itself evidence
  of a seated-capacity bypass.
- **Freshness / OBS-BOOK-001–004:** the first all-source run found four changed
  Cal.com HTML hashes. Current official pages were read, the old observations
  checked against their relevant sections, and an atomic exception added. Only
  then were active records updated to their official Markdown representations
  and actual response hashes. Original source records remain byte-for-byte in
  research/history/sources-2026-10-14.yaml. Old page bodies are unavailable, so
  the exact historical page diff and date of any behaviour change are unknown.
- **Consistency / REQ-BOOK-004:** capacity reduction now accounts for unexpired
  holds as well as confirmed units; rejecting below the allocated sum has explicit
  before/after evidence. The existing invariant was stricter than this requirement.
- **Boundary / POL-BOOK-001, POL-BOOK-003:** clarify that the allocation decision
  instant determines the expiry boundary, confirmation converts an active hold,
  and only pending-payment reservations expire. Confirmation uses its own hold
  without requiring a second available unit; the late-payment policy applies to
  expired reservations, not an already confirmed reservation receiving a duplicate. This avoids an accidental
  cancelled-to-expired transition. ACC-BOOK-012 adds the previously missing
  payment/expiry/reallocation race, beyond sequential late-result tests.
- **Evidence / ACC-BOOK-001, ACC-BOOK-002, ACC-BOOK-009:** exclude required payment
  from the unpaid last-seat fixture, explicitly check payment status in the paid
  confirmation, and include authorised and out-of-scope operator controls plus
  pre-confirmation disclosure of the cancellation policy.
- **Neutrality:** no language, transport, persistence algorithm, vendor or
  deployment architecture is prescribed. Atomicity and exactly-once capacity
  effects are observable guarantees, not a mandated transaction technology.
- **Compatibility:** these stronger obligations are breaking; candidate 1.0.0 is
  separate, while 0.1.0 contract and traceability hashes are preserved. No old proof
  is transferred. The existing 95-percent metric and 100-request target remain
  chosen targets, not measured or newly research-validated thresholds.

## Reviewed clause-to-case matrix

This is a manual mapping of intended evidence, not format-0.2 static coverage or
executed results. Capabilities are represented by their requirement rows.

| Clause | Acceptance / additional observation required |
| --- | --- |
| REQ-BOOK-001 | ACC-BOOK-003: schedule, conflict, booking limit, zone and capacity |
| REQ-BOOK-002 | ACC-BOOK-001, 003, 006, 012: competing allocations, stale display, conversion and boundary race |
| REQ-BOOK-003 | ACC-BOOK-002: confirmation fields including payment status |
| REQ-BOOK-004 | ACC-BOOK-004: rejected and allowed capacity edits with unchanged history |
| INV-BOOK-001 | ACC-BOOK-001, 004, 005, 006, 007, 012: ledger conservation and capacity bounds |
| INV-BOOK-002 | ACC-BOOK-010: recorded commitment vs display, DST overlap and date boundaries |
| INV-BOOK-003 | ACC-BOOK-009: owner, unrelated customer, authorised and out-of-scope operator |
| POL-BOOK-001 | ACC-BOOK-005, 006, 008, 012: expiry disclosure, exact boundary, missing result, duplicate and race |
| POL-BOOK-002 | ACC-BOOK-009: policy shown before confirmation, booking-time rule and single release |
| POL-BOOK-003 | ACC-BOOK-007, 012: expired payment, duplicate, competing allocation and visible reconciliation |
| QA-BOOK-001 | ACC-BOOK-001 plus its mandatory 100-request variant; all outcomes and final allocation |
| QA-BOOK-002 | ACC-BOOK-011: keyboard journey and field names; no blanket accessibility certification |
| INT-BOOK-001 | ACC-BOOK-006, 007, 008: successful, late, unavailable, unsuccessful, forged and mismatched result |

## Actual verification

Environment: native Linux Node **24.15.0**, existing checkout dependencies; no
installation or Build Kit change. Node was absent from the shell PATH, so commands
used the existing fnm installation on PATH. Shell commands were prefixed with rtk.
Raw logs and third-party response bodies are outside Git and are not deliverables.

| Command | Observed result |
| --- | --- |
| `npm run validate:contracts` | Pass, including candidate schema and candidate source→observation→clause traceability. |
| `npm run test:contracts` | Pass: 67 tests, including positive candidate discovery and negative version/link/source controls. These test contract tooling, not a booking product. |
| `npm run example:contracts` | Pass: synthetic reference accepted, semantic counterexample rejected, changed checker marked stale, dependent cases selected. Booking conformance remains not_assessed. |
| `npm run verify:research` | Exit 1 globally; **booking baseline and candidate pass**, all eight active booking source hashes retrieved and matched. Seventeen hash mismatches and three retrieval errors remain outside the pilot. |
| `npm run contracts:compare -- --before contracts/product-types/saas-booking/contracts/contract.yaml --after contracts/product-types/saas-booking/candidates/1.0.0/contracts/contract.yaml --json` | Assessed: POL-BOOK-003 added, none removed, existing clauses/cases conservatively selected due to content and context changes. Format-0.1 targeted coverage unknown; compatibility not_assessed by tool; proof_transfer not_performed. |
| Booking implementation cases ACC-BOOK-001–012 | **not_run**: no implementation revision or product runner supplied. |

The all-source check also ran before the source refresh. The same twenty remaining
outside-pilot failures were already present in that run against unchanged manifests:

| Family | Unresolved source failures |
| --- | --- |
| agentic-delivery-harness | SHA mismatch: SRC-ADH-CLAUDE-HOOKS |
| career-evidence-platform | SHA mismatches: SRC-CEP-SKILLSPAN, SRC-CEP-CAREER-RAG-2026, SRC-CEP-ESCO-EQF |
| collaborative-workspace | SHA mismatches: SRC-CWS-NOTION-PERMISSIONS, SRC-CWS-NOTION-HISTORY, SRC-CWS-AIRTABLE-HISTORY, SRC-CWS-AIRTABLE-AUTOMATIONS |
| e-commerce | SHA mismatch: SRC-COM-SHOPIFY-CART |
| prospecting-workspace | SHA mismatches: SRC-PR-CNIL-FAQ, SRC-PR-STRIPE-IDEMPOTENCY, SRC-PR-STRIPE-EVENTS, SRC-PR-RNIC, SRC-PR-PIPEDRIVE, SRC-PR-PIPEDRIVE-FORMS; SRC-PR-COPRO retrieval ECONNRESET |
| video-editorial-workflow | SHA mismatches: SRC-VEW-FRAME-COMMENTS, SRC-VEW-FRAME-COMPARE; SRC-VEW-PREMIERE-EDL and SRC-VEW-PREMIERE-FORMATS retrieval HTTP 403 |

These are freshness or retrieval failures, not observed product failures. Their
causes and behavioural impact have not been investigated here. No unrelated hash
was changed to make the global check pass.

## Remaining limits and next step

A third booking product, provider-specific payment/compensation research and an
independent review remain promotion work. The 95-percent completion metric still
needs an agreed observation window and denominator before evaluation. Product
scenarios, workload execution, human product acceptance and real deployment are
not established by this session. Research observations do not validate those
thresholds or imply a functioning booking product.

Stop after this reviewed draft. Recommended next family: **e-commerce**, with
payment-result, stock-allocation and repeated-event research before editing rules.

## Maturity update — 2026-11-01

Following the maintainer's request, the 1.0.0 contract now has status `candidate`:
its proposed wording, provenance and acceptance scenarios are ready for independent
review. The 2026-10-31 author-review record above remains historical; it is not
independent approval. Version 1.0.0 and format 0.1 are retained, as are all product
clauses and the unchanged 0.1.0 consumer baseline.

The format 0.1 and 0.2 schemas now accept `candidate`, with maturity definitions
in the contract system guide. Stable promotion still needs independent review and
a recorded maintainer decision. The earlier promotion-work list combines research
follow-up and implementation work: it is not a universal requirement to implement
a product before stabilizing its specification. Additional research questions
remain review inputs; implementation cases remain not_run and separate from
contract maturity. No previous evidence is rebound to the changed contract bytes.

Validation for this maturity update: `npm run validate:contracts` passed;
`npm run test:contracts` passed (68 tests), including acceptance of all four
maturity statuses and rejection of unknown values in both schema formats.
The 0.1.0 contract and traceability bytes still match the repository baseline.
No research retrieval was repeated for this status-only update.
