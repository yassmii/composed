# Safe adoption and removal

Build Kit 0.7.0 prepares the complete desired-file plan before touching a project. Source templates,
skill metadata, destinations, case aliases and links are checked before a backup or installation write.
The target must already be a Git repository. The CLI uses the existing project stack; installation
does not choose a product stack or launch agents.

## Fresh or manual projects

Run from the consuming project, using the reviewed Composed checkout:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs init --agents=codex --lang=en --skills=core,support
```

Existing conflicting instructions, shared skills, Cline mirrors or catalog cause an error before any
project write. `--yes` accepts wizard defaults; it does not permit overwriting a conflicting file.
Case aliases such as Agents.md and linked destinations require manual reconciliation, including with
`--force`. Missing memory/work templates are created individually; existing context is preserved.

To deliberately replace conflicting regular files after reviewing them:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs init --force --agents=codex --lang=en --skills=core,support
```

Every conflicting target is copied byte-for-byte to an exclusive `.agents/backups/<id>/` directory
before replacement starts. `backup.json` identifies original relative paths and hashes. Check the
backup and merge the project-specific decisions into their canonical sources before starting a session.
Backups may contain private instructions. The CLI does not export them or edit the host's ignore rules;
they are ordinary untracked files until you exclude them. Add `.agents/backups/` to the host
`.gitignore` if appropriate, or to `.git/info/exclude` for a local-only exclusion. Inspect
`git status --short --untracked-files=all` before staging. "Local backup" does not mean "Git-ignored".

## Managed baselines and updates

`.agents/.composed-kit-manifest.json` records paths and SHA-256 hashes of the last generated managed
files. It covers bridges, shared skills, catalog, selected Cline mirrors and installation records.
Memory, work evidence, arbitrary resources and user-home mirrors are outside removal ownership.
This is local lifecycle metadata, not an authenticated approval, security boundary or sandbox.

An ordinary update replaces missing or unchanged managed files. A locally changed or unrecognised
conflicting file stops the operation before writes. Choose one of:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs update --keep-local
node /path/to/composed/build-kit/bin/composed-kit.mjs update --force
```

`--keep-local` retains existing shared/native skill files and conflicting custom managed files,
including bridges/catalog. Unchanged bridges can still refresh. Retained files keep their previous
generated baseline; unowned custom files remain unowned. They are never adopted as disposable output
merely because they were retained. This can leave older policy/language in retained files; doctor
reports drift for manual review. `--force` backs up and replaces conflicting regular files.

Add `--skills=support` to include all specialist workflows. Levels remain additive. Dry runs prepare
a complete plan without changing files, manifests, backups, mirrors or installation records, even when
ordinary file conflicts block application:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs update --dry-run --json
```

The versioned JSON report lists writes (including manifest changes), conflicts, retained seeds/local
files, legacy skill/bridge retirements with reasons, conditional backup paths, source provenance and
external actions. `backups.authorized` is true only with `--force`; conflicts do not themselves
authorize replacement. A blocked preview exits 1 while still emitting its complete report.
Application with JSON requires `--yes`; no interactive prompts contaminate JSON. Invalid options,
unsafe paths or unreadable source remain hard errors. Apply rechecks all inspected destinations before
backups/writes; concurrent changes or later I/O failures can still produce partial application.
Mutually conflicting flags and unknown flags are rejected.

### Installations before managed manifests

A legacy installation has no reliable baseline for arbitrary edited files. Exact current-source
equality is recognised, but a generated footer or healthy doctor is insufficient proof of no adaptation.

1. Record the source with `source --json` and inspect project rules, installed configuration and local
   diff. Compare old bridges/skills with reviewed historical templates when available.
2. Run `update --dry-run --json` without force. Review every conflict, proposed retirement/retention
   and outside-project action. Nothing has been adopted or removed yet.
3. Explicitly transfer necessary local bridge rules to `.agents/project-instructions.md`, or retain
   them in canonical documents referenced there. Preserve the exact old bytes.
4. Exclude `.agents/backups/` locally before staging, then use the reviewed `--force` for backed-up
   replacement or `--keep-local` to retain old files. The latter can leave old doctrine and is not a
   complete upgrade. Installed agents are preserved; `--agents` does not reconfigure update.
5. Verify `backup.json` against original bytes, inspect retired files/replacements and retained
   customizations, merge guide changes manually, run doctor and project-native checks, then start a
   fresh agent session. Keep product/contract pins separate from delivery-method provenance.

