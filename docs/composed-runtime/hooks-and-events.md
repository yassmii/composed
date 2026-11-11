# Événements, hooks et coordination

Date : 24 octobre 2026. Statut : proposition de conception, non implémentée et
non revue indépendamment. Ce document complète le [plan](implementation-plan.md)
sans ajouter d'opération à son protocole public.

## Partir de l'existant

Le Build Kit 0.5.1 possède des règles de routage, des décisions de stack et des
artefacts de handoff. Ce sont des instructions ; son CLI installe et vérifie le
kit, il ne supervise pas les agents. Le plan Runtime prévoit déjà un journal
par run, six opérations dont `events`, une supervision, des quotas, des états
terminaux et un domaine persistant d'idempotence. Ces fonctions restent planifiées.

Un événement rapporte un fait observé. Un hook traite un point du cycle de vie.
Un contrôle préalable peut refuser une action ; un observateur après l'action
ne peut pas annuler un effet déjà produit. Une opération proposée, une opération
autorisée et une opération exécutée doivent donc rester distinctes.

Le superviseur possède l'exécution et ses limites. L'orchestrateur possède
l'attribution et les arbitrages. Le validateur examine les preuves. Les hooks
natifs donnent accès à certains points internes du CLI, invisibles au seul
superviseur. La mémoire locale aide la reprise ; elle ne remplace aucun de ces rôles.

## Règle de sélection

Pour retenir un hook, documenter l'échec visé, son propriétaire, les mécanismes
existants, le point d'intervention, la décision attendue, les capacités nécessaires,
le coût, le comportement en panne et un cas négatif qui prouve son effet.
Réutiliser un contrôle existant dès qu'il couvre le besoin. Un besoin peut être
couvert sans hook. L'inventaire ci-dessous couvre les familles du périmètre actuel ;
il doit être réexaminé à chaque nouvelle intégration.

P0 signifie nécessaire avant de revendiquer la garantie concernée, P1 amélioration
après une première verticale prouvée, P2 option activée sur besoin. Ces priorités
ne rendent pas obligatoires des fonctionnalités hors périmètre du premier moteur.

## Matrice de couverture

