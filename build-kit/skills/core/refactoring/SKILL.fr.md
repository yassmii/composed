---
name: refactoring
description: >
  Améliore la structure interne du code en préservant son comportement observable. USE THIS SKILL pour
  la dette technique et le nettoyage structurel ; utilise software-engineering pour un changement
  fonctionnel et systematic-debugging pour diagnostiquer un échec.
license: MIT
metadata:
  author: composed-build-kit
  version: "2.1.0"
---

> **Utilise ce skill** pour obtenir une structure plus claire avec un comportement externe inchangé.
> **Utilise data-migrations** pour faire évoluer schéma ou données persistées, même sans différence visible attendue.

# Refactoring

## Établir la baseline

Inspecte appelants, interfaces, effets de bord et tests existants avant de proposer des transformations.
Nomme le problème concret de maintenance et le comportement à préserver : erreurs, permissions,
sérialisation et contraintes pertinentes de performance. Une particularité non documentée n'est pas
automatiquement un bug. Utilise codebase-onboarding si le parcours affecté reste incompris.

Exécute les contrôles natifs de référence. Ajoute des tests de caractérisation pour un comportement
risqué non couvert, avec automated-testing si nécessaire. Sépare les échecs préexistants ; une
baseline en échec n'autorise pas des réparations sans rapport. Préserve les changements locaux utilisateur.

Crapper peut aider à cibler une fonction complexe insuffisamment testée ; Dryer peut signaler une
paire de structures proches. Utilise ces outils optionnels, ou les équivalents déjà établis, seulement
si leur mesure éclaire le problème. Prépare séparément une version connue et ses dépendances après
examen des effets du lanceur, avec un périmètre et un budget bornés ; aucune installation implicite.
Conserve rapports natifs, commande et contexte source/tests/configuration/dépendances sélectionnés.
Une couverture absente, périmée ou issue de tests en échec n'est pas une baseline exploitable.
Une similarité structurelle n'établit pas une règle métier commune. Motive une mutualisation par ses
raisons d'évolution et le découpage par la cohésion ; aucun seuil universel CRAP ou de duplication.
Un rapport produit avec exit 0 peut encore contenir des problèmes à examiner.

## Transformer par incréments

Choisis les transformations selon le problème observé : renommer un concept ambigu, séparer des
responsabilités, isoler un effet de bord, supprimer du code prouvé mort ou unifier une règle dupliquée.
Extraction et nouveaux fichiers sont des options, pas une séquence imposée. Préfère une petite
frontière de dépendance à un framework spéculatif.

Pour un travail non trivial, consigne consommateurs affectés, scope inclus/reporté, validation et
point de reprise. Avance par incréments relisibles et exécute les contrôles ciblés après chaque
transformation significative. Utilise les preuves disponibles pour avancer ; sollicite l'utilisateur
pour une décision matérielle ou une action externe requise, pas une validation réalisable par l'agent.
Garde les évolutions fonctionnelles dans un lot distinct borné, en tenant compte des nouvelles consignes.

Si un contrôle régresse, arrête la transformation concernée, isole la cause et annule seulement les
modifications identifiées de l'agent si c'est sûr. Pas de reset global ni de suppression du travail
sans rapport. Route un échec inexpliqué vers systematic-debugging au lieu de multiplier les essais.

## Démontrer la préservation

Compare le diff final à la baseline et inspecte appelants affectés, types publics et effets de bord.
Exécute les tests et contrôles natifs pertinents ; des snapshots inchangés peuvent masquer une
régression. Rapporte gain de maintenance, commandes/résultats, limites et tout changement de
comportement accidentel à résoudre avant de déclarer le refactoring terminé. Respecte les gates
applicables de délégation et de revue indépendante du catalogue.
