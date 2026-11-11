# The Composed Build Method — Deep Dive

## Why this method exists

Software projects fail more often from **unclear scope** than from technical complexity. The Composed Build method makes scope, design, and delivery explicit by enforcing a **slice cycle: PM → UX/UI → DEV**, where each phase has clear entry and exit criteria.

## The three phases

### 1. PM (Product Management)
Frame what the slice is, why it matters, and what success looks like.
- Skill: `product-manager` for strategic questions (MVP, prio, metrics)
- Skill: `cadrage` for tactical feature framing right before code

### 2. UX/UI
Lock the interface direction. Skip only when no UI surface is touched.
- Skill: `product-designer` for critique and audit
- Skill: `ux-shaping` for full redesign or new flow conception

### 3. DEV
Implement the slice with discipline.
- Skill: `software-engineering` for implementation and architecture within the agreed scope
- Skill: `automated-testing` or `qa` depending on profile
- Skill: `refactoring` for cleanup without behavior change

Specialised support skills cover security review, systematic debugging, API contracts, data migrations,
release engineering and market research. Read the installed catalog and route only the outputs the
current task needs. A skill risk is a default; classify the actual action before mutation.

## The orchestrator

The `delivery-orchestrator` skill coordinates the flow. Invoke it when a work item crosses disciplines
or sessions — it routes the appropriate skill for each handoff, enforces proportionate evidence gates,
and calls for independent review when it materially reduces risk.

## Non-negotiable rules

1. **No slice without PM cadrage.** Code without intent fails or rots.
2. **No long-running commands without user consent.** Lists, not executions.
3. **No black holes.** Complete code or exact diffs. Never `// rest unchanged`.
4. **No scope creep.** Touch only what the slice requires.
5. **Evidence-led debugging.** Diagnose repeated failures and preserve unrelated work during recovery.
6. **Compact between slices.** Don't carry contextual debt forward.

## How memory fits in

`.agents/memory/` is the persistent context across sessions. Four types:
- **user**: who the user is, how to work with them
- **feedback**: behavior rules (corrections AND validated approaches)
- **project**: who's doing what, decisions, deadlines
- **reference**: pointers to external systems

Memory is for what `git log` and `grep` can't tell you.

## Agent-agnostic by design

The doctrine lives in `AGENTS.md` (open standard). Each supported agent has a thin layer file (`CLAUDE.md`, `GEMINI.md`, etc.) explaining how to invoke skills in its ecosystem. Switching agents doesn't change the method.
