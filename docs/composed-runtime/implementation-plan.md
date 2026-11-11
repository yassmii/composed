# Plan d'implémentation — Composed Runtime

Date : 20 octobre 2026. Statut : proposition d'implémentation, non exécutée.
Rapatriement documentaire dans Composed : 24 octobre 2026.
Dépôt cible : nouveau dépôt frère `composed-runtime/`, nom de travail.
Ce document de conception est désormais conservé dans Composed. Le runtime cible
garde un dépôt, une version et une distribution indépendants ; son installation
reste optionnelle dans le Build Kit. Le plan ne lance pas son implémentation.

Revue indépendante du plan : acceptée après corrections ; voir
[le verdict](../../.agents/work/composed-runtime-planning/reviews/2026-10-20-runtime-plan-02.md).
L'acceptation du plan ne vaut ni recette du logiciel ni autorisation de dépense.

## 1. Résultat et frontières

Livrer un superviseur local en Rust qui permet à un orchestrateur de déléguer
des missions à plusieurs CLI agents, sans routeur d'API de modèles obligatoire.
Le moteur de référence doit pouvoir être remplacé par un autre moteur compatible.

Le premier parcours démontré sera : orchestrateur → deux runtimes différents,
missions bornées dans des worktrees distincts → événements/résultats persistés
→ intégration contrôlée et revue indépendante. Les appels réels restent soumis
aux accès, à l'autorisation de transmission et aux coûts disponibles.

Décisions de conception retenues pour ce plan :

- dépôt, version et distribution indépendants de `composed` et de sa validation ;
- protocole ouvert, documenté et utilisable sans Rust ni dépendance Composed ;
- aucun LiteLLM, catalogue de modèles ou SDK de fournisseur dans le noyau ;
- adaptateurs exécutables séparés, remplaçables, dans le langage de leur auteur ;
- moteur responsable de l'exécution ; orchestrateur responsable du raisonnement,
  de l'attribution, des arbitrages et de l'intégration ;
- aucun rôle, média ou workflow propre à un client codé dans le runtime ;
- installation du runtime toujours optionnelle dans le Build Kit.

Hors premier incrément : UI, SaaS, ordonnanceur distribué, découverte automatique
de plugins distants, installation automatique de CLI, authentification centralisée,
SSO, inférence intégrée, routage intelligent de modèles, DAG de workflow complet,
PTY interactif, dialogue continu avec un agent et relance autonome des missions.

## 2. État observé et hypothèses

Inspection locale effectuée le 20 octobre 2026 :

- `composed-runtime/` n'existe pas ; sa création Git relève du lot 0 ;
- le Build Kit local prévoit `multi-agent-required`, actuellement natif uniquement ;
- son adaptateur `evals/adapters/command.mjs` lance des évaluations, pas un moteur
  de délégation produit ; ne pas lui attribuer les garanties du futur runtime ;
- Rust/Cargo 1.99.0, Codex CLI 0.162.0-alpha.17.2 et Claude Code 2.1.263 répondent
  à `--version` dans le contexte WSL ;
- aucune authentification, compatibilité complète ou disponibilité de modèle
  n'est démontrée par ces contrôles ; aucune inférence n'a été lancée.

Les aides locales `codex exec --help` et `claude --help` confirment aussi les
options de sortie structurée prévues, sans prouver leur exécution réelle.

Hypothèse plateforme : premier parcours dans un même environnement Linux/WSL,
avec processus enfants Linux. Windows natif aura son propre gate de validation.
Le mélange superviseur WSL/enfants Windows est reporté, pas implicitement supporté.
Les versions prérelease demandent des tests de compatibilité explicites.

L'autorisation actuelle porte sur la rédaction du plan. Ne créer ni dépôt ni
service et ne lancer aucun CLI agent facturable au titre de cette seule étape.

## 3. Architecture et propriété des contrats

```text
Agent orchestrateur / outil de contrôle
             │ protocole public de délégation
             ▼
Moteur compatible (Rust de référence ou autre)
             │ protocole d'adaptateur
             ├── adaptateur Codex ── CLI Codex
             ├── adaptateur Claude ─ CLI Claude Code
             └── adaptateur tiers ── autre CLI
```

