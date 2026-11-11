# Recherche — espace de travail collaboratif

[English version](README.md)

Cette recherche s'appuie sur Notion et Airtable pour la surface fonctionnelle, puis sur AppFlowy, AFFiNE, Docmost, Anytype et Any pour les exigences de liberté, d'auto-hébergement, de local-first, de collaboration et de performance.

Le résultat important n'est pas de recopier ces produits. AppFlowy et Docmost démontrent des cœurs AGPL, AFFiNE démontre l'intérêt de documents + canvas + tables mais aussi le risque d'une frontière Enterprise, et Anytype démontre qu'un produit « source-available » ne respecte pas à lui seul la définition d'un produit complètement libre. Any sert de référence de brique locale, chiffrée et convergente, et non de produit fini.

Les sources sont volontairement étroites et attribuables. Elles documentent les comportements observables; les choix de conception propres au contrat sont explicitement marqués dans `../contracts/traceability.yaml`.

Les pages d'aide sont des ressources vivantes. Les empreintes de contenu permettent à `npm run verify:research` de signaler une dérive avant la promotion du contrat.


## Corpus refresh — 2026-11-01

Status: **recorded corpus rechecked**. This is a bounded update of 30 existing sources: 26 initial hashes unchanged, 4 changed and reviewed, 0 unavailable.

Re-read OBS-CWS-005/006/008/009/010/015 against current Notion/Airtable passages: access levels, page-level rules, attributed history, restore and automation run/configuration history remain supported. New notes preserve counterevidence: broadest permission wins in Notion; restoring a database does not restore nested page bodies; Airtable record revision history has no product export or history-read API. These do not establish the stronger Composed recovery, access and portability guarantees. REQ-CWS-030/031/032, INV-CWS-004/015 and POL-CWS-007 remain unchanged.

Deepen effective permission composition, database/page/attachment restore scope, portable history and retention versus erasure; run conflict/offline and recovery fixtures. Do not transfer vendor UI guarantees to the complete workspace.

[Source-by-source record](refresh-2026-11-01.json) includes previous/current hashes,
retrieval errors, dependent observations and affected clauses.
[Original source manifest](history/sources-before-refresh-2026-11-01.yaml) preserves prior records.
Old response bodies are unavailable: hash drift does not date or classify a historical
behaviour change. New observations are research inputs, with no automatic normative adoption.

Owner for this manual pass: repository agent; decision authority: Composed maintainer.
Budget: the recorded corpus and changed passages, with a second retrieval of changed
sources; no new provider survey, runtime experiment or background schedule. Revisit
on source drift or the requested deepening pass. Research maturity remains initial;
this author review does not promote a contract or certify an implementation.
Baseline contract/traceability bytes, consumer pins and Build Kit remain unchanged.
All product cases are not_run; existing proof is not transferred.
