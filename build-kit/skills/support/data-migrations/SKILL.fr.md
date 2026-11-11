---
name: data-migrations
description: >
  Prépare et vérifie changements de schéma persistant, backfills et restauration. USE THIS SKILL pour
  migrations, imports ou nettoyage destructif ; utilise refactoring pour la structure du code seul
  et release-engineering pour le rollout associé.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.0.0"
---

> **Utilise ce skill** quand données existantes et versions en service doivent survivre au changement.
> Un plan ou une répétition locale n'autorise pas une mutation en production.

# Migrations de données

## Établir la frontière des données

Lis schéma réel, historique de migration, politiques de données, consommateurs et processus de
déploiement. Établis volume, propriété, invariants, rétention, écritures concurrentes et indisponibilité
acceptable à partir des preuves. Consigne les inconnues sans inventer la capacité de production.
Inspecte versions base/outils et documentation officielle actuelle pour les locks ou DDL propres au moteur.

Classe effets additifs, destructifs et irréversibles. Précise quelles versions applicatives anciennes
et nouvelles peuvent lire et écrire chaque état intermédiaire. Garde les liens d'exigence et d'acceptation.

## Préparer une transition récupérable

Préfère expansion → migration → vérification → retrait si la compatibilité en service compte. Sépare
nettoyage destructif et rollout additif ; retire les anciens lecteurs/rédacteurs avant l'incompatibilité.
Évite transaction longue ou lock non borné si le volume les rend dangereux.

Pour les backfills, définis lots stables, checkpoints, idempotence, reprise et gestion des écritures
concurrentes. Vérifie invariants source/cible, comptages et échantillons sémantiques ; des nombres
de lignes égaux ne suffisent pas. Tire les limites d'une capacité mesurée ou d'une décision opérationnelle.

Distingue rollback applicatif, rollback de schéma, correction en avant et restauration des données.
Un script down ne recrée pas les valeurs supprimées. Identifie sauvegarde, procédure de restauration,
propriétaire et conditions avant l'irréversible. Considère les écritures reçues après sauvegarde et
les dépendances aux schémas modifiés.

## Répéter et exécuter dans le scope

Utilise une base jetable avec données synthétiques ou assainies autorisées. Exécute la vraie migration
et les consommateurs anciens/nouveaux pertinents. Vérifie interruption/reprise et restauration si
matérielles ; consigne durée, locks, invariants et limites. Une petite fixture ne prouve pas l'échelle réelle.

Avant une action destructive ou en production, présente cible exacte, impact, fenêtre de compatibilité,
reprise et validation ; obtiens l'autorisation bornée requise si elle n'est pas déjà accordée. Vérifie
l'identité réelle de l'environnement avant exécution. Arrête sur cible inattendue, invariant violé,
capacité dépassée ou preuve de reprise manquante. Route le rollout vers release-engineering.

Consigne versions, identifiants de migration, commandes/résultats, intégrité des données, risques
ouverts et nettoyage restant dans plan.md et validation.md si requis. Garde secrets et données clients
hors des artefacts partagés. Un fichier généré n'est pas une migration appliquée ou validée.
