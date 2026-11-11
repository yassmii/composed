# Revue indépendante — benchmark adaptatif, état initial

## Objet et sources

`build-kit/benchmarks/adaptive-delivery/{corpus,protocol,report}.mjs`, plans `handoff.md`, `implementation.md`, `kit-implementation.md`, `runtime-implementation.md`, instructions AGENTS/RTK, catalogue et skill delivery-review EN. README/tests encore en cours lors de cette revue.

## Mode et indépendance

`native-subagent` : reviewer distinct du parent auteur du benchmark. Sources en lecture seule ; seuls de nouveaux rapports sous reviews sont autorisés. Node Linux `<home>/.local/share/fnm/node-versions/v24.15.0/installation/bin/node` v24.15.0. Aucun appel modèle, fournisseur ou qualification réelle.

## Verdict

**Return needed** pour le benchmark à cet état. Ce verdict ne couvre pas encore runtime ni kit.

## Éléments établis

La calibration locale réussit sur les huit tâches : références acceptées, seeds et mutants refusés. Le planning conserve développement/confirmation et trois conditions, les résultats manquants restent not_run. Les signatures locales ne sont explicitement pas présentées comme une authentification. Les tests de reproduction ci-dessous ont appelé summarize en mémoire avec scheduleTasks(), sans mutation de source ni appel modèle.

## Écarts prioritaires

1. **P1 — Comparaison de modèles observés contradictoires admise.** `report.mjs:113` compare seulement requested_model entre A/B. Avec requested_model=fixed partout, observed_model=fixed en A et other en B/C, durées A=100 et B/C=70, le résultat annonce organisation_target_observed=true. L'attribution à l'organisation à modèle constant est alors fausse malgré une contradiction déjà observable. Propriétaire : auteur benchmark. Refuser la comparaison ou rendre explicitement inconnue la conclusion sous cette contradiction ; distinguer le cas identité non exposée.
2. **P1 — Limites gelées non appliquées à l'acceptation.** `report.mjs:20` n'applique pas limits.trial_ms ni attempts_per_trial. Avec A=1 000 000 ms et B/C=700 000 ms, toutes les durées dépassent le budget 600 000 ms mais organisation_target_observed=true. Des essais hors enveloppe peuvent donc satisfaire la cible. Propriétaire : auteur benchmark. Valider les limites observables et représenter le dépassement honnêtement ; préciser le traitement des tentatives inconnues.
3. **P2 — Estimand différent de la cible K5.** `report.mjs:124` calcule la médiane des ratios individuels. Pour les trois familles complexes A=[10,100,1000], B=[7,200,700], répétés trois fois et avec parcours direct accéléré, il annonce gain=.30 et cible observée alors que la durée médiane complexe passe de 100 à 200. Le plan demande une réduction de la durée médiane. Propriétaire : auteur benchmark. Aligner le calcul ou expliciter et justifier un changement de cible avant toute campagne.
4. **P2 — Conclusion A/B couplée à C.** `report.mjs:147` exige allComparable pour la cible organisation. Toutes les paires A/B peuvent être acceptées avec gain 30 %, mais C absent rend organisation_target_observed=false. Cela empêche d'établir indépendamment un gain d'organisation si le routage ne peut être confirmé. Propriétaire : auteur benchmark ; décider et documenter le périmètre des conclusions.

## Condition de sortie et limites

Revoir ces cas après correction avec assertions ciblées, puis examiner README et tests finalisés. Aucune authenticité des sessions, durée réelle, transmission de données, délégation ou revue humaine n'a été vérifiée par cette reproduction synthétique. Aucun gain réel ni support fournisseur n'est établi.
