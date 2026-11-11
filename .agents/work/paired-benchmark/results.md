# Pilot 001 — actual results

Measured on 2026-10-28; final analysis on 2026-10-29. **Inconclusive comparison:** no pair has
completed executions in both conditions. The pilot establishes an executable measurement path and
exposes runtime/operating-budget problems; it does not establish Build Kit superiority or inferiority.

## Frozen scope and observations

[Protocol](evidence/pilot-001/protocol.json): Codex CLI 0.164.0-alpha.11.1, requested
gpt-6.1-sol/high, native Linux Node 20.20.2, actual EN core/support kit installation, 120 seconds per
session. One development and two confirmation tasks, two balanced repetitions each, 12 attempted
sessions. Each session can make multiple model requests. All nine seed/reference/mutant calibration
controls passed before dispatch. No skills or graders were tuned from these observations.

| Cohort | Condition | Sessions | Completed and accepted | Timeout | Quota refusal |
| --- | --- | ---: | ---: | ---: | ---: |
| Development | Baseline | 2 | 2 | 0 | 0 |
| Development | Kit | 2 | 0 | 2 | 0 |
| Confirmation | Baseline | 4 | 1 | 0 | 3 |
| Confirmation | Kit | 4 | 0 | 2 | 2 |

All 12 sources were graded, including interrupted/refused attempts. Three baseline sessions completed
and passed all ten check groups. Two other sources passed all groups without a completed session:
development kit repetition 2 timed out; confirmation retry baseline repetition 2 ended at the usage
limit. Passing source assertions therefore do not establish a completed delivery. All 24 original
regression groups passed, including those on untouched seed code; acceptance coverage is separate in
the [machine summary](evidence/pilot-001/summary.json). Groups are correlated, not independent samples.

The four kit timeouts each have a patch rejection in their original stderr: writing outside the
project was rejected by approval settings. One additionally records a read-only filesystem violation
with `path=unknown`; its agent message reports moving work notes out of `.agents`. These establish
a runtime-policy interaction, not the exact rejected paths or a causal breakdown of elapsed time.
Skill-reading overhead is visible, but the pilot cannot isolate its cost from these restrictions.
The five later refusals explicitly report the Codex account usage limit in
[original error events](evidence/pilot-001/error-events.json). They are infrastructure blockers,
not delivered-code failures. No retries or extra measured calls were added to replace adverse outcomes.

Development baseline durations were 97.474s and 107.298s; kit durations were capped at approximately
120s. The aggregate `mean_agent_ms` measures consumed observed process time, including early quota
failures and censored timeouts. It must not be read as mean time to successful completion or used to
rank either condition. There are zero comparable completed pairs in both cohorts.

## Cost and evidence limits

Currency cost is unknown. Complete root usage is emitted for only three of twelve sessions; missing
usage is not zero and aggregate totals remain unknown where coverage is incomplete. Delegated usage
completeness is not established. One unscored readiness session and implementation/review work are
outside the measured totals. Zero automated follow-up answers excludes human setup and design labour.
Client timeouts are operational bounds, not a guarantee that remote generation stops or a dollar cap.

[Archive manifest](evidence/pilot-001/archive-manifest.json) hashes every retained raw run file and
every selected archive file. Original protocol, results, summary, calibration, per-trial receipts,
diffs and stderr are copied without rewriting. Full raw tool traces remain local and ignored.
The OS temporary candidate directories disappeared across an environment restart before final
archival. Declared production sources were reconstructed from the frozen seed plus retained tracked
diff, and **all twelve hashes match their original grader records**. These are labelled reconstructed
sources. Added untracked tests are absent from the tracked diff and cannot be recovered from file-change
summaries. This is not a complete candidate snapshot or proof of the quality of generated tests.

Only one model/runtime and three small synthetic modules were tested. Condition-labelled directories
were visible; this is not a blinded experiment. Graders were withheld from candidate workspaces,
without an adversarial filesystem isolation claim. Complex product/UX decisions, cross-session
handoffs and full multi-agent governance remain unevaluated. Confirmation cases are now exposed and
should serve as regressions, not a fresh holdout for later tuning claims.

## Next bounded experiment

Before spending more model usage: make full delivered source/test snapshots durable in run output;
probe actual intended artifact paths under the selected sandbox; distinguish source acceptance from
session completion; and establish quota availability plus observable usage. Freeze any runner/runtime
correction as a new protocol. Choose a realistic completion budget in an unscored development
exercise, then use new confirmation cases without tuning their grader or skills during measurement.
Preserve this run unchanged. A broader best-of-breed claim requires substantially more evidence.
