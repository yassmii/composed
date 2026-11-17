# Revue auteur — restaurant-reservations 0.1.0

Statut : **draft**. Date : **17 novembre 2026**. Revue de rédaction par l'auteur, non indépendante ; aucune acceptation humaine du produit ni autorisation de déploiement n'est revendiquée.

## Périmètre examiné

- Séparation entre sources concurrentielles, interprétation et choix du projet.
- Références acteurs/capacités et chaîne sources → observations → clauses.
- Neutralité technologique : aucun langage, base de données, hébergeur ou prestataire imposé.
- Liens explicites `acceptance.verifies` et dimensions de preuve en format 0.2.
- Concurrence sur tables combinées, expiration exacte des options, mise à jour obsolète, modification atomique, doublons de prélèvement, reprise et isolation.

## Décisions et limites à revoir

| Clauses | Constat | Suite attendue |
| --- | --- | --- |
| POL-DIRECT, scope, MET-ONBOARD | Cible France, outil direct et simplicité proposés ; pas de preuve de demande ni d'avantage sur Zenchef | Valider le segment et tester la mise en route avec restaurateurs |
| REQ-GUARANTEE, REQ-CHARGE, REQ-PAYFAIL | Cycle défini mais aucun fournisseur qualifié ; garantie différente d'acompte | Vérifier les capacités et conditions du prestataire avant implémentation définitive |
| POL-PRIVACY, REQ-EXPORT | Durées et exceptions sont des choix, pas des obligations légales sourcées ici | Revue confidentialité et documentation avant production |
| QA-PERF, QA-RECOVERY, QA-ACCESS | Seuils testables proposés, non mesurés | Exécuter charge, restauration et tests utilisateurs sur l'application |
| QA-SECURITY, REQ-ACCESS | Limites anti-abus de base, sans prétention de couverture de toutes les attaques | Revue de sécurité indépendante avant pilote ; adapter par version si nécessaire |
| REQ-STATE | Le dépassement réel d'un repas peut affecter l'accueil suivant malgré une planification correcte | Tester l'alerte en service ; ne pas confondre absence de double vente et garantie de ponctualité physique |

## Preuves

Les 25 scénarios `ACC-*` sont **not_run** : ce dépôt ne contient pas l'application. Le validateur structurel vérifie le format, les identifiants, la traçabilité et les liens de couverture ; il ne démontre ni le comportement produit, ni l'exactitude de toutes les interprétations de marché, ni une conformité juridique.

Les résultats des commandes de validation du dépôt sont consignés dans [validation.md](../research/validation.md). L'absence de relecture indépendante interdit de présenter cette revue auteur comme une approbation externe.
