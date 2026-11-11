import { lstatSync, readFileSync, readdirSync, rmdirSync, unlinkSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { confirm, isCancel } from '@clack/prompts';
import { type PlannedFile, digest, safeProjectPath } from './managed-files.ts';
import type { Skill } from './types.ts';

export const SKILL_RENAMES = [
  { level: 'core', from: 'technique', to: 'software-engineering' },
  { level: 'core', from: 'test-generator', to: 'automated-testing' },
  { level: 'core', from: 'refactor', to: 'refactoring' },
  { level: 'support', from: 'retrofit', to: 'codebase-onboarding' },
  { level: 'support', from: 'doc-generateur', to: 'technical-documentation' },
  { level: 'core', from: 'sprint-cycle', to: 'delivery-orchestrator' },
] as const;

export type RetirementAction = {
  kind: 'skill' | 'bridge';
  path: string;
  replacement: string;
  action: 'remove' | 'retain';
  reason: string;
  observed_sha256?: string;
  replacement_sha256?: string;
};

export type RetirementResult = RetirementAction & { result: 'removed' | 'retained' };

function errorCode(error: unknown): string | undefined {
  return (error as NodeJS.ErrnoException).code;
}

const normalized = (content: string): string => content.replace(/\r\n/g, '\n');
const withoutTrailingSpaces = (content: string): string =>
  normalized(content).replace(/[\t ]+$/gm, '');

/** Read only after checking every ancestor and case alias, including dangling links. */
function inspectLegacy(
  projectRoot: string,
  path: string,
  kind: RetirementAction['kind'],
): { bytes?: Buffer; reason?: string } | null {
  try {
    const file = safeProjectPath(projectRoot, path);
    if (kind === 'skill') {
      const entries = readdirSync(dirname(file));
      if (entries.length !== 1 || entries[0] !== 'SKILL.md')
        return { reason: 'additional-or-unexpected-legacy-content' };
    }
    if (!lstatSync(file).isFile()) return { reason: 'unsafe-or-uninspectable-legacy-path' };
    return { bytes: readFileSync(file) };
  } catch (error) {
    if (errorCode(error) === 'ENOENT') return null;
    return { reason: 'unsafe-or-uninspectable-legacy-path' };
  }
}

function relativeReplacement(projectRoot: string, path: string): string {
  const result = relative(resolve(projectRoot), resolve(projectRoot, path)).split(sep).join('/');
  safeProjectPath(projectRoot, result);
  return result;
}

/** Plan against selected replacements, which need not exist until installation succeeds. */
export function planRenamedSkills(
  projectRoot: string,
  kitRoot: string,
  skills: Skill[],
  options: { keepLocal: boolean; cline: boolean },
): RetirementAction[] {
  const actions: RetirementAction[] = [];
  for (const rename of SKILL_RENAMES) {
    const replacement = skills.find(
      (skill) => skill.name === rename.to && skill.level === rename.level,
    );
    if (!replacement) continue;
    const replacementPath = relativeReplacement(projectRoot, replacement.path);
    const referenceDir =
      rename.from === 'sprint-cycle'
        ? join(kitRoot, 'skills', rename.level, rename.from)
        : join(kitRoot, 'migrations', 'skills', rename.from);
    const targets = [[`skills/${rename.level}/${rename.from}/SKILL.md`, replacementPath]];
    if (options.cline)
      targets.push([
        `.cline/skills/${rename.from}/SKILL.md`,
        `.cline/skills/${rename.to}/SKILL.md`,
      ]);
    for (const [path, destination] of targets) {
      if (!path || !destination) continue;
      const current = inspectLegacy(projectRoot, path, 'skill');
      if (!current) continue;
      const action: RetirementAction = {
        kind: 'skill',
        path,
        replacement: destination,
        action: 'retain',
        reason: current.reason ?? 'modified-legacy-content',
        ...(current.bytes ? { observed_sha256: digest(current.bytes) } : {}),
      };
      if (options.keepLocal) action.reason = 'keep-local';
      else if (current.bytes) {
        const text = normalized(current.bytes.toString('utf8'));
        let trailingSpacesOnly = false;
        for (const lang of ['fr', 'en']) {
          let reference: string;
          try {
            reference = normalized(readFileSync(join(referenceDir, `SKILL.${lang}.md`), 'utf8'));
          } catch (error) {
            if (errorCode(error) === 'ENOENT') continue;
            throw error;
          }
          if (reference === text) {
            action.action = 'remove';
            action.reason = 'recognized-historical-copy';
            break;
          }
          if (withoutTrailingSpaces(reference) === withoutTrailingSpaces(text))
            trailingSpacesOnly = true;
        }
        if (action.action === 'retain' && trailingSpacesOnly)
          action.reason = 'trailing-whitespace-only-review-required';
      }
      actions.push(action);
    }
  }
  return actions;
}

/** Legacy bridges are removable only when identical to their intended replacement. */
export function planLegacyBridges(
  projectRoot: string,
  files: readonly PlannedFile[],
  options: { keepLocal: boolean },
): RetirementAction[] {
  const actions: RetirementAction[] = [];
  for (const [path, replacement] of [
    ['.cursor/rules/hunch-method.mdc', '.cursor/rules/composed-build-kit.mdc'],
    ['.clinerules/hunch-build-kit.md', '.clinerules/composed-build-kit.md'],
  ]) {
    if (!path || !replacement) continue;
    const planned = files.find((file) => file.path === replacement);
    if (!planned) continue;
    const current = inspectLegacy(projectRoot, path, 'bridge');
    if (!current) continue;
    const action: RetirementAction = {
      kind: 'bridge',
      path,
      replacement,
      action: 'retain',
      reason: current.reason ?? 'modified-legacy-content',
      ...(current.bytes ? { observed_sha256: digest(current.bytes) } : {}),
    };
    if (options.keepLocal) action.reason = 'keep-local';
    else if (current.bytes) {
      let replacementBytes = Buffer.from(planned.content);
      if (planned.retain) {
        try {
          replacementBytes = readFileSync(safeProjectPath(projectRoot, replacement));
        } catch (error) {
          if (errorCode(error) !== 'ENOENT') {
            action.reason = 'unsafe-or-uninspectable-replacement-path';
            actions.push(action);
            continue;
          }
        }
      }
      if (current.bytes.equals(replacementBytes)) {
        action.action = 'remove';
        action.reason = 'identical-legacy-bridge';
        action.replacement_sha256 = digest(replacementBytes);
      }
    }
    actions.push(action);
  }
  return actions;
}

/** Apply the reviewed plan only; changed bytes, resources or replacement paths are preserved. */
export function applyRetirementPlan(
  projectRoot: string,
  actions: readonly RetirementAction[],
): RetirementResult[] {
  return actions.map((action): RetirementResult => {
    const retained = (reason: string): RetirementResult => ({
      ...action,
      result: 'retained',
      reason,
    });
    if (action.action !== 'remove') return retained(action.reason);
    const current = inspectLegacy(projectRoot, action.path, action.kind);
    if (!current?.bytes || digest(current.bytes) !== action.observed_sha256)
      return retained('legacy-changed-after-plan');
    try {
      const replacement = safeProjectPath(projectRoot, action.replacement);
      if (!lstatSync(replacement).isFile()) return retained('replacement-not-installed');
      if (
        action.replacement_sha256 &&
        digest(readFileSync(replacement)) !== action.replacement_sha256
      )
        return retained('replacement-changed-after-plan');
    } catch {
      return retained('replacement-not-installed-or-unsafe');
    }
    // No recursive deletion: an extra file appearing after inspection cannot be swept away.
    unlinkSync(safeProjectPath(projectRoot, action.path));
    if (action.kind === 'skill') rmdirSync(join(projectRoot, dirname(action.path)));
    return { ...action, result: 'removed' };
  });
}

/** Compatibility wrapper for callers that already installed their replacements. */
export async function migrateRenamedSkills(
  projectRoot: string,
  kitRoot: string,
  skills: Skill[],
  options: { yes: boolean; keepLocal: boolean; cline: boolean },
): Promise<void> {
  const actions = planRenamedSkills(projectRoot, kitRoot, skills, options);
  const approved: RetirementAction[] = [];
  for (const action of actions) {
    if (action.action === 'remove' && !options.yes) {
      const decision = await confirm({
        message: `Replace unchanged legacy ${action.path} with ${action.replacement}?`,
        initialValue: true,
      });
      if (isCancel(decision) || !decision) {
        approved.push({ ...action, action: 'retain', reason: 'confirmation-declined' });
        continue;
      }
    }
    approved.push(action);
  }
  for (const result of applyRetirementPlan(projectRoot, approved)) {
    if (result.result === 'removed')
      console.log(`✓ Migrated legacy ${result.path} to ${result.replacement}.`);
    else
      console.warn(
        `⚠️  Kept legacy ${result.path}: ${result.reason}; review against ${result.replacement}.`,
      );
  }
}
