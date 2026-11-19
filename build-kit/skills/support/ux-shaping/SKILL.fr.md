---
name: ux-shaping
description: >
  Crée ou révise parcours, direction visuelle, composition, états et handoff depuis les objectifs
  produit actés. Utilise product-designer pour une critique seule ; cadrage pour les règles produit matérielles manquantes.
license: MIT
metadata:
  author: composed-build-kit
  version: "2.0.0"
---

Conçois une expérience utilisable et reconnaissable, ancrée dans ce produit et son public. Transmets
l'intention créative jusqu'au comportement observable. Préserve vérité produit, accessibilité et stack actée.

## Partir du but et de l'identité existante

Lis objectif canonique, règles, acceptation et décisions ouvertes. Inspecte surface réelle, composants,
tokens, contenu et assets disponibles. Sépare observations et hypothèses ; l'absence de design.md
n'efface pas une identité déjà visible dans le produit. Clarifie les manques produit matériels avant
de figer le comportement. Réutilise les décisions actées et ne pose que les questions qui changent le travail.

Identifie le but de cette surface : accomplir une tâche, comprendre, décider ou explorer une œuvre.
Il détermine densité, expression et interaction. La page marketing et l'administration d'un même
produit demandent des compositions différentes, pas des marques concurrentes.

Adapte le périmètre : une retouche hérite du système ; un nouvel écran le prolonge ; une refonte
autorisée peut remplacer la couche visuelle demandée en préservant faits produit, fonctions et
contraintes de marque imposées. Mettre à jour les skills n'autorise jamais la refonte d'un projet consommateur.

## Explorer quand la direction est ouverte

Pour une nouvelle identité ou une composition matériellement ouverte, lis
[visual-exploration](references/visual-exploration.md). Dérive des alternatives depuis le contenu,
le public et les références visuelles du sujet, puis compare des organisations et expériences réellement
différentes. Changer seulement couleurs ou polices ne constitue pas une autre direction. Une retouche
limitée ou une direction actée ne demande pas un nouvel atelier d'exploration.

Recommande une direction, son lien au brief et son compromis. Utilise esquisses, fragments rendus ou
planches comparables si cela aide le choix ; n'impose ni Figma, ni génération d'images, ni outil précis.
Respecte préférences explicites et autorisations existantes. Si le choix est délégué, décide et indique
tes hypothèses ; sinon, résous la direction matérielle ouverte avant l'implémentation qui en dépend.
Charge product-designer seulement si une critique distincte est utile.

## Concevoir composition, parcours et états

Traduis la direction en ordre du contenu, grille, rôles typographiques et chromatiques, traitement des
images, densité et interaction. Pour créer ou affiner le visuel, lis
[design-craft](references/design-craft.md) sur les dimensions concernées. Utilise contenu produit réel
et assets disponibles ; identifie textes proposés et données illustratives. N'invente ni témoignages,
chiffres, prix ou capacités pour rendre une composition convaincante. Consigne les assets manquants et leur rôle.

Rends action, progression et reprise compréhensibles. Inclus les états utiles au parcours : vide,
chargement, succès, erreur, permission, annulation ou faible volume. Préserve contexte et saisie lors
d'erreurs récupérables si les règles le permettent. Spécifie clavier/focus, libellés, feedback et
comportement responsive ; une capture seule ne prouve ni accessibilité ni utilisabilité.

Choisis seulement le médium utile au handoff : texte/ASCII, Mermaid, composants HTML existants ou outil
de design disponible. Une maquette n'autorise ni framework, ni dépendance, ni intégration externe ajoutés.

## Transmettre décisions et comportement observable

Relie états/actions aux IDs ou ancres d'acceptation existants. Pour un travail non trivial, garde un
design.md concis dans le chantier existant : périmètre, sources et contraintes héritées ; direction
retenue et raison ; alternatives écartées pertinentes ; décisions visuelles concrètes ; états,
responsive et composants réutilisés ; assets et questions ouvertes avec responsables ; vérifications
prévues. Référence la marque canonique sans créer une spécification concurrente. Des notes dans la
réponse suffisent pour une modification bornée.

Préserve la composition distinctive pendant l'implémentation ; ne reviens pas à une grille de cartes
générique après avoir retenu une autre structure. Ajuste l'ambition aux assets, au temps et aux
performances. Respecte les gates de revue/délégation : un document ou une relecture d'auteur ne valent
ni approbation du design ni verdict indépendant. N'ajoute pas de gate quand le choix concerné est déjà autorisé.

## Inspecter le résultat et conserver l'apprentissage

Si un résultat exécutable et des outils autorisés sont disponibles, inspecte les rendus desktop et
étroits puis exerce l'interaction modifiée. Compare à la direction retenue : contenu réel,
débordements, hiérarchie, focus et mouvement réduit selon le besoin. Corrige les écarts observés dans
le périmètre puis revérifie les cas affectés ; évite les boucles de finition sans fin. Sans outil de
rendu, indique ce qui n'est pas vérifié et un contrôle rejouable, sans déduire un succès visuel du code.

Consigne source, viewport/état et limites des preuves. Distingue revue visuelle d'auteur, contrôles
automatisés et revue indépendante. Les tests établissent certains comportements ; utilisabilité et
valeur produit demandent une observation dans le contexte visé. Préserve hypothèse et contre-signal
produit ; confie les apprentissages matériels à leur responsable. Garde décisions et raisons pour les
réutiliser sans transformer les choix stylistiques passés en interdictions permanentes.
