# Initial research and design decisions

State as at 4 November 2026. Research `initial`, without trial of the compared products.
The confirmed request is a complete wealth-advice journey for a wealth manager
(gestionnaire de patrimoine) in France, recommendations and follow-up included.
Anti-money-laundering and counter-terrorist financing (lutte contre le blanchiment de
capitaux et le financement du terrorisme, LCB-FT) and asset freezing (gel des avoirs) are
reserved for a later evolution.

## Research questions and scope

Which information should be linked to the balance sheet? How to distinguish inventory,
scenario and advice? Which traces make a recommendation and its follow-up re-examinable?
Sources retained: primary documentation of three products, AMF and CNIL, with
complementary reading of the ACPR recommendation. First pass bounded to these
sources and to the advice questions; no collection of client files and no purchase.
Before promotion, complete the regulatory sources per domain and obtain a
business review. Update the references when a change is reported, before
adoption in production or the addition of a domain; no automatic refresh
liable to change the contract without a decision and versioning.

## Documented comparables

| Product and primary source | Observation permitted | Limit and choice of the contract |
| --- | --- | --- |
| [Harvest Big](https://www.harvest.fr/produit/big/) | Wealth studies, simulations and reports. | Publisher's presentation, not evidence of accuracy or of comparative benefit. |
| [Big, guided entry (saisie guidée)](https://big-help.harvest.fr/changelog/23-04-2026-ouverture-de-la-saisie-guidee-pour-creer-vos-dossiers-avec-un-veritable-guide-dentretien-client/) | Personal/family fact-find journey, inventory and budget, then summary. | The title displays 27/04/2026 and the URL 23/04. Its tax shortcuts and its number of fields are not taken over as universal rules. |
| [RightCapital, Balance Sheet](https://help.rightcapital.com/module-overview/client-portal/dashboard/balance-sheet) | Assets/liabilities/net, detail by owner, dates and history. | The American taxonomy and the trust rules are not transposed to French law. |
| [MoneyGuide, FAQ](https://www.moneyguidepro.com/ifa/home/faqs) | Plans tied to objectives and to risk. | The projection method and models are not imported; no verified performance result. |

The documentary convergence concerns the structured fact-find, the wealth statement,
the objectives, the projections and the report. The precise rules on ownership shares,
no double counting, unknowns, calculation and validation are choices made explicit in
the traceability; they are not presented as guarantees observed in
all these products. A single vendor page is not enough to conclude that a practice is
universal or that it is the best user experience.

## French sources and boundaries

- [AMF, information on financial investment advisers (conseillers en investissements financiers, CIF)](https://www.amf-france.org/fr/espace-epargnants/savoir-bien-investir/choisir-un-professionnel/conseillers-en-investissements-financiers): distinguish the activity and the fact-find (recueil) that precede financial advice. Educational page, not a complete legal inventory.
- [AMF general regulation (règlement général de l'AMF)](https://www.amf-france.org/fr/eli), version displayed as at 11/09/2026, article 325-17: reasons for suitability (adéquation) and, for the periodic assessment service, examination at least annually, increased according to risk and instruments. This rhythm does not become that of all wealth advice.
- [CNIL, principles](https://www.cnil.fr/fr/cnil-direct/question/quels-sont-les-grands-principes-des-regles-de-protection-des-donnees): purpose, proportionality, retention, confidentiality and rights. The durations and legal bases applicable to the firm must be qualified separately.
- [ACPR, recommendation 2024-R-03](https://acpr.banque-france.fr/system/files/2024-12/20241022_recommandation_2024-R-03_0.pdf), consulted by browsing: insurance context, reasons and differentiated follow-up. Raw retrieval from the local verifier is refused with HTTP 403; **no PDF hash is invented**, nor any structured observation claimed to be sealed. This limit must be lifted for the complete provenance of the insurance domain before promotion. A recommendation of the authority is not treated indiscriminately as a legislative obligation.

The [AMF position DOC-2013-02](https://www.amf-france.org/fr/reglementation/doctrine/doc-2013-02)
was found during the first research. Its page indicates the end of applicability
after 11 October 2022. Its reference and the observation of this limit are kept
to avoid its reuse as a current text; **no normative clause is derived from it**.

The eight hashes in `sources.yaml` identify the bytes actually retrieved
on 4 November, not immutable official versions. The third-party bodies remain in
a temporary directory outside the repository; no complete article or PDF is redistributed.
A dynamic page can change hash without a business change. A new
difference calls for examination, not automatic replacement of a product decision.

## Trade-offs proposed, not yet approved as business policies

1. Start with natural persons and named groups; companies can
   be holding entities without implicitly opening advice to them in their own right.
2. Make the covered domains explicit; a generic simulation does not authorise
   announcing a complete tax or inheritance engine.
3. Allow a partial balance sheet, but refuse the validation of advice if a necessary
   piece of information is missing or if an incompatibility remains.
4. Keep the delivered revision for the authorised duration, without overwriting the previous opinion
   and without obstructing legitimate rectifications or deletions.
5. Require a human decision on the advice; do not make AI necessary to the journey.

Remaining to be qualified: statuses of the target firm, priority models and situations,
exact conditions of independent/non-independent advice, costs and applicable retention
periods, scope of the data, operating constraints and
feedback from a wealth manager on the reports. The documentary observations are
neither interviews nor user validation.
