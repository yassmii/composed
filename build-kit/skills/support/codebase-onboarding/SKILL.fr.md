---
name: codebase-onboarding
description: >
  Cartographie une base de code inconnue à partir des preuves avant un changement non trivial. USE
  THIS SKILL pour architecture, comportement actuel et impact ; utilise systematic-debugging pour
  un échec précis inexpliqué et technical-documentation pour un guide d'onboarding durable.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

> **Utilise ce skill** pour comprendre suffisamment le changement demandé et son risque.
> **Utilise software-engineering ou refactoring** une fois parcours affecté et baseline compris.

# Découverte d'une base de code

## Tracer le comportement existant

Lis les instructions projet et les documents canoniques d'architecture/produit. Repère manifests et
commandes natifs. Trace l'entrée pertinente à travers logique métier, persistance et frontières externes ;
identifie appelants, consommateurs, tests et responsabilités réels. Cite fichiers ou symboles pour
les affirmations matérielles. Évite un inventaire global pour une modification bornée.

Explique le parcours actuel utilisateur ou opérateur, erreurs et effets de bord importants compris.
Distingue règles implémentées et politique produit souhaitée. Une particularité non documentée peut
être volontaire ; pose une question seulement si l'écart change scope, correction ou risque.
N'impose pas un nombre arbitraire de règles.

## Établir la baseline et l'impact

Exécute les contrôles documentés disponibles dans l'environnement autorisé, ou nomme précisément
ce qui manque et donne la commande native. Ne demande pas à l'utilisateur un contrôle réalisable
sans risque par l'agent. Distingue les échecs préexistants des effets du changement proposé.

Cartographie l'impact probable sur appelants, données, interfaces, tests, docs, ordre de livraison et
reprise. Prouve les dépendances par code et schémas plutôt que par les noms de dossiers. Marque les
parcours non vérifiés et la plus petite observation utile. Pas de refactoring opportuniste pendant la découverte.

## Transmettre le prochain changement

Livre carte concise, parcours actuel, baseline prouvée, inconnues, consommateurs affectés et prochaine
action bornée. Pour le non-trivial, garde les preuves dans brief.md ou plan.md et lie les docs
canoniques ; ne crée pas une seconde vérité produit. Route les guides durables vers
technical-documentation, l'implémentation vers software-engineering et la caractérisation d'un
comportement risqué non testé vers automated-testing avant modification.
