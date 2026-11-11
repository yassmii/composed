# Review: initial research revision

Mode: **self-review by the author**. This is not an independent review.

Status: **draft internally checked; independent review and promotion decision pending**.

- Traceability covers every capability, requirement, invariant, policy, and quality attribute. Each clause is either linked to observations or labelled `explicit_project_choice`, and each combined basis carries a note stating which part is a choice.
- "Agent OS" is defined as an operating layer over a host OS (POL-AOS-001), following AIOS. Hardware kernels, boot, and drivers are out of scope.
- The mediation boundary, human confirmation of risky actions, validation before execution, sandboxed execution, scoped memory, secret masking, event logging, and budgets are supported by the sources.
- Deliberate choices: deny-by-default for every capability (POL-AOS-002), the default confirmation matrix (POL-AOS-003), runtime-owned risk classification (POL-AOS-005), approvals bound to exact inputs (REQ-AOS-018), at-most-once execution (INV-AOS-007), declared capabilities in agent definitions (REQ-AOS-029), and the fairness and overhead targets (QA-AOS-002, QA-AOS-006).
- The contract diverges from OpenHands' default, which takes risk from the model's own label (OBS-AOS-016), and from AIOS's silent fail-open read after a write-barrier timeout (OBS-AOS-014).
- No language, framework, model provider, tool protocol, container technology, or hosting provider is prescribed. MCP is used as evidence for the tool boundary, not as a required protocol (POL-AOS-004).
- Deferred and out of scope: hardware kernel, model training, agent marketplace, cross-device synchronisation, desktop or computer-use control, billing, and retention or erasure of events and memory. Three of these are named as extensions.

## Revision 0.2.0: implementation feedback

Source: feedback from the `agent-os` implementation repository after its first increment (2026-10-12). It is delivery evidence, not product research, so it is recorded here rather than in `research/`. Each change is labelled a contract choice in `traceability.yaml`.

- **R1, REQ-AOS-003 (clarification).** Only a request that had started executing is marked indeterminate. A request that had not started is marked failed as not executed. The glossary defines "started executing" as the durable record made before the target is invoked. ACC-AOS-007 now covers both cases.
- **R2, INV-AOS-005 (narrowed).** Masking cannot recognise a secret that a program has transformed. The invariant now covers secret values and the encodings each implementation declares it detects. New REQ-AOS-031 and ACC-AOS-017 cover the remaining risk: secret-bearing output reaches the model only after the principal approves. This weakens a 0.1.0 guarantee, which is why the version is a minor bump on a pre-1.0 draft rather than a patch.
- **R3, measurement terms.** The glossary now defines "reference workload" and "reference hardware". Each implementation fixes and publishes them with its evidence. The workload must cover every must capability and run at least four concurrent processes.
- **R4, rights.** Only the principal can approve; delegated approval is excluded from the core (REQ-AOS-032). An operator can deny a pending action but never approve it (ACC-AOS-018). A process can always read its own event history; this exception to POL-AOS-002 cannot be widened or delegated (REQ-AOS-010).
- **R5, feasibility (no change).** Tracked below: suspending a generation depends on the model provider (REQ-AOS-009, QA-AOS-002), filtering the network per destination needs a mediated proxy (REQ-AOS-019), and recording sandbox escape attempts needs kernel-level auditing (ACC-AOS-010).

Before promotion:

- Add a second agent OS reference beyond AIOS. AIOS's access manager is described in its paper but not found in the repository at the inspected commit.
- Get evidence for, or keep as a choice, the fairness bound in QA-AOS-002 and the 50 ms mediation overhead in QA-AOS-006.
- Define the `aos.retention` extension, because INV-AOS-006 forbids removing events.
- Decide whether a delegated-approval extension is needed, now that REQ-AOS-032 excludes it from the core.
- Assess confirmation fatigue: unclassified actions from untrusted tool providers, and now secret-bearing outputs, always need confirmation.
- Confirm with implementation evidence that REQ-AOS-009, REQ-AOS-019, and ACC-AOS-010 are feasible on the isolation providers in use; otherwise narrow them.
- Obtain a fresh-session independent review before promotion.

All sources are raw files pinned to exact commits or a versioned arXiv PDF, so their SHA-256 snapshots should stay stable under `npm run verify:research`.
