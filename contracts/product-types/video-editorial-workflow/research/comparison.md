# Comparison — Video Editorial Workflow

## Scope of the evidence

Frame.io documents media review; Premiere sheds light on editing exchanges;
Nextcloud provides an example of handling local and remote states. A single
product per behaviour is not enough to establish market convergence.

## Observed behaviours

- Frame.io attaches feedback to a frame by timecode and allows an annotation
  (`OBS-VEW-009`). This informs attributed, contextualised notes, without
  imposing that interface.
- Frame.io distinguishes comparing two media from individual playback and lets
  the commented media be targeted (`OBS-VEW-010`).
- Adobe documents limits of EDL exchange and the timecode and clip-name
  information (`OBS-VEW-011`). A promise of fidelity must therefore be
  verified in the receiving environment.
- Adobe documents EDL and XML export (`OBS-VEW-012`). This proves neither their
  import into another application nor the conformance of a particular file.
- Nextcloud keeps conflicted states and asks for an explicit resolution
  (`OBS-VEW-013`). This behaviour informs a possible synchronisation
  extension; it does not impose offline operation on the core.
- Nextcloud makes synchronisation, pause, lost connection and error visible
  (`OBS-VEW-014`). These states are relevant for profiles that actually offer
  synchronisation.

## Contract choices

Contextualised editorial notes are a desirable capability. Transparency about
the format, the limits and the acceptance check of the handoff is a quality
target. Provenance, persistent selection, processing states and control of
authorised outputs are explicit choices of the core; the public sources
present do not yet demonstrate these complete guarantees.

Offline synchronisation and its conflicts remain a possible extension. The
research justifies neither a particular architecture nor a retention policy
common to all organisations.

## Open questions

- Diversify the comparative sources and observe the working gestures in several
  production contexts.
- Complete the research on assistance and transmission authorisations.
- Define a generic conformance set and verifiable evidence per scenario.
- Let each project specify its policies, its target performance and its
  editing formats, then validate them in its real environment.

These questions concern the product family. A client's decisions do not
condition the stabilisation of the shared contract.



## Corpus refresh — 2026-11-01

See the [dated refresh review](README.md#corpus-refresh--2026-11-01) and
[source-by-source impact record](refresh-2026-11-01.json).

Frame.io single-frame annotation and two-asset comparison passages still support OBS-VEW-009/010. Nextcloud hashes match. Both Premiere sources return HTTP 403 to the native verifier; their previous URL/date/hash records are retained. A separate browser read reaches the official pages and supports direct EDL/XML export, but its response is not an exact-byte native hash verification. It also exposes a qualification needed for OBS-VEW-011: the page says common transitions, frame holds and speed changes translate well, while recommending simple projects without nested sequences and noting merged clips separate in the target application. The historical broad limitation must not be presented as freshly confirmed.

Baseline obligations are unchanged. Deferred follow-up: Resolve native Premiere retrieval and then correct/review OBS-VEW-011 with a new attributable snapshot. QA-VEW-005 still requires target-environment evidence; do not claim verified EDL fidelity or promote the contract. Expand comparable editorial workflows and run actual handoff fixtures in the later deepening pass.
