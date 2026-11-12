# Comparative research and decisions

Consultation: **23 October 2026**. State: **initial**. The question is to define
a family of discovery, qualification and follow-up tools whose content sought
can change without rebuilding the product. The co-owned buildings (copropriétés) case
is used to test this generalisation; a private, unpublished scoping provides another
concrete path.

## Method and coverage

The research covers the official documentation of six products, texts
from public authorities, standards and primary technical guides. The
[hashed sources](sources.yaml) and [atomic observations](observations.yaml)
feed the [clause traceability](../contracts/traceability.yaml).

The findings describe what the products document; they prove neither
commercial effectiveness nor the compliance of an actual deployment. No product
account was tested and no supplier was evaluated on real prospects.
Plan and access limits prevent an announced capability from being equated with a
capability available in all contexts.

21 sources were retrieved independently with a SHA-256 hash. Two
additional references, Salesforce and Apollo, were read by web browsing
but refused or badly rendered during independent retrieval. They are
cited qualitatively below, with no false hash and no machine evidence link.
Live pages can change; a hash is not an archive. The national RNIC
file was neither downloaded nor audited.

## Observed features and differences

| Product | Documentary observation | Relevant limit or divergence | Decision for the contract |
| --- | --- | --- | --- |
| [Attio — data model](https://attio.com/help/reference/attio-101/attios-data-model/define-your-data-model-objects-lists-and-views) | Objects, relations, attributes and lists distinguishing identity data from the data of a process. | Custom types have their limits and rights; this does not demonstrate universality without configuration. | Target, contact person, relation and record per campaign kept separate; types and attributes in the profile. `CAP-PR-001/002`. |
| [HubSpot — scoring](https://knowledge.hubspot.com/scoring/understand-the-lead-scoring-tool) | Fit and engagement separable, decay and re-evaluation when the criteria change. | Retroactive re-evaluation differs from the need to reproduce a historical decision. | Four distinct dimensions, mandatory evidence and retained versions; explicit migration. `REQ-PR-003`, `CAP-PR-006`. |
| [HubSpot — sequences](https://knowledge.hubspot.com/sequences/unenroll-from-sequence) | Stops after a reply or a meeting, configurable; imperfect recognition of automatic replies. | The product allows certain triggers to be modified. Automatic detection is not infallible. | Mandatory pauses in the defined situations and review of ambiguities; a stricter choice. `CAP-PR-008/010`. |
| [Pipedrive — Leads Inbox](https://support.pipedrive.com/en/article/leads-inbox) | Leads before the pipeline, upcoming activities and history, conversion into deals. | Attachment to a person or organisation is required by Pipedrive. | Keep a review space, but also allow a project, asset or collective without a company or pre-existing contact. `CAP-PR-002/007/008`. |
| [Pipedrive — forms](https://support.pipedrive.com/en/article/web-forms) | Forms embeddable in the website, custom fields and entry as leads or deals; consent to be configured. | A submission is a statement, not a demonstrated qualification. | Minimal inbound form, handling of abuse and distinction between request and promotional agreement. `CAP-PR-004`. |
| [Clay — waterfalls](https://university.clay.com/docs/building-a-data-waterfall) and [signals](https://university.clay.com/docs/custom-signals) | Enrichments through ordered providers and tracking of changes from scheduled runs. | Obtaining a value, verifying its reliability and being able to reuse it are distinct questions. | Interchangeable sources; optional cascade and monitoring, budgets, provenance and stop condition. `CAP-PR-003/017`. |
| [Salesforce — duplicate management](https://trailhead.salesforce.com/content/learn/modules/sales_admin_duplicate_management/sales_admin_duplicate_management_unit_2) | Matching rules distinct from the decision to warn or block. | Qualitative reference: independent retrieval unusable. | Certain/possible matching and merge review are explicit choices; no universal name/city key. `REQ-PR-015/016`. |
| [Apollo — Buying Intent](https://knowledge.apollo.io/hc/en-us/articles/8047704465933-Buying-Intent-Overview) | Signals at company level; the people displayed are not necessarily those carrying out the research. | Qualitative reference: HTTP 403 on independent retrieval. | Keep the level of observation and do not attribute a collective intent to an individual. `REQ-PR-019/057`, explicit choice. |

There are therefore common patterns — configuration, qualification, activities and
progress — but no universal product whose screens it would be enough to copy.
The contract explicitly chooses a sharper separation between content,
identity, evidence, follow-up and the right to act. No capability is described as
a "convergence" merely because several marketing pages use it.

## What the co-owned buildings case changes

The [ANAH page for the RNIC](https://www.data.gouv.fr/datasets/registre-national-dimmatriculation-des-coproprietes)
is a candidate source for identifying co-owned buildings (copropriétés) and their characteristics.
It proves no need for an offer that is not yet defined. No contact,
voted project or commercial agreement is deduced from presence in the register alone.

[Service Public](https://www.service-public.gouv.fr/particuliers/vosdroits/N31338)
distinguishes the functions of the co-owners' association (syndicat), the managing agent
(syndic) and the co-owners' council (conseil syndical). The modelling choice
is therefore to keep linked entities and roles, with validity periods
that are known or unknown. The same intermediary can be involved in several
records without giving them a common identity. The actual offer can target the
association, the managing agent or another actor; this choice must be declared in the profile.

The [illustrative profile](../examples/coproprietes-fr.yaml) distinguishes a relevant
target from a commercially qualified lead. The latter requires evidence of
need, of role and of next step specific to the record. The criteria proposed,
including the threshold of lots, are illustrative choices to be validated with the requester.
They presume neither energy renovation, nor a change of managing agent, nor a particular
service: no offer was given in the request received.

## Good practice made verifiable

| Subject | Primary source and finding | Guarantee chosen and evidence expected |
| --- | --- | --- |
| Provenance | [W3C PROV-O](https://www.w3.org/TR/2013/REC-prov-o-20130430/) distinguishes attribution, derivation and invalidation. | A qualification exposes the origin, date and status of the facts used; test contradiction and staleness. `ACC-PR-010/011`. No graph format imposed. |
| Retries | [Stripe — idempotency](https://docs.stripe.com/api/idempotent_requests) and [events](https://docs.stripe.com/webhooks) document repetitions and disorder. | Identify an operation, reconcile the confirmations and suspend an uncertain send. `ACC-PR-017/028`. This is a transfer of a reliability pattern, not a payment requirement nor a promise of "exactly once" at every supplier. |
| AI | [OWASP — excessive agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) and [indirect injection](https://genai.owasp.org/glossaries/prompt-injection/) describe the risks of permissions and untrusted content. | Verify actions and transfers independently of the model; approval of the final message, injection tests and manual path. `ACC-PR-015/025/026`. Escaping text alone is not evidence of protection. |
| Accessibility | [WCAG 2.2](https://www.w3.org/TR/2024/REC-WCAG22-20241212/) provides verifiable criteria. | AA audit of the paths, keyboard, statuses, small screens and alternative to moving by drag and drop. `QA-PR-001`. A ticked grid of screens does not on its own prove conformity. |
| Email | [Google — senders](https://support.google.com/mail/answer/81126?hl=en) distinguishes general rules and volume-related rules. | Declare the requirements actually applicable, the identity of the sender, bounces, complaints and limits. `REQ-PR-031`. Do not promise the inbox. |

The time limits, trial volumes, user sample size, approval rules
and publication thresholds of the contract are **design choices**, not
universal values proven by these sources. Validation must measure them
in a declared environment and report the gaps.

## Personal data: points that prevent a naive generalisation

The [CNIL on electronic communications](https://www.cnil.fr/fr/communication-electronique-quelles-regles)
distinguishes the purpose of the message and the conditions applicable to individuals or to
professionals. The engine must therefore know the context of the recipient and of the
channel, not only the category of the target.

The [CNIL commercial management FAQ](https://www.cnil.fr/fr/questions-reponses-sur-les-referentiels-relatifs-la-gestion-des-activites-commerciales-et-des)
describes indirect notice, objection and the suppression list (liste repoussoir). Its
recommendation on the retention of prospects takes as its reference point the collection or a
contact coming from the prospect. It does not authorise extending retention with each
outbound follow-up.

The [CNIL reference framework (référentiel)](https://www.cnil.fr/sites/default/files/atoms/files/referentiel_traitements-donnees-caractere-personnel_gestion-activites-commerciales.pdf),
pages 2–3 and 11–12, specifies its scope, excludes in particular certain profiling
from third-party sources and rules out the mere opening of an email as a
new contact. The [reuse guide](https://www.cnil.fr/sites/cnil/files/2024-06/recommandations_reutilisateurs_donnees_publiees_sur_internet.pdf)
addresses separately the obligations linked to published data. The
[commercial canvassing (démarchage commercial)](https://www.cnil.fr/fr/demarchage-commercial) page mentions
a change to the telephone channel on 11 August 2026: the May 2026 documentary
framework of this private scoping is therefore not enough for a launch in October.

**Contract decision**: a compliance policy validated separately carries
the applicable permissions, purposes, channels, dates and periods. The business profile
cannot replace them. No rule of "three years everywhere", of presumed B2B
or of automatic compliance of any scoring is retained. Objections
apply before the following handovers and survive re-imports and restorations.

## SOTA: what is retained and what remains to be demonstrated

The synthesis retains relevant contemporary possibilities: configurable and
linked data, fit/engagement separation, composable sources,
monitoring of changes, acquisition-to-follow-up continuity and AI assistance under
control. The contract adds choices of precision: reproducible versions,
mandatory evidence, unknown states, scope of signals and reconciliation of sends.

It would be unfounded to claim that this document is the best prospecting system
or that a particular AI technique is SOTA for all targets. To evaluate
an implementation, `CAP-PR-016` requires:

1. A defined profile, offer, population and ground-truth criteria.
2. An authorised corpus not used to tune the method, and a simple baseline.
3. Distinct measurements of discovery, matching, qualification and drafting.
4. False positives, measurable false negatives, unknowns, coverage, costs and latencies.
5. Thresholds set before measurement and a decision to publish or roll back.

Recall over the whole Internet is not measurable without a reference universe. Broad
coverage of contact details demonstrates neither their accuracy, nor qualification,
nor an increase in sales. None of these results is announced as achieved.

## Questions to resolve in each deployment

- Which offer and which outcome define commercial qualification?
- Who is the target, who can reply and what evidence of role is necessary?
- Which sources are actually accessible, relevant and reusable?
- Which populations, jurisdictions and channel rules apply?
- Which volumes, budgets, follow-up time limits and quality thresholds are acceptable?

These questions are parameters of entry into service and of evaluation. They do not
block the definition of the generic core and are not resolved fictitiously
in the example profiles.


## Corpus refresh — 2026-11-01

See the [dated refresh review](README.md#corpus-refresh--2026-11-01) and
[source-by-source impact record](refresh-2026-11-01.json).

Re-read OBS-PR-005–009/015/018/020/021/027/029 against current Pipedrive, CNIL, Stripe and RNIC passages. The recorded patterns remain supported. Stripe source URLs now select official English Markdown; API-v1 key retention is limited, not indefinite deduplication. The RNIC page is metadata evidence only; its national data file was not downloaded. CNIL references remain contextual inputs to separately validated deployment policies, not blanket legal approval. Existing REQ-PR-008/014/025/030/037–040/048/050 and INV-PR-005/006/007 remain unchanged.

Baseline obligations are unchanged. Deferred follow-up: Validate actual source schemas and reuse permissions, policy populations/channels/dates, provider reconciliation after key expiry, and representative qualification evidence. Pipedrive form configuration does not establish valid marketing consent for a deployment.
