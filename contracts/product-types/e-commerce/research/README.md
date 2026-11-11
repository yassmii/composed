# E-commerce research

Updated 2026-11-01 at the maintainer's request. Owner for this pass: repository
agent; decision authority: Composed maintainer. This is a bounded update of the
existing family. A separate deepening pass is deferred, not completed here.

Questions: cart estimates versus accepted purchase; stock holds versus paid
commitments; duplicate, delayed or unverified payment; refund request versus
actual reimbursement.

Scope/budget: six official pages across Shopify, WooCommerce, Adobe Commerce and
Stripe, eleven observations, one comparison and one separate candidate. Stripe
supplies integration evidence, not a fourth comparable storefront. This is one
manual update; no recurring schedule is created. Revisit on an affected source
change or a maintainer-requested deepening pass.

All six bodies were retrieved and read. SHA-256 uses the repository verifier's
retrieval/normalisation rules. WooCommerce's article-text hash and Adobe's body
hash match the original records. Shopify's old HTML hash was already reported
changed; its current official Markdown was reviewed instead. Stripe URLs select
English explicitly to avoid locale-dependent snapshots. Current documentation
does not establish deployed product versions. The [original manifest](history/sources-2026-10-14.yaml)
is preserved byte-for-byte; old bodies are unavailable, so an exact historical
behavioural diff is unknown. OBS-COM-001–004 were rechecked and retained.

Deferred: independent review; alternative payment providers; backorders and
multi-location stock; partial shipments/refunds and returns; disputes;
accessibility; tax/rounding/discount rules and declared performance workloads.
These are future research inputs, not new mandatory modules. All twelve candidate
product cases remain not_run without an implementation.
