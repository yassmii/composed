# Product source — illustrative open-task filter

All statements and decisions here are authored for the example. Status: **illustrative**, not
customer-validated or human-approved. This one file is canonical for the example's requirements;
code assertions and learning link here rather than introducing another product specification.

## P1: problem and evidence boundary

Intended actor: a person reviewing a local mixed list of open and completed tasks. Proposed friction:
completed items may distract them from choosing their next open task. This is a hypothesis seed,
not an observed customer problem; no interview, usage baseline or market claim is supplied.

## H1: outcome hypothesis

If the person can opt into an open-only view while easily returning to all tasks, they may find a
relevant open task with less confusion. Supporting signal to investigate: the person can find the
intended open task and still retrieve completed history. Counter-signal: the person mistakenly
believes completed tasks were deleted or cannot recover the complete list.

No numeric target, baseline, observation window or recruited population is established. A real
product owner must choose them with an appropriate observation method before claiming effectiveness.
No analytics collection or recruitment is authorised by this example.

## D1: illustrative delivery decision

Example role owning the decision: product owner. For demonstration, choose an optional `open` view
with `all` as the default and an explicit return to `all`. Keep source order and task identity; never
delete or change a task by filtering. Defer persistence of the selected mode, counts, reminders,
remote data, accounts and analytics. Alternatives considered: keep the full list only, or hide
completed tasks by default. The latter creates the counter-signal directly, so the example uses opt-in.

D1 is fixed only for running this example, not presented as an actual user's accepted choice. In real
delivery reuse the existing decision and stack, or obtain material missing choices before dependent
implementation. Revisit D1 when observation shows history confusion or when integration changes the
assumption that filtering is local and reversible; [learning](learning.md) names the next owner.

## Acceptance

The input is an already-valid array of tasks whose `completed` property is boolean. This module does
not validate the upstream task schema. Accepted modes are `all` (default) and `open`; an unsupported
mode raises RangeError rather than silently choosing another view.

| ID | Behaviour | Origin |
| --- | --- | --- |
| A1 | Default/all view includes every task in its original order | D1; recover completed history |
| A2 | Open view includes exactly tasks with completed=false, preserving order and identity | H1; D1 |
| A3 | A genuinely empty input reports emptyReason=no-tasks in either mode | P1; distinct empty state |
| A4 | A nonempty all-completed input in open mode reports emptyReason=no-open-tasks | H1 counter-signal; preserve context |
| A5 | Filtering does not mutate the input array or tasks; returning to all recovers every original task | D1; H1 counter-signal |
| A6 | Unsupported mode raises RangeError without changing the source list | Explicit bounded mode contract |

## UX state handoff

Proposed UI language: `All tasks` / `Open tasks`. A future implementation needs an obvious active
mode, a keyboard-operable control and a focus position retained when the list changes. Announce the
changed view meaningfully without claiming tasks were removed. Copy is proposed, not user-tested.

| State | Proposed experience | Current evidence |
| --- | --- | --- |
| Mixed tasks, all | Show all in original order with mode clearly identified | A1 checks view-model only |
| Mixed tasks, open | Show open tasks and preserve an available All tasks action | A2 checks selection only |
| No tasks | Say the list is empty, with the normal creation action if the product has one | A3 checks reason only; no creation UI exists |
| All completed, open | Say there are no open tasks; offer All tasks to inspect history | A4 checks reason only |
| Return to all | Restore every task without modifying completion | A5 checks data behaviour only |

Loading, transport failure, permission and save states are out of this local module; a real integration
must assess which become relevant. No keyboard, screen-reader, visual, responsive or usability check
is claimed. Engineering/QA handoff: implement and demonstrate applicable states against these IDs,
then report actual coverage and limits. Product follow-up evaluates H1 separately.
