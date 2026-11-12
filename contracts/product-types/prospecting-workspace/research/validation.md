# File verification — 2026-10-23

This verification covers the documents of contract 0.1.0, not an
implementation of the tool. It is a dated record translated from French on
2026-11-12; its counts and status describe the 0.1.0 package and were not re-run for 1.0.1.

| Check carried out | Result observed |
| --- | --- |
| `npm run validate:contracts` from the root | Success: schemas, uniqueness of identifiers, actors and traceability for all the units of the repository, including `prospecting-workspace`. |
| Traceability of the new unit | 21 retrievable public sources, 29 observations and 103 capability, requirement, invariant, policy and quality clauses, each linked to observations or declared as an explicit choice. |
| New retrieval of the 21 sources | The 21 hashes match the recorded hashes, with the retrieval and normalisation functions of the common verifier. Check limited to this unit; no freshness verdict on the other families. |
| Acceptance references | All the clause references in `evidence` exist; the 57 requirements are covered by a direct reference or by their capability in the 32 scenarios. This documentary coverage does not prove that the scenarios are executable or passed. |
| Examples and local links | Readable YAML; mandatory criteria and referenced fields exist; three explicitly illustrative profiles with activation blockers; local Markdown links resolved. |
| Content review | Technical neutrality, target/contact person/record separation, qualification on evidence, unknowns, separate permissions, uncertain retries and limits of the research verified in the documents. |

The targeted hash check loaded the same `retrieve` and
`normalizeContent` functions as `contracts/scripts/review-traceability.mjs`, then compared
the retrieved contents with `research/sources.yaml`. It adds no new
permanent verifier to the repository. To redo the complete standard check:

```bash
npm run verify:research
```

The web readings of Salesforce and Apollo remain qualitative: no
usable raw content for the former, HTTP 403 for the latter. No failure
was masked by a fictitious hash. The Notion and local context is kept separate
from the retrievable public evidence.

None of the `ACC-PR-*` scenarios was run against a product. No load
test, application accessibility audit, user trial, real campaign
or qualification benchmark is provided by this file. The status of the contract
remains **draft** and the performance targets remain to be measured.
