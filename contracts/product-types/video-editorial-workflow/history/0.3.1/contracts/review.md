# Revue — v0.3.1, contrat générique

Mode : auto-revue de l'auteur. Statut : `draft`.

Le contrat décrit une famille de produits de préparation et de revue vidéo.
Il conserve sept capacités, des exigences testables et une traçabilité vers
les observations ou les choix explicites de la famille.

## Indépendance du produit

- Nom et identifiant : `video-editorial-workflow` ; espace des clauses : `VEW`.
- Les acteurs sont l'éditeur, l'opérateur et l'administrateur.
- Le noyau ne mentionne aucun client, équipe nommée, paquet de données interne,
  compte fournisseur ou calendrier de migration.
- La séparation entre noyau et traitements optionnels est une politique
  produit ; elle ne limite pas la commande d'un projet client.
- Les profils et critères de recette s'appliquent à tout environnement déclaré
  par une implémentation.

La recherche commune conserve uniquement six sources publiques et six
observations attribuées. Les clauses privées de preuve sont marquées
explicit_project_choice, sans les rattacher artificiellement à ces sources.
Le retrait des preuves ne constitue pas une approbation des choix ; ils
restent à étayer et à examiner avant stabilisation.

## Limites de validation

Le schéma et les liens de traçabilité sont vérifiables avec les outils de
Composed. Ils ne démontrent pas la conformité d'une app. La référence
`video-editorial-workflow/conformance@0.1.0` désigne un profil à construire ;
aucun exécuteur contrat–application n'est livré dans cette unité.

Avant promotion : diversifier la recherche, obtenir une revue indépendante,
définir le profil de conformité et compléter les preuves des clauses
actuellement déclarées comme choix explicites. Aucune validation par une organisation particulière n'est requise
pour promouvoir ce contrat générique.
