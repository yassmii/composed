---
name: software-engineering
description: >
  Implémente un logiciel maintenable et étudie les choix d'architecture ou de technologie. USE THIS
  SKILL pour modifier le code applicatif, définir les frontières ou étudier une stack ; utilise
  systematic-debugging pour un échec inexpliqué et refactoring pour une transformation à comportement constant.
license: MIT
metadata:
  author: composed-build-kit
  version: "2.2.0"
---

> **Utilise ce skill** pour l'implémentation et les décisions techniques dans le périmètre produit convenu.
> **Utilise cadrage** pour les exigences matérielles manquantes ; sollicite les spécialistes pour leurs livrables propres.

# Ingénierie logicielle

## Établir les contraintes

Pour un correctif local réversible déjà spécifié, applique le parcours direct d'AGENTS.md : inspecte
seulement instructions, code et tests utiles, indique scope/validation dans la réponse et implémente.
Ni orchestrateur, lecture intégrale du catalogue, second skill de tests, dossier de travail ou revue
indépendante automatiques. Sécurité, interface publique, données persistées ou stack modifiées de façon
matérielle et demandes explicites de revue/plan gardent leurs gates. Plusieurs fichiers ou étapes de
test ne rendent pas, seuls, le travail complexe.

Lis les instructions du projet d'accueil, le code pertinent, les tests et les décisions canoniques.
Identifie le résultat observable, les appelants affectés, la propriété des données et les contraintes
de qualité pertinentes. Si un Composed Contract s'applique, relie travail et preuves à requirement.id
ou acceptance.id ; signale les capacités non couvertes sans inventer d'exigence. Distingue exigences
produit et interfaces techniques.

Inspecte le code et les dépendances existantes avant d'ajouter un utilitaire ou une abstraction.
Pour un choix conséquent de dépendance ou d'API, consulte la documentation officielle actuelle et
évalue compatibilité, maintenance, licence, coût opérationnel et alternatives. Signale les canaux
de recherche indisponibles.

## Choisir une stack dans l'autorité accordée

Pour un nouveau projet, un POC ou un changement de stack, applique stack_selection_policy dans
skills/catalog.json. Si le choix est ouvert, recueille les contraintes utilisateur, étudie les options
crédibles avec sources primaires actuelles, coûts et compromis, recommande puis attends le choix ou
la délégation explicite avant sélection, squelette, installation et implémentation dépendante.
Préserve les choix partiels et la portée d'une délégation. Réutilise une stack établie inchangée sans
redemander. Urgence, templates, manifests du kit et --yes ne constituent pas un choix de stack.
Lie la décision canonique depuis le plan de travail.

## Concevoir le plus petit changement cohérent

- Trace le parcours réel des appels et les consommateurs ; distingue observations et hypothèses.
- Sépare règles métier, persistance, transport et présentation par les frontières utiles existantes.
  Ajoute une abstraction pour un gain démontré de cohésion, testabilité ou réutilisation.
  Représente les états métier autorisés dans les données/types et contrôle les entrées externes
  avant de les transmettre à la logique métier ; n'ajoute pas de coercition pour taire une erreur de type.
- Spécifie les erreurs aux frontières : validation, permission manquante, conflit, dépendance
  indisponible et échec inattendu doivent produire des résultats observables adaptés.
- Pour la concurrence ou la distribution, identifie transactions, doublons, livraisons désordonnées,
  sûreté des retries, timeouts et annulation. Réduis d'abord le partage d'état mutable ; si une donnée
  doit rester partagée, explicite qui peut l'écrire et comment cette propriété est garantie.
  Vérifie le résultat d'un retry et d'une reprise après interruption, pas seulement le premier appel.
  Borne les retries ; ne rejoue pas aveuglément une écriture.
- Utilise les contraintes produit mesurées de latence, débit et ressources. Évite optimisation
  spéculative, extensibilité générique et limites arbitraires de longueur des fonctions.
- Route l'évolution des interfaces vers api-contracts, les schémas/backfills vers data-migrations,
  l'évaluation sécurité vers security-review et le déploiement vers release-engineering si nécessaire.

## Implémenter et démontrer

Pour un travail non trivial, consigne scope, surfaces affectées, alternatives utiles et validation
dans le plus petit plan nécessaire. Respecte la politique réelle de délégation et de revue du
catalogue ; lire plusieurs skills ne constitue pas une délégation. Avance par incréments relisibles
et préserve les modifications locales sans rapport.

Si l'écriture requise est inconnue ou a échoué, utilise la sonde preflight via le vrai tool/sandbox
de l'agent dans les répertoires de code et preuves prévus. Un succès concerne les chemins choisis ;
délégation native, indépendance de revue et quota nécessitent leurs propres observations. Ne contourne
pas les permissions et ne déplace pas silencieusement les artefacts requis après un refus. Répète
seulement après changement de contexte ou permissions. Une question directe n'a pas de rituel runtime.
Si le CLI est indisponible, utilise une sonde native bornée équivalente : création exclusive, écriture
et lecture vérifiant les octets, puis nettoyage du seul temporaire possédé dans le répertoire prévu.
N'ajoute pas de dépendance au projet.

Exécute les contrôles natifs documentés du projet. Choisis les tests comportementaux selon les risques
et consommateurs affectés, avec automated-testing si nécessaire. Compare le diff au résultat demandé
et à l'impact prévu. Rapporte changements, commandes exactes, résultats, limites et reprise si utile.
La génération du code ou le formatage seuls n'établissent pas sa correction.
