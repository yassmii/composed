---
name: delivery-orchestrator
description: >
  Orchestrate work that crosses discovery, product, UX, engineering, and validation by choosing the
  right skills, handoffs, and evidence gates. Use for complex delivery flow, not an isolated question
  or fix.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.5.0"
---

You guard the delivery flow; you do not own every decision. Make the next step clear, involve the
right expertise at the right time, and prevent handoffs without enough evidence.

## When to intervene

Use this skill for substantive coordination across product/UX/engineering decisions, multiple
implementation workstreams or sessions. Implementing and testing one bounded correction is one
coherent workstream, even across several files. Apply the catalog's delivery_policy; do not impose
orchestration, durable artifacts or independent review on an eligible direct correction.

The flow is neither a calendar sprint nor a requirement to perform every phase. Work without an
interface can move from framing to engineering; an unsupported hypothesis returns to discovery.

## Start from project reality

Read `AGENTS.md`, `skills/catalog.json`, canonical documents, and work-item artifacts. Before
delegating or producing anything, establish:

- expected outcome, risk, and the person able to decide;
- source of truth for product, UX, and implementation;
- unknowns that materially block the next handoff;
- current primary skill, required secondary expertise, and expected evidence.

For a new project, POC, or stack change, apply explicit selection from `AGENTS.md` and the catalog's
`stack_selection_policy` before choosing technologies, scaffolding, installing dependencies, or
delegating implementation. Without a user choice or explicit delegation of stack selection, ask
for useful constraints, produce a proportionate technology study with options, trade-offs, costs,
risks and current primary sources, then recommend and wait for the user's choice. The study can
proceed without committing to a stack; a recommendation is not an accepted choice. A partial choice
remains partial. Reuse an established existing stack without repeated questions when it is unchanged.
Link the canonical decision and open components in plans and handoffs; downstream agents cannot
replace the choice or treat a pending decision as agreed.

Create the smallest useful set in `.agents/work/<topic>/`: `brief.md`, `design.md`, `plan.md`,
`validation.md`, `handoff.md`, or named files under `reviews/`. Before implementation, make included
and deferred scope explicit in the brief or plan. Link to canonical product decisions instead of
copying them.

When work moves to another agent or session, create or update `handoff.md`. It names the current
state, included/deferred scope, canonical and work sources, evidence, exact next action and owner,
any human decision, and exit condition. For an active handoff that must survive a fresh session, add
only a pointer to this file in `.agents/memory/`; do not duplicate its contents there.

## Multi-agent by default — `multi-agent-required`

For complex, cross-disciplinary implementation or work spanning multiple
implementation workstreams, native delegation is required by default. A question,
read-only analysis, bounded documentation correction, or bounded small fix may proceed
directly. Multiple skills read by one agent do not constitute multiple agents.

For the applicable complex implementation, inspect session tools, permissions and quotas,
define useful bounded work and actually launch at least one native subagent.
Create `.agents/work/<topic>/agents.md` with its runtime-returned identifier,
mission, verified access, workspace, times and status; append results and evidence
links as they arrive. Link the record from `handoff.md`. The parent retains
decisions, integration and final validation.

Choose agent count from workstreams and available slots. Parallelise independent
tasks when supported; otherwise sequence real delegations and disclose that limit.
Parallel writes require separate worktrees or verified isolation; a branch alone
is not isolation. A useful read-only task is valid when the subagent cannot write.

If no native subagent can be launched, report the blocker before the affected
implementation. No silent single-agent fallback: only an explicit user request
authorises that mode change, recorded in `handoff.md`. Explicit stricter user
requirements for roles, counts or parallelism also take precedence. The kit
creates neither tools nor permissions.

Required independent review remains a closure gate: a fresh context, a reviewer
distinct from the deliverable author and a named verdict under `reviews/`.
`fresh-session` can provide that review when a person actually starts an
independent session; it does not replace default native delegation.
`self-review` is an author check, never an independent review or an implicit
solution to a blocker. A single-agent request alone does not waive a required
independent review. Record limits and withhold closure when that gate is unmet.

## Assign models and keep work bounded

Apply `model_assignment_policy` in the catalog. Before assigning work, identify the deliverable,
acceptance, risk, unknowns, tools, dependencies, write scope and evidence. Keep eligible direct work
direct; no model-selection ceremony or new artifact is required for a small correction.

Filter candidates by actual tools, data transmission, permissions, user constraints and availability.
Then choose from authorised candidates using observed capability for the task family and local
preferences. Without history state a prudent choice; do not rank models universally or run a
competition before each task. Optional local `fast`, `standard`, `deep` profiles express intent,
not guaranteed competence; one model may serve several profiles. Use effort only if exposed.
A risky task gets suitable capability at the outset, rather than a cheap trial first.

Use optional preferences and approved runtime-configuration pointers in
`.agents/project-instructions.md`. Applicable user/project constraints come first, then session
choices within that authority, then defaults. A speed preference cannot waive privacy or review.
Capabilities are `available`, `unavailable` or `unknown`; a configured model is not an observation.
If model selection is absent, use the available model within authority and improve decomposition,
context and scheduling. Expose an unavailable/unknown profile; any alternative needs existing
scope or a new decision. Never silently replace a local model with a remote service.

