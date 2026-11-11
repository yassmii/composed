# Compatibility evidence

The seven agent entries install instruction bridges, not seven certified behavioural integrations.
Runtime features, permissions, delegation and hooks must be inspected in the actual session.

| Surface | Evidence available | Limit |
| --- | --- | --- |
| FR/EN core/support installation | Automated filesystem/metadata tests | Not end-to-end execution of every skill |
| Seven bridge destinations | Generated template and structural checks | Tool availability varies by runtime/version |
| Shared/Cline migration | Automated lifecycle tests and recorded real CLI exercises | Does not prove Cline executed every skill |
| Codex/Cline bridge installation | Disposable real CLI exercises in prior work evidence | Installation is distinct from native runtime conformance |
| Native multi-agent policy | Instruction contract and structural/behavioural scenarios | No launcher or sandbox is installed |
| Linux, Windows, macOS / Node 20, 24 | Root CI matrix configured | A configured job is not a passing hosted run; inspect Actions results |
| Local evidence receipts | Explicit command execution and read-only applicability checks | Unsigned local records do not authenticate authors or approvals |
| Paired Codex delivery pilot | 12 attempted local sessions with native Linux Node 20; [results](../../.agents/work/paired-benchmark/results.md) | Four timeouts and five quota refusals; no completed matched pair or comparative result |

The current local development environment uses Windows Node through WSL; exact versions and completed
checks are recorded with work evidence. No macOS or hosted-CI execution is inferred from local tests.
Publish run/revision references here as more combinations are actually qualified.

The 2026-10-28 CI repair additionally exercises a clean Linux x64 installation with Node 20.20.2
and a Windows checkout with `core.autocrlf=true`. The lockfile guard checks all declared optional
packages before installation, including nested native-package versions. See the scoped
[validation record](../../.agents/work/ci-cross-platform/validation.md) for actual outcomes;
this does not imply that the entire hosted matrix has passed.

Use [doctor and repair](diagnostics.md) for installation checks, [safe adoption](adoption.md) for file
ownership and [runtime capabilities](runtime-capabilities.md) for the separate delegation contract.
