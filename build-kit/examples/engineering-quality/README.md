# Executable engineering-quality example

This opt-in example uses **real Crapper, Dryer and Mutator executions** against a disposable
fixture. The initial test suite misses the exact 24-hour eligibility boundary. The stronger suite
adds that observation while keeping the candidate bytes identical. See the local
[fixture specification](fixtures/fixture-spec.md) for the illustrative IDs and expected outcomes.

The pinned live profile is validated on Linux with Node 20/24 and Python 3.12. Windows/macOS
engine execution is not assessed. The ordinary Build Kit does not require these engines.

## Prepare explicitly

Use clean sibling checkouts at these revisions in an absolute `TOOLS_ROOT` directory:

| Directory | Repository | Revision |
| --- | --- | --- |
| crapper | https://github.com/unclebob/crapper | 6fd92c4c9bcc56efb64a2f8743d5a2993bcfd42d |
| dryer | https://github.com/unclebob/dryer | 66ff6d21a42c04afcad89c78a80066176d1294b0 |
| mutator | https://github.com/unclebob/mutator | a5a0cb803b66e0cdb8bf471b3b08af701d424a41 |

Review their source and licenses before execution. Create a dedicated Python 3.11+ virtual
environment, install [the tested parser dependencies](requirements.txt), then install the three
clean engine checkouts editable with `--no-deps`. Do not use their shell launchers as a read-only
probe: those launchers can create a virtual environment and install packages. Keep `pip freeze`
and the prepared environment identity. This example does not install engines or dependencies.

Prepare JavaScript/TypeScript grammars **before** the verification run. With the prepared Python,
use the package API explicitly (replace the absolute path):

```python
from pathlib import Path
import tree_sitter_language_pack as pack

tools = Path('/absolute/TOOLS_ROOT')
pack.configure(pack.PackConfig(cache_dir=str(tools / 'cache')))
pack.download(['javascript', 'typescript'])
print(pack.cache_dir(), pack.downloaded_languages())
```

The example requires these cached grammars and clean engine revisions, and checks that the
interpreter imports those exact checkout roots. It calls the Python modules directly, with the
same explicit cache configuration. Upstream parsing still calls its download API; the prepared
cache is a prerequisite, **not a network sandbox or promise of zero network access**.

Install the Build Kit's normal dependencies with the appropriate OS beforehand. Then, from its
checkout or installed package, run with Node on Linux:

```sh
node examples/engineering-quality/verify.mjs \
  --tools-root /absolute/TOOLS_ROOT \
  --python /absolute/TOOLS_ROOT/.venv/bin/python \
  --output /existing/parent/new-quality-run
```

`--output` must not exist. The example never replaces old evidence and retains partial new output
when a check fails. It does not delete user work, mutate a real consumer or download a tool.

## What is actually checked

- Native Node tests produce LCOV before the tools run. Both weak and strong baselines pass.
- Crapper measures the actual candidate. A low score is information, not product certification.
- Dryer reports a real structural candidate and exits zero. The example retains the synthetic
  invoice/receipt labels separately: structural similarity alone does not justify merging rules.
- Mutator runs one worker, uses existing coverage and `--mutate-all` in fresh fixture directories.
  The known `>=` → `>` mutant survives weak tests (exit 3) and is killed by strong tests (exit 0).
- A separate compiling copy containing that same semantic change fails the boundary assertion.
  That observation attributes this one counterexample to behavior. General engine reports still
  do not distinguish assertion failures, compilation failures and timeouts in their elimination count.
- `evidence run` records real baseline executions and selected fixture bytes. Its IDs refer to the
  local specification only. Four separate copies then change the actual test, checker, checker
  configuration or imported checker dependency. `verify` reports each old passing receipt as stale,
  while the candidate source remains identical. Historical execution results are preserved.

The original EDN files are retained. `tool-bridge.py` uses the pinned Mutator EDN reader only to
check this fixture; it is not a generic report normalizer, additional engine or copied upstream source.
The run inspects actual engine source hashes, imported package roots, dependency versions/license
metadata and cached grammar library hashes before and after execution. Only the listed files are
covered. Baseline receipt verification checks current fixture files; external engine/interpreter
changes require a new live inspection, not just rereading the old `tool-context.json` snapshot.

## Output and limits

The new directory retains `summary.json`, `environment.json`, command stdout/stderr and execution
records, both fixture trees with native reports, baseline receipts, a compiling counterexample,
four stale controls and `stale-reports.json`. Exit zero means this bounded demonstration succeeded;
individual negative controls remain visibly failed/survived/stale in their records.

Each launched child has a deadline and output limit. The limits do not supervise arbitrary
descendants. Upstream mutation overlays also link other fixture paths and are not a sandbox.
All child processes retain the invoking account's permissions. The profile has informational gates
and does not establish product conformance, complete coverage, authenticated review or tool honesty.
No `ub-mode` source text is reproduced. The integration and fixtures are original Composed code;
external engines retain their own licenses and are not included in this package.