| ID | Besoin ou échec | Mécanisme propriétaire | Place éventuelle du hook | Priorité / preuve |
| --- | --- | --- | --- | --- |
| HC-01 | Capacité annoncée mais absente | Négociation et recette d'adaptateur | Sonder les points natifs disponibles une fois par configuration | P0 : capacité requise absente => refus explicite |
| HC-02 | Implémentation avant décision de stack | Politique et admission de mission ; provenance utilisateur | Intercepter les actions internes pertinentes si possible | P0 : aucune action dépendante avant décision valable |
| HC-03 | Mission hors scope ou dépendance non satisfaite | Validation de mission et orchestrateur | Aucun ordonnanceur parallèle dans un hook | P0 : refus expliqué sans lancement ; pas de DAG complet ajouté au v0.1 |
| HC-04 | Délégation fictive ou inconnue | Superviseur et registre réel | Relier le démarrage natif observé à la mission | P0 : identité réelle, accès et issue vérifiables |
| HC-05 | Écritures concurrentes qui se mélangent | Workspaces isolés et attribution atomique | Vérification préalable si l'outil expose le périmètre | P0 : deux écrivains, espaces distincts ; un worktree n'est pas un sandbox |
| HC-06 | Action interne non autorisée | Permissions natives ou isolation disponible | Contrôle avant outil, avec couverture des chemins alternatifs | P0 si garantie revendiquée : variantes shell/édition/API refusées |
| HC-07 | Format ou contrôle local oublié | Outils déjà configurés dans le projet | Déclenchement ciblé, regroupé et borné après modification | P2 : baisse d'oublis, coût mesuré ; pas de suite complète à chaque écriture |
| HC-08 | Dépassement de durée, sortie ou concurrence | Superviseur et files bornées | Observer les usages ; ne pas recréer un second quota | P0 : saturation et lecteur lent testés |
| HC-09 | Sous-agents internes échappant au plafond | Capacités et réglages du runtime enfant | Observer/contrôler la délégation native si disponible | P0 pour un plafond global : refuser de le garantir sans maîtrise des descendants |
| HC-10 | Fin du processus assimilée à succès produit | Résultat structuré et état de validation distinct | Capturer les fins natives sans les surinterpréter | P0 : sortie 0 + tests échoués => livrable non validé |
| HC-11 | Preuve absente ou falsifiée par un récit | Validateur et rapports d'exécution attribués | Déclencher la vérification à la soumission | P0 : contrôles réels liés à la révision, pas une recherche de mots |
| HC-12 | Auteur présenté comme reviewer indépendant | Politique de revue et identités de mission | Refuser une transition de clôture couverte | P0 si revue requise : auteur/reviewer distincts ; limites du contexte déclarées |
| HC-13 | Modification après validation | Graphe de dépendance des preuves | Signaler la révision nouvelle et invalider les preuves affectées | P0 : ancien verdict conservé historiquement, plus applicable au nouveau livrable |
| HC-14 | Résultat reçu sans propriétaire suivant | Orchestrateur et handoff | Notification bornée vers l'orchestrateur | P1 : un événement répété ne crée pas deux missions de revue |
| HC-15 | Annulation déclarée sans arrêt des enfants | Superviseur et mécanismes OS | Aucun arrêt improvisé dans un hook de fin | P0 : accusé distinct de l'arrêt confirmé, nettoyage séparé |
| HC-16 | Crash suivi d'une réexécution dangereuse | Journal, verrou et reprise du superviseur | Observer l'interruption, sans relance autonome | P0 : run indéterminé, clé conservée, pas de lancement implicite |
| HC-17 | Perte du contexte lors d'une reprise | Handoff persistant et références canoniques | Point de fin/compactage si disponible | P1 : session fraîche retrouve état et décisions sans recopier tout le transcript |
| HC-18 | Changement de politique en cours de mission | Contrôle versionné des décisions et droits | Détecter un changement et revalider les actions concernées | P0 : aucune auto-approbation via un fichier écrit par l'agent |
| HC-19 | Traces sensibles ou collecte excessive | Politique de données et stockage | Assainissement et filtrage à l'entrée | P0 : secrets synthétiques exclus ; export désactivé par défaut |
| HC-20 | Déploiement déclenché sur un simple score | Plan de livraison et autorisations du projet | Vérifier les préconditions juste avant l'action | P0 si module activé : préparation, autorisation et effet restent distincts |
| HC-21 | Retour d'expérience promu en règle globale | Boucle de recherche/amélioration et revue | Émettre un signal attribué, pas modifier la politique | P1 : proposition scoped, cas de régression et décision traçable |

## Contrat d'un contrôle

Avant son implémentation, chaque contrôle retenu reçoit un identifiant/version,
son périmètre, son mode (`observe`, `warn`, `block`) et son ordre d'exécution.
Un refus prévaut sur un accord ; un observateur ne donne jamais une autorisation.
Le reçu distingue `allow`, `deny`, `not_applicable`, `unavailable` et `error`.
Un contrôle non exécuté ne compte pas comme réussi.

Une approbation provient d'une interaction utilisateur authentifiée par le
contrôleur de confiance, liée au projet, à la décision, aux paramètres et à la
version de politique. Un message d'un autre agent ou un Markdown auto-rédigé
ne suffit pas. Les choix déjà accordés ne sont pas redemandés sans changement
de leur portée. En l'absence de canal de preuve fiable, rester au niveau
instructionnel et ne pas annoncer un blocage automatique vérifié.

Si une protection requise est indisponible, plante ou dépasse son délai, ne
pas exécuter l'action protégée. Un observateur facultatif en panne peut laisser
le travail avancer, en enregistrant une couverture incomplète. Le comportement
doit être testé pour chaque adaptateur : il ne découle pas du nom d'un événement.
Les contrôles synchrones restent courts et bornés. Une évaluation longue devient
une tâche explicite ; les hooks ne lancent pas une chaîne récursive d'agents.

## Livraison des événements et effets

