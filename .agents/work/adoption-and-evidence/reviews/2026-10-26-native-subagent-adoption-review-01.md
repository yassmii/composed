# Adoption lifecycle independent review 01 — 2026-10-26

## 1. Object and sources reviewed

Uncommitted Build Kit 0.7.0 adoption changes in `<repo>`, based on HEAD `f272f6e860df1ee9b14c4390a2e626e9e636a276`: managed-file planning, init/update/uninstall, diagnostics/repair/flags, migration integration, adoption lifecycle tests, adoption/compatibility documentation, root CI and license-file presence/scope. Read root AGENTS.md, <home>/.codex/RTK.md, skill catalog, delivery-review skill, and `.agents/work/adoption-and-evidence/plan.md` / handoff.md. No product contract requirements were inferred or changed.

Initial behaviour-defining SHA-256 snapshots:

| Source | SHA-256 |
| --- | --- |
| managed-files.ts | 35e2c57429cd081ac6075730cf05d8065271ef810f675208359d7036214bcd54 |
| installation-plan.ts | 41ea899dbe63a7dea0f154f1d47d51ca44cb570869acc58dbee56f3d36e09bf7 |
| init.ts | 6d4aa5a20d85b0fcc9cca985754ef96d4d63cfb0daa971d33f465ccf6b434acb |
| update.ts | 65e8b8acfb741896718e876594bf69e99bf237e39cb8fc3184efa09b665566be |
| uninstall.ts | 415f76aed3edce43bdc448caceed2f59c82667bff7746a7e74246dec08f4c0f6 |
| repair.ts | 23ba759b72b79550ef54c11a1aa407144ccd7a32bf7ba6734f56db0bbc956544 |
| diagnostics.ts | 412697eb9dbb4b2985f99f06118db301465d1546538d3b840f10fe0195925e5f |
| flags.ts | 1007dc20c9184f784657f11aab4c547e3b8ef3d21a3eef44b2679ad1377cbe27 |
| adoption-lifecycle.test.ts | 7112a56ea6e008080e132c4c35c119a581b88caa7a7557e0b905c78121045109 |
| docs/adoption.md | 6d09547b9de98a3a73e92a7af5d9645b22d8f09edf238987ab53da9adae0be7d |
| docs/compatibility.md | 0fe2968b6a2697122a89bfbfc05119d37c952cb5174c0199db0f1dc5f59a0541 |
| .github/workflows/validate.yml | f7406e184c6ef0181482535a402c95ad07834d220d239bfd2a2e0f3a0c7a0631 |

Paths without a prefix in the table are under `build-kit/src/cli/`, except the explicit test path under `build-kit/tests/`. The checkout remained live while its author integrated changes. A supplementary capture is `reviewed-sources-current.json`; it records later changes, including repair.ts, and is not a substitute for the initial defect snapshots. This review does not certify a final HEAD.

## 2. Review mode and independence

`native-subagent`. Reviewer `/root/adoption_review` is a distinct non-author from the parent orchestrator and implementation authors. Source access was read-only. No subagents, source edits, consuming-repository writes, publication or commits occurred. All reviewer probes and outputs are under `/tmp/composed-adoption-review/`; the parent explicitly requested that it archive this review at the canonical `.agents/work/adoption-and-evidence/reviews/` path.

Windows Node v24.13.1 ran real CLI commands against disposable WSL UNC `/tmp` projects, using codex/Cline configuration to avoid user-home mirror mutation. This is one Windows-through-WSL configuration, not Linux Node, macOS, Node 20 or hosted CI qualification.

## 3. Verdict

**Return needed** for the initial reviewed snapshots. Two bounded correctness/safety gaps require correction and fresh regression evidence. The author was notified as each was reproduced; a repair source change has since appeared but this review records the initial result and requires a separate recheck.

## 4. Evidence supporting it

