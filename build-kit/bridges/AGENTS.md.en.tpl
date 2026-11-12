> **Project instructions**: if `.agents/project-instructions.md` exists, read it before starting and apply its rules alongside the doctrine below. This file belongs to the project; the kit never replaces or removes it.

# {{PROJECT_NAME}} — Method Guide (Composed Build)

> Portable, agent-agnostic doctrine. Read this in full at session start.
> Project-specific context (stack, services, commands) lives in `README.md`. Node/npm powers this
> kit's CLI only; it does not prescribe the host project's language, framework, or commands.

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

## 3. Available skills

The supplied skills in `skills/` are an extensible bootstrap, not an exclusive list. Each has a single responsibility with an explicit trigger in its frontmatter.

**How to invoke a skill — see your agent's entry file** (`CLAUDE.md`, `GEMINI.md`, etc.). If your agent has no native skill tool, read `skills/<level>/<name>/SKILL.md` when a trigger matches, then apply its content.

### Installed skills index

{{SKILLS_INDEX}}

**Priority when several skills apply:**
- `product-manager` before `cadrage` when the question is "what / why / priority / MVP / metric".
- `product-designer` before `ux-shaping` when the request starts with critique / audit / visual direction.
- `delivery-orchestrator` coordinates multi-disciplinary work; it routes skills, handoffs, and
  evidence gates without imposing a sprint.
- Use specialised engineering skills only when installed and their output is required: security assessment,
  failure diagnosis, interface contracts, data transitions or releases. Classify the action itself:
  a read-only review is low risk; a destructive or production mutation is high risk.

### Routing and risk contract

Choose the work shape separately from its actual risk:

- **Direct**: a question, bounded lookup, or fully specified reversible local correction in one session.
  A correction qualifies only without material security/authorisation, public-interface, persisted-data
  or stack changes, cross-agent/session handoffs, or an explicitly requested durable plan/review.
  State scope and relevant native checks inline; no work directory, orchestrator or independent review
  is automatic. Multiple files, implementation plus tests, or several steps alone do not make it complex.
- **Planned**: a feature or non-trivial change needs compact durable scope/validation and applicable review.
- **Complex**: cross-disciplinary implementation or multiple workstreams requires native delegation,
  handoffs and independent review as below. Material risk or explicit user requirements override shortcuts.

Use the installed index and available user/project skills to select **one primary skill**, supplied or external.
For a direct correction load that skill and
relevant project code/tests; running ordinary checks does not require a second testing skill. For
planned/complex work read applicable policies and entries in `skills/catalog.json`, then only needed
secondary skills. The catalog's artifact lists are possible outputs, not checklists. Classify risk:

- **Low** — proceed with evidence and state what was checked.
- **Medium** — validate the change; direct corrections report inline, other implementations keep durable evidence.
- **High** — before an irreversible, production-facing, security-sensitive, or broad action, present
  impact, rollback, and validation and obtain explicit approval.

Do not use a rigid gate when the context does not justify it. Never turn an assumption into a fact;
ground conclusions in repository evidence, supplied material, user research, or tool output.

### Cooperate with external skills

An available user/project skill may be primary or secondary, including replacing a supplied role.
Read its actual instructions and use the host's invocation mechanism. Keep one deliverable owner,
canonical product decisions, business-rule/acceptance IDs and expected evidence in the existing
brief or inline scope. Skip duplicate workshops, plans and reviews. Resolve overlaps using user
authority, project rules and the pinned contract; ask only for a remaining material conflict and
block only the affected action. A missing skill blocks its dependent work, not independent progress.
External skills do not waive applicable authorisation, invariants, validation, independent review
or the separate execution policy below. A direct correction stays direct.

### Optional model assignment

For delegated work, apply `model_assignment_policy` in `skills/catalog.json`: qualify outcome/risk,
filter actual tool/data/permission constraints, then choose among authorised available candidates.
Local profiles and model preferences may live in `.agents/project-instructions.md`; they create no
runtime capability. Report selection as available, unavailable or unknown. Without selection, use
the available model within authority. Never silently substitute remote access for local-only data.
Use bounded briefs and attempt limits; diagnose failures before changing model. In existing
`agents.md`, distinguish requested and observed model (`unknown` without runtime evidence), returned
run ID, workspace, result and checks. Required validation and fresh non-author review do not depend
on model price. External calls do not replace the current native-delegation gate below.

