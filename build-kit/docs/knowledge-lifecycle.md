# Durable knowledge without a second product database

Keep requirements, product decisions and observed product learning in their established canonical
documents, normally `docs/`. Memory contains durable operating context or concise pointers to those
sources. Work records contain actual delivery evidence and active handoffs. An accepted implementation
or a passing test is not proof that the product hypothesis succeeded.

## Promote only what the next session needs

Before adding a note, ask whether a future session would otherwise repeat a material mistake or miss
a useful source. Existing documentation, current code and Git history usually suffice. A transient
status update or a copied product decision does not become durable merely by moving it into memory.

For a useful operating claim, record enough provenance to reassess it:

- the rule/fact or source pointer and the context where it applies;
- the observation/source and when it was last checked;
- a concrete review trigger, such as a changed interface, command, role or source decision;
- the owner able to resolve an uncertain or conflicting claim when that matters.

These can be short body fields, not a mandatory new YAML schema. Existing notes remain valid inputs;
do not rewrite every legacy file. A verification date records a past observation, not a promise of
current truth. Keep hypotheses and unverified inferences explicitly labelled. Never store credentials,
private user data or an entire tool transcript merely to make provenance look complete.

## Human lifecycle

| State | Treatment |
| --- | --- |
| Active | The claim is applicable within its stated scope; index it if useful. |
| Needs review | A source changed, a trigger fired or applicability is uncertain; verify before relying on it. |
| Superseded | Link the replacement and preserve historical context where useful; remove the old active index entry. |
| Archived | Keep only when history has value; omit it from the active index. |

These are human decisions, not states inferred automatically from prose. A file's age alone does not
make it false, and an existing link does not make it true. Preserve historical decisions/evidence;
change the active pointer rather than silently rewriting a past acceptance or review.

## Resume an active work item

Read the memory index, the relevant note, its canonical source and the linked handoff's actual current
state. Inspect only the evidence needed for the next action. Recheck mutable claims against current
code/configuration before acting. Preserve decisions already made, distinguish open decisions from
established ones, and record contradictions as a review need rather than merging incompatible claims.

An active cross-session note may contain one compact pointer, status and next owner, for example:

```markdown
Invitation flow awaits independent review — next owner: delivery-review.
Source: [current handoff](../work/invitations/handoff.md).
```

Do not copy the handoff, review, acceptance results or product decision into memory. Close/remove the
pointer when work closes. A resumed session reads the handoff rather than trusting an older pointer's
status. Keep the evidence files and their named review history in place.

## Read-only local checks

From a project, invoke the reviewed Build Kit checkout:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs knowledge check --json
```

`--cwd` selects another existing ordinary project root. The checker writes no files, fetches no URLs,
executes no recorded command and does not require a Build Kit installation record. `doctor` remains
an installation diagnostic; this command separately inspects `.agents/memory/MEMORY.md` and flat
Markdown notes directly linked from that index. It does not recursively traverse note links or scan
the repository. All indexed notes are considered regardless of human lifecycle status.

Supported single-line inline relative links, such as `[source](../../README.md)`, are checked for
ordinary-file presence within the project. Existing directory targets, outside/unsafe destinations,
symlink components and unreadable files block the check. Note files must be directly in
`.agents/memory/` and end in `.md` to have their contents read. Other local links are checked only for
file presence. Target files are not read merely because a note links to them.

For `[decision](../../docs/decisions.md#d-014)`, file presence is checked but the anchor remains
unverified. HTML comments, frontmatter and fenced/inline code examples are ignored. Wiki links,
reference-style definitions/links, images, remote links and query destinations are recorded as
unverified. This deliberately narrow Markdown subset does not interpret bare reference shortcuts,
multiline destinations or unusual escaped/nested syntax. An unsupported destination is not a verified
link. No YAML schema, lifecycle status, review date or semantic freshness is parsed.

Bounds: 64 indexed notes plus the index; 64 KiB per read file, 1 MiB total content, 128 links,
1024 characters per destination and 32 resolved path segments. Limits, invalid UTF-8, unsafe paths,
unclosed frontmatter and filesystem failures block incomplete coverage. Files/links actually checked,
unverified links and limits appear in the report. Root entries cannot be symlinks; ancestor aliases
are canonicalised and the actual project root is reported. Filesystem identity/link checks are
conventional protection, not an adversarial race-proof sandbox.

`status: passed` and exit 0 mean the supported checks completed without structural findings. A missing
index, broken source or coverage failure gives `status: blocked` and exit 1. Invalid arguments/root
fail before inspection. `semantic_freshness: not_assessed` always remains explicit: even a report with
zero unverified links cannot certify that a claim is correct, current or approved.

## Synthetic stale-note example

An older operating note says the validation command is `./old-check.sh` and links the README. Its
review trigger is a change to the documented validation entry point. The current README instead names
`./verify.sh`; an active work pointer still links a handoff whose latest state is ready for review.

The structural checker can establish that the README/handoff files exist. It cannot determine that
the command changed or that the older pointer's status is stale. The resumed agent reads those
current sources, marks the operating claim needs-review, follows the authorised current command and
records its actual result. It updates only the operating note/pointer as warranted; the product
decision remains in its canonical document. This example is illustrative, not observed user research
or a claim that either command was executed.

## Updating installations

The memory index and format guide are initial seeds: updates preserve existing user-owned copies.
This maintained guide lives in the reviewed kit checkout; generated doctrine carries the essential
ownership/resumption rules to refreshed installations. Review useful guidance selectively rather
than overwriting existing notes or assuming an update migrated their schema.
