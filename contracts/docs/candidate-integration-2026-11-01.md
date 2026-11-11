# Canonical candidate integration — 2026-11-01

At the maintainer's explicit request, the prepared candidates are now the canonical
contracts in each family's `contracts/contract.yaml` and `contracts/traceability.yaml`.
Both files are copied **byte-for-byte** from the corresponding candidate package.
All ten current contracts are **1.0.0**, format **0.1**, maturity **candidate**.

This is integration into the canonical document location, not stable promotion,
independent approval, an application implementation or executed product acceptance.
The candidates' clauses are not rewritten or weakened by the integration.

| Family / current contract | Archived previous version | Current cases |
| --- | --- | --- |
| [3d-engine](../product-types/3d-engine/contracts/contract.yaml) | [0.2.0](../product-types/3d-engine/history/0.2.0/contracts/contract.yaml) | 32 |
| [agent-os](../product-types/agent-os/contracts/contract.yaml) | [0.2.0](../product-types/agent-os/history/0.2.0/contracts/contract.yaml) | 20 |
| [agentic-delivery-harness](../product-types/agentic-delivery-harness/contracts/contract.yaml) | [0.1.0](../product-types/agentic-delivery-harness/history/0.1.0/contracts/contract.yaml) | 26 |
| [career-evidence-platform](../product-types/career-evidence-platform/contracts/contract.yaml) | [0.1.0](../product-types/career-evidence-platform/history/0.1.0/contracts/contract.yaml) | 24 |
| [collaborative-workspace](../product-types/collaborative-workspace/contracts/contract.yaml) | [0.1.0](../product-types/collaborative-workspace/history/0.1.0/contracts/contract.yaml) | 24 |
| [e-commerce](../product-types/e-commerce/contracts/contract.yaml) | [0.1.0](../product-types/e-commerce/history/0.1.0/contracts/contract.yaml) | 12 |
| [git-backed-cms](../product-types/git-backed-cms/contracts/contract.yaml) | [0.1.0](../product-types/git-backed-cms/history/0.1.0/contracts/contract.yaml) | 14 |
| [prospecting-workspace](../product-types/prospecting-workspace/contracts/contract.yaml) | [0.1.0](../product-types/prospecting-workspace/history/0.1.0/contracts/contract.yaml) | 34 |
| [saas-booking](../product-types/saas-booking/contracts/contract.yaml) | [0.1.0](../product-types/saas-booking/history/0.1.0/contracts/contract.yaml) | 12 |
| [video-editorial-workflow](../product-types/video-editorial-workflow/contracts/contract.yaml) | [0.3.1](../product-types/video-editorial-workflow/history/0.3.1/contracts/contract.yaml) | 9 |

The canonical suites contain **207 planned acceptance scenarios** in total. The 3D
contract includes the shader/PBR/HDR and modern rendering pass. Versioned candidate
packages, their proposal/impact/author-review files and the 3D intermediate passes
remain available. Their historical baseline paths describe the pre-integration
layout; use the archived earlier contract when replaying a before/after comparison.

## Preservation and provenance

Every family has `history/<previous-version>/contracts/` with all former canonical
files, not just the YAML. The archive also contains its former family README and
the research source/observation YAML at integration time. This research snapshot
does not claim to recreate an unavailable original-release page body. Historical
prose retains its original relative paths, explained by the archive README.

`contracts/integration.json` records previous version/status, every archived file
digest, selected candidate path, exact current digests and acceptance count.
Current `contracts/review.md` points to the applicable author review rather than
presenting an old-version review as approval of 1.0.0. Supplemental targeting-profile
versioning stays independent from the product contract version.

The schema validator discovers archived contracts. Regression checks verify all
ten canonical pairs against their selected candidates and all archived file
digests, and validate historical traceability against the archived research rather
than relying on future changes to active research.

## Consumer migration and maturity

The canonical paths now intentionally contain new versions and hashes. A consumer
expecting the old version/hash at those paths must explicitly choose the archived
old path or adopt the reviewed 1.0.0 bytes and revalidate. No external consuming
repository, lock, implementation, Build Kit file or proof pin was migrated here.
Identical clause IDs do not rebind old evidence to new obligations.

Independent review and a recorded maintainer decision remain required before
`stable`. All product cases remain `not_run`; the existing source limitations,
including native Premiere retrieval and the historical EDL qualification, remain
recorded. This integration does not create a new network-verification result.

## Observed validation

Environment: existing Linux Node 24.15.0 and checkout dependencies; no installation.

| Check | Result |
| --- | --- |
| `npm run validate:contracts` | Exit 0: current canonical contracts, candidate copies and archived contract formats pass schema checks; current/candidate traceability passes. |
| `npm run test:contracts` | Exit 0: 70 tests pass, none skipped, including new ten-family exact-copy and archive-provenance guards. |
| `npm run example:contracts` | Exit 0: synthetic reference accepted, semantic counterexample rejected, changed checker stale and dependent cases selected. No real product assessed. |
| Canonical identity | All ten contract/traceability pairs match their candidate bytes and recorded SHA-256; all retain candidate maturity. |
| Historical identity/provenance | Every archived file matches its recorded digest. All ten old contracts retain their original version/status and pass traceability review against their own archived research snapshot. |
| Documentation links | 266 links in family entry points, current reviews and archive README files resolve. |
| `git diff --check` | Exit 0. |

No source content was changed or re-fetched for this document integration. Earlier
source-verification limits remain recorded, rather than being presented as new
passing checks. Product acceptance remains not_run; no independent review, stable
promotion, external deployment, commit or push was performed.
