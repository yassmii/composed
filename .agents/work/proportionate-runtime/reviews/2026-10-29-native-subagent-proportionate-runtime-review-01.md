# Proportionate delivery and local preflight: independent implementation review

Date: 2026-10-29. Reviewer: `/root/proportionate_runtime_review`.

## Object and sources

Reviewed the actual canonical Build Kit changes in `<repo>`, against `.agents/work/proportionate-runtime/plan.md`: CLI dispatch/preflight/diagnostics, focused tests, catalog 3.1.0, EN/FR AGENTS and Claude bridges, four bilingual skill families, runtime/operating-model/getting-started/diagnostics/proportionate-delivery documentation, eval scenarios/validator, README/work guidance and Unreleased changelog. Contracts, package version, immutable release tags and benchmark evidence were not changed by this lot.

Exact source SHA-256 values are reproduced below and in `final-source-sha256.json` (manifest SHA-256: 69bb9fb4c5dad879434de1f14d8b53fc464f0a28b321a2f0f4bfa0b3619bb11a). This review applies to these bytes; subsequent source changes require a new named review rather than replacing this verdict.

## Mode and independence

Mode: `native-subagent`. This reviewer is a separate native context and authored neither the parent policy changes nor the isolated-worktree CLI implementation. Canonical sources were read-only. All newly authored review material and extra scratch projects live under this review's `/tmp/composed-proportionate-review-*` directory. No source repair, commit, publication, subagent, model/API/benchmark invocation or live-installation mutation was performed. Parent/orchestrator owns integration and closure.

## Verdict

**Accepted** for the implementation scope and exact sources listed here. No material implementation gap remains in the examined scope. This is not proof of kit effectiveness or overall runtime readiness. The separate independent skill forward exercise and the parent's final evidence/handoff remain their own closure requirements.

## Evidence

- Inspected policy text and both languages directly. Execution shape is separate from actual action risk. Direct corrections require known bounded reversible local scope and exclude material security/authorisation, public-interface, persisted-data or stack changes, cross-agent/session handoff and explicitly requested durable planning/review. Progressive primary-skill loading does not remove non-trivial/risky implementation review, explicit review requests, native complex-work delegation, isolation or author/reviewer separation. Examples cover correction, feature and cross-disciplinary work.
- The installation does not promise a binary on PATH. Final bilingual instructions now permit the reviewed checkout CLI or an equivalent exclusive native path probe, require actual write/read byte verification and owned cleanup, and prohibit adding host-project dependencies or bypassing the sandbox for readiness. The initial fallback omission of explicit write-byte verification was identified during review and corrected by the parent before this verdict.
- Independently ran exact supplied native Linux Node v24.15.0 and focused Vitest tests against the integrated isolated mirror: **18/18 passed** across preflight and doctor. `focused-tests.log` preserves output. Changed CLI/test source hashes were independently compared with canonical sources and matched exactly. Existing tests include actual denied POSIX write execution, symlink/junction refusal, Windows-name syntax, bounds/argument prevalidation, content preservation, cleanup failure reporting, JSON and exit semantics.
- Added four independent deterministic scratch exercises, recorded in `independent-probes.mjs` and `independent-probes.json`: changed probe-file ownership preserves replacement and blocks; changed created-directory ownership preserves its new owner's content and blocks; one blocked selected path does not suppress a later actual successful probe; invalid later syntax prevents all writes and emits no success JSON. All four passed. Ownership injections call the real filesystem around a narrow deterministic operation interception; they are not OS-race coverage.
- Read final parent-produced full-suite logs: Linux **154/154 tests, 22 suites**; Windows **152 passed + 2 POSIX skips / 154 tests, 22 suites**. Copies are retained as `parent-linux-tests.txt` and `parent-windows-tests.txt`. These are inspected parent-produced evidence, not tests independently launched by this reviewer. Parent also reports passing typecheck/lint, catalog/fixture/lock/pack checks; this review does not relabel those statements as independently executed checks.
- Read actual parent-produced positive/blocked CLI report artifacts (`parent-probe-passed.json`, `parent-probe-blocked.json`): selected path status and scoped context are explicit; delegation, independence and quota remain unknown, and overall readiness is `not_assessed`. Independently inspected doctor/diagnostics code and its drift test: doctor remains a read-only installation/instruction inspection, and new catalog drift detection reports without rewriting installed policy.
- Reviewed path handling and ownership/cleanup implementation: explicit bounded project-relative syntax; no traversal/backslash/drive/ADS/metadata/reserved Windows names; root canonicalisation with linked-root refusal; directory link/type/case checks; exclusive random file creation; byte comparison; identity checks before unlink/rmdir; empty-directory removal only; failures retain residual paths and block. There is no automatic permission change, relocation or dependency installation.

## Prioritised gaps and limits

No blocking defect found. The following limits are explicit and acceptable for this scope:

- Directory capability does not prove editability of an existing file or all later operations; native delegation, reviewer independence, quota, another sandbox or a future context are not established by CLI success.
- This reviewer independently exercised Linux only. Windows evidence is the inspected parent full-suite result plus code review of portable syntax and junction handling. POSIX permission semantics are intentionally skipped on Windows.
- Identity/path checks are conventional filesystem protection, not an adversarial race-proof sandbox, process-interruption transaction, proof against every exotic filesystem/Windows reparse mechanism, or exhaustive concurrency stress test. Deterministic replacement tests establish preservation for the examined ownership changes.
- The bilingual instruction review and deterministic scenarios do not establish paid-model behavioural adherence or comparative delivery effectiveness. No benchmark/model campaign was run. `parent-skill-validation.json` is structural metadata evidence and may predate the final engineering wording; it is not behavioural proof and is not the basis of acceptance.
- The separate independent forward exercise was still in progress when this review was sealed. It is owned by the parent and exercise agent and must be linked before overall lot closure; any material finding or changed implementation needs correction and a new review.

