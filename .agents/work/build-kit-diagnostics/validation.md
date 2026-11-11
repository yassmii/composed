# Validation — diagnostic et réparation

Date : 24 octobre 2026. Candidat : Build Kit 0.6.0, arbre de travail non commité.

- Suite Vitest complète via Node Windows 24.13.1 : 17 fichiers, **88 tests réussis**,
  dont 12 nouveaux cas de diagnostic/réparation. Dépendances natives du checkout
  Windows réutilisées ; aucune installation de dépendance ou modification de lock
  hors version du workspace.
- TypeScript `tsc --noEmit` via Node Linux 24.15.0 : réussi.
- Biome sur les six fichiers de code/test modifiés : réussi après formatage.
- Validation du catalogue : 13 skills, 33 scénarios ; aucun modèle exécuté.
- `git diff --check` : réussi.
- Doctor réel sur `consumer-career`, agent `codex`, sortie JSON unique :
  installation absente, consignes propres au projet, usage du kit facultatif,
  choix autonome de stack à revoir et prérequis d'installation absent du prompt.
- Repair réel en `--dry-run --json` sur ce POC : sept actions d'adoption/revue,
  aucune écriture. Codes CLI 1 attendus car le diagnostic reste non sain.
  Aucun `.agents/` créé. Le POC avait deux documents modifiés et un répertoire de
  benchmarks non suivi ; deux rapports externes supplémentaires sont apparus
  pendant la vérification. L'état global est donc en évolution concurrente ;
  nos commandes de diagnostic/prévisualisation ne l'ont ni écrit ni réinitialisé.

Les tests vérifient : ciblage des bridges, conservation du contenu personnalisé,
mémoire/travaux, refus des marqueurs invalides et sources incompatibles, prévisualisation,
création exclusive/idempotence, miroirs Cline et refus des parents symlink/junction.

Limites : contrôle structurel et heuristiques de texte uniquement ; aucune preuve
de conformité d'un modèle, délégation native ou correction sémantique automatique.
Les restaurations sont bornées aux absences d'une installation reconnue et à jour ;
les changements de politique, adoptions manuelles et mises à jour restent explicites.
Relecture d'auteur, aucune revue indépendante revendiquée pour cette modification.
