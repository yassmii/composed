---
name: automated-testing
description: >
  Ajoute ou améliore les tests automatisés comportementaux et leur infrastructure. USE THIS SKILL pour
  les tests unitaires, d'intégration, de contrat, E2E ou instables ; utilise qa pour la recette manuelle
  et release-engineering pour les pipelines de livraison au-delà de l'exécution des tests.
license: MIT
metadata:
  author: composed-build-kit
  version: "2.2.0"
---

> **Utilise ce skill** pour produire des preuves exécutables du comportement et prévenir les régressions pertinentes.
> **Utilise systematic-debugging** si la cause d'un échec reste inconnue.

# Tests automatisés

Charge ce skill si la conception des tests ou leur infrastructure nécessite cette expertise. Exécuter
les contrôles natifs existants ou ajouter une régression ciblée ordinaire dans un correctif direct
n'impose ni second skill ni second lot. Les contrôles d'un correctif direct peuvent être rapportés dans
la réponse ; conserve preuves durables et revue si le mode de delivery choisi dans le catalogue l'exige.

## Choisir les preuves selon le risque

Lis le README du projet d'accueil, ses manifests natifs, les tests et critères d'acceptation existants.
Relie chaque règle matérielle, frontière ou défaut signalé à une assertion observable. Si un Composed
Contract s'applique, garde requirement.id ou acceptance.id dans le test ou la table de preuves.
N'invente pas de pourcentage de couverture et ne promets pas une confiance totale. Une correction
réversible de formulation peut se vérifier par inspection sans test supplémentaire.

Choisis le niveau le moins coûteux capable d'exposer l'échec :

- tests unitaires pour les règles métier déterministes ;
- intégration pour la persistance réelle, les transactions et les adaptateurs externes ;
- contrats pour les schémas consommateurs/fournisseurs et leur compatibilité ;
- une petite suite E2E pour les parcours critiques, erreurs et permissions importantes comprises.

Considère entrées vides, limites, invalides, dupliquées, concurrentes ou désordonnées si le comportement
en dépend. Les tests génératifs aident quand les invariants couvrent beaucoup d'entrées ; utilise les
outils établis et une graine reproductible. N'ajoute de complexité que pour mieux détecter un défaut utile.

## Construire des tests indépendants

Pour un bug reproductible, démontre d'abord un test de régression en échec si possible. Pour un nouveau
comportement, écris le test en premier s'il clarifie le contrat, puis implémente et refactore. Teste
les résultats, pas les noms des fonctions privées ni une copie de l'implémentation.

Contrôle horloges, aléatoire et identifiants si nécessaire. Isole l'état base/fichiers de chaque test
et nettoie les fixtures. Simule les services indisponibles à une frontière stable, mais vérifie
l'adaptateur séparément et aligne les mocks sur le contrat réel. Une réponse simulée ne prouve pas que
le service fonctionne. N'utilise pas de secrets de production ni de données clients comme fixtures.

Pour le navigateur, préfère rôles utilisateur, sélecteurs stables, attentes conditionnelles et comptes
isolés. Capture traces ou screenshots en cas d'échec sans exposer de secrets. Diagnostique les tests
instables ; retries inexpliqués et quarantaine indéfinie ne sont pas des corrections. Toute quarantaine
temporaire a un propriétaire et une condition de sortie.

## Évaluer la sensibilité des tests si utile

Pour une règle critique ou une assertion suspecte, utilise éventuellement Mutator, ou l'outil de
mutation déjà établi du projet. Un correctif direct n'exige pas cette campagne. Choisis une version
et un périmètre explicites, inspecte les effets du lanceur et prépare ses dépendances séparément
avec l'autorité du projet ; le chargement du skill n'installe rien. Borne durée et parallélisme.

Commence avec les tests de référence réussis. Sur une sortie native conservée, distingue survivants,
éliminés et sites non couverts : le score sur les mutants exécutés ne couvre pas tous les sites.
Un mutant éliminé par erreur de compilation ou timeout ne démontre pas une assertion comportementale.
Garde la raison d'élimination incertaine si l'outil ne la fournit pas. Ajoute une assertion observable
pour un survivant pertinent ; une mutation équivalente peut demander une analyse plutôt qu'un test.

Conserve commande, version/runtime, source, tests, configuration, dépendances sélectionnées et rapport.
Réexécute après changement de ce contexte ; un cache fondé sur la seule fonction ne suffit pas.
Utilise un cache neuf ou une relance complète pertinente. Réutilise les identifiants produit existants
pour les preuves ; sans identifiants applicables, rapporte l'exécution sans inventer de clauses.

## Exécuter et rapporter

Utilise la commande native documentée du projet d'accueil, jamais les scripts npm du Build Kit par
défaut. Donne la commande ciblée exacte, par exemple cargo test cancellation_rule ou
pytest tests/test_cancel.py. Exécute les cas ciblés puis les contrôles d'intégration/régression utiles.
Vérifie qu'un cas négatif significatif peut réellement échouer. Rapporte commandes, résultats,
comportements couverts, cas ignorés et limites d'environnement dans validation.md si requis.
Une fixture du moteur de test ne prouve pas la conformité d'un agent réel ou d'une intégration déployée.
Route les travaux CI/CD plus larges vers release-engineering.
