# Analyse et conseil patrimoniaux — France

[English version](README.md)

Contrat **`wealth-advisory@0.1.0`**, format **0.2**, statut **draft**.
Il couvre le parcours complet demandé : recueil → bilan → diagnostic → scénarios →
préconisations → validation et remise → suivi. Utilisateur principal : gestionnaire
de patrimoine intervenant en France. Aucune stack n'est choisie.

La première version traite des personnes physiques et groupes nommés. Ce périmètre
est une proposition de conception, distincte des choix déjà confirmés par le
propriétaire : France, gestionnaire de patrimoine, conseil et suivi inclus.

| Document | Usage |
| --- | --- |
| [Contrat](contracts/contract.yaml) | 9 capacités, 29 exigences, 8 invariants, 5 politiques, 3 qualités et 26 scénarios d'acceptation. |
| [Traçabilité](contracts/traceability.yaml) | Fondement documentaire ou choix explicite de chaque clause. |
| [Recherche et comparaison](research/comparison.md) | Comportements documentés, divergences et limites des sources. |
| [Sources](research/sources.yaml) et [observations](research/observations.yaml) | Huit sources récupérées avec empreinte, dix observations atomiques. |
| [Profils de service](contracts/service-profiles.md) | Explication du périmètre par mission, domaine et modèle ; aucune configuration applicative imposée. |
| [Revue d'auteur](contracts/review.md) | Cohérence du brouillon et points à résoudre avant promotion. |
| [Validation](research/validation.md) | Vérifications du document, distinctes des essais d'un produit. |

## Ce que le contrat standardise

- Le calcul du bilan : actifs, dettes, quotes-parts, devises et dates sans double compte.
- Les inconnues, hypothèses et justificatifs, sans transformer une absence en zéro.
- Le lien entre objectifs, constats, stratégies comparées et conseil motivé.
- La décision humaine, la révision exacte remise et les décisions du client.
- Le suivi attribué, les changements à réexaminer et la confidentialité du dossier.

Les simulations ont un cadre explicite : un modèle fiscal, successoral ou de
retraite doit annoncer les situations et périodes qu'il sait traiter. Le contrat
ne promet pas de couvrir automatiquement tout le droit patrimonial français.
Un groupe analysé n'est pas nécessairement un foyer fiscal ; une quote-part
économique ne définit pas à elle seule la responsabilité d'un emprunteur.

## Limites actées

Le suivi **LCB-FT et le gel des avoirs sont différés**. Les transactions,
souscriptions et actes juridiques ne sont pas exécutés par ce périmètre. Ces limites
ne dispensent pas le professionnel de ses obligations et le produit ne délivre
aucun feu vert de conformité pour les modules absents.

Le titre de gestionnaire de patrimoine ne vaut pas statut de CIF, distributeur
d'assurance ou professionnel du droit. Le rôle et les domaines de conseil sont
explicites par mission ; au moins un domaine doit être effectivement couvert.
La validation finale reste humaine ; une assistance automatisée est facultative.

## État et suite

Tous les scénarios produit sont **not_run**. La validation documentaire ne démontre
ni exactitude d'une application, ni adéquation d'un conseil réel, ni conformité
globale. Le statut reste draft après la revue d'auteur, sans revue indépendante
revendiquée. Les dix familles intégrées précédemment et leurs archives sont intactes.

La prochaine étape est une revue métier du périmètre et des cas avec le propriétaire
ou un professionnel désigné : domaines à couvrir réellement, statuts professionnels,
modèles chiffrés prioritaires, restitution et règles de suivi. Les modifications
précises restent à discuter ; le besoin de conseil complet est déjà confirmé.
La simplification de Composed reste un chantier séparé.
