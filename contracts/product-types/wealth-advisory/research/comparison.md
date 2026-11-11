# Recherche initiale et décisions de conception

État au 4 novembre 2026. Recherche `initial`, sans essai des produits comparés.
La demande confirmée est un parcours de conseil patrimonial complet pour un
gestionnaire de patrimoine en France, préconisations et suivi compris. La LCB-FT
et le gel des avoirs sont réservés à une évolution ultérieure.

## Questions et périmètre de recherche

Quelles informations relier au bilan ? Comment distinguer inventaire, scénario et
conseil ? Quelles traces rendent une recommandation et son suivi réexaminables ?
Sources retenues : documentation primaire de trois produits, AMF et CNIL, avec
lecture complémentaire de la recommandation ACPR. Première passe bornée à ces
sources et aux questions de conseil ; aucune collecte de dossier client ni achat.
Avant promotion, compléter les sources réglementaires par domaine et obtenir une
revue métier. Actualiser les références lors d'un changement signalé, avant une
adoption en production ou l'ajout d'un domaine ; pas de rafraîchissement automatique
susceptible de changer le contrat sans décision et versionnement.

## Comparables documentés

| Produit et source primaire | Observation permise | Limite et choix du contrat |
| --- | --- | --- |
| [Harvest Big](https://www.harvest.fr/produit/big/) | Études patrimoniales, simulations et rapports. | Présentation d'éditeur, pas une preuve d'exactitude ni de bénéfice comparatif. |
| [Big, saisie guidée](https://big-help.harvest.fr/changelog/23-04-2026-ouverture-de-la-saisie-guidee-pour-creer-vos-dossiers-avec-un-veritable-guide-dentretien-client/) | Parcours de recueil personnel/familial, inventaire et budget, puis récapitulatif. | Le titre affiche le 27/04/2026 et l'URL le 23/04. Ses raccourcis fiscaux et son nombre de champs ne sont pas repris comme règles universelles. |
| [RightCapital, Balance Sheet](https://help.rightcapital.com/module-overview/client-portal/dashboard/balance-sheet) | Actifs/passifs/net, détail par propriétaire, dates et historique. | La taxonomie américaine et les règles de trusts ne sont pas transposées au droit français. |
| [MoneyGuide, FAQ](https://www.moneyguidepro.com/ifa/home/faqs) | Plans articulés aux objectifs et au risque. | La méthode et les modèles de projection ne sont pas importés ; aucun résultat de performance vérifié. |

La convergence documentaire porte sur le recueil structuré, l'état patrimonial,
les objectifs, les projections et la restitution. Les règles précises de quote-part,
non-double-compte, inconnues, calcul et validation sont des choix explicités dans
la traçabilité ; elles ne sont pas présentées comme des garanties observées dans
tous ces produits. Une seule page fournisseur ne suffit pas à conclure à une pratique
universelle ou à la meilleure expérience utilisateur.

## Sources françaises et frontières

- [AMF, information sur les CIF](https://www.amf-france.org/fr/espace-epargnants/savoir-bien-investir/choisir-un-professionnel/conseillers-en-investissements-financiers) : distinguer l'activité et le recueil préalables à un conseil financier. Page pédagogique, pas inventaire juridique complet.
- [Règlement général AMF](https://www.amf-france.org/fr/eli), version affichée au 11/09/2026, article 325-17 : motivation de l'adéquation et, pour le service d'évaluation périodique, examen au moins annuel, accru selon risque et instruments. Ce rythme ne devient pas celui de tous les conseils patrimoniaux.
- [CNIL, principes](https://www.cnil.fr/fr/cnil-direct/question/quels-sont-les-grands-principes-des-regles-de-protection-des-donnees) : finalité, proportionnalité, conservation, confidentialité et droits. Les durées et bases applicables au cabinet doivent être qualifiées séparément.
- [ACPR, recommandation 2024-R-03](https://acpr.banque-france.fr/system/files/2024-12/20241022_recommandation_2024-R-03_0.pdf), consultée par navigation : contexte assurance, motivation et suivi différencié. La récupération brute depuis le vérificateur local est refusée en HTTP 403 ; **aucune empreinte PDF n'est inventée**, ni observation structurée prétendument scellée. Cette limite doit être levée pour la provenance complète du domaine assurance avant promotion. Une recommandation de l'autorité n'est pas assimilée indistinctement à une obligation législative.

La [position AMF DOC-2013-02](https://www.amf-france.org/fr/reglementation/doctrine/doc-2013-02)
a été retrouvée lors de la première recherche. Sa page indique la fin d'applicabilité
après le 11 octobre 2022. Sa référence et l'observation de cette limite sont conservées
pour éviter sa réutilisation comme texte actuel ; **aucune clause normative n'en est dérivée**.

Les huit empreintes de `sources.yaml` identifient les octets effectivement récupérés
le 4 novembre, pas des versions officielles immuables. Les corps tiers restent dans
un répertoire temporaire hors dépôt ; aucun article ni PDF complet n'est redistribué.
Une page dynamique peut changer d'empreinte sans changement métier. Une nouvelle
différence demande examen, pas remplacement automatique d'une décision produit.

## Arbitrages proposés, non encore approuvés comme politiques métier

1. Commencer par les personnes physiques et groupes nommés ; les sociétés peuvent
   être des entités de détention sans ouvrir implicitement leur conseil autonome.
2. Rendre les domaines couverts explicites ; une simulation générique n'autorise pas
   à annoncer un moteur fiscal ou successoral complet.
3. Permettre un bilan partiel, mais refuser la validation d'un conseil si une information
   nécessaire manque ou si une incompatibilité demeure.
4. Conserver la révision remise pendant la durée autorisée, sans écraser l'avis précédent
   et sans faire obstacle aux rectifications ou suppressions légitimes.
5. Exiger une décision humaine sur le conseil ; ne pas rendre l'IA nécessaire au parcours.

Restent à qualifier : statuts du cabinet cible, modèles et situations prioritaires,
conditions exactes de conseil indépendant/non indépendant, coûts et durées de
conservation applicables, périmètre des données, contraintes d'exploitation et
retours d'un gestionnaire sur les rapports. Les observations documentaires ne sont
pas des entretiens ni une validation utilisateur.
