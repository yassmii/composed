# Acceptance-led delivery

When work leaves the scope of a pinned product contract, it loses the contract's external judge.
Reviews then tend to take its place: every slice is framed, implemented, reviewed, corrected and
reviewed again. A review is slower and less decisive than an acceptance case.

This path keeps a judge for business rules that belong to one project. Write the rules and their
acceptance cases before implementing, run them as the inner loop, and keep independent review for
what a case cannot decide.

It is optional. Use it for a planned or complex work item whose behaviour can be stated as
observable cases. A direct correction stays direct, and exploratory work without stable rules does
not need it.

## The local contract extension

A local contract extension is one file, `.agents/work/<work-item>/acceptance.md`, written before
implementation. It holds the rules of this work item and the cases that prove them, in the same
shape as a product contract, without its research circuit.

```md
# Acceptance — <work item>

Frozen: <date and time> at <revision> | not frozen
Decided by: <person or canonical decision link>

## Rules
- LOC-<AREA>-001 — <always-true rule or expected behaviour, in product terms>

## Cases
- ACC-<AREA>-001 — verifies LOC-<AREA>-001
  Given … When … Then …
  Check: <project-native command or named test>

## Not decided by a case
- <security, authorisation, migration, irreversible action or judgement left to review>

## Runs
| When | Revision | Pass | Fail | Blocked | Not run | Receipt |
| --- | --- | --- | --- | --- | --- | --- |
```

Guidance for each part:

- **Rules** state behaviour, not implementation. Use an identifier prefix that cannot be confused
  with the pinned contract's own identifiers. A local rule never weakens or overrides a contract
  clause; a conflict goes back to the person who owns the product decision.
- **Cases** name one observable outcome each and the rule they verify. Include the failure and
  refusal cases, not only the nominal path. Prefer the project's public surface, and reuse the
  black-box validation adapter when the project already has one for an external profile.
- **Not decided by a case** is the list handed to the reviewer. Leave it explicit, even when empty.
- **Frozen** records when the cases stopped moving. Changing a rule or case after that point is a
  recorded amendment with its reason, not a silent edit: a case rewritten to match the code proves
  nothing.
- **Runs** is the measurement. The time from the frozen line to the first full run, and to the
  first run where every case passes, is how long the work actually took. Record failed, blocked
  and not-run cases as they are.

Product decisions stay in their canonical documents; `acceptance.md` links to them. A rule that
turns out to apply to every product of this type is a candidate for the product contract and goes
through its own versioned proposal.

## The loop

1. Write and freeze `acceptance.md`. Ask for a human decision only on real product choices.
2. Implement toward the next failing case. Run the fast project checks and the affected cases.
3. Record full runs with [`evidence run`](evidence.md), passing `--requirement` and `--acceptance`
   with the local identifiers so each receipt stays tied to the bytes it judged.
4. Run the heavy suites (integration, end-to-end, external profile) at the milestone or before a
   push, not after every slice. Say so when they were not replayed.
5. Obtain the independent review once the cases pass, as described below.

A status note per slice is not required. Git already records what was launched and merged; update
`handoff.md` when work actually changes hands or closes.

## What happens to independent review

Independent review remains a closure gate where the delivery policy requires it. Acceptance-led
work changes its scope and its frequency, not its independence:

- **One review per milestone.** The reviewer judges the work item once its frozen cases pass with
  current receipts, not each slice on the way.
- **A narrower object.** The reviewer checks that the cases are adequate for the rules and were
  not weakened after freezing, then examines what the cases cannot decide: security and
  authorisation, persisted-data transitions, irreversible or external actions, and the judgement
  items listed in `acceptance.md`. Behaviour already established by a current passing receipt is
  not re-derived by reading.
- **Bounded reservations close by targeted verification.** When a review returns bounded gaps, the
  same reviewer or a fresh one verifies those named findings against the correction and records
  the result as a new file under `reviews/`. A new full review is needed only when the correction
  changes scope, a rule, or a security or data boundary.

These limits do not apply when a person explicitly asks for a full review, when cases were amended
without a recorded reason, or when receipts are stale, failed or missing. A material security,
authorisation or persisted-data change keeps its own review regardless of passing cases, and
`self-review` still never satisfies a required independent gate.

## What this path does not claim

Passing local cases shows that this implementation meets the rules this project wrote for itself.
It is not conformance to a product contract, and it does not replace an external validation
profile where the pinned contract names one. Whether this path shortens delivery is not measured
by the kit; the `Runs` table exists so each project can observe it.
