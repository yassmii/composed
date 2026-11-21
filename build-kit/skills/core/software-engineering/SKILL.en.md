---
name: software-engineering
description: >
  Implement maintainable software and assess architecture or technology options. USE THIS SKILL when
  changing application code, defining module boundaries or studying a stack; use systematic-debugging
  for an unexplained failure and refactoring for a behaviour-preserving structural change.
license: MIT
metadata:
  author: composed-build-kit
  version: "2.2.2"
---

> **Use this skill** for implementation and engineering decisions within an agreed product scope.
> **Use cadrage** for material requirement gaps; use specialised skills for their distinct deliverables.

# Software engineering

## Establish the constraints

For a fully specified reversible local correction, apply the direct path in AGENTS.md: inspect only
relevant instructions, code and tests, state scope and validation inline, and implement. No automatic
orchestrator, full catalog read, secondary testing skill, work directory or independent review.
Material security, public-interface, persisted-data or stack changes and explicit review/planning
requests need their applicable gates. Several files or test steps alone do not make work complex.

Read the host project's instructions, relevant code, tests and canonical decisions. Identify the
observable outcome, affected callers, data ownership and relevant quality constraints. When a Composed
Contract applies, map work and evidence to its requirement.id or acceptance.id; report uncovered
capabilities instead of inventing requirements. Keep product requirements and technical interfaces distinct.

Inspect existing code and dependencies before adding a utility or abstraction. For a consequential
dependency or API choice, consult current official documentation and assess compatibility, maintenance,
license, operational cost and alternatives. Report unavailable research channels honestly.

## Choose a stack only within authority

For a new project, POC or stack change, follow stack_selection_policy in skills/catalog.json. If a
choice remains, ask about missing constraints that could change the recommendation. Study credible
options using current primary sources. In the conversation, present the options, their main costs and
trade-offs, and your recommendation. Do this before selection, scaffolding, dependency installation
or dependent implementation. Wait for the user's choice or explicit delegation. If already delegated,
present the proposal and proceed. Preserve partial choices and the scope of delegation.
Reuse an established unchanged stack without asking again. Urgency, templates,
kit manifests and --yes are not stack decisions. Link the canonical decision from the work plan.

## Design the smallest coherent change

For a contract-based technology study, consult Composed's optional
[technology reference](https://github.com/yassmii/composed/tree/main/technology) from a pinned checkout
or revision. Follow its selection protocol, map decisive capabilities/sources to clause IDs, and
record reference version/commit and source check dates in the project decision. Recheck stale or
decisive mutable facts; missing coverage is a research gap, not rejection of a technology. The
catalog is advisory, not bundled with this skill, and does not grant stack-selection authority.
If unavailable, research primary sources directly and report the missing reference.

- Trace the actual call path and consumers; distinguish observed behaviour from assumptions.
- Keep domain rules, persistence, transport and presentation behind useful existing boundaries.
  Introduce an abstraction only for a demonstrated gain in cohesion, testability or reuse.
  Represent permitted domain states in the data/types and check external inputs before passing
  them to domain logic; do not add a coercion simply to silence a type error.
- Specify errors at the boundary: validation failure, missing permission, conflict, unavailable
  dependency and unexpected failure must have appropriate observable outcomes.
- For concurrent or distributed work, identify transaction boundaries, duplicate and out-of-order
  delivery, retry safety, timeouts and cancellation. Reduce shared mutable state first; where data
  must remain shared, identify its writer and how that ownership is enforced. Check the result of
  retry and recovery after interruption, not only the first call. Bound retries; do not retry an
  unsafe write blindly.
- Use measured product constraints for latency, throughput and resource usage. Avoid speculative
  optimisation, generic extensibility and arbitrary function-length limits.
- Route interface evolution to api-contracts, schema/backfills to data-migrations, security assessment
  to security-review and deployment work to release-engineering when those outputs are needed.

## Implement and demonstrate

For non-trivial work, record scope, affected surfaces, alternatives worth considering and validation
in the smallest work plan. Follow the catalogue's actual delegation and review policy; reading several
skills is not delegation. Implement in reviewable increments and preserve unrelated local changes.

When required write access is unknown or has failed, use the preflight path probe through the actual
agent tool/sandbox for the intended source and evidence directories. Its pass covers selected paths
only; native delegation, reviewer independence and quota need their own observations. Do not bypass
permissions or silently move required artifacts elsewhere after denial. Repeat only after the context
or permissions change. Direct questions need no runtime ritual.
If the CLI is unavailable, use an equivalent bounded native probe with exclusive temporary creation,
write/read byte verification and owned cleanup in the intended directory; add no host dependencies.

Run the host project's documented native checks. Choose behavioural tests from the risks and affected
consumers, with automated-testing when necessary. Review the diff against the original outcome and
planned impact. Report what changed, exact checks and results, remaining limits and recovery steps
where applicable. Code generation or a formatting pass alone does not establish correctness.
