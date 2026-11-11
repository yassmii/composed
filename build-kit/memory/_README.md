# Memory Format Guide

This directory holds the project's persistent operating memory — facts that survive across agent
sessions. It is the source of truth for this context, versioned in git and shared with the team. It
does not replace canonical product documents in `docs/`.

## File naming

Each note is a single `.md` file named by type prefix + topic:

- `user_*.md` — User profile, role, expertise, preferences
- `feedback_*.md` — Behavior rules (corrections AND validated approaches)
- `project_*.md` — Project context (who does what, deadlines, and links to product decisions)
- `reference_*.md` — Pointers to external systems (Notion, Linear, dashboards)

## Frontmatter format

Every memory file starts with YAML frontmatter:

~~~markdown
---
name: short-kebab-case-slug
description: One-line summary used to decide relevance in future conversations
metadata:
  type: user | feedback | project | reference
---

Body of the memory. For feedback and project types, structure as:

Lead with the rule/fact, then:
- **Why:** the reason (often a past incident or strong preference)
- **How to apply:** when/where this guidance kicks in

Link related memories with [[other-name]].
~~~

## What NOT to memorize

| ❌ Don't | ✅ Look here instead |
|---|---|
| Code patterns, file paths, project structure | `grep`, `ls`, read the code |
| Recent git history, who changed what | `git log`, `git blame` |
| Debug recipes or fix solutions | The code itself + commit messages |
| Stack, commands, services | `README.md` of the project |
| Product requirements and decisions | Canonical files in `docs/` (link them from memory if useful) |
| Ephemeral session state (in-progress work) | TodoWrite / plan, not memory |
| Anything already documented in `AGENTS.md` or `CLAUDE.md` | Read those files |

## Updating

- `MEMORY.md` is the index — keep entries to one line, under 200 lines total.
- Keep only active useful entries in the index. Mark uncertain claims needs-review; link a replacement
  for superseded guidance and preserve historical evidence where useful rather than rewriting it.
- A memory that names a function/file is a claim about its existence at write time — verify before acting on it.

For a durable operating claim, provenance can be short body fields: **Source/observation**, **Scope**,
**Last checked** and **Review trigger**. Add them when useful, not as a mandatory migration or new YAML
schema. A date is a past observation; inspect the current source when applicability matters. Product
requirements, decisions and learned product outcomes remain in their canonical `docs/` documents.

The reviewed kit's `knowledge check --json` command checks the index/directly linked flat notes and
supported local file links without writes or network calls. `semantic_freshness` remains
`not_assessed`; unsupported links/anchors are unverified. See `docs/knowledge-lifecycle.md` in the
reviewed Build Kit checkout for exact coverage/limits. Existing seed guides and notes are preserved
by updates; do not assume that refreshing the kit rewrote this file.

## Active cross-session handoffs

An active handoff is the narrow exception to the in-progress-state rule: a future session needs a way
to discover work that deliberately awaits another agent. Store only a pointer, normally in one
`project_active-work.md` note, with the work-item status and the path to its `handoff.md`. Do not copy
the handoff, review, product decision, or validation evidence into memory. Remove the pointer or mark
it closed once the work item is complete.

On resume, read index → relevant note → canonical source → handoff's actual state and required
evidence. Resolve contradictions against current sources before acting; do not trust an older memory
status or re-ask already established decisions. Closing the pointer does not erase work/review history.
