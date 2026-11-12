# Changelog

All notable changes to composed-build-kit are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Optional acceptance-led delivery for planned or complex work outside the pinned contract. A
  project-owned `acceptance.md` holds rules and acceptance cases frozen before implementation, what
  is left to review, and dated runs that make elapsed time from freeze to verdict observable.
  Catalog 3.6.0 (`delivery_policy.acceptance_led`), bilingual doctrine, delivery-orchestrator 1.6.0
  and delivery-review 1.4.0 place a required independent review once per milestone on case adequacy
  and what cases cannot decide, and close bounded gaps by targeted verification. An explicit
  full-review request, unrecorded case amendments or stale/failed evidence restore the full scope.
  Reviewer independence, the direct-correction exception, native delegation and receipt formats are
  unchanged; local cases are not contract conformance and no delivery-speed benefit is measured.
  Motivated by a consumer project where review cycles replaced the contract's external judge once
  work left the contract's scope (selected REQ-ADH-008, with REQ-ADH-019 and 020 preserved).
- Optional integration of pinned Crapper, Dryer and Mutator tools, with explicit preparation,
  native reports and an executable synthetic weak/strong-test example. Measurements inform review;
  the default CI and direct correction workflow do not require external tools or metric thresholds.
- Distributed third-party source/license records and preserved 0BSD notices for the external tools.
  ub-mode is a design reference without copied or translated skill text; its reviewed revision has
  no declared license file.
- Complete versioned JSON init/update previews include conflicts, conditional backups, legacy
  retirements/retentions and explicit external actions before any writes. A project-owned
  `.agents/project-instructions.md` extension survives generated doctrine updates without recurring
  bridge conflicts; existing preambles still require explicit migration.
- Native read-only `source --json` fingerprints the bounded delivery source with optional Git
  observation. Init/update store that source in the managed manifest; doctor distinguishes unknown,
  same-version content drift and revision-only drift, and prevents source-mismatched repair.
- A worked synthetic product loop linking problem/hypothesis/decision, acceptance and UX states,
  executable reference/counterexample checks and a separately labelled learning card. Delivery
  acceptance remains distinct from observed product effectiveness.
- Read-only opt-in `knowledge check` for bounded memory-index/local-source link integrity, with
  unsupported links and semantic freshness explicitly unverified. Provenance/review/supersession
  guidance preserves existing user-owned memory and canonical product truth.
- Contribution/security guidance, bug/PR entry points and a source-release preparation procedure.
  `release:check` inspects actual npm selection for required files, version identity and accidental
  private/development paths. It publishes nothing and does not assert release readiness.
- Opt-in `preflight --write-path` probes actual temporary write/read/cleanup in intended project
  directories, preserves existing content and reports cleanup residuals. Installation diagnostics stay
  non-modifying; native delegation, reviewer independence and quota remain explicitly unknown.
- A bounded local paired Codex delivery pilot: three synthetic tasks, separate development and
  confirmation cohorts, protected semantic graders calibrated against seeds/references/mutants,
  frozen inputs, durable attempts and explicit timeouts/unknown costs. CI runs calibration and
  deterministic runner tests only. The first measured pilot is inconclusive; no comparative-benefit claim
  or skill tuning follows from its incomplete sessions (selected REQ-ADH-016 to 020 and 024 to 026).

### Changed
- The installed `AGENTS.md` doctrine is a shorter core: about 10.8 KB in English and 12.4 KB in
  French before the skills index, down from 17.7 KB and 20.1 KB. Delegation, model assignment,
  preflight, review and stack-selection rules keep their gates in compact form and point to
  `skills/catalog.json` and the delivery-orchestrator skill for detail, to be read before planned
  or complex work. An English core-only installation drops from 20,132 to 13,292 characters, under
  the smallest per-file context limit of agents that truncate long instruction files. No gate,
  policy or catalog value changes; whether agents follow the shorter text as well is unmeasured.
- Validation guidance starts from the task and distinguishes native checks, receipt applicability,
  scoped contract evaluation and external candidate runs. Human `evidence run` / `verify` output
  separates historical results, current applicability and review, then gives a next action;
  JSON reports, exit semantics and evidence/review requirements are preserved.
