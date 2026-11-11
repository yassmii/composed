# Handoff — diagnostic et réparation par agent

État : implémenté et contrôlé localement pour Build Kit 0.6.0. Scope : [brief](brief.md).
Sources : [guide](../../../build-kit/docs/diagnostics.md),
[diagnostic](../../../build-kit/src/cli/diagnostics.ts),
[réparation](../../../build-kit/src/cli/repair.ts).
Preuves : [validation](validation.md).

Le projet consumer-career n'a pas été installé ni modifié ; son diagnostic et son
plan de réparation sont désormais exploitables par un agent. Le prochain propriétaire
peut traiter les actions d'adoption/revue dans le projet en préservant ses consignes,
ses choix établis et ses références produit. `--apply` restaure seulement les
fichiers manquants d'une installation compatible ; il ne résout pas la prose du
prompt et ne crée pas une fausse installation.

Version du kit : 0.6.0. Aucun contrat produit ni version de contrat changé.
Ce travail couvre les artefacts d'installation et les cibles REQ-ADH-001/002/009/010,
sans déclaration de conformité au contrat draft du harness.
