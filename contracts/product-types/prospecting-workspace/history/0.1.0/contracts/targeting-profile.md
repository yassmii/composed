# Interface logique du profil de ciblage — 0.1.0

Ce document précise `CAP-PR-001`, `CAP-PR-006` et `CAP-PR-017` du
[contrat](contract.yaml). Les YAML d'[exemple](../examples/README.md) illustrent
cette interface, sans imposer un format de stockage, une API, un langage de règles
ou un fournisseur. Le profil est une configuration de contenu, jamais une autorité
d'exécution. Les obligations normatives restent celles des clauses identifiées.

## Ce que le profil apporte au moteur

| Élément | Contenu et validation attendus |
| --- | --- |
| Identité et publication | Identifiant, version, statut, propriétaire métier, objectif et historique; une publication est immuable. |
| Cibles | Types recherchés, libellés, attributs typés et unités éventuelles; champs nécessaires à une recherche ou à un niveau de qualification distingués des données facultatives. |
| Entités liées | Types d'interlocuteurs et objets contextuels; relations, rôles, cardinalités, dates ou validité inconnue; aucun interlocuteur obligatoire pour simplement conserver une cible. |
| Identité | Identifiants fiables par type avec espace de noms de l'émetteur; normalisation déclarée; critères de rapprochement possibles et motifs de revue. |
| Acquisition | Sources candidates, accès et conditions de réutilisation à établir, filtres, limites, correspondance des champs; saisie et import; formulaire entrant si pertinent. |
| Qualification | Niveaux nommés, critères, opérateurs et valeurs attendues, dimension, caractère obligatoire, types de preuves admis, portée et fraîcheur. |
| Priorisation | Règles ou méthode explicables et versionnées; ne pas mélanger score de priorité et preuve de qualification. |
| Suivi | Pipeline, critères de passage, issues, responsabilité, délais et prochaine action attendue; une attente est datée et motivée. |
| Contenu de contact | Offre et propositions de valeur approuvées, faits sourcés, ton, langue, modèles et interdictions; coordonnées et chiffres inconnus ne sont pas générés comme des faits. |
| Surveillance facultative | Population, attributs ou recherche suivis, cadence, budget, différences utiles et notifications; ne pas transformer une perte de couverture en changement métier. |
| Évaluation | Corpus autorisé, vérité terrain disponible, annotations, référence simple et seuils mesurables par niveau. |
| Dépendances | Références vers la politique de conformité, les sources réellement habilitées et les canaux disponibles; leur absence bloque les seules opérations dépendantes. |

Les noms propres de connecteurs, registres ou catégories sont des données du profil
ou de ses dépendances. Leur présence dans un exemple ne les rend pas obligatoires
pour le socle.

## Règles et inconnues

Chaque critère a un identifiant stable, une dimension et une règle interprétable.
Les exemples emploient `field`, `operator` et `value`; les valeurs d'opérateurs
illustrées sont `in`, `equals`, `gte` et `exists`. Les règles d'un déploiement
doivent avoir une sémantique déclarée et être validables avant publication.
Un opérateur ou une référence inconnus ne sont pas exécutés comme des instructions
libres. Une règle plus complexe appartient à une extension versionnée déclarée,
sans changer les invariants du contrat.

Une observation apporte valeur, origine, localisateur, dates, mode d'obtention et
état de vérification. Les types d'attributs et les preuves sont contrôlés avant
évaluation. Une valeur déclarée peut être admise par un critère explicitement
déclaratif; elle reste étiquetée comme telle. Une preuve provenant d'un interlocuteur
doit être reliée au dossier concerné : l'intérêt d'un syndic pour une copropriété
ne s'étend pas automatiquement aux autres.

Chaque critère produit `satisfait`, `non_satisfait` ou `inconnu`. Une contradiction
non résolue, une valeur absente et une preuve périmée produisent `inconnu` pour
l'acceptation. Le profil indique les preuves à obtenir pour lever cette inconnue.
Une condition est `non_satisfaite` quand une preuve valide démontre son échec.
Une collecte qui échoue ne démontre jamais cet échec.

Un niveau est admissible quand **tous** ses critères obligatoires sont satisfaits;
son acceptation nécessite encore une décision attribuée. Les critères facultatifs
peuvent aider à prioriser, sans compenser un obligatoire. Une exception humaine
reste distincte de ce niveau et ne change pas les faits.

Les exemples distinguent :

- **Cible pertinente** : les caractéristiques nécessaires à l'adéquation sont
  démontrées; cela ne prouve aucun besoin.
- **Lead commercialement qualifié** : des preuves propres à l'offre et au dossier
  satisfont les critères supplémentaires choisis, par exemple besoin exprimé,
  rôle de l'interlocuteur et prochaine étape acceptée.
- **Contact autorisé pour une action donnée** : résultat indépendant de la
  politique, de la finalité, du canal, du destinataire et des restrictions courantes.

Un dossier peut satisfaire un niveau métier tout en étant interdit de sollicitation.
Un message ne peut partir que si cette possibilité est établie séparément au moment
de la remise. Le profil ne peut rendre un refus facultatif ni donner un poids
positif permettant de le contourner.

## Profils, campagnes et changements

Une campagne référence un profil publié, un pipeline et une politique validée.
Les observations et évaluations conservent la version utilisée. Une nouvelle version
peut modifier critères, fraîcheur, vocabulaire ou sources; elle ne réécrit pas le
passé. L'utilisateur voit les dossiers affectés et choisit une migration ou une
réévaluation explicite, avec nouvelles décisions et prochaines actions.

Une source peut devenir indisponible ou incompatible sans que le profil soit
« faux » : le moteur signale les limites de couverture et bloque les évaluations
dont les preuves manquent. Une cascade de fournisseurs est un moyen facultatif
d'obtenir un attribut, avec accès autorisé pour chaque fournisseur, condition
d'arrêt et budget. Elle ne démontre ni l'exactitude de l'attribut ni l'autorisation
de solliciter.

## Frontière avec la conformité

Le profil métier référence une politique externe au contenu; il ne choisit pas
librement une base légale pour contourner une restriction. La politique contient
responsable de traitement, populations, finalités, juridictions, canaux, information,
preuves de consentement lorsqu'il est requis, règles d'opposition, conservation,
sous-traitants, dates d'effet et de réexamen.

Pour un déploiement en France, les régimes B2B, B2C, syndic professionnel ou bénévole
ne se déduisent pas du seul type « copropriété ». Les règles de contact doivent
être vérifiées pour la personne et le canal réels. Une inscription en open data
n'autorise pas automatiquement une sollicitation. Voir les sources CNIL et les
limites dans la [recherche comparative](../research/comparison.md).
