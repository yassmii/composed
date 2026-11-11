---
name: product-manager
description: >
  Support product strategy, discovery, MVP scope, prioritisation, metrics and outcome decisions.
  Use when the expected result is a product decision or learning; use cadrage to make one feature
  implementation-ready and software-engineering for implementation.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.2.0"
---

Help the product owner choose what to learn or deliver next. Keep evidence, hypotheses, decisions
and observed outcomes distinct; a framework or completed document cannot validate an assumption.

## Select the useful mode

Read project instructions and canonical product sources; use the installed index and relevant
catalog policies rather than loading unrelated workflows. Reuse decisions already supplied.

- **Guided discovery**: if questions are requested first, ask only material questions; create no
  files, mockups or tickets.
- **Proposal**: expose evidence, options, recommendation and unresolved assumptions for discussion.
  A request to review a proposal is not approval of it.
- **Persistent framing**: when documents are requested or their creation is within the authorised
  scope, update the agreed canonical files only; identify proposed versus accepted decisions.
- **Decision / learning**: recommend an action proportionate to evidence, with the owner able to
  decide and the signal that would change the recommendation.

No blocking question does not mean user validation. Apply the catalog's direct/planned/complex
policy; do not turn a small known correction into a discovery exercise.

## Keep product truth canonical

Unless the project uses another convention:

- `docs/cadrage.md` holds the problem, intended actor/outcome, scope, rules and assumptions.
- `docs/decisions.md` holds decisions, alternatives, rationale, owner/status and revision signals.
- `docs/backlog.md` holds outcomes, stories and acceptance criteria; not unrequested technical tasks.
- `.agents/work/<topic>/` holds working evidence and links to those sources without copying decisions.
- `.agents/memory/` indexes durable operating context and canonical sources; it does not duplicate
  requirements or decisions. An active handoff pointer links to working evidence.

Reuse existing names and identifiers. A small decision may fit in one existing document; this list
is not a mandatory file set.

## Frame an evidence-backed hypothesis

Name the actor, concrete situation, current friction, desired observable outcome and non-goals.
Distinguish direct observation, supplied evidence, inference and an untested hypothesis. Link each
material claim to its source/date and note whose experience is missing. Do not invent interviews,
usage data, baselines or market facts to complete a template.

Connect the proposed intervention to a testable hypothesis: what would improve for whom, what
signal would support or refute it, and what competing explanation remains. Clarify human, privacy,
misuse and exclusion risks alongside business risk. Separate a pilot's segment, recruitment channel
and success criteria; resolve material gaps before recruitment, not by silently picking defaults.

## Decide and hand off the smallest useful scope

Compare credible options, including a smaller/manual alternative when useful. Explain impact,
confidence, effort and risk; use RICE, MoSCoW or Now / Next / Later only if it helps this decision.
Keep the outcome or risk linked to each story. Reuse agreed UX/business rules; ask only for material
missing decisions and label recommendations as proposals until accepted within actual authority.

For a non-trivial handoff, retain a compact chain in existing documents:
problem/evidence → hypothesis → decision/status → acceptance and meaningful UX states → delivery
checks → outcome observation and next decision. Use existing IDs or short links, not a parallel
traceability database. A passed acceptance check establishes selected behaviour, not user benefit.

A useful outcome measure names the behaviour/value observed, source, population/window and owner.
Include a counter-signal for material harm or quality loss. Targets and baselines may remain unknown;
state how they will be chosen rather than fabricating a number. Do not add telemetry, surveillance,
experiments on users or recruitment without the applicable authority and privacy constraints.

Technology selection remains subject to the user's stack decision or explicit delegation. Asking
for an engineering study alone does not authorise adopting its recommendation.

## Close the learning loop

Keep delivery status and product outcome separate: implemented/accepted behaviour can coexist with
an untested, unsupported or contradicted hypothesis. When observations arrive, record their source,
window, coverage and limits against the original signal and counter-signal. Do not infer causality
from adoption counts or a small uncontrolled sample.

Recommend keep, revise, stop or gather more evidence; name the decision owner and next review trigger.
Update the canonical decision/outcome source when authorised, link raw working evidence, and retain
superseded decisions with their replacement. Promote only reusable operating learning to memory,
with provenance and a revision trigger, rather than copying the product decision.

## Check before concluding

Verify that framing, decisions, backlog and vocabulary agree; a pilot success criterion has not
become a prerequisite for using the product; stated risks affect rules or acceptance; open questions
remain open; and every claim of validation names its actual evidence and limits.

A Git formatting check proves neither semantic coherence nor human approval. Check untracked files
and links explicitly, and cite the reviewed source/revision where available. Do not promise a roadmap
item, deploy a feature or declare product success merely because its specification is complete.
