# Agentic software delivery harness

[Version française](README.fr.md)

Current canonical version: **1.0.1**, maturity **candidate**. It is the English
translation of 1.0.0, with no intended behaviour change. Read
[contracts/contract.yaml](contracts/contract.yaml),
[traceability](contracts/traceability.yaml) and the [current review](contracts/review.md).

Earlier versions are preserved unchanged: [1.0.0](history/1.0.0/README.md) (French) and
[0.1.0](history/0.1.0/README.md) (French). Independent review, stable promotion and
implementation acceptance remain pending; all product cases are not_run.

Contract **`agentic-delivery-harness` 1.0.1**, **candidate**, integrated on 12 November 2026
(first draft on 24 October 2026, 1.0.0 on 1 November 2026).
It defines a family of tools that coordinate humans, agents, decisions and
evidence to deliver software. Composed Build Kit is the retrofit baseline,
not the universal definition of this family.

| Document | Purpose |
| --- | --- |
| [Contract](contracts/contract.yaml) | 14 capabilities, 37 requirements, 8 invariants, 6 policies, 5 quality attributes and 26 acceptance cases. |
| [Traceability](contracts/traceability.yaml) | Core clauses linked to observations or to an explicit choice. |
| [Comparison](research/comparison.md) | Observed mechanisms, divergences and trade-offs. |
| [Sources](research/sources.yaml) and [observations](research/observations.yaml) | 12 primary sources retrieved and hashed, 18 atomic observations. |
| [Baseline](research/baseline.md) and [hashes](research/baseline.json) | Build Kit 0.5.1, revision `35e6506`, inspected files and gaps. |
| [Verification](research/validation.md) | Checks performed and the limits of this draft. |
| [Continuous evolution](../../docs/continuous-evolution.md) | Research, implementation feedback, proposals, versions and revalidation. |

## Core and modules

The core covers adoption, user decisions, proportionate routing, actual
capabilities, delegation, handoffs, validation, review, evaluation and continuous research.
It chooses no language, model, provider or fixed agent topology.
A simple question can stay direct. A claimed delegation must be real.

Four modules are optional: event controls and hooks, telemetry,
an evidence knowledge graph, and correction and delivery preparation.
Their guarantees apply when they are enabled. The graph can start
from existing artifacts and identifiers; no storage is prescribed.

The graph links sources, observations, clauses, cases, revisions, evidence, incidents
and proposals. Continuous research also detects new developments and contradictions
when there is no incident. Optional telemetry feeds evaluation within the
scope each project authorises. A correction can proceed under an existing
authorisation; a score creates no right to change the contract or to deploy.

## Status and use

The baseline shows a structured method and governance instructions;
its conformance to the new contract has not been assessed. Hooks, the shared graph
and the external supervisor are not delivered by this draft. The
[Runtime plan](../../../docs/composed-runtime/README.md) is a separate design.

The compared references already offer more than isolated skills. No
comparative benchmark and no real agent acceptance run was carried out here.
Quality objectives are design targets, not measurements.

Read the [common protocol](../../AGENTS.md), the contract and its research. Declare
the scope and modules, then map work to `REQ-ADH-*` and `ACC-ADH-*`.
Business requirements of applications keep their own contracts.
No executable external profile is published for this product.

From the repository root: `npm run validate:contracts`. Remote verification of
hashes is separate; non-immutable sources can change.

## Version

- 0.1.0 — 2026-10-24: first retrofit draft, baseline and comparative research;
  hooks, telemetry, knowledge and delivery modules still proposed.
- 1.0.0 — 2026-11-01: candidate; observable delegation and prevention scope, 26 cases.
- 1.0.1 — 2026-11-12: candidate; English translation, no intended behaviour change.

## Translation — 2026-11-12

The [1.0.1 candidate](candidates/1.0.1/contracts/contract.yaml) translates the contract
and its traceability into English. Identifiers, structure and the 26 acceptance cases
are unchanged. See the [proposal](candidates/1.0.1/proposal.md) for the translation
choices a reviewer should check, the [change record](candidates/1.0.1/changes.json) and
the [author review](candidates/1.0.1/review.md). The research observations, comparison,
baseline and verification notes are translated as well; the
[French entry point](README.fr.md) is kept.

## Contract update — 2026-11-01

The [1.0.0 candidate](candidates/1.0.0/contracts/contract.yaml) strengthened 2 clauses
over the 0.1.0 [baseline](history/0.1.0/contracts/contract.yaml). Acceptance increased
from 24 to 26 cases. See the [proposal and migration](candidates/1.0.0/proposal.md),
[exact clause changes](candidates/1.0.0/changes.json) and
[author review](candidates/1.0.0/review.md). The
[batch update](../../docs/contract-updates-2026-11-01.md) records validation and deferred
deepening.
