# Recherche — Video Editorial Workflow

[English version](README.md)

Cette unité étudie la préparation et la revue de matière vidéo, la sélection
éditoriale et la remise d'un paquet de montage traçable.

La base commune contient uniquement des sources publiques de Frame.io,
Adobe Premiere et Nextcloud, leurs versions, dates de consultation et
empreintes, ainsi que six observations attribuées dans `observations.yaml`.
Les identifiants OBS-VEW-009 à OBS-VEW-014 sont conservés pour maintenir les
références existantes ; les identifiants retirés ne sont pas réattribués.

Les clauses que ces sources ne démontrent pas sont explicitement déclarées
comme choix de produit dans `contracts/traceability.yaml`. Une validation
structurelle réussie ne suffit pas à démontrer leur fondement comparatif ou
la conformité d'une application.

La recherche reste au statut `initial`. La comparaison et les sujets ouverts
figurent dans `comparison.md` et le protocole dans
[RESEARCH-PLAN.md](./RESEARCH-PLAN.md). Les documents, observations, jeux de
données et contraintes de chaque client appartiennent au dépôt du projet
consommateur, qui les combine avec une version du contrat commun.


## Corpus refresh — 2026-11-01

Status: **partial — native Premiere retrieval unresolved**. This is a bounded update of 6 existing sources: 2 initial hashes unchanged, 2 changed and reviewed, 2 unavailable.

Frame.io single-frame annotation and two-asset comparison passages still support OBS-VEW-009/010. Nextcloud hashes match. Both Premiere sources return HTTP 403 to the native verifier; their previous URL/date/hash records are retained. A separate browser read reaches the official pages and supports direct EDL/XML export, but its response is not an exact-byte native hash verification. It also exposes a qualification needed for OBS-VEW-011: the page says common transitions, frame holds and speed changes translate well, while recommending simple projects without nested sequences and noting merged clips separate in the target application. The historical broad limitation must not be presented as freshly confirmed.

Resolve native Premiere retrieval and then correct/review OBS-VEW-011 with a new attributable snapshot. QA-VEW-005 still requires target-environment evidence; do not claim verified EDL fidelity or promote the contract. Expand comparable editorial workflows and run actual handoff fixtures in the later deepening pass.

[Source-by-source record](refresh-2026-11-01.json) includes previous/current hashes,
retrieval errors, dependent observations and affected clauses.
[Original source manifest](history/sources-before-refresh-2026-11-01.yaml) preserves prior records.
Old response bodies are unavailable: hash drift does not date or classify a historical
behaviour change. New observations are research inputs, with no automatic normative adoption.

Owner for this manual pass: repository agent; decision authority: Composed maintainer.
Budget: the recorded corpus and changed passages, with a second retrieval of changed
sources; no new provider survey, runtime experiment or background schedule. Revisit
on source drift or the requested deepening pass. Research maturity remains initial;
this author review does not promote a contract or certify an implementation.
Baseline contract/traceability bytes, consumer pins and Build Kit remain unchanged.
All product cases are not_run; existing proof is not transferred.
