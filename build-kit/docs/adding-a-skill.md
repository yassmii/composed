# Adding a Skill

## Anatomy

A skill is a directory with **two SKILL.md files** — one per supported language (FR + EN):

```
skills/<level>/<name>/
├── SKILL.fr.md
└── SKILL.en.md
```

Where `<level>` ∈ `core | support | extras` and `<name>` matches the `name:` frontmatter (kebab-case).

## SKILL.md template (both files must have the same structure)

```markdown
---
name: my-new-skill
description: One-sentence summary used as trigger context. Be specific. USE THIS SKILL when [trigger condition].
license: MIT
metadata:
  author: composed-build-kit
  version: "1.0.0"
---

> **Use this skill** when [precise trigger].
> **Use [other-skill]** instead when [boundary condition].

# Skill : [Name]

You are [persona — e.g., "a senior product designer", "a code archaeologist"].
[Mission in 2-3 lines.]

## Core Rules

1. ...
2. ...

## Execution Workflow

1. ...
2. ...

## Quality Checklist

- ...
- ...
```

## Frontmatter requirements

- `name`: MUST match the directory name (same value in both `.fr.md` and `.en.md`)
- `description`: starts with a concise summary and states a clear activation condition; add exclusions
  only to prevent likely overlap with another skill
- `license`: `MIT` (kit convention)
- `metadata.author`: `composed-build-kit`
- `metadata.version`: semver

## Where to put it

- **core/**: recurring product, design, engineering and validation work
- **support/**: situational expertise such as onboarding, security, debugging, migrations and releases
- **extras/**: opt-in, niche (presentation generation, etc.)

## Routing contract

Every distributed skill must also have one entry in `skills/catalog.json`. Keep the entry concise and
specific: `when`, `not_when`, `phase`, `risk`, and only the work artifacts it genuinely needs. The
catalog is what lets an installed agent choose one primary skill rather than loading every methodology.

Choose risk proportionately:

- `low`: analysis, direct answers, or reversible documentation work
- `medium`: bounded implementation or user-visible behavioural change
- `high`: destructive, production-facing, security-sensitive, irreversible, or broad change

## Language consistency rules

- Both `SKILL.fr.md` and `SKILL.en.md` must have the **same sections** in the **same order**.
- Skill names referenced in either file (e.g. `cadrage`, `ux-shaping`) are NEVER translated — they're identifiers.
- Boundary blocks at the top of the body should be **in the target language** (use `Utilise ce skill...` in FR, `Use this skill...` in EN).
- Technical idioms typical of agentic prompting (`USE THIS SKILL when`, `scope creep`, `slice`, `compact`) can stay in English in both files — they're convention keywords.

## How it propagates

Once added to `composed-build-kit/skills/`, the skill is included in the next `composed-kit update` of any installed project (matching the level filter). The CLI selects `SKILL.<lang>.md` based on the user's lang choice and renders the index automatically.

## Testing a new skill

1. Add to `skills/<level>/<name>/SKILL.fr.md` + `skills/<level>/<name>/SKILL.en.md`
2. Run kit tests: `npm run test:build-kit`
3. Run the agentic contract check: `npm run eval:build-kit`
4. Verify frontmatter: `grep -m1 '^name:' skills/<level>/<name>/SKILL.fr.md` should match the dir name
5. Install kit locally in a sandbox project:
   ```bash
   node bin/composed-kit.mjs init --cwd=/tmp/sandbox --kit-root=$(pwd) --yes --lang=fr --skills=core,<level>
   ```
6. Verify the skill appears in the generated `AGENTS.md` index
7. Trigger it manually in an agent session

## Conflict / overlap with existing skills

Before adding, check whether the responsibility overlaps an existing skill. If yes:
- Either extend the existing skill (preferred)
- Or muscle the boundaries with explicit "Use this WHEN... use OTHER WHEN..." text in both skills

A two-skill overlap with no boundary text is a kit smell. Reject.

## Renaming a skill

Update the routed identifier, current consumers and behavioural scenarios together. Preserve immutable
FR/EN recognition references under migrations/skills/<old-name>/ and add the mapping in
src/cli/skill-migrations.ts. New installations must route only the new identifier. Migration retires
recognised unchanged copies only after replacements exist; preserve custom files, extra resources,
links and --keep-local copies for manual reconciliation, including selected native mirrors.
See [catalog and migration](./skill-catalog.md) and tests/skill-migrations.test.ts.
