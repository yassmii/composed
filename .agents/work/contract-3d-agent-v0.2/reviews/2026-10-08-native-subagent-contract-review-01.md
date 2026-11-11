# Revue indépendante du contrat 3D 0.2.0

## 1. Objet et sources examinées

Objet : évolution de phase A du contrat `3d-engine`, de `0.1.0` à `0.2.0`, conservée en `draft`.

Sources lues :

- `AGENTS.md`, `contracts/AGENTS.md` et `contracts/docs/contract-system.md`.
- `contracts/skills/contract-reviewer/SKILL.md`.
- `build-kit/skills/support/delivery-review/SKILL.fr.md` et `build-kit/skills/catalog.json`.
- `contracts/product-types/3d-engine/contracts/{contract.yaml,traceability.yaml,review.md}`.
- `contracts/product-types/3d-engine/research/{README.md,sources.yaml,observations.yaml,comparison.md}`.
- Diff de ces fichiers par rapport à Git HEAD.
- Mission de l’utilisateur et brouillon auquel son « go » autorise l’application.

## 2. Mode d’évaluation et indépendance

Mode : **native-subagent**.

L’auteur est l’agent parent. Le relecteur travaille dans un contexte distinct, avec accès en lecture aux fichiers et exécution des contrôles. Il n’a écrit ni corrigé aucun livrable, créé aucun commit, ni délégué la revue. Le contexte de conversation est partagé ; il ne s’agit pas d’une évaluation aveugle.

La revue vérifie les sources et le diff directement, sans se limiter au compte rendu de l’auteur.

## 3. Verdict

**Accepté**

Ce verdict couvre l’évolution documentaire de phase A. Il ne remplace ni l’approbation humaine n°1, ni une validation fonctionnelle du futur moteur, ni une promotion du contrat.

## 4. Preuves qui le justifient

- Le contrat et sa traçabilité portent `0.2.0` ; le statut demeure `draft`.
- Le diff conserve les anciennes capacités, exigences, invariants, politiques, attributs qualité, intégration et scénarios. Il ajoute `ACT-AI-AGENT`, `CAP-3D-004`, sept exigences et sept scénarios conformément au brouillon accepté.
- Aucun langage, API graphique, format concret, protocole de transport ou matériel n’est imposé. Les exclusions et extensions futures demeurent intactes.
- Chaque nouvelle exigence possède un scénario explicite :

| Exigence | Scénario | Vérification attendue |
|---|---|---|
| REQ-3D-007 | ACC-3D-004 | Schéma, aller-retour et rejet d’import invalide |
| REQ-3D-008 | ACC-3D-005 | Commandes, erreurs, cycle et résultat asynchrone |
| REQ-3D-009 | ACC-3D-006 | Découverte autonome et démonstration agent |
| REQ-3D-010 | ACC-3D-007 | Introspection cohérente sans mutation |
| REQ-3D-011 | ACC-3D-008 | Pause, 600 pas déterministes et plafonds distincts |
| REQ-3D-012 | ACC-3D-009 | Image headless et erreurs de caméra/capacité graphique |
| REQ-3D-013 | ACC-3D-010 | Confinement des fichiers et limites de ressources |

- La définition de l’état de référence rend explicites les données comparées et exclut les handles, timings et progrès asynchrones.
- Le plafond de cinq pas par frame reste distinct de la limite par commande. Les garanties sur les assets prêts et l’échec au démarrage sont expressément conservées.
- Le confinement couvre les dépendances transitives, traversées et indirections. Les limites incluent les allocations d’assets en cours et de rendu ; les erreurs doivent préserver inspection et fermeture.
- Les quinze nouvelles entrées de traçabilité — capacité, exigences et scénarios — utilisent `explicit_project_choice` avec observations vides.
- `review.md` distingue les vérifications structurelles des preuves moteur et conserve les décisions ouvertes et limites de recherche.

Contrôle relancé par le relecteur depuis la racine Composed :

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

Code de sortie : **0**. `git diff --check` ne signale aucune erreur de whitespace ; seuls des avertissements de conversion LF vers CRLF apparaissent.

## 5. Écarts prioritaires

**Aucun écart bloquant identifié pour le contenu contractuel de phase A.**

Éléments ouverts assumés :

- **Phase B, décision humaine :** profil matériel (`MET-3D-001`, `QA-3D-001`) et format ouvert avec extension (`POL-3D-002`). Responsable : auteur de la recommandation, puis utilisateur au point d’arrêt n°2.
- **Décision produit encore ouverte :** fallback ou erreur contrôlée (`REQ-3D-004`, `ACC-3D-002`). Responsable : auteur de l’implémentation selon les règles de décision convenues ; aucun choix n’est imposé par cette revue.
- **Avant promotion :** compléter les recherches sur destruction, rendu et ordonnancement, ainsi que l’archive immuable Unreal. L’incohérence du README de recherche reste signalée. Responsable : auteur/relecteur de la recherche.
- **Clôture documentaire de session :** à l’instant de la lecture, `validation.md` du work item n’existait pas encore. Le parent doit persister la sortie réelle, cette revue et le handoff annoncé par `review.md`.

Aucun scénario moteur, benchmark, contrôle de fuite, test d’image ou démonstration agent n’a été exécuté. Leur absence est attendue en phase A et ne constitue pas une preuve de conformité fonctionnelle.

## 6. Condition de sortie

Persister les preuves et cette revue dans le work item, mettre à jour `handoff.md`, puis présenter le diff effectif à l’utilisateur pour le point d’arrêt humain n°1. Maintenir `draft` et attendre son accord avant la phase B.

