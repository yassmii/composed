---
name: release-engineering
description: >
  Prépare des releases reproductibles, la CI/CD et des rollouts vérifiés. USE THIS SKILL pour packaging,
  configuration de déploiement, préparation, rollout/rollback et vérification après livraison ; utilise
  automated-testing pour les tests et data-migrations pour la transition des données.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

> **Utilise ce skill** pour préparer ou exécuter une release dans l'environnement et le scope autorisés.
> Une demande d'évaluation de préparation n'autorise pas déploiement ou publication.

# Ingénierie de release

## Découvrir la surface de livraison

Inspecte manifests, commandes natives, workflows CI, registre d'artefacts, configuration de déploiement
et politique de versions du projet. Distingue déploiement applicatif et publication d'une bibliothèque.
Identifie révision source, environnement cible, frontière des secrets et responsable de livraison.
Préserve la stack choisie ; n'impose pas un fournisseur ou des conteneurs comme exigence supposée.

## Préparer la release

- Construis un artefact traçable depuis une révision connue avec dépendances verrouillées/revues et
  configuration documentée. Sépare secrets de build et d'exécution ; valide les réglages requis.
- Exécute build/type/lint/tests natifs existants et pertinents. Consigne les omissions. Sépare les
  permissions de test, build et déploiement pour protéger les secrets des changements non fiables.
- Inspecte interfaces modifiées, ordre des migrations, assets, jobs et intégrations. Coordonne
  api-contracts et data-migrations uniquement si ces surfaces changent réellement.
- Choisis un rollout proportionné : atomique, progressif, canary, feature flag ou promotion de package.
  Définis succès observable, conditions d'arrêt, responsable et reprise avant livraison.
- Identifie l'artefact/configuration précédent exact et la compatibilité des données. Un rollback de
  code n'annule pas toutes les écritures ; répète la reprise si une erreur aurait des effets importants.

Garde les pipelines relisibles. Une modification CI ne doit pas élargir silencieusement les accès,
exécuter des scripts distants mutables ou donner une autorité de publication hors du travail demandé.

Les campagnes Crapper, Dryer ou Mutator, ou leurs équivalents, sont des contrôles optionnels à
activer explicitement. Épingle outils et environnement, sépare préparation et exécution et examine
installations, rapports remplacés et autres effets sur le projet. Borne temps et parallélisme à
partir du coût observé ; conserve les rapports bruts et le contexte sélectionné pour leur validité.
Commence par une mesure informative. Une future gate doit définir périmètre, baseline, seuil local,
exclusions et traitement des erreurs/absences ; ni exit 0 ni un score seul n'établit sa satisfaction.
Ne rends pas ces moteurs obligatoires dans une CI existante sans politique explicite du projet.

## Vérifier le résultat réel

Prépare artefacts locaux et validation avant une approbation requise de déploiement/publication.
Réutilise une autorisation bornée existante ; sinon demande juste avant la mutation externe avec
cible exacte, artefact, impact, reprise et contrôles prêts à être relus. Revérifie l'identité cible
à l'exécution. Respecte délégation et revue indépendante du catalogue.

Après déploiement autorisé, vérifie identité de l'artefact, santé/disponibilité et parcours critique
représentatif. Contrôle logs pertinents, assets, erreurs d'intégration et performances par rapport à
la baseline avec les outils disponibles. Nomme les contrôles en conditions réelles indisponibles ;
une CI verte n'est pas une preuve après déploiement. Arrête ou exécute la reprise autorisée si les
critères prédéfinis échouent ; n'élargis pas silencieusement le rollout.

Rapporte révision/version, artefact et environnement, commandes/résultats, état du rollout, preuves de
reprise, limites et décisions restantes. Consigne dans validation.md et lie les procédures durables
sans les dupliquer. Un skill ne fournit ni moteur de déploiement ni surveillance continue absents du runtime.
