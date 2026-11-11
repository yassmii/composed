# Évaluation de la simplification documentaire de Sol

Date : 4 novembre 2026.
Demande : analyser les changements de Sol et déterminer s'ils suffisent au chantier du handoff.
Évaluateur : Astra, dans la conversation qui contient aussi le travail de Sol. Cette analyse
partage son contexte ; elle ne constitue pas une revue indépendante en contexte neuf.

## Verdict

Amélioration utile de l'orientation documentaire, à conserver. Insuffisante pour clore la
simplification d'usage. Le premier incrément répond à l'entrée par situation et au prochain
résultat attendu ; sa démonstration d'un parcours concret reste partielle.

Ce verdict ne reproche pas au changement de ne pas livrer une nouvelle interface ou une CLI :
le handoff permet expressément une tranche documentaire. Il porte sur la charge qui reste à
l'utilisateur et sur l'absence d'un exemple instancié permettant d'examiner cette charge.

## Sources et méthode

- Handoff et audit de `.agents/work/usage-simplification/`.
- Diff de travail contre HEAD : README racine, README Build Kit, getting-started et changelog.
- Guide complet avant/après ; comparaison locale des lignes et mots séparés par espaces.
- Instructions existantes : bridge AGENTS FR, delivery-orchestrator FR, politiques pertinentes
  du catalogue, guide knowledge-lifecycle et prompts d'installation.
- Inspection seulement : aucune exécution d'agent consommateur, mesure utilisateur ou test CLI.
  Les validations de liens effectuées par Sol sont rapportées dans son handoff ; elles ne
  démontrent pas un gain d'usage. Il n'était pas nécessaire d'exécuter la suite de code pour
  valider son diff documentaire.

## Ce qui est réussi

Les liens du README racine permettent de choisir un départ sans connaître les noms des skills.
Les exemples disent quel résultat attendre et encouragent la réutilisation des décisions.
La distinction contrat / méthode / preuve est conservée. Le texte n'ajoute pas de formulaire
obligatoire et maintient la proportionnalité des corrections. L'audit annonce honnêtement ses
limites et ne transforme pas une inspection en étude utilisateur.

## Écarts par priorité

### 1. Le contexte reste en partie à assembler par l'utilisateur

`build-kit/docs/getting-started.md:31` demande des chemins pour le brief, le pin et les IDs
d'acceptation, puis la stack et les commandes. Le nouveau besoin demande le chemin du checkout
contrats (`:14`), et la reprise celui du handoff (`:56`). Ces exemples conviennent à quelqu'un
qui connaît déjà l'organisation du projet ; ils couvrent peu le cas « je connais mon besoin,
retrouve ce que nous avons déjà décidé ».

Ce ne sont pas des champs obligatoires, mais ils restent le seul départ illustré. La charge
de recherche et le vocabulaire interne ne sont donc pas réellement réduits dans l'exemple.
La doctrine et le catalogue contiennent déjà des règles de lecture du README, de la mémoire,
des sources canoniques et du handoff : vérifier leur application précède toute nouvelle règle.

Suite : illustrer une demande minimale avec un projet accessible, montrer les sources que
l'agent retrouve et ne demander que celles qui lui manquent réellement. Si plusieurs travaux
actifs sont plausibles, une question ciblée vaut mieux qu'une reprise devinée.

### 2. La simplification est ajoutée au guide au lieu de restructurer sa lecture

Le guide passe de 258 à 333 lignes et de 1 770 à 2 458 mots séparés par espaces, soit environ
39 % de mots supplémentaires. Le nouveau bloc est suivi des anciennes sections produit/outils,
stack, installation, arborescence, mises à jour, diagnostics, modèle agentique et migrations.
L'installation passe de la ligne 40 à 115, avec toutefois un lien direct dès la ligne 8.

