# Vérification du rapatriement documentaire

Date : 24 octobre 2026. Périmètre : plan et preuves provenant du projet
privé d’origine, rapatriés dans le dépôt Composed.

Le [manifeste](import-manifest.json) conserve SHA-256 et tailles des six originaux.
Le plan et l'ancien handoff sont archivés exactement sous `source/` ; revues,
registre et validation historiques sont conservés sans réécriture. Les archives
`.txt` gardent les liens de leur emplacement historique ; elles ne sont pas les
documents actifs à naviguer.

Le plan actif change d'emplacement, de notice de contexte et de liens, et référence
une étude hooks séparée. Son statut non implémenté et la portée de sa revue sont
conservés. Les six anciens fichiers sont désormais des renvois vers Composed ;
leurs cibles sont consignées dans [relocation-redirects.json](relocation-redirects.json).

Contrôles exécutés :

- Six originaux comparés aux empreintes du manifeste et à leurs copies préservées.
- Six fichiers source revérifiés immédiatement avant remplacement par des renvois,
  afin de ne pas écraser une modification intervenue depuis l'import.
- Cibles des six renvois vérifiées. Les chemins historiques restent navigables.
- Liens relatifs de la documentation active contrôlés ; les archives `.txt`
  conservent volontairement leur texte historique exact.
- Aucun code Runtime lancé, aucun test Rust, appel modèle ou déploiement effectué.

Le dossier source n'était pas un dépôt Git. Les octets historiques sont désormais
conservés dans Composed avec leurs empreintes, distincts des notices de migration.
