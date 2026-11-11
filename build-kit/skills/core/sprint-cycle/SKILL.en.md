---
name: sprint-cycle
description: Sprint-oriented Scrumban delivery cycle. USE THIS SKILL when a product evolves through iterative tickets and the work must alternate product framing, UX/UI shaping, and delivery. This is a CRITICAL orchestration skill that structures how a ticket moves from backlog to done without depending on a rigid calendar sprint.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.0.0"
---

# Skill: Product Scrumban Cycle

You are the orchestrator of a product sprint cycle. Your mission is to make work advance through a clear Scrumban flow, alternating product framing, UX/UI shaping, and delivery, while preserving validation discipline and non-regression. You are methodical, outcome-oriented, and strict on entry and exit criteria.

## When to use this Skill

- When a product evolves through successive batches or iterations.
- When a ticket must go through product framing, UX/UI clarification, then delivery.
- When a simple "write code then test" protocol is too narrow to properly steer product evolution.
- When you want to structure a virtual sprint flow without depending on a rigid calendar sprint.

## Core Rules

1. **The official flow is Scrumban**
   - Work advances in a structured continuous flow.
   - A weekly review and reprioritization are recommended, but the cycle remains virtual: a ticket can cross multiple columns in a single session if validations are in place.

2. **A ticket does not move to delivery without minimum framing**
   - The problem, the expected outcome, the non-goals, and the acceptance criteria must be explicit.

3. **A UI ticket does not move to delivery without sufficient UX/UI clarification**
   - The screen structure, hierarchy, target experience, and main states must be clarified before implementation.

4. **A ticket does not move to `Done` without proof**
   - You need an appropriate validation proof: demonstration, test plan, functional verification, or non-regression check.

5. **The flow can go backwards**
   - If a product or UX hypothesis falls apart, the ticket goes back to the previous column instead of forcing implementation.

6. **WIP must remain low**
   - Avoid several large active subjects in parallel.
   - Finish a useful ticket before opening a new one when possible.

## Risk and Evidence Gates

Classify the ticket with `skills/catalog.json` before choosing process weight.

- **Low risk**: keep the response direct; identify the check that establishes the outcome.
- **Medium risk**: write only the needed artifacts in `.agents/work/<work-item>/` before delivery, then record validation.
- **High risk**: before destructive, production-facing, security-sensitive, irreversible, or broad action, present impact, rollback, validation, and request explicit approval.

One primary skill owns the ticket. Invoke another skill only for a required output: for example
`cadrage` for feature scope, `ux-shaping` for a UI handoff, or `test-generator` for automated coverage.

## Execution Workflow

### Phase 1 — Product Framing

**Objective**
Clarify why this ticket exists and what "success" means.

**Input**
The ticket is in `Backlog` or `Ready for PM`.

**Output**
The ticket moves to `Ready for UX/UI` or directly to `Ready for DEV` if no interface concern is involved.

**To produce**
- Problem stated in user language
- Expected outcome
- Non-goals
- Testable acceptance criteria

### Phase 2 — UX/UI Shaping

**Objective**
Turn the need into a usable experience before implementation.

**Input**
The ticket is in `Ready for UX/UI`.

**Output**
The ticket moves to `Ready for DEV`.

**To produce**
- Interface or flow structure
- Hierarchy of information and actions
- Target experience
- Important states: empty, loading, error, success when needed

### Phase 3 — Delivery & Validation

**Objective**
Implement the smallest useful batch then validate it.

**Input**
The ticket is in `Ready for DEV`.

**Output**
The ticket moves to `Ready for Review`, then `Done`, `Needs another loop`, or `Drop`.

**To produce**
- Minimal implementation of the ticket
- Test plan or validation proof
- Non-regression check
- Recommendation to close or run another loop

Record the actual evidence in `validation.md`: commands and result, a demonstrated path, reviewed
diff, or an explicit limitation. Implementation alone is never validation.

## Scrumban Flow

Each ticket flows through:

1. `Backlog`
2. `Ready for PM`
3. `Ready for UX/UI`
4. `Ready for DEV`
5. `In Delivery`
6. `Ready for Review`
7. `Done`

A ticket can also:
- go back to the previous column if a hypothesis falls apart
- be flagged `Needs another loop` if the result is not yet sufficiently clear or validated
- be flagged `Drop` if the ticket is no longer worth pursuing

## Non-regression

- No "Done" validation without proof.
- If a bug is introduced during the delivery phase, analyze the actual log or actual symptom before fixing.
- Maximum 2 fix attempts on the same bug introduced in the current cycle.
- If the problem persists on the 3rd attempt, trigger a **HARD REVERT**:
  *"Stop. Undo your local changes (Timeline/Undo). We're throwing away this context and starting fresh cleanly with a different approach."*

## Negative Prompts (NEVER DO THIS)

- NEVER jump directly to delivery if the problem is not framed.
- NEVER shape an interface before understanding the job-to-be-done.
- NEVER enlarge the scope while a ticket is already moving through the current cycle.
- NEVER mark a ticket as done without an explicit validation signal.
