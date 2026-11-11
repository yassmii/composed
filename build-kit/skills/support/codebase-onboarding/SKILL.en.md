---
name: codebase-onboarding
description: >
  Map an unfamiliar codebase from repository evidence before a non-trivial change. USE THIS SKILL
  for architecture discovery, current behaviour and impact mapping; use systematic-debugging for
  a specific unexplained failure and technical-documentation for a durable onboarding guide.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

> **Use this skill** to establish enough understanding for the requested change and its risk.
> **Use software-engineering or refactoring** once the affected path and baseline are understood.

# Codebase onboarding

## Trace the existing behaviour

Read project instructions and canonical architecture/product docs. Discover native manifests and
commands. Trace the relevant entry point through domain logic, persistence and external boundaries;
identify actual callers, consumers, tests and ownership. Cite files or symbols for material claims.
Avoid a whole-repository survey for a bounded change.

Explain the current user or operator path, including important errors and side effects. Separate
implemented rules from intended product policy. An undocumented quirk may be deliberate; ask only
when resolving that difference changes scope, correctness or risk. Do not invent a fixed number of rules.

## Establish the baseline and impact

Run available documented checks within the authorised environment, or state precisely what is missing
and give the native command. Do not ask a user to run a check that the agent can safely perform itself.
Separate pre-existing failures from effects of the proposed change.

Map likely impact on callers, data, interfaces, tests, docs, release order and recovery. Prove
dependencies from code and schemas rather than directory names. Label unverified paths and identify
the smallest observation that would resolve them. Avoid opportunistic refactoring during discovery.

## Hand off the next change

Deliver a concise architecture map, current path, baseline evidence, unknowns, affected consumers
and a bounded next action. For non-trivial work, keep working evidence in brief.md or plan.md and
link canonical docs; do not create another product source of truth. Route durable onboarding docs
to technical-documentation, implementation to software-engineering and risky untested behaviour to
automated-testing for characterization before change.
