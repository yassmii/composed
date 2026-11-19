---
name: ux-shaping
description: >
  Create or revise a user flow, visual direction, composition, states and implementation handoff
  from agreed product goals. Use product-designer for critique only; use cadrage for missing material product rules.
license: MIT
metadata:
  author: composed-build-kit
  version: "2.0.0"
---

Design a usable, recognisable experience grounded in this product and its audience. Carry creative
intent through to observable behaviour. Preserve canonical product truth, accessibility and agreed stack.

## Start with the goal and existing identity

Read the canonical goal, rules, acceptance and unresolved decisions. Inspect the actual surface,
components, tokens, content and assets when present. Separate observation from assumption; missing
design.md does not erase an identity already visible in the product. Clarify material product gaps
before locking behaviour. Reuse established decisions and ask only questions that change the work.

Identify the job of this surface: completing a task, understanding information, making a decision or
exploring a work. Let it determine density, expression and interaction. A marketing page and an admin
screen for the same product need different compositions, not competing brands.

Match scope: a local refinement inherits the system; a new screen extends it; an authorised redesign
can replace the requested visual layer while preserving product facts, functions and pinned brand
constraints. Updating the skills never authorises redesigning a consuming project.

## Explore when the direction is open

For a new identity or materially open composition, read
[visual-exploration](references/visual-exploration.md). Derive alternatives from the subject's content,
audience and visual references, then compare genuinely different arrangements and experiences.
Changing only colours or fonts is not a different direction. A small refinement or settled direction
does not need another exploration workshop.

Recommend a direction, explain its relationship to the brief and name its trade-off. Use comparable
sketches, rendered fragments or boards when they help the choice; never require Figma, image generation
or a specific tool. Honour explicit preferences and existing authorisation. If the user delegated the
choice, choose and state assumptions; otherwise resolve a material open direction before dependent
implementation. Load product-designer only when a distinct critique is useful.

## Shape composition, flow and states

Resolve the direction into content order, grid, type roles, colour roles, image treatment, density
and interaction. For visual creation or refinement, read
[design-craft](references/design-craft.md) for the affected dimensions. Use real product content and
available assets; identify proposed copy and illustrative data. Never invent customer proof, metrics,
prices or capabilities to make a composition convincing. Record missing assets and their intended job.

Make action, progression and recovery understandable. Include states this journey needs: empty,
loading, success, error, permissions, cancellation or low-volume cases. Preserve context and input
through recoverable errors where rules allow. Specify keyboard/focus, labels, feedback and responsive
behaviour; a screenshot alone cannot establish accessibility or usability.

Choose only the medium needed for the handoff: text/ASCII, Mermaid, existing HTML components or an
available design tool. A mockup does not authorise a framework, new dependency or external integration.

## Hand off decisions and observable behaviour

Link states/actions to existing acceptance IDs or anchors. For non-trivial work, keep a compact
design.md in the existing work item: scope, sources and inherited constraints; chosen direction and
why; relevant rejected alternatives; concrete visual decisions; states, responsive behaviour and
reused components; assets and open questions with owners; intended checks. Reference the canonical
brand system instead of copying it into a competing spec. Inline notes suffice for a bounded change.

Preserve the distinctive composition in implementation; do not fall back to a generic card grid after
approving a different structure. Match ambition to assets, delivery time and performance. Follow
required review/delegation gates: a document or author reread is neither design approval nor an
independent verdict. Do not create a new gate when the relevant choice is already authorised.

## Inspect the result and retain learning

When a runnable result and permitted tools are available, inspect rendered desktop and narrow layouts
and exercise the changed interaction. Compare to the chosen direction, including actual content,
overflow, hierarchy, focus and reduced motion where applicable. Fix observed gaps within scope and
recheck affected cases; avoid endless polish loops. Without a renderer, give an explicit unverified
status and a replayable check, not a visual pass inferred from code.

Record source, viewport/state and limits of evidence. Distinguish author visual review, automated
checks and independent review. Tests establish selected behaviour; actual usability and product value
need observation in the intended context. Preserve the product hypothesis and counter-signal; route
material learning to its owner. Keep accepted decisions and reasons for reuse without treating past
style choices as permanent prohibitions on new work.
