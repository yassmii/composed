# Adoption lifecycle independent review 02 — 2026-10-26

## 1. Object and sources reviewed

Bounded recheck of the two findings in review 01 against corrected uncommitted source based on HEAD `f272f6e860df1ee9b14c4390a2e626e9e636a276`. Re-read init.ts, flags.ts, repair.ts, shared managed-file path logic, and added adoption lifecycle regressions. No scope expansion into evidence commands or final integration checks.

Inspected and executed source SHA-256 values:

| Source | SHA-256 |
| --- | --- |
| build-kit/src/cli/init.ts | 63caf10375f760a2b3cfd082f24be19ff081e76ac390005ccf2d207e6578d980 |
| build-kit/src/cli/flags.ts | 386e42a452b24539f7ea405d912793c0d7b34129ff37597a0947d4d81a79ae8c |
| build-kit/src/cli/repair.ts | 551569c4710405f7f6e462a5a56a510ebc00c66b5ae822c7d78b68dc7cfa04ff |
| build-kit/src/cli/managed-files.ts | 35e2c57429cd081ac6075730cf05d8065271ef810f675208359d7036214bcd54 |
| build-kit/src/cli/diagnostics.ts | 412697eb9dbb4b2985f99f06118db301465d1546538d3b840f10fe0195925e5f |
| build-kit/tests/adoption-lifecycle.test.ts | 8cccbc327b10f569dab255f11c0b0e273a09440d913b09a8cbd4444328ffd477 |

Supplementary complete selected-source capture: `recheck-02-sources.json`. Prior review and its verdict remain unchanged. This is snapshot-bound, not final-head certification.

## 2. Review mode and independence

`native-subagent`, `/root/adoption_review`, distinct non-author. Read-only sources; all new reviewer artifacts in `/tmp/composed-adoption-review/`. Same Windows Node v24.13.1 / WSL configuration and limits as review 01. No source edits, subagents or publication.

## 3. Verdict

**Return needed**. Contradictory init flags are corrected, and the original case-sensitive CLI alias reproduction now refuses writes correctly. The new regression exposes a remaining alias/preflight failure on case-insensitive Windows temp storage.

## 4. Evidence supporting it

- Actual bin/composed-kit.mjs CLI rerun in fresh WSL `/tmp` projects (`recheck-02.mjs`, `recheck-02-results.json`): init succeeds; rename AGENTS.md to Agents.md; repair preview and apply both exit 1 with Case collision, generated AGENTS.md remains absent, complete tree hashes/directory entries remain unchanged.
- Actual CLI init with --force --keep-local exits 1 with Choose error; --keep-local alone exits 1 with explicit unsupported-option message. Both preserve the custom AGENTS.md and entire tree, including no backup or manifest creation.
- Targeted command `rtk npm run test --workspace=composed-build-kit -- --silent tests/adoption-lifecycle.test.ts tests/diagnostics-repair.test.ts tests/doctor.test.ts tests/flags.test.ts tests/update.test.ts tests/skill-migrations.test.ts` returns exit 1: **64 passed, 1 failed**, six suites. Complete output: `recheck-02-tests.log`.
- Failing test: `rejects a repair case alias before any missing-file write`, adoption-lifecycle.test.ts:71-83. Actual temp root was Windows `<home>\AppData\Local\Temp\composed-adoption-*`. Preview resolves with managed.unsafe:AGENTS.md plus a create-missing action for skills/catalog.json, rather than rejecting as asserted.

## 5. Prioritised gaps

### P2 — Repair still permits missing-file writes when another managed path has a known alias

Sources: repair.ts:24-25 and 41-49; diagnostics.ts:164-196 and checkFile logic.

On case-insensitive Windows storage, renaming AGENTS.md to Agents.md leaves existsSync(AGENTS.md) true. Diagnostics correctly emits managed.unsafe for the alias, but does not put AGENTS.md into missingFiles. The shared safeProjectPath correction validates only missingFiles, so a separate missing catalog passes repair preflight. Preview reports restoration is eligible; apply can restore the catalog before returning unhealthy. The newly added test intentionally deletes that catalog to assert the complete operation is refused, and currently fails in preview. This is a remaining part of the original preflight finding, not a new unrelated scope item.

Owner: implementation parent. Validate known unsafe managed destinations before any missing-file write, or otherwise prevent mutation when these unsafe managed-path findings remain. Keep the regression meaningful on both case-sensitive and case-insensitive filesystems.

## 6. Exit condition and limits

Correct the remaining unsafe-managed-path preflight gap; rerun this six-suite selection and fresh CLI reproductions on identified hashes, then issue a new review. Review 01 remains the wider adoption inspection; its platform, I/O and integration limits carry forward. No hosted CI, macOS, Node 20 or final integrated revision is certified here.
