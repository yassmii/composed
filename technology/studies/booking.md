# Booking: conditional technology study

Study date: 2026-11-18. Reference: technology 0.2.0. Contract: `saas-booking` 1.0.0 candidate,
[source](../../contracts/product-types/saas-booking/contracts/contract.yaml).
This is a synthetic study, not a user-accepted stack or full conformance assessment.

## Context and constraints

Assume a small Python-skilled team, conventional web booking and operator screens, self-managed
deployment, no required native client, and no measured load beyond the contract's planned checks.
Budget, hosting region, traffic distribution and support horizon remain unknown. These assumptions
must be replaced for a real project. Pin the contract and reference commit/hashes in that project's
decision; the manifest here freezes the contract bytes used for this study.

## Requirement matrix

| Clause | Mechanism to investigate | Catalog evidence | Remaining proof |
| --- | --- | --- | --- |
| INV-BOOK-001 / ACC-BOOK-001 | One database transaction for capacity allocation, covering holds and confirmations; serialize conflicting decisions | postgresql/serializable; django/atomic-blocks | Simultaneous last-seat requests and final ledger; transaction retries must not repeat external effects |
| ACC-BOOK-012 | Shared decision clock and serialized transitions for payment, expiry and new allocation | postgresql/default-isolation | Race at the exact expiry boundary; a default ORM transaction is insufficient |
| ACC-BOOK-008 | Authenticate and bind payment results to the reservation before conversion | typescript/input-validation is a boundary reminder, not payment support | Provider signature/replay verification is application work; provider not selected |
| ACC-BOOK-009 | Enforce actor scope, frozen cancellation policy and idempotent capacity release | Framework choice alone provides no evidence | Actor/policy matrix and repeated cancellation |
| ACC-BOOK-010 / ACC-BOOK-011 | Preserve instant and zone; accessible forms | No catalog capability establishes these | DST fixtures, keyboard journey and accessibility-tree inspection |

## Candidate comparison

| Option | Benefits under assumptions | Costs and limitations | Hard-constraint status |
| --- | --- | --- | --- |
| Python + Django + PostgreSQL, server-rendered UI | Reuses team expertise; one application coordinates UI and transactions | Worker/outbox design and PostgreSQL operation; rich client needs may increase UI work | No identified inherent conflict; exact versions, licenses and deployment remain blocked pending checks |
| TypeScript + Node.js + NestJS + PostgreSQL, separate UI if required | Credible when team expertise is TypeScript or API consumers dominate | Must select ORM/driver, UI and transport adapters; additional integration ownership | Same concurrency obligations; exact compatibility/license checks remain blocked |
| C# + .NET + ASP.NET Core + EF Core/PostgreSQL | Credible for a C# team; coordinated HTTP and persistence tooling | Select a compatible PostgreSQL provider and explicit concurrency/retry strategy | ef-core/transactions supports atomic writes, not proof of INV-BOOK-001; provider/version checks remain blocked |

Rust + Tokio + Axum + PostgreSQL is a further candidate when existing Rust expertise or measured
resource constraints justify it. rust/ownership and axum/routing support language/HTTP concerns;
they do not implement the allocation ledger. Select and test a database crate, transaction retry,
identity and UI integration. With the assumed Python team and no measured resource issue, it is
not in the first three-option shortlist; this is a contextual decision, not exclusion from booking.

**Conditional recommendation:** investigate the Django option first for the stated Python team.
This is a delivery judgment, not a measured speed claim. Choose the NestJS option for an established
TypeScript team or a demonstrably better fit to existing services. React is optional: booking does
not inherently require a separate client. Prefer investigating ASP.NET Core for an established C#
team rather than migrating them to the assumed Python stack. Go/Java or an existing supported stack remain credible
outside this initial catalog; a strong existing constraint should trigger research rather than migration.

For PostgreSQL, design a common transactional allocation boundary for every writer, including
operator actions. Serializable isolation with bounded whole-transaction retry is one candidate;
explicit row locking with correctly maintained capacity is another requiring its own proof.
Deduplicate requests and put durable external-effect intents in the same transaction. Network
payment calls must not be replayed blindly by a database retry.

## Before implementation

- Pin supported Python/Django/driver/PostgreSQL versions and verify distribution licenses. The
  5.2 documentation baseline is not an instruction to install an old patch or ignore newer options.
- Estimate app, worker, database, backups, monitoring and operator effort over the agreed horizon.
  No numeric total is possible without region, load and recovery targets.
- Execute ACC-BOOK-001 and ACC-BOOK-012 with a controlled clock; execute the contract's full
  acceptance set and QA-BOOK-001 load requirement before making any conformance claim.
- All experiments in this study: **not_run**. Revisit if team skills, UI needs, contention or hosting
  assumptions change. This study does not select a payment provider or add requirements to the contract.
