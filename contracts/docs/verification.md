# Structured contracts and scoped verification

Format **0.2** is opt-in. Existing 0.1 contracts, versions and pins remain valid and unchanged.
The format, product contract, validation profile, verifier and implementation have independent
versions. A format migration does not authorize new product behavior or stronger mandatory proof
requirements for already pinned consumers.

## Responsibilities

| Artifact | Owner and meaning |
| --- | --- |
| Product contract | Observable behavior, invariants and required proof dimensions, without a stack or adapter protocol. |
| Validation plan | Exact contract bytes, selected normative clauses, case definitions and verifier artifacts. |
| Candidate and adapter | Actual implementation/public-interface translation, with declared revision and artifact bytes. |
| Evidence | Supplied case outcomes, execution metadata, target/checker/output hashes, review declarations and contradictions. |
| Evaluation report | Consistency, current applicability and completion of the selected obligations; not authenticated product certification. |

The sibling validation repository remains the owner of its external profiles and black-box runner.
These tools do not import candidate internals, execute supplied evidence commands, or replace that
runner. They can inspect a normalized local evidence export after its producer and meaning have
been reviewed. A profile name alone is not an interoperability guarantee.

## Format 0.2

Start with [the 0.2 template](../templates/contract-0.2.yaml). Each acceptance scenario adds:

```yaml
verifies: [REQ-ACCESS-001, INV-ACCESS-001]
verification:
  methods: [automated]
  boundary: public-interface
  case_kinds: [positive, negative]
```

`verifies` names requirements, invariants, policies or quality attributes. Every normative clause
must have at least one acceptance link. `depends_on` is optional on these clauses; references must
exist, may not point to themselves and must be unique. Dependency cycles are supported by visited-set
traversal; these relations describe co-required obligations, not an execution schedule.

Methods are `automated` and/or `manual`. Boundaries are `artifact`, `component`, `integration`,
`public-interface`, `human-review`, `field-observation`. Case kinds are `positive`, `negative`,
`malformed`, `boundary`, `concurrency`, `recovery`. Choose dimensions relevant to the behavior.
The declared methods × case kinds form required combinations at the exact declared boundary.
There is no universal evidence ranking: a component test does not substitute for a declared
public-interface observation, and automation does not substitute for a required human review.
Several concrete cases can cover one combination; every declared case remains in scope.
The `human-review` boundary requires `methods: [manual]`; other boundaries may also require
manual observations.

Structural validation checks schemas, identifiers, actor references, normative dependencies and
acceptance coverage. It does not understand arbitrary natural-language contradictions or establish
that a product satisfies its statements. Independent product review and the recorded research
basis remain necessary.

## Plan and evidence formats

[validation-plan.schema.json](../specs/validation-plan.schema.json) pins `contract.id`, `version`
and exact-byte `sha256`. Its scope names selected normative `clause_ids` and a description.
`verifier.artifacts` pins checker/configuration files; each concrete case names an acceptance,
method, boundary and kind. Include all relevant checker dependencies in this explicitly scoped set.

[validation-evidence.schema.json](../specs/validation-evidence.schema.json) binds to those contract
bytes and the exact plan-file SHA-256. It names a target revision and artifact set, case outcomes,
supporting output artifacts and contradictions. Automated passing cases need a completed exit-zero
execution declaration, argv, timestamps, declared duration and runtime. The example records elapsed duration monotonically
and explicitly marks an observed wall-clock regression. Manual passing cases need
an accepted declaration with different author/reviewer identities and contexts. These remain local
declarations, not authenticated actors, permission grants or a proof that a producer is honest.

Artifact hashes identify exact bytes, including line endings. Files outside the declared artifact
sets are outside the applicability claim. The CLI observes the supplied files; it neither re-runs
the verifier nor derives actual behavior from an exit code alone. Exported observations must come
from real candidate actions, not expected assertions or a replay fixture presented as a candidate.

## Evaluate without executing

From the Composed checkout with its existing tooling dependencies installed:

```sh
npm run contracts:coverage -- --contract CONTRACT.yaml --plan PLAN.json --root ARTIFACT_DIRECTORY --json
npm run contracts:coverage -- --contract CONTRACT.yaml --plan PLAN.json --evidence EVIDENCE.json --root ARTIFACT_DIRECTORY --json
```

The evaluator closes the selected scope over normative dependencies and requires every linked
acceptance policy and planned case. It reports omitted clauses explicitly. Missing results,
`blocked`, `not_run`, partial coverage and insufficient proof cannot pass. A relevant contradiction
or required failed case is visible even if other cases pass. Changed contract/plan/checker/target
or supporting output bytes make the proof stale or invalid rather than silently re-binding it.
Format 0.1 has no structured verification policy and returns `not_assessed`; prose is not mined to
invent such a policy.

Each obligation retains its `own_status` from its cases and an effective `status` that also includes
its dependencies: a failed dependency makes it failed, and an open dependency prevents verification.
`blocking_dependency_ids` names direct dependencies preventing a verified status. Cycles with all
required cases satisfied remain verifiable.

`passed` means the supplied records satisfy the **selected-obligations** checks. Reports keep
`full_contract_conformance: not_assessed` and evidence authenticity unassessed. Neither complete
static mapping nor this report automatically certifies an implementation, usability, accessibility,
production resilience or product effectiveness. Product acceptance/deployment authority stays with
the relevant project and external validation process.

The file interface reads bounded ordinary files under the supplied artifact root, rejects unsafe
portable paths and linked artifact components, and never fetches or executes their contents.
See the schemas and implementation for actual ceilings. A conventional filesystem check is not a
transactional or adversarial race-proof sandbox.

## Compare versions and prepare revalidation

```sh
npm run contracts:compare -- --before BEFORE.yaml --after AFTER.yaml --json
npm run contracts:compare -- --before BEFORE.yaml --after AFTER.yaml --mapping CORRESPONDENCE.json --json
```

The comparison reports added/removed/modified/unchanged normative IDs, acceptance changes and
reverse-dependency impact. Capability context, actor permissions, domain, scope, integrations and
delivery-profile changes participate conservatively. Object member order is ignored; array order
is preserved. With 0.1 on either side, targeted acceptance impact is unknown and detected changes
conservatively select every normative clause and case.

Optional [correspondences](../specs/clause-correspondence.schema.json) pin both exact source
versions and declare one-to-one renames, splits or merges as proposed, accepted or rejected.
Competing active mappings and unknown IDs are rejected. Accepted is a supplied correspondence
decision, not behavioral equivalence, authenticated approval, or permission to transfer proof.
`compatibility` remains `not_assessed` and `proof_transfer` remains `not_performed`.
The tool does not determine breaking changes from text similarity; review semantics and version
under the existing [evolution policy](continuous-evolution.md). Old evidence stays historical.

## Runnable controls and next consumer pilot

```sh
npm run validate:contracts
npm run test:contracts
npm run example:contracts
npm run example:contracts -- --output NEW_DIRECTORY
```

The [worked example](../examples/scoped-verification/README.md) actually executes a synthetic JSONL
candidate and a separate checker, accepts the reference, rejects a semantic mutant, detects changed
checker bytes and identifies dependent acceptance cases after a rule change. It is not a consumer product
candidate or a real authentication service. The [CEP pilot proposal](career-validation-pilot.md)
connects the next consumer exercise to existing clauses and the external runner without modifying pins.

The design adapts REA's [obligation ledger](https://github.com/morluto/rea/blob/23de10bb2849cdce8ddbe70504aa7cc57de75a98/docs/reconstruction-obligation-ledgers.md)
and scoped evidence principles, and Ghidra's distinction between version correspondence and
[safe information transfer](https://github.com/NationalSecurityAgency/ghidra/blob/4718f50d9941b9d7b7ebd1febc2982f055560a73/GhidraDocs/GhidraClass/BSim/BSimTutorial_Evaluating_Matches.md).
This is original Composed implementation; neither engine is installed or required.
