# Validation — Build Kit multi-agent default

Date: 2026-10-20. Candidate: local working tree, not committed or published.
Scope: generic Build Kit 0.5.0, catalog 2.3.0, behaviour scenarios 2.2.0.

The following records the initial implementation checks; see the commit-preparation
entry below for the subsequent committed state.

From `build-kit/`, commands were invoked through `rtk proxy`:

- Windows Node 24.13.1: `node.exe node_modules/vitest/vitest.mjs run` —
  15 files, 72 tests passed. Covers bilingual installation/update, bridge policy,
  filtered catalog preservation, Cline mirror, memory and existing work evidence.
- Linux Node 24.15.0: `node node_modules/typescript/bin/tsc --noEmit` — exit 0.
- `node evals/validate-catalog.mjs` — 13 skills, 25 scenarios, exit 0.
- `node evals/run.mjs --adapter fixture --output evals/runs/fixture` —
  25/25 passed. Harness plumbing only; not an actual model/delegation evaluation.
- Biome from `build-kit/`: changed code/config except doctor.test.ts —
  six files checked, exit 0. Formatter fixes applied to changed files only.
- Doctor test lint retains a pre-existing `noDelete` finding in its existing
  HOME cleanup; not changed to the suggested undefined assignment, which would
  change environment semantics. No claim of a fully clean repository lint.
- `git diff --check -- build-kit .agents/work/build-kit-multi-agent-default` —
  exit 0.
- package-lock byte comparison against the pre-task dirty contents — identical
  except the workspace version 0.4.0 → 0.5.0. CRLF and unrelated edits preserved.

The installed dependencies contain Windows-native esbuild/Rollup; Vitest ran
with the existing Windows Node rather than changing dependencies or lock data.

Independent review: [accepted](reviews/2026-10-20-native-policy-review.md).
Real delegation record: [agents.md](agents.md).

Limits: tests verify policy distribution and instruction consistency, not
automatic enforcement by every runtime. No consumer app implemented in this task.
Product contracts and composed-validation were not changed. The project prompt
still pins the older immutable Build Kit revision; that reference does not
automatically adopt these uncommitted changes.

## Commit preparation — 2026-10-21

Implementation commit: `61dbd0b`. This pass packages the existing reviewed work;
it does not claim a new independent review or runtime delegation.

Checks rerun from `build-kit/` with the existing Windows Node 24.13.1:

- `node_modules/vitest/vitest.mjs run` — 15 files, 72 tests passed.
- `node_modules/typescript/bin/tsc --noEmit` — exit 0.
- `evals/validate-catalog.mjs` — 13 skills, 25 scenarios, exit 0.
- `evals/run.mjs --adapter fixture --output <temporary-directory>` — 25/25 passed;
  generated output stays outside the repository. This validates harness plumbing,
  not actual model or delegation behaviour.
- Biome checks on the seven changed code/configuration files found only the
  existing `noDelete` error in `tests/doctor.test.ts`. The same expression is
  present in the parent commit. Checks on the other six files passed; no claim
  of clean repository-wide lint.
- `git diff --cached --check` before the implementation commit — exit 0.
- Lockfile parsed data compared with the parent commit — only the Build Kit
  workspace version differs (0.4.0 → 0.5.0). Restored LF endings remove CRLF-only
  diff noise; no dependencies were changed or installed.

The status audit immediately preceding commit preparation also passed root
`npm run check` (TypeScript, all seven contract schemas and traceability).
Product contracts were not changed. No push, tag or publication was performed.
