# Plan d'implémentation — délégation inter-fournisseurs

5 novembre 2026 — plan, logiciel non implémenté. Complète le
[plan runtime historique](../../../docs/composed-runtime/implementation-plan.md),
sans remplacer ses exigences de supervision, d'idempotence et de conformité.
Les choix ci-dessous sont des propositions d'implémentation, pas des capacités livrées.

## Résultat attendu

Depuis Codex ou Claude Code, l'utilisateur confie une mission à un agent utilisant
Kimi, GLM, DeepSeek ou un modèle local, via un accès direct ou une gateway configurée.
L'agent travaille avec les outils autorisés dans un espace identifié ; l'orchestrateur
récupère son résultat, inspecte le diff et valide le livrable.

Le modèle ne devient pas un outil natif du client parent : celui-ci utilise un pont
d'invocation externe explicite. La compatibilité est qualifiée pour chaque combinaison
client parent / exécuteur enfant / modèle / mode d'accès / version / plateforme.
Le support de deux clients ne prouve pas celui de tous les modèles.

```text
Codex, Claude Code ou autre orchestrateur
    → client de contrôle local, CLI d'abord
    → superviseur Rust optionnel, protocole ouvert
    → adaptateur d'exécution
    → agent outillé compatible avec le modèle choisi
    → modèle local, fournisseur direct ou gateway
```

Le pont CLI utilise le mode de session du plan historique ; aucun service détaché
implicite. Un transport MCP pourra être ajouté si les essais d'usage justifient
son coût, sans dupliquer la logique de supervision. Un simple proxy HTTP n'apporte
ni boucle d'outils, ni isolation, ni cycle de vie d'agent.

## Frontières et décisions

- Dépôt cible proposé : `../composed-runtime`, autonome, sans remote ni publication
  implicite. Rust reprend le choix proposé historiquement ; version de toolchain
  et dépendances à vérifier et figer au démarrage, sans reprendre aveuglément les anciennes versions.
- Protocole indépendant de Rust et des marques ; adaptateurs exécutables séparés.
- Premier support : Linux/WSL homogène. Windows natif a sa recette séparée ; aucun
  support annoncé pour superviseur WSL et enfants Windows sans validation dédiée.
- Réutiliser un agent outillé existant capable d'utiliser les backends visés après
  qualification. Ne pas développer une boucle d'agent universelle par défaut.
  Si aucun candidat ne convient, documenter le manque et son coût avant d'élargir le scope.
- Ni gateway maison, ni hébergement automatique de modèles, ni dépendance à `agent-os`.
- Autorisations et données restent bornées par le projet. Aucun fallback local vers
  distant ni changement de modèle clandestin. Les worktrees isolent les modifications
  Git ; ils ne constituent pas une sandbox de sécurité.

## Lots exécutables

| Lot | Travaux et emplacements cibles dans le futur dépôt | Preuves et sortie |
| --- | --- | --- |
| R0 — Socle et décisions | `AGENTS.md`, `Cargo.toml`, lock/toolchain, CI, `docs/decisions.md` ; confirmer nom, environnement, portée et contraintes ; fixer un binaire lib+CLI minimal | Build reproductible ; format/lint/tests ; aucun fournisseur requis ; choix de stack enregistré avant code dépendant |
| R1 — Protocole | `protocol/control/0.1.0`, `protocol/adapter/0.1.0` ; six opérations, erreurs, négociation, missions, résultats ; schémas et fixtures publics | Revue des frontières ; exemples valides/invalides vérifiés par deux validateurs ; versions incompatibles refusées |
| R2 — Verticale simulée | `src/transport`, `supervisor`, `storage` ; `capabilities/start/status/events/cancel/result`, mode `run`, faux adaptateur, archives et idempotence | Une mission démarre, s'observe, s'annule et se termine ; retransmission sans relancement ; fin d'exécution distincte de validation |
| R3 — Robustesse | `scheduler`, `workspace`, persistance et contrôle des enfants ; quotas, timeout, arrêt, crash, environnement filtré, worktrees | Batterie de pannes du plan historique ; aucun enfant attendu restant après arrêt normal ; état indéterminé honnête après crash ; modifications utilisateur préservées |
| R4 — Exécuteurs réels | `adapters/`, `docs/compatibility.md` ; qualifier les CLI Codex/Claude et un exécuteur outillé pour les modèles tiers/locaux ; fixtures de traces assainies | Capacité réellement observée par combinaison ; aucune certification sur présence d'un binaire ou seule réponse textuelle |
| R5 — Recette hétérogène | `examples/heterogeneous-delivery`, `conformance/` ; tâches synthétiques, accès direct/gateway/local, deux parents | Matrice ci-dessous exécutée ; traces, IDs, révisions, actions et résultats inspectables ; modèle demandé/observé distingués |
| R6 — Livraison autonome | Installation, documentation, rapport de conformité, revue fraîche et révision candidate | Profils `control-core` et `process-supervision` sur le Rust ; mêmes cas `control-core` sur moteur de contrôle hors Rust ; retour arrière documenté |

R1 dépend de R0 ; R2 de R1 ; R3 de R2. L'étude des exécuteurs R4 peut commencer
en parallèle de R1 ; leur code dépend du protocole stabilisé. Les appels réels
R5 suivent R3 et R4. R6 n'attend pas la livraison du Build Kit, mais n'annonce
que les plateformes et combinaisons dont la recette est passée.