## Exit condition and next owner

Parent `/root` links this immutable review and its exact source manifest from the canonical work evidence/handoff, completes the separate forward exercise and records final validation/limitations. Preserve initial failing logs and all named reviews. If the forward exercise exposes a material defect, or source bytes change, return the bounded correction to its owner and request a new named non-author review. Acceptance here does not authorise package publication or modify the existing user authority.

## Exact reviewed source hashes

| Source | SHA-256 |
| --- | --- |
| `build-kit/CHANGELOG.md` | `b7d9a6d75bca7d0d6d2f489fbf2a53de0b95de13a6fb15c1496106f796963410` |
| `build-kit/README.md` | `bffb0786524533bab05f5cc1a601dec34225757daa2b44a8b283988c99372a94` |
| `build-kit/bridges/AGENTS.md.en.tpl` | `ac3aeaafb06437028d4a2c1a1570f753ec94617deaf40762fbd43c25fdd7bd0c` |
| `build-kit/bridges/AGENTS.md.fr.tpl` | `5c71d599e3eb0a94c5b052c9d93b56a082dc078e5254d9c65fa9fec434048e45` |
| `build-kit/bridges/CLAUDE.md.en.tpl` | `be38d6793d44c76e67acf31b22ee1b543dc30f9266e3622896cb1e05f9cffd2b` |
| `build-kit/bridges/CLAUDE.md.fr.tpl` | `9dd6119e28af692669bb19df7a85c4ac2ebf9bda3dc0078fb3c30f01cd2439eb` |
| `build-kit/docs/agentic-operating-model.md` | `d059e673b69414873c19c3034e74eed7339d238b3ccbc50efa4fab5fe6e4a913` |
| `build-kit/docs/diagnostics.md` | `b2c871b0782bdf0166a08f610f5521ef70de23512f34a73b1c60bf493811e192` |
| `build-kit/docs/getting-started.md` | `c0abc0b1a01b46f2f8eb1a36e996a0b82ca90bf56bc1edfda267280c7ec0160b` |
| `build-kit/docs/proportionate-delivery.md` | `2c1612a0b20a81dc76aaa7c8dd349f8c9a8a106761e37a660ad90b770050783f` |
| `build-kit/docs/runtime-capabilities.md` | `3a074ec24c7a3e8ae70843530a8593d328d22f21c3704bdbff6cedbe37ff85ec` |
| `build-kit/evals/README.md` | `6ab7f01e1af6e3a326df4b258795fb1e8b52e1be2820d008311afda07f6be280` |
| `build-kit/evals/scenarios.json` | `bee7bb77fe943da2b52690f9d1fb815a32f4fddb1091043dc696892000ae28a5` |
| `build-kit/evals/validate-catalog.mjs` | `03e2a9abdf2e8581d7751d953721a9aa24bd811f399bcf8f60fadc2136ce1750` |
| `build-kit/skills/catalog.json` | `1ded3b536e36fa03c784f41260b59e6c016222159950c7ba98808410a33fdbb0` |
| `build-kit/skills/core/automated-testing/SKILL.en.md` | `d20b131f3c788778414b198464f67fcb4b0b26537d91cf6470b7b46cf0af923b` |
| `build-kit/skills/core/automated-testing/SKILL.fr.md` | `6e6dd28f25541908eac25f6eb4493970927f820e61b731afaa1b2c9bcc8b0ed7` |
| `build-kit/skills/core/delivery-orchestrator/SKILL.en.md` | `6e82b59c53ea2b56dc55ed94d4984f7577f29352ceb69a12a1cc2ff7aba96aa5` |
| `build-kit/skills/core/delivery-orchestrator/SKILL.fr.md` | `1ffbd504146a182520dc9b5cd5e9633f6e9ea54d5ef137ba51d839ccc72cc9c0` |
| `build-kit/skills/core/software-engineering/SKILL.en.md` | `8153daf544a2d6c2b6a41505a683f039d05e0e0ea5e403b8977d8fb2936d6acb` |
| `build-kit/skills/core/software-engineering/SKILL.fr.md` | `4b6a42d9c8a2932aafc830ab4894a459b54d9c576a54496762d5cee240c44404` |
| `build-kit/skills/support/delivery-review/SKILL.en.md` | `0df9256ab41233d588750256c59774a4b282336bfac4afad0a6b127fb98d855b` |
| `build-kit/skills/support/delivery-review/SKILL.fr.md` | `d926572352047303f4db224c01741bfd447c51859d507896690af4d4a413c2a3` |
| `build-kit/src/cli/__main__.ts` | `a7698d7cb4ac81285703beff0e83aafca077f9ac66f60b901406478740f25330` |
| `build-kit/src/cli/diagnostics.ts` | `c3a23856b2b52ea9ecbc28863d171a58a95aa4bdd24368bfbee64b4e03a211ce` |
| `build-kit/src/cli/preflight.ts` | `49060291a1bd77f4fa17051d9780e022bc5ddd33836f3ca4a14781daa0d11e86` |
| `build-kit/tests/doctor.test.ts` | `0e66aa747c63816c7a27e5d298c76929043ed7b1bc3feb66dcec02c2f3fc0242` |
| `build-kit/tests/preflight.test.ts` | `f49df3f66c63aa097b368dbfad7795633aa863349bd0185196c2000466234e89` |
| `build-kit/work/README.md` | `b67d41b4c3e5fb5881e08495327fe79442c6a036090d150e5d603122262ad63d` |
