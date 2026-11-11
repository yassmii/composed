# Versioned contract updates — 2026-11-01

Subsequent state: the [canonical integration](candidate-integration-2026-11-01.md)
places the prepared candidates in contracts/ and archives the previous versions.
The results and preservation claims below describe the earlier authoring stage.


The maintainer requested normative contract updates after the
[source refresh](research-refresh-2026-11-01.md). This pass prepares **seven
separate 1.0.0 candidates**, in format 0.1, with **18 strengthened clauses and
14 additional acceptance scenarios**. It does not overwrite the baselines or the
existing booking, 3D and commerce candidates. Independent review, stable promotion
and implementation conformance remain separate and unclaimed.

## Concrete changes

| Family / preserved baseline | Proposed candidate | Normative changes | Acceptance before → after |
| --- | --- | --- | --- |
| agent-os / 0.2.0 | [1.0.0](../product-types/agent-os/candidates/1.0.0/proposal.md) | REQ-AOS-012/018: recheck current grant/policy at execution decision, strict grant expiry, approval binding to tool revision, principal, scope and risk. | 18 → 20 |
| agentic-delivery-harness / 0.1.0 | [1.0.0](../product-types/agentic-delivery-harness/candidates/1.0.0/proposal.md) | REQ-ADH-009/022: real delegated-task evidence and prevention claims limited to verified entry paths. | 24 → 26 |
| career-evidence-platform / 0.1.0 | [1.0.0](../product-types/career-evidence-platform/candidates/1.0.0/proposal.md) | REQ-CEP-063/064: honest denominators, frozen task/population slices, missing evidence and mandatory regressions. | 22 → 24 |
| collaborative-workspace / 0.1.0 | [1.0.0](../product-types/collaborative-workspace/candidates/1.0.0/proposal.md) | REQ-CWS-024/031: effective grant composition and scoped, validated restoration including explicit child-content exclusions. | 22 → 24 |
| git-backed-cms / 0.1.0 | [1.0.0](../product-types/git-backed-cms/candidates/1.0.0/proposal.md) | REQ-GCMS-012/014/015/016: authenticated approval attribution, approval of the exact integrated state and current publication-base checks. | 12 → 14 |
| prospecting-workspace / 0.1.0 | [1.0.0](../product-types/prospecting-workspace/candidates/1.0.0/proposal.md) | REQ-PR-008/030: source-schema/mapping provenance and safe reconciliation beyond provider-key retention. | 32 → 34 |
| video-editorial-workflow / 0.3.1 | [1.0.0](../product-types/video-editorial-workflow/candidates/1.0.0/proposal.md) | REQ-VEW-008/013/014 and QA-VEW-005: revision/media-coordinate note binding and exact export/environment acceptance evidence. | 7 → 9 |

The seven suites grow from **137 to 151 cases**. All prior cases are retained
unchanged. Original clause identifiers and unchanged normative content are
preserved. Strengthened meanings and new mandatory evidence are conservatively
breaking; version 1.0.0 does not imply stable maturity. No format-0.2 migration or
structured acceptance coverage is inferred.

Each candidate contains a contract, traceability, exact before/after changes.json,
proposal, migration instructions, manual changed-clause-to-case map and labelled
author review. These are proposed specification changes, not new implementations.
Sources inform the narrow patterns; stronger safety and evidence guarantees are
explicit product choices. For agent-os and the CMS, the source refresh verified
existing pins rather than surveying new upstream behaviour. Their changes address
already documented authority/review questions.

## Review corrections and scope

- Agent OS authority is checked at the recorded execution decision, after waits.
  A later revocation does not falsely imply an external effect was undone. The
  principal-only approval rule is preserved, with positive controls so denying
  everything cannot satisfy the new evidence.
- Harness prevention is distinguished from after-effect observation, including
  indirect entry paths. An internal-agent event alone is not proof that an
  explicitly delegated task ran. No general requirement to delegate every task
  and no Build Kit implementation change is introduced.
- Career evaluation keeps task measures separate. Undefined denominators,
  unexecuted slices and all-abstention results cannot become demonstrated quality.
  A known-count scorer fixture is a planned control, not an executed benchmark.
