# Composed

**Versioned product contracts that humans and agents build against, with conformance checked
from outside the implementation.**

An agent can write a booking system in an afternoon, in any stack. What it cannot do alone is
know which rules the product must never break, or prove that what it built is what was wanted.
Composed puts that knowledge in a contract: reviewed, versioned, grounded in research on
comparable products, and independent of the technology that implements it.

Read [why Composed exists](docs/vision.md) for the full reasoning.

## What a contract looks like

A contract defines a type of product. It states the promise, the actors, the invariants, and the
acceptance cases with the evidence expected for each. Every clause has a stable identifier. From
the [booking contract](contracts/product-types/saas-booking/contracts/contract.yaml):

```yaml
intent:
  promise: Let a customer reserve an available time slot or resource without manual intervention.

invariants:
  - id: INV-BOOK-001
    statement: For every slot, confirmed quantity plus unexpired held quantity never exceeds its
      finite capacity, including operator actions and payment-result processing.
    rationale: Displayed availability must be trustworthy.

acceptance:
  - id: ACC-BOOK-001
    given: A slot has one available unit, payment is not required, and both customer requests are
      otherwise valid.
    when: Two customers attempt to confirm a one-unit reservation concurrently.
    then: Exactly one reservation is confirmed and the other receives an availability rejection.
    evidence: Concurrent integration test with a synchronised start, both outcomes and the final
      capacity ledger.
```

It names no language, framework or database. A Rust service and a TypeScript service can both
conform to it. Commits, tests and reviews cite the identifiers they serve, and a capability missing
from the contract goes through a versioned proposal instead of being invented along the way.

## The three parts

| Part | What it is | Where |
| --- | --- | --- |
| **Contracts** | Product definitions with their research: sources, observations, and the trace from each clause back to them. | [`contracts/`](contracts/) |
| **Build Kit** | An optional method for building against a contract with agents: skills, handoffs, checks and evidence. Works with Claude Code, Codex, Cursor, Gemini CLI, Cline, Windsurf and Aider. | [`build-kit/`](build-kit/) |
| **Validation** | Conformance profiles and suites that judge an implementation through its public interfaces, with a verdict per case: pass, fail, blocked or not run. | [composed-validation](https://github.com/yassmii/composed-validation) |

The contract and its conformance suite are the standard. The Build Kit is support: a team with its
own habits can produce a conforming implementation without it.

## Contracts

| Product type | Version | Acceptance cases | Notes |
| --- | --- | --- | --- |
| [Booking SaaS](contracts/product-types/saas-booking/README.md) | 1.0.0 candidate | 12 | A good first read |
| [E-commerce storefront](contracts/product-types/e-commerce/README.md) | 1.0.0 candidate | 12 | |
| [Git-backed content management](contracts/product-types/git-backed-cms/README.md) | 1.0.0 candidate | 14 | |
| [Collaborative workspace](contracts/product-types/collaborative-workspace/README.md) | 1.0.0 candidate | 24 | Conformance profile available |
| [Career evidence platform](contracts/product-types/career-evidence-platform/README.md) | 1.0.1 candidate | 24 | Conformance profile available |
| [Agent operating system](contracts/product-types/agent-os/README.md) | 1.0.0 candidate | 20 | Conformance profile available |
| [Real-time 3D engine](contracts/product-types/3d-engine/README.md) | 1.0.0 candidate | 32 | |
| [Video editorial workflow](contracts/product-types/video-editorial-workflow/README.md) | 1.0.1 candidate | 9 | Conformance profile available |
| [Prospecting workspace](contracts/product-types/prospecting-workspace/README.md) | 1.0.1 candidate | 34 | Conformance profile available |
| [Agentic delivery harness](contracts/product-types/agentic-delivery-harness/README.md) | 1.0.1 candidate | 26 | |
| [Wealth advisory (France)](contracts/product-types/wealth-advisory/README.md) | 0.1.1 draft | 26 | Conformance profile available |

The video, prospecting, delivery harness and wealth advisory contracts were first written in
French and translated on 2026-11-12 with no intended behaviour change. Their French originals
are archived under each `history/` folder and remain the reference where the two texts differ.
The career evidence 1.0.1 patch only corrects the validation profile the contract names.

The [contracts guide](contracts/README.md) explains the format, the research method and how to
propose a change.

## Status

Composed is a source beta maintained by one person. What that means in practice:

- **No contract is stable yet.** Ten are release candidates and one is a draft. Independent review
  and stable promotion are pending for all of them.
- **Conformance profiles exist for six contracts.** A profile defines the cases; it is not a result.
  No overall conformance is claimed for any implementation.
- **The Build Kit's effect on delivery is not demonstrated.** A first paired benchmark, with and
  without the kit, was inconclusive. Its [protocol and limits](build-kit/benchmarks/README.md) are
  published as they are.
- **The Build Kit is not on npm.** It installs from a checkout of this repository.

Contradictions, counter-examples and independent implementations are the most useful contributions.

## Use a contract

Point your agent at a contract and its [consumer protocol](contracts/AGENTS.md), then describe what
you want to build. The protocol tells it to read the research before choosing an architecture, to
treat invariants and acceptance cases as non-negotiable, and to cite clause identifiers in its work.

## Use the Build Kit

With Node >=20 and npm from the same OS:

```bash
git clone https://github.com/yassmii/composed.git
cd composed && npm ci
cd /path/to/your-project
node /path/to/composed/build-kit/bin/composed-kit.mjs init
```

The wizard chooses language, agent bridges and skill levels; your project's stack and commands stay
its own. Then start from your situation:

| Your starting point | Next step |
| --- | --- |
| A product need, with rules still to define | [Explore the need and relevant contracts](build-kit/docs/getting-started.md#a-new-product-need) before choosing an implementation. |
| A project with an agreed contract and stack | [Deliver the next slice](build-kit/docs/getting-started.md#an-existing-project-with-agreed-decisions), reusing those decisions. |
| A bounded correction or work to resume | [Find the current state and next action](build-kit/docs/getting-started.md#a-correction-or-work-to-resume). |

See the [quick start](build-kit/docs/getting-started.md), the
[worked paths](build-kit/examples/starting-paths/README.md) and the
[worked product loop](build-kit/examples/product-loop/README.md).

## Design work

- [Contract evolution](contracts/docs/continuous-evolution.md): continuous research, implementation feedback, versioned changes and shared evidence knowledge.
- [Composed Runtime](docs/composed-runtime/README.md): design of an optional supervisor for delegation across agent CLIs. Design documents only; no runtime is shipped here.
- [Agentic delivery harness contract](contracts/product-types/agentic-delivery-harness/README.md): research-backed candidate with the Build Kit as its pinned baseline; planned improvements remain distinct from delivered capabilities.

## Maintaining this repository

- `npm run validate:contracts` validates contracts and research traceability.
- `npm run test:build-kit` runs the Build Kit tests; `npm run check` runs the shared checks.

The two components keep their own versions and release notes. To check a change in a project that
uses the kit, start with [validation by task](build-kit/docs/validation.md). See the
[contribution guide](CONTRIBUTING.md) and the [security policy](SECURITY.md).

## Licensing

The Build Kit is [MIT licensed](build-kit/LICENSE). Product contract definitions and templates
explicitly marked CC-BY-4.0 retain [CC-BY-4.0](contracts/LICENSE). Referenced third-party research
keeps its original rights. See [LICENSE](LICENSE) for scope.
