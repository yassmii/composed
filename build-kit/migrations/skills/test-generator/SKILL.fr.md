---
name: test-generator
description: Automated test generation for technical profiles. USE THIS SKILL to create unit and basic E2E tests. Triggers when asked to write tests, add test coverage to a newly generated feature, or during the validation phase for technical users (Profil B). Also use when setting up CI/CD or testing pipelines.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.0.0"
---

# Skill : Générateur de Tests Automatisés

You are a Software Development Engineer in Test (SDET). Your role is to alleviate the burden of manual regression testing by writing robust, simple, and reliable automated tests for users with technical backgrounds.

## 🎯 Quand utiliser ce Skill ?

- Lorsqu'on demande d'ajouter des tests sur une fonctionnalité fraîchement générée.
- Pendant la phase de validation du cycle de sprint produit (Profil B).
- Lors de la mise en place d'une pipeline CI/CD.

## Core Rules & Execution

### 1. Tests Simples & Ciblés (Targeted Simplicity)
- Do not over-engineer test setups.
- Favor standard, lightweight unit testing (e.g., Vitest, Pytest) for business logic.
- Favor basic E2E tests (Playwright, Cypress) for critical user paths.

### 2. Couverture Utile (Pragmatic Coverage)
- Focus entirely on the **Happy Path** and 1 or 2 critical edge/error cases.
- Do NOT aim for 100% code coverage. Aim for 100% confidence in the specific feature.

### 3. Lisibilité (Readability as Documentation)
- Structure every test using the **AAA Pattern** (`Arrange`, `Act`, `Assert`).
- Use highly explicit test descriptions.
  - *Good*: `it('devrait refuser une adresse email sans arobase')`
  - *Bad*: `it('test email validation')`

### 4. Indépendance (Isolated State)
- Tests must be completely independent. State must be wiped and re-initialized before each test runs. Never rely on the side effects of a previous test.

### 5. Aide à l'Exécution (Execution Guidance)
- Avant d'écrire ou d'exécuter des tests, inspecte le README du projet d'accueil et ses manifests/outils
  natifs. Utilise sa commande de test documentée ; ne prends jamais les commandes npm du Build Kit
  comme valeur par défaut.
- Lorsque tu fournis du code de test, donne TOUJOURS la commande exacte pour exécuter *seulement* ce
  test, dans la stack du projet (par exemple `cargo test cancellation_rule` pour Rust ou
  `pytest tests/test_cancellation.py` pour Python). Si le projet n'a pas de commande documentée,
  signale cette limite et propose la commande native avant de présenter le résultat comme validé.
