# Handoff pour Astra — simplifier l'usage de Composed

Date : 4 novembre 2026 (Europe/Paris).
État actualisé : démarrage et usage de la validation livrés dans le commit contenant ce handoff.
Prochaine action : observer une demande courte, puis sa validation, sur un projet consommateur.

## Enregistrement — 5 novembre 2026

Le propriétaire a demandé les commits et deux prompts de mise à jour pour consumer-career et
consumer-3d. La partie documentaire de composed-validation est enregistrée dans `4004c1a` ; la partie
Composed et ses preuves sont enregistrées avec cette note. Aucun push demandé ni effectué.
Les mentions « non commité » des sections suivantes décrivent l'état lors des validations initiales.

Inspection des consommateurs en lecture seule : consumer-career utilise le kit 0.7.0 depuis `168f198`,
avec manifeste et provenance spécifiques, et des modifications locales dans le travail frontend.
consumer-3d utilise encore 0.4.0 sans manifeste ; L2 est non commité. Les prompts doivent préserver ces
travaux, les pins produit/validation de consumer-career et le contrat 3d-engine 0.2.0 archivé. Ils demandent
une mise à jour de méthode, pas une migration implicite des exigences ou le démarrage d'un nouveau lot.

## Extension à la validation — 4 novembre 2026

À la demande explicite du propriétaire, la [tranche validation](validation-usage.md) ajoute une entrée
par besoin, l'interprétation des résultats et le prochain geste. La sortie humaine de `evidence run`
et `verify` a cette fois été modifiée ; les rapports JSON, codes de sortie et garanties restent identiques.
Le README et le guide de lecture des rapports du dépôt voisin composed-validation sont également
simplifiés. Ses suites, profils, verrous et code restent inchangés.

Contrôles réalisés : 19 tests des preuves, types et lint Build Kit ; 7 contrôles d'acceptation et 7
appels au vrai CLI en dossier temporaire ; `npm run validate` externe avec 49 tests réussis.
Les liens, artefacts et limites sont détaillés dans le compte rendu. Aucun candidat produit exécuté.
Les anciennes mentions « aucun comportement CLI modifié » ci-dessous décrivent la tranche précédente.

## Reprise Astra après revue — 4 novembre 2026

Le propriétaire a demandé d'évaluer la simplification de Sol, puis a confié les modifications à Astra.
La [revue](reviews/astra-usage-assessment.md) conclut à une amélioration utile mais partielle.
Cette revue partage le contexte de l'auteur initial et n'est pas une revue indépendante fraîche.

Modifications effectuées :

- Guide de démarrage réduit de 333 lignes / 2 458 mots à 98 lignes / 732 mots : demandes simples
  depuis le projet, recherche des sources existantes, question ciblée si accès ou travail ambigu.
- Options d'installation, arborescence, langue/niveaux et ancienne migration déplacés dans adoption.
  Maintenance, diagnostics et garanties restent accessibles via les références existantes.
