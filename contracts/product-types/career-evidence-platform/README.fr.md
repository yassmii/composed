# Career Evidence Platform

[English version](README.md)

Current canonical version: **1.0.1**, maturity **candidate** (1.0.0 with its validation profile reference corrected; see the [patch](candidates/1.0.1/proposal.md)). The maintainer
requested integration on 2026-11-01. Read [contracts/contract.yaml](contracts/contract.yaml),
[traceability](contracts/traceability.yaml) and the [current review](contracts/review.md).
The previous 1.0.0 and 0.1.0 packages are preserved under [history/1.0.0/](history/1.0.0/README.md) and [history/0.1.0/](history/0.1.0/README.md).
Candidate authoring records below remain historical; independent review/stable
promotion and implementation acceptance remain pending.


Proposition de contrat produit **1.0.0 — candidate**, intégrée le 1er novembre 2026, après actualisation
de la recherche initiale du 21 octobre 2026. Elle définit une famille de plateformes permettant à une personne
de comprendre, corriger et utiliser un parcours professionnel documenté.

Le résultat recherché est concret : apporter une première source, comprendre ce
qui en a été tiré, corriger une information, puis préparer une restitution utile
dont la personne maîtrise le partage.

- [Comparaison et limites des preuves](research/comparison.md).
- [Plan de recherche](research/RESEARCH-PLAN.md), [sources](research/sources.yaml)
  et [observations](research/observations.yaml).
- [Contrat normatif](contracts/contract.yaml) et
  [provenance des clauses](contracts/traceability.yaml).
- [Relecture et points à arbitrer](REVIEW.md).

Le socle couvre le parcours, les sources, la provenance, les corrections, les
compétences contextualisées, le guidage, les sorties, les permissions, les
traitements différés, la migration et l'évaluation. L'exploration de carrière et
les témoignages sont proposés comme modules `should` ; le réseau de contacts et
l'échange de justificatifs numériques comme modules `could`. Une fois un module
activé ou annoncé, toutes ses garanties s'appliquent.

Le contrat ne choisit aucun fournisseur, moteur de graphe, modèle d'IA ou
découpage physique de services. Les objectifs et contraintes propres à un produit
consommateur sont conservés dans son dépôt. Les données d'entretien et échanges
privés n'entrent pas dans la provenance publique de cette unité.

Les 65 exigences et 22 scénarios décrivent des comportements à démontrer. Ils ne
constituent ni une implémentation, ni des résultats d'essais, ni une preuve de
supériorité sur les produits étudiés. Les seuils d'utilisabilité et de réactivité
sont des propositions explicites à valider.

Le profil externe `career-evidence-platform/conformance@1.0.0`, porté par
`composed-validation`, définit les cas exécutables et les preuves complémentaires.
Son protocole d'adaptation reste dans le dépôt de validation ; aucune technologie
d'implémentation n'est imposée par cette référence.

## Proposed contract update — 2026-11-01

The [1.0.0 candidate](candidates/1.0.0/contracts/contract.yaml) strengthens 2 clauses
and retains the 0.1.0 [baseline](history/0.1.0/contracts/contract.yaml) unchanged. Acceptance
increases from 22 to 24 cases. See the [proposal and migration](candidates/1.0.0/proposal.md),
[exact clause changes](candidates/1.0.0/changes.json) and [author review](candidates/1.0.0/review.md).

Maturity is candidate, format 0.1. Independent review and stable promotion remain
pending; all product cases are not_run. Existing consumer pins and Build Kit do
not change. The [batch update](../../docs/contract-updates-2026-11-01.md) records
validation and deferred deepening.
