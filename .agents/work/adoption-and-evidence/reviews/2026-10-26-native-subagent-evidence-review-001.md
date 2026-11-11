# Independent review: first executable local evidence vertical

## 1. Object and sources reviewed

Reviewed the bounded local-command evidence vertical in the integrating working tree at `<repo>`: `src/cli/evidence.ts`, CLI registration/exit handling, evidence tests, acceptance example and its fixtures, and `docs/evidence.md`. Component is `build-kit/`; referenced contract clauses are draft REQ-ADH-016–020 / ACC-ADH-010–013, not a conformance certification. Root Git HEAD observed as `f272f6e860df1ee9b14c4390a2e626e9e636a276`; reviewed files include uncommitted changes and this is **not a final-head review**.

Canonical context read: `<home>/.codex/RTK.md`, root `AGENTS.md`, `contracts/AGENTS.md`, `build-kit/skills/catalog.json`, `build-kit/skills/support/delivery-review/SKILL.en.md`, `.agents/work/adoption-and-evidence/plan.md`, and the relevant draft harness clauses. Source byte snapshots and the complete manifest are in `reviewed-sources/` and `source-sha256.json` beside this report. Snapshot SHA-256 values:

| Source | SHA-256 |
| --- | --- |
| `AGENTS.md` | `a2809bfb7ccde96043a059584baf1ccc0e37a88913122965fb025899ab920113` |
| `build-kit/skills/catalog.json` | `6e82c7d569aadc56dceddb1363d94811dd4272ae80c893e324ce3876ba6c46a2` |
| `build-kit/skills/support/delivery-review/SKILL.en.md` | `015ad44b35aa3583b184b3f96e00a13ebb7da819fe14c0b13c1e8b3cc2fdf922` |
| `build-kit/src/cli/evidence.ts` | `3ded93bbddc91cf8c92c91b87d17be86d427c70bd372866c2282b2d49112c907` |
| `build-kit/src/cli/__main__.ts` | `3c03d30848a95e917038f2f4d2e89e7cb393ecd68e8367361a836ce613c3c744` |
| `build-kit/tests/evidence.test.ts` | `73231a07dbcbb6e10154cc68ed30ede44ef5ffa91f9554af3c95449f5d243710` |
| `build-kit/evals/evidence-example.mjs` | `8f2e855d4ea96d61f0184c37ac2b9830c3a54960a23dcace295130aa00c67ee6` |
| `build-kit/docs/evidence.md` | `3a0f6c1f492ca0ac17c2313fc8ec8efbec75cca3c30ae5ad3728dd1f6839c2af` |
| `build-kit/bin/composed-kit.mjs` | `7610cada1f3fb11119caee320fd14d7611f26eb88c550eeeb44e1261c1eef685` |
| `build-kit/examples/evidence/requirements.json` | `93bbcb4f9337280dcd0793bfea2ef0ccf0eec0c415384849b9190991b1ea2a13` |
| `build-kit/examples/evidence/acceptance.mjs` | `1e442033e2d58dfc50ca2e3b070b1b83c524a8983f7242f02ee498d575aebb8d` |
| `build-kit/examples/evidence/cancellation.correct.mjs` | `e1d46fa767484a176e12e4ee8c78f8c04f72088014a31e1b29bc038a150bfa5b` |
| `build-kit/examples/evidence/cancellation.wrong.mjs` | `12136417e5ec9552ab5ba8a7f2e98687d66bac71ad8a673aa79a614625888051` |
| `build-kit/package.json` | `5d0033f068f8583a959930413ba4e96461331e6df709d91af6daa6ab2349246f` |
| `.agents/work/adoption-and-evidence/plan.md` | `e474a39d3149d100a686c33dc2a1e21ee7483325909a4edad729012eb07cd4db` |
| `contracts/AGENTS.md` | `875d9bff0af5b03eb3ccbea99c0e467ba6d3c2f2c6a410f10eaa385f8acc1683` |
| `contracts/product-types/agentic-delivery-harness/contracts/contract.yaml` | `369bc8e5ab8fc68c9da1bcb44cb3c3277c15dff09f8deca35f79487f3b065ff1` |

## 2. Review mode and independence

Mode: `native-subagent`. Reviewer `/root/evidence_review` is a distinct non-author of the implementation authored by `/root/evidence_design`; the parent `/root` integrates changes. The reviewer made no source edits and spawned no agents. Author/parent corrected two findings during this review; the reviewer then reread and exercised corrected sources. Probe scripts, saved sources, command logs and this report were created only under this unique `/tmp` review directory. The existing test suite uses native temporary fixtures and removes them in its cleanup.

Runtime: Windows Node v24.13.1, `win32`, invoked through WSL using `node.exe`; actual CLI executable is `<repo>/build-kit/bin/composed-kit.mjs`. No production data, external service access or publication was involved.

