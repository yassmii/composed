# Collaborative workspace: conditional technology study

Study date: 2026-11-18. Reference: technology 0.2.0. Contract: `collaborative-workspace` 1.0.0
candidate, [source](../../contracts/product-types/collaborative-workspace/contracts/contract.yaml).
This is a synthetic architecture study; no complete implementation or compatibility matrix was tested.

## Context and hard constraints

Assume a TypeScript-skilled team, rich browser editing, offline drafts and self-hosted operation.
Document size, simultaneous editors, hosting budget and recovery targets are unknown. The contract
requires canonical Git history and no mandatory vendor account or paid core capability. A hosted-only
collaboration service is therefore ineligible as the sole path, regardless of its convenience.

## Requirement matrix

| Clause | Candidate mechanism | Catalog evidence | Remaining proof |
| --- | --- | --- | --- |
| INV-CWS-003 | Convergent shared types plus application validation before acceptance | yjs/shared-types | Invalid/unauthorized operations must not contaminate accepted state; rejected changes cannot partially mutate it |
| INV-CWS-012 | Durable local update queue and explicit reconciliation | yjs/persistence-transport | Crash/reload while offline, reconnect after revocation and rejected-change recovery |
| INV-CWS-014 | Canonical Git commits; SQL/search/relay state is rebuildable projection | git/conditional-ref | Crash after Git commit but before projection/ack; rebuild from Git without a second content authority |
| INV-CWS-001 / INV-CWS-008 | Authorization at protected read/write/delivery and reconnect boundaries | nestjs/gateways is transport support only | Revoke a live participant; no subsequent protected operation or update is allowed |
| INV-CWS-011 | Independently operable core and self-hosted providers | No capability substitutes for a complete dependency/license audit | Boot and exercise must capabilities without vendor credentials or outbound vendor services |

## Candidate comparison

| Option | Benefits under assumptions | Costs and limitations | Hard-constraint status |
| --- | --- | --- | --- |
| TypeScript + React + Yjs + Node.js/NestJS, application-controlled Git writer, optional PostgreSQL projections | Shared team language; documented collaboration and transport primitives | Substantial custom work for editor binding, ACLs, semantic commits, local persistence and crash recovery | Conditional candidate; exact providers/licenses/version matrix and all invariants unproved |
| React + Yjs client, Python/Django control plane, separate self-hosted Node relay, Git writer and optional SQL projections | Candidate for an established Python backend team | Two backend ecosystems and cross-service authorization/commit protocol increase operating boundaries | Conditional alternative; relay integration and recovery need additional research |
| React/Yjs client + C#/.NET/ASP.NET Core control plane, self-hosted relay and Git writer | Candidate for a .NET team; aspnet-core/signalr supplies messaging facilities | SignalR is not a drop-in Yjs provider; implement/test a protocol adapter or retain a separate compatible relay | Authorization, offline recovery and canonical commit boundary remain unproved |

A Rust/Tokio/Axum control plane or materialization service is also a candidate for a Rust-skilled
team or measured resource constraints. tokio/async-runtime and axum/routing provide execution/HTTP
primitives, not a Yjs-compatible synchronization protocol. Validate bindings, wire format, persistence
and cross-language error semantics before replacing a relay or canonical writer. None of these
options removes INV-CWS-001, INV-CWS-008 or INV-CWS-014. See also the
[native/component comparison](native-components.md) for C, C++, assembly and WASM boundaries.

**Conditional recommendation:** prototype the first option for the assumed TypeScript team. Its value
is reducing language boundaries, not a demonstrated performance advantage. The second becomes more
credible with an existing Django platform and team. Neither is ready for unqualified selection.
An explicit-conflict editing design may also meet the contract; CRDT use is not itself mandatory.

The central design is the acceptance boundary: authorize, validate and materialize accepted semantic
changes into Git; only then acknowledge canonical acceptance. Local acceptance and canonical
acceptance need distinct states. Coordinate the canonical writer with conditional head updates,
retain recoverable local operations, and make projections replayable. Do not treat a Yjs update or
WebSocket acknowledgment as an attributed, durable, authorized product commit.

Git repository access is not equivalent to resource-level authorization. Do not give a client a raw
repository containing inaccessible resources. Separate secret/session storage from canonical content;
define what encrypted clients, relay and materializer can observe before selecting encryption topology.

## Experiments and decision boundary

All are **not_run**: concurrent edit convergence and explicit conflict preservation; restart with
offline changes; revoke during live editing; crash between canonical commit and acknowledgment;
rebuild projections; operate without vendor connectivity; measure large-document replay and Git growth.
Authentication/factors, encryption, editor engine, search, attachments and automation still need
their own research. This catalog covers architectural risks, not every must capability.

Pin actual editor/provider/runtime/database/Git versions and verify all licenses. Estimate relay
connections, persistent storage, backups, compaction and operator time using a representative workload.
Do not publish numeric performance or cost claims from this study. Revisit when those experiments,
team ownership or deployment constraints change. Obtain the user's stack choice or use recorded
delegation before dependent implementation.
