# Executable scoped-verification example

Run `npm run example:contracts` from the repository root. It creates owned temporary files,
executes the example and removes its temporary directory. `-- --output NEW_DIRECTORY` retains
new evidence under a directory that must not already exist.

`contract.yaml` is a fictional format-0.2 contract for revoking a fixture reader grant, repeating
revocation and inspecting history. `access-service.mjs` exposes a JSONL process interface. The
mutant incorrectly returns record content after revocation. Actor labels and volatile state are
fixtures, not authentication, a production service, or actual consumer product behavior.

`checker.mjs` launches each candidate, sends actions through its public process interface and
asserts independently specified responses. It does not import candidate internals. `run.mjs`
records the real checker command, runtime, outcomes and observations, hashes contract/plan/checker/
target/output bytes, then invokes the read-only evaluator.

Expected results:

- reference: `passed`, five concrete cases covering four normative clauses;
- mutant: `failed`, including the denied-read counterexample;
- changed checker in a separate copy: `stale`;
- changed read rule: the dependent repeat-revocation case needs revalidation, with no proof transfer.

The selected plan explicitly names two clauses; normative dependencies add the other two. This
exercises scope closure, not a generic all-product conformance claim. Reports keep consumer product and
full contract conformance unassessed. Evidence remains a local producer declaration with integrity
checks, not authenticated execution or review identity.

Retained output includes reference/mutant plans, checker transcripts, evidence, evaluator reports,
a stale-checker control, an impact report and `summary.json`. Expected negative controls make the
overall demonstration succeed; they must remain visibly failed/stale in their individual reports.
The demonstration can leave partial new output on failure and never removes explicit output.