Installation metadata can remain old/unowned with keep-local and require reconciliation.
Old skill names still migrate only when their exact historical contents are recognised and replacements
are installed. CRLF is normalized for recognition. Trailing-space-only differences are reported
specifically and preserved for review: Markdown trailing spaces can encode a hard line break.
Modified old skills/resources stay intact. See [skill migration](skill-catalog.md).

### Project-owned instruction extension

Generated `AGENTS.md` starts with a reference to `.agents/project-instructions.md`, if present.
Create this file explicitly with project rules or pointers; the kit never extracts a preamble or
silently adopts local content. The manifest declares this fixed extension separately from managed
file hashes. Its contents survive init, update, repair and uninstall; the bridge itself remains
managed and editing it still causes a conflict. Existing preambles require a one-time explicit
transfer and reviewed backed-up replacement. Linked/unsafe extension destinations are refused.

### Source identity

`source --json` is a bounded read-only record of the actual delivery source. The same record is stored
as `source` in the managed manifest after init/update. It contains kit/catalog versions, individual
file hashes and an aggregate SHA-256, Git revision/scoped working-tree state when available, and
explicit dependency limitations. It identifies the source used for the operation, not the conformance
of retained files or an official release. Repair preserves the last applied source record.
For init/update/doctor, a `--kit-root` override must have the executing CLI's version and identical
CLI/bin source maps; mixed implementations are refused before writes or repair. Template-only
overrides can still be inspected/used. `source --kit-root` remains a read-only inspection of the
selected root and does not claim that this root's CLI was executed.

Scope includes CLI/bin, bridges, skills, migration references, seed files and package metadata.
The adjacent workspace manifest and npm lock are included only for a parent declaring the exact kit
directory as a workspace (workspace glob expansion is not implemented). The `sha256-crlf-normalized-v1`
scheme hashes UTF-8 text with CRLF normalized to LF; other spaces, BOMs and final newlines remain.
Traversal is bounded to 512 files, 2,048 entries, 2 MiB/file, 16 MiB total and depth 16; linked source
paths are refused. Docs/tests/work evidence are outside this identity. Archives can report Git
`unknown`; installed dependencies remain `not_verified`. This is neither authentication nor an
attestation of node_modules, model behavior, product validation or release readiness.

Doctor distinguishes missing provenance, same-version source drift and revision-only drift with
matching scoped content. Missing/different source provenance blocks missing-file repair until a
reviewed update. Preserve any consumer-specific product/bootstrap provenance independently.

### Explicit Claude memory links

Init/update **do not mutate user-home memory paths by default**. Doctor only inspects them.
To request creation after reviewing its exact destination:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs update --dry-run --json --claude-memory=link
node /path/to/composed/build-kit/bin/composed-kit.mjs update --yes --json --claude-memory=link
```

Home comes from `os.homedir()`; relative home/config paths are refused. `CLAUDE_CONFIG_DIR` selects
an absolute config root. The adapter uses a symlink on POSIX or a junction on Windows, never a copy
fallback, and never replaces an existing mirror. A requested ambiguous, legacy-only, copied,
wrong-target, broken, unsupported or unsafe mirror blocks application before project writes.
A later link-creation failure is explicitly reported as partial application; inspect before retrying.

The default-path adapter follows static inspection of Claude Code **2.1.263**, not a public stable
encoding API: each non-ASCII-alphanumeric character becomes one dash, preserving initial/consecutive
separators and case; long slugs use that runtime's bounded hash suffix. Existing drive-case variants
are inspected rather than assuming a lowercase rule. Expected vs legacy-slug mirrors have distinct
diagnostics. No existing user directory/link is removed or silently moved.

Claude documents repository-derived memory, configuration overrides and worktree sharing in its
[memory storage guide](https://code.claude.com/docs/en/memory#storage-location). Known environment or
`autoMemoryDirectory` overrides, linked-worktree `.git` files and uninspectable settings are reported
unsupported instead of guessed. Managed/remote settings and actual native loading are not certified.
Use Claude's `/memory` to verify the active directory before reconciling these cases manually.
Windows, WSL and other sessions can have different config roots; one successful mirror does not
verify another session. No interactive Claude loading or macOS run is claimed by this adapter.

Repair restores missing files only. Successfully restored managed files receive the generated baseline;
existing custom files remain untouched. Invalid ownership metadata prevents repair writes.

## Preview and uninstall

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs uninstall --json
node /path/to/composed/build-kit/bin/composed-kit.mjs uninstall --apply
```

