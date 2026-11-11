# Agentic operating model

This kit is a human-governed delivery harness, not a claim of autonomous project management.
It makes specialised instructions, evidence, and approval boundaries portable across coding agents.

## The operating loop

1. Read the project context and `.agents/memory/MEMORY.md`.
2. Choose direct, planned or complex delivery independently of risk; use the installed index and available user/project skills to select one primary skill, supplied or external (see [cooperation and replacement](skill-catalog.md#use-an-external-skill)). A direct correction loads that skill and relevant project context. Planned/complex work reads applicable catalog policies and selected entries; add secondary skills only when their outputs are needed.
3. Classify the actual action as low, medium or high risk. A one-line authorisation change is sensitive; code plus tests is not inherently complex.
4. Direct corrections meeting the catalog's eligibility conditions state scope and native validation inline. Other medium/high-risk implementations, cross-agent/session work and explicitly requested durable plans use the smallest useful artifact set; state included/deferred scope before implementation. One compact file may combine scope and validation.
5. Apply `multi-agent-required` to complex or cross-disciplinary implementations and multiple implementation workstreams: inspect actual tools/access/quotas, launch at least one useful native subagent before product implementation, and link the real delegation record `agents.md` from `handoff.md`. Missing native capacity blocks implementation unless the user explicitly requests single-agent mode. Questions, read-only analysis and bounded small corrections proceed directly.
6. Ground conclusions in the repository, supplied design, user research, test output, or tool results. Mark assumptions.
7. Validate the requested outcome: inline for direct work, in compact durable evidence for planned/complex delivery. At every agent or session transition update `handoff.md` with state, source links, evidence, exact next action/owner, human decision and exit condition. Keep durable product decisions in their canonical project documents; memory may index them and an active handoff without duplication.
8. Non-trivial medium/high-risk implementation, substantive cross-disciplinary work, material handoffs and explicit review requests require a fresh independent read-only verdict under `reviews/`. An eligible direct correction has no automatic independent gate. Missing required independence blocks closure; self-review never satisfies it or replaces human authority.

## Proportionate gates

The [delivery examples](proportionate-delivery.md) distinguish execution shape from risk. A fully
specified reversible local correction can remain direct, with focused tests and inline evidence,
without downgrading its risk. Material security/public-interface/persisted-data/stack changes,
cross-agent/session handoffs and explicit durable plan/review requests exclude that correction path.
High-risk actions retain impact, rollback, validation and applicable authorisation before execution.
Change modes when inspection exposes broader scope; preserve established facts instead of restarting.

## What “done” means

An agent may say that code is implemented, but may only say the work is validated when it names the
evidence: a passing check, a demonstrated user journey, a reviewed diff, or an explicit limitation.
No evidence means “not yet validated”, not “done”.

Formatting checks are structural evidence only. They do not prove that untracked files exist, that
cross-document requirements agree, or that a human has approved a product decision. State those
checks separately.

## Runtime-aware review and delegation

The harness is deliberately portable: it describes the evidence and the responsibility boundary, not
a particular vendor's tool. Before delegating, inspect the capabilities actually exposed by the
current agent. Native delegation is required for applicable implementations; the review modes below are not interchangeable startup fallbacks:

| Mode | When it is valid | What it proves |
|---|---|---|
| `native-subagent` | The runtime exposes a separate subagent and its access scope is known. | A distinct context reviewed or researched bounded evidence; the parent still owns canonical writes and final validation. |
| `fresh-session` | A human starts a second session with fresh context and read-only scope. | An independent reading of canonical sources and evidence. |
| `self-review` | No independent context is available. | A useful author check only; never an independent gate. |

Record the mode, the reviewer's relationship to the author, the evidence examined, and limits in a new
named file under `reviews/`; the parent links it from `handoff.md`. Do not overwrite an earlier review
or infer that a subagent can write, browse, call MCP tools, or delegate again. For parallel mutations,
use separate worktrees or verified isolation; a branch alone is insufficient. Choose agent count proportionately; sequence real delegations when slots are limited and do not claim parallelism. A useful read-only delegation is valid. A single-agent override does not itself waive independent review.

The counterpart is a **recommend-then-advance** rule: ask humans only for choices that change scope,
product values, stack selection, safety, external authority, or irreversible effects. Operational ambiguity gets a
stated recommendation and working assumption, then routes to the owning skill. This preserves human
governance without turning the harness into an endless questionnaire.

## User-owned technology decisions

For a new project, POC, or stack change, first inspect existing decisions and ask for relevant user
preferences and constraints. When the choice is open, produce a proportionate technology study:
credible alternatives, compatibility, trade-offs, costs and operations, risks, current primary sources
and unknowns. Present a recommendation, then wait for the user's choice before technology selection,
scaffolding, dependency installation or dependent implementation. Independent reading and research can
continue while waiting. Asking for a study or recommendation is not delegating the decision.

Explicit stack selection or explicit delegation of that selection is sufficient; do not ask again
for the same decision. Preserve partial choices and study only necessary open components. Reuse an
established existing stack for unchanged work; ask before adding or replacing a stack component.
Urgency, POC status, a starter template, kit manifests and CLI `--yes` are not stack approval.

Record the choice or delegation, scope and open components in the canonical project README or its
existing decision document. Plans and handoffs link there so downstream agents preserve the decision.
See `stack_selection_policy` in the installed catalog and the bilingual `AGENTS.md` doctrine. This is
an instruction gate, not a runtime interceptor; structural checks do not prove model compliance.

## Deliberate boundaries

The kit does not prescribe a model, framework, MCP server, multi-agent topology, or host-project
technology stack. Node/npm are required only to run and maintain the Build Kit itself. Agents discover
the host stack and its validation commands from its README and native tooling files, then use those
commands (for example, Cargo commands in a Rust project). Add technologies only within the user's
stack decision or explicit delegation and when they improve a measurable outcome for that project.
Direct questions and bounded small fixes remain single-agent. Complex implementation requires native
delegation unless the user explicitly requests a documented single-agent exception. The kit describes
this policy; it does not provide missing runtime tools or launch agents itself.

See [Runtime capabilities](./runtime-capabilities.md) for the bridge and capability contract.
