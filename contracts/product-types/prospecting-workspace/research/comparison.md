# Recherche comparative et décisions

Consultation : **23 octobre 2026**. État : **initial**. La question est de définir
une famille d'outils de découverte, qualification et suivi, dont le contenu recherché
peut changer sans refaire le produit. Le cas copropriétés sert à éprouver cette
généralisation; un cadrage privé, non publié, fournit un autre parcours concret.

## Méthode et couverture

La recherche porte sur les documentations officielles de six produits, des textes
d'autorités publiques, des standards et des guides techniques primaires. Les
[sources hachées](sources.yaml) et [observations atomiques](observations.yaml)
alimentent la [traçabilité des clauses](../contracts/traceability.yaml).

Les constats décrivent ce que les produits documentent; ils ne prouvent pas une
efficacité commerciale ni une conformité d'un déploiement réel. Aucun compte
produit n'a été testé et aucun fournisseur n'a été évalué sur des prospects réels.
Les limites d'offre et d'accès empêchent d'assimiler une capacité annoncée à une
capacité disponible dans tous les contextes.

21 sources ont été récupérées indépendamment avec une empreinte SHA-256. Deux
références supplémentaires, Salesforce et Apollo, ont été lues via navigation web
mais refusées ou mal rendues lors de la récupération indépendante. Elles sont
citées qualitativement ci-dessous, sans fausse empreinte ni lien de preuve machine.
Les pages vivantes peuvent changer; une empreinte n'est pas une archive. Le fichier
RNIC national n'a pas été téléchargé ni audité.

## Fonctions observées et différences

