# Adoption lifecycle independent review 03 — 2026-10-26

## 1. Object and sources reviewed

Bounded correction recheck following reviews 01 and 02, against uncommitted adoption sources based on HEAD `f272f6e860df1ee9b14c4390a2e626e9e636a276`. Re-read init, flag parsing, shared destination validation, repair and diagnostics plus the two regression tests. The original wider adoption source inspection and failure-mode checks remain in review 01. No final-head or evidence-command certification is implied.

Hashes captured before execution and confirmed afterward:

| Source | SHA-256 |
| --- | --- |
| build-kit/src/cli/init.ts | 63caf10375f760a2b3cfd082f24be19ff081e76ac390005ccf2d207e6578d980 |
| build-kit/src/cli/flags.ts | 386e42a452b24539f7ea405d912793c0d7b34129ff37597a0947d4d81a79ae8c |
| build-kit/src/cli/repair.ts | 551569c4710405f7f6e462a5a56a510ebc00c66b5ae822c7d78b68dc7cfa04ff |
| build-kit/src/cli/managed-files.ts | 35e2c57429cd081ac6075730cf05d8065271ef810f675208359d7036214bcd54 |
| build-kit/src/cli/diagnostics.ts | 70866f7b85e0a1e301b1fe794f5a1cd4c3f23faa0e33c74f08a0a5ae5532059d |
| build-kit/tests/adoption-lifecycle.test.ts | 89715c401907781eac120648586ac6c61fd33cd5b77bd2b07af846dee79dd5f0 |

`recheck-03-sources.json` supplies hashes for the six tested suites and unchanged adoption integration sources. Prior reviews are retained without edits.

## 2. Review mode and independence

`native-subagent`. Reviewer `/root/adoption_review` is a distinct non-author from the implementation parent. Read-only source access; no subagents, source modifications, commits, publication or real consuming-repository writes. New probes and artifacts are under `/tmp/composed-adoption-review/`, with canonical archiving owned by the parent.

## 3. Verdict

**Accepted** for the reviewed adoption lifecycle and bounded corrections at the identified snapshots. Both original P2 findings and the Windows alias variant are resolved by observed behaviour. This does not replace final integrated validation or human approval.

## 4. Evidence supporting it

- Flags: parseFlags rejects --force combined with --keep-local before command mutation. Init explicitly rejects --keep-local alone instead of ignoring it.
- Repair: every missing destination uses shared safeProjectPath; diagnostics now disables all missing-file repair eligibility when any managed entry is unsafe. This covers case-insensitive Windows aliases even when existsSync resolves the requested spelling.
- Six-suite command `rtk npm run test --workspace=composed-build-kit -- --silent tests/adoption-lifecycle.test.ts tests/diagnostics-repair.test.ts tests/doctor.test.ts tests/flags.test.ts tests/update.test.ts tests/skill-migrations.test.ts` passed **65 tests in 6 suites** (exit 0), including both new regressions. Output: `recheck-03-tests.log`. The alias regression exercises Windows Node's native temp directory, with a separately missing catalog, and verifies preview/apply return unhealthy with applied=[] and a complete file snapshot unchanged.
- Actual CLI rerun through bin/composed-kit.mjs, Windows Node v24.13.1 on a fresh case-sensitive WSL UNC /tmp project: repair preview and apply both exit 1, report managed.unsafe with remaining.healthy=false and applied=[], leave the entire tree (files, hashes and directory entries) unchanged, and do not create AGENTS.md beside Agents.md. Returning a report rather than throwing is the author's deliberate CLI error semantics and preserves the required no-write behaviour.
- Actual CLI init with contradictory flags exits 1 with Choose error; init --keep-local alone exits 1 with an explicit unsupported-option message. Both preserve the custom AGENTS.md and full tree without backups or installation metadata. Harness/output: `recheck-03.mjs`, `recheck-03-results.json`.
- Review 01 separately records successful manual collision protection, exact binary forced backup, repeated keep-local updates, modified-file-preserving removal, conservative legacy adoption, repeated uninstall and controlled partial-I/O failure/retry. Relevant implementation hashes remain unchanged except the specifically corrected files above.

## 5. Prioritised gaps

No open findings within this bounded adoption recheck. Reviews 01 and 02 remain the historical records of defects before correction; this review closes their adoption findings for the hashes above.

## 6. Exit condition and limits

The scoped review exit is met. The orchestrator owns archiving/linking all three reviews, final integrated type/lint/test/evaluation/package checks after evidence/docs integration, and reporting their actual revision/hashes. This review does not assert those future checks have passed.

Not verified: hosted CI, native Linux/macOS Node, Node 20, actual agent runtime conformance, every filesystem failure, hostile concurrent mutations, authenticated lifecycle metadata, or the separate evidence feature. The independent tests demonstrate Windows Node on NTFS temp storage and a WSL UNC case-sensitive filesystem; they do not establish broad platform certification. No deployment or publication was attempted.
