---
name: product-research
description: Research comparable software products from primary sources and record versioned, attributable observations for a Composed Contract product type.
---

# Product research

Use this skill when gathering evidence for `product-types/<type>/research`. It is not a contract-writing skill.

Prefer official documentation, source repositories, release notes, and first-party technical material. Record the exact URL, product version, retrieval date, and the narrow observation supported by each source. Separate observable facts from interpretation.

Write atomic observations: one behaviour, lifecycle rule, constraint, or architectural decision per item. Compare products only after observations have been captured. When products diverge, preserve the divergence rather than manufacturing a universal rule.

Do not select an implementation language, framework, vendor, or architecture for a consuming project. Flag missing evidence and unresolved questions for the contract author.

For ongoing research, follow `../../docs/continuous-evolution.md`: declare questions,
source scope, cadence and budget; preserve changed or contradicting snapshots;
identify affected observations and clauses. A new source triggers investigation,
not automatic adoption or modification of a pinned contract.
