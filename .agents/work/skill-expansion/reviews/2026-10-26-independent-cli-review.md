# Independent CLI migration forward-test

Verdict: ordinary exercised rename/update cases accepted. A first platform-specific directory-link failure was corrected by the parent and independently replayed successfully; a companion file-link case still fails on the separately captured current source. Details follow. No source edits were made. This reviews captured files, not a final commit or final head.

## Follow-up on the parent's directory-link correction

At the parent's request, replayed against the modified current skill-migrations.ts, capturing it under edge-current-source/ and hashes in edge-current-manifest.json. New init/update used another fresh project, edge-current/.

- Directory link only: update exits 0, warns « linked or unexpected path », retains the link and does not alter its target. Evidence: edge-current-directory-only.log and edge-current-directory-only-results.json. The requested directory-link fix is behaviourally confirmed for this UNC setup.
- Combined directory and SKILL.md file links: the directory link is safely skipped; an unrelated unchanged CRLF legacy entry migrates; update then exits 1 with EISDIR at `lstatSync(legacyFile).isFile()`, which remains outside the protected ancestor check. Evidence: edge-current-update.log and edge-current-results.json. The file link and its target remain unchanged.

The remaining file-link failure has the same narrowly established runtime scope: Windows Node over WSL UNC reading Linux-created symlinks. It does not demonstrate data loss. It demonstrates that the parent's ancestor-only exception handling does not cover every lstat used to classify an uninspectable legacy entry. The parent received this finding; no correction was made by this reviewer.

These follow-ups are distinct from the earlier hash and 34-check batch below; they do not retroactively certify all cases against the changed source.

## Actual executions

Executed the real `build-kit/bin/composed-kit.mjs`, rather than importing mocked update functions. Runtime: Windows Node 24.13.1 at `<home>/AppData/Roaming/fnm/node-versions/v24.13.1/installation/node.exe`. Fresh projects live under this /tmp directory and were passed as WSL UNC paths. Selected agents were `codex,cline`, with `core,support,extras`. Set TSX_DISABLE_CACHE=1 and redirected TEMP/TMP under this directory. No generated project files were written in the repository.

`probe.py` produced 13 successful CLI runs and 34 passing behavioural checks (`results.json`). `crlf-update.log` and `crlf-results.json` add a successful cross-language CRLF migration. The separate edge probe failed as described below.

Cases covered:

- Fresh FR and EN init yields the 19-skill catalog and Codex/Cline bridges.
- Legacy fixtures for technique, test-generator, refactor, retrofit and doc-generateur come from migrations/skills; sprint-cycle comes from its compatibility source. Both canonical and Cline legacy copies were installed, and replacement directories removed before update. Update reinstalls all replacements and removes all six recognised legacy copies in both locations.
- Repeated updates leave every project file byte-identical except the installation record's intentional timestamp refresh.
- Modified legacy canonical and Cline files survive byte-for-byte without --keep-local; a directory containing a supporting local resource is also retained. Warnings identify manual review and the newly routed skill. Repeating the update preserves these contents.
- --keep-local preserves distinct current canonical and Cline customisations byte-for-byte, retains legacy copies, and allows the generated doctrine to switch to English while retained skills remain French. This mixed-language/policy state is documented behaviour, not evidence of full reconciliation.
- --dry-run leaves all files unchanged, including the tracking record.
- An unchanged French CRLF legacy test-generator is recognised and retired during an English update.

## Concrete edge failure and scope

`edge-probe.py` creates a Linux directory symlink at `plain-en/skills/core/technique` pointing to a separate user-owned /tmp directory. Windows Node sees that path through `\\wsl.localhost\Ubuntu\tmp\...`. Update exits 1 with:

`EISDIR: illegal operation on a directory, lstat '...\skills\core\technique'`

The first failing operation is the ancestor lstat in captured skill-migrations.ts:57; errors other than ENOENT are rethrown at line 62. Update has already refreshed skills/catalog/work README before reaching migration, so the failure is not transactionally all-or-nothing. The directory link, file link and both target contents remained intact. After removing only those temporary links, the same update succeeds and retires the CRLF fixture.

This demonstrates an unsupported Windows-Node/WSL-UNC/Linux-symlink combination and a partial-update failure mode. It does not establish failure for normal Windows-native reparse points or Linux-native Node symlinks; those runtimes were not exercised. It also does not demonstrate symlink target deletion or data loss. Parent can treat this as a disclosed interoperability limitation or decide whether unsupported ancestor-stat errors should warn and preserve the legacy entry instead of aborting the update. No source fix is asserted as necessary from broader platform evidence.

## Routing and contribution review

Read current contribution guidance in docs/adding-a-skill.md and update guidance in docs/getting-started.md; there is no CONTRIBUTING-named file. Read the new engineering/specialist EN entrypoints, three bilingual pairs already independently exercised, the full catalog, generated doctrine and Cline bridge.

No material routing contradiction found: behaviour changes versus refactoring, failure diagnosis versus test creation, persisted schemas versus interface contracts, release execution versus readiness, technical documentation versus discovery/handoff, and public market research versus product prioritisation/contract research have explicit boundaries. Generated doctrine agrees on narrow recovery after failures, action-based risk, host-native checks, stack authority and actual delegation/review gates. No new skill claims to provide tools or authorise production merely by invocation.

One captured documentation discrepancy: getting-started.md still lists four support skills at line 71, while actual init/catalog has ten. The old migration paragraph mentions sprint-cycle only. Parent is editing docs; these observations apply only to the captured hash. They are not final-head findings.

## Evidence identity

All snapshot paths/hashes are in source-manifest.json, with captured contents under source-snapshot/. Key reviewed SHA-256 values:

- src/cli/skill-migrations.ts: `4b43faf89a7886fd007e6fdd161b1deb7ac17d9c62402f93131df7db3ba21cfd`
- src/cli/update.ts: `275a71449fbe17cebc120aa1bad2febade46ef795073a959a159adb1fb37acca`
- tests/skill-migrations.test.ts: `8eb05ffa4e7d399441f6cece943fb5a6e5043907ec6c632713eda2aef7f207fa`
- docs/adding-a-skill.md: `c87abe33fad0e9ee657b121cc75ea30f568f8da43926c4bc12f9a84fb845073e`
- docs/getting-started.md: `e4b42ccf6f41cf9d33a12a6f566f3af771e761b6775999cc2f0a44ef5727c2ad`

changed-since-snapshot.json records files differing when checked near closure; no final-head claim is made. Raw commands and exits are in results.json; CLI stdout/stderr is preserved in per-run logs. probe.py and edge-probe.py contain the setup and assertions. The actual temporary project trees are retained for inspection.

## Limits

No subagents, source fixes, production access, package installation or actual external agent runtime. All updates used --yes; interactive accept/cancel paths were not exercised. No induced replacement-write failure, process kill, read-only permission failure or adversarial filesystem race was tested. Linux-native Node was unavailable. The repository test file was read, not rerun; these CLI cases are independent bounded checks rather than the entire test suite. Source capture and execution occurred while the parent edited other files, so hashes define reviewed evidence and no final revision is certified. Native skill discovery, live agent compliance and all runtimes remain unverified.
