# Accélérer le delivery sans réduire les garanties

Date : 5 novembre 2026. Statut : plan proposé, aucune nouvelle politique implémentée.
Baseline inspectée : `36cac49`, Build Kit 0.7.0, catalogue 3.4.0.

Les lots détaillés et leur ordre d'exécution sont désormais définis dans le
[plan runtime](runtime-implementation.md), le [plan Build Kit](kit-implementation.md)
et le [handoff](handoff.md). Ces documents précisent et remplacent le découpage
préliminaire ci-dessous en cas de divergence.

## Objectif et périmètre

Réduire le temps entre une demande exploitable et une modification acceptée,
corrections et vérifications comprises. Préserver les critères d'acceptation,
les contrôles applicables et l'indépendance des revues requises.

Le kit définit une méthode portable. Le client agent, le modèle et son mode
d'accès sont trois dimensions distinctes : un client peut utiliser plusieurs
modèles, locaux ou distants, directement ou via une gateway. Aucun fournisseur,
abonnement, nom de modèle ou endpoint ne devient un prérequis du kit.

Clarification utilisateur : un orchestrateur dans Codex ou Claude doit pouvoir
déléguer à des agents utilisant Kimi, GLM, DeepSeek ou un modèle local, directement
ou via gateway. La portabilité des instructions seule ne satisfait pas cet objectif.
Le mécanisme doit exécuter une véritable mission d'agent avec les outils requis,
pas simplement obtenir une réponse textuelle d'un endpoint de modèle.

Ce chantier coordonne le Build Kit et le superviseur envisagé dans
[Composed Runtime](../../../docs/composed-runtime/README.md), avec dépôts et versions
indépendants. Les contrats produits et leurs pins chez les consommateurs restent inchangés.
Le livrable demandé ici est le plan ; son implémentation constitue l'étape suivante.

## Diagnostic vérifié

- Le [protocole runtime](../../../build-kit/docs/runtime-capabilities.md) distingue
  déjà capacités réelles et configuration, exige une délégation native utile pour
  les implémentations complexes et conserve les inconnues comme telles.
- L'[orchestrateur](../../../build-kit/skills/core/delivery-orchestrator/SKILL.fr.md)
  prévoit le parallélisme utile, l'isolation des écritures et les revues indépendantes.
- Le [catalogue](../../../build-kit/skills/catalog.json) prévoit un parcours direct
  et un chargement proportionné des instructions. Il ne définit pas de politique
  d'affectation des modèles aux tâches.
- Le [benchmark existant](../../../build-kit/benchmarks/README.md) compare le kit
  avec son absence, sur Codex à modèle/effort demandés constants et sur de petits
  correctifs. Il ne mesure pas le gain d'un routage multi-modèle sur du travail complexe.
- Le [plan runtime, section 6](../../../docs/composed-runtime/implementation-plan.md)
  prévoit explicitement Kimi et GLM via un runtime compatible et un adaptateur.
  Le [handoff runtime](../composed-runtime-planning/handoff.md) indique toutefois
  « moteur non implémenté ». La recherche dans le code CLI et les références locales
  n'a pas retrouvé de proxy inter-fournisseurs livré. Cela ne démontre pas son
  absence dans un autre dépôt ou une installation externe évoquée par l'utilisateur.

Recherche complémentaire après l'indice Rust : le plan runtime du 20 octobre
prévoit bien un superviseur Rust, dans un futur dépôt frère `composed-runtime`.
Son handoff original indique « aucune implémentation lancée ». Une recherche
des `Cargo.toml` jusqu'à quatre niveaux sous les dépôts voisins et le home Linux
retrouve `agent-os` et `consumer-3d`, mais pas ce runtime. Le README d'`agent-os`
décrit un noyau Rust distinct, tranche 1 close, dont le démon refuse encore le
démarrage d'agents faute d'isolation ; il ne démontre pas le proxy recherché.
Conclusion bornée : conception correspondante retrouvée, implémentation non
localisée dans les emplacements inspectés. Ne pas traiter le lot 0 comme une
intégration de logiciel déjà livré.

La lenteur ressentie est un signal utilisateur. Sa répartition entre génération,
outils, contexte, coordination, tests et reprises n'est pas encore mesurée.
Un gain chiffré ou un classement universel des modèles serait prématuré.

## Politique cible

