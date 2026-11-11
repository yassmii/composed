# Validation

Affected delivery artifacts: bilingual skills, routing catalog 3.0.0, generated doctrine and skill indices, installation/update and Cline migration, behavioural scenarios, contribution/install documentation and Unreleased component notes. Contracts and package release versions are unchanged.

## Final component checks

Run from build-kit after the final migration fix:
- npm run test -- --silent --reporter=dot: 18 files, 97 tests passed.
- npm run typecheck: passed.
- npm run lint: 44 files, passed. Generated evals/runs outputs are excluded so fixture execution cannot make lint fail. Existing test teardown deletions retain their semantics through Reflect.deleteProperty.
- npm run validate:agentic: 19 skills and 49 scenarios passed structural validation.
- npm run eval:fixture: 49/49 passed. This proves runner/grader plumbing, not agent compliance.
- skill-creator quick_validate.validate_skill, with each selected language materialised as SKILL.md in /tmp: all 38 distributed entrypoints passed.
- Ten relocated legacy reference files match HEAD byte-for-byte.
- Final independent replay source hashes match the current migration, update, migration tests and CLI files.

## Independent evidence

See agents.md and the three immutable reviews under reviews/. The independent reviewer exercised real CLI installs and updates in temporary projects, both languages, selected Codex/Cline bridges, all six legacy identifiers, repeated updates, custom files/resources, keep-local, dry-run and CRLF. It exposed Windows Node/WSL UNC lstat behaviour for Linux directory/file links. Final replay confirms both links/targets are preserved, warnings emitted, unrelated CRLF migration continues and update exits 0.

The original CLI review retains the intermediate finding; reviews/2026-10-26-independent-migration-final.md is the corrective verdict for that exact probe. Source paths and relative raw-log references inside archived reviewer reports describe their original /tmp locations. The portable subset (outcomes, manifests, structured results and final CLI logs with terminal blank lines normalised for Git) is mirrored under evidence/.

## Limits

The three skill exercises cover those realistic requests, not every skill or both languages behaviourally. Migration plans were not run against a real database. No production action, publication, live security audit, market data collection or external agent runtime was performed. The real CLI reviewer used Windows Node 24.13.1 with WSL UNC temporary projects; Linux-native Node, Windows reparse points, EACCES/EPERM and interactive confirmations were not independently exercised. Structural/fixture checks are distinguished from these actual outcomes.
