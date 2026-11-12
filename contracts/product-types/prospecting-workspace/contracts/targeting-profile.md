# Logical interface of the targeting profile — 0.1.0

This profile interface keeps its version 0.1.0 and now accompanies the
candidate product contract 1.0.1; these two versions are independent.

This document details `CAP-PR-001`, `CAP-PR-006` and `CAP-PR-017` of the
[contract](contract.yaml). The [example](../examples/README.md) YAML files illustrate
this interface, without imposing a storage format, an API, a rule language
or a supplier. The profile is a content configuration, never an execution
authority. The normative obligations remain those of the identified clauses.

## What the profile brings to the engine

| Element | Expected content and validation |
| --- | --- |
| Identity and publication | Identifier, version, status, business owner, objective and history; a publication is immutable. |
| Targets | Types sought, labels, typed attributes and any units; fields necessary for a search or for a qualification level distinguished from optional data. |
| Linked entities | Types of contact persons and contextual objects; relations, roles, cardinalities, dates or unknown validity; no contact person is mandatory simply to keep a target. |
| Identity | Reliable identifiers per type with the namespace of the issuer; declared normalisation; possible matching criteria and reasons for review. |
| Acquisition | Candidate sources, access and reuse conditions to be established, filters, limits, field mapping; manual entry and import; inbound form if relevant. |
| Qualification | Named levels, criteria, operators and expected values, dimension, mandatory character, admitted types of evidence, scope and freshness. |
| Prioritisation | Explainable and versioned rules or method; do not mix priority score and qualification evidence. |
| Follow-up | Pipeline, criteria for moving on, outcomes, responsibility, time limits and expected next action; a wait is dated and given a reason. |
| Contact content | Approved offer and value propositions, sourced facts, tone, language, templates and prohibitions; unknown contact details and figures are not generated as facts. |
| Optional monitoring | Population, attributes or search followed, cadence, budget, useful differences and notifications; do not turn a loss of coverage into a business change. |
| Evaluation | Authorised corpus, available ground truth, annotations, simple baseline and measurable thresholds per level. |
| Dependencies | References to the compliance policy, the sources actually authorised and the available channels; their absence blocks only the dependent operations. |

The proper names of connectors, registers or categories are data of the profile
or of its dependencies. Their presence in an example does not make them mandatory
for the core.

## Rules and unknowns

Each criterion has a stable identifier, a dimension and an interpretable rule.
The examples use `field`, `operator` and `value`; the operator values
illustrated are `in`, `equals`, `gte` and `exists`. The rules of a deployment
must have declared semantics and be validatable before publication.
An unknown operator or reference is not executed as free
instructions. A more complex rule belongs to a declared versioned extension,
without changing the invariants of the contract.

An observation brings value, origin, locator, dates, means of obtaining it and
verification state. The attribute types and the evidence are checked before
evaluation. A declared value can be admitted by an explicitly declarative
criterion; it stays labelled as such. Evidence coming from a contact person
must be linked to the record concerned: the interest of a managing agent (syndic)
in one co-owned building (copropriété) does not automatically extend to the others.

Each criterion produces `satisfied`, `not_satisfied` or `unknown`. An unresolved
contradiction, a missing value and stale evidence produce `unknown` for
acceptance. The profile indicates the evidence to obtain to lift this unknown.
A condition is `not_satisfied` when valid evidence demonstrates its failure.
A collection that fails never demonstrates that failure.

A level is admissible when **all** its mandatory criteria are satisfied;
its acceptance still requires an attributed decision. Optional criteria
can help to prioritise, without compensating for a mandatory one. A human exception
stays distinct from this level and does not change the facts.

The examples distinguish:

- **Relevant target**: the characteristics necessary for fit are
  demonstrated; this proves no need.
- **Commercially qualified lead**: evidence specific to the offer and to the record
  satisfies the additional criteria chosen, for example expressed need,
  role of the contact person and accepted next step.
- **Authorised contact for a given action**: a result independent of the
  policy, the purpose, the channel, the recipient and the current restrictions.

A record can satisfy a business level while being forbidden from solicitation.
A message can leave only if this possibility is established separately at the moment
of handover. The profile cannot make a refusal optional or give a positive
weight allowing it to be circumvented.

## Profiles, campaigns and changes

A campaign references a published profile, a pipeline and a validated policy.
Observations and evaluations keep the version used. A new version
can modify criteria, freshness, vocabulary or sources; it does not rewrite the
past. The user sees the affected records and chooses an explicit migration or
re-evaluation, with new decisions and next actions.

A source can become unavailable or incompatible without the profile being
"wrong": the engine flags the limits of coverage and blocks the evaluations
whose evidence is missing. A cascade of suppliers is an optional means
of obtaining an attribute, with authorised access for each supplier, a stop
condition and a budget. It demonstrates neither the accuracy of the attribute nor the
authorisation to solicit.

## Boundary with compliance

The business profile references a policy external to the content; it does not
freely choose a legal basis to circumvent a restriction. The policy contains
the data controller, populations, purposes, jurisdictions, channels, notice,
evidence of consent when it is required, objection rules, retention,
processors, effective dates and review dates.

For a deployment in France, the B2B, B2C, professional or volunteer managing agent
(syndic professionnel ou bénévole) regimes are not deduced from the "copropriété" type
alone. The contact rules must be verified for the actual person and channel. An entry
in open data does not automatically authorise a solicitation. See the CNIL sources and the
limits in the [comparative research](../research/comparison.md).
