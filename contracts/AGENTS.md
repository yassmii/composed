# Contract consumer protocol

When an implementation repository references a Composed Contract:

1. Read the contract and its linked research before selecting an architecture or writing code.
2. Treat `invariants`, `policies`, and `acceptance` as non-negotiable requirements.
3. Keep implementation technology-neutral: do not infer a language, framework, database, or vendor from the contract unless it is explicitly declared as an external constraint.
4. Produce a plan that maps contract capabilities to available skills; report an uncovered capability.
5. Preserve traceability: implementation work must reference a `requirement.id` or `acceptance.id`.
6. Do not invent behaviour absent from the contract. Propose a versioned extension when needed.
7. Run and report the stated evidence before declaring work complete.
8. Report implementation gaps and changed research through the [evolution workflow](docs/continuous-evolution.md). Do not silently change a pinned contract, treat telemetry as approval, or export project-private evidence.

The contract defines the product. This file only defines how agents should implement it.

For format 0.2, use the explicit `acceptance.verifies` links and proof dimensions described in
[structured verification](docs/verification.md). Preserve 0.1 pins unless migration is requested.
Separate a structurally valid plan, supplied case observations and a current scoped assessment;
none alone establishes global product conformance or authenticated human acceptance. Use version
impact to propose affected revalidation, never to transfer proof based on a similar clause name.
