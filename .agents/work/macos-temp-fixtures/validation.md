# macOS temporary-path fixtures — 4 novembre 2026

Correction bornée du Build Kit, liée aux fixtures de tests ; aucun contrat produit modifié.

## Échec et correction

Run GitHub `41815834267`, révision `a2a6ddc` : jobs macOS Node 20/24 en échec dans les tests
de mémoire Claude. Le contrôle runtime refuse les ancêtres symboliques, y compris ceux du
répertoire temporaire macOS ; les tests attendent un chemin ordinaire. La première lecture des
annotations n'exposait que les échecs mémoire. Une reproduction Linux avec TMPDIR symbolique
révèle aussi les mêmes hypothèses de chemin physique dans update et knowledge.

Les trois fixtures résolvent maintenant le chemin du répertoire temporaire créé via `realpathSync`.
Un cas explicite vérifie qu'un ancêtre symbolique de projet reste refusé et qu'aucun miroir
n'est écrit. Code runtime, protections, workflow et versions inchangés. Revue par l'auteur
(`self-review`), sans indépendance revendiquée.

## Vérifications locales

Installation Linux isolée issue de l'archive HEAD, dépendances verrouillées installées par
`npm ci --ignore-scripts`, sans modifier l'installation Windows du checkout principal.
Répertoire de travail : `/tmp/composed-macos-ci-dw7m6wbn`.

- Avant correction, test mémoire avec TMPDIR pointant sur un lien : sortie 1, statuts `unsafe`
  inattendus reproduits. Diagnostic direct : même projet via alias → unsafe, chemin physique → ready.
- Après correction des trois fixtures, suite complète Linux Node 24.15.0 avec le même TMPDIR
  symbolique : **243 succès, 1 ignoré, 28 fichiers**.
- Suite complète Windows Node 24.13.1 après correction mémoire : **241 succès, 3 ignorés**.
  Tests update/knowledge rejoués après leur correction de chemins : **30 succès, 1 ignoré**.
- TypeScript sans émission et Biome (91 fichiers) réussis sous Linux.
- Les rejets explicites de liens symboliques et la préservation des entrées existantes restent testés.

La reproduction Linux isole la cause ; seul le prochain run GitHub permettra de constater le
résultat natif macOS. Les contrats ont leurs jobs indépendants, déjà verts au run précédent.
