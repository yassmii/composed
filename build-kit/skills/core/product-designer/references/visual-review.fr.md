# Évaluer les décisions visuelles dans leur contexte

À lire pour une critique substantielle ou une comparaison de directions fournies. Sélectionne les
dimensions utiles ; n'en fais pas un audit complet obligatoire de chaque composant.

## Des preuves avant le verdict

Consigne surface, tâche visée, source et état observé. Un rendu permet des constats de composition ;
le code soutient des hypothèses d'implémentation ; manipuler l'interface permet des constats de
comportement. Marque les dimensions non observées comme inconnues. Un détecteur signale des motifs, pas le goût.

## Dimensions de revue

| Dimension | Question utile | Preuve ou intervention |
| --- | --- | --- |
| Pertinence produit | Qu'est-ce qui appartient spécifiquement à ce produit ou à son public ? | Identifie image, relation entre informations, démonstration ou voix ; remplace le remplissage interchangeable. |
| Composition | La structure exprime-t-elle les relations du contenu ? | Vérifie priorité, regroupement, rythme et balayage ; les cartes se justifient par des unités indépendantes, pas par défaut. |
| Typographie | Rôles, échelle et longueurs fonctionnent-ils avec le vrai contenu ? | Inspecte titres longs, nombres, mesure de lecture et polices chargées ; une police originale ne corrige pas une hiérarchie faible. |
| Couleur | Identité, emphase et états sont-ils distinguables ? | Inspecte combinaisons et thèmes réels ; mesure le contraste si possible, sans le deviner. Respecte les couleurs de marque imposées. |
| Images | Chaque visuel explique-t-il, démontre-t-il ou porte-t-il l'identité ? | Inspecte sujet, cadrage et placement ; repère stock générique ou produit absent. Vérifie source et droits avant réutilisation. |
| Interaction | Peut-on anticiper, accomplir et récupérer ? | Exerce action principale, clavier/focus, chargement et erreurs ; une jolie maquette ne constitue pas cette preuve. |
| Mouvement | Explique-t-il le changement ou sert-il l'expérience demandée ? | Vérifie interruption, mouvement réduit et appareils lents. Le mouvement décoratif est facultatif ; aucune entrée animée universelle. |
| Contenu | Le langage nomme-t-il choses et actions réelles ? | Vérifie titres vagues, affirmations répétées, libellés et reprise. N'invente jamais de preuve pour corriger la page. |
| Adaptation | La hiérarchie survit-elle aux écrans étroits et contenus longs ? | Compare des rendus réels ; vérifie zoom, débordements, focus visible et ordre de lecture pertinent. |

Pour l'accessibilité web, examine standard applicable et contexte du composant : le texte courant
demande généralement 4,5:1 de contraste, le grand texte 3:1, et les limites/indicateurs UI concernés 3:1.
La taille cible n'est pas une règle universelle de 44px : WCAG 2.2 AA prévoit un critère de 24 CSS px
avec exceptions ; des cibles tactiles plus grandes peuvent être un objectif d'utilisabilité. Les unités
et guides natifs diffèrent. Ces contrôles ne constituent pas un audit de conformité complet ; indique
ce qui a été mesuré et ce qui reste à tester.

## Comparer sans récompenser le spectacle

Compare avec le même brief, contenu, viewport et niveau de maturité. Juge séparément pertinence,
singularité, clarté de la tâche et exécution. Nomme la meilleure raison de ta recommandation et ce
qu'elle sacrifie. Ne favorise pas une illustration riche simplement parce que l'autre option est un
wireframe ; ne déduis pas la réussite d'une tâche depuis une capture préférée.

Repère les clichés de remplacement : crème/serif, sombre/néon et grilles éditoriales rigides peuvent
tous devenir le même template. Leur présence seule ne prouve rien. Quelle décision visible vient du
brief ? Préserve les contrôles familiers ; un écran métier dense n'a pas besoin d'un hero spectaculaire.

## Rendre les constats actionnables

Pour chaque problème matériel, donne localisation/état, observation, conséquence utilisateur ou de
marque, correction bornée et vérification. Distingue blocage d'usage, défaut d'exécution et préférence.
Par exemple, « sur mobile, le prix et l'achat sont séparés par la liste des fonctions ; rapproche les
informations de décision et vérifie le rendu étroit » est exploitable ; « rendre la page premium » ne
l'est pas. Préserve les points forts et nomme les quelques changements prioritaires. Consigne les
limites au lieu d'un faux succès.
