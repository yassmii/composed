# Wealth analysis and advice — France

[Version française](README.fr.md)

Contract **`wealth-advisory@0.1.1`**, format **0.2**, status **draft**. 0.1.1 is the English
translation of 0.1.0, with no intended behaviour change.
It covers the full journey requested: fact-finding → balance sheet → diagnosis → scenarios →
recommendations → validation and delivery → follow-up. Primary user: a wealth
manager practising in France. No stack is chosen.

The first version deals with natural persons and named groups. This scope
is a design proposal, distinct from the choices already confirmed by the
owner: France, wealth manager, advice and follow-up included.

The French 0.1.0 package is archived unchanged under [history/0.1.0](history/0.1.0/README.md).
Where the English and French texts appear to differ, the French text is the reference. The
[author review](contracts/review.md) lists the term choices a bilingual and legally qualified
reviewer should check.

| Document | Purpose |
| --- | --- |
| [Contract](contracts/contract.yaml) | 9 capabilities, 29 requirements, 8 invariants, 5 policies, 3 quality attributes and 26 acceptance scenarios. |
| [Traceability](contracts/traceability.yaml) | Documentary basis or explicit choice for each clause. |
| [Research and comparison](research/comparison.md) | Documented behaviours, divergences and limits of the sources. |
| [Sources](research/sources.yaml) and [observations](research/observations.yaml) | Eight sources retrieved with hashes, ten atomic observations. |
| [Service profiles](contracts/service-profiles.md) | Explanation of scope by engagement, domain and model; no application configuration imposed. |
| [Author review](contracts/review.md) | Consistency of the draft and points to resolve before promotion. |
| [Validation](research/validation.md) | Checks on the document, distinct from the tests of a product. |

## What the contract standardises

- The balance-sheet calculation: assets, debts, ownership shares, currencies and dates without double counting.
- Unknowns, assumptions and supporting documents, without turning an absence into zero.
- The link between objectives, findings, compared strategies and reasoned advice.
- The human decision, the exact revision delivered and the client's decisions.
- Assigned follow-up, changes to re-examine and confidentiality of the file.

Simulations have an explicit frame: a tax, inheritance or retirement model
must state the situations and periods it can handle. The contract
does not promise to cover all French wealth law automatically.
An analysed group is not necessarily a tax household; an economic
share does not by itself define a borrower's liability.

## Agreed limits

Monitoring for **anti-money-laundering and counter-terrorist financing (LCB-FT) and asset
freezing is deferred**. Transactions, subscriptions and legal acts are not executed within this
scope. These limits do not release the professional from their obligations, and the product
gives no compliance green light for the missing modules.

The title of wealth manager does not confer the status of financial investment adviser (CIF),
insurance distributor or legal professional. The role and advice domains are
explicit per engagement; at least one domain must actually be covered.
Final validation remains human; automated assistance is optional.

## Status and next steps

All product scenarios are **not_run**. Documentary validation demonstrates
neither the correctness of an application, nor the suitability of real advice, nor overall
conformance. The status remains draft after the author review, with no independent review
claimed. The ten families integrated earlier and their archives are intact.

The next step is a business review of the scope and cases with the owner
or a designated professional: domains to actually cover, professional statuses,
priority quantitative models, deliverables and follow-up rules. The precise
changes remain to be discussed; the need for full advice is already confirmed.
Simplifying Composed remains a separate piece of work.