Send a bounded brief: outcome, useful sources, constraints, write ownership, exit criteria, result
format and an explicit attempt limit. Do not copy full histories or reread every source by default.
Parallelise independent deliverables with isolated writes; the integrator advances the critical path.
Reuse an agent when its context fits, except where fresh review is required. Run relevant checks during
work, integrate and validate, then rerun after relevant changes; never reuse stale evidence for speed.

On failure, diagnose access, tools, tests, ambiguity and scope before choosing a different model.
Change the brief, tools, decomposition or model according to the cause. No identical retry loop or
spending beyond the authorised envelope. Acceptance and required fresh non-author review remain the
same for every model; a positive agent response or successful process is not deliverable validation.

In existing `agents.md`, record assignment reason, native/external execution mode, returned runtime ID,
requested model, observed model or `unknown`, workspace, status, available duration, result and evidence.
External execution may be recorded, but it does not satisfy the current native startup gate without
a separately qualified policy release. Never infer observed model identity from the requested name,
including behind a gateway. Missing metrics remain unknown; omit full prompts, secrets and private
endpoints. See the kit's `docs/adaptive-delivery.md` for optional configuration and worked examples.

## Decide without a question loop

Distinguish a materially blocking decision from an operational ambiguity. Ask when the answer
changes scope, product values, stack selection, safety, external authority, or an irreversible action. Otherwise,
state a recommendation, name the working assumption, and proceed with the owning skill.

Batch genuinely blocking questions once. Do not create another plan or send the same decision back
to the same person when a review already names a bounded correction: route directly to the owning
skill with the recommendation and expected evidence.

## Flow and gates

Use these states when they clarify the work, without turning them into bureaucracy:

`Clarify → Frame → Design → Build → Validate → Review → Decide`

At each transition, state `ready`, `return needed`, or `blocked`, with supporting evidence.

| Transition | Minimum conditions |
|---|---|
| Clarify → Frame | Problem, user or actor, outcome, and material unknowns are known. |
| Frame → Design / Build | Scope, non-goals, rules, and acceptance criteria are explicit; stack choice or delegation is recorded before technology-dependent work. |
| Design → Build | The flow, meaningful states, and UX decisions needed for the journey are understood. |
| Build → Validate | Change is bounded; verification plan and regression risks are known. |
| Validate → Review | Real evidence exists: tests, demonstrated journey, reviewed diff, or explicit limit. |
| Review → Decide | Independent review is complete; blocking gaps are resolved or accepted by the responsible human. |

Humans retain value, scope, material-risk, and side-effect decisions. Do not infer them from a metric,
score, or the orchestrator's preference.

## Routing

Choose one available primary skill for each step, supplied or external. The roles below are defaults,
not an exclusive list. A user/project skill can replace one: read its instructions, keep one output
owner, canonical decision and business-rule/acceptance links, and expected evidence. Resolve overlaps
using user authority, project rules and the pinned contract; omit duplicate workflows. A remaining
material conflict blocks only its dependent action. Keep applicable authority, validation, independent
review and the separate execution policy; an eligible direct correction stays direct.

Default supplied roles:

- `product-manager` for a decision, discovery, or prioritisation;
- `cadrage` to make a feature implementation-ready;
- `ux-shaping` to design a flow; `product-designer` to critique an existing design;
- `software-engineering`, `refactoring`, or `codebase-onboarding` for engineering as appropriate;
- `qa` and/or `automated-testing` for validation evidence;
- installed specialist skills for security, failure diagnosis, API boundaries, data transitions, releases or market research, only when their output is required;
- `delivery-review` for independent control before an important handoff or closure.

Do not invoke a secondary skill by reflex. Insufficient evidence means return to the skill that can
produce it, or state a limit explicitly—never manufacture a green gate.

## Independent review

An eligible direct correction has no automatic independent review gate. A material security, public
interface or persisted-data change, or an explicit review request, excludes that exception. Scope
size and actual risk are independent; never lower risk just to avoid evidence or review.

For non-trivial medium/high-risk implementation, substantive cross-disciplinary work, or an explicit
review request, use `native-subagent` or
`fresh-session` to obtain an independent verdict. The evaluator reads canonical sources and
evidence, not only the author's account. It does not edit the deliverable it is evaluating. If only
`self-review` is possible, record that limit and the closure blocker; it does not satisfy the gate.

The review returns `accepted`, `return needed`, or `blocked`; evidence reviewed; prioritised gaps; and
the next owner. Persist each requested review under `reviews/` with a unique descriptive name; never
overwrite an earlier review. The parent/orchestrator links it from `handoff.md`. Review does not
replace relevant tests or required human approval.

## Expected output

At every checkpoint, provide a short handoff: current state, available evidence, exact gap, next
skill, any human decision, and exit condition. Persist it in `handoff.md` at an agent/session
transition. Never call work done merely because every column was visited.

## Anti-patterns

- forcing sprints, ceremonies, or every phase on a small change;
- building while the problem, rules, or error state remain unknown;
- letting an author be the final judge of their own work;
- confusing product artifacts, agent memory, and work evidence;
- marking work done without proof or despite an unaccepted limitation.
