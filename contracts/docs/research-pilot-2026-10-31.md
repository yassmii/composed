# Research refresh pilot — 2026-10-31

Scope: one existing family. All ten baselines declare draft status, format 0.1,
and initial research. Counts below come from the checked-in YAML at session start
(except the explicitly shown booking additions). They measure declared artifacts,
not their truth, test execution or product conformity. The structural traceability
check covers core capability/requirement/invariant/policy/quality IDs; it cannot
establish semantic sufficiency. This inventory is a targeted triage, not a full
review of all ten families.

| Family / baseline | Sources / observations | Core trace links | Requirements / acceptance | Precision and acceptance triage |
| --- | --- | --- | --- | --- |
| 3d-engine / 0.2.0 | 4 / 4 | 32 | 13 / 10 | Bounded draft; rendering and lifecycle provenance gaps are already recorded; reference hardware/workload still needed. |
| agent-os / 0.2.0 | 15 / 30 | 62 | 32 / 18 | Detailed scheduling, mediation and recovery clauses; quantified reference-workload targets; independent promotion review pending. |
| agentic-delivery-harness / 0.1.0 | 12 / 16 | 70 | 37 / 24 | Broad delivery and authority corpus; draft is retrofitted from a pinned baseline, whose conformance is not established. |
| career-evidence-platform / 0.1.0 | 18 / 21 | 107 | 65 / 22 | Extensive permission, lineage and quality clauses; acceptance thresholds explicitly unvalidated by implementation. |
| collaborative-workspace / 0.1.0 | 30 / 25 | 150 | 84 / 22 | Large security/offline/convergence surface with declared reference workloads; needs a longer scoped review. |
| e-commerce / 0.1.0 | 3 / 4 | 14 | 4 / 2 | Small draft; payment and order-access research gaps already recorded; sparse acceptance makes it a suitable next pilot. |
| git-backed-cms / 0.1.0 | 28 / 35 | 47 | 25 / 12 | Concrete repository/revision targets and clean-room reading; draft's independent review remains pending. |
| prospecting-workspace / 0.1.0 | 21 / 29 | 103 | 57 / 32 | Broad discovery, qualification, access and recovery scope; quantitative targets need their declared workloads and populations. |
| saas-booking / 0.1.0 | 4 / 4 → 8 / 11 | 14 | 4 / 2 | Single-product initial research, broad atomicity wording, insufficient boundary/payment acceptance; selected pilot adds a separate 1.0.0 candidate with 12 cases. |
| video-editorial-workflow / 0.3.1 | 6 / 6 | 34 | 14 / 7 | Explicit profile/environment evidence and prior provenance cleanup; native editor verification remains a distinct task. |

No baseline has format-0.2 acceptance links; counts alone cannot establish complete
clause coverage. Three research READMEs originally said research had not started
(booking, commerce, engine) despite populated manifests. Only the booking README
is corrected in this pass; unrelated families remain untouched.

Booking was selected for its four requirements, two initial acceptance scenarios,
and bounded capacity/payment question. It permits a complete documentary refresh,
a concrete versioned draft, migration analysis and author review in one session.
The broader families would encourage superficial research within this budget.
Read the [pilot entry point](../product-types/saas-booking/README.md) for results.

A third product and live implementation proof remain promotion work, not claims
made by this research pilot. Next recommendation: **e-commerce**, starting with
payment confirmation, stock reservation and repeated or delayed provider events.
Do not generalize this pass automatically or add a new family.

## Follow-up — 2026-11-01

The inventory above remains the historical triage. Booking and 3D now have separate
1.0.0 candidates; see their family entry points. At the maintainer's request, the
[e-commerce update](../product-types/e-commerce/README.md) follows with six current
sources, eleven observations, six requirements and twelve acceptance cases in its
own candidate. The 0.1.0 baseline remains unchanged. Independent review, product
execution and a deeper research pass remain pending. No catalogue-wide refresh is
claimed and no new product family is introduced.

The later [normative update pass](contract-updates-2026-11-01.md) adds separate
1.0.0 candidates for the seven remaining families, with 18 strengthened clauses
and 14 additional cases. The inventory above remains historical; baselines and
consumer pins remain unchanged and deeper research stays deferred.
