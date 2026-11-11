# Security policy

Security reports can concern the Build Kit CLI, generated instructions, installation/update/removal,
local evidence handling, package contents or research/product documents. Instructions and unsigned
local receipts do not authenticate approvals, isolate hostile code or guarantee agent compliance.
Run untrusted project code only within an appropriately restricted environment.

## Report privately

Use **Report a vulnerability** in this repository's GitHub Security area when that option is enabled.
The presence of this file does not enable private reporting. If the option is unavailable, open a
minimal issue asking the maintainer for a private security contact, without technical exploit details
or sensitive data, then wait for that channel before sharing the report. These alternatives follow
[GitHub's private-reporting guidance](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately).

Include the affected component and source revision, OS/runtime, prerequisites, expected trust boundary,
actual impact, a minimal synthetic reproduction and any proposed mitigation. Use disposable data;
never send credentials, customer records or a live destructive proof of concept. Explain whether a
finding is in Composed code, a dependency, runtime configuration or an unevaluated agent behaviour.

## Triage and support

This is a source beta maintained without a guaranteed response or fix timeline. Maintainers assess
reports against current source and the latest applicable component release; there is no promised
backport matrix. A mitigation or fix must identify affected versions, scope and validation, with
coordinated disclosure where possible. Do not infer a security certification from green tests or CI.

Before a public release, the maintainer must verify that the intended private reporting channel is
actually available. Repository visibility, reporting settings and registry publication are separate
maintainer actions; no workflow in this repository enables them automatically.