- Documentation entry points route from three ordinary requests: a new product need, delivery with
  existing decisions, and a correction/resume. The shorter getting-started guide moves detailed
  installation options to adoption; worked paths recover actual source links, identify remaining
  decisions and reuse executable module checks, including an explicitly synthetic stale handoff.
  CLI behaviour, distributed instructions and delivery gates are unchanged; usability is unmeasured.
- Positioning connects product intent, business rules, implementation, behavioural evidence and usage
  feedback. Catalog 3.4.0, bilingual doctrine, Claude bridges and delivery-orchestrator 1.4.0 allow
  available external skills as primary/secondary or replacements, with one output owner and no
  duplicate workflow. Product authority, direct corrections and execution/review gates are preserved.
- Bilingual engineering, testing, refactoring, debugging, review and release skills describe scoped
  quality checks, meaningful assertions, metric interpretation and evidence applicability while
  preserving installed projects' tooling, stack decisions and proportional delivery. Catalog 3.3.0
  retains the existing 19 identifiers and levels.
- Claude memory links are opt-in through `--claude-memory=link`, preview their exact destination,
  use symlinks/Windows junctions and never silently fall back to a divergent copy. Existing mirrors
  remain user-owned. Default-path support is based on static Claude Code 2.1.263 inspection; known
  overrides/worktrees require explicit native path verification rather than a guessed link.
- Memory/work seed-guide differences are signaled while preserving their bytes. Backed-up replacement
  reminds users to exclude private backups and review retired files; host ignore rules stay untouched.
- Bilingual PM, cadrage, UX shaping and QA instructions connect decisions to outcome review and
  remove forced questionnaires, mandatory critique/tool rituals and unsupported certainty claims.
  Catalog 3.2.0 adds durable-knowledge provenance/resume boundaries without a new knowledge service.
- Catalog 3.1.0 separates delivery shape from actual action risk. Eligible direct corrections keep
  scope and validation inline, load only needed skills and avoid automatic work directories or review.
  Non-trivial/risky implementation, explicit review and complex-work delegation gates remain in force.
  Bilingual doctrine/skills, examples and Claude task-list guidance follow the same selection.
- Doctor reports drift in delivery, artifact and runtime policies as well as stack/delegation policy.

### Fixed
- Memory, update and knowledge tests resolve their temporary fixture roots to physical paths,
  avoiding false failures from macOS temporary-directory symlinks. Explicit linked-ancestor rejection
  remains covered; runtime path checks are unchanged.
- Preserve leading/consecutive separators in Claude project encoding, distinguish legacy mirrors and
  drive-case ambiguity, and refuse relative user-home fallback. Remove the unused bridge slug variable.
- Legacy migration previews now show trailing-space-only differences explicitly and preserve them
  for review rather than risking meaningful Markdown hard breaks. Planned removals are rechecked
  against observed bytes and installed safe replacements.
- Refresh the observed vulnerable development graph with Node-20-compatible Vitest 4/Vite 6 and
  patched fast-uri/source-map-js. Remove the old tinypool/vite-node subtree, preserve runtime
  dependency versions and validate all cross-platform optional records. Audit results remain
  time-specific evidence, not a security certification.
- Measure local evidence command duration with a monotonic clock and record observed wall-clock
  regression explicitly, preserving valid failed receipts when the system clock steps backwards.
  Legacy ordered receipts remain readable; contradictory clock metadata is rejected.
- Restore cross-platform optional-package records for the locked Biome, esbuild and Rollup versions,
  so clean Linux/macOS installs receive their native binaries. Validate optional dependency resolution
  before CI installation, including nested esbuild versions.
- Preserve LF line endings in Git checkouts on every OS, preventing Windows CRLF formatter failures
  without weakening Biome checks.

## [0.7.0] — 2026-10-26

### Added
- **Executable local evidence.** `evidence run` records explicit bounded native commands against
  selected subject hashes and requirement/case IDs; read-only `verify` distinguishes recorded status,
  current/stale applicability and review declarations. Records are local/unsigned, and closure is not
  inferred (selected REQ-ADH-016 to 020). A real acceptance example tests a correct reference and a
  plausible semantic counterexample, without claiming an agent benchmark or full contract conformance.
