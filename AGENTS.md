# Composed repository guide

Composed has three independently versioned components:

- `contracts/` defines technology-neutral product contracts and their research provenance. Read [`contracts/AGENTS.md`](./contracts/AGENTS.md) before using a contract to plan or implement a product.
- `build-kit/` contains Composed Build Kit: the portable multi-agent delivery harness, skills, bridges, CLI, tests, and evals.
- `technology/` contains advisory technology research, selection studies and source monitoring. Read its `AGENTS.md` before using or updating the reference; it does not prescribe a product stack.

For work spanning components, treat the contract as the product source of truth, the Build Kit as the delivery method and technology research as advisory evidence. Do not infer a product requirement from Build Kit mechanics, or a technology choice from a contract.

Run validation in the component you change. Keep component release notes and versions independent; cross-component changes must name the contract clause or delivery artifact they affect.
