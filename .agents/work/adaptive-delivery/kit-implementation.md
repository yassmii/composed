# Plan d'implémentation — routage adaptatif et delivery plus rapide

5 novembre 2026 — plan proposé. Base : Build Kit 0.7.0, catalogue 3.4.0,
commit `36cac49`. Dépendances : [plan runtime](runtime-implementation.md).
Aucune politique distribuée n'est modifiée par ce document.

## Résultat attendu

Le kit affecte chaque mission à un agent et à un modèle adaptés, natifs ou externes,
sans dépendance à une marque. Il réduit le contexte inutile, les tâches dupliquées,
les attentes et vérifications redondantes. Les exigences de validation et de revue
restent déterminées par le risque et le périmètre, pas par le prix du modèle.

## K1 — Politique d'affectation et organisation

Modifier `build-kit/skills/catalog.json`, l'orchestrateur FR/EN et
`build-kit/docs/runtime-capabilities.md`. Ajouter une politique courte :

1. Identifier livrable, critères d'acceptation, risque, inconnues, outils et dépendances.
2. Garder le parcours direct admissible ; décomposer les tâches complexes par livrable.
3. Éliminer les candidats incompatibles avec outils, données, permissions et contraintes.
4. Choisir dans les candidats restants selon compétences observées et préférences locales.
   Sans historique, choix prudent déclaré ; pas de classement universel ni de concours préalable.
5. Envoyer un brief borné : résultat, sources, contraintes, périmètre d'écriture,
   critères de sortie et format attendu. Éviter les relectures intégrales systématiques.
6. Paralléliser seulement les lots indépendants ; l'intégrateur avance sur le chemin
   critique. Réutiliser un agent si son contexte convient, sauf besoin de revue fraîche.
7. Tester les zones touchées pendant le travail puis intégrer et valider. Réexécuter
   après changements pertinents, jamais utiliser une preuve périmée pour gagner du temps.

Les profils rapide/standard/approfondi sont facultatifs et locaux. Un même modèle
peut remplir plusieurs profils ; le niveau d'effort n'est utilisé que s'il existe.
Une tâche risquée ne passe pas d'abord par un modèle moins capable « pour essayer ».

Escalade : diagnostic factuel de l'échec, puis changement du brief, des outils,
du découpage ou du modèle selon la cause. Limite explicite de tentatives dans la
mission ; pas de boucle identique ni nouvelle dépense hors enveloppe autorisée.

Sortie K1 : exemples direct/complexe/risqué, modèle unique ou multiple, et absence
de sélection. Aucun nouveau dossier requis pour une correction directe. Les
instructions sont des règles d'agent, pas un moteur qui impose leur exécution.

## K2 — Configuration et traçabilité minimales

Réutiliser `.agents/project-instructions.md` pour les préférences et pointeurs
vers la configuration d'exécution approuvée. Ne pas ajouter de registre de
credentials au kit. La configuration structurée nécessaire au lancement appartient
au runtime et à son protocole, pas à une seconde implémentation dans le kit.

Priorité : autorité utilisateur et contraintes projet applicables, puis choix
opérationnels de session dans cette portée, puis défauts. Une préférence de vitesse
ne remplace pas une interdiction de transmission ni une obligation de revue.

Dans `agents.md` existant : mission, raison courte d'affectation, mode natif/externe,
identifiant retourné, modèle demandé, modèle observé ou inconnu, workspace, état,
durée disponible, résultat et preuves. Les métriques manquantes restent inconnues.
Ne pas recopier prompts complets ou secrets dans le registre.

Sortie K2 : exemples sans configuration, avec un modèle unique et avec profils
locaux/gateway ; paramètres inconnus ou indisponibles exposés, aucun fallback caché.

## K3 — Intégration de la délégation externe vérifiée

Dépend du protocole R1 pour la conception ; livraison seulement après R5/R6 ou
qualification équivalente d'un runtime tiers. Le kit consomme une invocation locale
décrite et vérifiée, sans embarquer les SDK fournisseurs ni démarrer un service implicite.

Évolution explicite : conserver `multi-agent-required`, remplacer le minimum
« natif » par un minimum de délégations réelles vérifiées, admissibles en
`native-subagent` ou `external-agent`. Préserver toute exigence utilisateur plus
stricte. Une absence de ces deux modes bloque l'implémentation concernée, sauf
exception mono-agent explicitement autorisée. La revue indépendante reste distincte.

Une délégation externe compte lorsque mission, contexte enfant, identité d'exécution,
accès, workspace et résultat inspectable sont reliés. Un appel texte au modèle,
un nom de rôle, un événement interne ou une configuration ne suffit pas.

Fichiers à aligner : catalogue, orchestrateur FR/EN, skill delivery-review FR/EN,
bridges AGENTS/CLAUDE et tous les autres bridges portant la règle native,
documentation runtime/adoption/proportionate-delivery. Effectuer une recherche
exhaustive des références `native`, `minimum_native_delegations` et règles associées.
Migrer le champ de catalogue avec version explicite ; ne pas laisser coexister
deux champs contradictoires. `doctor` reste un contrôle d'installation.

Les preuves du runtime peuvent alimenter le registre, avec références et limites.
Conserver les formats JSON de reçus actuels tant qu'une extension versionnée et
ses consommateurs ne sont pas explicitement nécessaires. Aucun succès de processus
ne devient automatiquement une preuve de validation ou de revue indépendante.

## K4 — Vérifications de politique et d'adoption

