# Pourquoi Composed

[English version](vision.md)

Brouillon de présentation du projet, rédigé le 5 novembre 2026. Ce texte expose le raisonnement
qui fonde Composed. Il ne décrit pas l'état d'avancement ; voir les README des composants.

## Le code n'est plus la partie chère

Pendant trente ans, la difficulté d'un logiciel se mesurait à la quantité de code à écrire. Les
méthodes, les outils et les équipes se sont organisés autour de cette contrainte. Elle est en
train de disparaître. Un agent produit en une heure ce qu'une équipe produisait en une semaine,
et il le refera demain dans une autre stack si on le lui demande.

Ce qui reste cher, c'est tout le reste : savoir précisément quel produit construire, quelles
règles il ne doit jamais violer, à quoi on reconnaît qu'il est prêt, et comment prouver que ce
qu'on a construit correspond à ce qu'on voulait. Aujourd'hui ce savoir vit dans des prompts,
des tickets, des maquettes et la tête de quelques personnes. Il est réécrit à chaque projet,
rarement vérifié, jamais partagé.

Composed part de ce constat : la connaissance produit mérite le même traitement que le code.
Versionnée, relue, testable, réutilisable, et indépendante de la technologie qui l'implémente.

## Un contrat produit, pas une spécification technique

Un contrat Composed définit un type de produit : une réservation SaaS, une boutique en ligne,
un espace de travail collaboratif, un moteur 3D pilotable. Il énonce la promesse faite à
l'utilisateur, les acteurs et leurs permissions, les entités et leur cycle de vie, les
invariants qui ne se négocient pas, les politiques, les critères d'acceptation et les preuves
attendues avant de déclarer le produit prêt.

Il ne dit ni le langage, ni le framework, ni la base de données. Une implémentation en Rust et
une implémentation en TypeScript peuvent être conformes au même contrat. C'est ce qui le rend
réutilisable, et c'est ce qui permet de comparer des implémentations entre elles.

Chaque clause porte un identifiant stable. Un commit, un test, une revue cite l'identifiant
qu'il sert. Une capacité absente du contrat ne s'invente pas en cours de route : elle fait
l'objet d'une proposition versionnée. Le contrat est la source de vérité du produit, et le code
lui rend des comptes, pas l'inverse.

## Des contrats fondés sur de la recherche, pas sur des opinions

Un contrat n'est pas une liste de souhaits. Chaque type de produit commence par une étude des
produits comparables existants, à partir de sources primaires datées et versionnées. Les
observations sont atomiques et attribuées. Les convergences entre produits deviennent des
clauses ; les divergences deviennent des choix de conception explicites, avec leur raison.

La traçabilité va dans les deux sens : une clause renvoie aux observations qui la fondent, et
un changement de source déclenche la relecture des clauses qui en dépendent. Une technique à
la mode, un nouveau framework ou un bon score de benchmark ne deviennent pas une exigence par
eux-mêmes. La recherche propose ; une autorité identifiée décide ; la décision est versionnée.

## La preuve est séparée de la déclaration

Trois affirmations se confondent trop souvent : l'agent dit que c'est fait, les tests passent,
le produit fait ce qu'il doit. Composed les tient séparées.

Une suite de conformance, externe à l'implémentation, exécute les scénarios d'acceptation du
contrat contre le produit par ses interfaces publiques. Elle rend un verdict par cas : passé,
échoué, bloqué, non exécuté. Un cas bloqué n'est pas une réussite. Un rapport identifie la
version du contrat, la version du profil et la révision exacte du candidat. Aucune conformité
globale n'est revendiquée tant que le profil complet n'a pas été observé.

Le juge lui-même est contrôlé : il doit accepter une référence correcte et rejeter un défaut
connu et un mutant plausible avant que ses verdicts comptent. Un résultat défavorable est
conservé. Un invariant n'est jamais affaibli pour améliorer un score.

## Les produits évoluent, les contrats aussi

Un produit peut être conforme à un contrat qui ne décrit plus le bon résultat. Composed prévoit
donc deux boucles qui ne s'arrêtent pas à la première livraison. La recherche continue surveille
les sources, les produits comparables et les contre-exemples. L'amélioration continue collecte
les échecs d'acceptation, les incidents et les corrections des utilisateurs.

Les deux alimentent un même circuit : observer, trier, rechercher, proposer, décider,
versionner, revalider. Les identifiants restent stables ou reçoivent une correspondance
explicite. Une implémentation existante reste épinglée sur sa version tant qu'elle n'a pas
choisi d'adopter le changement. Rien ne change silencieusement sous les pieds d'un projet.

## La méthode est un moyen, pas le centre

Le Build Kit fournit une façon de consommer un contrat avec des agents : lire les clauses,
cadrer une tranche, choisir la stack avec l'utilisateur, implémenter en citant les identifiants,
exécuter les preuves, remettre un passage de relais lisible par la session suivante. Il est
agnostique de l'outil d'agent et s'installe à côté de ce que le projet utilise déjà.

Il n'est pas obligatoire. Une équipe avec ses propres habitudes peut produire une implémentation
conforme sans l'adopter. Le contrat et sa suite de conformance sont le standard ; le kit est un
accompagnement. Ses propres effets sont mesurés par un benchmark apparié, avec et sans kit, et
les résultats sont publiés tels quels.

## Ce que Composed voudrait rendre possible

Qu'une personne seule, avec un agent et la stack de son choix, construise un produit d'un type
connu en partant d'un contrat déjà étudié, déjà relu, déjà testable, au lieu de tout redécouvrir.
Que deux équipes qui ne se connaissent pas implémentent le même contrat et que leurs désaccords
remontent dans le contrat plutôt que de rester dans leurs têtes. Qu'un rapport de conformance
signifie la même chose d'un projet à l'autre.

Un standard ne vaut que par ses implémentations indépendantes. Composed publie ses contrats, ses
suites, ses implémentations de référence et ses résultats, y compris ceux qui ne lui sont pas
favorables, pour que d'autres puissent les reprendre, les contredire et les améliorer.
