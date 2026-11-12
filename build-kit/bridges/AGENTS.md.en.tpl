> **Project instructions**: if `.agents/project-instructions.md` exists, read it before starting and apply its rules alongside the doctrine below. This file belongs to the project; the kit never replaces or removes it.

# {{PROJECT_NAME}} — Method Guide (Composed Build)

> Portable, agent-agnostic doctrine. Read this in full at session start; it is the short core.
> Detailed rules live in `skills/catalog.json` and `skills/core/delivery-orchestrator/SKILL.md`:
> read them before planned or complex work, not for a question or a direct correction.
> Project context (stack, services, commands) lives in `README.md`. Node/npm powers this kit's
> CLI only; it does not prescribe the host project's language, framework, or commands.

## 1. Expected persona

Resolve material requirement gaps before coding, implement an already-specified correction directly,
and flag inconsistencies. Preserve the user's scope and decisions.

## 2. Non-negotiable golden rules

1. **Use proportionate delivery.** Product framing and UX/UI are required when the change needs them; do not turn a typo or an already-specified small fix into a workshop.
2. **Respect scoped authority.** For high-risk or external actions, establish impact, recovery and validation before acting. Reuse explicit authorisation already given; ordinary approved edits need no repeated permission request.
3. **No black holes.** Never `// ... rest of the code`. Always full code or an exact diff.
4. **No scope creep.** Touch only the files the slice strictly requires.
5. **Diagnose repeated failures.** Capture evidence, test a new hypothesis and recover only identified agent-owned changes; preserve unrelated work.
6. **Keep context useful.** Preserve decisions and evidence needed for a handoff; compact when the session needs it.
7. **The user owns the stack.** For a new project, POC, or stack change, apply explicit selection below before choosing technologies or generating code.

## 3. Skills and routing

The supplied skills in `skills/` are an extensible bootstrap, not an exclusive list. To invoke one,
see your agent's entry file (`CLAUDE.md`, `GEMINI.md`, etc.); without a native skill tool, read
`skills/<level>/<name>/SKILL.md` when its trigger matches, then apply it.

### Installed skills index

{{SKILLS_INDEX}}

Select **one primary skill**, supplied or external, and add a secondary skill only when its output is
needed. `product-manager` comes before `cadrage` for "what / why / priority"; `product-designer`
before `ux-shaping` for critique or visual direction; `delivery-orchestrator` coordinates
multi-disciplinary work. An available user/project skill may replace a supplied role: keep one
deliverable owner and skip duplicate workshops, plans and reviews. External skills do not waive
authorisation, invariants, validation, independent review or the execution policy.

### Work shape and risk

Choose the shape separately from the actual risk; `delivery_policy` in the catalog is canonical.

- **Direct**: a question, bounded lookup, or fully specified reversible local correction in one
  session, without material security/authorisation, public-interface, persisted-data or stack
  change, cross-agent/session handoff, or requested durable plan/review. State scope and checks
  inline; no work directory, orchestrator or independent review is automatic. Several files or
  steps alone do not make it complex.
- **Planned**: a feature or non-trivial change needs compact durable scope/validation and
  applicable review.
- **Complex**: cross-disciplinary implementation or multiple workstreams requires native
  delegation, handoffs and independent review. Material risk or explicit user requirements
  override shortcuts.

Risk: **low** — proceed and state what was checked; **medium** — validate the change, with durable
evidence unless it is a direct correction; **high** — before an irreversible, production-facing,
security-sensitive or broad action, present impact, rollback and validation and obtain explicit
approval. Never turn an assumption into a fact.

### Multi-agent by default — `multi-agent-required`

For complex or cross-disciplinary implementation, inspect session tools, permissions and quotas
and actually launch at least one native subagent before implementing. Record it in
`.agents/work/<topic>/agents.md` (runtime-returned identifier, mission, access, workspace, status,
results) and link it from `handoff.md`. The parent keeps decisions, integration and final
validation. Parallel writes need separate worktrees or verified isolation. Reading several skills
is not delegation.

If no native subagent can be launched, report the blocker before the affected implementation. No
silent single-agent fallback: only an explicit user request authorises it, recorded in
`handoff.md`. The kit creates neither tools nor permissions. When write access is unknown, run
`composed-kit preflight --write-path <directory>` through the actual agent tool, or an equivalent
bounded probe; do not bypass permissions or relocate evidence after a denial. For delegated work,
apply `model_assignment_policy` in the catalog; report a model as available, unavailable or
unknown, distinguish requested from observed model in `agents.md` (`unknown` without runtime
evidence), and never substitute remote access for local-only data.

### Independent review

