# Contract research refresh — 2026-11-01

Subsequent state: the [canonical integration](candidate-integration-2026-11-01.md)
places the prepared candidates in contracts/ and archives the previous versions.
The results and preservation claims below describe the earlier authoring stage.


This document records the source-refresh stage. The subsequent
[normative contract update](contract-updates-2026-11-01.md) prepares separate
candidates; it does not retroactively change the results or scope recorded here.

This pass follows the maintainer's request to continue updating existing families
and defer deeper research. It complements the separate booking, 3D and e-commerce
candidates; it does not create a new family or promote a contract.

## Scope and result

Re-fetch the seven remaining families' **130 recorded sources** using the native
verifier's retrieval and normalisation rules. Initial results: **112 unchanged
hashes, 16 changed hashes and 2 retrieval failures**. Re-read the dependent
observation passages for all sixteen changes before updating their source records.
Preserve each original manifest; record old/new hashes, observation dependencies,
affected clauses and errors in a dated family report. Historical bodies are not
available, so this does not establish when or how those pages changed.

| Family | Initial unchanged / changed / unavailable | Update and boundary |
| --- | --- | --- |
| [agent-os](../product-types/agent-os/research/README.md#corpus-refresh--2026-11-01) | 15 / 0 / 0 | All recorded immutable pins retrieved unchanged; newer upstream revisions not surveyed. |
| [agentic-delivery-harness](../product-types/agentic-delivery-harness/research/README.md#corpus-refresh--2026-11-01) | 11 / 1 / 0 | Hooks reference reviewed; record after-effect and internal-agent limitations. Build Kit retrofit remains historical. |
| [career-evidence-platform](../product-types/career-evidence-platform/research/README.md#corpus-refresh--2026-11-01) | 15 / 3 / 0 | Publisher/arXiv passages rechecked; narrow evaluation populations retained, no reproduction claim. |
| [collaborative-workspace](../product-types/collaborative-workspace/research/README.md#corpus-refresh--2026-11-01) | 26 / 4 / 0 | Access, history and automations rechecked; add permission composition, restore-scope and history-portability counterevidence. |
| [git-backed-cms](../product-types/git-backed-cms/research/README.md#corpus-refresh--2026-11-01) | 28 / 0 / 0 | All recorded immutable pins retrieved unchanged; current deployment behaviour not assessed. |
| [prospecting-workspace](../product-types/prospecting-workspace/research/README.md#corpus-refresh--2026-11-01) | 15 / 6 / 0 | Pipedrive, CNIL, RNIC and Stripe passages rechecked; RNIC file not downloaded, deployment policy not approved. |
| [video-editorial-workflow](../product-types/video-editorial-workflow/research/README.md#corpus-refresh--2026-11-01) | 2 / 2 / 2 | Frame.io reviewed, Nextcloud unchanged; native Premiere verification remains partial and EDL wording needs qualification. |

Four initially changed HTML sources (Airtable and Frame.io) now use the already
supported `html_article_text` normalisation; both retrievals match under that rule.
Stripe references in prospecting now select official English Markdown, matching
the representation reviewed in the commerce update. The other changed snapshots
also matched on a second retrieval. The final native check remains the authority
for whether those recorded hashes still match at check time.

The subsequent catalogue-wide check also detected a new Unity Transform mismatch
outside the seven-family batch. A [supplemental 3D source review](../product-types/3d-engine/research/refresh-2026-11-01.md)
rechecked OBS-3D-002 and updated that one hash after two matching retrievals,
preserving the preceding manifest and both contract versions.

Seven new atomic observations are research inputs: OBS-ADH-017/018,
OBS-CWS-026–028, OBS-PR-030 and OBS-VEW-015. They are not automatically adopted as
mandatory product clauses. Original observation files are archived where additions
were made. Research maturity remains `initial` in these seven families: this is
a scoped author review, not a complete independent research review.

## Contract impact and unresolved evidence

The seven baseline contract and traceability files remain byte-for-byte unchanged.
Their dated records identify affected existing clause IDs and explain retained
choices. Existing requirements already distinguish runtime claims from prevention,
declared evaluation from performance proof, provider retry from a business effect,
and recovery/history from implementation conformity. No new mandatory requirement
or evidence obligation is introduced by this documentary batch, so no product
version is bumped. Consumer pins and Build Kit are unchanged; proof transfer is
not performed. All product acceptance cases are not_run.

Video finding **VEW-REFRESH-001** remains open for **OBS-VEW-011 / QA-VEW-005**.
The native checker receives HTTP 403 for both Premiere URLs and retains the
previous hashes/dates. A separate browser read of the official EDL page is possible:
its text supports simple projects without nested sequences but says common effects
translate well. The broader historical claim about effects/speed changes must not
be treated as freshly established. Resolve the native snapshot and qualify that
observation before relying on it as current evidence. The export-format page still
lists EDL/XML in the browser, but that is not native exact-byte verification or a
successful import in an editor.

## Deferred deepening

Follow-ups are recorded per family: newer upstream revisions, independent review,
runtime fixtures, representative held-out corpora, effective permission composition,
restore completeness, provider uncertainty beyond retention windows, actual source
schemas and native editor handoffs. Current source availability does not settle
those questions. This manual pass creates no recurring task, telemetry or deployment.

Owner: repository agent. Decision authority: Composed maintainer.

## Observed validation

Environment: existing Linux Node 24.15.0 and checkout dependencies; no installation.

| Check | Result |
| --- | --- |
| `npm run validate:contracts` | Exit 0: all baseline/candidate schemas and traceability chains pass. |
| `npm run test:contracts` | Exit 0: 68 tooling tests pass, none skipped. No product acceptance executed. |
| `npm run verify:research` | Exit 1: 170 of 172 active source snapshots retrieved and matched; only the two retained Premiere URLs return HTTP 403. All 17 previously observed/this-pass hash mismatches are resolved after source review, including the supplemental Unity check. |
| Exact-byte preservation against HEAD | All ten baseline contract/traceability pairs, four pre-existing candidate files and seven archived source manifests match their previous bytes (31 files). The commerce candidate remains the preceding session's local addition. |
| Refresh-record consistency | Seven records match current source URLs/dates/hashes, observation hashes and dependency lists. All prior observation meanings are retained; seven new observations are appended. |
| `git diff --check` | Exit 0. |

Freshness matches are observations at check time, not permanent source stability.
The two unavailable sources remain unavailable in the native check; their retained
hashes are not claimed to have passed. The browser-only EDL qualification remains
an open finding. No independent review, implementation conformance, commit or push
is claimed. Only metadata and paraphrased research are added to Git; raw source
bodies, audit scripts and command logs remain outside the repository.
