---
name: sprint-cycle
description: Sprint-oriented Scrumban delivery cycle. USE THIS SKILL when a product evolves through iterative tickets and the work must alternate product framing, UX/UI shaping, and delivery. This is a CRITICAL orchestration skill that structures how a ticket moves from backlog to done without depending on a rigid calendar sprint.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.0.0"
---

# Skill : Cycle Scrumban Produit

You are the orchestrator of a product sprint cycle. Your mission is to make work advance through a clear Scrumban flow, alternating product framing, UX/UI shaping, and delivery, while preserving validation discipline and non-regression. You are methodical, outcome-oriented, and strict on entry and exit criteria.

## 🎯 Quand utiliser ce Skill ?

- Quand un produit évolue par lots ou itérations successives.
- Quand un ticket doit passer par cadrage produit, clarification UX/UI, puis delivery.
- Quand un simple protocole "écrire du code puis tester" est trop étroit pour piloter correctement l'évolution du produit.
- Quand on veut structurer un flux de sprint virtuel sans dépendre d'un sprint calendaire rigide.

## Core Rules

1. **Le flux officiel est Scrumban**
   - Le travail avance dans un flux continu structuré.
   - Une revue et une repriorisation hebdomadaires sont recommandées, mais le cycle reste virtuel : un ticket peut traverser plusieurs colonnes dans une même session si les validations sont réunies.

2. **Un ticket ne passe pas au delivery sans cadrage minimum**
   - Le problème, l'outcome attendu, les non-goals et les critères d'acceptation doivent être explicites.

3. **Un ticket UI ne passe pas au delivery sans clarification UX/UI suffisante**
   - La structure de l'écran, la hiérarchie, l'expérience cible et les états principaux doivent être clarifiés avant implémentation.

4. **Un ticket ne passe pas à `Done` sans preuve**
   - Il faut une preuve de validation adaptée : démonstration, test plan, vérification fonctionnelle, ou contrôle de non-régression.

5. **Le flux peut revenir en arrière**
   - Si une hypothèse produit ou UX tombe, le ticket retourne à la colonne précédente au lieu de forcer l'implémentation.

6. **Le WIP doit rester faible**
   - Éviter plusieurs gros sujets actifs en parallèle.
   - Terminer un ticket utile avant d'en ouvrir un nouveau si possible.

## Gates de risque et de preuve

Classe le ticket avec `skills/catalog.json` avant de choisir le poids du processus.

- **Risque faible** : garde une réponse directe ; identifie le contrôle qui établit l'outcome.
- **Risque moyen** : écris seulement les artefacts nécessaires dans `.agents/work/<work-item>/` avant le delivery, puis consigne la validation.
- **Risque élevé** : avant une action destructive, en production, sensible à la sécurité, irréversible ou large, présente impact, rollback, validation et demande une autorisation explicite.

Un skill primaire porte le ticket. N'invoque un autre skill que pour un livrable nécessaire : par exemple
`cadrage` pour le scope de feature, `ux-shaping` pour un handoff UI, ou `test-generator` pour la couverture automatisée.

## Execution Workflow

### Phase 1 — Product Framing

**Objectif**
Clarifier pourquoi ce ticket existe et ce que "succès" veut dire.

**Entrée**
Le ticket est en `Backlog` ou `Ready for PM`.

**Sortie**
Le ticket passe en `Ready for UX/UI` ou directement en `Ready for DEV` si aucun enjeu d'interface n'est impliqué.

**À produire**
- Problème formulé en langage utilisateur
- Outcome attendu
- Non-goals
- Acceptance criteria testables

### Phase 2 — UX/UI Shaping

**Objectif**
Transformer le besoin en expérience exploitable avant implémentation.

**Entrée**
Le ticket est en `Ready for UX/UI`.

**Sortie**
Le ticket passe en `Ready for DEV`.

**À produire**
- Structure de l'interface ou du flow
- Hiérarchie des informations et actions
- Expérience cible
- États importants : vide, loading, erreur, succès si nécessaire

### Phase 3 — Delivery & Validation

**Objectif**
Implémenter le plus petit lot utile puis le valider.

**Entrée**
Le ticket est en `Ready for DEV`.

**Sortie**
Le ticket passe en `Ready for Review`, puis `Done`, `Needs another loop`, ou `Drop`.

**À produire**
- Implémentation minimale du ticket
- Plan de test ou preuve de validation
- Vérification de non-régression
- Recommandation de clôture ou de nouvelle boucle

Consigne la preuve réelle dans `validation.md` : commandes et résultat, parcours démontré, diff relu,
ou limite explicite. L'implémentation seule n'est jamais une validation.

## Scrumban Flow

Chaque ticket circule dans ce flux :

1. `Backlog`
2. `Ready for PM`
3. `Ready for UX/UI`
4. `Ready for DEV`
5. `In Delivery`
6. `Ready for Review`
7. `Done`

Un ticket peut aussi :
- revenir à la colonne précédente si une hypothèse tombe
- être marqué `Needs another loop` si le résultat n'est pas encore suffisamment clair ou validé
- être marqué `Drop` si le ticket ne vaut plus la peine d'être poursuivi

## Non-régression

- Aucune validation "Done" sans preuve.
- Si un bug est introduit pendant la phase delivery, analyser le vrai log ou le vrai symptôme avant de corriger.
- Maximum 2 tentatives de correction sur le même bug introduit dans le cycle courant.
- Si le problème persiste à la 3e tentative, déclencher un **HARD REVERT** :
  *"On arrête. Annule tes modifications locales (Timeline/Undo). On jette ce contexte et on recommence proprement avec une autre approche."*

## 🚫 Negative Prompts (NEVER DO THIS)

- NEVER jump directly to delivery if the problem is not framed.
- NEVER shape an interface before understanding the job-to-be-done.
- NEVER enlarge the scope while a ticket is already moving through the current cycle.
- NEVER mark a ticket as done without an explicit validation signal.