- **Safe adoption lifecycle.** Full desired-file preflight, managed generated baselines, exact-byte
  backups for explicit forced replacement, bounded uninstall, and ownership-aware diagnostics/repair.
  Local customisations, memory/work and extra resources remain protected (REQ-ADH-001 to 003).
- **Publication preparation.** Root monorepo CI uses npm and the lockfile on Linux/Windows/macOS with
  Node 20/24; scoped MIT/CC-BY license texts, source-beta metadata and compatibility evidence docs.
- Six bilingual support skills: `security-review`, `systematic-debugging`, `api-contracts`,
  `data-migrations`, `release-engineering` and `market-research`. Each has routing boundaries,
  observable evidence and host-stack neutrality; the distributed catalog now contains 19 skills.
- Rename migrations for shared skills and selected Cline mirrors, with immutable legacy references,
  FR/EN and CRLF recognition, replacement-first installation and preservation of modified files,
  extra resources, links and `--keep-local` copies. Dry runs and repeated updates are covered.
- Specialist behavioural scenarios, bilingual catalog checks and documented ECC design provenance.

### Changed
- Updates now refuse unrecognised/modified target files before writes. --keep-local retains local
  instructions; --force backs them up before replacement. --yes does not authorise overwrite. Legacy
  installations without baselines need explicit reconciliation; manifest tracking is local metadata.
- Claude invocation documentation and support counts align with actual distributed shared skills.
  Gemini/Windsurf use canonical proportional authority gates for already-authorised work.
- Routing catalog 3.0.0 standardises `technique` → `software-engineering`, `test-generator` →
  `automated-testing`, `refactor` → `refactoring`, `retrofit` → `codebase-onboarding` and
  `doc-generateur` → `technical-documentation`; retired identifiers are not active aliases.
- Engineering covers dependency research, architecture boundaries, errors and distributed writes.
  Automated testing selects unit/integration/contract/E2E evidence from risk. Refactoring uses
  characterisation and reviewable transformations without routine human checkpoints at every step.
- Doctrine replaces automatic two-strike/Hard Revert recovery with evidence-led diagnosis and
  preservation of unrelated work. Skill risk defaults are explicitly overridden by the actual action.
- Current skill references, generated indices, wizard counts and installation documentation align
  with the renamed catalog. Product contracts and component release versions remain independent.

## [0.6.0] — 2026-10-24

### Added
- **Agent-scoped diagnostics.** `doctor --agent --json` reports stable findings for
  shared installation files, selected bridges, skills, catalog policies and Cline
  mirrors. Manual projects, invalid records and heuristic prompt conflicts are
  distinguished from a real installation; runtime execution remains unverified.
- **Bounded repair.** `repair` previews by default; `--apply` restores only missing
  files from compatible installation/source settings. Existing instructions, skills,
  work and memory stay intact. Unsafe link destinations are refused, and manual
  adoption or semantic changes remain explicit review actions (REQ-ADH-001/002/009/010).

### Changed
- Unhealthy `doctor` and `repair` CLI reports return exit code 1, including JSON mode.
  Existing `healthy`, `errors` and `warnings` report fields remain available.

## [0.5.1] — 2026-10-23

### Fixed
- **User-owned stack selection.** A new project, POC, or stack change asks for the user's stack
  before choosing technologies, scaffolding, installing dependencies, or dependent implementation.
  Open decisions receive a proportionate technology study and a reasoned recommendation, then wait
  for the user's choice; only explicit delegation allows autonomous stack
  selection. Partial choices stay open, while unchanged established projects avoid repeated questions.
- **Bilingual startup and handoffs.** Doctrine, engineering and orchestration skills preserve the
  canonical stack decision across agents and sessions. Urgency, starter templates, kit dependencies
  and CLI `--yes` cannot stand in for a user decision.

### Added
- Stack-selection routing policy, installation/update regressions and behavioural scenarios for
  missing, partial, recommended, delegated, established and changed stacks. Fixture checks verify
  harness structure, not real model compliance with these instructions.

## [0.5.0] — 2026-10-20

