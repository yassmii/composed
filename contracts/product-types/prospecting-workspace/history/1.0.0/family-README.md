# Prospecting and prospect follow-up

[Version française](README.fr.md)

Current canonical version: **1.0.0**, maturity **candidate**. The maintainer
requested integration on 2026-11-01. Read [contracts/contract.yaml](contracts/contract.yaml),
[traceability](contracts/traceability.yaml) and the [current review](contracts/review.md).
The previous 0.1.0 package is preserved under [history/0.1.0/](history/0.1.0/README.md).
Candidate authoring records below remain historical; independent review/stable
promotion and implementation acceptance remain pending.


Product contract **`prospecting-workspace` 1.0.0**, status **candidate**, integrated on
1 November 2026 (first draft on 23 October 2026). It defines a tool to discover targets, receive
inbound requests, qualify on evidence and organise follow-up. Its business
content is supplied by separate profiles: local businesses, co-owned buildings, projects,
people, organisations or other configured types.

The request "a site to prospect co-owned buildings and get qualified leads or
prospects" is one example application. Prospecting local businesses is another
application of this family, not its universal model.

The contract, its research and the example profiles are written in French.

## Read and use

| Document | Role |
| --- | --- |
| [Contract](contracts/contract.yaml) | Identified requirements, invariants, policies, quality and 34 acceptance scenarios. |
| [Profile interface](contracts/targeting-profile.md) | What separately defines targets, criteria, sources, evidence and sales arguments. |
| [Comparative research](research/comparison.md) | Documented findings, divergences and the trade-offs retained. |
| [Sources](research/sources.yaml) and [observations](research/observations.yaml) | Primary references, retrieval dates and hashes of the retrieved content. |
| [Traceability](contracts/traceability.yaml) | Link from each capability, requirement, invariant, policy and quality attribute to observations or to an explicit choice. |
| [File verification](research/validation.md) | Checks actually passed, distinguished from the tests of a future implementation. |
| [Illustrative profiles](examples/README.md) | Co-owned buildings, local businesses and digital projects, with no mandatory geography. |

## How the product is split

```text
Published business profile                   Validated compliance policy
types, criteria, sources, evidence            purpose, population, jurisdiction,
freshness, sales argument, outcome            channel, notice, retention
                    \                        /
                      Prospecting engine
       discover / receive → examine → qualify → follow up
                      targets ↔ contacts
                   separate records per campaign
                     tasks → approved actions
```

The core needs no city, business category or email address to exist.
A target and a contact are two distinct roles. A co-owned building can
have several contacts, and a managing agent can be associated with several targets.
Sharing a contact must therefore not cause them to be merged.

**"Qualified" is a verifiable decision**, defined per profile and per level.
Four dimensions stay separate: fit with the target, demonstrated interest or
need, data quality, and ability to contact. A directory entry,
a public note, a collective signal or a form does not by itself prove
purchase intent. An unknown mandatory criterion blocks acceptance at the level
concerned. The user sees the missing evidence and the next step.

For the co-owned buildings case, the expected path is for example: identify a
target in an authorised source → verify its characteristics → establish the right
contact and their role → obtain evidence of a need related to the offer → accept
or reject the record → plan follow-up. An inbound request can join
this path without a list having been acquired first.

## What "state of the art and good practice" means here

The research compares documented features of Attio, HubSpot, Pipedrive and Clay,
supplemented by Salesforce and Apollo where their documentation can be read by
browsing but not retrieved by the content verifier. It also draws
on CNIL, W3C, OWASP, Google and the integration behaviours documented by Stripe.
The [comparison](research/comparison.md) contains the links and their limits.

The advanced choices retained are the separation of identity and process, versioned
profiles, evidence provenance, multidimensional qualification,
interchangeable sources, enrichment budgets, signal tracking,
retries without duplicates and per-profile evaluation. AI, sequences and
monitoring are optional; their guarantees are mandatory once enabled.

This file provides a **design synthesis grounded in sources**. It provides
no hands-on benchmark of the products cited, no measurement of an implementation,
and no evidence of being better across the board. `CAP-PR-016` specifically requires
measuring improvements on a corpus held out from tuning, against a simple
reference, with quality, coverage, cost, latency and regressions visible.

## Consuming this contract

Read [the common protocol](../../AGENTS.md), then the contract and its research before
choosing an architecture. Link work to `REQ-PR-*` and `ACC-PR-*`.
Declare the enabled capabilities and their evidence; validating the YAML is not
validating the product. The illustrative profiles are not campaigns
authorised to collect or send.

The contract imposes no technology and comes with no executable external
conformance profile: no non-existent artifact is announced as available.
An implementation must provide the coverage matrix and the evidence described
in `delivery`.

From the repository root:

```bash
npm run validate:contracts
# Additional check, dependent on the availability and evolution of the sites:
npm run verify:research
```

## Version

- **0.1.0 — 2026-10-23**: first definition of the `prospecting-workspace` family,
  with comparative research, profile separation, prospect follow-up,
  inbound collection and failure scenarios. No change to the Build Kit.

## Proposed contract update — 2026-11-01

The [1.0.0 candidate](candidates/1.0.0/contracts/contract.yaml) strengthens 2 clauses
and retains the 0.1.0 [baseline](history/0.1.0/contracts/contract.yaml) unchanged. Acceptance
increases from 32 to 34 cases. See the [proposal and migration](candidates/1.0.0/proposal.md),
[exact clause changes](candidates/1.0.0/changes.json) and [author review](candidates/1.0.0/review.md).

Maturity is candidate, format 0.1. Independent review and stable promotion remain
pending; all product cases are not_run. Existing consumer pins and Build Kit do
not change. The [batch update](../../docs/contract-updates-2026-11-01.md) records
validation and deferred deepening.
