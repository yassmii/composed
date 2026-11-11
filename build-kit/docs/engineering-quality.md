# Optional engineering-quality checks

Crapper, Dryer and Mutator can help review complex or critical changes. Use them when their result
can change a test or maintenance decision, or when the project explicitly requires that check.
Ordinary small corrections keep the existing direct delivery path. Existing equivalent project
tools remain valid; do not install a second tool merely to follow a name in a skill.

These integrations are informative by default. Success of a tool process, a measured score,
contract acceptance and product effectiveness are separate observations. No global CRAP, similarity
or mutation threshold is imposed on consumers.

## Tools, preparation and license scope

The exercised revisions are recorded with their declared 0BSD licenses in
[the source record](../third-party/engineering-quality-sources.json). Read the
[third-party notices](../THIRD_PARTY_NOTICES.md) for authorship, exact license texts and the
separate ub-mode design reference. The kit includes original integration code and synthetic
fixtures, not the engines, Python environments or parser grammars.

Prepare the tools explicitly outside a consuming project. Inspect the pinned launcher and CLI
sources first. The shell launchers can create virtual environments and install dependencies;
prefer a prepared interpreter and `python -m crapper`, `python -m dryer`, `python -m mutator`.
Mutator expects Crapper in the adjacent checkout. Keep the layout:

```text
tools/
  crapper/   # 6fd92c4c9bcc56efb64a2f8743d5a2993bcfd42d
  dryer/     # 66ff6d21a42c04afcad89c78a80066176d1294b0
  mutator/   # a5a0cb803b66e0cdb8bf471b3b08af701d424a41
  .venv/
  cache/
```

A Linux preparation example, after fetching and checking out those exact Git revisions:

```sh
python3 -m venv /absolute/tools/.venv
/absolute/tools/.venv/bin/python -m pip install tree-sitter==0.26.0 tree-sitter-language-pack==1.22.1
/absolute/tools/.venv/bin/python -m pip install --no-deps -e /absolute/tools/crapper -e /absolute/tools/dryer -e /absolute/tools/mutator
/absolute/tools/.venv/bin/python -c 'import tree_sitter_language_pack as pack; pack.configure(pack.PackConfig(cache_dir="/absolute/tools/cache")); pack.download(["javascript", "typescript"])'
/absolute/tools/.venv/bin/python -m pip freeze --all
```

Preparation requires network access unless the required artifacts are already available. Inspect
and retain resolved dependencies and grammar resources as well as repository revisions. Their
licenses remain separate from the engines' 0BSD declaration. A Git pin alone does not pin every
artifact fetched by pip or the grammar downloader.

The example uses no coverage-provider installation: Node produces a fresh LCOV report for its
synthetic JavaScript fixture. On a real project, first use that project's native coverage command,
with its selected tests, configuration and dependency state. Do not apply the Node fixture commands
to a Rust, Python or other host project.

## Interpret the native reports

| Tool | Useful observation | Interpretation and limits |
| --- | --- | --- |
| Crapper | Function complexity, coverage and CRAP | Examine the affected behavior and maintenance cost. Missing coverage or a failed coverage command is not a demonstrated quality result. `--no-coverage` provides complexity with coverage/CRAP unavailable. |
| Dryer | Structurally similar candidate pairs | Review whether both locations encode the same decision and should evolve together. An exit-zero report can contain duplication candidates. Similar syntax alone does not justify an abstraction. |
| Mutator | Executed mutation sites and surviving/eliminated/uncovered counts | Inspect meaningful survivors. Upstream also counts compilation failure and timeout as elimination; those do not show that a business assertion detected a defect. Preserve uncertainty when the engine cannot attribute a kill. |

Example invocations from a disposable fixture or an authorised host project, using the kit's
small profile adapter to select the inspected checkouts and the explicitly prepared cache:

