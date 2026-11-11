# Runtime capabilities

The default execution policy is `multi-agent-required`: complex, cross-disciplinary implementations
and multiple implementation workstreams require an actual native delegation before product code.
Questions, read-only analysis, bounded documentation corrections and small fixes can proceed directly.

This is an instruction contract, not a runtime launcher. Installing the kit does not create subagent
tools, permissions or slots, and selecting several bridges with `--agents` does not launch an agent team.

## Local path preflight

When required write access is unknown or has failed, invoke the reviewed kit **through the same agent
tool/sandbox that will do the work**, selecting its intended project-relative directories:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs preflight \
  --write-path src --write-path .agents/work --json
```

This opt-in command performs real temporary writes. For each selected directory it exclusively
creates a random probe, writes/reads its bytes, closes/removes it and removes only still-empty
directories it created. Existing project content and permissions are preserved. Missing directories
may be created transiently; success does not leave them installed. Cleanup failures report residual
paths and block the result; inspect ownership before manual cleanup. These conventional filesystem
checks are not an adversarial race-proof sandbox or a transaction against process interruption.

`--cwd` selects an existing ordinary project root; linked root entries are refused, ancestor aliases
are canonicalised and the actual root is reported. Repeat `--write-path` for 1–16 distinct directories;
`.` selects the root. Paths use `/`: traversal, linked components, non-directories, case aliases,
source-control metadata and unsafe Windows names are refused. Each path is limited to 32 segments
and 4096 characters. Argument syntax is checked before any probe; failures at valid requested paths
do not prevent remaining probes from being observed.

| Report field | Meaning |
| --- | --- |
| `scope: local-write-probes` | This invoking process, selected directories and observed time only |
| `status: passed` | Every selected write/read and owned cleanup passed; exit 0 |
| `status: blocked` | At least one probe or cleanup failed; exit 1, inspect findings/residuals |
| `runtime_readiness: not_assessed` | No overall agent readiness verdict |
| `session_capabilities.*: unknown` | Native delegation, reviewer independence and account quota are not established by this CLI |

Invalid arguments/project roots fail before probing (exit 1, no success report). `doctor` remains an
installation/instruction inspection with `runtime_verification: not_performed` and performs no write
probes. A configured bridge, binary or login does not prove runtime capability. A pass in an outer
terminal, another directory or another sandbox does not prove agent access. A directory probe also
does not prove an existing file is editable or every later operation will succeed. Recheck after
context/permission changes, not before each edit.

After a required-path failure, report the affected action, actual finding and supported remedy.
Do not silently relocate required evidence, disable a sandbox or change permissions to obtain a pass.
Independent reading/framing may continue. Delegation needs inspection of actual native tools and a
real required delegate; the CLI cannot grant it. Keep unobservable quota unknown rather than polling
with paid model calls.

The installed instructions do not put `composed-kit` on PATH. Use the known reviewed checkout shown
above. If unavailable, an equivalent bounded native probe may establish the same scoped path
observation: exclusively create/write/read/remove an owned temporary file in the intended directory,
preserve existing content and report cleanup failures. Do not install Node/dependencies in an unrelated
host project for readiness. If no permitted probe can run, keep access unknown and block dependent
writes rather than claim a pass.

## Startup gate

Only applicable complex implementation uses this gate. Direct questions and eligible direct
corrections need no delegation ritual. Execution shape and action risk are separate; see
[delivery examples](proportionate-delivery.md).

1. Inspect the tools, access and quotas actually exposed by the session.
   Keep unobservable fields unknown and reuse unchanged capability observations. Verify required
   source/evidence write paths in the actual sandbox when access is unknown or after denial.
2. Define useful bounded work and launch at least one native subagent. A useful read-only research or
   validation task counts; reading several skills or inventing role names does not.
3. Verify access and record the runtime-returned identifier, mission, access, workspace, launch time,
   status and eventual evidence in `.agents/work/<work-item>/agents.md`, linked from `handoff.md`.
4. The parent owns decisions, integration, canonical writes and final validation. Concurrent writers
   need separate worktrees or verified isolation; branches alone do not isolate filesystem changes.

Choose the number of delegates from actual workstreams and available slots; there is no fixed team
size. Parallelise independent tasks where supported. Limited concurrency permits sequenced real
delegations, but not a claim of parallel execution.

Without native delegation, report the missing capability and block the affected implementation.
Read-only inspection and framing can continue. Only an explicit user request authorises single-agent
implementation; record that exception in `handoff.md`. Stricter user-specified roles/counts take
precedence. A single-agent exception does not by itself waive a required independent review.

## Model assignment is a separate capability

Apply the catalog's `model_assignment_policy` after choosing the delivery shape. Client, model and
access mode are distinct: a model endpoint or gateway does not provide an agent tool loop, isolation
or native delegation. Optional assignment instructions do not change the native startup gate.

Observe model selection, required tools, isolation and concurrency in the actual session. Record
`available`, `unavailable` or `unknown`; configuration alone is insufficient. A model selector may
exist without permission to use every candidate. If selection is unavailable, use the available
model within authority, with bounded context and independent work scheduling. Expose unavailable or
unknown requested profiles; choose an alternative only within existing authority. A local-only
mission never falls back silently to a remote service.

`fast`, `standard` and `deep` are optional local intentions, not required models or competence
certificates. Filter tools, transmission, permissions, user constraints and availability before
considering observed task-family capability or speed preferences. Risky work receives suitable
capability at the outset. Effort has no universal conversion across runtimes; missing controls,
identity, cost and usage remain unknown.

Use `.agents/project-instructions.md` for optional preferences and pointers to approved launch
configuration. Runtime configuration owns executable/backend settings and credential references;
the kit adds no network invocation, credential registry or implicit service. See
[configuration and worked examples](adaptive-delivery.md). Existing `agents.md` records assignment
reason, execution mode, returned ID, requested model, observed model or `unknown`, workspace, status,
available duration, result and evidence. Do not store prompts, secrets or private endpoints.

A gateway may conceal backend identity: copying the requested ID into the observed field is false
proof. If exact identity is required, absence of evidence blocks that qualification. A successful
process and a positive agent statement remain separate from deliverable validation and a required
fresh non-author review. Diagnose access/tool/test failures before escalating the model; follow the
mission's attempt limit and authorised envelope.

## Review capability contract

| Mode | Valid use | Limit |
|---|---|---|
| `native-subagent` | An actual separate context receives bounded work with verified access. | Never infer write, browser, MCP or nested delegation access. |
| `fresh-session` | A person actually starts a separate fresh-context, read-only review. | Can satisfy independent review, not the default native-delegation startup gate. |
| `self-review` | The author performs an additional quality check. | Never independent; does not unblock a required independent gate. |

A required independent verdict must come from a fresh context and a reviewer who did not author the
deliverable being reviewed. Record mode, reviewer/author relationship, canonical evidence and limits
in a new named file under `reviews/`; link it from `handoff.md`. If independence is unavailable,
report a closure blocker instead of calling the work complete. Never overwrite an earlier review.

## Bridges, not lock-in

| Runtime | Installed bridge | Native skill mirror | Operational rule |
|---|---|---|---|
| Claude Code | `CLAUDE.md` | Shared `skills/` | Use only native capabilities visible in the session. |
| Codex | `AGENTS.md` | Shared `skills/` | Inspect tools and permissions before actual delegation. |
| Gemini CLI | `GEMINI.md` | Shared `skills/` | Prefer native skill activation when present; otherwise read the shared file. |
| Cline | `.clinerules/composed-build-kit.md` | `.cline/skills/` | Verify experimental subagents; useful read-only tasks count. If absent, apply the startup blocker. |
| Cursor, Windsurf, Aider | Their existing bridge file | Shared `skills/` | Apply the same policy using only capabilities actually exposed. |

The Cline mirror is generated at install/update time. `update --keep-local` retains installed skill
files, which may retain older instructions; reconcile them manually before claiming policy alignment.
The `doctor` command checks installation integrity, not runtime delegation or task completion.

The [Composed Runtime design](../../docs/composed-runtime/README.md) explores optional external
delegation and the allocation of controls between supervisors, native hooks, events and validation.
It is planning material, not a shipped runtime or a change to the native-delegation policy above.
Its integration requires a separate implementation and compatibility verification.

## Recommend then advance

Operational ambiguity gets a stated recommendation and working assumption. Ask humans only when a
choice changes scope, product values, safety, external authority or irreversible effects. A missing
required runtime capability remains a real blocker, not an operational assumption.
