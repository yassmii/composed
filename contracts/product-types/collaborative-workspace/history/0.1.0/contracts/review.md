# Review — version initiale

Mode : **auto-revue de l'auteur**. Le contrat demeure à l'état `draft` en attente d'une revue indépendante.

- Les quinze capacités couvrent les documents, données structurées, présentations, collaboration, permissions, historique, portabilité, automatisation, intégrations, IA, gouvernance et accessibilité. Les options ne sont pas imposées à une implémentation : elles sont désactivables par politique et restent soumises aux invariants communs.
- Chaque capacité, exigence, invariant, politique et attribut de qualité est relié à une observation de source ou marqué `explicit_project_choice`. Les garanties les plus exigeantes — absence de fuite par une surface dérivée, résolution explicite des conflits, non-répétition des effets externes indéterminés, IA sous contrôle, rétention et légal hold — sont volontairement des choix du contrat, pas des affirmations abusives sur Notion ou Airtable.
- Le contrat ne prescrit ni base de données, ni algorithme de collaboration, ni protocole API, ni fournisseur d'identité, de modèle, de stockage ou d'hébergement. Les intégrations décrivent leur finalité et leur dégradation attendue, pas une technologie à adopter.
- Les sources Notion sont la référence fonctionnelle principale. Airtable apporte le contrepoint sur l'attribution de l'historique et l'observabilité des automatisations. Toutes sont des documents officiels dont l'empreinte est enregistrée.

## Révision liberté, auto-hébergement et performance

Cette révision élargit la recherche aux alternatives : AppFlowy, AFFiNE, Docmost, Anytype et Any.

- AppFlowy et Docmost apportent des références à un cœur AGPL, à l'auto-hébergement et à la collaboration; ils ne sont pas traités comme des prescriptions d'architecture.
- AFFiNE démontre la valeur d'un espace local-first qui fusionne documents, canvas et tables, mais sa séparation de composants Enterprise montre qu'un dépôt public ne garantit pas à lui seul un produit complètement libre.
- Anytype est volontairement conservé comme contre-exemple : son client est sous licence source-available avec des limites d'usage. Il ne satisfait donc pas la définition de `free core` du contrat, même si son modèle local-first, chiffré et pair-à-pair est instructif.
- Any apporte une référence MIT à la fusion hors ligne et chiffrée, mais est explicitement une infrastructure en prévisualisation développeur, pas une dépendance ou une solution à copier.

Le contrat ajoute CAP-CWS-016 et CAP-CWS-017, REQ-CWS-060 à REQ-CWS-068, INV-CWS-011 à INV-CWS-013, POL-CWS-009 à POL-CWS-010, QA-CWS-009 à QA-CWS-012, et ACC-CWS-016 à ACC-CWS-018. Ces clauses exigent :

- un cœur intégralement libre sous licences approuvées par l'OSI pour toutes les capacités `must`;
- une installation reproductible, autonome d'un compte, d'une clé, d'un abonnement, d'un runtime propriétaire ou d'un appel sortant fournisseur obligatoire;
- un fonctionnement local-first, une synchronisation sans perte silencieuse, et une sortie réseau fermée par défaut;
- une preuve de performance reproductible avec charge, percentiles, ressources et dégradations publiés.

Les seuils de performance et la définition stricte du cœur libre sont des choix explicites de ce contrat; ils ne sont pas attribués aux produits étudiés.

## Révision Git-backed

Cette révision fait de Git l'autorité durable du produit, sans faire de Git le journal de chaque frappe.

- Decap montre qu'un éditeur peut traiter le dépôt comme autorité de contenu; TinaCMS montre que les index de requête, de recherche et de références peuvent rester reconstructibles depuis les fichiers du dépôt.
- CAP-CWS-018 et REQ-CWS-069 à REQ-CWS-074 imposent une représentation canonique du workspace dans un dépôt, des commits sémantiques attribués, la validation des modifications Git directes, des pièces jointes vérifiables par empreinte, et la reconstruction des projections.
- INV-CWS-014 et INV-CWS-015 empêchent qu'un index, un cache, une forge ou un relay devienne une seconde vérité, ou qu'une restauration réécrive silencieusement l'historique Git accessible.
- POL-CWS-011 et POL-CWS-012 séparent l'expérience temps réel (journal d'opérations) de l'historique durable et révisable (commits sémantiques). Le contrat ne prescrirait donc ni forge Git, ni protocole de synchronisation, ni moteur CRDT.

Le coût assumé est que l'effacement légal et la réécriture ciblée de l'historique ne sont toujours pas définis dans ce cœur; ils exigent l'extension de conformité déjà signalée.

## Révision sécurité : identité, authentification et sessions

Cette révision ajoute un socle de sécurité autonome au modèle Git-backed. Il ne suffit pas qu'un dépôt soit portable : un clone de dépôt, un export ou une session périmée ne doit jamais devenir un moyen d'accéder au workspace.

- CAP-CWS-019 et REQ-CWS-075 à REQ-CWS-084 définissent le cycle de vie des comptes, facteurs, appareils, sessions et méthodes de récupération. Le contrat impose un chemin d'authentification libre de tout fournisseur pour une installation auto-hébergée, un facteur à clé publique vérifiant l'utilisateur pour les propriétaires et administrateurs, ainsi que le MFA et le niveau d'assurance configurables par politique.
- Les flux d'authentification, d'enrôlement et de récupération doivent résister aux essais automatisés, au rejeu et à l'énumération. Les secrets, identifiants de session et preuves de récupération n'entrent ni dans Git, ni dans les exports, les journaux ou les événements d'audit.
- Chaque session a une durée d'inactivité et une durée absolue, peut être inspectée et terminée par l'utilisateur ou l'administrateur, et est invalidée au plus tard avant l'opération protégée suivante après révocation, suspension, expiration, récupération ou durcissement de politique.
- Les changements à fort impact — facteur, récupération, mot de passe, privilège, fédération, export, secret d'intégration et clé de chiffrement — exigent une réauthentification renforcée. La récupération est attribuée, bornée dans le temps et ne peut pas retirer silencieusement un facteur requis.
- INV-CWS-016/017, POL-CWS-013/014, QA-CWS-015/016 et ACC-CWS-021/022 rendent ces garanties testables, y compris le confinement après révocation et l'absence de secret dans les preuves.

Les exigences s'appuient sur les chapitres Authentication et Session Management d'OWASP ASVS 5.0. Les choix de produit qui vont au-delà — notamment le facteur public-key imposé pour les comptes élevés, l'indépendance d'un IdP fournisseur et la couverture exhaustive des actions sensibles — sont tracés comme choix explicites du contrat.

Points à traiter avant promotion :

- Obtenir une revue indépendante des choix de sémantique de conflit et de garantie d'atomicité sous forte concurrence.
- Décider une extension de conformité pour l'effacement légal, la résidence, l'e-discovery, la cryptographie et les règles sectorielles de conservation.
- Ajouter des sources primaires sur l'accessibilité, les clients hors ligne, les formulaires, la recherche, les cartes et les assistants IA si ces options deviennent `must`.
- Définir, dans un profil de validation d'implémentation, les jeux de données, charge de référence, mesures de latence et preuves d'accessibilité sans les figer dans ce contrat produit.
- Faire examiner juridiquement la liste des licences et dépendances d'une implémentation avant de revendiquer le statut de `free core`; cette revue ne remplace pas un avis juridique.
- Faire réaliser une revue de sécurité indépendante (menaces d'authentification, récupération, sessions, fédération, appareils et secrets) avant de faire passer le contrat de `draft` à un statut approuvé.
