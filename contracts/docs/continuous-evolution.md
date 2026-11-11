# Continuous research and contract improvement

Status: operating method, introduced on 2026-10-24. This document does not start a
scheduled service, collect project telemetry or change any pinned product contract.

## Two connected loops

Research remains active after the initial contract. Implementation feedback is
one input; new primary sources, compatibility changes, counterexamples and product
research are another. A product can conform to a contract that no longer describes
the desired outcome, so measuring conformance alone is insufficient.

| Loop | Inputs | Output |
| --- | --- | --- |
| Continuous research | Changed documentation, new comparable products, standards, deprecations, unresolved questions and counterevidence | Dated observations, relevance assessment, confidence limits and proposals |
| Continuous improvement | Acceptance failures, incidents, user corrections, implementation outcomes and evaluation results | Diagnosed gaps, regression cases, scoped fixes or proposed contract changes |

Research findings never approve themselves. A popular technique, new framework
or high benchmark score does not automatically become a product requirement.
Preserve contradictory evidence and explain why a local policy is retained.

## Trigger, scope and ownership

Each maintained product family declares its owner, research questions, relevant
sources, review cadence and budget. Event triggers include a source hash change,
deprecation, a repeated failure, a newly unsupported runtime, a significant user
correction or a completed implementation. A periodic review can catch missing
signals, but its schedule must be explicitly configured; this repository creates
no background job. Start with active families and unresolved high-impact questions.

A source change triggers review of dependent observations and clauses; it does
not invalidate the whole catalogue. An unavailable source is marked unavailable,
not silently replaced. Preserve the previously reviewed version/hash and record
whether the change is editorial, behavioural or still unknown. Research beyond
the declared budget produces a scoped follow-up, not an unbounded crawl.

## Evolution workflow

1. **Observe.** Record a dated signal, project/contract revisions, a reproducible
   case and references. Use the [proposal template](../templates/improvement-proposal.md).
2. **Triage.** Distinguish implementation bug, delivery-method defect, stale
   source, missing/incorrect requirement, verification defect and project-specific
   preference. Assign an owner and impact; retain uncertainty.
3. **Research.** Revisit primary sources, collect alternatives and counterexamples,
   and identify affected clauses. Separate observed behaviour from design choices.
4. **Propose.** State the before/after behaviour, scope, exclusions, affected
   identifiers, compatibility, migration, expected benefit and evaluation protocol.
5. **Review and decide.** Assess neutrality, evidence and acceptance sufficiency.
   Record acceptance, rejection or deferral by the authority for that scope. An
   implementation may be fixed under existing authorization; changing the normative
   contract or granting new powers requires the corresponding authority. An agent's
   own score is not approval. Material changes require independent review before
   promotion; draft author checks must be labelled as such.
6. **Version and migrate.** Update contract, observations, traceability, acceptance
   cases and release notes together. Preserve stable identifiers or explicit
   replacement mappings. Existing implementations stay pinned until they adopt a
   change; no silent update of their requirements, stack or permissions.
7. **Validate and learn.** Run structural checks and affected acceptance/regression
   cases on identified implementation revisions. Record `pass`, `fail`, `blocked`
   or `not_run`, costs and limits, then monitor regressions. Close the proposal only
   when its stated exit condition is satisfied; a shipped draft is not field proof.

Suggested states: `observed`, `triaged`, `researching`, `proposed`, `reviewed`,
`accepted`, `versioned`, `validated`, with `rejected` and `deferred` outcomes.
No mandatory ceremony is added to a typo. Existing authorization remains valid
within its scope; the workflow must not ask again for an unchanged decision.

## Versions and evidence

An incompatible requirement change, including a new mandatory constraint for an
existing conformance scope, is breaking. Optional compatible modules may be minor;
editorial clarification without behaviour change may be patch. The contract
format, each product contract, Build Kit and runtime keep separate versions.

Never weaken an invariant, delete a failing case or exclude inconvenient projects
solely to improve a score. Revise an incorrect requirement through a justified
proposal with before/after evidence. Validate the evaluator with positive and
negative controls. Separate exploratory cases used to design a rule from frozen
confirmation cases; report repetitions, baseline, environment and uncertainty.
Security, authority and product regressions cannot be hidden in an average score.

## Implementation telemetry

Telemetry is optional and local by default. An implementation can export a minimal
evidence record: pseudonymous project reference, contract/version, clause/case,
immutable implementation revision, methodology/runtime/configuration versions,
outcome, evidence references, timestamp, and explicitly available duration/cost or
human-correction counts. Mark missing measurements unknown, not zero.

Do not collect raw prompts, credentials, source code or personal data by default.
Each project controls allowed fields, purpose, access, retention and any export.
Project-private records remain private; global lessons may reference a sanitised
case only after the project's permitted sharing rules are satisfied. Withdrawal
or deletion must remove restricted content from derived views and retrieval too.

Telemetry is an observation channel, not an independent judge. An agent's claim
of success remains distinct from tool execution and verified product behaviour.
Different projects and models are not directly comparable without stratification.
Track reported and missing cases to expose selection bias. Aggregated incidents
generate hypotheses; test those hypotheses before promoting a universal rule.

## Shared evidence graph

A logical knowledge graph can connect durable evidence across projects. It
complements local working memory and the current source→observation→clause links.
This is a technology-neutral model; no graph database, embedding service or shared
deployment is selected. Start by indexing versioned repository artifacts and
their identifiers; introduce infrastructure only for a demonstrated query need.

| Node | Identity / scope |
| --- | --- |
| Source snapshot and observation | URL/revision/hash/date, attribution and availability |
| Contract, clause and acceptance case | Product family, version, stable identifier |
| Project and implementation revision | Project-scoped identity and immutable revision |
| Execution, evidence and verdict | Run identity, configuration, provenance and validity |
| Incident, research question and proposal | Scope, owner, status and decision history |
| Skill/method/runtime version and delivery plan | Versioned dependency and declared capabilities |

Useful relations include `supports`, `contradicts`, `derived_from`, `requires`,
`implements`, `evaluates`, `failed_on`, `supersedes`, `invalidates` and `approved_by`.
An edge carries provenance, scope and validity; an inferred relationship is not
a verified fact. Evidence quality, popularity and confidence are separate fields.
Preserve historical truth and distinguish what was believed then from what is
currently supported. An approval edge points to an attributable decision, not
to text generated by an agent. Conflicting records remain inspectable.

Required queries before choosing storage:

- Which clauses depend on a source that changed, and which authorized project records show their adoption?
- Which failures recur for one clause across comparable implementation contexts?
- Which proofs or reviews no longer apply to the current revision?
- Why was a rule adopted, contradicted, retained or superseded?
- Which proposed change is supported by fresh evidence, and what remains untested?

Access checks apply to nodes, edges, search and derived answers. Cross-project
retrieval cannot reveal private existence, content or decisions through an edge.
If the graph is stale or unavailable, expose that limitation and fall back to
authoritative artifacts. It cannot silently rewrite source contracts, invent
missing evidence or replace the authorization boundary.

## Correction and delivery planning

The complete feedback loop may propose a scoped fix, implement it within an
existing authorization, run validation, obtain required review and prepare a
delivery plan. That plan identifies candidate revision, dependencies, rollout,
rollback, verification, responsible actor and required permissions. An accepted
evaluation never grants deployment authority; a prepared plan and an executed
deployment are different facts. This document adds no autonomous deployment.