Réutiliser l'enveloppe prévue : run, séquence, horodatage, type et payload borné.
Ajouter au lot protocole les références nécessaires à la mission, au projet,
au contrôle, à sa version et à la révision évaluée ; les noms exacts restent à
faire revoir. Ne pas inventer des événements internes à partir d'une sortie libre.

Un consommateur conserve son curseur et une clé d'effet stable. Une notification
dupliquée ne doit pas doubler une attribution ou une dépense. L'enregistrement de
l'effet et l'avancement de lecture doivent permettre une reprise cohérente ; une
simple marque « reçu » avant un appel externe ne garantit pas son exécution.
Tester doublons, retards, trous et changements de version ; ne pas revendiquer
une livraison universelle « exactly once ». Un trou empêche de conclure à une
preuve complète et déclenche une réconciliation, pas une réussite par défaut.

Le v0.1 conserve `events` paginé. Un bus pub/sub, un webhook réseau ou un stockage
partagé ne sont envisagés que si un besoin mesuré les justifie. Les noms des
événements fournisseur restent dans leurs adaptateurs. Un arrêt du lecteur ne
doit ni bloquer les annulations ni faire croître les tampons sans borne.

## Portabilité et garanties

Chaque combinaison runtime/version/mode déclare séparément ce qu'elle peut
observer et ce qu'elle peut empêcher : lancement, outils internes, descendants,
écritures, clôture et arrêt. Classer chaque garantie comme `requested`, `declared`,
`verified` ou `enforced`, avec recette et date. Une capture de fin CLI ne prouve
pas le contrôle de tous ses outils ni de ses sous-agents.

La documentation Claude Code décrit notamment les points `PreToolUse`,
`PostToolUse`, `SubagentStart`, `SubagentStop`, `TaskCompleted` et `TeammateIdle`.
Leurs possibilités de contrôle diffèrent ; un événement disponible ne démontre
pas à lui seul que Composed l'intègre. Aucune compatibilité des versions locales
n'est certifiée ici. [Référence officielle](https://code.claude.com/docs/en/hooks).

## Évaluation avant adoption

Pour chaque contrôle, conserver un scénario correct et un scénario qui viole
réellement la règle. Évaluer l'état final et la chronologie des outils. Une
réponse disant « j'ai attendu » alors que les fichiers ont été générés échoue.
Inclure une solution de bonne forme mais sémantiquement fausse pour tester le juge.
ECC documente un harness avec ces contre-exemples et des limites explicites ;
c'est une référence méthodologique, pas une preuve du gain de nos contrôles.
[Harness ECC, révision figée](https://github.com/affaan-m/ECC/tree/90606c8315ee09cafc303515c5f33024db6b9882/docker/gateguard-effectiveness).

Cas minimaux : décision absente/partielle/déléguée/déjà établie ; approbation
usurpée par agent ; hook absent/désactivé/en erreur ; événement dupliqué/désordonné ;
preuve périmée ; auteur se déclarant reviewer ; arrêt incomplet ; résultat positif
avec tests négatifs ; crash au changement d'état ; quotas atteints ; secrets de test.

Comparer le même scénario sans le contrôle puis avec lui, sur plusieurs essais,
en figeant modèle, configuration, versions et budget. Rapporter réussites,
violations, faux blocages, interventions humaines, durée et coût disponibles.
Une métrique indisponible reste inconnue. Les objectifs numériques doivent être
fixés avant les essais de confirmation ; le pilote sert à les calibrer.

## Ordre proposé

1. Lots 1–3 : protocole, faux agents, preuves, idempotence et supervision, sans hooks fournisseur.
2. Lot 4 : recette des capacités internes de chaque CLI ; essais HC-01/02/06/09/10/19 selon la portée revendiquée.
3. Lot 5 : pont optionnel avec le kit ; décisions, handoffs, validation et revue sans changer silencieusement sa politique native.
4. Mesure : conserver seulement les contrôles dont le bénéfice et le coût sont observables ; documenter aussi ceux rejetés.

La [boucle d'évolution des contrats](../../contracts/docs/continuous-evolution.md)
organise les retours, la recherche continue et la proposition de nouvelles règles.
Elle ne donne pas au runtime le pouvoir de changer un contrat ou de déployer.