La longueur seule ne prouve pas une dégradation : les liens directs améliorent l'accès aux trois
situations. Elle établit néanmoins que le contenu ancien n'a pas été simplifié ni déplacé.
La divulgation progressive envisagée dans le handoff reste largement à faire.

Suite : une entrée courte avec demande, résultat attendu et accès à l'installation ; renvoyer
les détails de maintenance et de méthode vers les références existantes, en gardant les choix
importants visibles au moment pertinent. Réduire les répétitions plutôt qu'ajouter un guide.

### 3. L'avant/après décrit des résultats attendus, sans exemple instancié

`audit.md:27` décrit des parcours avec des chemins génériques ; `audit.md:51` définit la
démonstration comme le suivi des liens. On ne voit pas une demande précise, les sources
effectivement retrouvées, la question restante et le prochain geste concret pour chacun.

Pour une correction documentaire, le contrôle de cohérence/liens est approprié. Pour conclure
que le parcours est praticable avec moins de charge, il manque au moins une démonstration
instanciée. Cela ne nécessite ni application patrimoniale, ni étude comparative, ni appel payant.

Suite : préparer trois exemples sur des sources connues ou des fixtures déclarées synthétiques.
Tracer demande initiale, sources accessibles, décisions réutilisées, questions nécessaires et
prochain geste. Distinguer une démonstration rédigée d'une session réellement exécutée.
Une observation humaine pourra ensuite mesurer si cette entrée est effectivement plus facile.

### 4. Le statut lisible est encore à réclamer

`getting-started.md:71` propose de demander un statut. C'est une aide utile, mais la personne
doit savoir qu'elle en a besoin et formuler la demande. Les instructions existantes de
l'orchestrateur prévoient déjà état, preuve, manque et prochain passage aux points de contrôle.
Le diff ne démontre pas comment cela se traduit dans une réponse courte compréhensible.

Suite : montrer cette restitution dans les exemples. Modifier les consignes distribuées
uniquement si l'essai révèle un manque ; éviter un format obligatoire pour chaque correction.

## Couverture des trois situations

| Situation | Gain livré | Ce qui manque pour juger le parcours |
| --- | --- | --- |
| Nouveau besoin | Entrée produit et distinction couverture / inconnues / décision. | Contrat réellement trouvé, statut identifié, première décision concrète ; accès aux sources expliqué. |
| Décisions déjà prises | Demande de réutiliser les décisions et de livrer une tranche avec preuves. | Démonstration de récupération des décisions à partir du projet, sans les faire reconstituer par l'utilisateur. |
| Correction / reprise | Deux demandes simples et rappel du parcours proportionné. | Exemple concret de correction bornée et reprise avec preuves encore valables ou périmées. |

## Installation et périmètre de la suite

L'installation conserve ses choix langue / agents / niveaux. `prompts.ts:44` dit toujours
« Which agents do you want to install? », alors que le kit installe des bridges, et `:58`
demande des niveaux internes. Ce sont des difficultés potentielles préexistantes, pas des
régressions introduites par Sol. Une inspection ne suffit pas à déterminer leur poids réel.
Ne pas considérer l'installation comme simplifiée ; la traiter séparément si l'essai montre
qu'elle est le principal obstacle. Aucun nouveau runtime ou portail n'est justifié ici.

## Tranche suivante recommandée

Conserver les trois entrées, raccourcir et réorganiser le guide, puis compléter trois
démonstrations instanciées avec une demande minimale et un prochain geste précis. Tester
d'abord les comportements déjà prescrits ; ajuster seulement les instructions qui échouent
à porter le parcours. Préserver les décisions, autorisations et garanties applicables.

Critère de sortie : depuis chaque départ, on peut voir ce que la personne fournit, ce que
l'agent retrouve, ce qui demande vraiment une décision et quelle action suit. L'exécution
réelle et le bénéfice observé doivent rester qualifiés séparément. Le chantier peut avancer
sur ces écarts documentaires sans attendre une étude utilisateur.
