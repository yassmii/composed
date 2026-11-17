# Validation de l'ensemble documentaire

Date : 17 novembre 2026. Exécution locale sous Windows, à la racine du dépôt.

| Contrôle | Résultat | Portée |
| --- | --- | --- |
| `npm run validate:contracts` | Réussi, code de sortie 0 | Schémas, références, couverture statique et traçabilité du corpus, y compris la nouvelle famille |
| `npm run test:contracts` | 70 tests : 69 réussis, 0 échec, 1 ignoré | Régressions de l'outillage ; cas ignoré propre aux noms de fichiers Linux |
| Recalcul SHA-256 des 6 corps récupérés | 6 correspondances | Empreintes comparées aux octets effectivement capturés, conservés temporairement hors dépôt |
| Vérification des liens d'acceptation | 37 clauses normatives couvertes par 25 scénarios | Couverture déclarative, sans exécution applicative |

`npm run verify:research` n'a pas été exécuté sur l'ensemble du corpus : il relit les sources distantes de toutes les familles. La correspondance vérifiée ici concerne les copies réellement récupérées pour cette recherche, pas une garantie de stabilité future des pages web.

La récupération directe de deux sources complémentaires a échoué : article Zenchef sur le compte à rebours et page OpenTable Plans. Elles ont été consultées via recherche web, restent identifiées comme complémentaires dans le comparatif et ne possèdent pas d'empreinte artificielle dans `sources.yaml`.

Tous les scénarios produit demeurent **not_run**. Pas d'application développée, pas de test de paiement réel, pas d'entretien utilisateur, pas de revue indépendante, pas d'approbation de mise en production. Le statut du contrat reste **draft**.
