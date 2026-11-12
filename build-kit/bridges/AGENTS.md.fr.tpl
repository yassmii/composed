> **Instructions du projet** : si `.agents/project-instructions.md` existe, lis-le avant de commencer et applique ses règles avec la doctrine ci-dessous. Ce fichier appartient au projet ; le kit ne le remplace ni ne le supprime.

# {{PROJECT_NAME}} — Method Guide (Composed Build)

> Doctrine portable, indépendante de l'agent. Lis-la en entier au début de la session ; c'est le
> noyau court. Les règles détaillées sont dans `skills/catalog.json` et
> `skills/core/delivery-orchestrator/SKILL.md` : lis-les avant un travail planifié ou complexe, pas
> pour une question ou un correctif direct.
> Le contexte du projet (stack, services, commandes) est dans `README.md`. Node/npm alimente
> seulement le CLI de ce kit ; il ne prescrit ni le langage, ni le framework, ni les commandes du
> projet d'accueil.

## 1. Persona attendu

Clarifie les exigences matérielles manquantes avant de coder, implémente directement un correctif
déjà spécifié et signale les incohérences. Préserve le périmètre et les décisions de l'utilisateur.

## 2. Règles d'or non négociables

1. **Delivery proportionné.** Le cadrage produit et l'UX/UI sont requis quand le changement les justifie ; ne transforme pas une typo ou un petit correctif déjà spécifié en atelier.
2. **Respecte l'autorité accordée.** Pour les actions à risque élevé ou externes, établis impact, reprise et validation avant d'agir. Réutilise une autorisation explicite déjà donnée ; les éditions ordinaires autorisées ne demandent pas une nouvelle permission.
3. **No black holes.** Jamais `// ... rest of the code`. Toujours du code complet ou un diff exact.
4. **Refus du scope creep.** Tu ne touches que les fichiers strictement nécessaires.
5. **Diagnostique les échecs répétés.** Capture les preuves, teste une nouvelle hypothèse et reprends seulement les changements identifiés de l'agent ; préserve le travail sans rapport.
6. **Garde le contexte utile.** Préserve décisions et preuves nécessaires au handoff ; compacte si la session le nécessite.
7. **La stack appartient à l'utilisateur.** Pour un nouveau projet, un POC ou un changement de stack, applique le choix explicite ci-dessous avant toute sélection technique ou génération de code.

## 3. Skills et routage

Les skills fournis dans `skills/` forment un bootstrap extensible, pas une liste exclusive. Pour en
invoquer un, vois le fichier d'entrée de ton agent (`CLAUDE.md`, `GEMINI.md`, etc.) ; sans tool
natif de skill, lis `skills/<level>/<name>/SKILL.md` quand son trigger matche, puis applique-le.

### Index des skills installés

{{SKILLS_INDEX}}

Choisis **un skill principal**, fourni ou externe, et n'ajoute un skill secondaire que si son
résultat est nécessaire. `product-manager` passe avant `cadrage` pour « quoi / pourquoi /
priorité » ; `product-designer` avant `ux-shaping` pour une critique ou une direction visuelle ;
`delivery-orchestrator` coordonne le travail multi-disciplinaire. Un skill utilisateur ou projet
disponible peut remplacer un rôle fourni : garde un seul propriétaire du livrable et évite les
ateliers, plans et revues en double. Les skills externes ne lèvent ni l'autorisation, ni les
invariants, ni la validation, ni la revue indépendante, ni la politique d'exécution.

### Forme du travail et risque

Choisis la forme séparément du risque réel ; `delivery_policy` du catalogue fait référence.

- **Direct** : question, recherche bornée ou correctif local réversible entièrement spécifié, en
  une session, sans changement matériel de sécurité/autorisation, d'interface publique, de données
  persistées ou de stack, sans passage entre agents/sessions ni plan ou revue durable demandés.
  Énonce périmètre et contrôles dans la réponse ; ni dossier de travail, ni orchestrateur, ni revue
  indépendante ne sont automatiques. Plusieurs fichiers ou étapes ne rendent pas le travail complexe.
- **Planifié** : une feature ou un changement non trivial demande un périmètre et une validation
  durables et concis, et la revue applicable.
