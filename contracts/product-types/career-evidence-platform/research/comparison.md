# Parcours documenté : comparaison et décisions proposées

Recherche initiale au 21 octobre 2026. Documentation publique primaire ; aucune
souscription ni évaluation comparative des applications en conditions réelles.
Les fonctionnalités annoncées sont distinguées des résultats démontrés.

## Produits comparés

| Référence et catégorie | Ce que la source permet d'observer | Apport au contrat | Limite ou différence de finalité |
| --- | --- | --- | --- |
| [Europass](https://europass.europa.eu/en/faq?page=2), dossier personnel | Profil, bibliothèque de documents, progression dans la durée, partage de sections sélectionnées avec expiration et suppression du lien | Parcours évolutif, partage borné, contrôle par la personne | La page ne démontre pas un résolveur de compétences avec provenance complète des inférences |
| [Teal, réimport](https://help.tealhq.com/en/articles/9457681-re-import-or-overwrite-your-resume-data), CV personnel | Le guide distingue ajout et remplacement ; un réimport peut créer des doublons à nettoyer | Prévoir explicitement doublons, réconciliation et conséquences des changements | Observation qualitative seulement, hors provenance YAML : récupération brute refusée. Le [guide d'export](https://help.tealhq.com/en/articles/9519151-export-your-resume-cover-letter) et la [page commerciale](https://www.tealhq.com/tools/resume-builder) divergent sur les formats ; aucun format n'est imposé à partir de cette information |
| [FutureFit AI](https://www.futurefit.ai/solutions-use-case/career-navigation), navigation professionnelle | Career Passport et parcours vers métiers, apprentissage et accompagnement annoncés | Relier une interprétation à une prochaine action choisie | Offre achetée par des organisations ; efficacité et transférabilité au dossier individuel non établies ici |
| [Career Copilot](https://careercopilot.ai/), accompagnement conversationnel | Conseil contextualisé annoncé, offre indiquée en bêta privée | Étudier la conversation comme mode de guidage | Ne prouve pas qu'un chatbot simplifie l'usage ; ne justifie pas de rendre le chat obligatoire |
| [Fuel50](https://fuel50.com/products/skills-ontology), compétences en entreprise | Ontologie entretenue humainement, descripteurs de maîtrise, actions de développement annoncés | Gouverner les concepts et préciser ce qu'un niveau mesure | Un référentiel d'entreprise ne constitue pas une preuve de maîtrise individuelle |
| [Xref](https://www.xref.com/solutions/reference-checking), références | Répondants proposés par le candidat, questionnaires, suivi et rapports | Demande ciblée et états distincts de réponse | Finalité employeur ; [absence de garantie absolue d'identité ou de véracité](https://www.xref.com/blog/general-faqs-about-reference-checking) explicitement reconnue |
| [Credly, evidence](https://credlyissuer.zendesk.com/hc/en-us/articles/360027938551-Evidence), badges émis | Pièces justificatives attachées à un badge, visibilité publique ou privée décrite | Distinguer justificatif d'émetteur, preuve et permission de divulguer | Source qualitative hors provenance YAML, récupération brute refusée ; ne démontre pas la maîtrise d'une compétence extraite d'un CV |

Les produits couvrent des segments voisins. Aucun élément consulté ne démontre
qu'un seul réunit le parcours longitudinal, la correction de provenance,
l'accompagnement, les témoignages et le contrôle de divulgation recherchés. Cela
délimite la recherche ; cela ne prouve pas une absence de concurrent sur le marché.

## Convergences limitées et choix explicites

L'organisation du parcours et sa restitution se retrouvent chez Europass et dans
le Career Passport annoncé par FutureFit. Le contrôle de partage est documenté
chez Europass et dans les standards de dossiers d'apprentissage. Les compétences
et la progression vers une action sont abordées par plusieurs offres, avec des
modèles de propriété et des publics différents.

Le contrat propose des choix plus précis : premier résultat sans collecte
exhaustive, actions directes accessibles, chat facultatif, conservation des
corrections humaines, absence de recrutement forcé des référents et séparation
entre crédits de calcul et qualité du profil. Ces choix sont indiqués dans
`traceability.yaml`. Ils ne sont pas présentés comme un consensus commercial.

## Standards et contraintes d'intégration

| Référence primaire | Utilité | Ce qu'elle n'établit pas |
| --- | --- | --- |
| [W3C PROV-O](https://www.w3.org/TR/2013/REC-prov-o-20130430/) | Dérivation, attribution, révision et invalidation distinctes | Aucune obligation de choisir RDF ou un moteur de graphe |
| [W3C SKOS](https://www.w3.org/TR/2009/REC-skos-reference-20090818/) | Différence sémantique entre rapprochements exacts, proches, hiérarchiques et associés | Une proximité vectorielle n'établit pas une équivalence |
| [ESCO local API](https://esco.ec.europa.eu/en/use-esco/use-esco-services-api/esco-local-api) | Référentiel distribué par version, usage local possible | ESCO ne devient pas l'identité canonique de chaque compétence interne |
| [W3C VC 2.0](https://www.w3.org/TR/2025/REC-vc-data-model-2.0-20250515/) et [1EdTech CLR](https://www.1edtech.org/standards/clr) | Conserver émetteur, sujet, réalisation, statut et justificatifs dans des échanges déclarés | Vérifier l'origine d'une déclaration ne prouve pas sa vérité ; cette recherche n'atteste aucune conformité de format de l'application |
| [LinkedIn OIDC](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2) et [Connections API](https://learn.microsoft.com/en-us/linkedin/shared/integrations/people/connections-api) | Connexion membre et accès au réseau sont des capacités distinctes ; l'accès aux contacts est restreint aux développeurs approuvés | La connexion ne vérifie pas l'identité réelle et n'autorise pas librement l'import de contacts |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Critères vérifiables d'accessibilité | Un graphe ou une conversation seuls ne prouvent pas l'accessibilité des parcours |

## Recherche récente et ambition SOTA

La recherche identifie des candidats méthodologiques, sans conclure à leur
supériorité sur des parcours réels francophones :

- [SkillSpan, NAACL 2022](https://aclanthology.org/2022.naacl-main.366/) : extraction
  sur offres d'emploi anglophones annotées ; intérêt d'une évaluation séparée de
  l'extraction et de l'adaptation au domaine.
- [CareerBERT, mars 2025](https://arxiv.org/abs/2503.02056) : rapprochement de CV
  et métiers ESCO par embeddings. La proximité professionnelle reste distincte
  de la vérité documentaire.
- [ESCO/EQF linking, décembre 2025](https://arxiv.org/abs/2512.03195) : prépublication
  comparant sentence linking, entity linking et modèles génératifs sur du texte
  d'offres d'emploi. Abstract consulté ; pas de reproduction des expériences.
- [Career-aware RAG, mai 2026](https://arxiv.org/abs/2605.05257) : prépublication
  d'un pilote sur un candidat et neuf offres ; gains et régressions selon la
  pertinence de l'historique. Abstract consulté ; cette étude ne justifie ni une
  promesse générale de performance ni une architecture obligatoire.

Le protocole proposé pour une implémentation est de comparer une référence
simple lexicale, une recherche dense, une recherche hybride avec classement,
puis l'apport éventuel de relations explicites du graphe. Toutes reçoivent le
même corpus autorisé et les mêmes questions. La construction et la maintenance
des index sont incluses dans les coûts. Le graphe conceptuel métier reste utile
même si un moteur de graphe séparé n'améliore pas la recherche.

L'évaluation doit séparer extraction, résolution de concepts, réconciliation
temporelle, ancrage des sorties et utilité des suggestions. Elle publie les erreurs,
les abstentions, la latence et le coût, avec un jeu tenu à l'écart du réglage.
Des annotations représentatives des langues, métiers et documents ciblés sont
nécessaires. Un score d'adéquation de CV, une distance vectorielle et un retour
humain sur une orientation ne sont pas interchangeables.

## Limites et suites de recherche

Les pages commerciales ne fournissent pas de comparaison indépendante. Le corpus
public ne valide ni le seuil de première valeur en quinze minutes, ni une
politique de conservation, ni un format de sortie prioritaire. Ces éléments sont
des décisions proposées. Il reste à évaluer les parcours concurrentiels en usage,
à élargir les références selon la cible retenue et à constituer le corpus métier.

Les dix-huit sources du YAML ont une empreinte de contenu normalisé ; les
observations qualitatives Teal et Credly sont signalées séparément. Une empreinte
identifie un instantané consulté, pas une preuve d'efficacité, de complétude ou de
stabilité future de la page. Cette synthèse soutient un contrat initial révisable,
sans prétendre constituer une revue systématique exhaustive de l'état de l'art.


## Corpus refresh — 2026-11-01

See the [dated refresh review](README.md#corpus-refresh--2026-11-01) and
[source-by-source impact record](refresh-2026-11-01.json).

The current SkillSpan publisher abstract still supports English expert-labelled extraction and domain adaptation (OBS-CEP-018). The two arXiv abstracts retain their stated submission dates and narrow evaluation populations (OBS-CEP-020/021). They support evaluation questions, not reproduced results or general career advice. CAP-CEP-015, REQ-CEP-063/064 and QA-CEP-007 remain appropriate local obligations; no model, database or performance threshold is adopted.

Baseline obligations are unchanged. Deferred follow-up: Use version-pinned full papers, representative authorised French/multilingual corpora, separate extraction/linking/grounding measures and held-out baselines. Abstract re-reading is not a systematic literature update or independent reproduction.
