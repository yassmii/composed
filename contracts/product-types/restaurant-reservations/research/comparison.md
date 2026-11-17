# Recherche concurrentielle — réservation de restaurants

Date de consultation : **17 novembre 2026**. Recherche documentaire initiale sur sources primaires, sans accès aux espaces privés, démonstration ni entretiens. Les fonctions ci-dessous sont documentées par les éditeurs, pas mesurées en utilisation. Les assertions d'efficacité commerciale des éditeurs ne sont pas reprises comme résultats prouvés.

## Comparaison

| Produit | Positionnement et faits documentés | Modèle commercial observé | Conséquence pour notre produit |
| --- | --- | --- | --- |
| **Zenchef** | Réservation directe, gestion des tables et attente ; fonctions clients et multi-sites selon formule. | La page affiche Reserve 129, Manage 169 et Grow 249 EUR/mois, avec zéro commission par couvert. Fréquence choisie, taxes, frais annexes et promotion à confirmer. | Concurrent de référence. Le cahier de réservation seul et le « sans commission » ne suffisent pas à distinguer une offre. [Source](https://www.zenchef.com/fr/formules) |
| **TheFork Manager** | Outil de gestion associé à des canaux d'acquisition ; module direct personnalisable et gestion des tables. | Réservations site/réseaux sociaux incluses ; apport TheFork/Tripadvisor/partenaires soumis à commission liée au ticket moyen. Garantie et prépaiement dépendent de la formule. | Séparer réservation directe et acquisition payante ; ne pas présenter toutes les réservations TheFork comme commissionnées. [Fonctions](https://www.theforkmanager.com/fr/application-gestion-reservation-restaurant), [tarification](https://www.theforkmanager.com/fr/logiciel-restauration-prix) |
| **SevenRooms** | Réservation directe, liste d'attente et enrichissement du CRM depuis la réservation. | La page présente les réservations directes sans frais par couvert ; aucun montant d'abonnement vérifié dans le corpus. | Une offre sans commission et un fichier client ne sont pas des nouveautés. Le CRM poussé est reporté pour garder un périmètre initial maîtrisable. [Source](https://sevenrooms.com/platform/reservations-waitlist/) |
| **OpenTable** | Contrôle du rythme des arrivées et règles pour grands groupes et moments du service. | La page Plans consultée présente une tarification américaine par offre et des frais selon canal ; aucune extrapolation tarifaire à la France. | La capacité doit modéliser aussi le flux d'arrivées, pas uniquement un nombre total de places. [Capacité](https://www.opentable.com/restaurant-solutions/products/features/availability-controls/), [plans US](https://www.opentable.com/restaurant-solutions/plans/) |

Une fonction absente de ce tableau n'est pas réputée absente du produit. Les offres et droits d'intégration varient par marché et formule ; un logo partenaire ne démontre pas l'accès à une API pour une nouvelle application.

## Convergences et différences

**Socle concurrentiel documenté :** réservation directe, conduite du service et gestion de capacité sont des fonctions de référence. Attente et fichier client apparaissent chez plusieurs éditeurs. Les observations atomiques sont enregistrées dans [observations.yaml](observations.yaml).

**Différences à préserver :** un réseau qui apporte des clients et un outil qui traite le trafic propre du restaurant n'ont pas la même valeur économique. Une garantie de carte, un acompte et un prépaiement n'ont pas le même cycle de vie. Le contrat choisit le trafic direct et la garantie optionnelle ; il ne cherche pas à unifier ces modèles.

La [documentation Zenchef sur le compte à rebours](https://help.zenchef.com/hc/fr/articles/14116285091997-Compte-%C3%A0-rebours-Empreinte-bancaire) indique une réservation temporaire de dix minutes, qui réduit la disponibilité et se confirme si la garantie est fournie à temps. Cette page a été lisible via le navigateur de recherche, mais la récupération directe pour empreinte a échoué. Elle reste une indication complémentaire : notre durée de dix minutes et nos règles de concurrence sont étiquetées **choix de projet**, pas convergence prouvée.

## Décision de cadrage

**Problème supposé :** pendant le service, une équipe doit transformer des demandes venant de plusieurs situations en un planning fiable, accueillir les clients et réagir aux annulations sans ressaisie ou promesse incompatible. La recherche éditeur montre l'existence du marché ; elle ne démontre ni l'intensité du problème ni une insatisfaction envers Zenchef.

| Option | Intérêt | Coût / risque | Décision |
| --- | --- | --- | --- |
| Reproduire toute la suite Zenchef | Large couverture commerciale | Développement étendu, différenciation faible, multiples dépendances | Non retenue pour la première version |
| Outil direct et salle pour indépendants | Périmètre utile à un pilote, valeur observable pendant le service | Doit démontrer une meilleure adoption ; n'apporte pas lui-même de trafic | **Recommandée** |
| Marketplace client avec acquisition | Potentiel d'apport de nouveaux clients | Double acquisition restaurateurs/clients, effets de réseau et coût commercial | Reportée |

**Hypothèse de différenciation proposée :** migration explicite, démarrage en moins de 45 minutes et usage simple en service, avec règles de disponibilité et incidents compréhensibles. Aucun résultat ne prouve à ce stade que les concurrents échouent sur ces dimensions.

Le compromis est de renoncer au trafic d'une marketplace, au CRM avancé et aux canaux partenaires dans le MVP. Avant une commercialisation large, vérifier si l'absence de Google Reserve ou d'un connecteur caisse bloque réellement les restaurateurs ciblés. Si oui, recadrer le périmètre par une extension, sans promettre un connecteur non accessible.

## Confidentialité et paiements

La [CNIL](https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique) décrit le consentement préalable à la prospection électronique et des exceptions encadrées. Le MVP exclut toute campagne et toute assimilation de la réservation à un opt-in. Les durées proposées dans POL-PRIVACY sont des choix du projet à faire revoir ; la page CNIL citée ne justifie pas ces durées et ne constitue pas une analyse de conformité complète.

Le fournisseur de garantie reste à sélectionner. Vérifier durée de validité, moyens de paiement, authentification client, frais, traitement des prélèvements hors session, litiges et libération des garanties. Aucune compatibilité fournisseur n'est présumée. Un prestataire incapable de tenir les règles du contrat nécessite une décision produit explicite.

## Provenance, limites et actualisation

- **6 sources récupérées directement**, dont 5 pages éditeurs et 1 page CNIL ; SHA-256 calculés sur les octets reçus, pas inventés depuis des extraits de recherche. Corps conservés temporairement hors dépôt, sans republication de pages tierces.
- **14 observations atomiques**, liées aux clauses via [traceability.yaml](../contracts/traceability.yaml). Les détails non documentés — transitions, atomicité, seuils, durées et preuves — sont signalés comme choix de projet.
- Deux consultations complémentaires sans empreinte directe : l'article Zenchef cité et OpenTable Plans. Elles ne constituent pas la base normative de clauses ni une récupération intégrale certifiée.
- Pages SaaS non versionnées. Une empreinte fige les octets observés ; elle ne garantit pas que la page restera identique. Une modification de HTML n'est pas nécessairement une modification produit.
- Aucun benchmark de performance, test d'accessibilité concurrent, entretien, devis français complet ou vérification d'API partenaire n'a été effectué.

Questions pour la prochaine passe : où les équipes perdent-elles réellement du temps ? Quelle part des réservations dépend de Google ou d'une marketplace ? Qui accepte de migrer, à quel prix, et sous quelles garanties de reprise ? Quels services ont besoin de protection contre les absences ?

Plan proposé : 5 entretiens de 45 minutes avec restaurateurs indépendants, observation de 2 services avec leur accord, puis pilote défini par les métriques du contrat. Ces actions ne sont pas encore réalisées. Ne collecter aucune donnée client réelle dans le dépôt de recherche.

Actualiser les pages officielles avant engagement commercial et avant chaque extension majeure, puis trimestriellement ; budget indicatif d'une demi-journée par passe. Conserver l'ancien relevé, noter les observations affectées et proposer les changements selon `contracts/docs/continuous-evolution.md`. Une nouveauté concurrente ne modifie pas automatiquement ce contrat.
