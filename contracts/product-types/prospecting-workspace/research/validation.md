# Vérification du dossier — 2026-10-23

Cette vérification porte sur les documents du contrat 0.1.0, pas sur une
implémentation de l'outil.

| Contrôle effectué | Résultat observé |
| --- | --- |
| `npm run validate:contracts` depuis la racine | Réussite : schémas, unicité des identifiants, acteurs et traçabilité pour toutes les unités du dépôt, dont `prospecting-workspace`. |
| Traçabilité de la nouvelle unité | 21 sources publiques récupérables, 29 observations et 103 clauses de capacités, exigences, invariants, politiques et qualité, chacune liée à des observations ou déclarée comme choix explicite. |
| Nouvelle récupération des 21 sources | Les 21 empreintes correspondent aux empreintes enregistrées, avec les fonctions de récupération et normalisation du vérificateur commun. Contrôle limité à cette unité; aucun verdict de fraîcheur sur les autres familles. |
| Références d'acceptation | Toutes les références de clauses dans `evidence` existent; les 57 exigences sont couvertes par une référence directe ou par leur capacité dans les 32 scénarios. Cette couverture documentaire ne prouve pas que les scénarios sont exécutables ou réussis. |
| Exemples et liens locaux | YAML lisibles; critères obligatoires et champs référencés existants; trois profils explicitement illustratifs avec blocages d'activation; liens Markdown locaux résolus. |
| Revue de contenu | Neutralité technique, séparation cible/interlocuteur/dossier, qualification sur preuves, inconnues, permissions séparées, reprises incertaines et limites de la recherche vérifiées dans les documents. |

Le contrôle ciblé des empreintes a chargé les mêmes fonctions `retrieve` et
`normalizeContent` que `contracts/scripts/review-traceability.mjs`, puis comparé
les contenus récupérés avec `research/sources.yaml`. Il n'ajoute pas un nouveau
vérificateur permanent au dépôt. Pour refaire le contrôle standard complet :

```bash
npm run verify:research
```

Les lectures web de Salesforce et Apollo restent qualitatives : absence de
contenu brut exploitable pour le premier, HTTP 403 pour le second. Aucun échec
n'a été masqué par une empreinte fictive. Le contexte Notion et local est séparé
des preuves publiques récupérables.

Aucun des scénarios `ACC-PR-*` n'a été exécuté contre un produit. Aucun test de
charge, audit d'accessibilité d'application, essai utilisateur, campagne réelle
ou benchmark de qualification n'est fourni par ce dossier. Le statut du contrat
reste **draft** et les objectifs de performance restent à mesurer.
