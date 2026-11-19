# Design direction and consumer upgrades

The update keeps `product-designer` (core) and `ux-shaping` (support). Their FR/EN versions are 2.0.0,
with catalog 3.7.0. It is recorded under Unreleased, not a published package or tagged release. It
changes the delivery method and existing `design.md` handoff, not product contract clauses or accepted
designs in consuming projects.

## What changes

`product-designer` critiques an existing interface or compares supplied directions. It evaluates
relevance, distinctiveness, usability and execution separately, using evidence rather than automatic
failure for a font, colour or style. A critique does not authorise edits.

`ux-shaping` creates a direction and usable flow from agreed product decisions. Open substantial work
explores different compositions grounded in audience and content; small refinements inherit the
existing identity. A delegated choice proceeds without another approval workshop. The handoff keeps
concrete visual decisions, states and intended checks in the existing work item's `design.md`, linked
to canonical product and brand documents.

Three references are loaded only when relevant: visual review, visual exploration and design craft.
They are independently authored instructions, not an upstream engine or asset library. No framework,
image service, Figma integration, detector, hook or dependency is installed.

## Update an existing project

Use the checked-out Composed CLI containing this update. The standalone npm package is not published.
Review the source revision and local changes; a dirty checkout is not a released artifact. Run these
commands **from the consuming project's root**, replacing the source path:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs source --json
node /path/to/composed/build-kit/bin/composed-kit.mjs update --skills=support --dry-run --json
```

`support` is additive and supplies `ux-shaping`; omit it if only the core critique skill is wanted.
The preview lists all proposed writes and conflicts for the installed levels. This is a normal kit
update, not a design-only patch: it may refresh other unchanged managed files in those levels. Agent
selection is preserved, as is language unless `--lang` requests a change. Use the same desired options
for preview and application. If there are no unresolved conflicts:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs update --skills=support --yes --json
node /path/to/composed/build-kit/bin/composed-kit.mjs doctor --json
```

Review the diff and doctor findings, run relevant project checks, then start a fresh agent session.
Updating instructions alone neither rewrites application UI nor reopens an approved design.

### Customised or older installations

- Ordinary update replaces missing or unchanged managed files. Local modifications or unrecognised
  older files block before writes. This also covers declared references and Cline mirrors.
- Preview `update --skills=support --keep-local --dry-run --json`, then replace `--dry-run` with
  `--yes` to apply. This preserves existing skills/references and installs missing ones. It can retain
  the old method, language or divergent references: **this is not a complete design upgrade**.
- For replacement, inspect conflicts and preserve project decisions in canonical documents or
  `.agents/project-instructions.md`. Preview `--force --dry-run --json`; use `--force --yes --json`
  only after reviewing all replacements. Force backs up conflicting regular files byte-for-byte to
  `.agents/backups/<id>/`; it does not merge instructions. Do not combine force and keep-local.
- Without a managed manifest there is no reliable baseline. An old generated heading is not proof
  of untouched content. Follow the [legacy adoption procedure](adoption.md#installations-before-managed-manifests).
- A new catalog version does not prove retained skills adopted the new behaviour. Check actual
  entrypoint versions, references and language. Local changes may need manual reconciliation.

Backups can contain private instructions: review before staging; the CLI does not edit host ignore
rules. They support manual reconciliation, not transactional rollback. Use the current CLI for later
maintenance: older binaries do not understand managed reference paths. To roll back the source, first
restore a matching project installation/manifest from a reviewed Git checkpoint; do not run an older
CLI against the new manifest.

### Expected files

Core installs `skills/core/product-designer/SKILL.md` with `references/visual-review.md` beside it.
Support adds `skills/support/ux-shaping/SKILL.md` with `references/visual-exploration.md` and
`references/design-craft.md`. With Cline selected, entrypoints and references are mirrored under
`.cline/skills/<name>/`. Other configured bridges refer to the shared skills as before.

Source references end in `.fr.md` or `.en.md`; installation selects the language and writes stable
`.md` names. A language change refreshes unchanged references. No general directory copy occurs;
undeclared resources remain project-owned.

Doctor detects missing references and divergent Cline copies. Repair restores eligible missing files
only when source provenance is compatible; it does not overwrite custom files. Uninstall removes
unchanged managed references and retains modified files, undeclared resources and design evidence.

## Validation and limits

`tests/design-upgrade.test.ts` installs previous 1.0.0/1.1.0 design templates in both languages with
the pre-reference catalog shape, then exercises the current updater. The executing CLI remains current
in this fixture: this is not a test of an archived executable or published package. Cases cover preview
without writes, core/support selection, language changes, manifest-less installations, customisations,
exact backups, missing-file repair, Cline and uninstall ownership.

Run focused tests from the repository root:

```bash
npm run test --workspace=composed-build-kit -- tests/design-upgrade.test.ts tests/skill-catalog.test.ts tests/package-selection.test.ts
```

Behavioural scenarios in `evals/scenarios.json` cover pinned brands, narrow scope, delegated creative
choice and unavailable rendering tools. Fixture-mode evals test routing/grader plumbing, not creativity.
Independent text-only forward tests of a FR checkout critique and EN cinema direction found no blocking
instruction issue; they do not establish visual quality or performance.

For a later visual comparison, use six fixed briefs: local business, SaaS landing page, dense
operational app, editorial publication, portfolio and existing brand extension. Include pinned
conventional fonts/colours and missing assets. Compare old/new skills with the same model, tooling
and budget over multiple generations. Review anonymised renders for relevance, structural diversity,
coherence, task clarity and brand preservation; separately exercise responsive, keyboard and recovery
behaviour. Record duration, tokens and rework when available. A linter pass or preferred screenshot
alone does not establish product value. No comparative visual improvement is claimed by this update.

## References and deliberate differences

- [Impeccable at b49177d](https://github.com/pbakaus/impeccable/tree/b49177d32788f2dc585c42831d845dacf1ebed2c):
  contextual direction, targeted interventions, progressive references and rendered review informed
  the approach. Composed does not import its engine, catalogue, live mode or mandatory selection flow.
- [Taste Skill at f6b7657](https://github.com/Leonxlnx/taste-skill/tree/f6b76575f949707b4e3c37cd86cb44b0b98643e8):
  concrete content, varied compositions and browser checks informed the approach. Composed does not
  import its assets, random dealers, full-screen section rule or mandatory motion.

See [third-party notices](../THIRD_PARTY_NOTICES.md) for provenance and license scope.
