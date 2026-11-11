# Handoff — délégation inter-fournisseurs et delivery adaptatif

5 novembre 2026. État : plans d'implémentation rédigés ; aucun runtime, proxy,
adaptateur ou changement de politique implémenté. Aucun appel modèle lancé.

## Entrées canoniques du chantier

- [Vue d'ensemble et diagnostic](plan.md).
- [Plan runtime inter-fournisseurs](runtime-implementation.md) : R0 à R6.
- [Plan d'évolution du Build Kit](kit-implementation.md) : K1 à K6.
- [Conception runtime historique](../../../docs/composed-runtime/implementation-plan.md) :
  référence détaillée pour supervision, protocole, pannes et conformité.

L'utilisateur veut une orchestration depuis Codex ou Claude capable de lancer de
vrais agents Kimi/GLM/DeepSeek ou locaux, notamment via gateway, et un choix de
modèles adapté aux tâches pour accélérer sans réduire les garanties.
L'indice Rust correspond au runtime conçu historiquement. Aucun proxy implémenté
n'a été localisé dans les emplacements inspectés ; `agent-os` est un projet distinct.

## Séquence et jalons

1. Démarrer R0/R1 ; préparer K1/K2 et le protocole de mesure K5 en parallèle utile.
2. R2/R3 : démonstration simulée et robustesse, sans prétention de support LLM réel.
3. R4/R5 : exécuteur outillé pour modèles tiers et recette réelle inter-fournisseurs.
4. R6/K3/K4 : runtime qualifié, intégration du mode externe et contrôles du kit.
5. K5/K6 : mesure du gain, release et migration progressive.

La méthode peut être améliorée avant le runtime, mais l'objectif inter-fournisseurs
n'est livré qu'avec la recette réelle. Une gateway ne remplace pas un agent outillé.
Les contrats produits et leurs pins ne changent pas. Le runtime reste autonome et
facultatif ; la configuration native existante garde un parcours utilisable.

## Décisions à traiter au moment utile

- Au démarrage : formaliser Rust proposé, nom de dépôt local et environnement cible.
- R4 : sélectionner l'exécuteur tiers après qualification des capacités actuelles.
- Avant appels réels : disposer des accès, données et limites de coût autorisés.
- Avant publication seulement : nom public, licence et destination.

Ce sont des dépendances des lots concernés, pas des raisons d'interrompre la
planification ou les travaux indépendants. Ne pas répéter une demande déjà résolue
dans la session. Le présent mandat porte sur les plans, pas leur implémentation.

## Validation de cette livraison documentaire

Sources locales inspectées : protocole runtime et handoffs historiques, catalogue,
orchestrateur, benchmark, contrat harness candidate et recherche associée.
Contrôles exécutés : 26 liens locaux dans cinq documents, huit identifiants de
clauses explicitement écrits et whitespace vérifiés sans erreur ; `git diff --check`
réussi. Le README runtime pointe vers ce handoff.
Relecture d'auteur uniquement ; aucune revue indépendante ni validation logicielle
revendiquée. Le propriétaire suivant est l'orchestrateur d'implémentation, qui
commence par R0/R1 et conserve les décisions et preuves applicables.
