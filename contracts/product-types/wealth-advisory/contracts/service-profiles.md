# Profils de mission, de service et de modèle

Ce document explique les paramètres évoqués par le [contrat](contract.yaml).
Il ne définit ni schéma technique obligatoire, ni règle cachée supplémentaire.
Les identifiants normatifs restent ceux du YAML.

## Mission et service

`REQ-WAD-001/002/005/017/019/024` demandent de pouvoir identifier :

| Information | Question à résoudre dans une mise en œuvre |
| --- | --- |
| Professionnel responsable | Qui conseille, dans quels statuts et habilitations déclarés, pour quel cabinet ? |
| Périmètre | Quelles personnes, juridictions, analyses et opérations de conseil sont incluses ? |
| Domaine et service | Diagnostic, investissement financier, assurance, fiscalité, transmission, retraite ou immobilier ; quel service précis est rendu ? |
| Conditions de validation | Quelles réponses et pièces sont pertinentes, quelles incohérences sont bloquantes, selon quelle règle datée ? |
| Rémunération | Quels frais et liens d'intérêt sont présentés ; conseil indépendant ou non indépendant lorsque cette distinction s'applique ? |
| Suivi | Quelle obligation ou convention fixe le déclencheur, le point de départ, la fréquence et les délais ; quelle version de cette règle ? |

Le domaine financier et celui de l'assurance ne partagent pas une attestation
universelle. Le contrat prévoit les deux parcours, avec les données et contrôles
qui leur sont propres. Un profil ne peut pas supprimer une exigence du contrat,
faire passer un champ inconnu pour renseigné ou déclarer adéquat un produit
incompatible. Il sert à préciser la portée du conseil effectivement couvert.

La périodicité minimale annuelle prévue pour une évaluation périodique CIF est
conditionnelle à ce service. Une obligation plus fréquente applicable prime sur
la règle du cabinet. Pour l'assurance et les autres domaines, les règles et leurs
transitions doivent être vérifiées séparément ; aucune durée universelle n'est déduite.

Le cadre de traitement des données distingue les rôles, finalités, catégories,
personnes concernées, destinataires, conservations actives/restreintes et suppressions
autorisées (`REQ-WAD-026` à `029`). On ne fixe pas « cinq ans pour tout » par convention.

## Modèle de calcul

`REQ-WAD-009/010/013/014/015` et `QA-WAD-001` demandent de retrouver les conventions :

- devises, taux de change, dates de valeur et règle de fraîcheur ;
- droits de détention, quotes-parts économiques et imputation distincte des dettes ;
- traitement des enveloppes et sous-jacents pour éviter les doubles comptes ;
- périodes, flux, règles d'arrondi et méthode de calcul ;
- hypothèses et prise en compte ou exclusion de l'inflation, des frais et impôts ;
- situations et périodes couvertes par les modèles spécialisés, sources et références revues.

Un modèle pédagogique composé annuel à 2 % peut éprouver la comparaison de
scénarios ; il ne prouve pas un calcul de fiscalité d'assurance-vie, de succession
ou de retraite. Ceux-ci ont besoin de leurs propres références et de leur revue.
Les cas numériques du contrat sont des situations synthétiques sans données privées.

## Capacités nécessaires à une future implémentation

| Clauses | Compétences à mobiliser, fournies ou externes |
| --- | --- |
| Mission, découverte et diagnostic (`REQ-WAD-001` à `012`) | Expertise patrimoniale française ; cadrage produit ; conception du recueil. |
| Scénarios et préconisations (`013` à `019`) | Ingénierie des calculs ; tests indépendants ; expertise fiscale, successorale ou assurance selon les modèles couverts. |
| Validation, remise et suivi (`020` à `025`) | Conception des parcours ; gestion des versions et autorisations ; recette métier. |
| Données et continuité (`026` à `029`) | Sécurité, protection des données, migrations et restauration contrôlée. |

Les skills généralistes du Build Kit peuvent aider à livrer et vérifier le logiciel.
Ils ne remplacent pas une expertise patrimoniale, réglementaire, fiscale ou successorale.
Cette capacité métier n'est pas fournie par le kit ; elle reste à identifier avant
validation des modèles et adoption réelle. Aucun plan technique ni choix de stack
n'est décidé par cette table.
