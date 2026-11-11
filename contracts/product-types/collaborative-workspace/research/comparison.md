# Comparaison initiale

| Sujet | Notion | Airtable | Décision du contrat |
| --- | --- | --- | --- |
| Unité de travail | Pages en blocs, y compris dans une base (OBS-CWS-001) | Enregistrements structurés (OBS-CWS-008, 015) | Un élément de base peut être à la fois un document riche et un enregistrement structuré. |
| Modélisation | Propriétés, relations, rollups, formules, présentations multiples (OBS-CWS-002, 003) | Historique et automatisation d'enregistrements (OBS-CWS-008, 010) | Schémas, relations, vues et calculs sont des primitives indépendantes du support de stockage. |
| Collaboration | Commentaires, mentions, notifications et présence (OBS-CWS-005, 007) | Activité de l'enregistrement et attribution (OBS-CWS-015) | Les conversations et l'historique sont attribués, séparés du contenu, et respectent les droits. |
| Droits | Accès de page, groupes, niveaux distincts et règles par élément (OBS-CWS-005, 006) | Les droits encadrent l'historique et l'automatisation (OBS-CWS-008, 010) | Les droits sont évalués à chaque lecture, écriture, recherche, export et déclenchement. |
| Automatisation | Déclencheurs, conditions, actions, pause sur erreur et webhooks (OBS-CWS-010, 011) | Journaux d'exécution et versions de configuration (OBS-CWS-010, 015) | Une automatisation est versionnée, bornée en autorité, observable et suspendue de façon sûre en cas d'échec. |
| Gouvernance | Journal d'audit exportable et métadonnées sans contenu (OBS-CWS-013) | Historique de révision attribué (OBS-CWS-008) | Journal d'audit, historique de contenu et export sont des artefacts distincts. |
| Liberté et auto-hébergement | Produit hébergé (hors périmètre de cette comparaison) | Produit hébergé (hors périmètre de cette comparaison) | AppFlowy et Docmost publient un cœur AGPL (OBS-CWS-016, 018); le contrat impose une capacité libre et auto-hébergeable sans composant obligatoire à abonnement. |
| Local-first et convergence | Non documenté dans cette recherche | Non documenté dans cette recherche | AFFiNE et Anytype exposent un modèle local-first (OBS-CWS-017, 019); Any démontre synchronisation chiffrée et fusion CRDT hors ligne (OBS-CWS-020). |
| Frontière open source | Non applicable | Non applicable | AFFiNE sépare des composants Enterprise (OBS-CWS-017) et Anytype est source-available (OBS-CWS-019); aucun des deux modèles ne suffit pour le socle obligatoire du contrat. |
| État canonique | Historique géré par le produit (OBS-CWS-008, 009) | Historique géré par le produit (OBS-CWS-008, 015) | Decap persiste le contenu dans le dépôt (OBS-CWS-021) et TinaCMS utilise les fichiers du dépôt comme source de vérité avec index reconstructible (OBS-CWS-022). |
| Identité et sessions | Non étudiées comme référence de produit | Non étudiées comme référence de produit | OWASP ASVS 5.0 encadre les facteurs, la résistance aux abus, la récupération, les cycles de session, la réauthentification et la révocation (OBS-CWS-023 à 025). Le contrat les rend obligatoires et indépendants du dépôt Git. |

## Convergences

- Des données collaboratives combinent structure, vues adaptées au contexte et attribution des changements.
- Les automatisations doivent pouvoir être inspectées après un échec ou une modification.
- Les droits ne sont pas une décoration d'interface : ils déterminent les données, actions et historiques exposés.

## Choix de ce contrat

1. Le contrat généralise le modèle document + base sans copier l'interface d'un produit ni rendre un fournisseur obligatoire.
2. Les vues liées et les exports ne peuvent jamais élargir la visibilité d'un élément source.
3. Les automatisations et assistants IA reçoivent une identité, des capacités limitées, une traçabilité et un mécanisme d'arrêt.
4. L'historique est restaurable et attribué; les suppressions définitives, les politiques de rétention et l'effacement légal restent une extension explicitement gouvernée.
5. Les formulaires, interfaces, connecteurs, IA, calendrier, cartes et tableaux de bord sont des options de surface du même modèle d'autorisation, pas des produits parallèles.
6. **Le socle obligatoire est libre, auto-hébergeable et sans péage fonctionnel.** Les capacités `must` ne peuvent dépendre d'un compte, d'une licence, d'un service ou d'un composant propriétaire d'un fournisseur. Les fonctions payantes facultatives ne peuvent pas être la seule manière d'exercer un droit contractuel.
7. **Local-first est une exigence de résilience, pas un slogan.** Les changements hors ligne sont locaux et identifiables, se synchronisent ensuite sans perte silencieuse, et les garanties de convergence sont publiées avec une charge de référence.
8. **Git est l'état durable canonique.** Le journal de coédition local rend l'édition fluide; il est matérialisé en révisions Git sémantiques. Les index, caches et projections sont reconstruisibles à partir du dépôt et ne deviennent jamais une seconde vérité.


## Corpus refresh — 2026-11-01

See the [dated refresh review](README.md#corpus-refresh--2026-11-01) and
[source-by-source impact record](refresh-2026-11-01.json).

Re-read OBS-CWS-005/006/008/009/010/015 against current Notion/Airtable passages: access levels, page-level rules, attributed history, restore and automation run/configuration history remain supported. New notes preserve counterevidence: broadest permission wins in Notion; restoring a database does not restore nested page bodies; Airtable record revision history has no product export or history-read API. These do not establish the stronger Composed recovery, access and portability guarantees. REQ-CWS-030/031/032, INV-CWS-004/015 and POL-CWS-007 remain unchanged.

Baseline obligations are unchanged. Deferred follow-up: Deepen effective permission composition, database/page/attachment restore scope, portable history and retention versus erasure; run conflict/offline and recovery fixtures. Do not transfer vendor UI guarantees to the complete workspace.
