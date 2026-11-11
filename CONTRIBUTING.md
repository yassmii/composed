# Contributing to Composed

Start with the problem or behaviour you want to improve. A small correction needs a clear diff and
relevant checks; a larger change benefits from a short proposal before implementation. Reuse existing
decisions and keep reviews respectful, specific and grounded in evidence.

## Choose the component

- `build-kit/`: delivery instructions, skills, bridges, CLI, tests and examples; MIT licensed.
- `contracts/`: product requirements and research provenance; read its AGENTS.md and license before
  editing. A skill implementation is not a new product requirement.

The components version independently. Cross-component changes name the product clause and delivery
artifact affected; do not bump both versions automatically.

## Local setup

Use Node >=20 and npm from the same OS. From the repository root:

```bash
npm run validate:lockfile
npm ci
npm run typecheck:build-kit
npm run lint:build-kit
npm run test:build-kit
npm run eval:build-kit
```

For contract changes run `npm run validate:contracts`. For the Build Kit's executable evidence
example run `npm run eval:evidence --workspace=composed-build-kit`. Follow the component's existing
commands; a consumer project keeps its own stack and tooling. Do not share Windows node_modules
with native Linux. Git preserves LF endings on all supported development OSes.

## Change and validate

Keep unrelated work intact. Explain the trigger, resulting behaviour, scope and actual validation.
For an implementation defect, a regression that fails before the fix is useful. Documentation-only
changes may need source/link inspection rather than a new test. Do not describe phrase fixtures,
install checks or configured CI as proof that every agent runtime follows the method.

Skills ship in FR and EN, with matching boundaries and section structure. Read
[adding a skill](build-kit/docs/adding-a-skill.md); prefer improving an existing responsibility.
Preserve the direct/planned/complex distinction and user-owned stack decisions. Use only the work
artifacts the change needs; explicit review requests and material-risk gates still apply.

Update the changed component's Unreleased notes. Include limitations and skipped checks in your PR.
Maintainers own acceptance and release decisions. Contributions use the existing license of the
affected component; retain third-party attribution and do not copy restricted source material.

## Distribution and reporting

Run `npm run release:check --workspace=composed-build-kit` to inspect actual npm package selection.
This is a local content check, not publication authorisation or a hosted-CI result. The
[release guide](build-kit/docs/releases.md) describes candidate preparation and publication gates.

For ordinary bugs, include component, version/revision, OS/runtime, reproduction, expected/actual
behaviour and sanitised diagnostics. For vulnerabilities follow [SECURITY.md](SECURITY.md); do not
put exploit details, access tokens, customer data or live credentials in public issues.
