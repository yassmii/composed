# Third-party references and license scope

Composed Build Kit's original implementation and instructions are distributed under [MIT](LICENSE).
This notice records design references and optional external tools. It does not replace upstream
licenses or assign Composed's license to external work.
The earlier ECC design references remain documented in [skill provenance](docs/skill-catalog.md).

## Optional engineering-quality tools

| Project | Author | Reviewed revision | Declared license | Composed usage |
| --- | --- | --- | --- | --- |
| [Crapper](https://github.com/unclebob/crapper) | Robert C. Martin | `6fd92c4c9bcc56efb64a2f8743d5a2993bcfd42d` | 0BSD | External complexity/coverage measurements |
| [Dryer](https://github.com/unclebob/dryer) | Robert C. Martin | `66ff6d21a42c04afcad89c78a80066176d1294b0` | 0BSD | External structural-duplication candidates |
| [Mutator](https://github.com/unclebob/mutator) | Robert C. Martin | `a5a0cb803b66e0cdb8bf471b3b08af701d424a41` | 0BSD | External mutation-testing observations |

The identical upstream license text, including the copyright and warranty disclaimer, is retained
in [unclebob-quality-tools-0BSD.txt](third-party/licenses/unclebob-quality-tools-0BSD.txt). Exact
upstream license URLs, revisions and SHA-256 values are recorded in
[engineering-quality-sources.json](third-party/engineering-quality-sources.json).

No engine source, executable, grammar, Python environment or engine dependency is bundled with the
kit. The demonstration and integration instructions are original Composed work. Users prepare the
external tools separately; those checkouts and their dependencies retain their respective licenses.
An upstream tool's license does not establish the license of all its dependencies. Resolved dependency
versions and any resources fetched for an execution belong in that execution's environment record.

## Design reference: ub-mode

[ub-mode at `57a8bdd28e45ed41900ace0bafa2ff76dd9ed70f`](https://github.com/unclebob/ub-mode/tree/57a8bdd28e45ed41900ace0bafa2ff76dd9ed70f)
was examined as a design reference. Its reviewed Git tree contains `README.md` and `SKILL.md`,
without a declared license file. No ub-mode source or skill text is copied or translated into the
kit. The Composed instructions are independently written around general engineering practices,
Composed's own delivery policies and the documented interfaces of the separately licensed tools.

## Visual design methodology references

The design skills 2.0.0 use independently written Composed instructions, informed by these inspected
repositories. No upstream skill text, source code, runtime, font, photo or other asset is bundled or
translated. The shared concepts are contextual exploration, targeted review and checking actual renders.

| Project | Reviewed revision | Declared license | Reference paths |
| --- | --- | --- | --- |
| [Impeccable](https://github.com/pbakaus/impeccable/tree/b49177d32788f2dc585c42831d845dacf1ebed2c) | `b49177d32788f2dc585c42831d845dacf1ebed2c` | Apache-2.0 | `skill/SKILL.src.md`, `skill/reference/new-work-world.md`, `skill/reference/bolder.md`, `scripts/build.js` |
| [Taste Skill](https://github.com/Leonxlnx/taste-skill/tree/f6b76575f949707b4e3c37cd86cb44b0b98643e8) | `f6b76575f949707b4e3c37cd86cb44b0b98643e8` | MIT | `skills/taste-skill/SKILL.md`, `scripts/start.mjs` and `scripts/gate.mjs` within that skill |

Upstream asset licenses can differ from the repository license. Any future copying requires a separate
file-level license and notice review. See [design decisions and migration](docs/design-skills.md).

## Maintaining these records

When changing a pinned external tool, review its license and fetched resources again, update the
source record and retain the applicable license text. If code or documentation is actually copied
or adapted in a future change, identify the exact files, upstream revision, modifications and
applicable notices rather than describing that reuse as an external-tool reference.
