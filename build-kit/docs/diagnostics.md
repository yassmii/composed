# Diagnose and repair a project installation

The Build Kit provides a structured installation report that a coding agent can
consume. It checks repository artifacts and flags a few instruction patterns.
It does not verify native delegation, model compliance or application conformance.

For actual temporary writes in intended directories, use the separate opt-in
[preflight command](runtime-capabilities.md#local-path-preflight). It is scoped to the invoking
process and selected paths; neither command certifies overall agent readiness or account quota.

## Diagnose by agent

From the project root, using a checked-out kit with its dependencies installed:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs doctor --agent=codex --json
```

`--cwd=/path/to/project` selects another project. `--agent` accepts `claude-code`,
`codex`, `cursor`, `gemini`, `windsurf`, `aider` or `cline`. Omitting it checks all
agents in the installation record. Selecting an unconfigured agent reports a
configuration issue and does not register it. Shared doctrine and skills remain
in scope even when only one agent bridge is selected.

The report preserves `healthy`, `errors` and `warnings` and adds `format_version`,
`scope`, `runtime_verification`, `installation`, `agents` and `findings`.
Each finding has a stable ID, severity, project-relative path, agent scope,
message and remediation category. `healthy` refers only to structural errors in
the selected scope; warnings can still require review. The CLI exits 1 on an
unhealthy report, including when JSON is requested.

Checks cover installation records, version/source drift, shared files, selected bridges,
published skills, catalog policies, Cline mirrors and the Claude memory mirror.
User-home mirrors are inspected only. Expected, legacy-slug, ambiguous, copied, wrong-target and
unsupported layouts are distinguished. The default Claude path adapter follows statically inspected
Claude Code 2.1.263; it does not verify native instruction loading. Known memory overrides and linked
worktrees require manual inspection with `/memory`. Existing instructions without a generated
kit marker are flagged for review. Prompt heuristics can flag optional-kit wording,
autonomous stack selection or missing bootstrap; a clean report is not semantic
proof that an arbitrary prompt is correct.

## Preview and apply bounded repairs

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs repair --agent=codex --dry-run --json
node /path/to/composed/build-kit/bin/composed-kit.mjs repair --agent=codex --apply --json
```

`repair` without `--apply` is a preview. It exposes `actions`, `applied` paths and
the `remaining` diagnostic report. `--apply` and `--dry-run` are mutually exclusive.
An unhealthy remaining report gives exit code 1; this is useful to automation and
does not imply a command crash.

| Remediation | Treatment |
| --- | --- |
| `create-missing` | Restore an absent generated file when installation settings and source kit versions are compatible. |
| `review` | Preserve the file and let the agent inspect context, propose an explicit change and validate it. |
| `update` | Review local adaptations and refresh the installation before missing-file repair. |
| `adopt` | Establish a real installation, preserving project instructions and explicitly choosing kit configuration. |

Application never overwrites existing instructions, skills, catalogs, memory or
work evidence. New files use exclusive creation; links and unsafe destinations
are refused in both preview and application. A second successful run has no new
files to create. I/O failure can leave earlier creations present; rerun diagnosis
to inspect the remaining state. No transactional rollback is claimed.

Repair does not refresh an old installation, infer missing configuration, repair
corrupt files, synchronize custom mirrors or modify user-home configuration.
Those actions can have local intent that an agent must understand first.

## Agent workflow for a manual project

The original adoption case had product-contract snapshots and project instructions
but no kit installation record. Those are separate inputs; neither proves the
kit is installed. The agent should:

1. Read the report and inspect the named files, preserving their current content.
2. Establish whether the kit is a required delivery method, the desired agent(s),
   language and skill levels. Reuse decisions already supplied by the user.
3. Prepare an adoption change that retains project rules and makes the method's
   bootstrap/version verification explicit in the implementation prompt.
4. Reconcile open-stack wording with the user's decision policy; retain the
   project's already agreed technologies and product/validation pins.
5. Run installation as part of that prepared, authorised change. Current `init` and `update` refuse
   unrecognised/modified managed collisions before project writes; `--yes` does not overwrite them.
   Use explicit backed-up replacement only within existing authority. See [safe adoption](adoption.md).
6. Rerun diagnosis, inspect the diff, then start a fresh agent session. Required
   runtime delegation and actual product validation still need their own evidence.

The tool does not manufacture a version file to make a manual project appear
installed. It also does not rewrite arbitrary prompt prose, grant stack-selection
authority or treat its structural report as permission to deploy.

## Source identity, extensions and preserved guides

The managed manifest records the last applied [source fingerprint](adoption.md#source-identity),
not just the package version. Missing or differing provenance requires an update before repair;
revision-only differences with an identical scoped fingerprint are separately reported. A dirty source
is an observation, not an official release. Retained custom files can still carry older instructions.

`.agents/project-instructions.md` is a declared project-owned extension referenced at the start of
generated `AGENTS.md`. It is not a managed file and does not cause `managed.modified:AGENTS.md`.
Editing the generated bridge itself still causes a conflict. Linked extension paths are refused.

`seed.review` reports memory/work guides that differ from the current templates. It does not infer
whether the guide is stale or intentionally adapted. Both guides and `memory/MEMORY.md` are preserved;
MEMORY.md content is never treated as a template refresh candidate.