### Multi-agent by default — `multi-agent-required`

For complex, cross-disciplinary implementation or work spanning multiple
implementation workstreams, native delegation is required by default. A question,
read-only analysis, bounded documentation correction, or bounded small fix may proceed
directly. Multiple skills read by one agent do not constitute multiple agents.

For the complex implementation above, inspect session tools, permissions and quotas,
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

Check only runtime capabilities the selected work needs. When intended write access is unknown or
has failed, run `composed-kit preflight --write-path <directory>` through the actual agent tool/sandbox
for the intended project-relative directories, including required work evidence. It temporarily
writes/reads/cleans its own probe; a pass elsewhere does not prove this context's access. `doctor`
checks installation only. Delegation, reviewer independence and quota remain unknown until observed
through native tools. Do not bypass permissions or silently relocate required evidence after denial;
report the affected blocker. Recheck after context/permission changes, not before every edit.

Use preflight from a known reviewed kit checkout when it is not on PATH. If unavailable, an equivalent
bounded native probe in the intended directory may establish the same scoped observation; exclusively
create its temporary file, write and verify its bytes by reading, then remove only that owned file
and report cleanup failures. Do not install
Node or dependencies into the host project just for this check.

Required independent review remains a closure gate: a fresh context, a reviewer
distinct from the deliverable author and a named verdict under `reviews/`.
`fresh-session` can provide that review when a person actually starts an
independent session; it does not replace default native delegation.
`self-review` is an author check, never an independent review or an implicit
solution to a blocker. A single-agent request alone does not waive a required
independent review. Record limits and withhold closure when that gate is unmet.

**Acceptance-led work.** For planned or complex work outside the pinned contract, prefer writing
the project's own rules and acceptance cases in `.agents/work/<work-item>/acceptance.md` before
implementing, freezing them, and working toward the next failing case. Then review once per
milestone, when the frozen cases pass with current evidence, not per slice. The reviewer checks
that the cases are adequate and unweakened, and what cases cannot decide: security, authorisation,
persisted data, irreversible actions and listed judgement items. Bounded review gaps close by
targeted verification of the named findings, recorded under `reviews/`; a new full review is for
a changed scope, rule or security/data boundary. An explicit full-review request, amended cases
without a recorded reason, or stale/failed evidence remove these limits. Run heavy suites at the
milestone or before a push and say when they were not replayed.

Ask when the answer changes scope, product values, **stack selection**, safety, external authority, or an
irreversible action. Otherwise state a recommendation, record the working assumption, and proceed.
Batch genuine blocking questions; do not create another plan when a review already identifies a
bounded correction and its owner.

### Explicit stack selection

Before choosing technology-dependent architecture, scaffolding the project, installing
dependencies, or implementing, establish the user's stack decision:

- **New project or POC without an agreed choice**: ask for useful frontend, backend, data and
  hosting preferences and constraints, without requiring components the project does not need.
  Prepare a proportionate technology study: credible options, compatibility with constraints,
  trade-offs, costs and operations, risks, current primary sources and unknowns. Give a reasoned
  recommendation, then ask the user to choose and wait for the answer. Reading, research and framing
  independent of the decision may continue while waiting.
- **Partial choice**: preserve chosen components and ask only for missing decisions needed next.
  Limit the study to open components. A requested study or recommendation does not authorise
  adopting its result: wait for the choice before dependent implementation.
- **User-selected stack or explicit delegation of stack selection**: follow the choice, or
  recommend and select within the delegation ("choose the stack for me"), then proceed without
  asking for the same decision again. Surface incompatible constraints instead of silently
  substituting another technology.
- **Existing project**: reuse its established stack for work that does not change it; do not repeat
  a questionnaire on every ticket. Adding or replacing a stack component still needs a user choice
  or delegation covering that change.

Silence, urgency, "build a POC", "keep it simple", an agent suggestion, a starter template and kit
manifests are not a user decision. Do not create a stack and then cite your own files as an existing
constraint. The CLI's `--yes` accepts kit installation options, not a product stack.

