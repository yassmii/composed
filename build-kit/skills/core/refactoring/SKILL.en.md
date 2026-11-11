---
name: refactoring
description: >
  Improve internal code structure while preserving observable behaviour. USE THIS SKILL for technical
  debt and structural cleanup; use software-engineering for intended behaviour changes and
  systematic-debugging when a failure needs diagnosis.
license: MIT
metadata:
  author: composed-build-kit
  version: "2.1.0"
---

> **Use this skill** when the outcome is a clearer structure with unchanged external behaviour.
> **Use data-migrations** for persisted schema or data evolution, even if users should see no difference.

# Refactoring

## Establish the baseline

Inspect callers, interfaces, side effects and existing tests before proposing transformations. Name
the concrete maintenance problem and the behaviour to preserve, including errors, permissions,
serialization and relevant performance constraints. Do not treat an undocumented quirk as a defect.
Use codebase-onboarding if the affected path cannot yet be explained.

Run the host project's native baseline checks. Add characterization tests for risky untested
behaviour with automated-testing when needed. Record existing failures separately; a failing baseline
does not authorise unrelated repairs. Preserve the user's local changes.

Crapper can help locate a complex, poorly tested function; Dryer can flag similar structures.
Use these optional tools, or established equivalents, only when their measurement informs the
maintenance problem. Separately prepare a known version and its dependencies after inspecting
launcher effects, with bounded scope and budget; no implicit installation. Retain native reports,
command and selected source/test/configuration/dependency context. Missing, stale or failed-test
coverage is not a usable baseline. Structural similarity does not establish one shared domain rule.
Justify unification by reasons to change and extraction by cohesion; there is no universal CRAP or
duplication threshold. A report produced with exit 0 can still contain findings to examine.

## Transform incrementally

Choose transformations for the observed problem: rename an ambiguous concept, separate responsibilities,
isolate a side effect, remove proven dead code or replace duplicated policy. Extraction and extra files
are options, not a mandatory sequence. Prefer a small dependency boundary to speculative frameworks.

For non-trivial work, record affected consumers, included/deferred scope, validation and a recovery
point. Make reviewable increments and run focused checks after each meaningful transformation. Use
available evidence to proceed; ask the user only for a material decision or required external action,
not a routine validation the agent can perform. Keep requested feature changes in a separate bounded
slice without ignoring later user steering.

If a check regresses, stop the affected transformation, isolate the cause and recover only the agent's
identified changes when safe. Do not use a blanket reset or erase unrelated work. Route an unexplained
failure to systematic-debugging instead of repeating speculative edits.

## Demonstrate preservation

Compare the final diff to the baseline and inspect affected callers, public types and side effects.
Run relevant tests and native checks; unchanged snapshots alone may hide a behavioural regression.
Report the maintenance gain, commands/results, known limitations and any accidental behaviour change
that must be resolved before calling the work a completed refactor. Follow the catalogue's applicable
delegation and independent review gates.