Mettre à jour `evals/validate-catalog.mjs`, `evals/scenarios.json`, les tests
`multi-agent-default`, `agentic-catalog`, `skill-catalog` et `render-bridge`.
Si l'installation change, couvrir `init`, `update`, provenance et conflits locaux.
Ajouter des assertions négatives et comportements observables ; les occurrences
de mots-clés ne démontrent pas à elles seules le comportement d'un agent.

| Scénario | Résultat exigé |
| --- | --- |
| Petit correctif connu | Travail direct, contrôles pertinents, aucune cérémonie nouvelle |
| Complexe avec délégation native seule | Politique satisfaite par une mission utile réelle |
| Complexe avec externe qualifié seul | Mission externe comptée, preuves inspectables |
| Aucun mode de délégation utilisable | Blocage ciblé ou exception déjà autorisée, jamais agent inventé |
| Modèle/profil demandé indisponible | Limite visible ; alternative seulement dans la portée autorisée |
| Modèle local et données non exportables | Aucune substitution distante silencieuse |
| Sortie modèle positive, tests négatifs | Exécution achevée, livrable non validé |
| Auteur présenté comme reviewer | Revue indépendante non satisfaite |
| Deux auteurs sur écritures incompatibles | Isolation ou séquencement avant mutation |
| Saturation, refus d'accès, tentative répétée | Cause traitée sans escalade de modèle aveugle |
| Mise à jour avec adaptations locales | Prévisualisation/conflits conservés ; pas d'écrasement implicite |

Validation : catalogue, evals ciblées, tests pertinents puis types/lint et intégration
de la distribution. Les simulations contrôlent le protocole ; les sessions réelles
du pilote contrôlent le comportement. Ne pas appeler l'une preuve de l'autre.

## K5 — Pilote de vitesse et qualité

Ajouter un protocole distinct sous `build-kit/benchmarks/`, sans modifier le sens
du pilote historique Codex « avec/sans kit ». Définir avant les essais : fixtures,
révisions, budgets, répétitions, critères, ordre des sessions et règles de comparaison.

Comparer A : kit actuel ; B : organisation améliorée, modèle constant ; C : même
organisation, affectation adaptative. Réserver des tâches de confirmation :
correctif direct, lots parallèles, évolution risquée et diagnostic ambigu. Référence
correcte et mutant sémantique doivent calibrer le juge avant chaque campagne.

Mesures primaires : réussite des critères obligatoires et durée jusqu'à acceptation,
incluant corrections et validation. Secondaires : reprises, interventions humaines,
temps de coordination/outils/tests si observable, appels et usage complet ou inconnu.
Conserver échecs, blocages et délais dépassés ; ne comparer ni uniquement les succès
ni des résultats de qualités différentes. Les essais parallèles ne doivent pas
fausser la comparaison par contention du même serveur local.

Cible initiale proposée à figer avant essais : au moins 20 % de réduction de la
durée médiane sur les cas complexes comparables, aucune perte de réussite observée,
aucun contournement de gate et pas de régression supérieure à 10 % sur le parcours
direct, à interpréter avec la variance et le faible effectif. Ce sont des objectifs
de décision proposés, pas des gains promis ni une preuve statistique de non-infériorité.
Si C n'améliore pas B, livrer les gains d'organisation sans recommander le routage
comme optimisation démontrée. Toute famille non testée reste hors conclusion.

Premier pilote dans l'environnement habituel de l'utilisateur, confirmation sur
un autre client et une combinaison locale/gateway. Aucune campagne payante lancée
par défaut ; périmètre, données et enveloppe établis avant exécution.

## K6 — Livraison et migration

Versionner kit, catalogue, skills et notes de release selon les changements effectifs,
indépendamment du runtime. Ne pas fixer une version finale avant intégration.
Garder les instructions FR/EN équivalentes. Installation du runtime facultative :
les utilisateurs disposant de délégation native conservent leur parcours.

Faire une recette d'installation neuve et de mise à jour avec adaptations locales.
Migrer ensuite un consommateur pilote avec diff prévisualisé, puis les suivants.
Pour consumer-career et consumer-3d, préserver contrats/pins, changements locaux et
travaux en attente ; la présente planification ne migre aucun dépôt consommateur.

Retour arrière : réinstaller la révision précédente après prévisualisation sans
supprimer les preuves ou configurations locales. Une ancienne version qui exige
le natif ne doit pas être annoncée compatible avec des délégations externes seules.

## Ordre, propriétaires et traçabilité

K1/K2 et protocole K5 peuvent avancer pendant R0–R3. K3 se conçoit sur R1,
mais sa recette attend le runtime qualifié ; K4 accompagne chaque changement.
K5 réel suit K3/K4 ; K6 suit les vérifications et la revue indépendante.
Séparer travaux instructions/bridges, tests/comportements et pilote lorsque les
interfaces sont stables ; un intégrateur conserve catalogue, versions et migration.

Référence : [harness 1.0.0 candidate](../../../contracts/product-types/agentic-delivery-harness/contracts/contract.yaml),
sans promotion ni modification de pins. K1 : REQ-ADH-007/008/012/013 ; K2/K3 :
REQ-ADH-009 à 015 ; K4 : REQ-ADH-016 à 020 ; K5 : MET-ADH-003 et
ACC-ADH-016 ; K6 : REQ-ADH-001 à 003. Skills : delivery-orchestrator,
software-engineering, automated-testing, qa, delivery-review ; security-review
pour les limites d'accès/transmission. La mesure comparative demande un protocole
explicite : aucun skill installé ne vaut à lui seul qualification statistique.
