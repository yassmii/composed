---
name: automated-testing
description: >
  Add or improve behavioural automated tests and test infrastructure. USE THIS SKILL for unit,
  integration, contract or E2E coverage and flaky tests; use qa for a manual acceptance plan and
  release-engineering for deployment pipelines beyond running tests.
license: MIT
metadata:
  author: composed-build-kit
  version: "2.2.0"
---

> **Use this skill** to create executable evidence of behaviour and prevent relevant regressions.
> **Use systematic-debugging** when the cause of a failure is still unknown.

# Automated testing

Load this skill when test design or infrastructure needs its own expertise. Running existing native
checks or adding an ordinary focused regression within a direct correction does not automatically
require a second skill or workstream. Direct corrections may report checks inline; preserve durable
evidence and review where the catalog's selected delivery mode requires them.

## Choose evidence from risk

Read the host README, native manifests, existing tests and acceptance criteria. Map each material
rule, boundary or reported defect to an observable assertion. If a Composed Contract applies, retain
the requirement.id or acceptance.id in the test or evidence map. Do not invent a coverage percentage
or promise complete confidence. A reversible wording-only change may need inspection rather than a test.

Choose the cheapest level that can expose the failure:

- unit tests for deterministic domain rules;
- integration tests for real persistence, transactions and external boundary adapters;
- contract tests for consumer/provider schemas and compatibility;
- a small E2E suite for critical user journeys, including important failure and permission states.

Consider empty, boundary, invalid, duplicate, concurrent and out-of-order inputs where the behaviour
depends on them. Property-based tests help when invariants span many inputs; use the established
toolchain and a reproducible seed. Add complexity only when it increases useful failure detection.

## Build independent tests

For a reproducible bug, first demonstrate a failing regression test where practical. For new behaviour,
use a failing test first when it clarifies the contract, then implement and refactor. Test outcomes,
not private function names or a copy of the implementation.

Use deterministic clocks, randomness and identifiers when needed. Isolate database and filesystem
state per test; clean up fixtures. Mock unavailable external systems at a stable boundary, but verify
the adapter separately and keep mocks aligned with the real contract. A mocked response does not
prove the external service works. Never use production credentials or customer data as fixtures.

For browser tests, prefer user-facing roles and stable selectors, condition-based waits and isolated
accounts. Capture traces or screenshots on failure without leaking secrets. Diagnose flaky tests;
unexplained retries and indefinite quarantine are not fixes. Record the owner and exit condition for
any temporary quarantine.

## Assess test sensitivity when useful

For a critical rule or a suspect assertion, optionally use Mutator or the project's established
mutation tool. A direct correction does not require this campaign. Select an explicit version and
scope, inspect launcher effects and prepare dependencies separately within project authority;
loading the skill installs nothing. Bound duration and parallelism.

Start with passing baseline tests. In the retained native report, distinguish survivors, killed
mutants and uncovered sites: a score over executed mutants does not cover every site. A compilation
error or timeout killing a mutant does not establish a behavioural assertion. Keep its killing
reason unknown if the tool does not expose it. Add an observable assertion for a relevant survivor;
an equivalent mutation may need analysis rather than another test.

Retain command, version/runtime, source, tests, configuration, selected dependencies and report.
Rerun when that context changes; a cache keyed only by the function is insufficient. Use a fresh
cache or an appropriate complete rerun. Reuse existing product identifiers for evidence; without
applicable identifiers, report the execution without inventing clauses.

## Run and report

Use the host project's documented native command, never the Build Kit's npm scripts by default.
Give the exact focused command (for example cargo test cancellation_rule or pytest tests/test_cancel.py).
Run the focused cases, then relevant integration/regression checks. Ensure a meaningful negative case
can actually fail. Report commands, results, behavioural coverage, skipped cases and environmental
limits in validation.md when work evidence is required. Passing a test harness fixture does not prove
a real agent or deployed integration complies. Route broader CI/CD work to release-engineering.
