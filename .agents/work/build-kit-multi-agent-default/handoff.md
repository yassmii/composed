# Handoff

State: implemented, checked locally and committed as `61dbd0b` (Build Kit 0.5.0).
No push, release tag or publication performed.
Sources: build-kit/bridges/AGENTS.md.{fr,en}.tpl,
build-kit/skills/catalog.json, runtime and operating-model docs.

Mode: native-subagent. Parent owns all canonical writes and integration.
Read-only reviewer: /root/review_multi_agent_policy; no mutation permissions
granted by the task. Actual delegation: [agents.md](agents.md).
Independent verdict: [accepted](reviews/2026-10-20-native-policy-review.md).
Checks and limits: [validation.md](validation.md).

Included/deferred scope: see brief.md. The initial implementation preserved the
pre-existing dirty lockfile bytes. Commit preparation restored repository LF line
endings after verifying that the only semantic change from HEAD was the workspace
version 0.4.0 → 0.5.0; no dependency data changed.
Next owner: user adopts the committed checkout via the kit's update command and
repins immutable implementation prompts to `61dbd0b` when appropriate. Remote
delivery and publication remain separate actions.
Exit: checks passed, contradictions resolved, evidence and limits recorded.
