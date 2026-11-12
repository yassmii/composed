# Profils illustratifs

[English version](README.md)

> Le contrat est désormais rédigé en anglais, en version **1.0.1** ; le texte français 1.0.0
> est archivé dans [history/1.0.0/](../history/1.0.0/README.md). Les textes libres des
> profils sont traduits ; leurs clés et identifiants restent en français.

Ces trois configurations illustrent l'[interface logique](../contracts/targeting-profile.md).
Elles sont au statut **illustrative**, avec `activation_ready: false` : offre,
territoire, connecteurs, politique et seuils d'évaluation doivent être validés pour
un déploiement réel. Elles ne sont pas une syntaxe exécutable déjà implémentée.
Les seuils et durées métier sont des exemples de conception, pas des résultats de recherche.

| Profil | Ce qu'il vérifie |
| --- | --- |
| [Copropriétés](coproprietes-fr.yaml) | Plusieurs cibles peuvent partager un syndic; connaître une copropriété ne démontre pas un projet d'achat. |
| [Commerces](commerces-locaux.yaml) | La prospection de commerces locaux peut être un profil sans que les commerces, Google Maps ou les audits énergétiques deviennent universels. |
| [Projets numériques](projets-numeriques.yaml) | Une cible peut être un projet sans adresse, société, téléphone ou courriel obligatoire. |

Pour des essais, compléter les références avec une politique et des sources de test,
puis utiliser des données synthétiques sans destinataires réels. Le scénario
`ACC-PR-001` attend l'exécution de ces parcours dans une implémentation; la présence
des exemples ne constitue pas cette preuve.
