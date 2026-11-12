# Engagement, service and model profiles

This document explains the parameters referred to by the [contract](contract.yaml).
It defines neither a mandatory technical schema nor an additional hidden rule.
The normative identifiers remain those of the YAML.

## Engagement and service

`REQ-WAD-001/002/005/017/019/024` require being able to identify:

| Information | Question to resolve in an implementation |
| --- | --- |
| Responsible professional | Who advises, under which declared statuses and professional authorisations (habilitations), for which firm? |
| Scope | Which persons, jurisdictions, analyses and advice operations are included? |
| Domain and service | Diagnosis, financial investment, insurance, taxation, wealth transfer (transmission), retirement or real estate; which precise service is provided? |
| Validation conditions | Which answers and documents are relevant, which inconsistencies are blocking, according to which dated rule? |
| Remuneration | Which fees and links of interest are presented; independent or non-independent advice where this distinction applies? |
| Follow-up | Which obligation or agreement sets the trigger, the starting point, the frequency and the time limits; which version of this rule? |

The financial domain and the insurance domain do not share a universal
attestation. The contract provides for both journeys, with the data and controls
that are specific to them. A profile cannot remove a requirement of the contract,
pass off an unknown field as filled in or declare an incompatible product
suitable. It serves to specify the reach of the advice actually covered.

The minimum annual periodicity provided for a periodic assessment by a financial
investment adviser (conseiller en investissements financiers, CIF) is
conditional on that service. An applicable more frequent obligation takes precedence over
the rule of the firm. For insurance and the other domains, the rules and their
transitions must be verified separately; no universal duration is inferred.

The data-processing framework distinguishes the roles, purposes, categories,
persons concerned, recipients, active/restricted retentions and authorised
deletions (`REQ-WAD-026` to `029`). "Five years for everything" is not set by convention.

## Calculation model

`REQ-WAD-009/010/013/014/015` and `QA-WAD-001` require the conventions to be retrievable:

- currencies, exchange rates, value dates and freshness rule;
- ownership rights, economic shares and distinct allocation of debts;
- treatment of wrappers (enveloppes) and underlyings to avoid double counting;
- periods, flows, rounding rules and calculation method;
- assumptions and inclusion or exclusion of inflation, fees and taxes;
- situations and periods covered by the specialised models, sources and reviewed references.

An educational annual compound model at 2% can exercise the comparison of
scenarios; it does not prove a calculation of the taxation of life insurance
(assurance-vie), of inheritance or of retirement. These need their own references and their review.
The numerical cases of the contract are synthetic situations without private data.

## Capabilities needed for a future implementation

| Clauses | Skills to mobilise, provided or external |
| --- | --- |
| Engagement, discovery and diagnosis (`REQ-WAD-001` to `012`) | French wealth expertise; product framing; design of the fact-find (recueil). |
| Scenarios and recommendations (`013` to `019`) | Calculation engineering; independent tests; tax, inheritance or insurance expertise according to the models covered. |
| Validation, delivery and follow-up (`020` to `025`) | Journey design; management of versions and authorisations; business acceptance testing (recette métier). |
| Data and continuity (`026` to `029`) | Security, data protection, migrations and controlled restoration. |

The generalist skills of the Build Kit can help deliver and verify the software.
They do not replace wealth, regulatory, tax or inheritance expertise.
This business capability is not provided by the kit; it remains to be identified before
validation of the models and real adoption. No technical plan or choice of stack
is decided by this table.