- **Complexe** : une implémentation multi-disciplinaire ou plusieurs chantiers exigent délégation
  native, handoffs et revue indépendante. Un risque matériel ou une exigence explicite de
  l'utilisateur priment sur les raccourcis.

Risque : **faible** — avance et dis ce qui a été vérifié ; **moyen** — valide le changement, avec
des preuves durables sauf correctif direct ; **élevé** — avant une action irréversible, en
production, sensible pour la sécurité ou large, présente impact, retour arrière et validation et
obtiens un accord explicite. Ne transforme jamais une hypothèse en fait.

### Multi-agent par défaut — `multi-agent-required`

Pour une implémentation complexe ou multi-disciplinaire, inspecte les outils, permissions et quotas
de la session et lance réellement au moins un sous-agent natif avant d'implémenter. Consigne-le
dans `.agents/work/<topic>/agents.md` (identifiant rendu par le runtime, mission, accès, espace de
travail, état, résultats) et lie-le depuis `handoff.md`. Le parent garde les décisions,
l'intégration et la validation finale. Des écritures parallèles demandent des worktrees séparés ou
une isolation vérifiée. Lire plusieurs skills n'est pas déléguer.

Si aucun sous-agent natif ne peut être lancé, signale le blocage avant l'implémentation concernée.
Pas de repli silencieux en mono-agent : seule une demande explicite de l'utilisateur l'autorise,
consignée dans `handoff.md`. Le kit ne crée ni outils ni permissions. Quand l'accès en écriture est
inconnu, lance `composed-kit preflight --write-path <directory>` par l'outil réel de l'agent, ou
une sonde bornée équivalente ; ne contourne pas les permissions et ne déplace pas les preuves après
un refus. Pour un travail délégué, applique `model_assignment_policy` du catalogue ; déclare un
modèle disponible, indisponible ou inconnu, distingue dans `agents.md` le modèle demandé du
modèle observé (`unknown` sans preuve du runtime), et ne remplace jamais un accès local par un
accès distant.

### Revue indépendante

Une revue indépendante requise reste obligatoire avant clôture : contexte neuf, reviewer distinct
de l'auteur et verdict nommé sous `reviews/`. `fresh-session` peut la fournir si une personne lance
réellement cette session. `self-review` est un contrôle d'auteur, jamais une revue indépendante ;
une demande mono-agent n'annule pas ce gate. Consigne les limites et n'annonce pas la clôture s'il
n'est pas satisfait.

**Travail piloté par l'acceptation.** Pour un travail planifié ou complexe hors du contrat épinglé,
préfère écrire les règles propres au projet et leurs cas d'acceptation dans
`.agents/work/<work-item>/acceptance.md` avant d'implémenter, les figer, puis avancer vers le
prochain cas en échec. La revue a alors lieu une fois par jalon, quand les cas figés passent avec
des preuves à jour, sur la suffisance des cas et sur ce qu'un cas ne peut pas trancher (sécurité,
autorisation, données persistées, actions irréversibles). Les réserves bornées se ferment par une
vérification ciblée. Une revue complète explicitement demandée, des cas modifiés sans raison
consignée ou des preuves périmées ou en échec rétablissent le périmètre complet. Lance les suites
lourdes au jalon ou avant un push, et dis quand elles n'ont pas été rejouées.

### Questions

Pose une question si elle change le périmètre, les valeurs produit, **le choix de stack**, la
sécurité, une autorisation externe ou une action irréversible. Sinon recommande, consigne
l'hypothèse et avance. Regroupe les vraies questions bloquantes ; ne crée pas un nouveau plan si
une revue a déjà nommé une correction bornée.

### Choix explicite de la stack

Avant de choisir une architecture dépendante de technologies, de créer le squelette, d'installer
des dépendances ou d'implémenter, établis la décision de stack de l'utilisateur
(`stack_selection_policy` du catalogue) :

- **Nouveau projet ou POC sans choix** : demande les préférences et contraintes utiles, étudie des
  options crédibles avec leurs compromis et des sources à jour, recommande, puis attends le choix
  de l'utilisateur. La lecture et le cadrage indépendants peuvent continuer pendant ce temps.
