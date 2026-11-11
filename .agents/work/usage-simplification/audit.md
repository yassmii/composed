# Entrée par le besoin — audit et premier incrément

Date : 4 novembre 2026. Périmètre : documentation d'entrée du Build Kit et README racine.

Ce document conserve l'audit du premier incrément Sol. L'[évaluation Astra](reviews/astra-usage-assessment.md)
en expose les limites ; la [validation de la reprise](validation.md) décrit les modifications suivantes
et leurs preuves. Les descriptions « après » ci-dessous sont celles de l'incrément Sol.

## Constats et limites

Inspection des README racine/Build Kit, de `getting-started.md`, puis des guides de livraison,
proportionnalité, catalogue, adoption et de l'exemple produit mentionnés dans le handoff.
Les documents expliquent déjà la réutilisation des décisions, les corrections directes et les
garanties applicables. Le problème retenu est leur accès depuis une tâche concrète.

- **Constaté par inspection :** l'entrée racine mène à l'installation ; celle du Build Kit
  commence par l'installation puis énumère ses capacités. Le guide décrit les principes,
  la stack, l'installation et les fichiers avant de présenter les formes de livraison.
- **Constaté par inspection :** aucun de ces trois points d'entrée ne réunit les trois
  situations avec une demande adaptable et le résultat à attendre ensuite.
- **Hypothèse :** partir d'une tâche et de sources existantes aide à commencer sans apprendre
  d'abord le vocabulaire des skills et de la coordination. Aucun gain de temps n'a été mesuré.
- **Retour du propriétaire :** volonté de simplifier l'usage et de standardiser, conservée
  dans le handoff. Aucun entretien ou test de parcours auprès de nouveaux utilisateurs ici.

## Avant / après concret

Les parcours « avant » décrivent les informations à assembler dans les documents, pas une
séquence obligatoire ni une difficulté observée chez une personne.

| Situation | Avant : informations à assembler | Après : entrée et prochain geste |
| --- | --- | --- |
| Nouveau besoin, par exemple patrimonial | Entrée orientée installation ; définition produit dans les contrats et liens vers le cycle produit/évolution à retrouver. | Depuis la racine, lien direct vers « A new product need ». Adapter la demande avec le besoin, les sources et le checkout contrats. Attendre couverture, lacunes, statut/version et prochaine décision produit avant toute réalisation. |
| Contrat et stack choisis | Réutilisation des décisions dans le guide, passage d'acceptation dans product-delivery et exemple ailleurs ; aucune demande réunissant ces entrées. | Lien direct vers « An existing project with agreed decisions ». Fournir les chemins déjà disponibles du brief, pin/IDs et stack/commandes. L'agent inspecte puis réalise une tranche bornée avec les preuves applicables, ou nomme le blocage. |
| Correction ou reprise | Parcours direct documenté dans proportionate-delivery ; reprise via sources de travail/mémoire ; installation et diagnostic exposés séparément. | Lien direct vers « A correction or work to resume ». Décrire le comportement actuel/attendu, ou fournir le handoff existant. Attendre correction vérifiée, ou état actualisé et prochain geste autorisé. La reprise conserve le niveau de risque du travail restant. |

Pour chaque départ, les chemins entre crochets se remplacent par les sources **existantes** :
ils ne prescrivent pas de créer un nouveau document. L'agent inspecte les sources accessibles
avant de demander une information absente. Il ne devine pas un contrat indisponible.

## Fichiers et manipulations

- Entrées modifiées : `README.md`, `build-kit/README.md`, `build-kit/docs/getting-started.md`.
- Note du composant : `build-kit/CHANGELOG.md`, sous Unreleased. Versions inchangées pour cette
  réorganisation documentaire ; aucune instruction distribuée, bridge ou commande modifiée.
- Nouveau projet : installation existante toujours nécessaire (checkout + dépendances, `init`
  dans un dépôt Git, choix langue/bridges/niveaux), puis session de l'agent dans le projet.
- Projet déjà installé : pas d'installation, de mise à jour ou de diagnostic supplémentaire
  imposé par ces parcours. Réutiliser les documents et pins existants.
- Aucun nouveau formulaire, format, portail ou fichier obligatoire dans le projet consommateur.
  Le statut « décidé / réalisé / vérifié / ouvert / prochain geste » est une aide facultative.

## Démonstration et validation

La démonstration consiste à suivre les trois liens du README jusqu'aux demandes et résultats
attendus ci-dessus, puis à retrouver les guides canoniques associés. C'est une inspection
documentaire ; aucune session d'agent consommateur ni observation d'utilisateur n'a été exécutée.
Les contrôles effectivement exécutés et leur résultat sont consignés dans le handoff.

Les règles produit, pins, choix de stack, autorisations, délégation et revues applicables restent
inchangés. Aucun contrat, runtime, application patrimoniale ou outil externe n'est livré ici.

## Suite proposée

Faire essayer ces entrées sur un besoin réel avec une installation existante : observer si la
personne sait formuler sa demande et identifier le prochain geste, relever les questions répétées
et les sources introuvables. Choisir ensuite entre raccourcir davantage le guide ou améliorer les
consignes distribuées selon la friction constatée. Une nouvelle CLI ou interface reste une décision
ouverte, sans justification supplémentaire à ce stade.
