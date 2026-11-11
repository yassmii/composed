# Skill catalog and migration

The development catalog contains **19 bilingual skills**: 8 core, 10 support and 1 extra.
The machine-readable authority is [skills/catalog.json](../skills/catalog.json). Installation selects
levels; the agent then loads one primary skill, supplied or external, and only the secondary skills
whose output is needed. The catalog describes the supplied bootstrap, not an exclusive allowlist.
Use `--skills=core,support` to install the engineering and research specialists alongside the core.
On update, `--skills=support` adds support without removing existing levels.

## Responsibilities

| Level | Skill | Main output |
| --- | --- | --- |
| core | product-manager | Product strategy, discovery, prioritisation and metric decisions |
| core | cadrage | Feature scope, rules and acceptance criteria |
| core | delivery-orchestrator | Cross-disciplinary routing, handoffs and evidence gates |
| core | product-designer | Critique of an existing interface |
| core | software-engineering | Implementation and architecture within the chosen stack |
| core | qa | Manual user acceptance and regression plan |
| core | automated-testing | Executable behavioural test evidence |
| core | refactoring | Structural improvement with preserved behaviour |
| support | codebase-onboarding | Current behaviour, architecture map and change impact |
| support | ux-shaping | New flow, states and implementation handoff |
| support | technical-documentation | Verified durable maintenance and handover instructions |
| support | delivery-review | Independent read-only delivery verdict |
| support | security-review | Evidence-backed security findings and remediation priorities |
| support | systematic-debugging | Reproduction, causal diagnosis and verified remedy |
| support | api-contracts | Technical interface semantics and consumer/provider compatibility |
| support | data-migrations | Recoverable persisted schema/data transitions |
| support | release-engineering | Reproducible release, rollout, recovery and live checks |
| support | market-research | Sourced market evidence for a particular product decision |
| extras | presentation | Slide deck export through the supported HTML workflow |

Skill risks are defaults, not fixed action classifications. A read-only migration plan or release
assessment is low risk; bounded implementation is medium; destructive or production mutations are
high. Reuse scoped authority already provided and apply the actual action's evidence and approval gate.

API schemas implement product requirements. They do not replace Composed Contracts. Likewise,
market-research does not modify pinned contracts or replace contracts/product-research, whose role is
research provenance for a product-type contract. Report that capability as unavailable when it is
not present in the consuming environment. Public competitor data does not establish user demand.

## Use an external skill

Use an available skill chosen by the user or established by the project as primary or secondary,
including instead of a supplied skill. Inspect its actual instructions and invocation mechanism;
neither a catalog entry nor a plugin name proves it is available. Loading it installs nothing. If
unavailable, identify the missing capability and continue work that does not depend on it. Do not
install a collection or run both workflows automatically.

For example, an external UX skill may replace `ux-shaping` for an existing feature:

1. Give it the canonical product decision/status, business-rule and acceptance IDs, agreed stack,
   included/deferred scope and meaningful states. Reuse these decisions rather than re-framing them.
2. Name one owner of the flow deliverable and the evidence expected back: state/acceptance mapping,
   unresolved questions and links usable by engineering. Keep this inline or in the existing brief.
3. Engineering implements from that flow and returns actual checks tied to the same acceptance IDs,
   revision and environment. The product owner later examines observed usage separately.

If skills overlap, choose one owner and one canonical source for the output; omit duplicate
workshops, plans and reviews. Resolve conflicting instructions using user authority, project rules
and the pinned contract. Ask the authorised owner only when a material product, risk or authority
conflict remains; block the affected action, not independent work. An external skill does not create
product requirements, replace a pending stack choice or waive an applicable authorisation, invariant,
validation or independent-review guarantee. A direct correction stays direct.

Skill extensibility and execution policy are separate: the current
[multi-agent policy](runtime-capabilities.md) still applies to eligible complex implementations.
Any change to that policy needs its own rationale and evaluation; this routing change makes no
comparative claim about skills or delegation.

## Optional engineering-quality measurements

The existing skills keep one responsibility each. Crapper, Dryer and Mutator are optional external
tools, alongside equivalents already established by a consuming project. Loading a skill installs
nothing and does not make metrics mandatory for eligible direct corrections.

| Owning skill | Scoped use |
| --- | --- |
| software-engineering | Domain data constraints, input boundaries, explicit write ownership and retry/recovery behaviour |
| automated-testing | Mutation testing for a critical rule or suspect assertion, with baseline and survivor analysis |
| refactoring | Complexity/coverage and structural-duplication candidates tied to a concrete maintenance problem |
| systematic-debugging | Discriminating evidence when failed attempts share an assumption |
| delivery-review | Raw metric interpretation, omitted scope and current evidence applicability |
| release-engineering | Explicitly activated, versioned and budgeted measurement jobs; locally calibrated gates |

