# composed-build-kit

> Portable, agent-agnostic bootstrap for connecting product intent, business rules and delivery.
> Start with useful skills and evidence conventions; extend or replace skills with your own.
> Node/npm run the kit itself; generated projects keep their own stack and native commands.

## Start with your task

Use the [three starting paths](docs/getting-started.md#choose-your-starting-point): a new product
need, a project with agreed decisions, or a correction/resume. Each gives a request you can adapt
and the next result to expect. Describe your task in the project; the agent follows existing sources
and handles skill routing and applicable checks. The [worked paths](examples/starting-paths/README.md)
show the recovered decisions and next action. Keep tools and skills already useful to your project.

## Install

Until the standalone package is published, install from a Composed checkout:

```bash
git clone https://github.com/yassmii/composed.git
cd composed
npm ci
cd /path/to/your-project
node /path/to/composed/build-kit/bin/composed-kit.mjs init
```

A wizard asks for instruction language, the agent tools you use, and skill levels. It installs their
instruction bridges. See [getting started](./docs/getting-started.md) for details.

## What it gives you

- **19 bilingual skills** (FR + EN): 8 core, 10 support and 1 extra. Engineering specialists cover
  security, debugging, API contracts, data migrations and releases; market research supports product decisions.
- **Open skill routing**: use an available external skill as primary or secondary, including in place
  of a supplied skill. Keep one deliverable owner, canonical decisions and expected evidence; see
  [cooperation and replacement](docs/skill-catalog.md#use-an-external-skill).
- **Universal doctrine** in `AGENTS.md` (open standard, read natively by Codex and other AGENTS.md-compatible agents)
- **User-owned stack selection**: open decisions receive a technology study and recommendation,
  then wait for your choice or explicit delegation before technology selection or scaffolding.
  Existing agreed choices are reused.
- **Agentic routing contract** in `skills/catalog.json`: one primary skill, explicit boundaries, proportionate risk gates, and expected evidence
- **Direct small corrections** keep scope and checks inline; features and complex delivery retain
  applicable durable evidence, delegation and review. Execution shape is separate from action risk.
- **Optional model assignment** filters actual tools, data and permissions before local preferences;
  bounded briefs and explicit attempt limits preserve validation. See [examples](docs/adaptive-delivery.md).
- **Safe lifecycle**: collision preflight, generated-file baselines, backed-up forced replacement and
  bounded uninstall preserve project-owned content. See [adoption](docs/adoption.md).
- **Agent-specific bridges** for Claude Code, Cursor, Gemini CLI, Cline, Windsurf, Aider
- **Multi-agent by default** for complex implementations: actual native delegation, recorded IDs/access/results, isolated concurrent writes and independent review; missing capacity blocks instead of silently falling back. Questions and bounded small fixes stay direct.
- **Portable memory and work evidence** in `.agents/memory/` and `.agents/work/`: named immutable reviews and explicit cross-agent handoffs, with a Claude Code memory mirror
- **Product learning loop** connects intent and business rules to implementation, acceptance, delivery evidence and
  subsequent outcome review; a runnable synthetic example distinguishes those evidence levels.
- **Optional engineering-quality tools** support complexity/coverage review, structural-duplication
  candidates and targeted mutation testing, with explicit preparation and scoped execution evidence.

## Supported agents

| Agent | Bridge file | Skill invocation |
|---|---|---|
| Claude Code | `CLAUDE.md` | Read shared `SKILL.md`; native `Skill` only for registered external plugins |
| Codex | `AGENTS.md` | Read `SKILL.md` |
| Cursor | `.cursor/rules/composed-build-kit.mdc` | Read `SKILL.md` |
| Gemini CLI | `GEMINI.md` | `activate_skill` tool |
| Cline | `.clinerules/composed-build-kit.md` | Native `.cline/skills/` mirror |
| Windsurf | `.windsurfrules` | Read `SKILL.md` |
| Aider | `CONVENTIONS.md` | Read `SKILL.md` |

## Commands

- `init` — install in the current project (wizard or flags)
- `update` — refresh skills + bridges (preserves `.agents/memory/`); use `--lang` to switch language post-install
- `doctor` — diagnose install integrity and instruction issues, optionally by agent and as JSON
- `preflight` — opt-in temporary write/read/cleanup probes in selected intended directories;
  session delegation, reviewer independence and quota remain unknown
- `knowledge check` — read-only local index/source-link checks; semantic freshness remains unassessed
- `repair` — preview bounded repairs; `--apply` restores eligible missing files and preserves existing content
- `uninstall` — preview removal of unchanged managed files; `--apply` removes them while preserving customisations and memory/work
- `evidence run` — execute an explicit native check and record a named local receipt tied to selected file hashes and requirement/case IDs
- `verify` — check receipt/subject/review applicability without running any recorded command

## Documentation

- [Getting started](./docs/getting-started.md) — describe your task, install once, find the next action
- [Worked starting paths](./examples/starting-paths/README.md) — concrete sources, decisions and resume example
- [Safe adoption](./docs/adoption.md) — collisions, manifests, backups, legacy adoption and uninstall
- [Compatibility evidence](./docs/compatibility.md) — installation checks versus real runtime guarantees
- [Validate your work](./docs/validation.md) — choose the relevant check, understand the result and next action
- [Executable evidence reference](./docs/evidence.md) — record commands, inspect stale receipts and review applicability
- [Engineering quality](./docs/engineering-quality.md) — optional Crapper, Dryer and Mutator usage,
  informative measurements and a real worked example
- [Skill catalog and migration](./docs/skill-catalog.md) — responsibilities, standard names, safe updates and ECC provenance
- [Agent diagnostics and repair](./docs/diagnostics.md) — machine-readable findings, targeted previews, restoration and guided adoption
- [Method deep dive](./docs/method-deep-dive.md) — the why behind PM → UX → DEV
- [Agentic operating model](./docs/agentic-operating-model.md) — routing, risk gates, work artifacts, and evidence
- [Runtime capabilities](./docs/runtime-capabilities.md) — portable subagent, fresh-session, and self-review contract
- [Proportionate delivery](./docs/proportionate-delivery.md) — direct correction, feature and complex-work examples
- [Product delivery and learning](./docs/product-delivery.md) — decisions, acceptance and outcome review
- [Worked product loop](./examples/product-loop/README.md) — synthetic trace with executable acceptance controls
- [Knowledge lifecycle](./docs/knowledge-lifecycle.md) — provenance, stale context, supersession and resume
- [Repository contribution guide](https://github.com/yassmii/composed/blob/main/CONTRIBUTING.md) and [release preparation](./docs/releases.md) — source-beta workflow and separate publication decisions
- [Composed Runtime design](../docs/composed-runtime/README.md) — proposed optional external supervisor and events/hooks coverage; not an installed capability
- [Agent behaviour evals](./evals/README.md) — regression scenarios for the methodology
- [Paired delivery benchmark](./benchmarks/README.md) — local real-agent sessions with/without the kit,
  protected code assertions, bounded execution and explicit incomplete results
- [Harness product contract (draft)](../contracts/product-types/agentic-delivery-harness/README.md) — pinned baseline, research and improvement targets; conformance is not yet evaluated
- [Adding a skill](./docs/adding-a-skill.md) — contribute a new skill (FR + EN)
- [Submodule mode](./docs/submodule-mode.md) — for teams preferring git submodule over npx

## Status

**v0.7.0 source beta** — safe adoption, managed baselines and bounded removal complement
19 skills, risk-based engineering workflows, diagnostics and repair;
new projects and POCs require a user stack decision before implementation;
complex implementations default to `multi-agent-required`. Run `update` to refresh
existing installations. This is an instruction policy, not a runtime agent launcher; `--agents` selects
bridges and `doctor` checks installation structure, not actual delegation.

## License

[MIT](LICENSE) for the Build Kit. Product contracts explicitly marked CC-BY-4.0 retain their own
license; see [repository licensing](../LICENSE) and [contract license](../contracts/LICENSE).
Optional external tools retain their licenses; see [third-party notices](THIRD_PARTY_NOTICES.md)
and the pinned [source/license record](third-party/engineering-quality-sources.json).
