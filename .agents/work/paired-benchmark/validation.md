# Validation — paired benchmark

Final integration checks on 2026-10-29, Windows Node 24.13.1 through WSL:

| Check | Actual result |
| --- | --- |
| `npm run validate:lockfile` | Passed; 86 platform-specific optional dependencies resolve |
| `npm run typecheck:build-kit` | Passed |
| `npm run lint:build-kit` | Passed; 65 source/config files |
| `npm run test --workspace=composed-build-kit -- --silent` | 140 passed, one POSIX-only skip; 21 suites |
| `npm run eval:build-kit` | Catalog 19 skills/49 scenarios; fixture 49/49 (plumbing only) |
| `npm run eval:evidence --workspace=composed-build-kit` | Seven actual command/acceptance/staleness controls passed |
| `npm run benchmark:calibrate --workspace=composed-build-kit` | Nine seed/reference/mutant controls passed |
| `npm pack --workspace=composed-build-kit --dry-run --json` | 131 files; 11 benchmark implementation/docs files; zero benchmark raw-run files |

Current [test log](evidence/final-windows-tests.txt) and
[calibration output](evidence/final-calibration.txt) are retained. The earlier native Linux Node
20.20.2 full suite passed 141/141 before measurement; its temporary raw log is no longer available
after the environment restart. Native POSIX cleanup/streaming/recovery controls were additionally
examined by the independent preflight reviewer; named reviews are retained. No macOS or hosted CI
result is inferred.

Final lint initially found the ignored local run's frozen JSON. Added `benchmarks/runs/**` to Biome's
generated-output exclusions, matching the existing eval-run exclusion and Git/npm ignores; source
checks remain enabled. No frozen measured file or grader was reformatted. The package check confirms
raw run exclusion. Dependencies, root lockfile and component version remain unchanged.

Actual model pilot: [analysis](results.md), [original frozen protocol](evidence/pilot-001/protocol.json),
[selected evidence manifest](evidence/pilot-001/archive-manifest.json). All 12 attempts are preserved;
three passed, four timed out and five hit account limits. The runner exited 1 for non-passing outcomes
as specified. Semantic assertions are distinct from session completion. No result was replaced with
a fixture success and no extra measured calls were added. Readiness is one separate unscored call.

Independent implementation reviews 01/02/03 and methodology review/recheck are immutable under
`reviews/`. The post-run reviewer examines actual evidence, archive identities and the inconclusive
interpretation. This validates the bounded pilot implementation, not a general effectiveness claim.
