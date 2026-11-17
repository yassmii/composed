# Application de réservation de restaurants

Contrat produit **0.1.0 — draft**, format Composed **0.2**, rédigé en français le **17 novembre 2026**. Il définit une première application concurrente de Zenchef, sans imposer de langage, infrastructure ou fournisseur. Ce document est une spécification produit, pas un contrat commercial de prestation.

## Lire et utiliser

1. [Recherche concurrentielle et décisions](research/comparison.md).
2. [Contrat normatif](contracts/contract.yaml) : 11 capacités, 21 exigences, 6 invariants, 6 politiques, 4 critères de qualité et 25 scénarios d'acceptation.
3. [Sources](research/sources.yaml), [observations](research/observations.yaml) et [traçabilité des clauses](contracts/traceability.yaml).
4. [Revue et limites de validation](contracts/review.md).

La cible proposée est le restaurant indépendant en France : le restaurateur gère ses services et ses tables ; le client réserve depuis un lien ou le site du restaurant, sans compte imposé. La plateforme héberge plusieurs restaurants, mais leurs espaces et fichiers clients sont isolés.

Le MVP couvre la configuration, les disponibilités, la réservation directe, le cahier de salle, les modifications et annulations, la liste d'attente, la garantie bancaire optionnelle, les notifications, le fichier client, la migration, les droits et les indicateurs. « Garantie optionnelle » signifie activable par le restaurant ; sa mise en œuvre sûre fait partie de cette version.

## Choix de périmètre

| Maintenant — contrat 0.1.0 | Ensuite — extension à cadrer | Plus tard — hypothèses |
| --- | --- | --- |
| Réservation directe et conduite du service | Connecteurs Google/Meta après vérification des accès partenaires | Marketplace de découverte |
| Annulations, attente, garantie supervisée | SMS, acomptes et expériences avec règles propres | Assistant vocal IA |
| Import/export et indicateurs vérifiables | Gestion de groupes et CRM multi-établissements | Fidélité et campagnes avancées |

Les colonnes suivantes ne sont ni des exigences cachées ni des engagements de livraison. Aucun prix d'abonnement n'est fixé. Le modèle recommandé est un abonnement sans commission sur les réservations directes, avec coûts des prestataires explicités.

## Hypothèses à valider

- Le besoin principal est un outil B2B de réservation et de salle, avec parcours public client ; pas une marketplace dès le lancement.
- Le premier marché est la France et les interfaces publiques sont français/anglais.
- Les établissements accepteront une garantie bancaire supervisée, mais l'intérêt commercial et les conditions prestataire restent à vérifier.
- Les seuils de performance, durées de conservation et objectifs du pilote sont des décisions initiales, pas des résultats démontrés.

La question de différenciation reste ouverte : les fonctions de base existent déjà chez les concurrents. Le pari proposé porte sur la mise en route, la reprise des données et la rapidité d'usage en service. Il doit être confronté à des restaurateurs avant de promettre un avantage commercial.

## Passage à l'implémentation

Lire d'abord `contracts/AGENTS.md`. Chaque travail devra nommer une exigence `REQ-*` ou une acceptation `ACC-*`. Les obligations du YAML sont normatives ; les métriques de pilote sont des objectifs d'apprentissage. Les priorités `must` ne peuvent pas être supprimées silencieusement pour réduire le budget : proposer une nouvelle version ou un périmètre explicitement distinct.

| Capacités | Compétences / skills de livraison | Couverture manquante à traiter |
| --- | --- | --- |
| CAP-CONFIG, CAP-AVAIL, CAP-BOOK | product-manager, product-designer, skill-cadrage, skill-technique | Observation terrain du processus de réservation |
| CAP-SERVICE, CAP-CHANGE, CAP-WAIT | product-designer, skill-technique, skill-test-generator, skill-qa | Validation d'usage par une équipe de salle |
| CAP-GUARANTEE, CAP-NOTIFY | skill-technique, skill-test-generator | Expertise du prestataire de paiement, messagerie et réconciliation |
| CAP-DATA, CAP-ACCESS | skill-technique, skill-test-generator | Revue spécialisée sécurité et confidentialité |
| CAP-REPORT et preuves transverses | skill-test-generator, skill-qa, skill-doc-generateur | Revue humaine indépendante, accessibilité, charge et restauration |

Cette table prépare le travail ; elle ne prescrit pas de pile technique et n'affirme pas que les skills remplacent les spécialistes. Le Build Kit reste un choix de méthode de livraison, distinct du contrat produit.

Validation depuis la racine du dépôt : `npm run validate:contracts`, puis `npm run test:contracts`. Ces commandes ne testent pas une application de réservation ; les 25 acceptations produit restent **non exécutées**.
