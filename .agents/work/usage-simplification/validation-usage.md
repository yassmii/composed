# Simplification de l'usage de la validation

Date : 4 novembre 2026. Demande du propriétaire : « simplifie aussi l'usage de la validation ».

## Périmètre et constat

Trois couches existent : contrôles natifs et preuves locales du Build Kit ; évaluation de preuves
contractuelles sélectionnées ; suites externes de composed-validation. Leurs formats et garanties
sont différents. L'entrée actuelle demandait de connaître ces mécanismes avant de choisir son action.
Le CLI de preuves donnait le statut et l'applicabilité, mais pas le prochain geste. Le README externe
commençait par les profils et leur état avant de donner une entrée par besoin.

Changement retenu : une entrée courte par la demande, une restitution CLI exploitable et un démarrage
externe par l'objectif. Aucune fusion des formats, inférence de conformité ou exécution automatique
de commandes provenant d'une ancienne preuve. Les clauses produit et les profils ne changent pas.

## Résultat livré

- [Validation par tâche](../../../build-kit/docs/validation.md) : demander de vérifier le changement
  ou l'applicabilité des preuves existantes. L'agent retrouve commandes, pins et sources accessibles.
  Les quatre types de vérification sont des alternatives selon la question, pas une nouvelle chaîne
  obligatoire. Une petite correction peut garder le résultat de ses contrôles dans la réponse.
- [Référence preuves](../../../build-kit/docs/evidence.md) : choisir entre exécuter et enregistrer
  (`evidence run`) ou lire une preuve (`verify`), puis comprendre résultat et action.
- `build-kit/src/cli/evidence.ts` : sortie humaine séparant action, statut enregistré, fichiers,
  revue et reçu ; prochaine action pour échec, blocage, non-exécution, preuve périmée/invalide et
  revue absente/invalide/périmée/non acceptée/auto-revue. Aucune revue n'est imposée par son absence.
  Le format JSON, les codes de sortie et les règles de preuve restent identiques.
- Dans le dépôt voisin `composed-validation`, README réorganisé autour des contrôles du dépôt,
  de la disponibilité des runners et du lancement d'un candidat ; `docs/evidence-model.md` expose
  les champs du rapport et les suites à donner. Aucun code, suite, verrou, seuil ou version modifié.
- README racine/Build Kit, démarrage et changelog Unreleased alignés. La partie précédente du
  chantier reste en place. Aucun consommateur installé n'a été mis à jour automatiquement.

## Démonstration observée

Une commande `verify` sur une preuve historiquement réussie dont le sujet a changé affiche :

```text
Result: evidence needs attention
Action: inspected existing evidence; no command executed.
Recorded check: passed; selected files: stale
Review: not supplied; review requirements not assessed.
Receipt: receipts/correct.json
  evidence.stale: One or more selected subjects differ from the recorded revision.
Next: inspect changed or unavailable files, then record the intended check again. Keep the old receipt.
Scope: selected files and recorded command only. Product acceptance and closure are not assessed.
```

Cette sortie provient du vrai CLI sur l'exemple isolé. Les octets du reçu ont été comparés avant/après
et restent identiques. Le sujet de la fixture a été restauré après le contrôle de péremption.

## Vérifications exécutées

| Contrôle | Environnement | Résultat |
| --- | --- | --- |
| `vitest run tests/evidence.test.ts` via le Node Windows et les dépendances existants | Node 24.13.1, Windows | **19 tests réussis**, dont les chemins humains, conservation du résultat historique, aucune réexécution par verify et revues. |
| `tsc --noEmit` | Node Windows, workspace Build Kit | Réussi. |
| `biome check .` | Node Windows, workspace Build Kit | **91 fichiers**, réussi. |
| `node build-kit/evals/evidence-example.mjs`, puis appels au vrai CLI dans son dossier temporaire | Node Windows | **7 contrôles d'acceptation + 7 appels CLI** réussis, incluant succès, échec, non-exécution, auto-revue, reçu invalide, péremption et égalité du JSON avec le rapport programmatique. |
| `npm run validate` dans composed-validation | Node 24.15.0, Linux | Verrous, suites et profils valides ; **49 tests de validateurs réussis**. |

Preuves : [sorties CLI et empreintes](evidence/validation-cli-smoke.json),
[tests des preuves](evidence/evidence-tests.log), [validation externe](evidence/external-validation.log).
Les sorties des tests sont les sorties finales récupérées après lancement ; les commandes et
environnements sont précisés ci-dessus. Les contrôles de liens et du diff sont rapportés à la clôture.

Contrôle final : **157 liens locaux et 33 ancres** vérifiés dans 17 documents Markdown, sans erreur ;
sortie conservée dans `evidence/validation-links.json`. Les liens distants et exemples de code sont
exclus. `git diff --check` réussi dans les deux dépôts.

## Limites

Les contrôles exécutés vérifient les outils et leurs fixtures. Aucun produit consommateur ni conseil
patrimonial n'est validé ici. Le runner patrimonial reste absent, et les revues humaines réelles ne
sont pas remplacées. L'ergonomie des nouveaux points d'entrée n'a pas été mesurée auprès d'utilisateurs.
Contrôle d'auteur dans le contexte partagé ; aucune indépendance de revue revendiquée.

Le prochain essai utile est une demande de validation sur un vrai projet disposant de son pin et,
pour une exécution externe, de son adapter. Observer alors les sources retrouvées, les questions
nécessaires et la compréhension du résultat. Aucun appel modèle payant, déploiement ou publication
n'est nécessaire à la tranche livrée. Modifications locales, sans commit ni push.
