# Plan borné — phase A

1. contract-author : appliquer uniquement le diff YAML présenté et accepté.
2. contract-reviewer : vérifier neutralité, références, compatibilité additive,
   scénarios, erreurs, bornes et questions ouvertes ; mettre à jour review.md.
3. Exécuter npm run validate:contracts depuis la racine Composed, enregistrer
   sa sortie réelle et son code de retour ; vérifier le diff et la conservation
   des clauses antérieures. Aucune preuve fonctionnelle ne sera revendiquée.
4. delivery-review : sous-agent natif, lecture seule des sources et preuves,
   sans écriture canonique. Le parent conserve son rapport dans un nouveau fichier.
5. Présenter le diff effectif ; mettre à jour handoff.md ; attendre la validation
   humaine du point 1. Le plan de couverture des capacités relève de la phase B.

Retour arrière éventuel : retirer uniquement les ajouts de cette phase à partir
du diff, en préservant toutes les modifications utilisateur ; aucun reset global.
