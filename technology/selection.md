# Select technology from a contract

## 1. Establish the decision boundary

Read the entire pinned contract and its research. Record its ID, version, repository commit and
SHA-256. Preserve existing stack choices and explicit user delegation; do not reopen unchanged
choices. Gather only missing consequential constraints: team skills, existing systems, delivery
budget, operating budget, deployment/region requirements, workload, latency, offline needs, support
horizon and license policy. Unknowns are unknowns, not defaults silently imposed on the user.

The contract supplies product requirements, not a technology choice. An explicit constraint such as
canonical Git history must still be honored. Framework popularity or agent familiarity is not a
substitute for the requirements. Neither the kit's Node runtime nor this catalog constrains a host
project's stack.

## 2. Translate requirements into technical questions

Build a clause matrix: ID, required property, responsible component, proposed mechanism, evidence
needed, and unresolved risk. For example, finite booking capacity requires a concurrency-safe
allocation transaction, not just a framework with an ORM. Separate native capability, extension,
and application-specific work. Authentication libraries do not establish authorization correctness;
CRDT convergence does not establish business validity or durable canonical history.

## 3. Filter, then compare

Reject a candidate only for an evidenced hard constraint; record the reason and source. Unknown
hard constraints produce `blocked`, not `pass`. Missing catalog coverage triggers additional
research, not automatic elimination. Include two or three coherent stacks, preserving agreed parts.
Check runtime/compiler/framework/driver compatibility as a combination, not independent version
lists. Record the exact package matrix and lockfile in the consumer project before installation.

Compare delivery effort, operational burden, security boundaries, lifecycle, license obligations,
data portability, ecosystem dependencies and estimated total cost over the chosen horizon. State
assumptions behind estimates; do not invent salaries, hosting prices or throughput. If scoring helps,
show project-specific weights and sensitivity to assumptions. Hard failures cannot be averaged away.

Read capability source IDs and freshness dates. For decisive mutable facts, consult the current
official source even if the card is not overdue. A source-change report is a reason to inspect,
not a reason to automatically upgrade. Verify unknown licenses at the exact selected revisions.

## 4. Recommend and test uncertainty

Explain the preferred option under the stated assumptions, the credible alternative, what would
reverse the recommendation, and any blocked components. Specify bounded spikes for the highest
risks: concurrent allocation, crash recovery, reconnect/revocation, projection rebuilding, or
realistic load. Record commands, environment, dataset, concurrency, versions and outcomes for any
benchmark. Unexecuted spikes stay `not_run`. Never claim the full contract is covered by a study.

## 5. Record authority and provenance

Use the project's existing decision document, or [this template](templates/decision.md). Pin the
technology reference version AND commit/hash; retain source IDs and consultation dates. Present the
recommendation, then obtain the user's choice or use their existing explicit delegation before
dependent scaffolding/installation. Do not ask again for already accepted unchanged decisions.

Set re-evaluation triggers: support expiry, material workload/hosting/team change, vulnerability,
invalidated assumption, or contract revision. A catalog update does not migrate a project. Preserve
the original decision and write a superseding decision if a change is accepted.
