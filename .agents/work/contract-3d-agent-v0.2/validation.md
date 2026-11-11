# Validation — phase A, 2026-10-08

Périmètre : contrat 3d-engine 0.2.0 draft ; aucune implémentation du moteur.

## Validation demandée

Commande exécutée depuis <repo> : `npm run validate:contracts`.
Code de retour : 0. Sortie réelle :

```text
> composed@0.1.0 validate:contracts
> node contracts/scripts/validate-contracts.mjs && node contracts/scripts/review-traceability.mjs

OK   <repo>\contracts\templates\contract.yaml
OK   <repo>\contracts\product-types\3d-engine\contracts\contract.yaml
OK   <repo>\contracts\product-types\e-commerce\contracts\contract.yaml
OK   <repo>\contracts\product-types\git-backed-cms\contracts\contract.yaml
OK   <repo>\contracts\product-types\saas-booking\contracts\contract.yaml
OK   traceability 3d-engine
OK   traceability e-commerce
OK   traceability git-backed-cms
OK   traceability saas-booking
```

## Conservation et diff

Comparaison des objets YAML avec git HEAD : capacités/REQ existants, acteurs et
ACC antérieurs inchangés ; intent, invariants, politiques, qualités, intégration,
extensions, entités et exclusions conservés. Les sept couples REQ-3D-007 à 013 /
ACC-3D-004 à 010 existent et sont tracés explicit_project_choice sans observation.
Version 0.2.0, statut draft confirmés. `git diff --check` : code 0, sans erreur.
Git signale uniquement sa normalisation future LF vers CRLF et l'accès restreint
au fichier global d'exclusions dans le sandbox ; ces avertissements n'affectent
pas les contrôles du contenu. Aucun réglage Git global n'a été changé.

## Limites

La validation vérifie les schémas et la traçabilité locale, pas les comportements
moteur ni la vérification en ligne des empreintes des sources (`verify:research`
non lancé). Aucun ACC moteur, benchmark, rendu ou test de sécurité exécuté.
Revue indépendante : [rapport native-subagent](reviews/2026-10-08-native-subagent-contract-review-01.md),
verdict Accepté, validation également relancée par le relecteur avec code 0.
Le rapport et le handoff sont persistés. Approbation humaine n°1 en attente.

