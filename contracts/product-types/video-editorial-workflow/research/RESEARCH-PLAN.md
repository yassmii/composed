# Plan de recherche — Video Editorial Workflow

## 1. But et règle de méthode

Cette recherche enrichit le contrat générique `video-editorial-workflow`
(v0.3.1, draft). Elle répond à une question produit : **quel parcours vérifiable
permet à une équipe éditoriale de passer d'une interview autorisée à un handoff
de montage traçable, dans plusieurs organisations et environnements ?**

Elle ne choisit ni fournisseur cloud, ni langage, ni framework, ni modèle IA.
Ces décisions pourront être étudiées ensuite par le dépôt d'implémentation,
une fois les comportements du produit stabilisés.

Règle de preuve : une observation décrit un comportement réellement constaté,
une limite ou une divergence. Une préférence de projet est explicitement
marquée comme telle dans `traceability.yaml`; elle ne devient jamais un fait
attribué à un produit étudié.

## 2. Ce qui est déjà établi

Les sources publiques actuelles décrivent des comportements de revue média,
d'export de montage et de synchronisation. Les autres clauses sont des choix
explicites dont le fondement comparatif reste à compléter.
Consulter `sources.yaml`, `observations.yaml` et `comparison.md` avant toute
nouvelle observation afin d'éviter de réintroduire une hypothèse comme un fait.

## 3. Questions de recherche

| ID | Question à trancher ou documenter | Décision de contrat attendue |
|---|---|---|
| RQ-01 | Comment un éditeur examine-t-il, annote-t-il, compare-t-il et fige-t-il des prises sans perdre ses raisons de choix ? | Modèle de sélection, versions, commentaires, attribution et restauration. |
| RQ-02 | Qu'est-ce qui constitue un handoff éditorial recevable par l'équipe de montage et comment sa recette est-elle attestée ? | Contenu du paquet d'export, statut de recette, défauts et boucle de correction. |
| RQ-03 | Quels éléments de provenance doivent survivre entre médias, transcriptions, décisions et exports ? | Entités, identifiants, immuabilité et preuves minimales. |
| RQ-04 | Quel comportement local reste nécessaire quand le réseau, le GPU ou un service externe ne sont pas disponibles ? | Dégradation, reprise, limites du profil local et synchronisation éventuelle. |
| RQ-05 | Quelles différences fonctionnelles sont acceptables entre profil local, hébergé et hybride ? | Noyau de conformité commun et capacités déclarées par profil. |
| RQ-06 | Quels gestes restent humains et à quel moment une assistance automatique doit-elle seulement proposer, plutôt que décider ? | Autorités, confirmations, attribution et limites de l'assistance. |
| RQ-07 | Quelles catégories de données peuvent sortir vers un service externe, à quelles conditions et avec quelle preuve ? | Politique de sortie, consentement/autorisation, journal et indisponibilité sûre. |
| RQ-08 | Quels temps, volumes et échecs réels du jeu de référence doivent constituer le benchmark initial ? | Jeu de référence, seuils de qualité et critères d'exploitation. |

## 4. Axes et sources à réunir

### A. Parcours terrain de la famille produit

Conduire des sessions sur des interviews de référence issues de plusieurs
contextes d'utilisation. Les contraintes et décisions d'un client restent
dans son dossier de projet. Une observation destinée à la recherche commune
requiert une preuve publiable et attribuable. Chaque session produit des notes
datées et une distinction entre faits observés et décisions proposées.

| Interlocuteur | Matériel à parcourir | Ce qu'il faut observer |
|---|---|---|
| Éditeur / monteur | page de sélection, paquet d'export et outil de montage destinataire | critères de choix, annotations utiles, moment de figer, conditions d'acceptation ou rejet d'un handoff |
| Opérateur de préparation | traitements existants et journaux de référence | gestes, préconditions, sorties attendues, erreurs récupérables, temps de contrôle humain |
| Référent informatique / exploitation | description du déploiement et inventaire des écarts | limites d'identité, de stockage, de secrets, de calcul et de sortie de données ; noter les réponses comme contraintes proposées tant qu'elles ne sont pas actées |

Ne collecter ni rush, ni identifiant, ni secret dans le dépôt `composed`. Les
notes doivent employer des liens vers un emplacement interne autorisé et une
classification adaptée.

### B. Produits comparables — revue et décision éditoriale

Étudier au moins deux produits ou outils dont la documentation officielle
permet de vérifier les comportements suivants : revue média, annotation,
comparaison de versions, commentaires, décisions éditoriales et partage à un
collaborateur. Relever les divergences plutôt que fusionner les interfaces.

