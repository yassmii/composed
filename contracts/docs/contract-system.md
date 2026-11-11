# Product contract system

## Responsibilities

| Layer | Question it answers | Example |
| --- | --- | --- |
| Research | What do comparable products demonstrably do? | Godot, Unity, and Unreal all expose scene hierarchies, with material differences. |
| Product contract | What behaviour, rules, and proof does this product require? | Confirmed reservations cannot exceed finite capacity. |
| Skills | How is a capability implemented or verified? | Accessibility, payment, database, or E2E testing skills. |
| `AGENTS.md` | How do agents work in an implementation repository? | Read the contract; connect requirements to tests. |
| Implementation | How does one project satisfy the contract? | Rust or TypeScript code, infrastructure, and tests. |

The contract is intentionally independent of implementation technology. It specifies outcomes and constraints, never a preferred framework.

## Product-type unit

Each folder in `product-types/` owns one product family and contains its complete provenance.

```text
product-types/3d-engine/
  research/
    sources.yaml       # official documentation, version, retrieval date
    observations.yaml  # small, attributable factual observations
    comparison.md      # convergence, divergence, and open questions
  contracts/
    contract.yaml      # implementation-neutral, testable decisions
    traceability.yaml  # contract clause -> research observation
```

Research is evidence, not a disguised specification. A contract must label a clause as either a supported convergence or an explicit project choice when sources diverge.

## Contract anatomy

- `intent`: user promise and measurable outcome;
- `scope`: explicit inclusions and exclusions;
- `actors` and `domain`: shared vocabulary and minimum domain model;
- `capabilities`: expected behaviour with priority;
- `invariants` and `policies`: always-true rules and deliberate product decisions;
- `quality_attributes`: measurable cross-cutting properties;
- `integrations`: external systems and failure behaviour;
- `acceptance`: scenarios that prove conformance;
- `delivery`: required artifacts and verification; it may optionally identify a versioned external validation profile.

Identifiers are stable and unique inside a contract so issues, tests, metrics, and implementation records can reference them.

Format 0.2 can express acceptance-to-clause `verifies` links, normative `depends_on` relations and
required proof dimensions. It is opt-in; existing 0.1 contracts are not silently migrated. The
[verification guide](verification.md) describes static checks, local scoped proof evaluation and
version impact. A complete mapping is not an executed acceptance result; supplied evidence remains
separate from normative product rules and from approval authority.

## Contract maturity

The `status` field has the same meaning in formats 0.1 and 0.2:

- `draft`: research or normative wording is still being developed.
- `candidate`: the proposed clauses, provenance and acceptance scenarios are ready
  for independent review; author checks are recorded and remaining questions are
  explicit. This does not constitute approval or a stable release.
- `stable`: the contract has completed independent review and the responsible
  maintainer has recorded the decision to promote it for versioned consumption.
- `deprecated`: the contract is retained for existing pins but no longer recommended
  for new adoption; record replacement and migration guidance where applicable.

Maturity, product version and schema version are separate. A 1.0.0 contract can be
`candidate` before its first stable release. Changing status changes contract bytes;
existing exact-byte pins and evidence are not silently rebound. Candidate storage
under `candidates/<version>/contracts/` keeps the current contract intact before
explicit integration.

At an authorised canonical integration, copy the selected candidate bytes into
`contracts/` and archive the prior package under `history/<previous-version>/`,
including contract, traceability and an explicitly dated research snapshot.
Record exact digests and the selected candidate in `contracts/integration.json`.
Canonical location and maturity are separate: integration can retain `candidate`
without declaring `stable`. External consumers must explicitly select new bytes
or the archived old path; neither their pins nor earlier proof are rebound.

Contract stability concerns the specification. It does not require a conforming
implementation to exist and does not certify one. Implementation acceptance,
conformance results and deployment authority remain separate evidence and decisions.
Independent review before stable promotion follows [continuous evolution](continuous-evolution.md).

## Specialist roles

- **Research agent**: uses primary sources, records versions and observations, and does not promote preferences into facts.
- **Contract author**: turns evidence and explicit choices into testable clauses, invariants, and acceptance criteria.
- **Contract reviewer**: checks provenance, neutrality, internal consistency, and whether acceptance evidence genuinely proves the clause.

These roles should be implemented as versioned skills or role instructions, not as proprietary assumptions of a single agent.

## Versioning and extension

Contract versions follow SemVer:

- **MAJOR**: removes or incompatibly changes a rule.
- **MINOR**: adds a compatible capability or optional module.
- **PATCH**: clarifies wording without changing behaviour.

A new mandatory constraint for an existing conformance scope is a breaking change,
even when expressed as an added clause. Compatible additions must not silently
increase obligations for already pinned implementations.

Extensions belong in a namespaced `extensions` object, such as `booking.waitlist` or `engine.physics`. An extension cannot silently change an existing invariant or conceal an out-of-scope feature.

## External validation profiles

`delivery.validation_profile`, when present, names an external, versioned conformance
profile using an implementation-neutral identifier and version. The profile is owned by a
validation repository and maps contract clauses to fixtures, execution rules, and evidence
records. It can require that an implementation offer a black-box validation adapter, but
it must not prescribe the adapter's transport, language, framework, or deployment model.

The profile is delivery evidence, not product behaviour: adding a profile does not invent
requirements absent from the contract. A contract author uses it only when independently
executable proof is required; an implementation then declares how its public surface is
adapted to that profile. A report distinguishes planned cases from cases actually executed
against an immutable implementation revision.

## Continuous research and improvement

Contracts evolve through two connected loops: new primary research and feedback
from implementations. Follow [continuous evolution](continuous-evolution.md) to
triage observations, investigate counterevidence, propose scoped changes, review,
version, migrate and revalidate. Use the [proposal template](../templates/improvement-proposal.md)
for material changes; editorial fixes remain proportionate.

Versioned source, clause, project and validation records can form a shared evidence
graph. Local working memory remains session context. The graph, telemetry and
evaluation can inform a decision; none can approve its own normative changes or
grant deployment authority. Research freshness and implementation conformance are
tracked separately, and optional telemetry respects each project's sharing scope.

