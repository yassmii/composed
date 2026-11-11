# Build Kit skill expansion

Scope: implement the agreed first batch only: strengthen engineering, automated testing and refactoring; add security-review, systematic-debugging, api-contracts, data-migrations, release-engineering and market-research. Standardise five existing technical skill names and update current consumers. Later accessibility, performance, operations, design-system, user-research, product-experiments and agent-evaluation remain deferred.

Delivery artifacts affected: bilingual skill entrypoints, skills/catalog.json, update migrations, generated bridge indices/Cline mirrors, behavioural scenarios, contribution/install documentation and component release notes. Product contracts and runtime implementation are unchanged.

Plan: preserve immutable legacy skill references; author bilingual skills; wire catalogue and current references; migrate unchanged installed legacy directories only after replacement installation, preserving custom content and --keep-local; add migration/integration regressions and behavioural scenarios; run component checks and independent forward-testing under skill-creator.

Canonical names: technique -> software-engineering; test-generator -> automated-testing; refactor -> refactoring; retrofit -> codebase-onboarding; doc-generateur -> technical-documentation. Keep qa and product skill names in this batch.

Validation: Build Kit tests/typecheck/lint, validate:agentic, fixture plumbing, FR/EN sandbox installation, update from legacy canonical files and Cline mirrors including custom content, repeated update and dry-run. Fixture results are not behavioural compliance evidence.
