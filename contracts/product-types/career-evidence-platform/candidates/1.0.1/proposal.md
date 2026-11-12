# career-evidence-platform 1.0.1 — validation profile reference

Date: 2026-11-12. Status: **proposed**; contract maturity **candidate**, format **0.1**.
Owner: repository agent. Decision authority: Composed maintainer. This is the author's
proposed patch, not independent approval or stable promotion.

## What was wrong

Contract 1.0.0 strengthened REQ-CEP-063 and REQ-CEP-064 and added ACC-CEP-023 and
ACC-CEP-024. Its `delivery.validation_profile` still named
`career-evidence-platform/conformance` version **0.1.0**. That profile targets contract
0.1.0 and has no case for the two added scenarios, so a 1.0.0 implementation was pointed at
a judge that could not judge it.

## What changes

| Field | Before | After |
| --- | --- | --- |
| `version` | 1.0.0 | 1.0.1 |
| `delivery.validation_profile.version` | 0.1.0 | 1.0.0 |
| traceability `contract_version` | 1.0.0 | 1.0.1 |

Nothing else changes. Every clause, identifier, acceptance case and traceability link is
byte-identical to 1.0.0, as the [exact record](changes.json) states. The
[native impact report](impact.json) is conservative: it marks every clause as affected by a
contract-context change, because the delivery section changed, without any clause text changing. Profile 1.0.0 lives in the validation
repository, extends the 0.1.0 suite unchanged and adds one case for each added scenario.

## Compatibility and migration

This is a patch: the profile reference is delivery evidence, not product behaviour, and it
adds no obligation that 1.0.0 did not already state. The 1.0.0 package is archived byte for
byte under [history/1.0.0](../../history/1.0.0/README.md). Existing pins and evidence stay
attached to their original bytes; no proof transfers. An implementation adopting 1.0.1
pins the new contract bytes and runs the complete 1.0.0 profile. No Build Kit change.
