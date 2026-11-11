# Diagnostic et réparation par agent

Demande du 24 octobre 2026 : rendre l'adoption et les écarts du kit diagnostiquables
et corrigeables par un agent, après le cas consumer-career sans installation.

Scope : `doctor --agent --json`, findings stables, bridges et skills par agent,
analyse bornée du prompt, `repair` en prévisualisation par défaut et restauration
explicite des seuls fichiers manquants d'une installation reconnue. Les fichiers
personnalisés, contradictions sémantiques et adoptions sans marqueur relèvent d'un
plan guidé, sans écrasement ni fabrication du marqueur d'installation.

Contrat concerné : agentic-delivery-harness 0.1.0 draft, REQ-ADH-001/002/009/010,
REQ-ADH-016 à 018 et INV-ADH-001/002. Il reste une cible, pas une conformité revendiquée.
Livrables : rapport machine, corrections bornées, tests des cas réels, documentation
et version du kit indépendante. Préserver les modifications des POC ; y tester
uniquement le diagnostic et le dry run.

Hors scope : installation forcée, modification automatique de prompts ou choix
de stack, configuration des comptes/outils natifs, correction du code produit,
interception runtime et création de services de télémétrie.
