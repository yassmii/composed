# Harness de delivery logiciel agentique

[English version](README.md)

Current canonical version: **1.0.0**, maturity **candidate**. The maintainer
requested integration on 2026-11-01. Read [contracts/contract.yaml](contracts/contract.yaml),
[traceability](contracts/traceability.yaml) and the [current review](contracts/review.md).
The previous 0.1.0 package is preserved under [history/0.1.0/](history/0.1.0/README.md).
Candidate authoring records below remain historical; independent review/stable
promotion and implementation acceptance remain pending.


Contrat **`agentic-delivery-harness` 1.0.0**, **candidate**, intégré le 1er novembre 2026 (premier draft le 24 octobre 2026).
Il définit une famille d'outils qui coordonnent humains, agents, décisions et
preuves pour livrer du logiciel. Composed Build Kit est la baseline de rétrofit,
pas la définition universelle de cette famille.

| Document | Usage |
| --- | --- |
| [Contrat](contracts/contract.yaml) | 14 capacités, 37 exigences, 8 invariants, 6 politiques, 5 attributs de qualité et 26 cas d'acceptation. |
| [Traçabilité](contracts/traceability.yaml) | Clauses du noyau reliées aux observations ou à un choix explicite. |
| [Comparaison](research/comparison.md) | Mécanismes observés, divergences et arbitrages. |
| [Sources](research/sources.yaml) et [observations](research/observations.yaml) | 12 sources primaires récupérées et empreintées, 18 observations atomiques. |
| [Baseline](research/baseline.md) et [empreintes](research/baseline.json) | Build Kit 0.5.1, révision `35e6506`, fichiers inspectés et écarts. |
| [Vérification](research/validation.md) | Contrôles effectués et limites de cette rédaction. |
| [Évolution continue](../../docs/continuous-evolution.md) | Recherche, retours d'implémentation, propositions, versions et revalidation. |

## Socle et modules

Le socle couvre adoption, décisions utilisateur, routage proportionné, capacités
réelles, délégation, handoffs, validation, revue, évaluation et recherche continue.
Il ne choisit ni langage, ni modèle, ni fournisseur, ni topologie fixe d'agents.
Une question simple peut rester directe. Une délégation revendiquée doit être réelle.

Quatre modules sont facultatifs : contrôles événementiels/hooks, télémétrie,
graphe de connaissance des preuves, correction et préparation de livraison.
Leurs garanties s'appliquent lorsqu'ils sont activés. Le graphe peut commencer
par les artefacts et identifiants existants ; aucun stockage n'est prescrit.

Le graphe relie sources, observations, clauses, cas, révisions, preuves, incidents
et propositions. La recherche continue détecte aussi des nouveautés et contradictions
en l'absence d'incident. La télémétrie facultative alimente l'évaluation dans la
portée autorisée par chaque projet. Une correction peut avancer sous une autorisation
existante ; un score ne crée aucun droit de modifier le contrat ou de déployer.

## État et consommation

La baseline montre une méthode structurée et des instructions de gouvernance ;
sa conformité au nouveau contrat n'a pas été évaluée. Les hooks, le graphe partagé
et le superviseur externe ne sont pas livrés par ce draft. Le
[plan Runtime](../../../docs/composed-runtime/README.md) est une conception séparée.

Les références comparées apportent déjà davantage que des skills isolés. Aucun
benchmark de supériorité ni recette réelle d'un agent n'a été réalisé ici.
Les objectifs de qualité sont des cibles de conception, pas des mesures.

Lire le [protocole commun](../../AGENTS.md), le contrat et sa recherche. Déclarer
le périmètre et les modules, puis mapper les travaux aux `REQ-ADH-*` et `ACC-ADH-*`.
Les exigences métier des applications gardent leurs contrats propres.
Aucun profil externe exécutable n'est publié pour ce produit.

Depuis la racine : `npm run validate:contracts`. La vérification distante des
empreintes est distincte ; des sources non immuables peuvent évoluer.

## Version

- 0.1.0 — 2026-10-24 : premier draft de rétrofit, baseline et recherche comparative ;
  modules de hooks, télémétrie, connaissance et livraison encore proposés.

## Proposed contract update — 2026-11-01

The [1.0.0 candidate](candidates/1.0.0/contracts/contract.yaml) strengthens 2 clauses
and retains the 0.1.0 [baseline](history/0.1.0/contracts/contract.yaml) unchanged. Acceptance
increases from 24 to 26 cases. See the [proposal and migration](candidates/1.0.0/proposal.md),
[exact clause changes](candidates/1.0.0/changes.json) and [author review](candidates/1.0.0/review.md).

Maturity is candidate, format 0.1. Independent review and stable promotion remain
pending; all product cases are not_run. Existing consumer pins and Build Kit do
not change. The [batch update](../../docs/contract-updates-2026-11-01.md) records
validation and deferred deepening.
