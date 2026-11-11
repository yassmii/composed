# Booking comparison — 2026-10-31

The initial single-product comparison remains historical context for 0.1.0.
This pass refreshes four sources and adds four sources and seven atomic
observations without changing old source or observation identifiers. All new claims concern documented behaviour;
no live bookings or vendor concurrency tests were executed.

| Observation | Source and precise locator | Fact and limit |
| --- | --- | --- |
| OBS-BOOK-005 | [Cal.com Reserve a slot](https://cal.com/docs/api-reference/v2/slots/reserve-a-slot.md), description, `reservationDuration`, response `reservationUntil`; API header 2024-09-04 | Temporary exclusion and expiry are documented. No guarantee about payment coupling, races, cleanup timing or seated-event composition is established. |
| OBS-BOOK-006 | [Cal.com Offer seats](https://cal.com/help/event-types/offer-seats.md), Turn on seats / Review seat requests; unversioned help | Seated attendance is bounded and acceptance checks remaining seats. No evidence of atomic allocation under concurrent requests. |
| OBS-BOOK-007 | [Acuity available times](https://developers.acuityscheduling.com/reference/get-availability-times.md), description and `calendarID`; API v1, page updated 2025-06-09 | Available times depend on appointment type, date and optionally calendar. No promise that displayed availability survives a concurrent booking. |
| OBS-BOOK-008 | Same page, `timezone` | Named-zone conversion is supported. It does not establish retention of the original commitment or daylight-saving ambiguity handling. |
| OBS-BOOK-009 | [Acuity appointment creation](https://developers.acuityscheduling.com/reference/post-appointments.md), Availability; API v1, page updated 2025-06-09 | Client creation validates availability by default. Transaction isolation and race outcomes are unspecified here. |
| OBS-BOOK-010 | Same page, Booking as an Admin | Administrative creation can disable availability checks. This is counterevidence to calling an unconditional no-bypass invariant a common market rule; it does not prove Acuity actually overbooks in a particular configuration. |

All eight active sources were consulted and byte-hashed on 2026-10-31. See sources.yaml
for exact hashes and page/API identities; a live page date is not a product release pin.

The refreshed historical sources also support OBS-BOOK-001 (link settings and
calendar conflicts), OBS-BOOK-002 (UTC creation and attendee zone), OBS-BOOK-003
(ordinary limit enforcement), and OBS-BOOK-004 (distinct lifecycle triggers).
Limits do not universally prohibit administrator overrides: new OBS-BOOK-011
records `skipBookingLimits` in the Cal.com limits page, section Check how much of
each limit is used. This allowance concerns booking limits, not proof of a seated
capacity bypass. The source formerly titled Event Types now says What are Links;
its observed settings remain supported. Webhook names do not prove exactly-once
effects, mandatory signatures or transaction semantics.

## Narrow convergence

Cal.com's refreshed schedule/conflict/limit observations (001, 003) and Acuity's
current available-time observation (007) support calculated client availability.
They do not establish a universal definition of capacity, a payment lifecycle or
an atomic allocation algorithm. The Cal.com limits source also documents an administrator bypass (011); the
convergence concerns ordinary client availability, not an unqualified no-bypass
rule.

## Explicit product choices in candidate 1.0.0

- REQ-BOOK-002, REQ-BOOK-004 and INV-BOOK-001 require indivisible allocations,
  single conversion of holds, and protection of unexpired held quantity during
  operator capacity reductions. This prioritises existing commitments over the
  administrative bypass illustrated by Acuity; no bypass is introduced.
- INV-BOOK-002 retains both accepted instant and original zone. Creation fields
  and zone conversion alone never proved immutable retention; its old pure-pattern
  classification was too strong and is corrected only in candidate traceability.
- POL-BOOK-001 adopts expiry at `now >= expiry`, regardless of cleanup scheduling,
  and exactly-once capacity effects. Temporary reservations are observed in Cal.com;
  payment coupling and the chosen boundary remain our decisions, not convergence.
- POL-BOOK-003 rejects resurrection after expiry and exposes reconciliation to
  customer and operator. This prevents a late result from taking newly allocated
  capacity. Automatic refunds and dispute handling are excluded, not inferred.
- POL-BOOK-002 fixes capacity effects of cancellation to one release and preserves
  the booking-time policy. INT-BOOK-001 rejects untrusted or mismatched payment
  outcomes. These are explicit integrity choices without fresh provider evidence.

The existing 95-percent metric and 100-request target are retained product targets,
not measured outcomes or research-validated thresholds. The metric's observation
window and denominator remain unspecified; no readiness claim relies on it.

## Open questions, not obligations

Does a payment business require compensation before notifying a customer of late
payment? What limits and retry guarantees do actual providers expose? Can seated
holds compose with manual approval without hidden capacity consumption? Is an
administrator override needed in another product variant? These need additional
research and an explicit scoped decision. Manual approval, rescheduling, waitlists,
provider-specific protocols and recovery SLAs are not added to this core.

Before promotion, complete the prior review's request for a third booking product,
obtain independent review, and execute the candidate cases against an identified
implementation. Documentation alone proves neither concurrency safety nor product
conformance.