1. Qualifier la tâche : résultat, ambiguïté, risque, compétences/outils nécessaires,
   dépendances, fichiers concernés et preuves attendues. Une petite tâche peut être risquée.
2. Choisir le mode de travail : direct si admissible ; sinon délégations utiles selon
   le graphe des dépendances et les capacités réelles. Conserver le gate multi-agent
   actuel jusqu'à la livraison K3, qui prévoit explicitement une délégation native
   ou externe vérifiée, sans imposer un fournisseur.
3. Choisir parmi les modèles autorisés et accessibles un candidat adapté à la tâche.
   Des profils facultatifs « rapide », « standard », « approfondi » expriment une
   intention, pas une garantie de compétence ni trois modèles obligatoires.
4. Donner un brief borné : objectif, sources utiles, contraintes, propriété des
   écritures, critères d'acceptation et format du résultat. Fournir le contexte
   nécessaire sans recopier automatiquement l'historique complet.
5. Contrôler le résultat avec les mêmes critères quelle que soit l'affectation.
   L'auteur garde ses contrôles ; une revue requise utilise un contexte neuf et
   un non-auteur, même si le modèle disponible est identique.
6. Réévaluer en cas de contrainte violée, preuve contradictoire, ambiguïté nouvelle
   ou échec non résolu. Identifier d'abord un problème d'accès/outillage/test : un
   modèle plus puissant ne le résout pas nécessairement. Éviter les relances identiques.

L'affectation tient compte des résultats observés sur la famille de tâches, des
contraintes utilisateur et des capacités nécessaires. Sans historique, utiliser
un choix prudent déclaré ; ne pas lancer un tournoi de modèles avant chaque tâche.
Une tâche critique reçoit dès le départ les moyens appropriés. Aucun abaissement
des contrôles pour respecter un objectif de vitesse.

## Capacités et configuration minimales

Réutiliser les instructions projet et `agents.md`/`handoff.md` quand ces artefacts
sont déjà requis. Aucun fichier supplémentaire obligatoire pour un correctif direct.

| Information utile | Traitement attendu |
| --- | --- |
| Délégation, outils, isolation, concurrence | Observation de la session ; configuration seule insuffisante |
| Choix du modèle par délégation | Disponible, indisponible ou inconnu ; ne jamais simuler la sélection |
| Modèles autorisés et préférences | Déclaration facultative du projet/utilisateur, surcharge prioritaire de la session |
| Profil et modèle demandé | Consigner brièvement la raison sur les tâches déléguées |
| Modèle effectivement utilisé | Identifiant renvoyé si disponible, sinon inconnu ; distinct de l'identifiant demandé |
| Effort, contexte, coût, latence | Facultatifs, uniquement si exposés ; pas de conversion universelle des réglages |

Les exemples de configuration utiliseront des identifiants symboliques. Les noms
réels restent locaux. Pas de secrets, clés API ou endpoints privés dans les traces.
Les restrictions de confidentialité du projet s'appliquent aussi au routage :
aucun passage automatique d'un modèle local à un service distant.

Sans sélection de modèle, utiliser le modèle disponible et optimiser découpage,
contexte et ordonnancement. Sans délégation native requise, conserver le blocage
actuel et les possibilités d'analyse ; une gateway ne crée pas cette capacité.

## Lots d'évolution

| Lot | Livrable concret | Acceptation et dépendances |
| --- | --- | --- |
| 0 — Retrouver le mécanisme d'exécution | Localiser le proxy évoqué, son dépôt/commit et ses points d'entrée ; sinon identifier le plus petit complément au plan runtime existant | Distinguer conception et code livré ; documenter lancement, outils, résultat et limites d'une vraie délégation inter-fournisseurs ; ne pas recréer un proxy déjà disponible |
| 1 — Politique portable | Consignes courtes de qualification, affectation, briefs, escalade et validation proportionnée dans le catalogue et l'orchestrateur FR/EN ; documentation runtime alignée | Parcours direct préservé ; aucun nom de fournisseur requis ; garanties actuelles explicites ; exemples avec et sans sélection de modèle |
| 2 — Intégration légère | Déclaration facultative des capacités/préférences via l'extension projet existante ; bridges FR/EN relaient uniquement les capacités réellement exposées ; traces minimales dans les artefacts existants | Dépend du lot 1 ; aucune invocation réseau ajoutée au CLI ; aucun changement forcé des réglages locaux ; modèle demandé et observé distingués |
| 3 — Vérification comportementale | Scénarios déterministes pour choix impossible, profil inconnu, tâche risquée, refus d'accès, saturation, conflit d'écriture et revue non indépendante ; vérification installation/mise à jour si touchées | Dépend des lots 1–2 ; démontrer replis et blocages corrects ; assertions de texte seules insuffisantes pour conclure sur le comportement réel |
| 4 — Pilote comparatif | Protocole séparé du benchmark historique, puis essais réels bornés et compte rendu des résultats favorables ou défavorables | Protocole figé avant essais ; qualité conservée, durée et reprises observées ; aucune promesse multi-runtime à partir d'un seul environnement |
| 5 — Distribution | Notes de release, versions des instructions/catalogue concernées, guide de migration court et mise à jour progressive des consommateurs | Après validation ; ne pas modifier les contrats ni leurs pins ; conserver une voie de retour à la politique précédente |

