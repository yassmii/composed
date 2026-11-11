# Prospection et suivi des prospects

Contrat produit **`prospecting-workspace` 0.1.0**, au statut **draft**, rédigé le
23 octobre 2026. Il définit un outil pour découvrir des cibles, recevoir des
demandes entrantes, qualifier sur preuves et organiser le suivi. Son contenu
métier est fourni par des profils séparés : commerces, copropriétés, projets,
personnes, organisations ou autres types configurés.

La demande « un site pour prospecter les copropriétés et avoir des leads ou
prospects qualifiés » est un exemple d'application. La prospection de commerces locaux est une autre
application de cette famille, pas son modèle universel.

## Lire et utiliser

| Document | Rôle |
| --- | --- |
| [Contrat](contracts/contract.yaml) | Exigences identifiées, invariants, politiques, qualité et 32 scénarios d'acceptation. |
| [Interface du profil](contracts/targeting-profile.md) | Ce qui définit séparément les cibles, critères, sources, preuves et argumentaires. |
| [Recherche comparative](research/comparison.md) | Constats documentés, divergences et arbitrages retenus. |
| [Sources](research/sources.yaml) et [observations](research/observations.yaml) | Références primaires, dates de consultation et empreintes des contenus récupérés. |
| [Traçabilité](contracts/traceability.yaml) | Lien de chaque capacité, exigence, invariant, politique et attribut de qualité vers les observations ou un choix explicite. |
| [Vérification du dossier](research/validation.md) | Contrôles effectivement passés et distinction avec les essais d'une future implémentation. |
| [Profils illustratifs](examples/README.md) | Copropriétés, commerces et projets numériques sans géographie obligatoire. |

## Le découpage produit

```text
Profil métier publié                         Politique de conformité validée
types, critères, sources, preuves             finalité, population, juridiction,
fraîcheur, argumentaire, issue                 canal, information, conservation
                    \                        /
                     Moteur de prospection
       découvrir / recevoir → examiner → qualifier → suivre
                    cibles ↔ interlocuteurs
                   dossiers propres par campagne
                     tâches → actions approuvées
```

Le socle ne demande ni ville, ni catégorie de commerce, ni courriel pour exister.
Une cible et un interlocuteur sont deux rôles distincts. Une copropriété peut
avoir plusieurs interlocuteurs et un syndic peut être associé à plusieurs cibles.
Le même contact ne doit donc pas entraîner leur fusion.

**« Qualifié » est une décision vérifiable**, définie par profil et par niveau.
Quatre dimensions restent séparées : adéquation à la cible, intérêt ou besoin
démontré, qualité des données, possibilité de contacter. Une fiche d'annuaire,
une note publique, un signal collectif ou un formulaire ne prouvent pas à eux seuls
l'intention d'achat. Un critère obligatoire inconnu bloque l'acceptation au niveau
concerné. L'utilisateur voit la preuve manquante et le prochain geste.

Pour le cas copropriétés, le parcours attendu est par exemple : identifier une
cible dans une source autorisée → vérifier ses caractéristiques → établir le bon
interlocuteur et son rôle → obtenir une preuve de besoin liée à l'offre → accepter
ou écarter le dossier → planifier le suivi. Une demande entrante peut rejoindre
ce parcours sans acquisition préalable d'une liste.

## Ce que signifie ici « SOTA et bonnes pratiques »

La recherche compare des fonctions documentées d'Attio, HubSpot, Pipedrive et Clay,
complétées par Salesforce et Apollo lorsque leur documentation est lisible par
navigation mais non récupérable par le vérificateur de contenu. Elle s'appuie aussi
sur CNIL, W3C, OWASP, Google et les comportements d'intégration documentés par Stripe.
La [comparaison](research/comparison.md) contient les liens et leurs limites.

Les choix avancés retenus sont la séparation identité/processus, les profils
versionnés, la provenance des preuves, les qualifications multidimensionnelles,
les sources interchangeables, les budgets d'enrichissement, le suivi des signaux,
les reprises sans doublon et une évaluation par profil. L'IA, les séquences et la
surveillance sont facultatives; leurs garanties sont obligatoires si activées.

Ce dossier fournit une **synthèse de conception fondée sur des sources**. Il ne
fournit ni benchmark pratique des produits cités, ni mesure d'une implémentation,
ni preuve de supériorité universelle. `CAP-PR-016` impose précisément de mesurer
les améliorations sur un corpus tenu à l'écart du réglage, face à une référence
simple, avec qualité, couverture, coût, latence et régressions visibles.

## Consommer ce contrat

Lire [le protocole commun](../../AGENTS.md), puis le contrat et sa recherche avant
de choisir une architecture. Relier les travaux aux `REQ-PR-*` et `ACC-PR-*`.
Déclarer les capacités activées et leurs preuves; une validation de YAML n'est pas
une validation du produit. Les profils illustratifs ne sont pas des campagnes
autorisées à collecter ou envoyer.

Le contrat n'impose aucune technologie et n'est pas accompagné d'un profil externe
de conformité exécutable : aucun artefact inexistant n'est annoncé comme disponible.
Une implémentation doit fournir la matrice de couverture et les preuves décrites
dans `delivery`.

Depuis la racine du dépôt :

```bash
npm run validate:contracts
# Contrôle supplémentaire, dépendant de la disponibilité et de l'évolution des sites :
npm run verify:research
```

## Version

- **0.1.0 — 2026-10-23** : première définition de la famille `prospecting-workspace`,
  avec recherche comparative, séparation des profils, suivi des prospects,
  collecte entrante et scénarios de défaillance. Aucun changement au Build Kit.

## Proposed contract update — 2026-11-01

The [1.0.0 candidate](candidates/1.0.0/contracts/contract.yaml) strengthens 2 clauses
and retains the 0.1.0 [baseline](contracts/contract.yaml) unchanged. Acceptance
increases from 32 to 34 cases. See the [proposal and migration](candidates/1.0.0/proposal.md),
[exact clause changes](candidates/1.0.0/changes.json) and [author review](candidates/1.0.0/review.md).

Maturity is candidate, format 0.1. Independent review and stable promotion remain
pending; all product cases are not_run. Existing consumer pins and Build Kit do
not change. The [batch update](../../docs/contract-updates-2026-11-01.md) records
validation and deferred deepening.
