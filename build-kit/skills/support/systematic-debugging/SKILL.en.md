---
name: systematic-debugging
description: >
  Diagnose reproducible or intermittent failures before changing code. USE THIS SKILL for unexplained
  application, build, test, environment or agent-loop failures; use automated-testing for a known
  coverage gap and software-engineering for a specified implementation.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

> **Use this skill** when observation and root-cause diagnosis are the missing work.
> **Use release-engineering** for deployment execution after the failure and remedy are understood.

# Systematic debugging

## Capture before editing

Record the intended and observed outcomes, exact error, smallest reproduction, environment, relevant
versions, last successful state and recent changes. Inspect actual cwd, branch, files, processes and
available tools rather than assuming their state. Preserve useful logs without exposing credentials.
For an intermittent failure, record frequency and conditions; do not claim reproduction from one guess.

For agent failures, also capture the repeated tool sequence, last meaningful progress, scope drift,
context duplication and quota signals. Do not claim a hidden reset or recovery capability.

## Test a falsifiable hypothesis

Separate application logic, state/concurrency, dependency, environment and tool/runtime failures.
Trace the failing input across boundaries to the first divergent observation. State the hypothesis,
the smallest observation that could refute it and the expected result before each experiment.
Change one relevant variable at a time; narrow the failing case before broadening the code change.
When different attempts fail the same way, name their shared assumption and seek an observation
that distinguishes it from another cause before producing another variant of the fix.

Use available logs, focused tests and local instrumentation. A build error may be configuration or
dependency drift; a failing test may expose a real defect or a broken fixture. Do not fix a symptom
by disabling validation, weakening authorisation or suppressing errors. Prefer a source-level remedy
to a generated-file edit. Establish version compatibility before proposing dependency replacement.

## Correct and demonstrate

Implement the smallest change supported by evidence within the authorised scope. Add a failing
regression case when practical, show it passing after the fix and run affected neighbouring checks.
Distinguish a causal fix from a temporary workaround and name the remaining limitation.

Repeated failure of the same hypothesis calls for new evidence, not an arbitrary retry count or
blanket revert. Stop an unproductive loop, preserve state, narrow the next experiment and report a
real external blocker if one remains. Revert only identified agent-owned changes when safe; preserve
unrelated work. Follow the host's authority boundary for production or destructive recovery.

Report: symptom and reproduction; confirmed cause or remaining hypotheses; change or workaround;
commands and observations before/after; regression evidence and next action. Use validation.md for
non-trivial work. Diagnosis can be complete while implementation or live verification remains pending.
