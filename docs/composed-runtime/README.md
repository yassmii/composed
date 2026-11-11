# Composed Runtime — design

This folder holds the design of an optional supervisor for agent CLIs. It is distinct from the
Build Kit, which provides the method, and from product contracts, which define expected
outcomes. The runtime has its own repository, distribution and version; this folder does not
create a third component shipped from here.

| Document | Purpose |
| --- | --- |
| [Implementation plan](implementation-plan.md) (French) | Preparation of the open protocol, adapters, supervision, work packages and their validation. |
| [Cross-provider evolution — 5 November](../../.agents/work/adaptive-delivery/handoff.md) (French) | Coordinated runtime and Build Kit plans for third-party and local model agents, gateways and adaptive assignment; not implemented. |
| [Events and hooks](hooks-and-events.md) (French) | Inventory of controls, responsibilities, priorities and failure cases to check before adopting a hook. |
| [Handoff](../../.agents/work/composed-runtime-planning/handoff.md) (French) | Current state, provenance and next step. |
| [Relocation evidence](../../.agents/work/composed-runtime-planning/relocation-validation.md) (French) | Hashes of the originals, migration and documentary checks. |

The initial plan of 20 October 2026 was first kept in a private project and was moved here on
24 October 2026 with its evidence. Historical reviews are preserved; they validate neither the
newer hooks document nor any runtime implementation.

**Status: design.** No supervisor, event subscription, hook or provider adapter is shipped from
this folder. An early implementation lives in the separate
[composed-runtime](https://github.com/yassmii/composed-runtime) repository; today it covers a
synthetic vertical with a fake adapter only. Rust is the choice proposed in the historical plan
for the reference runtime; the protocol stays independent of that choice. This study selects no
technology for products built with the kit.

The [harness family contract](../../contracts/product-types/agentic-delivery-harness/README.md)
defines delivery outcomes separately. Its baseline and proposed modules do not make the runtime
mandatory and do not validate its protocol.
