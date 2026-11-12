# Author review — wealth-advisory 0.1.1

Original review date: 4 November 2026, on 0.1.0. Mode: `self-review`. Status kept: **draft**.
This is neither an independent review nor an approval by the owner.

## Translation to English as 0.1.1 — 2026-11-12

0.1.1 is the English translation of the French 0.1.0, with no intended behaviour change:
a patch. Mode: **author self-review only**; no bilingual or legally qualified person has
checked it. The French package is archived byte for byte under
[history/0.1.0](../history/0.1.0/README.md); where the English and French texts appear to
differ, the French 0.1.0 text is the reference and the fix is a further patch.

Checked mechanically against the French files: every key, identifier, order, priority,
actor, `depends_on`, `verifies`, verification block, observation link and `basis` value is
identical; only `version`/`contract_version` and prose values differ. No clause, requirement,
invariant, policy, quality attribute or acceptance case is added, removed, split or merged.
Quantities are kept; amounts are written with English separators (`400 000` → `400,000`,
`0,90` → `0.90`).

French legal, regulatory and professional terms are translated descriptively, with the
French term in parentheses on first use in a clause; no French concept is replaced by a
UK or US one. Term choices a bilingual and legally qualified reviewer should check:

- "gestionnaire de patrimoine" → "wealth manager"; "CGP" → "wealth management adviser
  (conseiller en gestion de patrimoine)"; "CIF" → "financial investment adviser (conseiller
  en investissements financiers)"; "cabinet" → "firm".
- "mission" → "engagement"; "lettre de mission" → "engagement letter"; "recueil" →
  "fact-find"; "dossier" → "file"; "bilan" → "balance sheet"; "constat" → "finding".
- "préconisation" and "recommandation" are both rendered "recommendation"; the French
  keeps two words. "conseil" → "advice"; "avis initial" → "initial opinion".
- "adéquation" → "suitability"; "déclaration d'adéquation" → "suitability statement";
  "cohérence avec les exigences et besoins" (insurance) → "consistency with the demands and
  needs"; "marché cible" → "target market". In the delivery section, "adéquation du
  périmètre" is rendered "appropriateness of the scope" because it is not the regulatory term.
- "habilitation" → "professional authorisation" for the adviser, but "access rights" for
  `ACT-WAD-ADMIN`; "autorisations" (`REQ-WAD-026/028/029`) → "authorisations".
- "LCB-FT" → "anti-money-laundering and counter-terrorist-financing"; "gel des avoirs" →
  "asset freezing"; "réception-transmission d'ordres" → "reception and transmission of orders".
- "foyer fiscal" → "tax household"; "indivision" → "undivided co-ownership";
  "démembrement" → "split of ownership into usufruct and bare ownership"; "communauté" →
  "community of property between spouses"; "solidarité" → "joint and several liability";
  "quote-part" → "share"; "personne morale" → "legal person"; "personne physique" →
  "natural person".
- "assurance-vie/capitalisation" → "life insurance or capitalisation contracts";
  "enveloppe" → "wrapper"; "supports" → "underlying investment vehicles".
- "transmission" (advice domain) → "wealth transfer"; "successoral" → "inheritance".
- "capacité à subir des pertes" → "capacity to bear losses" (`REQ-WAD-005`) and "capacité
  de perte" → "capacity for loss" (`REQ-WAD-017`, `ACC-WAD-004`), mirroring the French.
- "indisponibilité" → "restriction on availability"; "placement indisponible" → "locked-up
  investment"; "capital restant dû" → "outstanding principal"; "arbitrage" → "trade-off
  decision".
- "remise" → "delivery"; "remise constatée" → "established delivery"; "réexamen" →
  "re-examination"; "suivi" → "follow-up"; "échéance" → "due date" (but "end date" for a
  restricted retention); "restitution" → "presentation"; "réserves" → "reservations".
- "conservation active/restreinte" → "active/restricted retention"; "personne concernée" →
  "person concerned" (not "data subject"); "finalité" → "purpose"; "RGPD" → "GDPR".
- Lifecycle labels, actor names, entity names, glossary terms and quality-attribute names
  are translated. An implementation that exposes the French labels verbatim either keeps
  its 0.1.0 reference or maps them explicitly.

Contract SHA-256: `baed12e61588da61fd8639049d908b933565f937aca3bf0c9727c00cba6be90f`
(0.1.0: `d51dcabc5031a5f8cb75e374daeeef303c65e2821efd8670d9ced4c7c601265f`).
Traceability SHA-256: `8d05cd12ffb42194e0fb47a550ab8fd6242a8bb8981b86fbe7388535b28d2c42`
(0.1.0: `18d2f1288367028f084cb4cfaab45cfc99d06e986d20f0d7e1dac0fd31708039`).
All 26 product scenarios remain **not_run**. No evidence is transferred from 0.1.0. The
sections below are the 0.1.0 author review, translated; its reservations still apply.

## Points examined

- The journey includes the recommendations and their follow-up, in accordance with the owner's choice.
- The domains and professional authorisations (habilitations) are distinct from the title of
  wealth manager (gestionnaire de patrimoine) (`REQ-WAD-001/002`).
- Unknown data, ownership shares, debts, wrappers (enveloppes) and currencies have refusals and
  boundary cases (`ACC-WAD-002`, `005` to `008`).
- The scenarios are compared under visible assumptions and the specialised models are bounded
  (`ACC-WAD-010` to `012`); no unresearched tax scale (barème fiscal) is invented.
- Human validation bears on an exact version, including in the event of a concurrent change
  (`ACC-WAD-015/016/025`). It does not amount to client agreement or a transaction (`017/018`).
- The follow-up distinguishes due date, absence of answer and actual re-examination (`019/026`).
- The historical versions and the rules of legitimate deletion are articulated without imposing
  infinite retention (`INV-WAD-004`, `ACC-WAD-022/023`).
- The review of report understanding is manual (`ACC-WAD-014`); all the other
  cases require observations at the public interface, without an imposed transport.
- The exclusions of anti-money-laundering and counter-terrorist financing (LCB-FT) and asset
  freezing (gel des avoirs) become neither a compliant status nor an exemption from obligation
  (`POL-WAD-002`).

## Corrections arising from the re-reading

The profile cannot be empty (`REQ-WAD-002`). A validation that has become obsolete
is refused (`REQ-WAD-020`, `ACC-WAD-025`). The annual follow-up rhythm was limited
to the financial investment adviser (CIF) service concerned, with its own case
(`REQ-WAD-024`, `ACC-WAD-026`).
The historical AMF position that is no longer applicable supports no clause; the ACPR
retrieval limit is explicit instead of inventing a hash.

## Reservations before promotion

1. **`REQ-WAD-001/002/005/017/019/024`** — Have the service profiles reviewed by a
   competent professional, with the real statuses, the applicable texts and the remuneration
   arrangements. The ACPR source read by browsing remains without a hash of a retrieved body.
2. **`REQ-WAD-007/015`** — Choose and have reviewed the ownership rights and specialised
   models covered before claiming to handle taxation, wealth transfer (transmission) or retirement.
3. **`REQ-WAD-028/029`** — Define the retention and restoration rules applicable
   to the firm, without weakening the rights of individuals or the required traceability.
4. **`QA-WAD-003` and product metrics** — Collect business feedback on the reports and
   the journey; no interview or usage result is available in this drafting.

These reservations keep the contract in draft. No product case is declared
executed. The validations of the document are described in [validation.md](../research/validation.md).