### Changed
- **Multi-agent required by default for complex implementations.** Launch at least one useful native
  delegate before implementation; absent tools/access/quotas block instead of silently falling back.
  Questions, read-only analysis and bounded small fixes remain direct. Only an explicit user request
  authorises single-agent implementation; it does not implicitly waive independent review.
- **Bilingual doctrine and bridges aligned.** Real delegation evidence lives in `agents.md`, linked
  from the handoff. Concurrent writers need worktrees or verified isolation, not just branches.
- **Honest gates.** Required independent review remains a closure gate. `--agents` installs bridges;
  `doctor`, structural tests and fixture evals do not prove actual runtime delegation.

### Added
- Installation/update regressions and behavioural scenarios for default delegation, missing runtime,
  explicit override, limited concurrency, small fixes and parallel-write isolation.

## [0.3.2] — 2026-09-14

### Added
- **Durable inter-agent handoffs.** Cross-agent and cross-session work now uses a compact
  `handoff.md` that records scope, evidence, next owner, required decision, and exit condition.
- **Named review evidence.** Persistent reviews live in `reviews/` as separate files, so an initial
  review, a corrective review, and later follow-ups cannot overwrite one another.

### Changed
- **Active-work discovery.** Memory may contain a compact pointer to an active handoff, but never a
  copy of the review, handoff, validation, or canonical product decision.
- **Explicit slice scope.** Orchestration now records included and deferred scope before implementation.

## [0.3.1] — 2026-09-13

### Added
- **Cline bridge and native skill mirror.** Selecting `cline` installs `.clinerules/hunch-build-kit.md` and mirrors selected skills into `.cline/skills/`; `update --keep-local` preserves deliberately edited mirrors.
- **Runtime-capability contract.** The catalog, doctrine, orchestration and review skills now record `native-subagent`, `fresh-session`, or `self-review` instead of assuming an agent exposes a given tool.
- **Runtime documentation and evals.** Added the portable capability model and regression scenarios for honest independent review.

### Changed
- **Recommend then advance.** Orchestration now asks only for material scope, value, safety, authority, or irreversible-action decisions. Operational ambiguity receives a stated recommendation and assumption, then routes to the owning skill.
- **Review independence is explicit.** Auto-review remains useful but cannot be labelled an independent gate; review artifacts disclose author relationship and tool/context limits.

## [0.3.0] — 2026-09-13

### Added
- **`delivery-orchestrator` (core).** Replaces calendar-sprint framing with proportionate routing across product, UX, engineering, validation, independent review, and human decision gates.
- **`delivery-review` (support).** Provides a fresh-context, read-only verdict over canonical sources and evidence: accepted, return needed, or blocked.
- **Safe legacy migration.** `hunch-update` migrates an unchanged `sprint-cycle` skill to `delivery-orchestrator`; it preserves a modified legacy directory or `--keep-local` request for manual review.

### Changed
- New installations copy only skills named in `skills/catalog.json`, so retired skills can remain as migration references without being distributed.
- Work artifacts now support `review.md`, and updates refresh the work convention without replacing active work evidence.

## [0.2.3] — 2026-09-13

### Fixed
- **Release metadata.** `package.json`, CLI version tracking, and immutable-install examples now agree on `v0.2.3`. The already-published `v0.2.2` tag is intentionally left immutable after it shipped with `0.2.1` metadata.

## [0.2.2] — 2026-09-13

### Changed
- **Guided product discovery.** The PM skill now separates questions-first discovery, proposal, persistent framing, and prioritisation. It requires semantic cross-document checks and distinguishes format checks from product or human validation.
- **Canonical product truth.** Product framing, decisions, and backlog belong in `docs/`; work artifacts link to them, while `.agents/memory/` keeps operating context and pointers. Bridges, operating-model documentation, and memory guidance now share that contract.
- **PM regressions.** Added scenarios for questions before artifacts, source-of-truth boundaries, and pilot-versus-product consistency.

