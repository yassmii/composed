# Implémentation — périmètre et décisions

5 novembre 2026. Mandat courant : demande utilisateur d'implémenter le handoff.
Cette demande remplace la limitation documentaire du mandat précédent.

Le choix technique proposé par les plans est repris pour leur implémentation :
Rust dans le dépôt local frère `composed-runtime`, Linux/WSL homogène, sans remote,
publication, service détaché ou appels modèles facturables implicites. Le runtime
reste facultatif et versionné séparément. Contrats et pins inchangés.

Travaux indépendants autorisés : R0/R1/R2, robustesse déterministe R3, étude R4,
K1/K2 avec contrôles K4 correspondants, protocole K5 figé avant essais.
Les lots sont évalués sur leurs critères effectifs, pas déclarés livrés par
simple présence de fichiers. R5 demande accès, données et enveloppe autorisés ;
R6/K3 attendent qualification et revue. K5 réel et K6 consommateurs ne sont pas
simulés. La politique native reste en vigueur jusqu'à qualification.

Traçabilité : R1/R4 → REQ-ADH-009/010 ; R2/R3 → REQ-ADH-011–013 ;
K1/K2 → REQ-ADH-007–015 ; preuves/revue → REQ-ADH-016–020 ;
pilote → MET-ADH-003, ACC-ADH-016 du contrat harness candidate, sans promotion
ni adoption implicite de ses modules optionnels.

Organisation : parent propriétaire de l'intégration Composed, des benchmarks et
de la validation finale ; agent runtime seul écrivain du dépôt frère ; agent kit
seul écrivain du worktree `/tmp/composed-adaptive-kit`. Recherche R4 en lecture
seule. Revue fraîche non-auteur après intégration. Voir [agents.md](agents.md).
