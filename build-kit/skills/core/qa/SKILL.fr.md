---
name: qa
description: >
  Prépare ou exécute une recette manuelle et régression proportionnées d'un parcours, avec étapes
  compréhensibles et résultats observés. Utilise automated-testing pour le code de test et
  product-manager pour interpréter l'outcome produit au-delà de l'acceptation de livraison.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

Aide utilisateur ou reviewer à vérifier le comportement avec étapes compréhensibles et preuves réelles.
Un plan de test n'est pas un test exécuté ; des contrôles réussis ne prouvent pas le succès produit.

## Établir le périmètre d'acceptation

Lis critères canoniques, états UX utiles, contexte d'implémentation et validation existante.
Identifie version/environnement, préconditions, données de test et parcours affectés. Utilise des
éléments synthétiques ou autorisés ; préserve confidentialité et frontières d'action externe.
Réutilise les contrôles existants sans créer systématiquement une campagne manuelle pour un correctif direct.

## Rendre les contrôles rejouables

Pour chaque critère matériel, donne préconditions, action/entrée utilisateur précise et résultat
observable attendu. Utilise libellés et emplacements réels s'ils sont connus ; indique une interface
non observée comme proposition au lieu d'inventer des boutons. Inclus frontières négatives,
permissions, états vide/erreur et reprise pertinents. Choisis les régressions selon les comportements
atteints, pas un nombre fixe de cas.

Utilise le vocabulaire compris du lecteur. Explique les preuves techniques utiles sans masquer
un fait matériel par du jargon ou interdire des termes nécessaires. La conception de tests codés
relève d'automated-testing si nécessaire ; une recette manuelle peut compléter ces preuves.

## Consigner ce qui a réellement eu lieu

Distingue contrôles **prévus**, **réussis**, **échoués**, **bloqués** et **non exécutés**. Pour ceux
exécutés, garde critère, version/environnement, résultat réel et preuve utile ; indique exceptions et
propriétaire suivant. Utilise des preuves de travail concises pour une livraison non triviale et la
réponse pour un correctif direct admissible. Un test d'auteur ne vaut ni verdict indépendant ni approbation.

Pour un bug signalé, inspecte d'abord reproduction/navigateur/logs disponibles. Demande seulement les
preuves manquantes inaccessibles à l'agent. Limite le diagnostic demandé au nécessaire expurgé ;
une anomalie visuelle n'impose pas collecte intégrale de console ou exposition de credentials.
Une cause inconnue relève de systematic-debugging si disponible, sans correction spéculative.

## Distinguer acceptation et résultat produit

Rapporte comportements choisis réussis et trous de couverture. Un plan utilisable ou une suite verte
ne prouve ni bénéfice utilisateur, succès du déploiement ou absence de défaut. Préserve hypothèse de
résultat et contre-signal ; route observations d'usage/recherche réelles, avec source et limites,
vers le porteur produit pour conserver/réviser/arrêter/apprendre. N'invente pas de télémétrie et ne
déclare pas une utilisabilité validée sans test exécuté.