- Targeted automated checks: `rtk npm run test --workspace=composed-build-kit -- --silent tests/adoption-lifecycle.test.ts tests/update.test.ts tests/diagnostics.test.ts tests/skill-migrations.test.ts` passed 35 tests across the three actual matching suites. `tests/diagnostics.test.ts` does not exist and contributed no coverage. The correct follow-up command selected `tests/diagnostics-repair.test.ts tests/doctor.test.ts tests/flags.test.ts` and passed 28 tests (three suites); saved output: `diagnostics-tests.log`.
- Actual CLI probe `probe.mjs`, full output `results.json`: manual conflicting AGENTS.md refused ordinary init; forced init made an exact binary backup; two keep-local updates preserved a customized bridge; uninstall preserved that customization and memory; repeated uninstall succeeded empty. A legacy installation without a manifest adopted conservatively with keep-local and refused removal while tracking metadata remained unowned. These behaviours agree with the documented ownership policy.
- The same real CLI probe demonstrates the repair alias defect below; `flags-probe.mjs` / `flags-result.json` demonstrate contradictory init flags below.
- Fault injection against actual managed-file functions, without source mutation: `partial-io.mjs` / `partial-io-result.json` inject rename EIO on the second conflicting replacement. Both exact-byte backups existed before the first rename, the first replacement remained, the second original and previous manifest remained, and a forced retry succeeded. This supports the documented non-transactional failure limit; it does not prove every OS I/O failure mode.
- Source checks support allowlisted managed paths, SHA-256 baselines, preflight of init/update writes, conservative treatment of modified/unowned output, exclusive backups, preserved memory/work/resources and safe regular-file-only uninstall.
- Root CI defines six OS/Node combinations and read-only repository permissions; compatibility.md correctly distinguishes configuration from passing hosted results. A referenced `eval:evidence` script was still being integrated when first inspected, so final script availability is an orchestrator validation item, not a settled defect here. Root/Build Kit MIT files and contracts CC-BY-4.0 file are present with scoped README language. This was a consistency/presence inspection, not a legal opinion.

## 5. Prioritised gaps

### P2 — Repair writes into a known case collision before failing

Initial source: `build-kit/src/cli/repair.ts:19-37,53,58-75` at SHA-256 `23ba759b72b79550ef54c11a1aa407144ccd7a32bf7ba6734f56db0bbc956544`; related diagnostics.ts:164-196 and 203 onward.

Reproduction: install normally; rename AGENTS.md to Agents.md on the case-sensitive disposable WSL share; run doctor, repair preview and `repair --apply`. Doctor reports `managed.unsafe:AGENTS.md`. Repair nevertheless treats AGENTS.md as a missing eligible file, writes it, then manifest enrollment calls safeProjectPath and fails with `Case collision`. Both Agents.md and the newly written AGENTS.md remain (`results.json`, case repair aftermath). The custom alias is preserved, but a known invalid destination causes a partial mutation despite the intended preflight rule.

Cause: repair's private safeDestination checks links/traversal but omits safeProjectPath's case-alias check; manifest enrollment happens after file creation. Owner: implementation parent. Exit: use the shared destination validation before any repair writes, and test both preview/apply with full-tree no-write assertions for a case alias. The later source edit must be reviewed and rerun separately.

### P2 — Init ignores --keep-local when combined with --force

Initial source: `build-kit/src/cli/init.ts:38,42` and flags.ts (parseFlags returns both flags without rejecting the pair), SHA-256 values in the table.

Reproduction: fresh project with custom AGENTS.md; run `init --yes --agents=codex --lang=en --force --keep-local`. CLI exits 0, creates a backup and replaces AGENTS.md (`flags-result.json`: originalRetained=false, backupExists=true). The update path rejects the same contradictory flags through applyFilePlan, but init hardcodes keepLocal=false and bypasses that check. This contradicts docs/adoption.md's explicit promise that mutually conflicting flags are rejected, and discards a user's explicit preserve request rather than exposing ambiguity.

Owner: implementation parent. Exit: reject the contradictory pair before prompts/project writes in every applicable command (or explicitly reject init --keep-local as unsupported), with a regression asserting the entire project remains unchanged. Existing backups reduce recovery cost but do not make ambiguous flags correct.

## 6. Exit condition and limits

Correct and independently recheck the two findings on identified new source hashes; include meaningful no-write regressions. Complete final integrated type/lint/test/evaluation/package checks after evidence/CLI/docs integration, then bind the handoff to their actual revision or hashes. Preserve this review as an initial-snapshot record rather than rewriting its verdict.

Not verified: hosted CI execution; native Linux/macOS Node and Node 20; actual agent runtime behaviour; every permission/filesystem failure; malicious concurrent path replacement; authenticated ownership or review identity; evidence-command correctness (reviewed by a separate delegate). The documented local baseline metadata is not treated as an authenticated security boundary. No release, publication or final-head certification is implied.
