# Integrated validation — 2026-10-26

Scope: the [accepted bounded plan](plan.md), not the complete best-of-breed roadmap. Working-tree base HEAD at implementation validation: `f272f6e860df1ee9b14c4390a2e626e9e636a276`. Build Kit version: 0.7.0 in package metadata, CLI constant and workspace lock entry; root/contracts component versions unchanged. Checks below preceded local commits and tagging. The user subsequently requested separate local commits and the `build-kit-v0.7.0` tag. Push, npm publication and repository visibility changes remain outside this request.

## Completed checks

Runtime observed directly: Windows Node `v24.13.1`, `win32`, `x64`, invoked through WSL. Commands below ran from repository root except the full test log and actual evidence-example log, which were invoked from `build-kit/`. Every shell command used the required RTK prefix.

| Check | Observed result |
| --- | --- |
| `rtk npm run test -- --silent --reporter=dot` (Build Kit) | 124 tests, 20 suites passed; [normalised output](evidence/integrated-tests.txt) |
| `rtk npm run typecheck:build-kit` | Exit 0, TypeScript no-emit check |
| `rtk npm run lint:build-kit` | Exit 0, Biome checked 55 files, no fixes |
| `rtk npm run eval:build-kit` | Catalog: 19 skills / 49 scenarios; fixture adapter: 49/49 passed |
| `rtk npm run eval:evidence` (Build Kit) | 7 actual acceptance controls passed; [output](evidence/integrated-evidence-example.txt), [summary and retained receipts](evidence/integrated-example/summary.json) |
| `rtk npm run validate:contracts` | 11 contract documents and 10 traceability sets passed |
| `rtk proxy npm pack --workspace=composed-build-kit --dry-run --json` | Exit 0; 120 entries; required CLI, evidence fixtures, evaluator and license present; [bounded summary](evidence/package-dry-run.json) |
| `rtk git diff --check` | Exit 0 for tracked edits; new textual files separately checked for trailing spaces and terminal blank lines |

The catalog/fixture checks assert structure and adapter behaviour. They do not establish real model compliance or comparative agent performance. The evidence example executes candidate code and semantic acceptance assertions: correct boundary accepted, plausible wrong boundary rejected despite a normal module-load exit, source change makes applicability stale while preserving historical outcome, not_run is rejected and self-review is identified.

## Independent reviews and correction history

Four reports are archived verbatim under [reviews/](reviews/). Review [01](reviews/2026-10-26-native-subagent-adoption-review-01.md) returned repair case-alias handling and contradictory init flags; [02](reviews/2026-10-26-native-subagent-adoption-review-02.md) exposed a remaining case-insensitive Windows repair variant. [03](reviews/2026-10-26-native-subagent-adoption-review-03.md) accepts the corrected adoption scope after 65 focused tests and real public-CLI no-write probes. All 14 entries of its [source manifest](evidence/adoption/recheck-03-sources.json) match the integrated bytes at final validation. Original manual-collision, exact-backup, keep-local, legacy adoption and partial-I/O fault-injection records/harnesses are in [evidence/adoption/](evidence/adoption/).

The separate [evidence review](reviews/2026-10-26-native-subagent-evidence-review-001.md) accepts its corrected scope after 12 focused tests, 7 example controls and 18 public-CLI invocations against corrected sources. It records a fixed test fixture lookup and an observed mutate-then-restore limitation, now explicitly documented. All 17 entries of its [source manifest](evidence/evidence/source-sha256.json) match integrated bytes. Its exact [corrected CLI log](evidence/evidence/corrected-source-probes/cli-log.json), probe scripts and reviewed source snapshots are retained; [reviewer example](evidence/reviewer-example/summary.json) retains candidates and receipts.

These are distinct native non-author reviewers, as recorded in [agents.md](agents.md). They certify identified snapshots and bounded scopes, not a committed final HEAD. The parent performed final integrated checks. An independent unsigned JSON review declaration is not substituted for those actual runtime reviews.

Archive mapping: reports retain original temporary paths and filenames to preserve their bytes. Selected supporting files are copied under `evidence/adoption/` and `evidence/evidence/`; original `.log` outputs are stored as `.txt`, with ANSI escape sequences and terminal blank lines removed only. Example directories are copied with their receipts/candidates. Absolute temp roots inside historical JSON remain execution context; no verifier is rerun implicitly by opening these records. `integrated-sources.json` names the final changed delivery/documentation files and their SHA-256 hashes, excluding work evidence to avoid a self-referential manifest.

## Limits and remaining release work

Hosted Actions and native Linux/macOS / Node 20 were not executed locally. The six-job OS/Node matrix is configured at repository root; passing local checks are not hosted-run evidence. Bridge installation is separate from actual execution of all skills in all seven runtimes. Package dry run is not a clean registry-install or package publication.

The lifecycle manifest is unsigned local metadata. Preflight and rechecks prevent tested collisions; a later I/O failure can leave a partial update, with exact backups available. Evidence covers explicitly selected files and before/after snapshots, not every intermediate mutation or transitive dependency. It does not authenticate executor/reviewer identity, supervise arbitrary process descendants, confer human approval or establish product closure. Guides state these limits. Draft harness clauses are referenced without promoting the draft, changing product requirements or claiming full conformance.

Scope exit met: implementation checks and distinct bounded reviews pass with the limits above. Comparative real-agent benchmarking and actual hosted compatibility qualification remain the next milestones; no superiority claim follows from this slice.