Le nouveau dépôt héberge deux frontières versionnées séparément :

1. protocole public de contrôle : les six opérations ci-dessous ;
2. protocole d'adaptateur : handshake, mission, événements, résultat et arrêt.

Les schémas JSON et exemples sont canoniques ; les types Rust sont leur
implémentation vérifiée. Aucun consommateur ne doit compiler le moteur pour
comprendre ou implémenter les échanges. Versions, compatibilité, limites et
extensions sont publiées avec les schémas. Une rupture avant 1.0 reste explicite,
sans migration silencieuse des anciens journaux.

Deux profils de conformité évitent de confondre interface et supervision :
`control-core` impose les six opérations et leur sémantique commune ;
`process-supervision` ajoute les garanties d'exécution/arrêt réels. Le moteur
Rust vise les deux. Un petit moteur hors Rust avec faux agents vise le premier,
sans être annoncé comme superviseur de production. Une capacité optionnelle
refusée n'exonère jamais d'un cas obligatoire du profil revendiqué.

Arborescence cible, volontairement limitée :

```text
composed-runtime/
├── AGENTS.md
├── Cargo.toml / Cargo.lock / rust-toolchain.toml
├── README.md / CHANGELOG.md
├── protocol/
│   ├── control/0.1.0/       # schémas, exemples et erreurs
│   └── adapter/0.1.0/       # schémas et négociation
├── src/                    # un crate lib + bin, modules internes
│   ├── protocol/
│   ├── supervisor/
│   ├── scheduler/
│   ├── storage/
│   ├── workspace/
│   └── transport/
├── adapters/               # exécutables séparés, sans ABI Rust de plugin
├── conformance/            # cas publics sans dépendance au noyau Rust
├── examples/               # faux agents et adaptateur tiers
├── tests/
├── benchmarks/
└── docs/                   # décisions, sécurité, compatibilité, intégration
```

Choix techniques proposés : Rust stable épinglé, Tokio pour les processus/I/O
asynchrones, Serde pour les échanges, parser d'arguments léger et Git en processus
pour les worktrees. Dépendances minimales justifiées et verrouillées au lot 0.
Éviter de découper immédiatement le noyau en de nombreux crates.

## 4. Protocole public : six opérations et erreurs transverses

| Opération | Effet et réponse |
|---|---|
| `capabilities` | Versions, adaptateurs, opérations, plafonds et garanties réellement disponibles ; ne lance aucune inférence. |
| `start` | Valide et enregistre une mission, puis retourne un `run_id` ; acceptation ne signifie pas démarrage ni réussite. |
| `status` | État courant et références de preuve, sans restituer tous les logs. |
| `events` | Page d'événements bornée avec curseur et limite en octets. |
| `cancel` | Demande d'arrêt idempotente ; accusé de réception distinct de l'arrêt confirmé. |
| `result` | Résultat terminal, motif, état du nettoyage et références d'artefacts ; `NOT_READY` sinon. |

`error` n'est pas une septième opération : toutes les requêtes peuvent recevoir
une enveloppe d'erreur ; un run peut aussi émettre un événement d'échec.
Chaque requête porte `protocol_version`, `request_id`, `operation` et `params`.
Chaque réponse reprend l'identifiant et contient soit `ok: true, data`, soit
`ok: false, error`, jamais les deux. Les événements portent `run_id`, un numéro
de séquence croissant, la date UTC, le type et une charge utile bornée.

L'erreur comprend code stable, message assaini, origine, référence de diagnostic
et indication de réessayabilité. Codes initiaux : `INVALID_REQUEST`,
`UNSUPPORTED_VERSION`, `CAPABILITY_UNAVAILABLE`, `POLICY_DENIED`,
`QUEUE_FULL`, `ADAPTER_UNAVAILABLE`, `AUTH_REQUIRED`, `NOT_READY`,
`IDEMPOTENCY_CONFLICT`, `LIMIT_EXCEEDED`, `STORAGE_ERROR` et `PROTOCOL_ERROR`.
`STORE_BUSY` signale un domaine de stockage déjà détenu par un superviseur.
Les catégories extensibles ne doivent pas masquer un état terminal existant.
`retryable` n'autorise jamais à lui seul une nouvelle exécution.

