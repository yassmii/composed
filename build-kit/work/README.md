# Work artifacts

This directory holds the evidence for a bounded piece of agent-assisted work. Use one short,
kebab-case directory per work item, for example `.agents/work/invite-team-members/`.

Eligible direct corrections may keep scope and validation inline and need no work directory. Durable
evidence is for non-trivial/risky implementations, agent/session handoffs and explicit planning/review.
Create only the files the selected mode needs; one file can combine scope and validation:

- `brief.md` — problem, outcome, non-goals, acceptance criteria, open questions.
- `acceptance.md` — optional local contract extension for work outside the pinned contract: the
  project's own rules and acceptance cases with stable IDs, written and frozen before
  implementation, what is left to review, and a table of dated runs. When it exists, review happens
  once per milestone on what the cases cannot decide. See the kit's acceptance-led delivery guide.
- `design.md` — flow, hierarchy, states, and design decisions.
- `plan.md` — implementation approach, affected surfaces, risk, and rollback where relevant.
- `agents.md` — actual delegation record: runtime-returned ID, role/mission, verified tools and access,
  workspace/worktree, launch time, status, results and evidence/commit references. Link it from
  `handoff.md`. Never invent IDs or substitute skill names for agents.
- `validation.md` — commands/checks run, observed result, remaining limits, and user validation.
- `handoff.md` — current state, included and deferred scope, source links, evidence, exact next
  action, owner, human decision if any, and exit condition. Create or update it whenever work moves
  to another agent or session.
- `reviews/<date>-<mode>-<reviewer>-<sequence>.md` — one persistent review per file. It records the
  independent verdict, evidence examined, gaps, next owner, and exit condition. Never overwrite an
  earlier review. A legacy `review.md` may remain; link it from `handoff.md` rather than replacing it.

Keep `handoff.md` short and actionable. It is a coordination index, not a second specification: link
to decisions, briefs, validation, and named reviews instead of copying them. When an active handoff
must survive a new session, add one compact `.agents/memory/` pointer to its `handoff.md` (for example
in `project_active-work.md`). Remove or mark that pointer closed when the work item closes.

## Minimal handoff

```md
# Handoff — <work item>

## State
ready | return needed | blocked

## Scope
Included: …
Deferred: …

## Sources and evidence
- Canonical decisions: …
- Work evidence: …
- Reviews: …

## Next action
<exact action> — owner: <skill, agent, or human>

## Decision and exit condition
Human decision needed: … | none
Exit condition: …
```

`skills/catalog.json` defines when these artifacts are expected. They are working evidence, not a
second knowledge base: keep product decisions in their canonical documents (such as
`docs/decisions.md`), use `.agents/memory/` only for durable operating context and pointers, and
remove obsolete work items through the project's normal review process.
