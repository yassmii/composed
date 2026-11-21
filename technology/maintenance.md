# Maintain the reference

## Ownership and cadence

The Composed repository maintainers own the review queue; `review_owner` names that role on each
entry. This is a repository responsibility, not an assertion that someone already accepted a review.
The maintainer merging a content change records their review in the PR and is accountable for it.

- Weekly: the source watch checks configured official release, security and support pages. It
  emits a dated JSON/Markdown proposal listing changed, new, unchanged and failed observations.
- Monthly: review due/affected entries, prioritize security/support changes, verify capabilities,
  dependencies and license findings, update the affected studies, and record the change.
- Quarterly: reassess the two comparisons against current contract revisions and realistic project
  feedback. Expand coverage when repeated decisions reveal a missing alternative.
- Before use: recheck facts decisive for the project. A monthly date is not a security guarantee.

## Monitoring is not review

`npm run watch:technology` compares SHA-256 content observations against `watch-baseline.json`.
Changes to page furniture can cause false positives; unchanged pages can miss an upstream change.
HTTP failures are `unavailable`, never unchanged. The watcher is not a vulnerability scanner or a
complete release-feed parser. Project lockfiles still need their own dependency security monitoring.
It does not execute downloaded content, change catalog claims, create issues, send messages, or
accept versions. Its report contains review proposals, not approved recommendations.

The first run without an observation produces `new` items. After inspection, copy the generated
`technology/reports/watch-baseline.candidate.json` to `technology/watch-baseline.json` in a reviewed
change. The baseline only acknowledges observed bytes; it never refreshes catalog review dates.
Failed sources retain their prior observation and remain flagged for retry. Sources newly added to
the watch remain new until a baseline is accepted. Review exact source diffs where possible; a hash
alone cannot explain the content change. Do not accept an observation to suppress an unresolved risk.

The GitHub workflow runs Mondays and on demand. Reports appear as workflow artifacts and a job
summary. A network failure fails the job after report generation. No write token is required and
no automatic commits are made. CI configuration is not evidence of a hosted run; inspect Actions
after merge. GitHub can delay or disable scheduled runs, so maintainers must check the queue monthly.

## Content review

1. Read primary sources and affected claims, including support/security notices and licenses at the
   selected revision. Mark unverified facts explicitly; do not infer compatibility from recency.
2. Distinguish upstream documented facts, local judgment, and executed evidence. Preserve source
   URLs and version scope; avoid unsupported comparative performance assertions.
3. Update only the reviewed entries' dates, next review (normally within 30 days), unresolved gaps,
   and relevant studies. Source retrieval alone never advances `reviewed_on`.
4. Run `npm run validate:technology` and `npm run test:technology`. Use strict freshness when preparing
   a current recommendation; stale historical snapshots remain readable.
5. Bump this component's version and CHANGELOG when publishing changed content. Breaking schema or
   protocol changes require a major version after 1.0; added coverage is minor, factual corrections
   patch. Keep contract and Build Kit releases independent and retain prior decision pins.

## Initial state

The initial catalog is agent-authored, documentation-reviewed research dated 2026-11-18. It is not
human-approved research or a tested compatibility matrix. The initial watch baseline records the
successful HTTP observations made during implementation. Fiche review dates and baseline observation
dates are deliberately independent; baseline capture is not semantic approval of upstream changes.
