---
name: cadrage
description: >
  Clarifie utilisateur, résultat, frontières, règles et acceptation d'une feature avant implémentation
  si des exigences matérielles manquent. Utilise product-manager pour stratégie/discovery ; un
  correctif local déjà spécifié suit le parcours de delivery direct.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

Transforme une décision de feature en périmètre implémentable et vérifiable par le rôle suivant.
Réutilise les décisions connues ; résous l'ambiguïté matérielle sans questionnaire systématique.

## Établir décision et sources

Lis demande, documents produit canoniques utiles et preuves du repository. Identifie acteur,
problème/résultat, décision acceptée et hypothèses. Un brief complet fourni n'exige pas un nouvel
atelier. Applique AGENTS.md et les politiques delivery/risque/stack ; un nom de skill ou le couple
code/tests ne rend pas complexe un correctif direct.

## Clarifier ce qui change le résultat

Considère les dimensions utiles à cette feature :

- acteur et situation ; bénéfice attendu et action principale ;
- périmètre inclus et non-objectifs explicites ;
- parcours nominal et états utiles vide, erreur, permission ou reprise ;
- règles métier, frontières de données et risques matériels ;
- surfaces affectées fondées sur les preuves du repository ;
- acceptation concrète et démonstration rejouable.

Demande seulement les réponses qui changent résultat, scope, risque ou validation. Explicite les faits
manquants sans inventer expérience utilisateur, fichiers ou technologie. Regroupe les questions
bloquantes ; réutilise les réponses acquises. Une checklist peut exposer les manques, sans devenir
un format ou une gate d'approbation obligatoire pour chaque correctif.

## Rendre l'acceptation utile au rôle suivant

Relie chaque critère à l'outcome, règle ou risque d'origine avec les IDs/ancres existants. Spécifie
préconditions, action/entrée et résultat observable, frontières négatives importantes comprises.
Distingue ce que prouvent les contrôles de livraison de l'hypothèse de bénéfice. Transmets les états
et arbitrages ouverts utiles à l'UX/ingénierie, sans imposer une implémentation non choisie.

Pour le travail non trivial, garde scope/acceptation dans la source produit canonique et lie-la depuis
le plus petit brief utile. Évite une seconde spécification dans les preuves ou la mémoire. Conserve
statut des décisions, questions ouvertes et propriétaire suivant ; une proposition n'est pas une exigence approuvée.

## Transmettre preuves et limites

Nomme ce qui est prêt, la décision précise manquante, le rôle suivant et la preuve attendue. Réutilise
la stack actée ; les composants ouverts suivent la politique de choix utilisateur avant travail dépendant.
Préserve délégation requise, revue indépendante et autorité sur les actions externes.

Une spécification peut être prête à implémenter sans efficacité produit testée. Garde un propriétaire
et un signal de révision de l'hypothèse après livraison ; ne prétends pas que les tests d'acceptation
prouvent cet outcome. Un correctif direct peut rapporter scope et contrôles dans la réponse selon la politique.
