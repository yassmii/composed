# Comparison and design decisions

Documentary research of 24 October 2026. Revisions and fingerprints are in
[sources.yaml](sources.yaml), findings in [observations.yaml](observations.yaml).
This is not an effectiveness benchmark; the scopes of the tools differ.

| Reference | Limited finding | Proposed consequence |
| --- | --- | --- |
| [Agent Skills](https://agentskills.io/specification), OBS-ADH-001/016 | Format and progressive loading of skills. | Composable skills, without imposing this format on the product. |
| [Matt Pocock](https://github.com/mattpocock/skills/tree/5beb35b040e3de97e54fa9e386d7e42d15c295c2), OBS-ADH-002/003 | Small skills, configuration and prior questioning. | User control and proportionate adoption. |
| [Superpowers](https://github.com/obra/superpowers/tree/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b), OBS-ADH-004/005 | Design, plan and delegated development with review. | Multi-agent work and gates are not enough to establish a differentiation. |
| [Spec Kit](https://github.com/github/spec-kit/tree/67e0f7294e6e728ab60bf7b4590deb470448bc2d), OBS-ADH-006 | Processes and extensions, including events. | Separate process and integrations without multiplying phases. |
| [ECC](https://github.com/affaan-m/ECC/tree/90606c8315ee09cafc303515c5f33024db6b9882), OBS-ADH-007/008 | A blocking pre-check and a post-edit diagnostic have different effects. | Qualify and test each guarantee. |
| [ECC evaluation](https://github.com/affaan-m/ECC/tree/90606c8315ee09cafc303515c5f33024db6b9882/docker/gateguard-effectiveness), OBS-ADH-009/010/015 | Behavioural trials, counter-examples and fingerprints. | Test results and judge, publish costs and limits. |
| [ECC learning](https://github.com/affaan-m/ECC/blob/90606c8315ee09cafc303515c5f33024db6b9882/skills/continuous-learning-v2/SKILL.md), OBS-ADH-011 | Learned rules with project scope and promotion. | Do not automatically generalise a local preference. |
| [ECC contract-first](https://github.com/affaan-m/ECC/blob/90606c8315ee09cafc303515c5f33024db6b9882/skills/contract-first/SKILL.md), OBS-ADH-012 | Verification of consumer/provider interfaces. | Distinguish product contract, interface and delivery evidence. |
| [W3C PROV-O](https://www.w3.org/TR/2013/REC-prov-o-20130430/), OBS-ADH-014 | Attribution, derivation and invalidation. | Graph provenance without imposing RDF, OWL or a storage. |

## Explicit trade-offs

The native policy that is mandatory for certain tasks in Composed 0.5.1 remains
a choice of that implementation. The generic contract requires a real delegation
when it is required or claimed, without a fixed number or provider for every
task. A document is not enough to demonstrate the conformance of the baseline.

The sources do not establish a complete loop of research, graph, cross-project
evaluation, correction and delivery. This breakdown is an explicit choice:
modular, under the authority of the projects, to be evaluated before any claim of
benefit. A materialised graph remains to be designed; the logical model does not select
an infrastructure. Thresholds, scope and authority boundaries are choices of
this contract, identified in the traceability.

## Open questions

- Which independent cases isolate the effect of the method from that of the model?
- Which guarantees does each runtime/version/mode actually enforce?
- What coordination cost is acceptable per category of work?
- Which queries justify a shared index beyond files?
- Which measurements explain a failure without exporting the project's data?
- How to distinguish the freshness of a source from the value of a requirement?

These questions feed the [continuous research](../../../docs/continuous-evolution.md),
with no implicit mandate for collection, infrastructure or deployment.


## Corpus refresh — 2026-11-01

The changed Claude hooks reference still distinguishes before/after-tool events and task/subagent decision powers (OBS-ADH-013). New notes record that FileChanged is after-effect and that internal agents can produce SubagentStop. These limit what a hook log can prove. REQ-ADH-009/022 and POL-ADH-003 already require actual runtime capability evidence; no new mandatory clause is introduced.

Exercise native prevention bypasses, errors, timeouts and internal-agent controls on identified runtimes; compare newer upstream pins and evaluate costs independently. The pinned Build Kit 0.5.1 retrofit is historical and is not refreshed or certified by this pass.

See the [source-by-source record](refresh-2026-11-01.json) and [original manifest](history/sources-before-refresh-2026-11-01.yaml). Owner: repository agent; decision authority: Composed maintainer. This manual bounded corpus update does not survey newer upstream pins, change normative bytes, promote research maturity or execute product cases. Historical body differences remain unknown. The deeper pass is deferred.
