# Baseline de rétrofit — Composed Build Kit 0.5.1

Révision : `35e65065a3097c3a98513f3fa9e4e8f0ce499e62`. Inspection des fichiers de
cette révision, distincte des changements documentaires en cours.
[baseline.json](baseline.json) conserve chemins, objets Git et SHA-256.
Ce contexte local est séparé des sources publiques de recherche.

| Sujet | État initial | Cible / écart |
| --- | --- | --- |
| Installation, mise à jour, doctor | CLI et contrôles structurels présents | CAP-ADH-001 : vérifier adoption/migration sans assimiler présence à conformité. |
| Stack utilisateur | Politique et états déclarés dans le catalogue | CAP-ADH-002 : essais chronologiques réels, choix partiels et fausse approbation. |
| Routage et proportionnalité | Catalogue et instructions de skills présents | CAP-ADH-003 : mesurer comportement et faux blocages. |
| Capacités et délégation | Instructions d'inspection, registre et isolation | CAP-ADH-004/005 : preuves par runtime ; le kit ne fournit pas de moteur externe. |
| Handoffs et mémoire | Artefacts et règles documentés | CAP-ADH-006 : reprise démontrée par une session fraîche. |
| Preuves et revue | Instructions et artefacts attendus | CAP-ADH-007/008 : applicabilité à la révision et identités vérifiables. |
| Événements et hooks | Pas de superviseur ni interception native dans cette baseline | CAP-ADH-009 : inventaire sélectif et recette avant activation. |
| Évaluations | Runner, adaptateur de commande et fixture ; grading sur champs et expressions | CAP-ADH-010 : actions et résultats réels, contre-exemples et essais répétés. |
| Recherche continue | Pas de boucle dédiée dans la baseline du kit | CAP-ADH-011 : questions, déclencheurs, budget et analyse d'impact. |
| Télémétrie, graphe, correction/livraison | Pas de services correspondants livrés | CAP-ADH-012/013/014 : modules optionnels à évaluer avant infrastructure. |

Les anciens tests d'installation ou de cohérence ne sont pas des exécutions des
24 nouveaux cas. **Conformité au nouveau contrat : non évaluée.** Aucun cas
produit n'est déclaré réussi par cette inspection.

## Priorités proposées

1. Décisions et preuves comportementales : ACC-ADH-002 à 006, 010 et 024.
2. Coordination et validité des preuves : ACC-ADH-007 à 015.
3. Recherche et amélioration : ACC-ADH-016 à 019.
4. Modules optionnels : ACC-ADH-020 à 023, en commençant par les mesures et requêtes utiles.

Le [plan Runtime](../../../../docs/composed-runtime/implementation-plan.md) et sa
[matrice de contrôles](../../../../docs/composed-runtime/hooks-and-events.md)
peuvent servir ces objectifs ; leur adoption ne les démontre pas. Les contrats
métier des applications restent leur source de vérité.
