# Cross-platform CI repair — 2026-10-28

Base: `e6094579cf963829918c8caedc47875619de977f` / `build-kit-v0.7.0`. The user supplied failing hosted Linux and Windows lint logs, then the full archive at `<home>\Documents\documents-yl\logs_110336051805`. Aggregate input log hashes and validated source hashes are in [summary.json](evidence/summary.json). The original logs were read without modification and are not copied into the repository.

## Causes and corrections

Linux: the lockfile declared optional dependencies but lacked records for non-Windows native packages. A clean install using native Linux Node 20.20.2 reproduced the exact `Cannot find module '@biomejs/cli-linux-x64/biome'` failure. The repair adds 79 optional-package records for the already locked Biome, Rollup and both esbuild versions, plus their optional fsevents/lzma packages. All 98 original records remain structurally identical; existing package versions, integrity values, placements and dependency declarations are preserved. Metadata came from a clean npm-generated reference with native-parent versions pinned temporarily outside the repository; unrelated upgrades from that reference were discarded. User node_modules were not removed or rebuilt.

The dependency-free `validate:lockfile` command runs before `npm ci` in both CI jobs. It checks optional-package resolution through ancestor node_modules directories and exact pinned versions. It rejects the original incomplete lockfile. A second negative control removes only Vite's nested Linux esbuild binary and verifies that resolving the wrong higher-level 0.28.2 binary cannot satisfy the required 0.21.5 entry; [diagnostic](evidence/nested-guard.txt). The repaired lock passes all 86 declared optional-dependency edges. This is a metadata check, not runtime certification of every architecture.

Windows: an isolated NTFS checkout with `core.autocrlf=true` reproduced all 55 Biome CRLF formatting errors using Windows Node. Root `.gitattributes` specifies `text=auto eol=lf`. A fresh checkout with that attribute tracked in its scratch index preserves LF despite `core.autocrlf=true`; no formatter rules are relaxed. Existing source files and immutable release tags are not rewritten.

## Observed validation

| Check | Result |
| --- | --- |
| Clean native Linux `npm ci` | Pass; repaired lock bytes unchanged |
| Linux `npm run validate:lockfile` | Pass: 86 edges |
| Linux `npm run lint:build-kit` | Pass: 55 files |
| Linux `npm run typecheck:build-kit` | Pass |
| Linux Build Kit tests | 124 tests / 20 suites pass |
| Linux `npm run eval:build-kit` | Catalog valid; fixture adapter 49/49 |
| Linux `npm run eval:evidence --workspace=composed-build-kit` | 7 executable acceptance controls pass |
| Linux `npm run validate:contracts` | 11 schemas / 10 traceability sets pass |
| Clean Windows `npm ci` | Pass; repaired lock bytes unchanged |
| Windows `npm run lint:build-kit` | Pass: 55 files after the LF checkout correction |
| Windows `npm run validate:lockfile` | Pass: 86 edges |
| Guard with original lock / missing nested binary | Both correctly fail with exit 1 |
| Syntax and whitespace | Native Node 20 script syntax and Git diff checks pass |

Linux runtime: official Node v20.20.2 linux-x64 distribution downloaded into a task-owned temporary directory and checked against its official SHASUMS256.txt; bundled npm used with native Node on PATH. Windows runtime: Node v24.13.1 win32 x64 through WSL, scratch project on NTFS. Isolated projects have their own clean dependency installations. Scratch Git operations never altered the working repository index. [Evidence logs](evidence/) normalise terminal ANSI escapes, trailing whitespace and final blank lines.

## Delivery and limits

This is a bounded configuration/dependency-lock repair, handled directly without a new independent-review claim. The existing tag `build-kit-v0.7.0` stays immutable; corrections are separate follow-up commits on main, pushed together to trigger one new workflow. No package version bump, tag replacement or npm publication is included.

The local checks do not establish a passing hosted rerun, native macOS qualification or a complete Node 20/24 OS matrix. Inspect the new GitHub Actions run after the push. The earlier review reports and source hashes under adoption-and-evidence remain historical snapshot evidence and are not edited to imply review of this correction.
