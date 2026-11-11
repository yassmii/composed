# Composed

Composed connects product intent, business rules and technical implementation, using agents and
evidence to keep them coherent as the product evolves.

- [`contracts/`](./contracts/) defines product truth: outcomes, invariants, acceptance criteria, and research traceability.
- [`build-kit/`](./build-kit/) bootstraps delivery with extensible skills, handoffs, checks and evidence.
  Keep your tools and use other skills alongside or instead of the supplied ones.

Read [why Composed exists](docs/vision.md) for the reasoning behind the project.

Follow product intent → business rules → implementation → behavioural evidence → usage feedback.
A passing check establishes a scoped behaviour, not user benefit. Usage or an implementation
contradiction can lead to revising, simplifying or abandoning a product decision through
[versioned evolution](contracts/docs/continuous-evolution.md).

The components keep their own validation and release lifecycles while sharing one source of governance, documentation, and history.

## Start from your situation

| Your starting point | Next step |
| --- | --- |
| A product need, with rules still to define | [Explore the need and relevant contracts](build-kit/docs/getting-started.md#a-new-product-need) before choosing an implementation. |
| A project with an agreed contract and stack | [Deliver the next slice](build-kit/docs/getting-started.md#an-existing-project-with-agreed-decisions), reusing those decisions. |
| A bounded correction or work to resume | [Find the current state and next action](build-kit/docs/getting-started.md#a-correction-or-work-to-resume). |

Open your agent in the project and describe the need. It follows existing project sources; a known
document link helps but you do not need to gather every decision or choose a skill yourself.
The [worked paths](build-kit/examples/starting-paths/README.md) show recovered sources and next actions.

## Install the Build Kit

With Node >=20 and npm from the same OS, clone this repository, run `npm ci` at its root, then run
`node /path/to/composed/build-kit/bin/composed-kit.mjs init` from your project. The wizard chooses
language, installed bridges and skill levels; your project's stack and commands stay its own.
See the [quick start](build-kit/docs/getting-started.md), [worked product loop](build-kit/examples/product-loop/README.md)
and [contribution guide](CONTRIBUTING.md). The standalone npm package is not published.

## Design work

- [Composed Runtime](./docs/composed-runtime/README.md): planned optional supervisor for delegation across agent CLIs, including the events/hooks study. Design documents only; no runtime implementation is shipped here.
- [Contract evolution](./contracts/docs/continuous-evolution.md): continuous research, implementation feedback, versioned changes, and shared evidence knowledge.
- [Agentic delivery harness contract](./contracts/product-types/agentic-delivery-harness/README.md): research-backed draft and pinned Build Kit baseline; planned improvements remain distinct from delivered capabilities.

## Verification

To check a project change or existing evidence, start with [validation by task](build-kit/docs/validation.md).
The agent finds the relevant checks and reports what passed, what remains open and the next action.

For maintaining this repository:

- `npm run validate:contracts` validates contracts and research traceability.
- `npm run test:build-kit` runs the Build Kit tests; `npm run check` runs the shared checks.

## Licensing

The Build Kit is [MIT licensed](build-kit/LICENSE). Product contract definitions and templates
explicitly marked CC-BY-4.0 retain [CC-BY-4.0](contracts/LICENSE). Referenced third-party research
keeps its original rights. See [LICENSE](LICENSE) for scope.
