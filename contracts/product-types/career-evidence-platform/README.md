# Career Evidence Platform

[Version française](README.fr.md)

Current canonical version: **1.0.0**, maturity **candidate**. The maintainer
requested integration on 2026-11-01. Read [contracts/contract.yaml](contracts/contract.yaml),
[traceability](contracts/traceability.yaml) and the [current review](contracts/review.md).
The previous 0.1.0 package is preserved under [history/0.1.0/](history/0.1.0/README.md).
Candidate authoring records below remain historical; independent review/stable
promotion and implementation acceptance remain pending.


Product contract proposal **1.0.0 — candidate**, integrated on 1 November 2026 after a refresh
of the initial research of 21 October 2026. It defines a family of platforms that let a person
understand, correct and use a documented professional history.

The intended outcome is concrete: bring a first source, understand what
was drawn from it, correct a piece of information, then prepare a useful output
whose sharing the person controls.

- [Comparison and limits of the evidence](research/comparison.md).
- [Research plan](research/RESEARCH-PLAN.md), [sources](research/sources.yaml)
  and [observations](research/observations.yaml).
- [Normative contract](contracts/contract.yaml) and
  [clause provenance](contracts/traceability.yaml).
- [Review and points to decide](REVIEW.md).

The contract is written in English; the comparison, research plan and review are in French.

The core covers the career history, sources, provenance, corrections,
contextualised skills, guidance, outputs, permissions, deferred
processing, migration and evaluation. Career exploration and
testimonials are proposed as `should` modules; the contact network and
the exchange of digital credentials as `could` modules. Once a module is
enabled or announced, all its guarantees apply.

The contract chooses no provider, graph engine, AI model or
physical split of services. Objectives and constraints specific to a consumer
product are kept in its own repository. Interview data and private
exchanges do not enter the public provenance of this unit.

The 65 requirements and 22 scenarios describe behaviours to demonstrate. They are
not an implementation, not test results, and not evidence that the product
outperforms those studied. Usability and responsiveness thresholds
are explicit proposals to validate.

The external profile `career-evidence-platform/conformance@0.1.0`, carried by
`composed-validation`, defines the executable cases and complementary evidence.
Its adapter protocol stays in the validation repository; this reference imposes
no implementation technology.

## Proposed contract update — 2026-11-01

The [1.0.0 candidate](candidates/1.0.0/contracts/contract.yaml) strengthens 2 clauses
and retains the 0.1.0 [baseline](history/0.1.0/contracts/contract.yaml) unchanged. Acceptance
increases from 22 to 24 cases. See the [proposal and migration](candidates/1.0.0/proposal.md),
[exact clause changes](candidates/1.0.0/changes.json) and [author review](candidates/1.0.0/review.md).

Maturity is candidate, format 0.1. Independent review and stable promotion remain
pending; all product cases are not_run. Existing consumer pins and Build Kit do
not change. The [batch update](../../docs/contract-updates-2026-11-01.md) records
validation and deferred deepening.
