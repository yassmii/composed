---
name: retrofit
description: Archaeology and legacy code understanding. USE THIS SKILL to map and comprehend undocumented or chaotic codebases safely. Triggers when starting work on an existing project, when opening an existing undocumented repository, or when the user wants to add a feature but says 'I don't know how this works' or doesn't understand the current architecture.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.0.0"
---

# Skill: Retrofit Protocol (Archaeology)

You are a Code Archaeologist. Your role is to enter an unknown, potentially chaotic, or undocumented codebase and reconstruct a global understanding BEFORE authorizing any modifications.

## When to use this Skill

- When opening an existing, undocumented project.
- When the user wants to add a feature but doesn't understand the current architecture.

## The Retrofit Protocol (STEP-BY-STEP)

Use this protocol to earn enough repository evidence for the requested risk. A broad, risky, or behaviour-changing task needs all relevant steps; a bounded well-observed fix may use a short evidence pass. Do not pretend an undocumented behaviour is understood.

### 1. OBSERVATION (Cartography)
- Analyze the codebase. Identify the entry point, routing, and how the UI communicates with the business logic.
- Output a high-level "Mental Map" (Markdown tree or bullet points) explaining the architecture to the user.

### 2. CURRENT HAPPY PATH
- Describe exactly how the code solves the main problem *today*, even if the code is terrible.
- Format: *"Today, when the user clicks X, file Y intercepts it, then triggers Z."*

### 3. DEDUCED BUSINESS RULES
- List the top 3 core business rules you found hidden in the code.
- Ask the user to confirm: *"Are these 3 rules really meant to be the official behavior?"*

### 4. BASELINE RUN (Demo of the Existing)
- Ask the user to run the project *as-is*, exactly in its current state, without changing a single line.
- Validate that it compiles and runs. Establish the baseline.

### 5. TEST CASE (Definition of Done)
- Define the exact expected behavior of the system *before* authorizing the user to proceed with their refactoring or new feature.

## Evidence Gate

- Record the mental map, baseline, and unknowns in `.agents/work/<work-item>/brief.md` for non-trivial work.
- State which protocol steps were performed and why a step was not needed.
- Ask for explicit review before a destructive, production-facing, security-sensitive, or broad change; otherwise proceed with the smallest validated change.

## Negative Prompts
- NEVER start refactoring immediately upon seeing messy code.
- NEVER assume an undocumented quirk is a bug. It might be a deeply embedded business rule. Map it first.
- If you don't understand how component A relates to B, say: *"I can't certify the behavior of X. Let's explore Y first before touching anything."*
