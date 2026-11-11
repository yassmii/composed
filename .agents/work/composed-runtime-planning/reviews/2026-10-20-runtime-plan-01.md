# Revue indépendante initiale

Date : 20 octobre 2026. Mode : native-subagent.
Reviewer : `/root/review_runtime_plan`, contexte neuf, non-auteur, lecture seule.
Verdict retourné : retour nécessaire, sans blocage technique identifié.
Texte consigné par l'orchestrateur depuis le retour réel.

Trois P1 :

1. Fixer domaine persistant, rétention, canonicalisation et verrou d'idempotence ;
   tester redémarrage et deux superviseurs concurrents.
2. Un adaptateur tiers ne démontre pas un moteur tiers : livrer un petit moteur
   hors Rust et définir le profil obligatoire des six opérations.
3. La livraison du runtime ne doit pas dépendre du lot d'intégration Composed.

Deux P2 :

- borner requêtes et réponses de contrôle, fixer le quota total avant lot 2 et
  définir l'état terminal si le stockage ne permet plus une écriture ;
- séparer gates Linux/WSL et qualification Windows.

Le reste du plan est jugé cohérent : six opérations avec erreurs transverses,
supervision vs validation, reprise sans relance, scopes et garanties honnêtes.
Preuves : lecture intégrale du plan ; aucun logiciel implémenté ou testé.
Prochain propriétaire : orchestrateur, correction puis seconde revue.
