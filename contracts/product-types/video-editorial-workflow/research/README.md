# Research — Video Editorial Workflow

[Version française](README.fr.md)

This unit studies the preparation and review of video material, editorial
selection and the handover of a traceable editing package.

The shared base contains only public sources from Frame.io,
Adobe Premiere and Nextcloud, their versions, retrieval dates and
hashes, along with six attributed observations in `observations.yaml`.
Identifiers OBS-VEW-009 to OBS-VEW-014 are kept to preserve existing
references; retired identifiers are not reassigned.

Clauses that these sources do not demonstrate are explicitly declared
as product choices in `contracts/traceability.yaml`. A successful structural
validation is not enough to demonstrate their comparative grounding or
the conformance of an application.

The research remains at status `initial`. The comparison and open topics
are in `comparison.md` and the protocol in
[RESEARCH-PLAN.md](./RESEARCH-PLAN.md) (French). Each client's documents, observations,
datasets and constraints belong to the consumer project's repository,
which combines them with a version of the shared contract.


## Corpus refresh — 2026-11-01

Status: **partial — native Premiere retrieval unresolved**. This is a bounded update of 6 existing sources: 2 initial hashes unchanged, 2 changed and reviewed, 2 unavailable.

Frame.io single-frame annotation and two-asset comparison passages still support OBS-VEW-009/010. Nextcloud hashes match. Both Premiere sources return HTTP 403 to the native verifier; their previous URL/date/hash records are retained. A separate browser read reaches the official pages and supports direct EDL/XML export, but its response is not an exact-byte native hash verification. It also exposes a qualification needed for OBS-VEW-011: the page says common transitions, frame holds and speed changes translate well, while recommending simple projects without nested sequences and noting merged clips separate in the target application. The historical broad limitation must not be presented as freshly confirmed.

Resolve native Premiere retrieval and then correct/review OBS-VEW-011 with a new attributable snapshot. QA-VEW-005 still requires target-environment evidence; do not claim verified EDL fidelity or promote the contract. Expand comparable editorial workflows and run actual handoff fixtures in the later deepening pass.

[Source-by-source record](refresh-2026-11-01.json) includes previous/current hashes,
retrieval errors, dependent observations and affected clauses.
[Original source manifest](history/sources-before-refresh-2026-11-01.yaml) preserves prior records.
Old response bodies are unavailable: hash drift does not date or classify a historical
behaviour change. New observations are research inputs, with no automatic normative adoption.

Owner for this manual pass: repository agent; decision authority: Composed maintainer.
Budget: the recorded corpus and changed passages, with a second retrieval of changed
sources; no new provider survey, runtime experiment or background schedule. Revisit
on source drift or the requested deepening pass. Research maturity remains initial;
this author review does not promote a contract or certify an implementation.
Baseline contract/traceability bytes, consumer pins and Build Kit remain unchanged.
All product cases are not_run; existing proof is not transferred.
