# Validation: client-hub fresh install (M6)

**Date:** 2026-05-25
**composed-build-kit version:** 0.1.0
**Target:** `~/repos/client-hub` (real project, multi-app monorepo with Turbo + Prisma)
**Outcome:** ✅ PASS with 4 friction notes

## Setup

`client-hub` was already an active project but **not a git repo** and contained a **manually-installed** version of the composed-build-kit-like structure (old `Agents.md`, `CLAUDE.md`, `skills/` with 14 outdated skills including the deprecated `skill-design` doublon and empty `skill-iteration`).

Migration was therefore **not a pure fresh install** but a real-world adoption scenario, which is more representative of how teams will discover the kit:

1. Backup `Agents.md`, `CLAUDE.md`, `skills/`, `.codex`, `claude-md-and-skills.zip` → `~/repos/client-hub-pre-migration-backup/` (outside the repo)
2. `git init` + `git remote add origin git@github.com:yassmii/client-hub.git`
3. `node bin/composed-kit.mjs init --yes --lang=fr --agents=claude-code,codex --skills=core,support`
4. `doctor` → healthy, 0 errors, 0 warnings
5. First commit `26eaf68 initial: setup project with composed-build-kit v0.1.0`

## Verified working

- ✅ `composed-kit` wizard skipped via flags; install completed in <1s
- ✅ AGENTS.md (8.2K) generated with `{{PROJECT_NAME}}` substituted to `client-hub`
- ✅ CLAUDE.md (6.4K) generated with skills index populated
- ✅ 11 SKILL.md installed in `skills/{core,support}/` (no `.fr.md`/`.en.md` leakage)
- ✅ Symlink memory mirror `~/.claude/projects/<slug>/memory/` → `.agents/memory/` (no warning, symlink-first worked on WSL2)
- ✅ `.agents/memory/` pre-existing content **preserved** (MEMORY.md + project_strategy.md + track_b_foundation.md untouched)
- ✅ `.claude/settings.local.json` untouched
- ✅ Project source code (apps/, packages/, rework-ds/, docs/) untouched
- ✅ `.hunch-kit-version` written with `lang: fr`, both agents listed

## Friction points captured

### F-001: Pre-existing `.agents/memory/` skips kit's `_README.md`

**Symptom:** When `.agents/memory/` already exists (e.g., user installed a memory dir manually), `runInit` skips the whole `copyDirRecursive(memory, .agents/memory)` step. The kit's `_README.md` (memory format guide) is therefore NOT deposited for projects with pre-existing memory dirs.

**Impact:** Low. The format guide is also covered in AGENTS.md §4 and `docs/getting-started.md`. But the user loses the in-place reference.

**Proposed fix (v0.2):** Within init, check each file in `kit/memory/*` individually and copy only those missing from the target. So `MEMORY.md` is preserved (user's content) but `_README.md` is deposited as a fresh reference.

**Status:** Documented. Acceptable for v0.1.

### F-002: Case-sensitivity collision `Agents.md` vs `AGENTS.md`

**Symptom:** Before migration, client-hub had `Agents.md` (capital A, lowercase rest). The kit generates `AGENTS.md` (all caps). On Linux (case-sensitive FS), these are **two different files** and would coexist. On macOS default APFS (case-insensitive), they collide — the second write would clobber the first or fail unpredictably.

**Impact:** Medium. Users coming from non-standard naming conventions could end up with two doctrine files.

**Proposed fix (v0.2):** During init, scan for `^[Aa][Gg][Ee][Nn][Tt][Ss]\.md$` files in the project root and either prompt the user to migrate them or list them in a warning. Optionally, refuse to overwrite when a case-variant exists.

**Status:** Documented. v0.1 mitigates by user discipline (manual backup before init).

### F-003: No backup-on-overwrite for AGENTS.md / CLAUDE.md / skills

**Symptom:** `runInit` (without `--force`) checks only `.agents/.hunch-kit-version` to decide if the project is already kit-installed. If that file is absent but AGENTS.md / CLAUDE.md / skills/ exist (manual setup), init silently overwrites them without asking.

**Impact:** Medium. A user with a manual setup who runs `composed-kit` would lose their custom AGENTS.md without warning.

**Proposed fix (v0.2):** Before overwriting, check if target files exist and prompt for confirmation (or auto-backup to `.before-hunch-kit/`).

**Status:** Documented. Worth fixing in v0.2; the migration playbook in `docs/getting-started.md` should advise users to backup first.

### F-004: `--cwd` and `--kit-root` are undocumented internals

**Symptom:** The `--cwd` and `--kit-root` flags were necessary for the migration (running the bin from the kit repo against a different target dir), but they're not in any flag table in the spec or docs.

**Impact:** Low. They're useful for internal test fixtures and for advanced workflows (e.g., using a git-submoduled kit). End users use the kit via `npx github:` so `--cwd` defaults to their cwd and `--kit-root` is auto-resolved.

**Proposed fix (v0.2):** Document them in `docs/getting-started.md` under "Advanced flags" or hide them with a `--` prefix (e.g., `--__cwd` to mark "internal use").

**Status:** Documented. Not user-visible in the npx workflow; OK as-is for v0.1.

## What didn't break (validation of design decisions)

1. **Symlink memory mirror worked first try** on WSL2 — design decision §9.3 of the spec validated again (§12.1 was the synthetic test, §12.2 was the M5e fresh project, this is the third confirmation on a real project).
2. **Language resolution** worked — installed FR, AGENTS.md contains `## 1. Persona attendu`, skills are FR.
3. **`--yes` non-interactive flow** worked end-to-end without prompts — useful for CI/scripting.
4. **`.gitignore`** of the project (pre-existing) was untouched — the kit doesn't need to modify it (its outputs are not gitignored-style; everything except `node_modules` is tracked).

## Recommendation for v0.1.0 release

✅ **Ship v0.1.0.** The 4 frictions are non-blocking, all have proposed v0.2 fixes, and the kit functioned correctly on a real-world project with messy pre-existing state. The docs should mention the manual-backup recommendation for projects with prior manual setup.
