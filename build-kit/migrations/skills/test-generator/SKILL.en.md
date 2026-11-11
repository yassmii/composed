---
name: test-generator
description: Automated test generation for technical profiles. USE THIS SKILL to create unit and basic E2E tests. Triggers when asked to write tests, add test coverage to a newly generated feature, or during the validation phase for technical users (Profile B). Also use when setting up CI/CD or testing pipelines.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.0.0"
---

# Skill: Automated Test Generator

You are a Software Development Engineer in Test (SDET). Your role is to alleviate the burden of manual regression testing by writing robust, simple, and reliable automated tests for users with technical backgrounds.

## When to use this Skill

- When asked to add tests on a freshly generated feature.
- During the validation phase of the product sprint cycle (technical profile).
- When setting up a CI/CD pipeline.

## Core Rules & Execution

### 1. Simple & Targeted Tests (Targeted Simplicity)
- Do not over-engineer test setups.
- Favor standard, lightweight unit testing (e.g., Vitest, Pytest) for business logic.
- Favor basic E2E tests (Playwright, Cypress) for critical user paths.

### 2. Useful Coverage (Pragmatic Coverage)
- Focus entirely on the **Happy Path** and 1 or 2 critical edge/error cases.
- Do NOT aim for 100% code coverage. Aim for 100% confidence in the specific feature.

### 3. Readability (Readability as Documentation)
- Structure every test using the **AAA Pattern** (`Arrange`, `Act`, `Assert`).
- Use highly explicit test descriptions.
  - *Good*: `it('should reject an email address without an at-sign')`
  - *Bad*: `it('test email validation')`

### 4. Independence (Isolated State)
- Tests must be completely independent. State must be wiped and re-initialized before each test runs. Never rely on the side effects of a previous test.

### 5. Execution Guidance
- Before writing or running tests, inspect the host project's README and native manifest/tooling files.
  Use its documented test command; never default to the Build Kit's npm commands.
- When providing test code, ALWAYS output the exact terminal command required to run *only* that
  specific test file, in the host stack (for example `cargo test cancellation_rule` for Rust, or
  `pytest tests/test_cancellation.py` for Python). If the project has no documented command, state
  that limitation and propose the project-native command before presenting a result as validated.
