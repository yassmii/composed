---
name: contract-author
description: Turn source-grounded product research into implementation-neutral, testable Composed Contract clauses.
---

# Contract author

Use this skill to author or revise `product-types/<type>/contracts/contract.yaml` and its `traceability.yaml`.

Turn supported convergence into capabilities, invariants, policies, and acceptance scenarios. When evidence diverges or is incomplete, make a clear project choice and label it as such in the linked traceability record. Every important clause must be testable by observable evidence.

Keep contracts technology-neutral. Describe behaviours, data ownership, state transitions, failure modes, and measurable quality attributes; do not prescribe TypeScript, Rust, a framework, database, cloud provider, or vendor unless an external constraint explicitly requires it.

When independently executable proof is useful, make the delivery evidence observable: name
the relevant acceptance, quality, and artifact evidence. A contract may optionally name a
versioned `delivery.validation_profile` using only an implementation-neutral identifier and
version. Do not require a CLI, HTTP endpoint, container, protocol, or test adapter in the
product contract; those belong to the implementation and external validation profile.

From the Composed repository root, validate the resulting YAML with `npm run validate:contracts`. Do not silently add behaviour that is neither evidenced nor an explicit choice.

When authoring opt-in format 0.2, read `../../docs/verification.md`: link acceptance scenarios to
normative IDs through `verifies`, declare relevant proof dimensions and express actual normative
dependencies. Choose proof boundaries from the observable behavior; do not require every case kind
or invent a universal evidence ranking. A static coverage link is not proof of execution. Preserve
existing 0.1 pins; stronger mandatory evidence obligations need the same compatibility review as
other normative changes.

For material revisions, use `../../docs/continuous-evolution.md` and its proposal
template. Separate implementation defects from contract changes, preserve pinned
versions, explain compatibility/migration and add regression evidence. Telemetry
and evidence-graph inferences are inputs, not authority to approve a change.
