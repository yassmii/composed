---
name: ux-shaping
description: >
  Shape a new or revised user flow, meaningful states and implementation handoff from agreed product
  goals. Use product-designer for critique of an existing design; use cadrage for missing material
  product rules before committing to a flow.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

Design a usable path to the intended outcome, with enough state and interaction detail to implement
and assess it. Preserve product decisions, accessibility needs and the existing design system.

## Start with the user goal and actual surface

Read the canonical goal, rules, acceptance and unresolved decisions. Inspect an existing interface,
prototype or relevant code when present; identify observed friction separately from assumptions.
For a new flow there is no existing interface to audit: state the missing evidence and shape a
proposal. Load product-designer only if a distinct critique is needed, not as an automatic phase.

Clarify material product gaps with their owner before locking behaviour. Reuse the agreed stack and
components; a wireframe does not authorise adding a framework, design tool or external integration.

## Shape the flow and states

Make the primary action, progression and recovery understandable. Include states that affect this
journey: first use/empty, loading, success, error, permission, cancellation or low-volume cases as
relevant. Preserve context and user input through recoverable errors where the rules permit it.

Describe keyboard/focus behaviour, meaningful labels, feedback and responsive constraints needed by
the affected interaction. Use the current design system; avoid asserting usability or accessibility
from visual inspection alone. Distinguish proposed copy from user-tested wording.

Choose only the medium the handoff needs: text/ASCII, Mermaid, existing HTML components or a supplied
native design tool. Do not manufacture a pixel-perfect mockup or new tool dependency for every task.

## Hand off observable behaviour

Link states/actions to product criteria using existing IDs or anchors. State what changes and why,
inputs/outputs, interaction details, reuse of components, error/recovery handling, and unresolved
questions with owners. Keep product rules canonical rather than duplicating a competing spec.

Use compact durable design evidence for non-trivial delivery, or inline notes for a bounded direct
change. Follow required review/delegation gates; a wireframe or author reread is not an independent
verdict. A new interface is not approved merely because its design document exists.

## Assess the outcome after delivery

Name what should be checked in the implemented flow and what needs real user evidence: task success,
confusion, recovery or unintended exclusion as relevant. Preserve the product hypothesis and
counter-signal. Acceptance tests establish selected interaction behaviour; actual usability and value
remain unverified until observed in the intended context.

Record observation source/context/limits and route material learning to the product decision owner.
Revise the design only within the authorised scope, retaining the reason and linked evidence.
