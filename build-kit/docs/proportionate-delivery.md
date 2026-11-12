# Choose the smallest useful delivery shape

Execution shape and actual action risk are separate decisions. The installed catalog's
`delivery_policy` is canonical for selection; skill artifact lists describe possible outputs, not
a requirement to create every file. Existing user decisions and explicitly requested review take
precedence. There is no new installation profile or flag to select on every request.

| Shape | Typical work | Evidence and coordination |
| --- | --- | --- |
| Direct | Question, bounded lookup, fully specified reversible local correction | Relevant sources and focused checks inline; primary skill if needed; no automatic work directory, task list, orchestrator, delegate or reviewer |
| Planned | Material feature or non-trivial change in one coherent workstream | Compact durable included/deferred scope and validation; applicable independent review |
| Complex | Cross-disciplinary implementation, multiple implementation workstreams | Native delegation before implementation, access/ID records, isolated concurrent writes, handoffs and fresh non-author review |

A direct **correction** must have known scope/acceptance, remain within one session and have no
material security/authorisation, public-interface, persisted-data or stack change. Cross-agent/session
handoffs and explicitly requested durable planning or independent review exclude this path. Several
files, test steps or reading a secondary skill do not alone create multiple workstreams. A genuinely
complex feature cannot be made direct by splitting it into tiny edits.

For direct work, use the installed index, relevant instructions and primary skill rather than reading
the entire catalog and every related skill. Load automated-testing for test-design expertise when
needed, not merely to execute ordinary existing checks. Read applicable catalog policies and entries
for planned/complex work. Escalate before an affected action if inspection exposes wider impact or
material uncertainty; do not repeatedly ask for decisions already supplied.

## Example: ordinary correction

Request: “Our internal label helper returns an empty label for whitespace-only input. Treat it like
empty input; keep the signature and current stack. Add the missing regression.”

Inspect callers and existing checks, confirm the internal/local impact, load software-engineering,
fix the helper and add a focused assertion using the established test tooling. Run the relevant
native command and report changed behaviour and actual result inline. No automatic discovery workshop,
orchestrator, work folder or independent review is needed. A wording-only correction may need a diff
inspection rather than a new test. If the helper instead affects authentication or a public API,
reassess before editing the affected boundary.

## Example: a feature

Request: “Add a local filter to this existing table. The UX states, rules and stack are already agreed.”

Use the existing product decision and engineering skill. Keep included/deferred scope, affected
behaviour and validation in a compact work record. One coherent implementation/testing stream is not
automatically multi-agent, but a non-trivial medium-risk implementation retains independent review.
Do not invent PM/UX stages whose decisions already exist. If implementation is complex or actually
spans independent workstreams, use the complex mode instead.

## Example: a complex feature

Request: “Design and deliver team invitations across onboarding UX, the API and membership persistence.”

Resolve material product/UX decisions, preserve the agreed stack, verify actual delegation/access,
launch a useful native delegate before implementation and isolate concurrent writes. Use minimal
durable framing/design/plan as needed, real delegation records and handoffs. Demonstrate acceptance
and failure/permission behaviour, then obtain a fresh non-author review. Missing required delegation
blocks affected implementation; only an explicit user single-agent exception changes that mode and
does not waive an independent review already required.

## Work outside the pinned contract

When a planned or complex work item has behaviour that can be stated as observable cases, the
optional [acceptance-led path](acceptance-led-delivery.md) writes and freezes those cases first and
moves the independent review to the milestone. It does not change which work requires a review.

## Runtime checks follow the task

A question needs no write probe or delegation ritual. Before required writes with unknown access,
probe the intended source and evidence directories through the actual agent tool/sandbox using
[preflight](runtime-capabilities.md#local-path-preflight). Reuse successful observations while that
context is unchanged. Installed bridges, binaries and login do not prove delegation or quota. Report
unknowns and block only affected actions; preserve independent reading/framing. Never silently move
required evidence out of a denied directory or bypass runtime restrictions.
