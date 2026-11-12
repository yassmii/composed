# Illustrative profiles

[Version française](README.fr.md)

These three configurations illustrate the [logical interface](../contracts/targeting-profile.md).
They have the status **illustrative**, with `activation_ready: false`: the offer,
territory, connectors, policy and evaluation thresholds must be validated for
a real deployment. They are not an executable syntax that is already implemented.
Business thresholds and durations are design examples, not research results.
Their prose is in English since contract 1.0.1; keys, identifiers and file names keep
their French form.

| Profile | What it checks |
| --- | --- |
| [Co-owned buildings](coproprietes-fr.yaml) | Several targets can share a managing agent; knowing a co-owned building does not demonstrate a purchase project. |
| [Local businesses](commerces-locaux.yaml) | Prospecting local businesses can be a profile without local businesses, Google Maps or energy audits becoming universal. |
| [Digital projects](projets-numeriques.yaml) | A target can be a project with no mandatory address, company, phone number or email. |

For trials, complete the references with a test policy and test sources,
then use synthetic data with no real recipients. Scenario
`ACC-PR-001` expects these paths to be run in an implementation; the presence
of the examples is not that evidence.