Record the choice or delegation, its scope and open components in the project's canonical source
(`README.md` or its existing decision document in `docs/`). Link it from useful plans and handoffs;
do not duplicate it in memory. While the decision is pending, no stack selection, scaffolding,
dependency installation or dependent implementation is permitted. See `stack_selection_policy` in
`skills/catalog.json`.

## 4. Memory and shared context

Multi-agent convention: **`.agents/memory/`** at the repo root.

- `MEMORY.md`: index, one line per note, under 200 lines.
- `*.md`: individual notes with YAML frontmatter (`name`, `description`, `metadata.type` ∈ `user | feedback | project | reference`).
- **Read `MEMORY.md` at session start**, load relevant notes.
- Verify the code if a note seems stale.
- On resume, read the relevant note and current canonical source before relying on a mutable claim.
  Record provenance, applicable scope, last verification and a review trigger when useful. Conflicting
  or outdated context needs review; preserve evidence and link its replacement rather than silently
  treating it as current. Product decisions and learned outcomes remain in their canonical docs.
- `composed-kit knowledge check` from a known reviewed checkout optionally checks local memory/source
  links without writes. Unsupported links and semantic freshness remain unverified; a pass does not
  prove a note true. Use it for link/resume diagnosis, not as a mandatory ritual on every request.
- Any durable decision from a session ⇒ record it in its canonical source: product decisions or
  requirements in `docs/`; cross-session operating conventions or external references in memory.
  Add a memory index entry when that helps a future session find the source.
- For an active cross-session handoff, memory may contain only a compact pointer to the work item's
  `handoff.md`, its status, and its next owner. Remove or mark this pointer closed at closure.

**Do NOT memorize**: what `git log` / `grep` can retrieve, ephemeral session state other than the
active-handoff pointer, or a duplicate of product documentation (which lives in `docs/` or
`README.md`).

### Work artifacts

Except for eligible direct corrections, use the smallest useful subset for medium/high-risk,
cross-agent/session or explicitly planned work of
`.agents/work/<work-item>/`: `brief.md`, `design.md`, `plan.md`, `validation.md`, `handoff.md`, and
named files under `reviews/`. See `.agents/work/README.md`. Before implementation, declare included
and deferred scope in the brief or plan. At every handoff between agents or sessions, update
`handoff.md` with state, sources, evidence, exact next action and owner, decisions, and exit condition.
Persist every requested review as a new named file under `reviews/`; never overwrite an earlier review.
These are evidence for the current work item, not a second knowledge base: link product decisions to
their canonical documents and promote only the active-handoff pointer or durable operating context to
memory.

## 5. Error and regression handling

1. **Observe before patching**: inspect the actual error and reproduction; request only evidence unavailable to the agent.
2. **Change the hypothesis when evidence refutes it**: use systematic-debugging if installed; otherwise capture, isolate and verify without speculative retries.
3. **Recover narrowly**: preserve unrelated work and undo only identified agent-owned changes when safe. No blanket reset or automatic Hard Revert.

## 6. Response format

Match the response to the task. State the outcome and useful decisions, then relevant validation
evidence (test result, demonstration, reviewed diff or explicit limitation). A direct correction needs
no ceremony or fixed response template. Do not call work validated merely because code was written.

For a simple question: direct answer, no visible structure, no closing summary.

## 7. Adapting to the host project

This file is neutral. The host project keeps:

- its `README.md` for the stack, commands, services, routes
- its `docs/` for roadmap, specs, and product decisions
- its `.agents/memory/` for durable operating context and external references

If a rule must be added for a specific project, write it in `.agents/memory/project_*.md` rather than modifying `AGENTS.md`.

Before coding or validating, inspect the host project's README and native manifest/tooling files (for
example `Cargo.toml`, `pyproject.toml`, `go.mod`, or `package.json`). Use its documented commands;
never default to the Build Kit's npm commands. If they are missing, record the proposed project-native
commands before treating their result as validation. For Rust, this normally means commands such as
`cargo fmt --check`, `cargo clippy -- -D warnings`, and `cargo test`.

---

*Generated by composed-build-kit v{{KIT_VERSION}} · Installed agents: {{INSTALLED_AGENTS}}*
