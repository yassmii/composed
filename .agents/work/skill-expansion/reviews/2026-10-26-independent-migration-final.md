# Independent final combined-probe review

Verdict: accepted for the requested combined directory-link + SKILL.md-file-link + unchanged CRLF migration case. Both previously observed Windows Node/WSL UNC lstat failures are resolved in this exercised workflow.

Reviewer: independently delegated read-only agent `/root/skill_forward_test`, distinct from the source author. No source edits, subagents or further scope expansion. This is a new named review; earlier findings remain intact as historical evidence.

## Executed evidence

Used actual `build-kit/bin/composed-kit.mjs` with Windows Node 24.13.1. Created a fresh `/tmp/composed-update-review.cwLDzg/edge-final` project and ran init with `--yes --lang=en --agents=codex,cline --skills=core,support,extras`.

Then added three legacy fixtures together:

- `skills/core/technique` as a Linux-created directory symlink to a separate user-owned /tmp target containing the original engineering fixture.
- `skills/core/refactor/SKILL.md` as a Linux-created file symlink to a separate user-owned /tmp fixture.
- `skills/core/test-generator/SKILL.md` as an unchanged French legacy fixture with CRLF line endings.

Ran real update with `--yes`, accessing the temporary project through `\\wsl.localhost\Ubuntu\tmp\...`.

Observed exit 0 and nine passing checks: successful update; directory link retained; directory target byte-preserved; file link retained; file target byte-preserved; unrelated CRLF legacy directory retired; preservation warnings for both linked paths; replacement automated-testing canonical/Cline files byte-identical. The update completed and retained version 0.6.0.

Raw logs: `../edge-final-init.log` and `../edge-final-update.log`. Exact command, exits and assertions: `../edge-final-results.json`. Source copies: `../edge-final-source/`. Source manifest: `../edge-final-manifest.json`.

## Reviewed identity

- `build-kit/src/cli/skill-migrations.ts`: SHA-256 `c379db6564644773cf2c4904bf2e3921dfb7b9b6fae9522fb46e23466877d0fd`
- `build-kit/src/cli/update.ts`: SHA-256 `4ef44c226ec504f16f4013b2aea4450633a032962485d9cc315c11894b13018a`
- `build-kit/tests/skill-migrations.test.ts`: SHA-256 `2ba00a451fb55a8d6ec065e68a3382771f5ac0ea65c5d457e9652bc684a56900`
- `build-kit/bin/composed-kit.mjs`: SHA-256 `7610cada1f3fb11119caee320fd14d7611f26eb88c550eeeb44e1261c1eef685`

Read the current migration implementation, including isOrdinaryFile(). These four captured source hashes remained unchanged during the replay. This identifies the exercised source; it does not certify a later final head.

## Limits

One combined workflow in the observed Windows Node + WSL UNC setup. EACCES/EPERM were not independently induced; Linux-native Node and Windows-native reparse points were not exercised. No full-suite rerun, interactive confirmation path or external agent runtime. The original broader batch remains evidence for its earlier hashes, not newly rerun evidence for every current file. No remaining defect was observed in the requested replay.
