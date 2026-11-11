# Validation

Build Kit only, 2026-10-29. Existing dependencies/stack reused; no contract, package version, immutable
tag, benchmark result or host-project dependency changed. No paid CLI/model benchmark calls.

| Check | Observed result |
| --- | --- |
| Native Linux Node 24.15.0 full suite | 154/154, 22 suites; [log](linux-tests.txt) |
| Windows Node 24.13.1 full suite | 152 passed, two POSIX skips /154, 22 suites; [log](windows-tests.txt) |
| Typecheck / Biome | Passed; 67 source/config files |
| Catalog / phrase fixture | 19 skills, 53 scenarios; 53/53 fixture (plumbing only) |
| Lockfile guard | 86 optional package records resolve; lockfile unchanged |
| Package dry run | 133 files, preflight and delivery examples included, no raw eval/benchmark runs; [record](package-check.json) |
| Skill metadata | Eight final bilingual sources validate through temporary SKILL.md copies; [hashes/output](skill-validation.json) |

The first full runs each failed one existing documentation assertion because the operating-model
ownership sentence had been paraphrased. Restored the original canonical-product-document wording
without weakening that invariant; [Linux initial](linux-initial-tests.txt) and
[Windows initial](windows-initial-tests.txt) logs are preserved. Final runs passed. Subsequent changes
only clarify the bilingual fallback probe's write/read-byte verification; independently reviewed at
the final hashes, without changing executable source or test logic.

## Actual runtime probes

Terminal logs are display copies with trailing blank/whitespace normalised; hashed reviewed sources
and archived exercise inputs/outputs retain their exact bytes.

[Passing](probe-passed.json) and [blocked](probe-blocked.json) CLI observations execute through the
current agent exec tool with the byte-matched integrated native Linux mirror. Existing bytes remain
unchanged and the passing case leaves no residual directories. Tests include a real permission denial
under an unprivileged POSIX identity; Windows skips that test plus the existing POSIX process-group
test. Unknown session delegation, review independence and quota never become a readiness success.
The current unrestricted process does not attest another agent sandbox, existing-file editability,
future permissions or hostile filesystem races. No macOS or hosted CI outcome is inferred.

## Independent exercise

[Raw exercise](forward/exercise.md), [inventory](forward/inventory.json) and
[selected-input archive](forward/archive-manifest.json) preserve four synthetic requests. A answers
the documented command with no changes. B adds regression assertions, observes one fail before the
helper fix, then four passing tests; no work folder/orchestrator/secondary test skill/reviewer was
introduced. C assesses a proposed membership-check bypass without implementing it. D produces only
the requested startup analysis for complex invitations, preserving open decisions and future gates;
no implementation/delegation was permitted or claimed in that case.

Agent hash comparison covers 118 baseline files: only B's helper/test changed, all installed inputs
unchanged. Git fixture files were untracked, so the agent correctly used initial hashes and actual
content comparison rather than relying on an empty Git diff. Parent independently verified seven
string assertions against the delivered helper (empty, whitespace, tabs/newlines, nonbreaking space,
ordinary and padded nonblank strings). The changed source/test are archived as actual bytes.

Exercise inputs precede the final portability/write-byte clarification; the archive labels this
scope explicitly. It is a bounded independent forward exercise, not a general adherence, efficiency,
complex-delivery or model-comparison proof. Sensitive/complex cases were read-only by request.

## Independent review

[Accepted implementation review](reviews/2026-10-29-native-subagent-proportionate-runtime-review-01.md)
is by a fresh native non-author context, with exact [29-source manifest](review-evidence/final-source-sha256.json).
Reviewer independently passed 18 tests plus four extra ownership/CLI cases: replacement files/new-owner
directory content survive cleanup, later valid probes still execute after a blocked path, and invalid
later syntax prevents all probes. Its [probe evidence](review-evidence/independent-probes.json) and
focused log are retained. The parent separately owns the completed forward exercise and closure;
the immutable review does not falsely claim it observed an exercise still pending when sealed.
