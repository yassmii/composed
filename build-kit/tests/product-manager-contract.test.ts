import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '..');

function read(relativePath: string) {
  return readFileSync(join(ROOT, relativePath), 'utf8');
}

describe('product-manager documentation contract', () => {
  it.each(['fr', 'en'])('keeps product truth in docs for %s skills and bridges', (lang) => {
    const skill = read(`skills/core/product-manager/SKILL.${lang}.md`);
    const bridge = read(`bridges/AGENTS.md.${lang}.tpl`);

    expect(skill).toContain('docs/decisions.md');
    expect(skill).toContain('.agents/memory/');
    expect(bridge).toContain('docs/');
    expect(bridge).toContain('.agents/memory/');
  });

  it('does not tell work artifacts to promote product decisions into memory', () => {
    const workGuide = read('work/README.md');
    const operatingModel = read('docs/agentic-operating-model.md');

    expect(workGuide).toContain('keep product decisions in their canonical documents');
    expect(operatingModel).toContain(
      'Keep durable product decisions in their canonical project documents',
    );
    expect(workGuide).not.toContain('move durable project decisions to `.agents/memory/`');
  });

  it('keeps active handoffs discoverable without copying their evidence into memory', () => {
    const workGuide = read('work/README.md');
    const memoryGuide = read('memory/_README.md');

    expect(workGuide).toContain('handoff.md');
    expect(workGuide).toContain('reviews/');
    expect(memoryGuide).toContain('Active cross-session handoffs');
    expect(memoryGuide).toContain('Do not copy');
    expect(memoryGuide).toContain('handoff, review');
  });
});
