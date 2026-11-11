# Handoff — contrat d'analyse et conseil patrimoniaux

Date : 4 novembre 2026. État : premier brouillon rédigé et contrôlé, à revoir métier.
Sources canoniques : [famille wealth-advisory](../../../contracts/product-types/wealth-advisory/README.md).

## Demande confirmée

Gestionnaire de patrimoine en France. Parcours complet : analyse, scénarios,
préconisations et suivi. Le propriétaire a choisi le conseil complet, pas seulement
un bilan. Suivi LCB-FT et gel des avoirs plus tard. Simplification de Composed
reportée après le travail sur le contrat ; aucune refonte du kit dans cet incrément.

## Livré

`wealth-advisory@0.1.0`, format 0.2, statut draft : neuf capacités, 29 exigences,
huit invariants, cinq politiques, trois qualités et 26 scénarios d'acceptation.
Recherche initiale : trois produits comparés, sources AMF/CNIL, huit sources
récupérées avec empreintes et dix observations. ACPR consultée par navigation,
récupération brute refusée ; cette limite reste visible. DOC-2013-02 écartée
comme texte actuel. Traçabilité, revue d'auteur et profils de service documentés.

Le périmètre personnes physiques/groupes, les règles précises de contrôle et de
restitution sont des propositions de ce brouillon, pas une approbation implicite
du propriétaire. Les statuts professionnels et domaines effectivement couverts
restent à préciser ; le titre CGP n'implique pas automatiquement CIF ou distributeur.

## Validation

Voir [validation documentaire](../../../contracts/product-types/wealth-advisory/research/validation.md).
Validation contrats/traçabilité réussie ; 70 tests contrats réussis, zéro ignoré ;
exemple de vérification synthétique réussi. 45 clauses normatives ont une couverture
statique déclarée. Aucun cas patrimonial exécuté, aucune application ni stack créée.
Mode de revue : `self-review`, aucune indépendance revendiquée.

Le test du lot d'intégration historique nomme maintenant ses dix familles ; leurs
contrats et archives restent inchangés. Aucun commit, push, tag ou promotion stable
n'est effectué pour cette rédaction ; les fichiers sont disponibles pour relecture.

## Prochain geste

Propriétaire/lecteur métier : revoir le contrat concret, en priorité domaines et
services attendus, modèles chiffrés prioritaires et contenu du rapport. Agent :
appliquer les corrections retenues, compléter la provenance assurance, puis préparer
une revue indépendante avant de proposer une promotion candidate. Aucune nouvelle
discussion de la vision Composed ni implémentation automatique d'un produit.