- [Trois démonstrations](../../../build-kit/examples/starting-paths/README.md) avec vrais chemins sources,
  décisions récupérées et prochain geste : besoin patrimonial, module de filtre, reprise avec une note
  synthétique trop large. Le [handoff d'exercice](../../../build-kit/examples/starting-paths/resume.md)
  est explicitement fictif. Les réponses rédigées ne sont pas des transcriptions d'essais d'agents.
- README et changelog alignés. Aucun contrat, choix de stack, instruction distribuée, version ou
  comportement CLI modifié ; les règles existantes couvrent déjà la réutilisation et la reprise.

La [validation](validation.md) conserve les résultats : 97 liens locaux dont 22 ancres, six critères
de l'exemple produit passés et contre-exemple rejeté sur A2/A4. Le bénéfice utilisateur et la fiabilité
du comportement d'un agent consommateur restent non mesurés. Cette tranche documentaire est traitée ;
l'observation suivante doit déterminer si une modification des consignes ou de l'installation est utile.

Pas de commit, push, publication ou déploiement effectué. Les sections suivantes conservent l'historique.

## Reprise du 4 novembre 2026 — résultat

L'[audit avant/après](audit.md) distingue constats par inspection, hypothèse et retour du
propriétaire. Les sections suivantes conservent le contexte du handoff initial ; leurs mentions
« aucune simplification implémentée » et « livrable de cette session : ce handoff uniquement »
décrivent la session de préparation, pas la reprise présente.

- README racine : trois liens directs par situation avant l'installation.
- README Build Kit : entrée par la tâche avant les détails du kit.
- Guide de démarrage : trois demandes adaptables, sources existantes à fournir et résultat
  attendu ; statut facultatif décidé/réalisé/vérifié/ouvert/prochain geste.
- Changelog Build Kit : note sous Unreleased. Versions inchangées ; aucun changement aux
  contrats, instructions distribuées, règles d'exécution ou à la CLI.

Vérification effectuée : `rtk git diff --check` sans erreur ; contrôle local des liens Markdown
des quatre documents modifiés, de l'audit et de ce handoff (cibles et ancres de titres).
Pas de nouvelle preuve runtime : aucun parcours CLI ou agent consommateur exécuté, aucune
étude utilisateur. Les tests/types/lint de code ne sont pas requis par ce diff documentaire.

Le gain livré est une orientation explicite depuis le besoin et l'existant ; ni l'installation
ni la quantité de fichiers du kit ne sont réduites. Le gain d'usage reste à observer. Aucun
commit, push, déploiement ou publication effectué pendant cette reprise.

Pour continuer : faire essayer une entrée, observer la formulation de la demande, les questions
répétées et la capacité à retrouver la prochaine action. Choisir la tranche suivante sur ce
constat ; aucun choix de nouvelle interface ou de nouvelle commande n'est acté.

---

Contexte initial conservé :

## 1. Demande et décisions déjà actées

Le propriétaire demande de passer à la simplification d'usage après le contrat
patrimonial, et de préparer ce handoff pour reprendre avec Astra.

Deux formulations du propriétaire à préserver :

> « je suis pas dans la reproduction fidèle, mais dans la standardisation »
>
> « mais oui on peut largement simplifier l'usage »

L'orientation validée reste : **Composed relie l'intention produit, les règles métier
et la réalisation technique, avec des agents et des preuves pour maintenir leur cohérence.**

- Les contrats standardisent une définition produit réutilisable, ses règles et ses preuves.
  Ils ne prescrivent pas une stack et n'ont pas pour objectif de reproduire un logiciel.
- Le Build Kit est un bootstrap extensible : les outils et skills externes restent possibles,
  y compris en remplacement d'un rôle fourni. Aucun usage exclusif du kit n'est recherché.
- La demande concerne la facilité d'utilisation et de compréhension de cet ensemble.
  Elle ne décide pas encore d'une nouvelle interface, application ou politique d'exécution.
- La boucle peut conduire à modifier, simplifier ou abandonner une décision produit.
  Des tests verts ne démontrent ni le bénéfice utilisateur ni la supériorité de Composed.

Ne pas redemander cette vision. Les propositions de parcours ci-dessous ne sont pas
des décisions détaillées déjà approuvées.

## 2. Point de départ concret et état des dépôts

| Dépôt / artefact | État vérifié lors de la préparation |
| --- | --- |
| Composed | `main`, HEAD `a6c6a7c3fb6e540913376c326a3b130af6d147e5`, propre et synchronisé avec `origin/main` avant création de ce fichier. |
| Positionnement/routage ouvert | Commit `a2a6ddc`, livré : documentation alignée, catalogue 3.4.0 et delivery-orchestrator 1.4.0 ; package Build Kit 0.7.0. |
| Correction CI macOS | Commit `367d179`, fixtures temporaires résolues physiquement ; contrôles de sécurité runtime conservés. |
| Contrat patrimonial | Commit `a6c6a7c`, poussé. `wealth-advisory@0.1.0`, format 0.2, **draft**, 29 exigences et 26 scénarios. La CI du commit a ses huit jobs verts. |
| composed-validation | Dépôt voisin, branche `master`, commit local `6217295`. Profil patrimonial verrouillé sur `a6c6a7c`, 26 groupes / 54 dimensions prévues. Commit effectué, aucun push effectué dans cette conversation. |

La [famille patrimoniale](../../../contracts/product-types/wealth-advisory/README.md)
couvre recueil → bilan → diagnostic → scénarios → préconisations → validation et remise
→ suivi. LCB-FT et gel des avoirs sont différés. Les cas patrimoniaux sont non exécutés,
sans application, adaptateur ou runner patrimonial. Les 49 tests Linux/Windows de
composed-validation vérifient le validateur et les fixtures, pas un produit.
La revue métier, la provenance assurance à compléter et les modèles spécialisés
restent ouverts ; ne pas les traiter automatiquement dans le chantier de simplification.

Le contrat patrimonial est un **cas récent pour examiner le parcours Composed**,
pas une application à implémenter ni un pilote utilisateur déjà observé.
Le pilote consumer-video reste en attente de reprise après contractualisation.

## 3. Sources à lire, dans cet ordre

1. Instructions du dépôt et `<home>/.codex/RTK.md` : préfixer les commandes shell par `rtk`.
   Lire [contracts/AGENTS.md](../../../contracts/AGENTS.md) avant tout changement contractuel.
2. [README racine](../../../README.md), [README Build Kit](../../../build-kit/README.md)
   et [guide de démarrage](../../../build-kit/docs/getting-started.md).
3. [Livraison et apprentissage produit](../../../build-kit/docs/product-delivery.md),
   [parcours proportionnés](../../../build-kit/docs/proportionate-delivery.md),
   [catalogue et coopération des skills](../../../build-kit/docs/skill-catalog.md).
4. [Exemple produit exécutable](../../../build-kit/examples/product-loop/README.md)
   et [adoption/mises à jour](../../../build-kit/docs/adoption.md).
5. [Handoff précédent](../product-business-tech-direction/handoff.md) seulement pour
   les détails utiles du positionnement et des résultats, sans recommencer ses lots terminés.

Si une modification des instructions est envisagée, inspecter aussi le
[catalogue distribué](../../../build-kit/skills/catalog.json), les
[bridges](../../../build-kit/bridges/) et les variantes FR/EN du
[delivery-orchestrator](../../../build-kit/skills/core/delivery-orchestrator/).

Pour une modification CLI, partir de [l'entrée des commandes](../../../build-kit/src/cli/__main__.ts),
des [prompts](../../../build-kit/src/cli/prompts.ts) et du
[plan d'installation](../../../build-kit/src/cli/installation-plan.ts), en suivant
les dépendances du changement réel. Ne pas lire tout le dépôt par défaut.

## 4. Problème à examiner et premières hypothèses

Le guide actuel expose très tôt installation, agents, niveaux de skills, doctrine,
mémoire, gates et commandes. Le propriétaire confirme que l'usage peut être simplifié ;
aucune étude ne mesure encore où les nouveaux utilisateurs bloquent.

Hypothèses à éprouver sur le parcours, pas à promouvoir d'emblée en exigences :

- L'entrée pourrait partir du besoin et de l'existant, puis orienter vers contrat,
  réalisation ou vérification, sans demander de maîtriser l'organisation interne.
- Une progression visible pourrait présenter ce qui est défini, décidé, réalisé,
  vérifié et reste à décider, avec un prochain geste clair.
- L'agent pourrait retrouver et transmettre davantage de contexte existant au lieu
  de demander sa ressaisie ou d'ouvrir des ateliers en doublon.
- Les détails techniques pourraient être accessibles au moment où ils aident à choisir
  ou à diagnostiquer, tandis que les décisions et limites importantes restent visibles.

La discussion de Craft Anything a servi de contraste sur la lisibilité du parcours
et l'exécution concrète. Elle **n'autorise pas** à copier son produit, sa rétro-ingénierie,
son modèle d'interface ou à ajouter des centaines d'outils à Composed.

## 5. Première tranche recommandée

Commencer par un **audit bref suivi d'un parcours avant/après concret**. Le premier
geste d'Astra est de lire les trois entrées de la section 3 et de proposer au propriétaire
où intervenir d'abord, en s'appuyant sur des parcours précis.

Examiner trois situations à partir des sources existantes :

| Situation | Résultat que le parcours doit rendre compréhensible |
| --- | --- |
| Nouveau besoin, comme le conseil patrimonial | Retrouver un contrat pertinent ou préparer son évolution/création, distinguer choix, inconnues et prochaine décision. |
| Projet avec contrat et stack déjà choisis | Reprendre décisions et pins, réaliser une première tranche et retrouver ses preuves, sans refaire le cadrage acquis. |
| Correction bornée ou reprise d'un projet | Trouver l'état et le prochain geste ; utiliser le parcours direct et les seuls contrôles applicables. |

Pour chacun, relever les entrées, questions, fichiers et manipulations réellement
nécessaires. Distinguer friction observée par inspection, hypothèse et retour d'une
personne. Une simulation d'agent n'est pas une étude utilisateur.

Proposer ensuite le plus petit incrément utile : réorganisation de l'entrée, exemple,
consigne distribuée, aide CLI ou autre changement justifié. Fournir une démonstration
concrète du parcours et ses conséquences avant d'élargir. Ne pas fabriquer une nouvelle
plateforme ou un nouveau format obligatoire pour rendre cette proposition visible.

Le choix d'un écran, d'une nouvelle commande ou d'un portail reste ouvert. L'absence
de mesure comparative ne bloque pas une correction d'usage bornée ; elle limite ce
qu'on peut en conclure.

## 6. Frontières et autorisations

- **Livrable de cette session : ce handoff uniquement.** Ne pas considérer qu'une
  simplification a déjà été implémentée ou que sa conception détaillée est approuvée.
- Préserver la distinction contrat produit / méthode de livraison / validation externe.
  Ne pas créer de règle produit à partir d'une préférence de CLI ou de workflow.
- Les autorisations, invariants, choix de stack, validations et revues applicables
  ne disparaissent pas en cachant des fichiers ou en raccourcissant la documentation.
- La politique livrée conserve la délégation native pour les implémentations complexes
  et les revues indépendantes applicables ; le parcours direct existe déjà. Aucun
  changement précis de cette politique n'a été décidé. Si sa révision est proposée,
  expliciter le problème, l'impact et les garde-fous, sans l'adopter silencieusement.
- Le runtime superviseur dans `docs/composed-runtime/` est une conception, pas une
  capacité livrée ni un prérequis à la simplification.
- Aucun déploiement, publication de package, migration de tous les consommateurs,
  appel modèle payant ou changement du contrat patrimonial n'est demandé ici.
- Respecter les changements locaux des dépôts voisins. Les corrections consumer-3d,
  consumer-video et collaborative-workspace de la session précédente ne sont pas un nouveau
  chantier ; le rapport Markdown de collaboration est ignoré par Git et corrigé localement.

Ne pas redemander des permissions déjà accordées pour un travail ordinaire clairement
dans le périmètre de la nouvelle session. Ne pas déduire d'une simplification d'usage
une autorisation d'action externe ou irréversible.

## 7. Validation et condition de sortie du premier incrément

Un premier incrément utile montre une entrée claire, un parcours praticable et un
prochain geste pour les trois situations examinées. Les décisions canoniques et
preuves restent retrouvables ; les corrections simples n'acquièrent pas de cérémonie.
La restitution dit ce qui est effectivement plus simple et ce qui reste hypothétique.
La promotion des contrats ou une supériorité statistique ne sont pas des conditions
de sortie de cette tranche.

Valider dans le composant réellement changé :

- Documentation seule : cohérence et liens ; ne pas annoncer de nouvelle preuve runtime.
- Build Kit : contrôles natifs pertinents, notamment types, lint, tests et catalogue
  si instructions distribuées modifiées ; aligner FR/EN et versions concernées.
- Contrats : validation, tests et traçabilité propres au composant, seulement s'il change.
- Parcours CLI : exécuter le chemin modifié dans un dossier jetable, sans données privées.

Les dépendances du checkout principal sont historiquement Windows ; ne pas réinstaller
les binaires Windows depuis WSL. Node Windows 24.13.1 est disponible via `node.exe` ;
Node Linux 24.15.0 existe sous
`<home>/.local/share/fnm/node-versions/v24.15.0/installation/bin/`.
Un environnement Linux isolé peut être préparé si nécessaire. Les anciens logs ne
remplacent pas la validation du nouveau diff. Garder versions et notes de release
des composants indépendantes.

## 8. Prompt de reprise à donner à Astra

> Lis `.agents/work/usage-simplification/handoff.md` et les instructions du dépôt.
> Nous voulons simplifier l'usage de Composed, dont l'objectif est la standardisation
> produit–métier–tech, avec un Build Kit de bootstrap extensible. Cette vision est actée.
> Commence par examiner les entrées et les trois parcours décrits, puis propose un
> avant/après concret et la plus petite tranche utile. Sépare les frictions constatées
> des hypothèses. Réutilise les mécanismes existants et les décisions déjà prises.
> Ne repars ni sur le contrat patrimonial ni sur un runtime ou une nouvelle plateforme.
> Ne transforme pas une simplification d'usage en suppression silencieuse des garanties.
> Explicite les décisions encore nécessaires, puis avance dans le périmètre retenu et
> vérifie ce que tu modifies. Actualise ce handoff avec résultat et prochaine action.
