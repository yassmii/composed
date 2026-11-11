---
name: release-engineering
description: >
  Prepare reproducible releases, CI/CD and verified rollouts. USE THIS SKILL for packaging,
  deployment configuration, readiness checks, rollout/rollback and post-deploy verification;
  use automated-testing for test implementation and data-migrations for data transition design.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

> **Use this skill** to prepare or execute a release within the authorised environment and scope.
> A request for readiness assessment does not authorise deployment or publication.

# Release engineering

## Discover the release surface

Inspect host manifests, native validation commands, CI workflows, artifact registry, deployment
configuration and versioning policy. Distinguish an application deployment from a library/package
release. Identify the source revision, target environment, credentials boundary and release owner.
Preserve the chosen stack; do not introduce a provider or container runtime as an assumed requirement.

## Prepare the release

- Build a traceable artifact from a known revision with locked/reviewed dependencies and documented
  configuration. Separate build-time and runtime secrets; validate required runtime settings.
- Run native build/type/lint/test checks that exist and matter to the change. Record omissions.
  Stage test, build and deployment permissions so untrusted changes cannot access release secrets.
- Inspect changed interfaces, migration order, assets, jobs and external integrations. Coordinate
  api-contracts and data-migrations only where those surfaces actually change.
- Choose rollout proportional to impact: atomic, rolling, canary, feature flag or package promotion.
  Define observable success, stop conditions, responsible owner and recovery procedure before release.
- Identify the exact previous artifact/configuration and data compatibility. A code rollback cannot
  undo all data writes; rehearse recovery when a mistake would have significant consequences.

Keep pipeline configuration reviewable. Changes to CI should not silently broaden credentials,
execute mutable remote scripts or grant publication authority beyond the task.

Crapper, Dryer or Mutator campaigns, or their equivalents, are optional checks activated explicitly.
Pin tools and environment, separate preparation from execution and inspect installation, overwritten
reports and other project effects. Bound time and parallelism using observed cost; retain raw
reports and the selected context determining their applicability. Start with informative measurement.
A later gate must define scope, baseline, local threshold, exclusions and error/missing-result
handling; neither exit 0 nor a score alone establishes it. Do not make these engines mandatory in
an existing CI without an explicit project policy.

## Verify the actual outcome

Prepare all local artifacts and validation before a required deployment/publication approval. Reuse
existing scoped authorisation; otherwise ask immediately before the external mutation with the exact
target, artifact, impact, recovery and checks available for review. Reconfirm actual target identity
at execution time. Follow the catalogue's delegation and independent review gates.

After authorised deployment, verify artifact identity, health/readiness and a representative critical
journey. Check relevant logs, asset delivery, integration errors and performance against the baseline
using available tools. Name any unavailable live check; CI green is not post-deploy evidence.
Stop or perform the authorised recovery when predefined criteria fail; do not silently widen rollout.

Report revision/version, artifact and environment, commands/results, rollout status, recovery evidence,
known limits and any decision still pending. Store evidence in validation.md and link any durable
operating procedure rather than duplicating it. A workflow skill does not supply a deployment runtime
or continuous monitoring that the environment does not actually provide.
