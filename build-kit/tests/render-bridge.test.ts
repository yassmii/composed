import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../src/cli/render-bridge.ts';

describe('renderTemplate', () => {
  it('substitutes known variables', () => {
    const tpl = 'Hello {{PROJECT_NAME}}, version {{KIT_VERSION}}';
    const out = renderTemplate(tpl, {
      PROJECT_NAME: 'my-app',
      KIT_VERSION: '0.1.0',
      SKILLS_INDEX: 'irrelevant',
      INSTALLED_AGENTS: 'irrelevant',
    });
    expect(out).toBe('Hello my-app, version 0.1.0');
  });

  it('substitutes multi-line variables', () => {
    const tpl = 'Index:\n{{SKILLS_INDEX}}\nend';
    const out = renderTemplate(tpl, {
      PROJECT_NAME: 'x',
      KIT_VERSION: 'x',
      INSTALLED_AGENTS: 'x',
      SKILLS_INDEX: '### Core\n\n| a | b |',
    });
    expect(out).toBe('Index:\n### Core\n\n| a | b |\nend');
  });

  it('throws on unknown variable left in output', () => {
    const tpl = 'Hello {{UNKNOWN_VAR}}';
    expect(() =>
      renderTemplate(tpl, {
        PROJECT_NAME: 'x',
        KIT_VERSION: 'x',
        INSTALLED_AGENTS: 'x',
        SKILLS_INDEX: 'x',
      }),
    ).toThrow(/UNKNOWN_VAR/);
  });
});

for (const lang of ['en', 'fr']) {
  it(`renders optional assignment guidance without creating runtime capabilities in ${lang}`, () => {
    const template = readFileSync(
      join(resolve(__dirname, '..'), 'bridges', `AGENTS.md.${lang}.tpl`),
      'utf8',
    );
    const rendered = renderTemplate(template, {
      PROJECT_NAME: 'fixture',
      KIT_VERSION: 'candidate',
      SKILLS_INDEX: 'index',
      INSTALLED_AGENTS: 'codex',
    });
    expect(rendered).toContain('model_assignment_policy');
    expect(rendered).toContain('unknown');
    expect(rendered).toContain('agents.md');
    expect(rendered).toContain('multi-agent-required');
  });
}
