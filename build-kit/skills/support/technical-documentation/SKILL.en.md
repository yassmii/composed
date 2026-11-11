---
name: technical-documentation
description: >
  Write verified maintenance, onboarding, runbook and handover documentation. USE THIS SKILL when
  durable technical instructions are the deliverable; use codebase-onboarding for discovery and
  delivery-orchestrator for a temporary cross-session handoff.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.2.0"
---

> **Use this skill** to document verified project facts for the intended reader.
> **Use product-manager** for product decisions and requirements; link their canonical sources.

# Technical documentation

## Establish audience and sources

Inspect existing docs, code, native manifests, configuration examples and verified work evidence.
Reuse the established location and conventions. Identify who needs to run, maintain or change the
system and what task the document must support. Do not overwrite a useful README with a fixed template.

## Write actionable instructions

Include only relevant sections: purpose, prerequisites, installation, configuration variable names
without secrets, run/test commands, architecture entry points, troubleshooting, release/recovery
procedures and ownership. Derive versions and commands from the host project rather than a default
Node stack. Label inferred troubleshooting guidance and untested steps instead of inventing known errors.

Link canonical product decisions, interface schemas and operating procedures rather than copying
their contents into multiple documents. Keep ephemeral session state in work artifacts, not long-lived
instructions. Distinguish installed capabilities from proposed architecture or future runtime automation.

For durable operating knowledge, retain the source/observation, applicable scope, last verification
and review trigger when useful. These are optional provenance, not a mandatory note-schema migration.
Mark uncertain/superseded context for review and link its current replacement; keep product decisions
and learned outcomes canonical. A memory pointer leads to the current source/handoff, not copied truth.

## Verify the handover

Check paths, links, native commands and configuration against the current repository. Execute bounded
local examples when useful and authorised; do not deploy, publish or mutate live data merely to validate
documentation. Report the checks performed, commands not run and assumptions. When appropriate, let
a fresh reader follow the instructions in a disposable environment and record remaining gaps.

The kit's read-only `knowledge check` can expose missing indexed notes or supported local source
links. Its structural pass never establishes semantic freshness, approval or external-source truth;
inspect unverified coverage and current sources. On resume, read the relevant index/note/source and
actual handoff state before acting, then close obsolete active pointers without erasing evidence.
