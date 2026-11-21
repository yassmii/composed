# Initial validation record

## Validation hardening — 2026-11-21

The seven technology tests passed, including rejection of removed native/WASM capabilities and
unsupported runtime evidence status. Strict freshness validation passed without warnings.
`npm run check` passed (Build Kit typecheck, contract validation/traceability and technology
validation); `git diff --check` passed for tracked changes.

The component study now declares its capability references in the manifest without pretending to
be a pinned product contract. Validation checks declared references; it does not exhaustively parse
all capability mentions in prose. Schema 0.1 accepts only `documentation-reviewed`.
This pass did not re-review the 20 cards' external sources, run benchmarks, refresh the observation
baseline or execute the hosted workflow. Research dates remain unchanged.

## 0.2.0 coverage extension — 2026-11-18

Added .NET/Rust ecosystems plus C, C++, assembly and WASM: 20 entries total. Catalog/reference/link
validation and the six technology tests passed after the extension. The network watch retrieved all
83 configured sources with zero unavailable; 44 new observations were added to the baseline while
preserving previous observations (existing changed sources are not silently acknowledged).
The new comparative statements are documentation-backed judgments, not executed compatibility or
performance tests. The previously recorded Build Kit results below were not rerun for this
technology-only extension. No hosted workflow execution is claimed.

## 0.1.0 initial checks

Local run on 2026-11-18. This records implementation checks, not product conformance or human
acceptance of the research. Skills used for delivery: product-manager, cadrage, technique and
test-generator; the agreed scope was a separate reference, initial catalog, two studies and upkeep.

| Check | Observed result |
| --- | --- |
| `npm run validate:technology` | No structural, reference, local-link or freshness errors |
| `npm run test:technology` | 6 tests passed, including invalid provenance/dates and failed-source handling |
| `npm run watch:technology` | 39 official source URLs retrieved; no unavailable sources; observation baseline captured |
| `npm run check` | Build Kit typecheck, contract validation/traceability and technology validation passed |
| `npm run test:build-kit -- --silent` | 267 passed, 3 skipped |
| `npm run eval:build-kit` | Catalog valid; 64/64 fixture scenarios passed (instruction fixtures, not live agent behavior) |
| `npm run lint:build-kit` | Passed |
| `npm run validate:lockfile` | Passed; no dependencies added |

The sandbox blocked the initial network watch and esbuild configuration read; both succeeded when
rerun with permission. Hosted GitHub Actions has not been executed for these local changes.

## Replay the user journey

1. Start from `docs/agent-how-to.md`, section 1. Follow the selection link, then the booking study.
   Expected: the recommendation names synthetic team assumptions, real clause IDs, three primary options,
   outstanding experiments and user-owned selection; no framework is inferred from the contract.
2. Read the collaborative study. Expected: Git remains canonical, projections are rebuildable,
   authorization is not credited to CRDT/WebSocket support, and no full coverage is claimed.
3. Run the three technology commands from the README. Expected: offline validation and tests pass;
   the watch writes reports and a candidate baseline without changing the catalog or committing it.
   A failed URL is unavailable, not unchanged. Inspect the report before acknowledging a new baseline.
4. Non-regression: existing contract checks and Build Kit tests above must continue passing. An
   established consumer stack is reused; catalog recommendations do not replace an accepted decision.
5. After merge, run the Technology source watch in GitHub Actions and inspect its artifact and job
   summary. Expected: a dated review proposal with source status and due reviews. This hosted step
   remains **not_run** until actually performed.

Limitations: no representative load benchmarks, dependency installation/compatibility experiments,
complete deployment license audits, or independent product-conformance checks were run. These are
explicit project decision gates, not outcomes supplied by the initial catalog.
