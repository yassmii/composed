# Adaptive delivery pilot

This is a separate A/B/C protocol, not a change to the historical Codex with/without-kit benchmark.
It prepares and reports a campaign; it does **not** launch agents, install models or authorise calls.
Traceability: MET-ADH-003, REQ-ADH-016–020/025, ACC-ADH-016 in the candidate harness contract.

- A: baseline kit and a fixed model.
- B: improved organisation, the same client/access and fixed model as A.
- C: the same organisation as B, with assignment among approved models.

Four small synthetic families exercise direct correction, independent utility work, an authorization
interface and diagnosis. Development and confirmation use separate input variants. These are modest
coordination probes, not representative large application projects. Do not tune policy on confirmation
cases; confirmation data and judges stay outside agent workspaces. A single model may fill all profiles,
but a C campaign with no actual assignment change cannot demonstrate a routing gain.

Prepare an environment JSON **without credentials, endpoints or prompts**:

```json
{
  "client": "client-under-test",
  "client_version": "pinned-version",
  "access_mode": "local",
  "fixed_model": "approved-model-a",
  "allowed_models": ["approved-model-a", "approved-model-b"],
  "data_policy": "synthetic only; no remote transmission"
}
```

From `build-kit/`, with Node 20 or newer:

```bash
node benchmarks/adaptive-delivery/protocol.mjs calibrate
node benchmarks/adaptive-delivery/protocol.mjs prepare /new/campaign \
  <baseline-40-character-sha> <candidate-40-character-sha> \
  /approved/environment.json <authorization-evidence-reference>
node benchmarks/adaptive-delivery/report.mjs /new/campaign/protocol.json /new/campaign/records.json
```

Preparation calibrates all eight seeds, correct references and semantic mutants, then exclusively
creates the campaign directory. Inputs, judges, revisions, environment, rotated serial schedule,
budgets and decision thresholds are covered by a SHA-256 digest. The digest detects accidental edits;
it does not authenticate the author. Default: three repetitions, 72 trials, at most ten minutes per
trial including retries and acceptance checks, two attempts within that duration. Stop the campaign
at its frozen total duration. Narrower human cost/time limits still take precedence. No paid campaign
is authorised by preparing this file. The initial local-only user constraint cannot be expanded by
a campaign manifest.

Execute the frozen schedule **serially**, in fresh checkouts at the recorded revisions. Materialise
only `task.seed` as `candidate.mjs` and give the agent the objective plus applicable instructions;
do not expose references, mutants or judge source. Independent writers need separate worktrees or
verified isolation. Record actual delegation IDs, tools used, model requested/observed, revisions,
inspection of the resulting diff and required non-author review. The utility fixture can use read-only
delegated tests or separate working copies; two writers must never edit the same fixture concurrently.
Use a protected judge from the frozen protocol, not candidate-authored tests or npm scripts. The
exported `grade(task, candidatePath)` function runs that judge against actual code. It runs local
candidate code with caller privileges: use only reviewed synthetic fixtures in an appropriate sandbox.

Start elapsed time at dispatch and stop only after acceptance, including corrections, integration,
tests and required review. A completed model response or process exit is insufficient. Inspect the
session evidence for policy compliance; the semantic judge cannot prove delegation or independence.
Missing access, malformed output, timeout and failure remain results, not deleted observations.
Never overlap trials on the same local model server. Confirm in a distinct client/local or gateway
combination under separately authorised conditions; do not pool unlike environments.

`records.json` is an array. Every supplied row has a scheduled `id`, `protocol_sha256` and `outcome`
(`accepted`, `failed`, `blocked`, `timed_out`, `not_run`). Missing rows count as `not_run`. An executed
row also requires `revision`, `client`, `client_version`, `access_mode`, `requested_model`,
`observed_model` (string or null), `duration_ms`, nonempty `evidence` references, and `cost_usd`,
`tokens`, `human_interventions`, `retries` (numbers or null when unobserved). Accepted rows require
`grade: {"passed": true}` and `gates_passed: true`. For the risky interface they additionally require:

```json
{
  "review": {
    "mode": "native-subagent",
    "author_id": "actual-author-id",
    "reviewer_id": "actual-different-reviewer-id",
    "fresh_context": true,
    "verdict": "accepted",
    "evidence": "path/to/independent-verdict.md"
  }
}
```

An external review record does not itself qualify an external executor for the kit startup gate.
Records remain unsigned local declarations and must link to inspectable observations. The reporter
rejects contradictory acceptance, duplicate identities, model substitutions outside the frozen list
and missing required review metadata. It cannot authenticate those declarations.

The report keeps outcome counts for every scheduled trial and separates cohorts. Pairwise gain is
the median of `1 - candidate_duration / reference_duration` for the matched task and repetition;
it is withheld if either member failed, is missing or used an incompatible environment. A target is
observed only for a complete comparable campaign: at least 20% median paired gain on complex cases,
no observed loss of mandatory criteria and at most 10% direct-path regression. Report A→B and B→C
separately. If C does not improve B, keep organisation improvements without recommending adaptive
assignment as a demonstrated optimisation. Even a target observation keeps `comparative_benefit` at
`not_established`: small samples and fixture coverage do not prove general equivalence.

No real campaign has been executed by this implementation. Calibration and reporter tests are
deterministic checks of the protocol machinery, not evidence of faster delivery or model support.
