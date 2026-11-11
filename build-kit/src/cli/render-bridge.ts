export type TemplateVars = {
  PROJECT_NAME: string;
  KIT_VERSION: string;
  INSTALLED_AGENTS: string;
  SKILLS_INDEX: string;
};

const KNOWN_KEYS = [
  'PROJECT_NAME',
  'KIT_VERSION',
  'INSTALLED_AGENTS',
  'SKILLS_INDEX',
] as const satisfies readonly (keyof TemplateVars)[];

export function renderTemplate(template: string, vars: TemplateVars): string {
  let output = template;
  for (const key of KNOWN_KEYS) {
    output = output.replaceAll(`{{${key}}}`, vars[key]);
  }
  // Detect any leftover unknown {{...}}
  const leftover = /\{\{([A-Z_]+)\}\}/.exec(output);
  if (leftover) {
    throw new Error(`Unknown template variable left after rendering: {{${leftover[1]}}}`);
  }
  return output;
}
