# Composed Contract

Open-source **product design contracts** that give humans and agents a shared, verifiable, reusable definition of a product.

Contract definitions and templates explicitly declaring CC-BY-4.0 retain that license; its text is
available in [LICENSE](LICENSE). This does not change pinned contract versions or third-party research rights.

A contract is neither a ticket backlog, a mock-up, nor a technical prescription. It defines the outcomes an application must deliver, rules it must never violate, explicit boundaries, and the evidence required to call it ready.

## Why this exists

Skills explain *how* to perform specialised work. `AGENTS.md` explains *how agents collaborate*. A product contract defines *what product must be built*.

```text
Product contract  -> expected outcomes, rules, boundaries, evidence
Skills            -> specialised capabilities: UX, backend, security, QA
AGENTS.md         -> agent workflow inside an implementation repository
Implementation    -> code, infrastructure, data, and tests
```

Contracts are deliberately technology-neutral. A TypeScript service, a Rust application, or any other implementation can conform to the same contract when it satisfies its requirements and acceptance evidence.

## Repository layout

Every product type is a self-contained unit:

```text
product-types/
  <product-type>/
    research/   # primary sources, observations, comparison, and provenance
    contracts/  # testable product rules derived from that research
```

- [`specs/product-contract.schema.json`](specs/product-contract.schema.json): canonical JSON Schema for contract YAML.
- [`templates/contract.yaml`](templates/contract.yaml): starting point for a new contract.
- [`product-types/`](product-types): independent product-type units, including [agentic delivery harnesses](product-types/agentic-delivery-harness/README.md), [prospecting workspaces](product-types/prospecting-workspace/README.md), [career evidence platforms](product-types/career-evidence-platform/README.md), booking SaaS, e-commerce, and a 3D engine.
- [`docs/contract-system.md`](docs/contract-system.md): operating model, research discipline, and versioning.
- [`docs/continuous-evolution.md`](docs/continuous-evolution.md): continuous research, implementation feedback, optional telemetry and a shared evidence graph.
- [`docs/verification.md`](docs/verification.md): opt-in format 0.2, scoped proof evaluation and version impact.
- [`AGENTS.md`](AGENTS.md): implementation protocol for agents consuming a contract.
- [`skills/`](skills): reusable project-local instructions for product research, contract authoring, and review.

## Workflow

1. Research comparable products from primary, versioned sources.
2. Record atomic observations and the differences between products.
3. Turn convergences or explicit design choices into contract clauses.
4. Link important clauses back to research evidence.
5. Map capabilities to available skills and implementation work.
6. Verify the contract's acceptance scenarios before claiming conformance.
7. Continue research and collect scoped implementation feedback; propose, review,
   version and revalidate improvements without changing existing pins silently.

This avoids both framework lock-in and vague “best practices”. A contract describes observable behaviour; each project chooses the appropriate stack.

## Local validation

```bash
npm install
npm run validate:contracts
npm run test:contracts
npm run example:contracts
npm run verify:research
```

The validators check the contract schema, duplicate identifiers, capability-to-actor references, and the complete source-to-observation-to-clause chain. Format 0.2 additionally checks explicit acceptance links, normative dependencies and static coverage. Candidate contracts under a family's `candidates/<version>/contracts/` are checked
alongside its canonical contract, using that family's shared research. Archived
contract formats are checked too; their frozen provenance is checked by regression tests. These checks do not
execute a product or establish conformance. `--verify-content` retrieves every source and compares its body to the recorded SHA-256 snapshot.

## Principles

- **Product before stack**: select technology only when it is a genuine constraint.
- **Evidence before convention**: distinguish research findings from deliberate choices.
- **Executable without being code**: structured YAML for automation and precise language for people.
- **Testable**: every important outcome has observable evidence.
- **Composable and versioned**: extend a core without silently changing its meaning.

## Status

The new [wealth advisory family](product-types/wealth-advisory/README.md) is a separate
**0.1.1 draft** (the English translation of 0.1.0), using opt-in format 0.2. It covers the complete French wealth-advice
workflow, including recommendations and follow-up. LCB-FT monitoring and asset freezing
are deferred. Its 26 cases are planned; professional review and implementation evidence
remain pending.

The ten previously integrated families are **candidates** at their canonical
`product-types/<family>/contracts/` paths: six at 1.0.0, and four at 1.0.1. Three of those
(video editorial workflow, prospecting workspace, agentic delivery harness) are English
translations of their French 1.0.0 with no intended behaviour change. The fourth, career
evidence platform, corrects the validation profile its 1.0.0 named. See the
[canonical integration ledger](docs/candidate-integration-2026-11-01.md) for every
current contract, previous archived version, exact-copy decision and migration
boundary. The ten suites contain 207 planned acceptance scenarios.

The current 3D contract includes programmable shaders, PBR materials, HDR/colour,
lighting/shadows and modern rendering technique profiles. The other families
include their prepared authority, evidence, recovery, payment and workflow updates.

Previous canonical packages are preserved under each family's
`history/<previous-version>/`, with their original contract/traceability bytes and
integration-time research snapshots. Candidate authoring packages remain under
`candidates/1.0.0/`; canonical files are exact copies. Canonical review entry points
identify the applicable author review and the preserved prior version.

Maturity remains **candidate**, ready for independent review. No stable promotion,
product acceptance or application implementation is claimed; all product cases
remain not_run. Contract maturity, product version and schema version are separate.
Format 0.1 remains supported and format 0.2 remains opt-in.

Existing consumers must explicitly adopt the new version/hash or select the
archived old path. No external consumer pin, validation profile or Build Kit
implementation was migrated automatically. Old proof is not transferred.

Research history: [initial pilot](docs/research-pilot-2026-10-31.md),
[corpus refresh](docs/research-refresh-2026-11-01.md),
[normative updates](docs/contract-updates-2026-11-01.md) and
[3D shader/rendering pass](product-types/3d-engine/research/rendering-comparison.md).
Native Premiere retrieval and the historical EDL qualification remain unresolved;
source freshness and actual product conformance are separate checks.
