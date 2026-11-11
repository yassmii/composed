import { describe, expect, it } from 'vitest';
import { parseFlags } from '../src/cli/flags.ts';

describe('parseFlags', () => {
  it('parses --yes as boolean true', () => {
    const flags = parseFlags(['--yes']);
    expect(flags.yes).toBe(true);
  });

  it('parses --dry-run as boolean true', () => {
    const flags = parseFlags(['--dry-run']);
    expect(flags.dryRun).toBe(true);
  });

  it('parses --agents claude-code,codex as list', () => {
    const flags = parseFlags(['--agents', 'claude-code,codex']);
    expect(flags.agents).toEqual(['claude-code', 'codex']);
  });

  it('parses --skills core,support as list', () => {
    const flags = parseFlags(['--skills', 'core,support']);
    expect(flags.skills).toEqual(['core', 'support']);
  });

  it('parses --agents= form', () => {
    const flags = parseFlags(['--agents=claude-code']);
    expect(flags.agents).toEqual(['claude-code']);
  });

  it('accepts Cline as an agent', () => {
    const flags = parseFlags(['--agents=cline']);
    expect(flags.agents).toEqual(['cline']);
  });

  it('throws on invalid agent id', () => {
    expect(() => parseFlags(['--agents', 'gpt-4'])).toThrow(/Unknown agent/);
  });

  it('throws on invalid skill level', () => {
    expect(() => parseFlags(['--skills', 'invalid'])).toThrow(/Unknown skill level/);
  });

  it('parses --lang fr', () => {
    const flags = parseFlags(['--lang', 'fr']);
    expect(flags.lang).toBe('fr');
  });

  it('parses --lang=en', () => {
    const flags = parseFlags(['--lang=en']);
    expect(flags.lang).toBe('en');
  });

  it('throws on invalid lang', () => {
    expect(() => parseFlags(['--lang', 'de'])).toThrow(/Unknown lang/);
  });
});
