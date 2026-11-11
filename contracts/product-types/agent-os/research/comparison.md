# Initial comparison

This document separates three layers: source facts (observations), interpretation (convergence and divergence), and the product choices that follow. The choices are labelled `explicit_project_choice` in `contracts/traceability.yaml`.

## Source facts at a glance

| Concern | AIOS | OpenHands | MCP (tool boundary) |
| --- | --- | --- | --- |
| Position | Kernel layer above the host OS kernel (OBS-AOS-001) | Agent runtime in a sandbox (OBS-AOS-020) | Protocol between hosts and tool servers (OBS-AOS-026) |
| Mediation | Every agent request is a system call dispatched by a central scheduler (OBS-AOS-002) | Every action is an event, analysed before execution (OBS-AOS-015, 019) | Hosts mediate tool invocations (OBS-AOS-026, 029) |
| Scheduling | FIFO or time-sliced round robin with context snapshot and resume (OBS-AOS-003, 004) | Not documented in the sources used | Rate limiting on the server side (OBS-AOS-030) |
| Permissions | Privilege groups for cross-agent access (OBS-AOS-008) | Organisation roles for budgets (OBS-AOS-025) | Access controls required of servers (OBS-AOS-030) |
| Human confirmation | Before deletion, overwrite, privilege modification (OBS-AOS-009) | Risk-based policy; default confirms high and unknown risk (OBS-AOS-017, 018) | Consent before any tool invocation; human can deny (OBS-AOS-026, 029) |
| Risk source | Operation type (OBS-AOS-009) | The model's own assessment by default (OBS-AOS-016) | Annotations, untrusted unless the server is trusted (OBS-AOS-027, 028) |
| Isolation | Sandboxed VM for computer use (OBS-AOS-010) | Container by default; unsafe host process optional (OBS-AOS-020) | Not specified |
| Memory | Per-agent blocks with eviction to storage; per-user shared memory (OBS-AOS-005, 012) | Event log with condensation (OBS-AOS-019, 023) | Not specified |
| Persistence and recovery | Versioned storage with rollback (OBS-AOS-006) | State saved on every change; restorable after a crash (OBS-AOS-021) | Not specified |
| Secrets | Not documented in the sources used | Injected on reference; masked in outputs (OBS-AOS-024) | Not specified |
| Budgets | Not documented in the sources used | Organisation and user spending caps (OBS-AOS-025) | Rate limits (OBS-AOS-030) |

## Convergence

- **A mediation boundary between agents and resources.** AIOS routes every model, memory, storage, and tool request through system calls; OpenHands analyses every action before it runs; MCP places the host between the model and every tool (OBS-AOS-002, 015, 026).
- **A human can stop consequential actions.** All three require or offer confirmation before risky operations and let the user deny them (OBS-AOS-009, 017, 018, 029).
- **Destructive and privilege-changing operations are the core risky set.** AIOS names deletion, overwrite, and privilege modification; OpenHands classes deletion, system commands, and privilege escalation as high risk; MCP assumes a tool is destructive unless told otherwise (OBS-AOS-009, 015, 028).
- **Validation before execution.** AIOS validates tool parameters; MCP requires servers to validate inputs (OBS-AOS-007, 030).
- **Auditability.** OpenHands records security decisions in an append-only event log; MCP advises logging tool use (OBS-AOS-015, 019, 030).
- **Isolation of agent execution.** AIOS sandboxes computer use; OpenHands recommends a container sandbox (OBS-AOS-010, 020).

## Divergence

- **Who decides risk.** OpenHands' default analyzer trusts the model's own risk label (OBS-AOS-016). MCP says tool metadata is untrusted unless the server is trusted (OBS-AOS-027). AIOS classifies by operation type (OBS-AOS-009).
- **Scope of confirmation.** MCP asks for consent before any tool invocation (OBS-AOS-026). OpenHands confirms only high and unknown risk by default (OBS-AOS-017). AIOS confirms only irreversible operations (OBS-AOS-009).
- **Isolation as an option.** OpenHands allows an unsafe host-process mode (OBS-AOS-020). AIOS sandboxes only computer-use agents (OBS-AOS-010).
- **Read-after-write consistency.** AIOS lets a read proceed silently after a bounded wait (OBS-AOS-014). No other source addresses it.
- **History compaction.** OpenHands condenses history but records what was forgotten as a new event (OBS-AOS-023). AIOS evicts memory to storage while keeping it retrievable (OBS-AOS-005).
- **Isolation unit.** AIOS memory isolation is per human user, with agent ownership inside it (OBS-AOS-012). AIOS cross-agent access uses privilege groups (OBS-AOS-008).

## Resulting product choices

1. **An agent OS is an operating layer over a host OS, not a hardware kernel** (POL-AOS-001). This follows AIOS (OBS-AOS-001) and excludes boot, drivers, and hardware scheduling.
2. **Default deny and least privilege** (POL-AOS-002). A process has only the capabilities its principal granted. The sources show access control but not default deny for every resource.
3. **Risk is decided by the runtime's policy, not by the agent** (POL-AOS-005). An agent's self-assessment and tool annotations may raise the risk but never lower it. This sides with MCP against OpenHands' default.
4. **Default confirmation set** (POL-AOS-003): destructive, irreversible, privilege-changing, and unclassified actions always need confirmation unless a standing grant covers that exact tool and scope. This combines AIOS's irreversible set with OpenHands' default treatment of unknown risk, and is narrower than MCP's consent before every tool.
5. **Isolation by default** (POL-AOS-006). A less-isolated mode exists only by operator decision and stays visible.
6. **Reads report staleness instead of failing open** (REQ-AOS-022). This deliberately diverges from AIOS (OBS-AOS-014).
7. **History is append-only** (INV-AOS-006). Compaction, pause, and recovery add events. Retention and deletion are left to an extension.

## Open questions

- Retention and legal erasure of event logs and memory, given the append-only history.
- Whether confirmation by a delegated human (an operator acting for a user) is acceptable, and how it is attributed.
- How to classify actions of a tool whose server is not trusted and that declares no annotations: the contract treats them as unclassified, which may make confirmation fatigue likely.
- Evidence for fairness bounds: AIOS describes round robin but publishes no wait-time guarantee; QA-AOS-002 is a contract choice.
- The AIOS repository at the inspected commit contains no access-manager module, although the paper describes one; the contract relies on the paper's design, not on a verified implementation.


## Corpus refresh — 2026-11-01

See the [dated refresh review](README.md#corpus-refresh--2026-11-01) and
[source-by-source impact record](refresh-2026-11-01.json).

The fifteen recorded immutable sources were retrieved at their existing pins and all hashes matched. No drift was found at those pins. This is not a survey of newer AIOS, OpenHands or MCP revisions, and not an implementation assessment.

Baseline obligations are unchanged. Deferred follow-up: Review newer upstream revisions, retention/erasure, delegated confirmation and measured scheduling fairness in the deeper pass. Existing product choices remain unchanged.
