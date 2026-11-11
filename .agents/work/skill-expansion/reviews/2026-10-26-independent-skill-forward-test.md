# Independent forward-test findings

Mode: an independently delegated agent applied each requested skill directly to the raw request. No intended answer, suspected bug or parent conclusion was used. No subagents were spawned. Repository access was read-only; all generated artifacts are under this temporary directory. This is a behavioural exercise producing real answers/plans, not a regex check of skill wording.

## Observed outcomes

- `data-migrations-plan.md` and `data-migrations-validation.md`: produces additive coexistence rather than direct rename; explicitly handles old-only and new-only writes, inherited NOT NULL, conflicts, concurrent writes, restartable backfills, semantic integrity, delayed contraction and recovery. Does not conflate a plan with production authority or a tested migration. Missing server version/capacity/recovery evidence remains visible. Current PostgreSQL official documentation was actually consulted, with links and date in the plan.
- `market-research-answer.fr.md`: computes A at 120 €/month conditionally and keeps B's 100 €/month conditional on covering all 12 users. Separates the supplied undated claims from arithmetic and assumptions. No fabricated URLs, current-price claims, product inspection or customer demand. Produces an evidence-limited recommendation, confidence and decision-changing observations without treating missing browsing as a reason to invent facts.
- `refactoring-next-actions.md`: stops the repeated speculative adjustment, preserves user changes, distinguishes ownership from diff-to-HEAD, routes diagnosis to systematic-debugging, proposes a falsifiable experiment and prevents claiming a successful refactor while the regression is unresolved. No blanket reset or unauthorised production action is proposed.

These outcomes support the intended safety and decision boundaries for these three requests. No concrete material defect was demonstrated in these executions.

## Bilingual semantics

Read both EN/FR files for data-migrations, market-research and refactoring. Frontmatter names/versions and capability boundaries agree. Material invariants correspond: production authority, compatibility, concurrency/restart, evidence versus claims, conditional pricing, preservation of user changes, diagnostic routing and closure gates.

One minor wording ambiguity: refactoring FR says « reprends seulement les modifications identifiées de l'agent si c'est sûr » where EN says “recover only the agent's identified changes when safe.” « Reprends » can suggest resuming or reworking changes rather than recovering/reverting them. The surrounding no-reset/preserve-work text helps, and the tested EN outcome did not demonstrate unsafe behaviour. This is a translation clarity observation, not a proven behavioural defect or a reason for a broad policy change.

## Exact evidence inspected

Source snapshots and SHA-256 hashes are listed in `source-manifest.json`. Inspected paths:

- `<home>/.codex/RTK.md`
- `<home>/.codex/skills/.system/skill-creator/SKILL.md`
- `<repo>/build-kit/skills/support/data-migrations/SKILL.en.md`
- `<repo>/build-kit/skills/support/data-migrations/SKILL.fr.md`
- `<repo>/build-kit/skills/support/market-research/SKILL.en.md`
- `<repo>/build-kit/skills/support/market-research/SKILL.fr.md`
- `<repo>/build-kit/skills/core/refactoring/SKILL.en.md`
- `<repo>/build-kit/skills/core/refactoring/SKILL.fr.md`
- `<repo>/build-kit/skills/support/systematic-debugging/SKILL.en.md` (relevant routed skill)
- `<repo>/build-kit/docs/runtime-capabilities.md`
- `<repo>/build-kit/skills/catalog.json` (focused routing/artifact/gate excerpts)

`rg` discovery also returned matching lines from build-kit README and docs; those were context for locating runtime gates, not full document reviews. `build-kit/AGENTS.md` was attempted and does not exist. The root repository instructions were supplied in the user context.

## Limits

One English migration plan, one French comparison, one English next-actions answer. Pairwise translation inspection is not a separate behavioural execution in the opposite language. No real service, tests, failing assertion or migration history were supplied. No PostgreSQL instance/rehearsal, actual consumers, production writes or recovery was exercised. The market request explicitly had no browsing; no external market research was performed for it. Official PostgreSQL docs were consulted only for the separate migration request. No runtime installation, invocation routing, multi-runtime compatibility or full skill suite was tested. This independent pass did not edit source or validate unrelated skills.