### Added
- **Agentic delivery contract (v0.2.1).** `skills/catalog.json` gives every distributed skill an explicit routing boundary, risk tier, and minimal expected work artifacts. Installed projects receive this catalog plus `.agents/work/` for brief, design, plan, and validation evidence.
- **Windows-safe Git installation.** Git-based npm/pnpm execution now resolves the `tsx` runtime through Node's package resolver; Claude Code mirrors now use safe Windows project slugs and are repaired by `update`.
- **Provider-neutral behavioural evals.** `evals/scenarios.json` covers skill routing, risk gates, evidence-based completion, and over-processing traps; `pnpm validate:agentic` verifies catalog integrity in CI. `pnpm eval:fixture` exercises the full contract locally; the command adapter can score a real agent wrapper, and `evals/compare.mjs` compares saved runs.
- **Proportionate gates in AGENTS.md.** Trivial or already-specified work no longer requires a full workshop, while destructive, production-facing, security-sensitive, irreversible, or broad actions require an explicit impact/rollback/validation review.
- **`hunch-update` peut désormais ajouter des niveaux de skills.** Auparavant `update` était verrouillé sur le set installé à l'init (les compteurs du fichier de version) et ignorait `--skills`. Désormais `--skills` est **additif** : `hunch-update --skills support` ajoute le niveau `support` sans toucher à `core`/`extras` déjà présents (union, jamais de retrait). En mode interactif, si tous les niveaux ne sont pas installés, un multiselect pré-coché sur l'installé permet d'en ajouter.

### Changed
- Invite des niveaux clarifiée : *"Which skill levels? (space to toggle multiple, enter to confirm)"* — explicite le fait que c'est un choix **multiple**, pas exclusif. `promptLevels()` accepte un paramètre `initialValues` (réutilisé par `update` pour pré-cocher l'installé).

## [0.1.1] — 2026-05-25

### Fixed
- **CLAUDE.md doctrine** : la version 0.1.0 affirmait *"Tu invoques un skill avec l'outil `Skill`. Jamais `Read` sur un `SKILL.md`."* — incorrect pour les skills du kit, qui **ne sont pas enregistrés comme plugin Claude Code** et donc invisibles au tool natif. Lire `SKILL.md` directement avec `Read` est le **chemin principal** pour les skills du kit, pas un fallback. Le tool `Skill` reste valide pour les plugins globaux externes (ex. `superpowers`). `CLAUDE.md.fr.tpl` et `CLAUDE.md.en.tpl` réécrits pour clarifier cette invocation à deux modes.

## [0.1.0] — 2026-05-25

### Added
- Initial release.
- 12 skills bi-lingual (FR + EN), organized in `core/support/extras` (8 + 3 + 1).
- 6 agent bridges bi-lingual: Claude Code (via `CLAUDE.md`), Codex (via `AGENTS.md`), Cursor (`.cursor/rules/hunch-method.mdc`), Gemini CLI (`GEMINI.md`), Windsurf (`.windsurfrules`), Aider (`CONVENTIONS.md`).
- `AGENTS.md` as the canonical doctrine source (open standard, lang-resolved per install).
- Memory template `.agents/memory/` (`MEMORY.md` index + `_README.md` format guide).
- CLI commands: `hunch-init`, `hunch-update`, `hunch-doctor`.
- Wizard with **language selection step** (FR / EN); `--lang` flag for non-interactive use.
- Symlink-first memory mirror for Claude Code (`~/.claude/projects/<slug>/memory/`) with copy fallback.
- TypeScript ESM CLI using `tsx` runtime — no build step.
- 37 Vitest integration tests covering init / update / doctor / utilities.
- Biome linting + formatting.
- GitHub Actions validation workflow (typecheck, lint, test, SKILL.md frontmatter check, bridges completeness check).
- Validated end-to-end on:
  - Synthetic fresh project (`/tmp/hunch-target-test`)
  - Real-world adoption on `client-hub` (Turbo monorepo with Prisma)

### Known limitations (v0.2 targets)
- F-001: pre-existing `.agents/memory/` skips the kit's `_README.md` deposit.
- F-002: no case-sensitivity check for `Agents.md` vs `AGENTS.md` collisions.
- F-003: no auto-backup when overwriting a manual setup without `.hunch-kit-version`.
- F-004: `--cwd` / `--kit-root` flags are undocumented internal helpers.