## 3. Verdict

**Accepted** for the reviewed source hashes and the explicitly bounded unsigned local-command evidence vertical. No remaining material finding was established in this scope. This verdict does not certify full draft contract conformance, final integration state, authenticated independent review, human approval or product closure.

## 4. Evidence supporting it

- Subject identity: the receipt stores selected relative paths, byte lengths and SHA-256 values under a sorted subject-set digest. The command records explicit executable/argv, runtime and actual observed exit/outcome. Selected subject/checker changes invalidate applicability without rewriting the historical result. Git HEAD is contextual rather than a replacement for working-tree bytes.
- Outcome binding: actual CLI semantic assertions pass; success-looking stdout with exit 7 fails; missing executable, deadline, excessive output and a lasting selected-file change are blocked. CLI exits 1 for unhealthy reports and 0 for a healthy record. Existing receipt filenames are refused before the marker-writing command runs.
- Verification is read-only: changing receipt argv to a marker-writing command does not create the marker when verified. A deliberately rewritten unsigned receipt can remain healthy, consistent with the explicit forgery/provenance limitation.
- Review binding: a distinct declared identity/context with accepted verdict is current and explicitly `declared`. A whitespace-only change to receipt bytes makes the review stale while subject applicability stays current. Matching author identity or context is self-review. Return-needed/blocked review verdicts fail. Neither path claims closure.
- Semantic control: the executable example accepts the correct cancellation boundary, observes that the wrong module loads normally, and rejects it through actual acceptance assertions. All 7 example controls pass; `example/summary.json` contains the results.
- Limits are explicit: selected files only; undeclared dependencies and environment outside scope; unsigned identity and review declarations; no automatic human authority or closure; direct-child termination only; no sandbox; before/after snapshots do not monitor intermediate writes.

Commands exercised:

```text
From build-kit/: rtk npm test -- tests/evidence.test.ts
From build-kit/: rtk proxy node.exe evals/evidence-example.mjs --output \\wsl.localhost\Ubuntu\tmp\composed-independent-evidence-review-m9x6xrl4\example
rtk proxy node.exe \\wsl.localhost\Ubuntu\tmp\composed-independent-evidence-review-m9x6xrl4\probe.mjs
rtk proxy node.exe \\wsl.localhost\Ubuntu\tmp\composed-independent-evidence-review-m9x6xrl4\corrected-source-probes\probe.mjs
```

The corrected focused suite passes **12/12** (`focused-tests-rerun.log`). Each probe run performs **18 real CLI invocations** through the public binary, using disposable selected code/checker files and receipts. The full exact argv, process status/stdout/stderr and per-case reports are in `cli-log.json` and `corrected-source-probes/cli-log.json`; scripts and summaries are beside those logs. The corrected probe script passed against the hashes recorded above; the four changed scope files were hash-checked again after it finished.

## 5. Prioritised gaps

No open blocking gap remains. Findings returned and resolved during this review:

1. **Medium — broken test fixture lookup.** Initial evidence test hash `1bcfa5d1e7c596e5e32ae68548fe3661f27b1e7af82ef643bf669597ff0fbb50` failed 1/12: the invalid-timeout record incremented the output counter, the next successful run wrote `run-2.json`, and `rewriteReceipt` still read `run-1.json` (ENOENT). Parent/author changed the helper to accept the returned receipt path; corrected suite passes 12/12. Owner: implementation author/parent; resolved in recorded test hash.
2. **Medium — snapshot guarantee overstated.** Initial documentation hash `2ba481f5379a7539b2fb5389d3e3d9013971ab5269010149d7b02e6e323b1768` said any in-command change blocks. An actual CLI command changed the selected file and restored the original bytes before exit; its receipt remained healthy. The revised documentation explicitly limits detection to different endpoint snapshots and says intermediate reads/writes are not established. The behaviour is an accepted limit of this first vertical. Owner: implementation author/parent; resolved by recorded documentation hash.

## 6. Exit condition and unverified limits

The scoped exit condition is satisfied for the source hashes above: corrected tests pass, actual positive/negative CLI cases execute, semantic controls reject a plausible wrong implementation, and the public claims match observed scope. The parent owns subsequent integration checks and archiving this report without treating it as final-head approval.

Not verified: a native Linux/macOS runtime, adversarial filesystem race resistance, all Windows path edge cases, true executor/reviewer identity, signature/authentication infrastructure, transitive dependency completeness, descendant cleanup, every intermediate subject write, arbitrary product acceptance quality, or repository-wide packaging/lint/typecheck/release readiness. These are not inferred from this scoped acceptance. Review timestamp: 2026-10-26 22:25 UTC.
