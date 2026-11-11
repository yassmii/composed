# Prepare and release the Build Kit

The Build Kit is a source beta. Product contracts have a separate version and license. The current
package is private and is not published to npm; source tags and a reviewed checkout are the supported
distribution path. Do not overwrite an existing tag or publish a changed artifact under an old release.

## Contributor check

From the root after `npm ci`:

```bash
npm run release:check --workspace=composed-build-kit
```

This runs npm's actual package selection with lifecycle scripts disabled, validates required CLI,
template, bilingual skill and documentation files, rejects development/private paths and checks
package/CLI version agreement. It creates no tarball and publishes nothing. A passed content check
does not establish release readiness, a clean revision, dependency safety or actual runtime support.
See [npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack/) for the pack options.

## Maintainer candidate

1. Choose the Build Kit version and release owner. Update its package version, CLI constant, root
   workspace lock metadata and component changelog together. Leave contracts unchanged unless their
   actual contents require their own release. Commit and review the complete candidate; preserve
   existing tags. Unreleased source changes at a tagged package version are not a new release.
2. From that exact clean revision, run the component type/lint/tests, catalog/fixtures, executable
   evidence, deterministic benchmark calibration and package check. Record command results and
   omissions. Inspect actual hosted CI for the candidate revision; configured jobs are not results.
3. Prepare a new empty directory outside the repository and create the local tarball:

   ```bash
   npm pack --workspace=composed-build-kit --ignore-scripts --json --pack-destination=/absolute/candidate-directory
   ```

   Inspect the returned file list and record the revision, root lock SHA-256, package filename/version,
   artifact SHA-256, Node/npm/OS and check evidence. This makes preparation repeatable and artifacts
   identifiable; byte-identical archives across different npm versions are not promised. Preserve
   the candidate instead of silently replacing an already reviewed archive.
4. In a disposable consumer outside the checkout, install that exact local tarball with no lifecycle
   scripts and smoke its actual executable:

   ```bash
   npm install --prefix /absolute/consumer --ignore-scripts --no-audit --no-fund /absolute/candidate-directory/composed-build-kit-VERSION.tgz
   node /absolute/consumer/node_modules/composed-build-kit/bin/composed-kit.mjs --version
   node /absolute/consumer/node_modules/composed-build-kit/bin/composed-kit.mjs init --cwd=/absolute/disposable-project --yes --lang=en --agents=codex --skills=core,support
   ```

   Use a new empty disposable project, then exercise `doctor`, `knowledge check`, `preflight`, `update`
   and preview/apply uninstall against its generated files. Verify custom content survives. Record
   any install/cache/network limit; a source-checkout execution is not this package smoke. Package
   dependency resolution uses its declared ranges, not the repository's exact root lock. For an
   offline smoke add npm's `--offline`; a missing cache entry is unavailable evidence, not a pass.
5. Prepare release notes with compatibility limits, migration instructions, fixes and known issues.
   Verify the security reporting channel, contribution path and intended repository visibility.

## Separate external actions

Only after concrete candidate review and applicable user authorisation should the maintainer create
a new component tag, publish a GitHub release/change visibility, or configure/publish a registry
package. This lot creates none of those. Registry name/ownership, package privacy, credentials and
trusted publication must be chosen explicitly; there is no publish workflow or registry token here.

After an authorised release, verify the remote tag/artifact identity and installation from that
actual distribution. A local tarball smoke is not proof of a published package. Preserve prior
artifacts; recover via a new corrective release or the authorised previous artifact rather than
retagging history. Do not promise rollback of user data or project-owned modifications.