Preview is the default. Application removes only regular managed files whose bytes still match their
recorded baseline, and prunes only empty parent directories. It preserves customised files, unowned
files, additional resources, links, memory, work evidence, backups and user-home mirrors. Installation
metadata is archived before removal. Both owned current and legacy tracking records are retired so the
legacy fallback cannot resurrect an installation. An unowned/modified tracking record blocks removal
until reconciled; no destructive force-uninstall option is provided.

Legacy installations without a manifest cannot be uninstalled automatically. If no manifest or tracking
record remains, repeated uninstall is an empty successful operation. A preserved custom file is yours
to retain or reconcile; uninstall does not claim the project is free of every instruction file.

Preflight prevents known conflicts; it is not a transactional filesystem or protection from a hostile
process changing paths concurrently. Apply rechecks paths and target hashes, but an I/O failure can
leave a partial update. Keep the backup and run doctor/reconcile before retrying. Scope and platform
claims are limited to the checks actually performed.

## Installation options

For first installation, follow [getting started](getting-started.md#install). The options below
are for repeatable setup or maintenance. They configure the kit, not the product stack.

### Non-interactive (CI / scripts)

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs init \
  --yes \
  --lang=fr \
  --agents=claude-code,codex \
  --skills=core,support
```

Available flags:

- `--yes` — skip wizard, use defaults (lang=fr, agents=claude-code, skills=core)
- `--lang fr|en` — force language
- `--agents claude-code,codex,cursor,gemini,cline,windsurf,aider` — select bridges for init; update preserves installed agents
- `--skills core,support,extras` — force skill levels
- `--dry-run` — complete preview including conflicts, legacy retirements and external actions; no writes
- `--json` — one structured report; application requires `--yes`, previews do not
- `--claude-memory=none|link` — no home mutation by default; explicitly request a previewed memory link
- `--force` — allow backed-up replacement of conflicting regular managed files
- `--keep-local` (update only) — retain existing skills and conflicting custom managed files
- `--cwd` / `--kit-root` — explicit target project and reviewed source checkout paths

### What gets installed

```
your-project/
├── AGENTS.md                          # Universal doctrine (always)
├── CLAUDE.md                          # If you selected Claude Code
├── GEMINI.md                          # If you selected Gemini
├── .clinerules/composed-build-kit.md   # If you selected Cline
├── .cline/skills/                      # Native Cline skill mirror, if selected
├── .cursor/rules/composed-build-kit.mdc # If you selected Cursor
├── .windsurfrules                     # If you selected Windsurf
├── CONVENTIONS.md                     # If you selected Aider
├── skills/
│   ├── catalog.json                   # Routing, risk and artifact contract
│   ├── core/                          # 8 skills (if you selected core)
│   ├── support/                       # 10 skills (if you selected support)
│   └── extras/                        # 1 skill (if you selected extras)
└── .agents/
    ├── .composed-kit-version          # Tracking file (lang, agents, version) — don't edit
    ├── .composed-kit-manifest.json    # Managed hashes, last source provenance, extension contract
    ├── project-instructions.md       # Optional project-owned rules: create explicitly, preserved
    ├── memory/
    │   ├── MEMORY.md                 # Seeded if absent; existing memory is preserved
    │   └── _README.md                # Memory format guide
    └── work/
        └── README.md                  # Evidence convention for a bounded work item
```

Skills land as `SKILL.md` (no language suffix). The kit's `.fr.md` / `.en.md` variants are resolved at install time and only the chosen language ends up in the project.

Claude Code user-home memory links are [opt-in](#explicit-claude-memory-links); review their exact
destination and applicable limitations before requesting creation.

For Cline users, `.cline/skills/` mirrors the selected shared skills so they can be discovered natively. It is refreshed by `update`; use `--keep-local` if you deliberately modified a mirrored `SKILL.md`.

## Change language or add skills

From the consuming project, using the reviewed checkout:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs update --lang=en
node /path/to/composed/build-kit/bin/composed-kit.mjs update --skills=support
```

Language selection affects generated instructions; memory and work are preserved. Retained custom
files can keep older language or policy. Skill levels are additive. Cline mirrors follow the same
retention rules as shared skills. Start a fresh agent session after updating.

For retired skill names, including `sprint-cycle`, see [skill migration](skill-catalog.md#standard-names).

## Migration from Hunch Build Kit

`composed-kit update` recognises an existing `.agents/.hunch-kit-version` and writes the new
`.agents/.composed-kit-version` record. It also renames the generated Cursor and Cline bridge
files. The legacy tracking record is retained as historical evidence and can be removed manually
once the update has been verified.