```sh
/absolute/tools/.venv/bin/python -I /absolute/kit/examples/engineering-quality/tool-bridge.py run /absolute/tools crapper --use-existing-coverage src/rule.mjs
/absolute/tools/.venv/bin/python -I /absolute/kit/examples/engineering-quality/tool-bridge.py run /absolute/tools dryer --edn src
/absolute/tools/.venv/bin/python -I /absolute/kit/examples/engineering-quality/tool-bridge.py run /absolute/tools mutator --use-existing-coverage --mutate-all --max-workers 1 src/rule.mjs
```

The adapter passes these arguments to the original engines; it does not install them or provide
a process sandbox. Direct module invocation also works with the engine's conventional prepared
cache, but must not assume that an earlier in-process cache configuration persists across commands.

Use explicit file selection to bound cost. A selective run reports its omitted scope. Crapper's
threshold option and Mutator's exit codes have tool-specific meanings; Dryer's similarity threshold
filters a report. Never interpret all exit codes as the same quality policy.

The raw snapshots under `.metrics/` can be replaced by a later run. Copy them into a new named
execution archive together with command, exit code, runtime, durations and hashes. Keep earlier
reports rather than silently relabelling them as current.

## Side effects and applicability

- Default coverage generation can install providers, delete prior coverage outputs and regenerate
  reports. Prefer reviewed native coverage and `--use-existing-coverage` when appropriate; verify
  that the reused coverage actually belongs to the selected current inputs.
- Mutator's native test plan uses the host's test command, which may itself have side effects.
  String overrides such as `--test-command` and `--coverage-command` are executed through a shell
  upstream. The demonstration avoids those overrides and uses a controlled native fixture command.
- Mutation workers copy selected files and link other paths. They are not sandboxes; arbitrary
  tests may write through linked paths. The example owns its disposable fixture. For a real target,
  establish the permitted effects and isolation before running it.
- The engine's baseline can be unbounded. Apply an external execution deadline, output budget
  and worker limit. The existing evidence recorder bounds its direct child, not arbitrary
  descendants; process-tree cleanup and transactional restoration are not certified.
- Upstream incremental mutation results can survive changes outside a function's text. A new
  proof must include selected tests, configuration, dependency/lock state and tool identity.
  Use a fresh metric directory or the appropriate full rerun after those inputs change.
- Prepared grammars are required for the example. Upstream parser code invokes a downloader;
  cached preparation is not an authenticated no-network sandbox. Missing preparation must be
  reported as unavailable rather than triggering an unannounced install.

Use `evidence run` and `verify` where actual requirement and acceptance identifiers apply. Select
source, tests, checker and relevant configuration/lock bytes explicitly; see [evidence](evidence.md).
Without those identifiers, retain the actual execution record and native outputs. Do not invent
product clauses to obtain a receipt. A historically passing record can become stale, while a
current exit-zero process can still leave a quality decision open.

## Worked example and support

The [engineering-quality example](../examples/engineering-quality/README.md) exercises the three
real tools using explicitly prepared paths. It contrasts weak and stronger assertions against
the same boundary mutant, retains native reports and demonstrates evidence invalidation after a
test/configuration change. It supplies no generic all-product quality score.

```sh
npm run example:quality --workspace=composed-build-kit -- --tools-root /absolute/tools --python /absolute/tools/.venv/bin/python --output /absolute/new-output
```

Linux is the first execution target. Record the exact Node/Python/engine/dependency versions and
the platform actually tested. Native Windows and other environments need their own observations:
upstream process termination, symlinks and parser binaries must not be inferred portable from the
Build Kit's own cross-platform installation checks. When an external tool cannot run, report the
limit and use available native checks; do not call the missing metric successful.

The ordinary validation workflow does not install these tools. A separate manually dispatched
workflow prepares the pinned environment and runs the example with a bounded job and retained
artifacts. Hosted CI is established only by an observed run, not the presence of its YAML.
Future blocking thresholds require project-specific calibration, an explicit required scope,
baseline/exclusions and a policy for unavailable, failed or partial measurements.
