# Documentary validation — 4 November 2026

Contract evaluated: `wealth-advisory@0.1.0`, format 0.2, status **draft**.
Environment: Linux Node 24.15.0, existing dependencies; no reinstallation.
Review by the author, with no independent review claimed.

| Check actually executed | Result |
| --- | --- |
| `npm run validate:contracts` | Success for the current contracts, candidates, archives and templates; traceability of the new family included. |
| `npm run test:contracts` | **70 tests passed**, zero skipped; includes the exact identities of the ten historical families and the provenances of their archives. |
| `npm run example:contracts` | Synthetic example passed: reference accepted, semantic counter-example rejected, modified checker stale and dependencies selected. No wealth product executed. |
| Static coverage | **45 normative clauses** explicitly linked to the **26 scenarios**; each capability and clause has a basis or an explicit choice. |
| Sources | The eight recorded hashes correspond to the bytes retrieved during the drafting. The historical AMF source remains explicitly set aside from the normative bases. |

The adaptation of the `candidate-integration.test.mjs` test names the ten families of the
integration batch of 1 November instead of treating every new family as part of that
historical batch. The ten checks remain required; no fictitious integration or
archive is created for the new draft.

The local provenance check bears on the bodies consulted in
`/tmp/composed-patrimonial-research-jbwn_cwx/`, which may disappear. The repository keeps
URL, date, known version, locator, hash and observation; it does not redistribute
the third-party bodies. No new network verification of the whole existing corpus.
Unpublished SaaS versions remain unidentified rather than inferred from a date.

The ACPR recommendation consulted by browsing could not be retrieved raw
(HTTP 403); no hash is fabricated. The limits and the remaining business
questions are in [comparison.md](comparison.md) and the [author review](../contracts/review.md).

**All the wealth cases remain `not_run`.** The numerical examples indicate
expected results, not results observed in an application. No external
validation profile, no executed tax model, no real advice and no client
observation is claimed. The software and schema checks do not replace
the review by a professional or the adoption decision of the owner.

## Translation to English as 0.1.1 — 12 November 2026

Contract evaluated: `wealth-advisory@0.1.1`, format 0.2, status **draft**; English
translation of 0.1.0 with no intended behaviour change. Everything above is the translated
record of the 0.1.0 validation and is not re-run evidence. Author self-review only.

| Check actually executed | Result |
| --- | --- |
| Structural comparison with the archived French YAML | Contract, traceability, observations and sources: identical keys, order, identifiers, links and non-prose values; only `version`/`contract_version` and prose differ. |
| Archive | The nine files under `history/0.1.0/` match the SHA-256 values listed in its README. |
| `npm run validate:contracts` | `wealth-advisory` contract, its archived 0.1.0 contract and its traceability reported OK. |
| `npm run test:contracts` | 70 tests: 69 passed, 0 failed, 1 skipped. This family is not part of the integration regression. |

No source was retrieved again and no hash changed. All 26 scenarios remain `not_run`.
