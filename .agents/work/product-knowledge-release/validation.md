# Validation — product, knowledge and source-release preparation

Validated locally on 2026-10-29 against the exact hashes in the
[accepted source manifest](review-evidence/review02-source-manifest.json). Build Kit source version
remains 0.7.0/Unreleased; contracts, their versions and previous tags are unchanged. No registry
publication, visibility change, telemetry/recruitment or model benchmark was performed.

| Check | Actual evidence |
| --- | --- |
| Linux Node20.20.2 | 184/184 tests, 24 suites; [log](linux20-final-tests.txt) |
| Linux Node24.15.0 | 184/184 tests, 24 suites; [log](linux24-final-tests.txt) |
| Windows Node24.13.1 | 181 passed, three POSIX-specific skips /184; [log](windows-final-tests.txt) |
| Typecheck and Biome | Passed; 74 source/config files |
| Catalog and phrase fixture | 19 skills /53 scenarios; fixture53/53 (routing plumbing, not adherence) |
| Executable evidence | Seven actual command/acceptance/applicability controls pass |
| Semantic calibration | Nine seed/reference/mutant controls pass; no model calls |
| Product example | Reference A1–A6 passes; plausible wrong implementation rejected A2/A4; effectiveness remains not_assessed |
| Skill metadata | Ten final bilingual sources validate via temporary SKILL.md copies; [hashes](skill-validation.json) |
| Contracts/schema provenance | 11 contract documents and 10 traceability sets pass after root transitive parser patch; no contract source edits |
| Lockfile/platform records | All89 optional dependencies resolve before clean installation |
| Actual npm selection | 144 files; content/identity checks pass, no archive/publication inferred; [output](package-check.txt) |

Native Node20 archive provenance and checksum verification are in [node20-provenance.json](node20-provenance.json).
Node/npm native to each OS were used; parent Windows install used ignore-scripts and separate audit
evidence. No macOS or hosted Actions execution is inferred. Raw terminal evidence is kept as exact
bytes with scoped binary Git attributes, including trailing whitespace; JSON/reviews/source hashes
are not reformatted.

## Adverse results and corrective review

Initial full suites failed two old tests: an English skill check depended on removed wording, and a
PM-customisation fixture's replacement no longer matched anything. Logs remain as *-initial-tests.txt;
the [original fixtures](initial-test-fixtures/) are reconstructed exactly from clean base626af9c.
The correction compares deployed EN bytes to their actual EN source, creates genuine project-owned
content independent of prose, checks exact preservation and verifies reinstallation of a missing
managed skill. Tests/gates were not suppressed. All three final suites pass.

[Review01 returned necessary](reviews/implementation-review-01-return-needed.md). Its manifest was
captured while parent fixture corrections landed, so that manifest includes corrected test bytes
although its findings refer to preceding failing logs. This timing mismatch is explicitly corrected
in [Accepted review02](reviews/implementation-review-02-accepted.md), without overwriting report01.
Review02 pins fresh source/evidence identities and independently executes 22 Node20 init/update
tests plus typecheck/lint, inspects all final suites and validates artifact/forward deltas.

## Dependency scope

[Initial audit](audit-before/audit-report.md): seven affected development packages, zero reported
production findings. Parent authorised a clean targeted tooling update: resolved Vitest4.1.12 and
Vite6.4.5, fast-uri3.1.9/source-map-js1.2.2, with tinypool/vite-node removed. Vitest5 was not selected
because it drops the existing Node20 lane. All35 resolved runtime dependency-edge versions remain
unchanged; no root overrides or unrelated test/config edits were needed. See the
[remediation report](dependency-remediation/remediation-report.md) and raw before/after audits.
Both final full and production npm audits report zero findings at observation time; this is not a
general security certification. Dependency-only author tests predate the integrated184-test runs.

## Actual archive smoke

[Summary](package-smoke/summary.json) and [10 command records](package-smoke/executions.json): actual
tarball creation, offline install in an external disposable consumer, packaged CLI version/init,
doctor, knowledge/preflight, keep-local update and uninstall preview/apply all exit0. User-owned
content and memory survive. The reviewer independently verifies the artifact SHA and all144 tar
members against current canonical bytes. This identifies an uncommitted-source smoke artifact,
not a new release or published package. Consumer range resolution/cache scope is recorded separately
from repository lock reproducibility. Security-reporting settings and repository visibility remain
unverified external release decisions, not silently enabled features.

## Independent installed-skill exercise

[Raw report](forward/exercise.md), [inventory](forward/inventory.json) and
[selected archive](forward/archive-manifest.json) retain initial quota failure and actual resumed
results. CaseA distinguishes delivered-code assertions from fictional/product outcome evidence.
CaseB creates only a manual QA plan with absent UI/unperformed tests explicit. CaseC reads newer
canonical sources, runs the current bounded command, updates only two stale operating notes and
leaves the actual independent-review gate open. Its local command asserts arithmetic only; no feature
acceptance or product effectiveness is inferred. One plan and two note edits are the full96-file
baseline delta, independently rechecked. Two original notes were reconstructed from fixture creation
text and matched to their initial hashes. No unrelated files, canonical decisions or handoff changed.

## Closure

The independent non-author review accepts this bounded implementation and local evidence. It does
not establish full runtime compliance, semantic freshness, usability, comparative effectiveness,
published distribution or authentic external approval. Parent owns final integration/commits and
records the actual remote outcome. Product decisions remain canonical, work evidence remains local,
and memory retains only scoped operational context/pointers.
