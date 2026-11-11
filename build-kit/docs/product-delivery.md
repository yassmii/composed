# Carry product intent through delivery and learning

Use existing project documents and the smallest useful handoff. This is a connection between the
current product/UX/engineering/QA skills, not another mandatory phase sequence or a new specification
format. A fully specified direct correction keeps the direct route described in
[proportionate delivery](proportionate-delivery.md).

Carry product intent → business rules → implementation → behavioural evidence → usage feedback
in both directions. Business rules come from the pinned contract and accepted local decisions, not
from a skill or a test tool. If implementation or usage contradicts a decision, return to its owner;
[versioned evolution](../../contracts/docs/continuous-evolution.md) preserves contract pins and earlier
proof rather than silently rewriting them. Simplifying or stopping is a possible product decision.

Supplied role names below are defaults. An available external skill can replace one while retaining
the same decision sources and expected evidence; see [skill cooperation](skill-catalog.md#use-an-external-skill).

## Keep six things connected

| Question | Canonical product source / evidence | Owner of the next decision |
| --- | --- | --- |
| What problem, for whom, and what do we actually know? | Problem and source-linked observations; distinguish inference and missing evidence | Product owner with product-manager |
| What do we expect to improve and what would refute it? | Hypothesis, intended signal, counter-signal and observation method | Product owner |
| What did we decide to do? | Decision status, rationale, alternatives, included/deferred scope and revisit trigger | The person authorised to decide |
| What must the delivered slice do? | Pinned contract requirement/acceptance IDs or accepted local business rules, meaningful UX states and their implementation links, tied to the originating outcome/risk | cadrage / ux-shaping, then engineering |
| Which behaviour was actually demonstrated? | Tests/manual check, subject revision/environment, actual result and limits | Engineering / QA; independent reviewer where required |
| What happened to the user outcome? | Actual observation source/window/population, limitations and keep/revise/stop/learn recommendation | Product owner |

Reuse existing IDs or ordinary Markdown anchors. The useful trace can be a small table or links in an
existing brief; it does not require a parallel database, a document per row or a fixed approval ritual.
Product requirements and decisions remain canonical in the project's existing `docs/` conventions.
`.agents/work/` links actual delivery/review evidence; `.agents/memory/` retains operating context and
pointers without copying the product decision.

## Two different closure questions

**Delivery acceptance:** did the selected implementation behave as specified, in the checked context?
Name the actual tests, observations, missing coverage and review. A plan is not execution; a mockup
is not a tested interface; an author check is not an independent verdict.

**Product learning:** did the intended actor benefit, and did the counter-signal stay acceptable?
This may remain unknown after delivery. A passing suite, usage count or approved spec does not answer
it. Do not fabricate a baseline/target or infer causality from a small uncontrolled observation.
When data is unavailable, name the owner and next observation/revision trigger rather than marking
the hypothesis validated. Collection, recruitment, external analytics and deployment still need
applicable authority; this guide installs no telemetry.

## Make handoffs executable

Carry the decision link/status, scope, acceptance IDs, UX states and open owner questions into the
next role. State the proof expected back. Link returned evidence and update canonical decisions only
within the authorised scope. Reuse accepted product/stack decisions instead of asking again or
silently replacing them. A newly exposed material ambiguity blocks the affected decision, not all
independent reading or preparation.

After delivery, assess the original hypothesis and counter-signal, retain contradictory evidence,
and record the next decision with an owner. Preserve the previous decision when superseded and link
its replacement. Promote a reusable operating lesson to memory only with provenance and a revision
trigger; the product result itself remains in the canonical product source.

## Work through an example

The [task-filter example](../examples/product-loop/README.md) links one authored synthetic problem,
hypothesis, decision, acceptance and UX-state description to actual local code assertions and a
separate fictional learning card. Its known-wrong implementation is rejected. It demonstrates the
boundary between executable delivery evidence and unestablished product effectiveness; it is not a
production app, real user study or agent-comparison benchmark.