| Produit | Observation documentaire | Limite ou divergence pertinente | Décision pour le contrat |
| --- | --- | --- | --- |
| [Attio — modèle de données](https://attio.com/help/reference/attio-101/attios-data-model/define-your-data-model-objects-lists-and-views) | Objets, relations, attributs et listes distinguant les données d'identité des données d'un processus. | Les types personnalisés ont leurs limites et droits; cela ne démontre pas une universalité sans configuration. | Cible, interlocuteur, relation et dossier par campagne séparés; types et attributs dans le profil. `CAP-PR-001/002`. |
| [HubSpot — scoring](https://knowledge.hubspot.com/scoring/understand-the-lead-scoring-tool) | Adéquation et engagement séparables, décroissance et réévaluation lors d'un changement des critères. | La réévaluation rétroactive diffère du besoin de reproduire une décision historique. | Quatre dimensions distinctes, preuves obligatoires et versions conservées; migration explicite. `REQ-PR-003`, `CAP-PR-006`. |
| [HubSpot — séquences](https://knowledge.hubspot.com/sequences/unenroll-from-sequence) | Arrêts après réponse ou rendez-vous, configurables; reconnaissance imparfaite des réponses automatiques. | Le produit permet de modifier certains déclencheurs. Une détection automatique n'est pas infaillible. | Pauses obligatoires dans les situations définies et revue des ambiguïtés; choix plus strict. `CAP-PR-008/010`. |
| [Pipedrive — Leads Inbox](https://support.pipedrive.com/en/article/leads-inbox) | Leads avant pipeline, activités à venir et historique, conversion en affaires. | Le rattachement à une personne ou organisation est requis par Pipedrive. | Conserver un espace d'examen, mais permettre aussi projet, actif ou collectif sans société ni contact préexistant. `CAP-PR-002/007/008`. |
| [Pipedrive — formulaires](https://support.pipedrive.com/en/article/web-forms) | Formulaires intégrables au site, champs personnalisés et entrée en leads ou affaires; consentement à configurer. | Une soumission est une déclaration, pas une qualification démontrée. | Formulaire entrant minimal, traitement des abus et distinction demande/accord promotionnel. `CAP-PR-004`. |
| [Clay — waterfalls](https://university.clay.com/docs/building-a-data-waterfall) et [signaux](https://university.clay.com/docs/custom-signals) | Enrichissements via fournisseurs ordonnés et suivi de changements à partir d'exécutions planifiées. | Obtenir une valeur, vérifier sa fiabilité et pouvoir la réutiliser sont des questions distinctes. | Sources interchangeables; cascade et surveillance facultatives, budgets, provenance et condition d'arrêt. `CAP-PR-003/017`. |
| [Salesforce — gestion des doublons](https://trailhead.salesforce.com/content/learn/modules/sales_admin_duplicate_management/sales_admin_duplicate_management_unit_2) | Règles de correspondance distinctes de la décision d'avertir ou bloquer. | Référence qualitative : récupération indépendante inexploitable. | Rapprochement certain/possible et revue de fusion sont des choix explicites; pas de clé universelle nom/ville. `REQ-PR-015/016`. |
| [Apollo — Buying Intent](https://knowledge.apollo.io/hc/en-us/articles/8047704465933-Buying-Intent-Overview) | Signaux au niveau de l'entreprise; les personnes affichées ne sont pas nécessairement celles qui effectuent la recherche. | Référence qualitative : HTTP 403 en récupération indépendante. | Garder le niveau d'observation et ne pas attribuer une intention collective à un individu. `REQ-PR-019/057`, choix explicite. |

Il existe donc des motifs communs — configuration, qualification, activités et
progression — mais pas un produit universel dont il suffirait de copier les écrans.
Le contrat choisit explicitement une séparation plus nette entre contenu,
identité, preuve, suivi et droit d'agir. Aucune capacité n'est qualifiée de
« convergence » au seul motif que plusieurs pages marketing l'emploient.

## Ce que le cas copropriétés change

La [fiche ANAH du RNIC](https://www.data.gouv.fr/datasets/registre-national-dimmatriculation-des-coproprietes)
est une source candidate pour identifier des copropriétés et leurs caractéristiques.
Elle ne prouve aucun besoin pour une offre encore non définie. Aucun contact,
projet voté ou accord commercial n'est déduit de la seule présence au registre.

[Service Public](https://www.service-public.gouv.fr/particuliers/vosdroits/N31338)
distingue les fonctions du syndicat, du syndic et du conseil syndical. Le choix de
modélisation est donc de garder des entités et rôles reliés, avec des périodes de
validité connues ou inconnues. Un même intermédiaire peut intervenir dans plusieurs
dossiers sans leur donner une identité commune. L'offre réelle peut viser le
syndicat, le syndic ou un autre acteur; ce choix doit être déclaré dans le profil.

Le [profil illustratif](../examples/coproprietes-fr.yaml) distingue une cible
pertinente d'un lead commercialement qualifié. Le second demande des preuves de
besoin, de rôle et de prochaine étape propres au dossier. Les critères proposés,
dont le seuil de lots, sont des choix illustratifs à valider avec le demandeur.
Ils ne présument ni rénovation énergétique, ni changement de syndic, ni service
particulier : aucune offre n'a été donnée dans la demande reçue.

## Bonnes pratiques rendues vérifiables

| Sujet | Source primaire et constat | Garantie choisie et preuve attendue |
| --- | --- | --- |
| Provenance | [W3C PROV-O](https://www.w3.org/TR/2013/REC-prov-o-20130430/) distingue attribution, dérivation et invalidation. | Une qualification expose origine, date et statut des faits utilisés; tester contradiction et péremption. `ACC-PR-010/011`. Aucun format de graphe imposé. |
| Reprises | [Stripe — idempotence](https://docs.stripe.com/api/idempotent_requests) et [événements](https://docs.stripe.com/webhooks) documentent répétitions et désordre. | Identifier une opération, rapprocher les confirmations et suspendre un envoi incertain. `ACC-PR-017/028`. C'est un transfert de motif de fiabilité, pas une exigence de paiement ni une promesse d'« exactly once » chez tout fournisseur. |
| IA | [OWASP — autonomie excessive](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) et [injection indirecte](https://genai.owasp.org/glossaries/prompt-injection/) décrivent les risques des permissions et contenus non fiables. | Vérifier actions et transferts indépendamment du modèle; approbation du message final, tests d'injection et parcours manuel. `ACC-PR-015/025/026`. Échapper du texte seul n'est pas une preuve de protection. |
| Accessibilité | [WCAG 2.2](https://www.w3.org/TR/2024/REC-WCAG22-20241212/) fournit des critères vérifiables. | Audit AA des parcours, clavier, statuts, petits écrans et alternative au déplacement par glisser-déposer. `QA-PR-001`. Une grille d'écrans cochée ne prouve pas seule la conformité. |
| Courriel | [Google — expéditeurs](https://support.google.com/mail/answer/81126?hl=en) distingue règles générales et règles liées au volume. | Déclarer les exigences réellement applicables, l'identité de l'expéditeur, les rebonds, plaintes et limites. `REQ-PR-031`. Ne pas promettre la boîte de réception. |

Les délais, volumes d'essai, taille d'échantillon utilisateur, règles d'approbation
et seuils de publication du contrat sont **des choix de conception**, pas des
valeurs universelles prouvées par ces sources. La validation doit les mesurer
dans un environnement déclaré et rapporter les écarts.

## Données personnelles : points qui empêchent une généralisation naïve

La [CNIL sur les communications électroniques](https://www.cnil.fr/fr/communication-electronique-quelles-regles)
distingue finalité du message et conditions applicables aux particuliers ou aux
professionnels. Le moteur doit donc connaître le contexte du destinataire et du
canal, pas seulement la catégorie de la cible.

La [FAQ CNIL de gestion commerciale](https://www.cnil.fr/fr/questions-reponses-sur-les-referentiels-relatifs-la-gestion-des-activites-commerciales-et-des)
décrit information indirecte, opposition et liste repoussoir. Sa recommandation
de conservation des prospects prend comme repère la collecte ou un contact
venant du prospect. Elle n'autorise pas à prolonger la conservation par chaque
relance sortante.

Le [référentiel CNIL](https://www.cnil.fr/sites/default/files/atoms/files/referentiel_traitements-donnees-caractere-personnel_gestion-activites-commerciales.pdf),
pages 2–3 et 11–12, précise son périmètre, exclut notamment certains profilages
depuis des sources tierces et écarte la simple ouverture d'un courriel comme
nouveau contact. Le [guide de réutilisation](https://www.cnil.fr/sites/cnil/files/2024-06/recommandations_reutilisateurs_donnees_publiees_sur_internet.pdf)
traite séparément les obligations liées aux données publiées. La fiche
[démarchage commercial](https://www.cnil.fr/fr/demarchage-commercial) mentionne
une évolution du canal téléphonique au 11 août 2026 : le cadre documentaire de
mai 2026 de ce cadrage privé ne suffit donc pas pour un lancement en octobre.

**Décision de contrat** : une politique de conformité validée séparément porte
les permissions, finalités, canaux, dates et durées applicables. Le profil métier
ne peut pas les remplacer. Aucune règle de « trois ans partout », de B2B présumé
ou de conformité automatique de tout scoring n'est retenue. Les oppositions
s'appliquent avant les remises suivantes et survivent aux réimports et restaurations.

## SOTA : ce qui est retenu et ce qui reste à démontrer

La synthèse retient des possibilités contemporaines pertinentes : données
configurables et reliées, séparation adéquation/engagement, sources composables,
surveillance de changements, continuité acquisition-suivi et assistance IA sous
contrôle. Le contrat ajoute des choix de précision : versions reproductibles,
preuves obligatoires, états inconnus, portée des signaux et rapprochement des envois.

Il serait infondé d'affirmer que ce document est le meilleur système de prospection
ou qu'une technique IA particulière est SOTA pour toutes les cibles. Pour évaluer
une implémentation, `CAP-PR-016` demande :

1. Un profil, une offre, une population et des critères de vérité terrain définis.
2. Un corpus autorisé non utilisé pour régler la méthode et une référence simple.
3. Des mesures distinctes de découverte, rapprochement, qualification et rédaction.
4. Les faux positifs, faux négatifs mesurables, inconnues, couverture, coûts et latences.
5. Des seuils fixés avant mesure et une décision de publication ou retour arrière.

Le rappel sur tout Internet n'est pas mesurable sans univers de référence. Une
grande couverture de coordonnées ne démontre ni leur exactitude, ni la qualification,
ni une augmentation des ventes. Aucun de ces résultats n'est annoncé comme acquis.

## Questions à résoudre dans chaque déploiement

- Quelle offre et quelle issue définissent la qualification commerciale ?
- Qui est la cible, qui peut répondre et quelle preuve de rôle est nécessaire ?
- Quelles sources sont réellement accessibles, pertinentes et réutilisables ?
- Quelles populations, juridictions et règles de canal s'appliquent ?
- Quels volumes, budgets, délais de suivi et seuils de qualité sont acceptables ?

Ces questions sont des paramètres de mise en service et d'évaluation. Elles ne
bloquent pas la définition du socle générique et ne sont pas résolues fictivement
dans les profils d'exemple.


## Corpus refresh — 2026-11-01

See the [dated refresh review](README.md#corpus-refresh--2026-11-01) and
[source-by-source impact record](refresh-2026-11-01.json).

Re-read OBS-PR-005–009/015/018/020/021/027/029 against current Pipedrive, CNIL, Stripe and RNIC passages. The recorded patterns remain supported. Stripe source URLs now select official English Markdown; API-v1 key retention is limited, not indefinite deduplication. The RNIC page is metadata evidence only; its national data file was not downloaded. CNIL references remain contextual inputs to separately validated deployment policies, not blanket legal approval. Existing REQ-PR-008/014/025/030/037–040/048/050 and INV-PR-005/006/007 remain unchanged.

Baseline obligations are unchanged. Deferred follow-up: Validate actual source schemas and reuse permissions, policy populations/channels/dates, provider reconciliation after key expiry, and representative qualification evidence. Pipedrive form configuration does not establish valid marketing consent for a deployment.
