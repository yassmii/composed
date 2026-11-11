import { cancel, intro, isCancel, multiselect, outro, select } from '@clack/prompts';
import type { AgentId, Lang, SkillLevel } from './types.ts';

const LANG_OPTIONS: { value: Lang; label: string; hint?: string }[] = [
  { value: 'fr', label: 'Français', hint: 'Recommended' },
  { value: 'en', label: 'English' },
];

const AGENT_OPTIONS: { value: AgentId; label: string; hint?: string }[] = [
  { value: 'claude-code', label: 'Claude Code', hint: 'Recommended' },
  { value: 'codex', label: 'Codex' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'gemini', label: 'Gemini CLI' },
  { value: 'windsurf', label: 'Windsurf' },
  { value: 'aider', label: 'Aider' },
  { value: 'cline', label: 'Cline' },
];

const LEVEL_OPTIONS: { value: SkillLevel; label: string; hint?: string }[] = [
  { value: 'core', label: 'Core (8 skills)', hint: 'Recommended' },
  {
    value: 'support',
    label: 'Support (10 skills)',
    hint: 'onboarding, UX, security, debugging, APIs, migrations, releases, market research, review, docs',
  },
  { value: 'extras', label: 'Extras (presentation)' },
];

export async function promptLanguage(): Promise<Lang> {
  const result = await select({
    message: 'Which language for the doctrine and skills?',
    options: LANG_OPTIONS,
    initialValue: 'fr',
  });
  if (isCancel(result)) {
    cancel('Cancelled.');
    process.exit(0);
  }
  return result as Lang;
}

export async function promptAgents(): Promise<AgentId[]> {
  const result = await multiselect({
    message: 'Which agents do you want to install?',
    options: AGENT_OPTIONS,
    initialValues: ['claude-code'],
    required: true,
  });
  if (isCancel(result)) {
    cancel('Cancelled.');
    process.exit(0);
  }
  return result as AgentId[];
}

export async function promptLevels(initialValues: SkillLevel[] = ['core']): Promise<SkillLevel[]> {
  const result = await multiselect({
    message: 'Which skill levels? (space to toggle multiple, enter to confirm)',
    options: LEVEL_OPTIONS,
    initialValues,
    required: true,
  });
  if (isCancel(result)) {
    cancel('Cancelled.');
    process.exit(0);
  }
  return result as SkillLevel[];
}

export { intro, outro };
