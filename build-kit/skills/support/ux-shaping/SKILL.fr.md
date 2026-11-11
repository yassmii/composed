---
name: ux-shaping
description: >
  Conçoit ou révise parcours utilisateur, états utiles et handoff d'implémentation depuis les objectifs
  produit actés. Utilise product-designer pour critiquer un design existant ; utilise cadrage si des
  règles produit matérielles manquent avant de figer le parcours.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

Conçois un chemin utilisable vers le résultat visé, avec états et interactions suffisants pour
l'implémenter et l'évaluer. Préserve décisions produit, besoins d'accessibilité et design system existant.

## Partir du but utilisateur et de la surface réelle

Lis objectif canonique, règles, acceptation et décisions ouvertes. Inspecte interface, prototype ou
code pertinent s'ils existent ; distingue frictions observées et hypothèses. Un nouveau parcours
n'a pas d'interface à auditer : explicite les preuves absentes et conçois une proposition. Charge
product-designer si une critique distincte est nécessaire, pas comme phase automatique.

Clarifie les manques produit matériels avec leur propriétaire avant de figer le comportement.
Réutilise stack et composants actés ; une maquette n'autorise ni framework, outil ou intégration externe ajoutés.

## Concevoir parcours et états

Rends action principale, progression et reprise compréhensibles. Inclus les états qui affectent ce
parcours : premier usage/vide, chargement, succès, erreur, permission, annulation ou faible volume
selon le besoin. Préserve contexte et saisie lors d'erreurs récupérables si les règles le permettent.

Décris clavier/focus, libellés utiles, retour et contraintes responsive nécessaires à l'interaction.
Utilise le design system courant ; ne déclare pas utilisabilité/accessibilité depuis une seule
inspection visuelle. Distingue formulation proposée et texte testé avec des utilisateurs.

Choisis seulement le médium nécessaire au handoff : texte/ASCII, Mermaid, composants HTML existants
ou outil de design fourni. N'impose pas maquette pixel-perfect ou dépendance d'outil à chaque tâche.

## Transmettre le comportement observable

Relie états/actions aux critères produit avec IDs/ancres existants. Indique ce qui change et pourquoi,
entrées/sorties, interactions, composants réutilisés, erreurs/reprise et questions ouvertes avec
propriétaires. Garde les règles produit canoniques sans recopier une spécification concurrente.

Garde des preuves de design durables concises pour une livraison non triviale, ou des notes dans la
réponse pour un changement direct borné. Respecte les gates de revue/délégation ; une maquette ou
relecture d'auteur n'est pas un verdict indépendant. Un document de design ne vaut pas approbation de l'interface.

## Évaluer le résultat après livraison

Nomme ce qui se vérifie dans le parcours implémenté et ce qui demande de vrais utilisateurs : réussite,
confusion, reprise ou exclusion involontaire selon le besoin. Préserve hypothèse et contre-signal
produit. Les tests établissent les interactions choisies ; utilisabilité et valeur restent inconnues
sans observation dans le contexte visé.

Consigne source/contexte/limites des observations et route l'apprentissage matériel au propriétaire
produit. Révise le design dans le périmètre autorisé, en conservant raison et preuves liées.
