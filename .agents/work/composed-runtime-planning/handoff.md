# Handoff — Composed Runtime et rapatriement

Date : 24 octobre 2026. État : conception rapatriée dans Composed ; moteur non implémenté.

## Sources et historique

- Source canonique : [plan](../../../docs/composed-runtime/implementation-plan.md).
- Complément proposé : [événements/hooks](../../../docs/composed-runtime/hooks-and-events.md).
- Originaux exacts : [plan](source/implementation-plan-2026-10-20.txt) et [handoff](source/handoff-2026-10-20.txt).
- [Manifeste d'import](import-manifest.json) et [vérifications](relocation-validation.md).
- Préparation historique : [validation](validation.md), [délégation](agents.md),
  [revue initiale](reviews/2026-10-20-runtime-plan-01.md) et
  [revue corrective](reviews/2026-10-20-runtime-plan-02.md).

Les revues du 20 octobre ne concernent que le plan original. Elles ne valident
ni la cartographie du 24 octobre, ni le nouveau contrat harness, ni un logiciel.
Aucune nouvelle délégation ou revue indépendante n'est revendiquée.

## Périmètre et suite

L'utilisateur a autorisé le rangement et orienté l'ajout d'un contrat de harness,
de recherche/amélioration continues, télémétrie et connaissance. Ce passage
réalise la conception documentaire et conserve la méthode actuelle. Il ne crée
aucun moteur, base partagée, service de collecte ou tâche planifiée.

Le runtime cible reste indépendant et optionnel. Le propriétaire suivant peut
confronter le plan et la cartographie au
[contrat draft](../../../contracts/product-types/agentic-delivery-harness/README.md),
puis définir le premier incrément. Les lots 0–1 et la recette du protocole restent
à réaliser ; les dépenses et transmissions nécessitent les autorisations applicables.
Les décisions déjà autorisées restent valables dans leur portée.