- Workspace restoration declares scope before confirmation. Missing selected
  content cannot become a complete-success restore; explicit exclusions do not
  masquerade as recovered child bodies. Restore cannot widen current authority.
  The contract does not adopt Notion's grant algorithm as a universal rule.
- CMS validation does not replace approval of the actual integrated revision.
  Clean integration also returns to review. Current publisher authority and
  publication-base checks preserve atomic consumer visibility; Git metadata alone
  is not authenticated approval. No identity provider or signing scheme is chosen.
- Prospecting retries retain business identity beyond provider-key expiry, with
  current restrictions checked before a new effect. Source-schema failure is a
  technical limit, not evidence that a prospect lacks a business attribute.
- Video range notes remain conditional on the product exposing them. Notes stay
  tied to their media revision and coordinates. QA-VEW-005 is explicitly a product
  choice; the candidate no longer cites OBS-VEW-011/012 as current proof of that
  guarantee. Both native Adobe URLs and the historical EDL qualification remain
  unresolved research findings. No verified EDL fidelity or native import is claimed.
- All optional-module conditions are preserved. Every case must be accounted for;
  conditional not_applicable requires its actual unmet condition and declaration.
  Missing execution, unconditional obligations and failing cases cannot be skipped.

## Migration and decision boundary

Owner: repository agent. Decision authority: Composed maintainer. Drafting these
candidates is authorised by the maintainer's request; it does not record their
independent approval or adoption by a consuming project. Independent review and a
maintainer decision precede stable promotion. The contract's maturity and an
implementation's acceptance remain different decisions.

Existing consumers keep their exact pins. Adoption selects the reviewed candidate,
assesses changed state/permission/evidence semantics and executes its full applicable
suite on an identified implementation revision. Conservative impact reports select
all normative clauses and cases for these format-0.1 changes; they do not determine
semantic compatibility or transfer proof. Old evidence remains attached to old bytes.
Rollback retains/restores the old pin; implementation data and operational rollback
require their own assessment.

No new product family, stack, provider, transport, adapter or deployment is selected.
The later deepening pass remains open for newer upstream versions, independent
research/review, representative corpora, real runtime/editor fixtures and measured
performance. All **151 product scenarios are not_run** in this seven-family pass.

## Validation

Environment: existing Linux Node 24.15.0 and checkout dependencies; no install.

| Check | Observed result |
| --- | --- |
| `npm run validate:contracts` | Exit 0: all ten baselines and ten versioned candidates pass schema and native traceability checks. |
| `npm run test:contracts` | Exit 0: 68 tooling tests pass, none skipped. These are not product tests. |
| `npm run example:contracts` | Exit 0: synthetic reference accepted, semantic counterexample rejected, modified checker stale and dependent cases selected. No family conformance assessed. |
| Native `contracts:compare` for each of the seven baseline/candidate pairs | All seven assessed; exact results saved as impact.json beside each proposal. No normative identifier added or removed. All clauses/cases conservatively affected, targeted coverage unknown, semantic compatibility not_assessed, proof_transfer not_performed. |
| Candidate integrity | All 137 earlier acceptance scenarios are unchanged, all 14 additions and 18 clause changes match changes.json, all changed clauses have a manual case mapping, and all candidate/impact fingerprints agree. Scope, actors, domain, integrations, policies and invariants are unchanged. |
| Exact-byte preservation | All 20 baseline contract/traceability files and four pre-existing booking/3D candidate files match HEAD. The previously prepared commerce contract still matches its recorded SHA-256. |
| Local document links | 106 links in the seven family entry points/proposals/reviews resolve; impact references added after this check also point to the seven produced files. |
| `git diff --check` | Exit 0. |

The earlier source-refresh run is recorded separately as 170/172 matched with
two native Adobe HTTP 403 failures. This normative-only pass does not change any
source record or claim a new network verification. Video's candidate guarantee is
an explicit choice with planned exact-environment evidence; it does not repair or
authenticate the historical source observation. All product cases remain not_run.

Author checks cannot establish independent approval, actual runtime enforcement or
truth of an implementation's evidence producer. No commit, push or consumer-pin
change was performed. Temporary scripts and command logs remain outside Git;
the committed-intent artifacts are specification, traceability, proposals and
native impact reports.
