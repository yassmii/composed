---
name: data-migrations
description: >
  Plan and verify persisted schema changes, backfills and data recovery. USE THIS SKILL for migrations,
  data imports or destructive cleanup; use refactoring for internal code-only restructuring and
  release-engineering for the surrounding rollout.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.0.0"
---

> **Use this skill** when existing data and running versions must survive a change.
> A migration plan or local rehearsal does not authorise a production mutation.

# Data migrations

## Establish the data boundary

Read the actual schema, migration history, data policies, consumers and deployment process. Determine
data volume, ownership, invariants, retention, concurrent writers and acceptable downtime from evidence.
Record unknowns instead of inventing production capacity. Inspect the host's database/tool versions
and current official documentation for engine-specific locking or DDL behaviour.

Classify additive, destructive and irreversible effects. State which old/new application versions can
read and write each intermediate state. Preserve applicable product requirement and acceptance links.

## Plan a recoverable transition

Prefer expand → migrate → verify → contract when live compatibility matters. Separate destructive
cleanup from additive rollout; old readers/writers must be retired before the incompatible step.
Avoid one long transaction or unbounded lock when data volume makes it unsafe.

For backfills, define stable batching, checkpoints, idempotency, restart and concurrent-write handling.
Validate source/target invariants, counts and semantic samples; equal row counts alone are insufficient.
Select limits from measured capacity or an explicit operational decision, not invented constants.

Distinguish application rollback, schema rollback, forward repair and data restoration. A down script
cannot restore deleted values. Identify the backup, restore procedure, owner and conditions before an
irreversible step. Account for writes accepted after the backup and dependencies on changed schemas.

## Rehearse and execute within scope

Use a disposable database with synthetic or authorised sanitised data. Run the actual migration and
relevant old/new consumers. Verify interruption/restart and recovery where material; record measured
duration, locks, invariant checks and limitations. Never claim a production-scale rehearsal from a tiny fixture.

Before a destructive or production action, present exact target, impact, compatibility window,
recovery procedure and validation; obtain the required scoped authorisation unless already provided.
Check actual environment identity before executing. Stop on unexpected target, invariant failure,
capacity breach or missing recovery evidence. Route rollout coordination to release-engineering.

Record versions, migration identifiers, commands/results, data-integrity evidence, unresolved risks
and remaining cleanup in plan.md and validation.md when required. Keep live credentials and customer
data out of shared artifacts. A generated migration file is not an applied or validated migration.