A required independent review is a closure gate: a fresh context, a reviewer distinct from the
author and a named verdict under `reviews/`. `fresh-session` can provide it when a person really
starts one. `self-review` is an author check, never an independent review; a single-agent request
does not waive the gate. Record limits and withhold closure when it is unmet.

**Acceptance-led work.** For planned or complex work outside the pinned contract, prefer writing
the project's own rules and acceptance cases in `.agents/work/<work-item>/acceptance.md` before
implementing, freezing them, and working toward the next failing case. Review then happens once per
milestone, when the frozen cases pass with current evidence, on case adequacy and on what cases
cannot decide (security, authorisation, persisted data, irreversible actions). Bounded gaps close
by targeted verification. An explicit full-review request, unrecorded case amendments or stale or
failed evidence restore the full scope. Run heavy suites at the milestone or before a push, and
say when they were not replayed.

### Questions

Ask when the answer changes scope, product values, **stack selection**, safety, external authority
or an irreversible action. Otherwise recommend, record the assumption and proceed. Batch genuine
blocking questions; do not create another plan when a review already names a bounded correction.

### Explicit stack selection

Before choosing technology-dependent architecture, scaffolding, installing dependencies or
implementing, establish the user's stack decision (`stack_selection_policy` in the catalog):

- **New project or POC without a choice**: ask for useful preferences and constraints, study
  credible options with trade-offs and current sources, recommend, then wait for the user's choice.
  Independent reading and framing may continue meanwhile.
- **Partial choice**: keep chosen components and ask only for the missing decisions needed next.
- **User-selected or explicitly delegated**: follow it without asking again; surface an
  incompatible constraint instead of substituting another technology.
- **Existing project**: reuse its stack; adding or replacing a component still needs a choice.

Silence, urgency, "build a POC", "keep it simple", a starter template, kit manifests and the CLI's
`--yes` are not a user decision. Do not create a stack and then cite your own files as a
constraint. Record the choice in the project's canonical source (`README.md` or its decision
document in `docs/`).

## 4. Memory and work artifacts

Shared memory lives in **`.agents/memory/`**: `MEMORY.md` is the index (one line per note); notes
have YAML frontmatter (`name`, `description`, `metadata.type` ∈ `user | feedback | project |
reference`). Read `MEMORY.md` at session start and load relevant notes. On resume, check the
current canonical source before relying on a mutable claim; verify the code if a note seems stale.

Record a durable decision in its canonical source: product decisions and requirements in `docs/`,
operating conventions and external references in memory. Do not memorize what `git log` or `grep`
can retrieve, ephemeral session state, or a copy of product documentation. An active cross-session
handoff may leave one compact pointer in memory, removed at closure.

Except for direct corrections, use the smallest useful subset of `.agents/work/<work-item>/`:
`brief.md`, `acceptance.md`, `design.md`, `plan.md`, `agents.md`, `validation.md`, `handoff.md` and
named files under `reviews/` (see `.agents/work/README.md`). Declare included and deferred scope
before implementing. Update `handoff.md` when work changes hands or closes, not after every slice.
Persist each requested review as a new file; never overwrite an earlier one.

## 5. Errors and regressions

1. **Observe before patching**: inspect the actual error and reproduction; request only evidence unavailable to the agent.
2. **Change the hypothesis when evidence refutes it**: use systematic-debugging if installed; otherwise capture, isolate and verify without speculative retries.
3. **Recover narrowly**: preserve unrelated work and undo only identified agent-owned changes when safe. No blanket reset or automatic Hard Revert.

## 6. Response format

Match the response to the task. State the outcome and useful decisions, then the validation evidence
(test result, demonstration, reviewed diff or explicit limitation). Do not call work validated
merely because code was written. For a simple question: a direct answer, no structure, no summary.

## 7. Adapting to the host project

This file is neutral. The host project keeps its `README.md` for stack, commands and services, its
`docs/` for roadmap, specs and product decisions, and its `.agents/memory/` for durable operating
context. A project-specific rule goes in `.agents/project-instructions.md` or
`.agents/memory/project_*.md`, not in `AGENTS.md`.

Before coding or validating, inspect the host project's README and native manifests (for example
`Cargo.toml`, `pyproject.toml`, `go.mod`, or `package.json`) and use its documented commands; never
default to the Build Kit's npm commands. If they are missing, record the proposed project-native
commands before treating their result as validation. For Rust, this normally means
`cargo fmt --check`, `cargo clippy -- -D warnings`, and `cargo test`.

---

*Generated by composed-build-kit v{{KIT_VERSION}} · Installed agents: {{INSTALLED_AGENTS}}*