## Détails à figer dans R1

Étendre la mission historique avec des champs proposés : référence de backend,
identifiant du modèle demandé, paramètres supportés, outils requis, classification
des données, politique de transmission et références de credentials. Aucun secret
en clair dans les missions, arguments ou journaux. La sélection vient d'une
configuration locale approuvée ; ne pas exécuter un adaptateur découvert dans un dépôt arbitraire.

Le résultat conserve trois dimensions séparées : état du processus/superviseur,
déclaration de l'agent, validation du livrable. Ajouter modèle demandé, identité
observée si exposée, versions, durée, révision de base, artefacts et nettoyage.
Une gateway peut masquer ou remplacer le backend : identité non prouvée = inconnue,
pas modèle demandé recopié comme fait. Si l'identité exacte est exigée, l'absence
de preuve bloque la qualification de cette combinaison.

Les six opérations, pagination bornée, journal, idempotence persistante et perte
de contrôleur suivent le plan historique. Les limites du superviseur ne deviennent
pas des plafonds garantis de coût fournisseur ou de mémoire des enfants.

## Qualification d'un exécuteur pour modèles tiers

R4 produit une comparaison courte, à partir des versions locales et documentations
officielles actuelles : sélection du modèle et du backend, boucle d'outils réelle,
mode non interactif, permissions, limites de contexte, sortie structurée, arrêt,
licence et maîtrise des transmissions. Le nom de l'exécuteur reste ouvert jusqu'à
cette étude ; « compatible OpenAI » ne suffit pas à démontrer ces capacités.

Réutiliser ses configurations de connexion, sans copier les credentials. Adapter
le protocole d'événements dans un module dédié. Prévoir un agent sans outils,
une erreur d'authentification, un refus de modèle et une sortie malformée comme
cas négatifs ; ne pas les convertir en succès textuels.

## Matrice minimale de recette réelle

| Cas | Ce qu'il démontre |
| --- | --- |
| Parent Codex → agent outillé avec modèle non-OpenAI | Lecture d'une fixture, modification attendue et test réellement exécuté, résultat récupéré par le parent |
| Parent Claude → agent outillé avec modèle tiers | Même protocole et mêmes critères sans dépendance à un parent unique |
| Agent via gateway configurée | Backend demandé consigné, erreurs/timeout traités, résultat inspectable ; identité réellement observée ou limite explicite |
| Agent avec modèle local | Mission outillée sans transmission distante autorisée ; contrôle adapté de l'environnement pour vérifier cette restriction |
| Kimi, GLM et DeepSeek | Un cas par famille accessible avant d'annoncer son support ; les familles non testées restent `not_run` ou `blocked` |
| Deux agents écrivains | Lots indépendants, worktrees séparés, récupération des diffs, intégration par le propriétaire, contrôle de régression |
| Revue externe | Contexte neuf, reviewer non-auteur et verdict lié aux sources ; modèle différent non considéré comme preuve d'indépendance |

Les cas peuvent se recouvrir pour limiter les appels, mais chaque capacité revendiquée
doit posséder sa preuve. Les cas synthétiques n'envoient aucune donnée produit.
Les accès, données et plafonds d'essais réels doivent être établis avant lancement ;
l'absence de compte bloque la recette concernée, pas le développement déterministe.

## Validation, livraison et retour arrière

Contrôles Rust : format, clippy avec warnings bloquants, tests verrouillés, conformité
boîte noire sur le binaire release. Couvrir notamment annulation concurrente,
descendants, saturation stdout/stderr, disque plein, journal tronqué, clé dupliquée,
processus absent, permissions refusées et résultats faussement positifs.

Maintenir un exécuteur de contrôle hors Rust pour prouver le protocole ouvert ;
il n'est pas une dépendance du runtime principal. Versionner séparément protocoles,
runtime et adaptateurs. Installer une version candidate côte à côte ; revenir à
l'ancienne configuration sans effacer journaux ou worktrees modifiés. Aucune
migration de stockage irréversible implicite, aucun run indéterminé relancé.

## Répartition et traçabilité

Après R1, trois périmètres parallélisables : supervision/persistance, adaptateurs,
conformité boîte noire. L'intégrateur conserve schémas, lock, CI et intégration.
Agents écrivains isolés ; reviewer final distinct des auteurs. Utiliser les
capacités présentes pour construire le runtime, jamais sa capacité future supposée.

Référence de cadrage : [harness 1.0.0 candidate](../../../contracts/product-types/agentic-delivery-harness/contracts/contract.yaml),
recherche [comparative](../../../contracts/product-types/agentic-delivery-harness/research/comparison.md)
et [mise à jour](../../../contracts/product-types/agentic-delivery-harness/research/README.md).
R1/R4 : REQ-ADH-009/010 ; R2/R3/R5 : REQ-ADH-011 à 013 ; preuves :
REQ-ADH-016 à 020, ACC-ADH-006 à 013. Compétences : software-engineering,
api-contracts, security-review, automated-testing et delivery-review.
Ce rapprochement ne promeut pas le contrat, n'adopte pas tous ses modules et ne
constitue pas un verdict de conformité. Le protocole de supervision est un choix
technique du runtime, pas une exigence métier inventée à partir du contrat.
