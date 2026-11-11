---
name: systematic-debugging
description: >
  Diagnostique les échecs reproductibles ou intermittents avant de modifier le code. USE THIS SKILL
  pour les pannes inexpliquées applicatives, de build, test, environnement ou boucle agent ; utilise
  automated-testing pour une couverture manquante connue et software-engineering pour une implémentation spécifiée.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

> **Utilise ce skill** quand les observations et le diagnostic causal sont le travail manquant.
> **Utilise release-engineering** pour exécuter le déploiement une fois panne et remède compris.

# Diagnostic systématique

## Capturer avant de modifier

Consigne résultats attendu et observé, erreur exacte, reproduction minimale, environnement, versions
pertinentes, dernier état fonctionnel et changements récents. Inspecte cwd, branche, fichiers,
processus et outils réellement disponibles sans supposer leur état. Préserve les logs utiles sans
exposer les secrets. Pour un échec intermittent, relève fréquence et conditions ; une hypothèse
n'est pas une reproduction.

Pour un échec agent, capture aussi séquence d'outils répétée, dernier progrès utile, dérive du scope,
duplication du contexte et signaux de quota. N'invente pas de fonction cachée de reset ou de reprise.

## Tester une hypothèse réfutable

Distingue logique applicative, état/concurrence, dépendance, environnement et outil/runtime. Trace
l'entrée en échec à travers les frontières jusqu'à la première observation divergente. Avant chaque
expérience, énonce hypothèse, plus petite observation capable de la réfuter et résultat attendu.
Change une variable pertinente à la fois ; réduis le cas avant d'élargir les modifications.
Si des essais différents échouent de la même manière, nomme leur hypothèse commune et cherche une
observation qui la distingue d'une autre cause avant de produire une nouvelle variante du correctif.

Utilise logs, tests ciblés et instrumentation locale disponibles. Un échec de build peut provenir
de la configuration ou des dépendances ; un test en échec peut révéler un défaut réel ou une fixture
incorrecte. Ne masque pas un symptôme en désactivant validation, autorisation ou erreurs. Préfère une
correction dans la source à un fichier généré. Vérifie la compatibilité des versions avant de remplacer
une dépendance.

## Corriger et démontrer

Implémente le plus petit changement étayé dans le scope autorisé. Ajoute un cas de régression en échec
si possible, montre son succès après correction et exécute les contrôles voisins affectés. Distingue
correction causale et contournement temporaire ; nomme la limite restante.

Des échecs répétés de la même hypothèse demandent de nouvelles preuves, pas un nombre arbitraire de
retries ni un revert global. Arrête la boucle improductive, préserve l'état, réduis l'expérience suivante
et signale un vrai blocage externe s'il reste. N'annule que les changements identifiés de l'agent si
c'est sûr ; préserve le reste. Respecte l'autorité du projet pour la reprise destructive ou en production.

Rapporte : symptôme et reproduction ; cause confirmée ou hypothèses restantes ; correction ou
contournement ; commandes et observations avant/après ; preuve de régression et prochaine action.
Utilise validation.md pour le non-trivial. Le diagnostic peut être terminé alors que l'implémentation
ou la vérification en conditions réelles restent en attente.