Commencer par le lot 0 et les lots 1–3 en un incrément cohérent. Définir les mesures du lot 4
avant l'implémentation, puis exécuter le pilote après les contrôles déterministes.
L'intégration d'une délégation externe fait désormais partie de l'objectif, avec
une exécution optionnelle séparée de la méthode du kit. Réutiliser le proxy s'il
est retrouvé ; s'il manque, détailler un incrément d'exécution dans le chantier
runtime existant avant de le déclarer disponible. Ne pas imposer le développement
d'une nouvelle gateway ou le lancement d'un serveur local pour utiliser le kit.
Clarifier explicitement si une délégation externe vérifiée satisfait le gate
actuellement « natif » ; aligner politique et tests avant de compter ce mode.
La réussite des seuls lots documentaires ne suffit pas à clore l'objectif clarifié.

## Protocole de mesure proposé

Comparer sur les mêmes tâches et états initiaux : A, kit actuel ; B, organisation
optimisée avec modèle constant ; C, même organisation avec sélection adaptative.
Cette séparation permet d'éviter d'attribuer au modèle un gain de coordination.

Inclure un correctif direct, une implémentation à lots indépendants, une évolution
d'interface risquée et un diagnostic ambigu. Réserver des cas à la confirmation,
non utilisés pour régler la politique. Alterner l'ordre des conditions, utiliser
des espaces frais et répéter les essais dans une enveloppe explicite de temps et
d'appels. Les appels payants et leurs limites feront l'objet d'un cadrage avant
exécution ; ce plan n'en lance aucun.

Premier environnement de terrain : celui principalement utilisé par l'utilisateur.
Confirmer ensuite dans un environnement distinct, notamment avec modèle local ou
accès via gateway lorsque disponible. Vérifier séparément client, modèle et accès ;
ne pas déduire la portabilité d'un simple changement de nom de modèle.

Mesures : temps total jusqu'à acceptation, taux de réussite, défauts bloquants,
reprises, interventions humaines, délégations, temps de coordination et de tests
quand observables. Compter les échecs, expirations et exécutions bloquées ; ne pas
calculer un gain uniquement sur les réussites faciles. Tokens/coûts incomplets
restent inconnus, surtout si les sous-agents ne remontent pas leur consommation.

Fixer avant les essais le seuil de gain jugé utile et la règle de comparaison.
Condition minimale de promotion : aucune dégradation observée des critères
obligatoires ni contournement de gate ; gain reproductible sur les cas visés sans
régression matérielle du parcours direct. Un petit pilote fournit une indication,
pas une preuve d'équivalence générale. Si le routage n'aide pas, conserver les
améliorations d'organisation seules et revoir l'hypothèse.

## Validation et prochaine action

Pour les instructions distribuées : alignement FR/EN, validation du catalogue,
evals pertinentes et cohérence des bridges. Si le CLI, l'installation ou les traces
structurées changent : types, lint et tests ciblés puis contrôles d'intégration.
Les scénarios simulés vérifient la logique, pas la performance réelle des modèles.

Prochaine action : résoudre le lot 0 puis implémenter le lot 1 avec exemples concrets, en cadrant les
mesures du pilote ; poursuivre les lots 2–3 sans ajouter un format obligatoire
ou une dépendance à un fournisseur. Conserver un propriétaire de l'intégration
et obtenir la revue indépendante requise pour les changements de politique.

Validation de ce livrable : inspection des sources locales citées et vérification
des liens relatifs et du diff. Aucun test produit, benchmark ou essai modèle réalisé.