Transport v0.1 : session locale bidirectionnelle en JSONL sur stdio. stdout est
réservé au protocole ; diagnostics locaux sur stderr, sans secret. Requêtes
indépendantes et réponses corrélées ; un `start` ne monopolise pas la session.
`events` est paginé, sans abonnement illimité dans la première version.

Le mode de commodité `run <mission.json>` possède sa session jusqu'à la fin.
Pas de run détaché ni de daemon implicite. Le contrôleur stdio peut soumettre,
observer et annuler plusieurs runs dans la même session. Une consultation
hors session lit les archives ; elle ne prétend pas piloter un processus vivant.
La fermeture de l'entrée ou la perte du contrôleur déclenche l'arrêt supervisé.

## 5. Mission, états et preuve

Mission minimale :

- identifiant stable, objectif, entrées référencées et critère de sortie ;
- adaptateur explicitement choisi, configuration approuvée et version observée ;
- contexte requis : instructions applicables, skills et références canoniques ;
- workspace, révision de base et périmètre d'écriture attendu ;
- politique d'accès/transmission et limites de durée/sortie/concurrence ;
- absence de substitution de runtime ou modèle sans décision explicite.

Ne pas envoyer le dépôt entier par défaut. Références, prompts et résultats
peuvent eux-mêmes être sensibles. Les artefacts externes sont non fiables :
ils ne deviennent pas des instructions de contrôle et ne modifient pas la politique.

Cycle : `queued → starting → running → terminal`, avec `cancelling` comme état
intermédiaire d'une demande d'arrêt. États terminaux : `completed`, `failed`,
`cancelled`, `timed_out`, `indeterminate`. Une transition terminale est unique.
La course fin/annulation est arbitrée par les observations ordonnées et journalisée.

Le résultat sépare :

1. exécution observée : processus, signal/code de sortie, événements et nettoyage ;
2. résultat déclaré par l'agent : fini, bloqué, incomplet ou inconnu ;
3. validation du livrable : non effectuée par défaut, références de contrôles et
   verdict indépendant éventuellement fournis ensuite.

L'état `completed` signifie que le protocole d'exécution a abouti, pas que le code
est correct ou conforme. Une sortie 0 sans fin structurée attendue ne suffit pas.
Un contrôle d'accès annoncé par l'agent n'est pas une garantie du système.

## 6. Adaptateurs et compatibilité

L'adaptateur est un programme de confiance explicitement configuré :
exécutable + tableau d'arguments, sans chaîne shell interpolée. Son lancement
est lui-même une exécution de code ; aucune découverte/exécution automatique
d'un manifeste trouvé dans un dépôt non fiable.

Handshake borné sans inférence : versions, identité, fonctions et limites.
Le moteur fournit la mission, reçoit des événements structurés et le résultat.
Une fonction indisponible est refusée, non simulée. Le protocole public et celui
de l'adaptateur n'ont pas à partager les mêmes noms d'opérations.

Premier jeu :

- faux adaptateur déterministe pour tous les chemins de panne ;
- adaptateur Codex : mode non interactif JSONL, vérifié sur version installée ;
- adaptateur Claude Code : mode non interactif et sortie JSON structurée/stream ;
- adaptateur d'exemple en JavaScript ou Python, lançant un faux CLI sans LLM,
  pour prouver l'extension hors Rust sans recompiler le noyau.

Livrer séparément `examples/control-engine-python/` : petit moteur de contrôle
hors Rust, avec faux agents déterministes, stockage et six opérations du profil
`control-core`. Il reçoit le même client et la même suite de conformité de
contrôle que le moteur Rust. Cela prouve le remplacement du moteur ; l'adaptateur
tiers seul ne démontrerait que le remplacement d'un adaptateur.
Cet exemple pédagogique n'est pas une dépendance du binaire Rust ni une
installation Python obligatoire pour ses utilisateurs.

Kimi, GLM et d'autres modèles passent par un runtime compatible et un adaptateur
approprié. Aucun support ne sera déclaré avant recette de la combinaison réelle.
Un CLI purement textuel reçoit une capacité réduite ; ne pas inventer d'événements
de modification ou de validation à partir d'un texte libre.

