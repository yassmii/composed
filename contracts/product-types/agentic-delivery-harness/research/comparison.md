# Comparaison et décisions de conception

Recherche documentaire du 24 octobre 2026. Les révisions et empreintes sont dans
[sources.yaml](sources.yaml), les constats dans [observations.yaml](observations.yaml).
Il ne s'agit pas d'un benchmark d'efficacité ; les périmètres des outils diffèrent.

| Référence | Constat limité | Conséquence proposée |
| --- | --- | --- |
| [Agent Skills](https://agentskills.io/specification), OBS-ADH-001/016 | Format et chargement progressif de compétences. | Compétences composables, sans imposer ce format au produit. |
| [Matt Pocock](https://github.com/mattpocock/skills/tree/5beb35b040e3de97e54fa9e386d7e42d15c295c2), OBS-ADH-002/003 | Petits skills, configuration et questionnement préalable. | Contrôle utilisateur et adoption proportionnée. |
| [Superpowers](https://github.com/obra/superpowers/tree/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b), OBS-ADH-004/005 | Conception, plan et développement délégué avec revue. | Le multi-agent et les gates ne suffisent pas à établir une différenciation. |
| [Spec Kit](https://github.com/github/spec-kit/tree/67e0f7294e6e728ab60bf7b4590deb470448bc2d), OBS-ADH-006 | Processus et extensions, dont événements. | Séparer processus et intégrations sans multiplier les phases. |
| [ECC](https://github.com/affaan-m/ECC/tree/90606c8315ee09cafc303515c5f33024db6b9882), OBS-ADH-007/008 | Précontrôle bloquant et diagnostic après édition ont des effets différents. | Qualifier et tester chaque garantie. |
| [Évaluation ECC](https://github.com/affaan-m/ECC/tree/90606c8315ee09cafc303515c5f33024db6b9882/docker/gateguard-effectiveness), OBS-ADH-009/010/015 | Essais comportementaux, contre-exemples et empreintes. | Tester résultats et juge, publier coûts et limites. |
| [Apprentissage ECC](https://github.com/affaan-m/ECC/blob/90606c8315ee09cafc303515c5f33024db6b9882/skills/continuous-learning-v2/SKILL.md), OBS-ADH-011 | Règles apprises avec portée projet et promotion. | Ne pas généraliser automatiquement une préférence locale. |
| [Contract-first ECC](https://github.com/affaan-m/ECC/blob/90606c8315ee09cafc303515c5f33024db6b9882/skills/contract-first/SKILL.md), OBS-ADH-012 | Vérification d'interfaces consommateurs/fournisseurs. | Distinguer contrat produit, interface et preuve de delivery. |
| [W3C PROV-O](https://www.w3.org/TR/2013/REC-prov-o-20130430/), OBS-ADH-014 | Attribution, dérivation et invalidation. | Provenance du graphe sans imposer RDF, OWL ou un stockage. |

## Arbitrages explicites

La politique native obligatoire pour certaines tâches dans Composed 0.5.1 reste
un choix de cette implémentation. Le contrat générique exige une délégation réelle
lorsqu'elle est requise ou revendiquée, sans nombre ni fournisseur fixe pour toute
tâche. Un document ne suffit pas à démontrer la conformité de la baseline.

Les sources n'établissent pas une boucle complète recherche, graphe, évaluation
interprojets, correction et livraison. Ce découpage est un choix explicite :
modulaire, sous l'autorité des projets, à évaluer avant toute revendication de
bénéfice. Un graphe matérialisé reste à concevoir ; le modèle logique ne sélectionne
pas d'infrastructure. Seuils, portée et frontières d'autorité sont des choix de
ce contrat, identifiés dans la traçabilité.

## Questions ouvertes

- Quels cas indépendants isolent l'effet de la méthode de celui du modèle ?
- Quelles garanties chaque runtime/version/mode impose-t-il réellement ?
- Quel coût de coordination est acceptable par catégorie de travail ?
- Quelles requêtes justifient un index partagé au-delà des fichiers ?
- Quelles mesures expliquent un échec sans exporter les données du projet ?
- Comment distinguer fraîcheur d'une source et valeur d'une exigence ?

Ces questions alimentent la [recherche continue](../../../docs/continuous-evolution.md),
sans mandat implicite de collecte, d'infrastructure ou de déploiement.


## Corpus refresh — 2026-11-01

The changed Claude hooks reference still distinguishes before/after-tool events and task/subagent decision powers (OBS-ADH-013). New notes record that FileChanged is after-effect and that internal agents can produce SubagentStop. These limit what a hook log can prove. REQ-ADH-009/022 and POL-ADH-003 already require actual runtime capability evidence; no new mandatory clause is introduced.

Exercise native prevention bypasses, errors, timeouts and internal-agent controls on identified runtimes; compare newer upstream pins and evaluate costs independently. The pinned Build Kit 0.5.1 retrofit is historical and is not refreshed or certified by this pass.

See the [source-by-source record](refresh-2026-11-01.json) and [original manifest](history/sources-before-refresh-2026-11-01.yaml). Owner: repository agent; decision authority: Composed maintainer. This manual bounded corpus update does not survey newer upstream pins, change normative bytes, promote research maturity or execute product cases. Historical body differences remain unknown. The deeper pass is deferred.
