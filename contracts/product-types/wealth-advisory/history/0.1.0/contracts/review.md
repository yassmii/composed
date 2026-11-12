# Revue d'auteur — wealth-advisory 0.1.0

Date : 4 novembre 2026. Mode : `self-review`. Statut conservé : **draft**.
Il ne s'agit pas d'une revue indépendante ni d'une approbation du propriétaire.

## Points examinés

- Le parcours comprend les préconisations et leur suivi, conformément au choix du propriétaire.
- Les domaines et habilitations sont distincts du titre de gestionnaire de patrimoine (`REQ-WAD-001/002`).
- Les données inconnues, quotes-parts, dettes, enveloppes et devises disposent de refus et
  cas limites (`ACC-WAD-002`, `005` à `008`).
- Les scénarios sont comparés sous hypothèses visibles et les modèles spécialisés sont bornés
  (`ACC-WAD-010` à `012`) ; aucun barème fiscal non recherché n'est inventé.
- La validation humaine porte sur une version exacte, y compris en cas de changement concurrent
  (`ACC-WAD-015/016/025`). Elle ne vaut pas accord du client ou transaction (`017/018`).
- Le suivi distingue échéance, absence de réponse et réexamen effectif (`019/026`).
- Les versions historiques et les règles de suppression légitime sont articulées sans imposer
  une conservation infinie (`INV-WAD-004`, `ACC-WAD-022/023`).
- La revue de compréhension du rapport est manuelle (`ACC-WAD-014`) ; tous les autres
  cas demandent des observations à l'interface publique, sans transport imposé.
- Les exclusions LCB-FT/gel ne deviennent ni statut conforme ni exemption d'obligation (`POL-WAD-002`).

## Corrections issues de la relecture

Le profil ne peut pas être vide (`REQ-WAD-002`). Une validation devenue obsolète
est refusée (`REQ-WAD-020`, `ACC-WAD-025`). Le rythme annuel de suivi a été limité
au service CIF concerné, avec un cas propre (`REQ-WAD-024`, `ACC-WAD-026`).
La position AMF historique non applicable ne soutient aucune clause ; la limite de
récupération ACPR est explicite au lieu d'inventer une empreinte.

## Réserves avant promotion

1. **`REQ-WAD-001/002/005/017/019/024`** — Faire revoir les profils de service par un
   professionnel compétent, avec les statuts réels, les textes applicables et les modalités
   de rémunération. La source ACPR lue par navigation reste sans empreinte de corps récupéré.
2. **`REQ-WAD-007/015`** — Choisir et faire revoir les droits de détention et modèles
   spécialisés couverts avant de prétendre traiter fiscalité, transmission ou retraite.
3. **`REQ-WAD-028/029`** — Définir les règles de conservation et restauration applicables
   au cabinet, sans affaiblir les droits des personnes ni la traçabilité requise.
4. **`QA-WAD-003` et métriques produit** — Recueillir un retour métier sur les rapports et
   le parcours ; aucun entretien ni résultat d'usage n'est disponible dans cette rédaction.

Ces réserves maintiennent le contrat en brouillon. Aucun cas produit n'est déclaré
exécuté. Les validations du document sont décrites dans [validation.md](../research/validation.md).
