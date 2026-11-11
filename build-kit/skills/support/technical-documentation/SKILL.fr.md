---
name: technical-documentation
description: >
  Rédige des documents vérifiés de maintenance, onboarding, exploitation et transfert. USE THIS SKILL
  pour des instructions techniques durables ; utilise codebase-onboarding pour la découverte et
  delivery-orchestrator pour un handoff temporaire entre sessions.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.2.0"
---

> **Utilise ce skill** pour documenter les faits vérifiés du projet pour le lecteur visé.
> **Utilise product-manager** pour exigences et décisions produit ; lie leurs sources canoniques.

# Documentation technique

## Établir public et sources

Inspecte docs existantes, code, manifests natifs, exemples de configuration et preuves vérifiées.
Réutilise emplacement et conventions établis. Identifie qui doit lancer, maintenir ou modifier
le système et quelle tâche le document doit permettre. N'écrase pas un README utile avec un template fixe.

## Écrire des instructions actionnables

Inclus seulement les sections pertinentes : objectif, prérequis, installation, noms de variables
sans secrets, commandes de lancement/test, entrées d'architecture, dépannage, livraison/reprise et
responsabilités. Déduis versions et commandes du projet d'accueil, sans stack Node par défaut.
Marque les conseils de dépannage déduits et étapes non testées sans inventer des erreurs connues.

Lie décisions produit, schémas d'interface et procédures canoniques sans multiplier les copies.
Garde l'état éphémère de session dans les artefacts de travail. Distingue capacités installées,
architecture proposée et automatisation future du runtime.

Pour une connaissance opérationnelle durable, garde si utile source/observation, périmètre applicable,
dernière vérification et signal de réexamen. Cette provenance est facultative, pas une migration de
schéma obligatoire. Marque les contextes incertains/remplacés pour revue et lie leur source actuelle ;
décisions et apprentissages produit restent canoniques. La mémoire pointe vers source/handoff, sans copie.

## Vérifier le transfert

Vérifie chemins, liens, commandes natives et configuration contre le repository actuel. Exécute
les exemples locaux bornés utiles et autorisés ; ne déploie, publie ou modifie pas les données réelles
pour valider une documentation. Rapporte contrôles réalisés, commandes non exécutées et hypothèses.
Si pertinent, fais suivre les instructions à un lecteur neuf dans un environnement jetable et consigne
les manques restants.

Le contrôle en lecture seule `knowledge check` du kit peut exposer des notes indexées ou des sources
locales manquantes parmi les liens pris en charge. Son succès structurel ne prouve ni fraîcheur
sémantique, ni approbation, ni vérité externe ; examine couverture non vérifiée et sources actuelles.
Pour reprendre, lis index/note/source utiles et état réel du handoff avant d'agir, puis ferme les
pointeurs actifs obsolètes sans effacer les preuves.
