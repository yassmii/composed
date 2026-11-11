# Validation documentaire — 4 novembre 2026

Contrat évalué : `wealth-advisory@0.1.0`, format 0.2, statut **draft**.
Environnement : Linux Node 24.15.0, dépendances existantes ; aucune réinstallation.
Revue par l'auteur, sans revue indépendante revendiquée.

| Contrôle réellement exécuté | Résultat |
| --- | --- |
| `npm run validate:contracts` | Succès pour les contrats courants, candidats, archives et templates ; traçabilité de la nouvelle famille comprise. |
| `npm run test:contracts` | **70 tests réussis**, zéro ignoré ; inclut les identités exactes des dix familles historiques et les provenances de leurs archives. |
| `npm run example:contracts` | Exemple synthétique réussi : référence acceptée, contre-exemple sémantique rejeté, checker modifié périmé et dépendances sélectionnées. Aucun produit patrimonial exécuté. |
| Couverture statique | **45 clauses normatives** reliées explicitement aux **26 scénarios** ; chaque capacité et clause dispose d'un fondement ou d'un choix explicite. |
| Sources | Les huit empreintes enregistrées correspondent aux octets récupérés pendant la rédaction. La source historique AMF reste explicitement écartée des fondements normatifs. |

L'adaptation du test `candidate-integration.test.mjs` nomme les dix familles du
lot d'intégration du 1er novembre au lieu d'assimiler toute nouvelle famille à ce
lot historique. Les dix contrôles restent exigés ; aucune intégration ni archive
fictive n'est créée pour le nouveau brouillon.

Le contrôle de provenance locale porte sur les corps consultés dans
`/tmp/composed-patrimonial-research-jbwn_cwx/`, qui peut disparaître. Le dépôt garde
URL, date, version connue, localisateur, empreinte et observation ; il ne redistribue
pas les corps tiers. Pas de nouvelle vérification réseau de tout le corpus existant.
Les versions SaaS non publiées restent non identifiées plutôt que déduites d'une date.

La recommandation ACPR consultée par navigation n'a pas pu être récupérée en brut
(HTTP 403) ; aucune empreinte n'est fabriquée. Les limites et les questions métier
restantes sont dans [comparison.md](comparison.md) et la [revue d'auteur](../contracts/review.md).

**Tous les cas patrimoniaux restent `not_run`.** Les exemples chiffrés indiquent
des résultats attendus, pas des résultats observés dans une application. Ni profil
de validation externe, ni modèle fiscal exécuté, ni conseil réel, ni observation
client ne sont revendiqués. Les contrôles logiciels et de schéma ne remplacent pas
la revue d'un professionnel ni la décision d'adoption du propriétaire.