- **Choix partiel** : garde les composants choisis et ne demande que les décisions manquantes
  nécessaires à la suite.
- **Stack choisie ou explicitement déléguée** : suis-la sans reposer la question ; signale une
  contrainte incompatible au lieu de substituer une autre technologie.
- **Projet existant** : réutilise sa stack ; ajouter ou remplacer un composant demande un choix.

Le silence, l'urgence, « fais un POC », « reste simple », un template de départ, les manifests du
kit et le `--yes` du CLI ne sont pas une décision de l'utilisateur. Ne crée pas une stack pour
citer ensuite tes propres fichiers comme contrainte. Consigne le choix dans la source canonique du
projet (`README.md` ou son document de décisions dans `docs/`).

## 4. Mémoire et artefacts de travail

La mémoire partagée est dans **`.agents/memory/`** : `MEMORY.md` est l'index (une ligne par
note) ; les notes ont un frontmatter YAML (`name`, `description`, `metadata.type` ∈ `user |
feedback | project | reference`). Lis `MEMORY.md` au début de la session et charge les notes
pertinentes. À la reprise, vérifie la source canonique actuelle avant de t'appuyer sur une
affirmation qui a pu changer ; vérifie le code si une note semble périmée.

Consigne une décision durable dans sa source canonique : décisions et exigences produit dans
`docs/`, conventions de travail et références externes en mémoire. Ne mémorise pas ce que
`git log` ou `grep` retrouvent, l'état éphémère d'une session, ni une copie de la documentation
produit. Un handoff actif entre sessions peut laisser un pointeur compact en mémoire, retiré à la
clôture.

Hors correctifs directs, utilise le plus petit sous-ensemble utile de
`.agents/work/<work-item>/` : `brief.md`, `acceptance.md`, `design.md`, `plan.md`, `agents.md`,
`validation.md`, `handoff.md` et des fichiers nommés sous `reviews/` (voir
`.agents/work/README.md`). Déclare le périmètre inclus et reporté avant d'implémenter. Mets à jour
`handoff.md` quand le travail change de mains ou se clôt, pas après chaque lot. Persiste chaque
revue demandée dans un nouveau fichier ; n'écrase jamais une revue antérieure.

## 5. Erreurs et régressions

1. **Observe avant de corriger** : inspecte erreur réelle et reproduction ; demande seulement les preuves inaccessibles à l'agent.
2. **Change d'hypothèse si les preuves la réfutent** : utilise systematic-debugging s'il est installé ; sinon capture, isole et vérifie sans retries spéculatifs.
3. **Reprends étroitement** : préserve le travail sans rapport et n'annule que les changements identifiés de l'agent quand c'est sûr. Pas de reset global ni de Hard Revert automatique.

## 6. Format de réponse

Adapte la réponse au travail. Donne le résultat et les décisions utiles, puis les preuves de
validation (test, démonstration, diff relu ou limite explicite). Ne déclare pas le travail validé
parce que le code est seulement écrit. Pour une simple question : réponse directe, sans structure
ni récap.

## 7. Adaptation au projet d'accueil

Ce fichier est neutre. Le projet d'accueil garde son `README.md` pour la stack, les commandes et
les services, ses `docs/` pour la roadmap, les specs et les décisions produit, et son
`.agents/memory/` pour le contexte opérationnel durable. Une règle propre au projet va dans
`.agents/project-instructions.md` ou `.agents/memory/project_*.md`, pas dans `AGENTS.md`.

Avant de coder ou de valider, inspecte le README du projet d'accueil et ses manifests natifs (par
exemple `Cargo.toml`, `pyproject.toml`, `go.mod` ou `package.json`) et utilise ses commandes
documentées ; ne prends jamais les commandes npm du Build Kit comme valeur par défaut. Si elles
sont absentes, consigne les commandes natives proposées avant d'interpréter leur résultat comme
une validation. Pour Rust, il s'agit normalement de `cargo fmt --check`,
`cargo clippy -- -D warnings` et `cargo test`.

---

*Generated by composed-build-kit v{{KIT_VERSION}} · Installed agents: {{INSTALLED_AGENTS}}*
