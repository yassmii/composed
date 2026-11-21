# Acceptance evidence for a delivery slice

Record the contract ID, version, revision and digest, the project revision under test, and the
included journey. List deferred capabilities and their consequences. Cite applicable invariants and
policies. Keep local product decisions separate.

| Acceptance ID | Scope | Verdict | Executed steps and evidence | Missing steps or next action |
| --- | --- | --- | --- | --- |
| Contract case ID | Included, partial or deferred | `pass`, `fail`, `blocked` or `not_run` | Command or scenario, environment, observed result and evidence link | Missing step, blocker or owner |

- `pass` requires the full expected result and evidence.
- `fail` records an observed contradiction, even if another step has not run.
- `blocked` means a missing prerequisite prevents completion of a case intended for the slice.
- `not_run` covers required steps left unexecuted without a contradiction or blocker. For a
  partially exercised case, record the observed subresults separately.

Count each acceptance ID once. Report quality checks separately and distinguish project evidence
from an external verifier's results.
