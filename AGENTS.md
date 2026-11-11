# Composed repository guide

Composed has two independently versioned components:

- `contracts/` defines technology-neutral product contracts and their research provenance. Read [`contracts/AGENTS.md`](./contracts/AGENTS.md) before using a contract to plan or implement a product.
- `build-kit/` contains Composed Build Kit: the portable multi-agent delivery harness, skills, bridges, CLI, tests, and evals.

For work that spans both components, treat the contract as the product source of truth and the Build Kit as the delivery method. Do not infer a product requirement from Build Kit mechanics, or a technology choice from a contract.

Run validation in the component you change. Keep component release notes and versions independent; cross-component changes must name the contract clause or delivery artifact they affect.