The FR/EN skill entrypoints retain essential preparation, scope and interpretation rules when copied
to a consumer; they do not depend on the source checkout's docs being installed. The fuller
[integration guide](engineering-quality.md) covers prepared engines and actual commands. Reports
remain native artifacts. A successful process, a similarity score or a killed-mutant count does not
alone establish a quality gate or product conformance. Preserve exact selected source, test, checker,
configuration and dependency context; a function-only cache does not establish current applicability.

## Standard names

| Retired identifier | Current identifier | Level |
| --- | --- | --- |
| technique | software-engineering | core |
| test-generator | automated-testing | core |
| refactor | refactoring | core |
| retrofit | codebase-onboarding | support |
| doc-generateur | technical-documentation | support |
| sprint-cycle | delivery-orchestrator | core, previously retired |

Run the checked-out CLI's `update` in each consuming project and start a fresh agent session.
New installations contain only current identifiers. Standard identifiers were introduced with catalog
3.0.0. Catalog 3.3.0 adds optional engineering-quality guidance without changing names or installed
levels. Catalog 3.4.0 explicitly permits external primary/secondary skills and replacement of supplied
roles without changing execution gates; catalog, skill and package versions remain independent.
These changes remain under Unreleased
until a component release is prepared.

Update installs replacements first, then retires recognised unchanged legacy copies in shared skills
and, when Cline is selected, its native mirror. Exact FR/EN contents are compared after CRLF
normalisation, so a language switch can still recognise the old copy. The previous definitions in
[migrations/skills](../migrations/skills/) are immutable recognition references and are not distributed
as active skills. The earlier sprint-cycle reference remains in its existing retired source directory.

Modified files, directories containing additional resources, symbolic links and `--keep-local` copies
are preserved and reported for manual reconciliation. The canonical and Cline copies are assessed
independently. Preserved old identifiers are not catalog aliases: update external prompts and merge
their customisations into the new skills before removing them, especially where a host discovers every
native skill directory. `--keep-local` retains existing skill files and can therefore retain old policy;
new names are still installed. `--dry-run` changes neither skills nor installation state.

## Design provenance

The workflows were authored for Composed's stack-neutral, bilingual delivery method, informed by
[ECC at 25278e7](https://github.com/affaan-m/ECC/tree/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b)
(reviewed 2026-10-26). Selected references:

| Composed workflow | ECC source paths at that revision |
| --- | --- |
| software-engineering | skills/search-first, skills/documentation-lookup, skills/architecture-decision-records |
| automated-testing | skills/tdd-workflow, skills/e2e-testing, skills/ai-regression-testing |
| codebase-onboarding / refactoring | skills/codebase-onboarding, skills/change-impact, skills/module-regression |
| security-review | skills/security-review, skills/mcp-dependency-review, skills/agent-security-hardening |
| systematic-debugging | skills/agent-introspection-debugging |
| api-contracts | skills/api-design, skills/contract-first |
| data-migrations | skills/database-migrations |
| release-engineering | skills/deployment-patterns, skills/production-audit, skills/canary-watch |
| market-research | skills/market-research, skills/competitive-platform-analysis |

The Composed adaptations preserve the host's tooling, distinguish author checks from independent
review, use risk-based tests and keep runtime capabilities explicit. No extra MCP, scanner, framework
or agent runtime is installed by these instructions.

The engineering-quality additions are original Composed instructions. ub-mode was read as a design
reference at `57a8bdd28e45ed41900ace0bafa2ff76dd9ed70f`, whose snapshot has no declared license;
no text or code from it is copied or translated here. The three separately licensed tools remain
optional external programs.
See [third-party notices](../THIRD_PARTY_NOTICES.md) for pinned sources, their declared licenses and
the distinction between reference material and distributed implementation.

## Validation and later work

Structural checks cover identifiers, routing, FR/EN entrypoints and migration integrity. Behavioural
scenarios include specialist selection, proportional risk, evidence gaps and negative cases. Fixture
runs exercise the grader plumbing; actual outcomes still need execution evidence or independent
forward-testing. See [agent behaviour evals](../evals/README.md).

Accessibility, performance, operations, design-system, user research, product experiments and agent
evaluation remain possible later additions, outside this first batch. The optional supervisor described
in Composed Runtime remains a separate design; these skills do not implement it.

Catalog 3.5.0 adds optional `model_assignment_policy`: task qualification, capability filtering,
bounded briefs, attempt limits and requested/observed model evidence. Orchestrator 1.5.0 carries
matching FR/EN guidance. Profiles remain local and optional; native delegation and independent
review gates are unchanged. Existing project preferences stay in `.agents/project-instructions.md`;
see [configuration examples](adaptive-delivery.md). No receipt format or contract pin changes.
