# Comparaison — Video Editorial Workflow

## Périmètre de la preuve

Frame.io documente la revue média ; Premiere éclaire
les échanges de montage ; Nextcloud apporte un exemple de gestion des états
locaux et distants. Un seul produit par comportement ne suffit pas à établir
une convergence de marché.

## Comportements observés

- Frame.io rattache un retour à une image par timecode et permet une annotation
  (`OBS-VEW-009`). Cela éclaire des notes attribuées et contextualisées, sans
  imposer cette interface.
- Frame.io distingue la comparaison de deux médias de la lecture individuelle
  et permet de cibler le média commenté (`OBS-VEW-010`).
- Adobe documente des limites de l'échange EDL et les informations de timecode
  et de nom de clip (`OBS-VEW-011`). Une promesse de fidélité doit donc être
  vérifiée dans l'environnement destinataire.
- Adobe documente l'export EDL et XML (`OBS-VEW-012`). Cela ne prouve ni leur
  import dans une autre application, ni la conformité d'un fichier particulier.
- Nextcloud conserve les états en conflit et demande une résolution explicite
  (`OBS-VEW-013`). Ce comportement éclaire une éventuelle extension de
  synchronisation ; il n'impose pas un fonctionnement hors ligne au noyau.
- Nextcloud rend visibles la synchronisation, la pause, la perte de connexion
  et l'erreur (`OBS-VEW-014`). Ces états sont pertinents pour les profils qui
  proposent effectivement une synchronisation.

## Choix du contrat

Les notes éditoriales contextualisées sont une capacité souhaitable.
La transparence sur le format, les limites et la recette du handoff est une
cible de qualité. La provenance, la sélection persistante, les états de traitement et le contrôle
des sorties autorisées sont des choix explicites du noyau ; les sources
publiques présentes ne démontrent pas encore ces garanties complètes.

La synchronisation hors ligne et ses conflits restent une piste d'extension.
La recherche ne justifie ni une architecture particulière ni une politique de
conservation commune à toutes les organisations.

## Questions ouvertes

- Diversifier les sources comparatives et observer les gestes dans plusieurs
  contextes de production.
- Compléter la recherche sur l'assistance et les autorisations de transmission.
- Définir un jeu de conformité générique et des preuves vérifiables par scénario.
- Laisser chaque projet préciser ses politiques, ses performances cibles et ses
  formats de montage, puis les valider dans son environnement réel.

Ces questions concernent la famille de produits. Les décisions d'un client ne
conditionnent pas la stabilisation du contrat commun.


## Corpus refresh — 2026-11-01

See the [dated refresh review](README.md#corpus-refresh--2026-11-01) and
[source-by-source impact record](refresh-2026-11-01.json).

Frame.io single-frame annotation and two-asset comparison passages still support OBS-VEW-009/010. Nextcloud hashes match. Both Premiere sources return HTTP 403 to the native verifier; their previous URL/date/hash records are retained. A separate browser read reaches the official pages and supports direct EDL/XML export, but its response is not an exact-byte native hash verification. It also exposes a qualification needed for OBS-VEW-011: the page says common transitions, frame holds and speed changes translate well, while recommending simple projects without nested sequences and noting merged clips separate in the target application. The historical broad limitation must not be presented as freshly confirmed.

Baseline obligations are unchanged. Deferred follow-up: Resolve native Premiere retrieval and then correct/review OBS-VEW-011 with a new attributable snapshot. QA-VEW-005 still requires target-environment evidence; do not claim verified EDL fidelity or promote the contract. Expand comparable editorial workflows and run actual handoff fixtures in the later deepening pass.
