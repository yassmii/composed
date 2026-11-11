# Relecture du draft 0.1.0

21 octobre 2026. **Auto-relecture d'auteur**, sans revue indépendante ni promotion
du contrat. Le statut demeure `draft` et la recherche `initial`.

La référence de livraison `career-evidence-platform/conformance@0.1.0` désigne
le profil externe de `composed-validation`. Elle n'ajoute aucun comportement
produit ni protocole de transport au contrat. Les résultats du harness sont
distingués des résultats d'une plateforme candidate.

## Périmètre relu

15 capacités, dont 11 `must`, 2 `should` et 2 `could` ; 65 exigences, 10 invariants,
9 politiques, 8 attributs de qualité et 22 scénarios d'acceptation. Les 107 clauses
normatives couvertes par le schéma de provenance possèdent un lien vers une
observation ou un choix explicite. Les scénarios et métriques référencent les
clauses concernées ; une couverture YAML n'est pas une preuve d'exécution.

| Vérification | Conclusion et portée |
| --- | --- |
| Provenance | 18 sources publiques primaires, 21 observations. Les règles d'autorisation, le guidage sans chat obligatoire et les seuils sont signalés comme choix, sans les attribuer artificiellement aux concurrents |
| Neutralité | Aucun cloud, moteur, modèle, langage ou topologie physique exigé. Les intégrations sont décrites par fonction et dégradation |
| Cohérence du domaine | Concept, assertion et évaluation distincts ; corrections, versions et indisponibilité des sources explicites. REQ-CEP-016 précise que la provenance historique ne dispense pas d'effacer le contenu personnel concerné |
| Modules optionnels | CAP-CEP-007, 011, 012 et 013 conditionnels ; POL-CEP-006 active leurs garanties lorsqu'ils sont proposés. Pas de témoignage imposé pour le premier résultat |
| Contrôle humain | Actions directes et état durable ; invitations, divulgations et actions conséquentes approuvées ; contenu documentaire sans autorité sur les permissions |
| Observabilité de l'acceptation | Parcours, comparaisons avant/après, cas d'échec et exercices de reprise nommés. Aucun résultat d'implémentation déclaré |
| Confidentialité de la recherche | Les entretiens et décisions d'un produit particulier restent dans son cadrage privé ; aucun verbatim ou document personnel incorporé ici |

## Vérifications réalisées

- `npm run validate:contracts` : schémas, identifiants, acteurs et provenance
  valides pour l'ensemble des unités présentes, y compris cette nouvelle unité.
- Contenu des 18 sources de cette unité : empreintes des instantanés téléchargés
  vérifiées avec la fonction de normalisation du dépôt, puis récupération des
  URLs et comparaison des empreintes ; 18 correspondances, aucune divergence.
  Cette vérification de contenu était limitée à cette unité ; elle ne vaut pas
  vérification en ligne des sources des autres contrats.
- Les observations Teal et Credly restent dans le comparatif qualitatif et sont
  exclues des clauses justifiées par source YAML : leur récupération brute a été
  refusée, même si leur documentation a été lisible par l'outil de navigation.

Les validations structurelles et les empreintes contrôlent la forme et la
traçabilité documentaire. Elles ne mesurent ni l'expérience utilisateur ni la
qualité d'une future plateforme.

## Arbitrages restant ouverts

| Référence | Question à résoudre dans le produit consommateur |
| --- | --- |
| MET-CEP-001, QA-CEP-001, QA-CEP-008, POL-CEP-009 | Population, workload et confirmation ou révision des seuils de temps et réussite proposés |
| CAP-CEP-008 | Formats de restitution prioritaires, lecteurs d'export et contenu exact du premier résultat utile |
| CAP-CEP-009 | Durées, exceptions, politique d'autorisation, traitement des contributions retirées et limites de récupération |
| CAP-CEP-007, CAP-CEP-011 à 013 | Ordre d'activation, données externes effectivement disponibles et formats de justificatifs annoncés |
| CAP-CEP-015, QA-CEP-007 | Corpus représentatif, règles d'annotation, baselines et seuils par tâche avant toute affirmation de supériorité |
| Recherche | Usages concurrents à évaluer directement ; extension du panorama selon la cible choisie ; réplication des pistes académiques utiles |

Les scénarios donnent une base de conception et d'acceptation. L'implémentation
devra décomposer la preuve par exigence, qualifier les modules activés et fournir
les résultats contre une révision identifiée avant toute déclaration de conformité.
