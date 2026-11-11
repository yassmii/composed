---
name: cadrage
description: >
  Clarify one feature's user, outcome, boundaries, rules and acceptance before implementation when
  material requirements are missing. Use product-manager for strategy or discovery; an already
  specified local correction follows the direct delivery path.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

Turn a feature decision into a scope another role can implement and verify. Reuse known decisions;
resolve material ambiguity rather than asking every project the same questionnaire.

## Establish the decision and sources

Read the request, relevant canonical product documents and repository evidence. Identify the actor,
problem/outcome, accepted decision and assumptions. A user-supplied complete brief needs no new
framing workshop. Apply AGENTS.md and the catalog's delivery/risk/stack policies; a skill name or
code-plus-tests does not make a direct correction complex.

## Clarify what changes the result

Consider the dimensions relevant to this feature:

- actor and situation; expected benefit and primary action;
- included scope and explicit non-goals;
- happy path plus meaningful empty, error, permission or recovery states;
- business rules, data boundaries and material risks;
- affected surfaces grounded in repository evidence;
- concrete acceptance and a replayable demonstration.

Ask only where an answer changes outcome, scope, risk or validation. State missing facts without
inventing user behaviour, file names or technology. Group blocking questions; reuse prior answers.
A checklist can expose gaps but is not a mandatory output or approval gate for every correction.

## Make acceptance useful to the next role

Link each criterion to the originating outcome, rule or risk using existing IDs/anchors. Specify
preconditions, action/input and observable result, including important negative boundaries. Separate
what delivery checks can establish from the hypothesis about user benefit. Give UX/engineering the
necessary states and unresolved owner decisions without prescribing an unchosen implementation.

For non-trivial work, keep scope/acceptance in the canonical product source and link from the smallest
useful work brief. Avoid a second specification in work evidence or memory. Retain decision status,
open questions and next owner; a proposal is not an approved requirement.

## Hand off with evidence and limits

Name what is ready, the exact missing decision if any, the next role and expected proof. An agreed
stack is reused; open components follow the user's stack-selection policy before dependent work.
Keep required delegation, independent review and external-action authority intact.

A specification can be ready for implementation while product effectiveness remains untested. Keep
an owner and signal for reviewing the hypothesis after delivery; do not claim acceptance tests prove
that outcome. Direct corrections may state scope and checks inline under the applicable policy.
