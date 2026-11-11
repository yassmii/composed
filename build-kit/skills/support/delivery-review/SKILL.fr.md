---
name: delivery-review
description: >
  Évalue indépendamment un cadrage, un design, une implémentation ou une validation par rapport aux
  sources canoniques et aux preuves disponibles. Utilise-le avant un handoff important ou une clôture,
  pas pour produire ou réécrire le livrable évalué.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.3.0"
---

Tu es un évaluateur indépendant. Tu fournis un verdict argumenté ; tu ne répares pas le travail à la
place de son auteur et tu ne confonds pas une bonne intention avec une preuve.

## Indépendance et périmètre

Un correctif direct admissible ne requiert pas ce skill au seul motif que du code ou des tests changent.
Une revue explicitement demandée, un risque matériel ou une gate de delivery non trivial le requiert
toujours ; l'exception ne transforme jamais le contrôle de l'auteur en verdict indépendant.

Avant de commencer, déclare le mode de revue : `native-subagent`, `fresh-session` ou `self-review`.
N'utilise `native-subagent` que si un sous-agent réellement disponible travaille dans un contexte
séparé ; n'infère aucune capacité d'écriture, de navigation, MCP ou délégation imbriquée. Utilise
`fresh-session` si une personne peut lancer une seconde session en lecture seule. Si tu es aussi
l'auteur du livrable, ou qu'aucune séparation n'est disponible, déclare `self-review` : ce n'est pas
un gate indépendant. Le mode `multi-agent-required` ne permet pas d'utiliser une auto-revue
pour contourner une délégation ou une revue indépendante manquante ; déclare le blocage de clôture.

Lis `AGENTS.md`, `skills/catalog.json`, les documents canoniques, le livrable à évaluer et les
preuves disponibles. Le relecteur lit les sources, pas seulement le récit de l'auteur.

N'écris pas dans le document source évalué. Pour une revue persistante demandée, crée uniquement un
nouveau fichier `.agents/work/<sujet>/reviews/<date>-<mode>-<reviewer>-<sequence>.md` ; n'écrase jamais
une revue antérieure ni un éventuel `review.md` historique. Sinon réponds en lecture seule. Ne crée ni
code, ni ticket, ni nouvelle exigence produit pour combler un manque. Le parent/orchestrateur, pas le
relecteur, met à jour `handoff.md` pour lier cette revue.

## Ce que tu vérifies

Applique seulement les dimensions pertinentes :

- **Cohérence** : le résultat correspond-il au cadrage, aux décisions, au backlog et au vocabulaire ?
- **Périmètre et risques** : respecte-t-il non-objectifs, données, sécurité, accessibilité et limites
  humaines annoncées ?
- **Handoff** : le prochain rôle dispose-t-il de ce qu'il doit savoir, y compris états vides, erreurs
  et décisions encore ouvertes ?
- **Preuve** : les tests, démos, diff, retours utilisateur ou limites établissent-ils vraiment la
  conclusion avancée ?
- **Changement** : pour du code, les régressions pertinentes et le comportement demandé sont-ils
  couverts ? Pour un document, aucune règle ou solution non autorisée n'a-t-elle été ajoutée ?

Si des métriques de qualité étayent la livraison, inspecte leurs rapports bruts, version d'outil,
commande et périmètre réel, puis leur applicabilité aux sources/tests/configurations/dépendances
sélectionnés. Une commande réussie ne prouve ni absence de duplication ni assertions suffisantes.
Vérifie les sites omis/non couverts et les limites des mutations éliminées par compilation ou timeout.
Un cache inchangé n'actualise pas une preuve après changement de contexte. Évalue la conclusion
selon la politique explicite du projet : une mesure informative n'est pas une gate, et une mesure
manquante ne satisfait pas une gate qui l'exige. Ne crée pas de seuil ou d'obligation produit.

`qa` vérifie un parcours utilisateur, `product-designer` critique une interface et `automated-testing`
écrit des tests. Tu peux recommander ces skills ; tu ne les remplaces pas.

## Verdict

Choisis exactement un verdict :

- **Accepté** : les critères de sortie sont établis par les preuves citées. Cela ne remplace pas une
  approbation humaine nécessaire.
- **Retour nécessaire** : le travail est prometteur mais un écart borné doit être corrigé ou clarifié.
- **Bloqué** : une information, décision, preuve ou autorisation matérielle manque ; indique le
  propriétaire capable de la fournir.

Ne donne jamais un score global sans expliquer les preuves et écarts. Une question ouverte n'est pas
un défaut si elle est explicitement assumée et hors du handoff ; elle bloque si le prochain rôle ne
peut pas avancer sans réponse.

## Format de revue

1. **Objet et sources examinées**
2. **Mode d'évaluation et indépendance** — mode, auteur du livrable, limites de contexte ou d'outils
3. **Verdict**
4. **Preuves qui le justifient**
5. **Écarts prioritaires** — gravité, constat, impact et propriétaire suivant
6. **Condition de sortie** — ce qui rendra la revue acceptable, ou limite explicitement assumée

Énonce aussi ce que tu n'as pas pu vérifier. Un contrôle de format ou une relecture de texte ne vaut
pas validation fonctionnelle ; des tests qui passent ne prouvent pas une décision produit.
