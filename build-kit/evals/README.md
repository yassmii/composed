# Agent behaviour evals

For actual delivered-code comparisons with and without the project kit, see the separate
[paired benchmark](../benchmarks/README.md). Its calibrated semantic checks and real sessions do not
replace these routing regressions. CI runs deterministic calibration only; model calls are local.

For the separate first executable evidence vertical, run `npm run eval:evidence`. It executes local
acceptance assertions against a correct reference and a plausible wrong implementation, then checks
staleness and review declarations. See [executable evidence](../docs/evidence.md). It is neither the
fixture adapter below nor a comparative agent/model benchmark.

`scenarios.json` is a provider-neutral regression suite for the methodology. It tests skill routing,
risk gates, evidence requirements, and inappropriate over-processing of simple work.

Run the structural check with:

```bash
npm run validate:agentic --workspace=composed-build-kit
```

## Running the harness

First verify the runner itself without calling a model:

```bash
npm run eval:fixture --workspace=composed-build-kit
```

This writes ignored output under `evals/runs/fixture/`, including one result per scenario and a
`summary.json` score.

To evaluate an actual agent, use the generic command adapter. It deliberately takes an executable plus
individual arguments rather than a shell string. Your wrapper receives one JSON evaluation input on
stdin and must emit exactly one JSON response on stdout:

```json
{
  "primary_skill": "cadrage",
  "risk": "medium",
  "response": "The user or actor is ...",
  "evidence": ["repository observation"],
  "artifacts": [".agents/work/team-invitations/brief.md"]
}
```

```bash
node evals/run.mjs \
  --adapter command \
  --command /absolute/path/to/your-codex-or-claude-wrapper \
  --arg --model \
  --arg your-model-id \
  --output evals/runs/codex
```

Use a separate disposable repository for each real run. Never pass production credentials, live
customer data, or a command capable of changing a non-disposable project. A failing scenario exits with
status 1; use `--allow-fail` when exploring a model and review the generated results instead.

Compare two or more completed runs:

```bash
node evals/compare.mjs evals/runs/codex evals/runs/claude evals/runs/gemini
```

The deterministic grader verifies selected skill, risk classification, required/forbidden phrases, and
the response envelope. It is intentionally a floor, not a quality oracle: add code checks for artifacts
and tests, plus human or model review for substantive quality. Add a scenario whenever a real project
exposes a failure mode; do not optimise the skills only for synthetic wording.

The fixture adapter echoes expected phrases; a green fixture run proves the harness plumbing only.
Stack-selection scenarios cover missing and partial choices, technology studies, explicit delegation,
unchanged existing stacks and proposed changes. A real run must show the study and user choice (or
explicit delegation) before scaffolding, dependency installation or dependent implementation; the
fixture and phrase grader cannot establish that boundary was actually respected.
It does not launch subagents. Phrase-based grading cannot prove `multi-agent-required` compliance.
For a real execution, inspect runtime tool traces and `agents.md` (real IDs, access and results),
workspace isolation and the fresh independent review; record any missing proof as a limitation.

Specialist scenarios also cover security review, systematic debugging, API compatibility, persisted
data transitions, releases, market evidence and the renamed engineering/testing/refactoring skills.
They include read-only requests whose risk is lower than the skill's default and negative routing
cases such as an atomic internal type or prioritisation with existing evidence. For an actual run,
inspect generated artifacts and traces: a phrase match does not prove safe data recovery, consumer
compatibility, publication authority or source freshness. Legacy directory migration is separately
exercised by integration tests; it is not established by a fixture answer.

Delivery-shape scenarios preserve direct correction with inline evidence, sensitivity independent of
change size, explicit review requests and path-probe scope. They are phrase/envelope regressions, not
proof that an agent avoided unnecessary files or respected runtime restrictions. Actual filesystem
probes and a bounded independent installed-skill exercise are recorded with the corresponding work.

Adaptive-assignment scenarios cover unavailable selection/profiles, local-only transmission, risky
work, invalid positive results, access errors, repeated attempts and incompatible writes. Their
phrase grader remains a routing floor: it cannot prove which model ran, whether data stayed local,
or whether an agent obeyed its attempt limit. Installation/update tests verify the distributed
policy and preserve project-owned preferences; catalog mutation tests verify rejected malformed
policy. Actual agent behaviour and speed require the separately bounded real-session pilot.