Questions d'observation :

- une annotation est-elle liée à un instant, à une plage ou à une version ?
- un choix possède-t-il un auteur, une raison, un statut et une révision ?
- comment une décision est-elle partagée, refusée ou restaurée ?
- que voit un utilisateur qui n'a qu'un droit de revue ?

### C. Produits comparables — handoff et provenance

Étudier au moins deux références primaires sur l'échange avec le montage, la
gestion de médias ou les exports éditoriaux. Elles doivent éclairer le contenu
observable d'un handoff, les références médias, les incompatibilités et la
recette ; elles ne doivent pas servir à imposer un format ou une application
dans le contrat.

Questions d'observation :

- comment une sortie relie-t-elle la séquence à ses sources ?
- une recette ou un rejet d'import est-il représenté et attribué ?
- que se passe-t-il si un média référencé est introuvable ?
- quelles informations rendent la reprise manuelle possible ?

### D. Profils local, hébergé et hybride

Étudier des documentations primaires de produits qui exposent une exécution
locale, partagée ou hybride. Chercher les comportements, pas la marque ou la
technologie : installation reproductible, identité, persistance, accès aux
médias, traitement long, reprise après échec et fonctionnement dégradé.

Questions d'observation :

- quelle partie de l'état reste locale et quelle partie devient partagée ?
- comment un travail long est-il repris et rendu observable ?
- quelles capacités disparaissent ou se dégradent hors réseau ?
- quelle preuve distingue un profil effectivement vérifié d'un profil seulement déclaré ?

### E. Assistance IA et sortie de données

Étudier les politiques et documentations de référence pertinentes pour les
capacités d'assistance : délégation, confirmation humaine, export de contenu,
journalisation et indisponibilité d'un service. Cet axe ne vaut pas
autorisation d'utiliser un fournisseur ; il prépare les clauses qui doivent
rester désactivées ou gouvernées par défaut.

## 5. Format obligatoire des preuves

Pour chaque source externe, compléter `sources.yaml` avec : URL officielle
immuable ou versionnée, produit et version, date de récupération, localisateur
précis et SHA-256 du contenu récupéré. Pour chaque constat, ajouter une seule
observation dans `observations.yaml`, avec le ou les identifiants de source.

Exemples de formulation :

```yaml
- id: "OBS-VEW-0XX"
  sources: ["SRC-VEW-EXAMPLE"]
  statement: "Le produit présente un comportement précis, dans une condition précise."
```

`comparison.md` doit ensuite séparer :

1. convergences étayées ;
2. divergences à conserver comme choix ;
3. lacunes de preuve ;
4. décisions proposées pour le contrat, explicitement nommées comme choix.

## 6. Ordre d'exécution agentique

1. Relire les sources publiques existantes et identifier les clauses qui
   restent des choix explicites sans preuve comparative.
2. Constituer une liste courte de candidats par axe, puis faire valider la
   pertinence de la liste par le responsable produit avant lecture approfondie.
3. Lire uniquement des sources primaires et versionnées ; enregistrer les
   observations de manière atomique au fil de l'eau.
4. Réaliser les sessions terrain et distinguer les citations, les faits
   observés et les décisions demandées.
5. Produire la comparaison, puis demander une revue indépendante en lecture
   seule de la recherche et de ses liens.
6. Le contract author propose ensuite le diff vers la prochaine version ; il ne modifie
   aucune clause à partir d'une source ou décision non identifiée.

Les axes B à E peuvent être recherchés en parallèle. Les écritures dans les
fichiers canoniques sont ensuite intégrées une à une afin de conserver des
identifiants et empreintes non conflictuels.

## 7. Critères de sortie

La recherche peut être proposée pour revue lorsque :

- chaque question RQ-01 à RQ-08 est soit étayée, soit explicitement déclarée
  ouverte avec son propriétaire de décision ;
- chaque axe B à E possède des sources primaires versionnées et des
  observations atomiques ;
- la comparaison ne recommande aucune technologie sans choix produit distinct ;
- les observations et liens passent `npm run validate:contracts` ;
- une revue indépendante confirme la distinction entre preuve et choix.

Une prochaine version mineure peut alors être proposée avec un changelog des clauses
ajoutées, clarifiées ou différées. Il ne passe à `stable` qu'après validation
des scénarios sur au moins un profil réel et validation humaine des décisions produit concernées.