Les commandes et formats fournisseurs sont encapsulés, avec fixtures assainies,
plage de versions testée, gestion des événements inconnus et refus des changements
incompatibles. Les options de permission sont explicites, jamais un bypass global.
L'authentification reste gérée par le CLI ou par des références d'environnement
autorisées ; pas de copie de jetons dans la mission, les arguments ou les rapports.

Documentation actuelle à revérifier au lot d'adaptation : Codex expose les
événements JSONL de son mode non interactif. [Documentation officielle](https://learn.chatgpt.com/docs/non-interactive-mode).
Ne pas baser l'intégration sur l'ancien hébergement `codex mcp-server`, retiré ;
l'app-server est une autre interface, à évaluer seulement si le besoin l'exige.
[Migration officielle](https://learn.chatgpt.com/docs/mcp-server).
Claude Code propose les sorties JSON et stream-json de son mode non interactif.
[Documentation officielle](https://code.claude.com/docs/en/headless).
Ces pages ne prouvent pas que les versions installées ont toutes leurs fonctions.

## 7. Supervision, limites et sécurité

Un superviseur détient les handles, draine stdout/stderr simultanément, applique
les délais et attend effectivement la fin. Une future abandonnée n'est pas
une preuve d'arrêt de processus ; Tokio le précise dans sa documentation.
[Gestion des processus](https://docs.rs/tokio/latest/tokio/process/index.html).

Prévoir un arrêt gracieux borné puis un arrêt forcé, mécanismes dédiés aux
groupes de processus Unix et aux descendants Windows. Tester un adaptateur
qui crée un enfant puis disparaît. Séparer état de mission et état de nettoyage :
si les descendants ne sont pas confirmés arrêtés, conserver la limite et ne pas
affirmer une annulation complète. Les processus qui échappent au groupe restent
un risque à traiter par un sandbox dédié, pas une garantie du simple superviseur.

Les worktrees sont créés dans un emplacement explicitement autorisé, depuis
une révision connue, sans reset du dépôt principal. Un agent écrivain reçoit
son propre worktree ; une branche seule ne suffit pas. Aucun merge, suppression
de travail ou nettoyage destructif automatique. Les modifications sont conservées
pour inspection. Les worktrees ne constituent pas une barrière de sécurité.

La politique distingue `requested`, `declared`, `verified` et `enforced`.
Exiger une protection réseau ou filesystem non disponible entraîne un refus.
Ne pas déduire d'une instruction « lecture seule » que le système bloque l'écriture.
Un client et un adaptateur locaux sont de confiance ; isolation d'un client
malveillant/multi-utilisateur reportée. Dossier d'état privé, pas de port ouvert.

Moyens de maîtrise des ressources :

- plafonds de runs actifs et en attente, globaux et par adaptateur ;
- plafonds de requêtes de contrôle en vol et de réponses en attente ; la saturation
  est refusée ou fermée proprement, sans croissance mémoire implicite ;
- taille maximale des missions, trames JSON, messages, pages et résultats ;
- tampon mémoire borné, lecture incrémentale y compris ligne sans fin ;
- quotas de logs/artefacts par run et de stockage total ; fin contrôlée au plafond ;
- priorité aux réponses de contrôle/annulation ; lecteur lent ou déconnecté testé ;
- pas de file d'archive ni d'index en RAM proportionnel à toute l'histoire.

Les files bornées sont une décision d'architecture, pas une conséquence
automatique du choix de Rust. [Recommandations Tokio](https://tokio.rs/tokio/tutorial/channels).
Valeurs initiales proposées, ajustables après mesure : 4 runs actifs, 32 en
attente, 256 Kio par trame et 64 Mio de logs par run. Fixer également un quota
total de stockage et les limites du contrôle au lot 1, avant le lot 2.
Ces valeurs ne sont pas des benchmarks.

Les contrôles de concurrence, durée et sortie sont imposables par le moteur.
CPU/RAM des enfants et dépenses fournisseur ne sont des limites strictes que
si un mécanisme approprié les impose ; sinon annoncer mesure/estimation/inconnu.
Les sous-agents qu'un CLI crée lui-même doivent être désactivés ou bornés par
une capacité vérifiée, faute de quoi le plafond global de processus n'est pas garanti.

Pour les secrets : environnement filtré, héritage minimal nécessaire au CLI,
pas de dump de configuration ni de logs bruts par défaut. Assainissement avant
persistance et export, détection de secrets de test ; masquage non présenté comme
protection exhaustive contre toute exfiltration. Toute transmission réelle
utilise uniquement un dépôt synthétique autorisé, jamais des données client.

## 8. Persistance et reprise

Première version : dossier local privé avec manifestes bornés, journal append-only
par run, résultats atomiques et empreintes des artefacts. Pas de base externe.
Le domaine persistant d'idempotence est un namespace identifié dans un dossier
d'état canonique, indépendant d'une connexion/session et conservé au redémarrage.
Un seul écrivain/superviseur détient ce domaine ; le verrou couvre également
la recherche des clés et l'admission. Un second superviseur est refusé avec
`STORE_BUSY`, sans créer un domaine de remplacement en silence.
Les hashes identifient les octets, ils ne garantissent pas l'authenticité de l'auteur.

Enregistrer l'intention et synchroniser le stockage avant lancement. `start`
porte une clé d'idempotence liée à l'empreinte de la mission : même clé/même
mission retrouve le run ; même clé/autre mission refuse. Pas de nouvelle
exécution pour répondre à une retransmission réseau/stdio.

Le lot 1 fixe la canonicalisation de mission et ses fixtures d'équivalence,
incluant la version du schéma. Les clés sont conservées avec les résultats ou
des tombstones, jusqu'au retrait explicite du namespace ; pas d'éviction
automatique susceptible de réexécuter une ancienne clé. La capacité disque
restante conditionne les nouvelles admissions. Une suppression/rotation
autorisée expose la perte de ce domaine de garantie. Après redémarrage, la
même clé retrouve le run terminé ou indéterminé, jamais une relance implicite.

Documenter la fenêtre crash entre création du processus et enregistrement
de son identité. L'exactly-once des effets externes n'est pas garanti.
Après crash : vérifier le journal, repérer une fin tronquée, conserver les preuves
et marquer les runs non conclus `indeterminate`. Ne jamais adopter ou tuer un
processus sur son seul PID réutilisable, ni relancer automatiquement la mission.
Reprendre l'observation n'est pas reprendre l'exécution.

Rétention et suppression sont explicites : pas d'effacement automatique d'un
worktree modifié pour satisfaire un quota. Dépassement = arrêt/refus documenté.
La cohérence après crash et le comportement disque plein sont testés.

Avant admission, réserver un budget de finalisation borné par run ; arrêter les
logs avant de consommer cette réserve. Réserver un budget logique ne garantit pas
qu'un disque physique reste accessible : si même l'écriture terminale échoue,
répondre `STORAGE_ERROR` si possible et traiter au redémarrage le run non conclu
comme `indeterminate`. Ne pas prétendre avoir persisté une fin perdue.

## 9. Lots, dépendances et conditions de sortie

| Lot | Livrables | Dépendance | Gate de sortie |
|---|---|---|---|
| 0 — Socle | Nouveau dépôt, instructions, licences choisies explicitement, outillage Rust verrouillé, CI Linux/Windows, ADR et fixtures synthétiques | Autorisation d'implémenter | Build/test minimal reproductible, aucune dépendance au kit ou modèle |
| 1 — Protocole | Schémas 0.1, profils control-core/process-supervision, erreurs, états, limites, domaine d'idempotence, versionnement, exemples valides/invalides et cas publics | 0 | Revue indépendante des échanges et modèle de menace ; exemples vérifiés par deux validateurs |
| 2 — Exécution minimale | Session stdio, six opérations, faux adaptateur, superviseur, événements, arrêt, journal et petit moteur de contrôle Python séparé | 1 | Parcours synthétique ; même suite control-core sur les deux moteurs, état terminal honnête et aucun enfant attendu restant |
| 3 — Robustesse | Scheduler borné, quotas, backpressure, crash/reprise, worktrees, environnement et journal assaini | 2 | Batterie de pannes et mesures mémoire ; pas d'implémentation fournisseur pour contourner un défaut noyau |
| 4 — CLI réels | Adaptateurs Codex et Claude séparés, compatibilité versionnée, guide tiers | 1 et API du 2 ; intégration après 3 | Recette autorisée de deux runtimes différents et troisième adaptateur hors Rust sans recompilation |
| 5 — Composed optionnel | Politique native/externe, pont d'invocation et export des preuves | 3 et 4 | Même méthode utilisable sans installer le moteur Rust ; aucun contrat produit modifié |
| 6 — Livraison autonome | Suite de conformité, rapports par plateforme revendiquée, benchmarks, revue fraîche, installation/arrêt/reprise | 2–4, pas 5 | Gates requis satisfaits, limites déclarées, révision candidate identifiée |

Le lot 2 fournit le premier binaire utilisable avec faux agents ; il ne constitue
pas une preuve de délégation entre deux agents LLM réels. Le jalon hétérogène est
le lot 4. Une absence de comptes/coûts autorisés ne bloque pas les lots synthétiques
mais laisse la recette réelle non effectuée.

Le support Linux/WSL est le premier jalon. Une release annoncée Windows-compatible
attend les tests Windows natifs : chemins avec espaces, Unicode, verrous, arrêt
des descendants et résultat atomique. macOS reste non revendiqué sans recette.

| Livraison | Gates obligatoires | Sans effet bloquant sur cette livraison |
|---|---|---|
| Runtime Linux/WSL autonome | Lots 0–4, lot 6 sur Linux/WSL, profils requis et revue indépendante | Lot 5 et qualification Windows |
| Runtime Windows natif | Gates autonomes, compilation et recette native Windows spécifiques | Lot 5 et support macOS |
| Intégration Composed | Runtime compatible qualifié, lot 5, tests du Build Kit et revue | Présence d'un moteur de marque Composed chez tous les utilisateurs |

Le lot 5 peut être livré après le runtime. Un moteur tiers conforme peut également
servir à la recette de l'intégration ; aucune dépendance obligatoire au binaire Rust.

## 10. Validation et mesure

Commandes Rust prévues, pas exécutées pendant cette rédaction :
`cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`,
`cargo test --locked` et tests de conformité externes sur le binaire release.
La commande normative de conformité sera fixée au lot 1, sans charger de module
privé du moteur et sans imposer Rust aux moteurs alternatifs.

Cas publics indispensables :

1. version inconnue, JSON invalide, trame trop grande et opération non offerte ;
2. mission acceptée, mise en file, lancée, retrouvée puis résultat récupéré ;
3. clé dupliquée, clé en conflit, réponse `start` perdue, même clé après redémarrage
   et deux sessions/superviseurs visant le même domaine persistant ;
4. exécutable absent, accès/auth manquant, fin structurée absente et sortie non nulle ;
5. annulation en file/en cours/après fin, timeout et course fin-annulation ;
6. enfant/petit-enfant actif, adaptateur mort et contrôleur déconnecté ;
7. stdout/stderr saturés, ligne sans fin, lecteur lent et quotas atteints ;
8. journal tronqué, stockage plein, résultat partiellement écrit et crash au lancement ;
9. worktrees concurrents, dépôt principal sale préservé et aucun merge implicite ;
10. secrets synthétiques absents des journaux et configuration non fiable refusée ;
11. résultat déclaré positif mais vérification indépendante négative : jamais
    requalifié en livrable validé ;
12. même suite noire `control-core` sur moteur Rust et moteur de contrôle Python ;
    `process-supervision` sur le Rust, et sur tout autre moteur revendiquant ce
    profil. Une opération obligatoire refusée fait échouer le cas ; une capacité
    optionnelle absente reste signalée, jamais verte par omission.

Les tests déterministes n'appellent aucun fournisseur. Les recettes réelles,
opt-in, utilisent des fixtures synthétiques et une autorisation explicite de coût
et de transmission. Une fixture de trace fournisseur n'est pas une inférence réelle.

Benchmarks : build release, machines/OS/configuration/version précisés, runs à
concurrence 1/2/4, émissions croissantes et répétitions. Mesurer RSS/CPU du
superviseur séparément des adaptateurs/enfants, disque, p95 de réponse au contrôle
et délai d'arrêt. Conserver les valeurs brutes et les pics : pas seulement la moyenne.

Critère mémoire : à concurrence et tailles de tampons fixées, la mémoire du
superviseur doit plafonner quand le volume total de logs augmente, dans le quota
disque. Fixer après baseline une enveloppe chiffrée par plateforme, puis un seuil
de régression en CI. Ne pas annoncer une économie mesurée avant ces essais.
Un outil qui ne fournit pas une métrique la marque indisponible, pas zéro.

Chaque rapport donne révision du moteur, version des protocoles/adaptateurs/CLI,
commandes, dates, environnement, cas, résultat, limites et empreintes des preuves.
Verdicts : pass, fail, blocked, not_run. Un plan n'est pas un résultat d'exécution.

## 11. Organisation agentique de l'implémentation

Le plan ne préjuge pas de la disponibilité d'une équipe externe encore inexistante.
Pour construire ce runtime, utiliser les délégations réellement disponibles dans
la session, sans prétendre que le moteur en développement orchestre déjà son auteur.

Après accord du lot 1, trois périmètres possibles :

- noyau/supervision : `src/supervisor`, `scheduler`, `storage` et leurs tests ;
- adaptateurs : `adapters/` et fixtures, via la version d'interface approuvée ;
- validation : `conformance/`, faux agents et benchmarks black-box.

L'orchestrateur garde schémas, types partagés, Cargo.lock, CI et intégration.
Worktrees distincts pour écrivains, nombre d'agents adapté aux capacités réelles.
L'agent validation prépare ses assertions depuis les schémas, sans importer
les modules privés du moteur ni affaiblir les attentes pour les faire passer.
Les lots dépendants ne sont pas rendus parallèles par une simple liste de rôles.

Registre réel `agents.md`, handoffs et preuves ; revue indépendante dans un
contexte neuf n'ayant pas écrit le livrable examiné. Figer une révision candidate,
corriger les écarts puis rejouer les cas affectés. Ne pas confondre conformité
du protocole d'exécution et validation du projet que l'agent a implémenté.

## 12. Intégration et décisions restantes

Évolution future du Build Kit, seulement au lot 5 :

- accepter `native-subagent` ou `external-agent` vérifié, sans marque obligatoire ;
- remplacer le minimum « native » par un minimum de délégations vérifiées tout
  en préservant les contraintes utilisateur plus strictes ;
- référencer protocole, capacités, méthode d'invocation et preuves attendues ;
- permettre au même orchestrateur d'utiliser un moteur tiers compatible ;
- exporter le registre Composed depuis les preuves, sans faire du Markdown le
  stockage opérationnel et sans recopier les prompts/secrets ;
- maintenir l'indépendance de revue ; un moteur différent ne la prouve pas seul.

Le prompt du POC d'origine est volontairement figé sur une ancienne référence et exige du
natif : aucune réécriture automatique dans ce chantier. Son changement de mode
sera une décision séparée. `composed-validation` reste dédié à la validation
des apps/contrats ; la conformité du runtime vit dans le nouveau dépôt.

Avant les premiers appels réels : confirmer versions, accès, dépenses et données
autorisées. Avant une publication : confirmer nom et licence. Pour avancer
localement, nom de travail `composed-runtime`, sans remote ni publication.

Prochaine action après autorisation d'implémenter : exécuter les lots 0 et 1,
faire revoir le protocole, puis construire la verticale synthétique du lot 2.
Ce document ne constitue ni une autorisation de dépense ni une recette réussie.


## 13. Étude événements et hooks

La [cartographie événements/hooks](./hooks-and-events.md), rédigée le 24 octobre
2026, complète la préparation des lots 1 à 5 : responsabilités, inventaire des
contrôles, garanties par adaptateur, comportements en panne et cas d'évaluation.
Elle n'ajoute aucune opération aux six opérations publiques prévues en section 4.
Ses décisions restent des propositions à faire revoir avant le code concerné.

Les revues du 20 octobre portent sur le plan historique, conservé avec son
empreinte dans les [preuves de rapatriement](../../.agents/work/composed-runtime-planning/relocation-validation.md).
Elles ne constituent pas une revue de cette étude ni une validation du runtime.
