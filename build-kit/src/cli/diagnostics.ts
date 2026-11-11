import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { planClaudeMemory } from './claude-memory.ts';
import {
  MANIFEST_PATH,
  PROJECT_INSTRUCTIONS_PATH,
  digest,
  readManagedManifest,
  safeProjectPath,
} from './managed-files.ts';
import { collectInstallationSource } from './provenance.ts';
import { renderTemplate } from './render-bridge.ts';
import { readCatalogSkills } from './skill-catalog.ts';
import { parseSkillFrontmatter, renderSkillsIndex } from './skills-index.ts';
import {
  AGENT_SPECS,
  type AgentId,
  type InstalledVersion,
  KIT_VERSION,
  type Skill,
  type SkillLevel,
} from './types.ts';
import { readVersion } from './version-tracker.ts';

export type Finding = {
  id: string;
  severity: 'error' | 'warning';
  path: string;
  agent: AgentId | 'shared';
  message: string;
  remediation: 'create-missing' | 'review' | 'update' | 'adopt';
};

export type DoctorResult = {
  format_version: 1;
  scope: 'installation-and-instructions';
  runtime_verification: 'not_performed';
  cwd: string;
  agents: AgentId[];
  installation: 'installed' | 'missing' | 'invalid';
  healthy: boolean;
  errors: string[];
  warnings: string[];
  findings: Finding[];
};

export type DiagnosticOptions = { cwd: string; kitRoot: string; agent?: AgentId };
export type ExpectedFile = { path: string; content: string };

export function diagnosticOptions(args: string[], repair = false): DiagnosticOptions {
  const values = new Map<string, string>();
  const booleans = new Set(repair ? ['--json', '--dry-run', '--apply'] : ['--json']);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;
    if (booleans.has(arg)) continue;
    const [key, ...tail] = arg.split('=');
    if (!key || !['--cwd', '--kit-root', '--agent'].includes(key)) {
      throw new Error(`Unknown diagnostic option: ${arg}`);
    }
    const value = tail.length ? tail.join('=') : args[++i];
    if (!value || value.startsWith('--') || values.has(key)) {
      throw new Error(`Supply ${key} exactly once with a value.`);
    }
    values.set(key, value);
  }
  const agent = values.get('--agent');
  if (agent && !Object.hasOwn(AGENT_SPECS, agent)) throw new Error(`Unknown agent: ${agent}`);
  return {
    cwd: resolve(values.get('--cwd') ?? process.cwd()),
    kitRoot: resolve(values.get('--kit-root') ?? resolve(import.meta.dirname, '../..')),
    ...(agent ? { agent: agent as AgentId } : {}),
  };
}

function validInstallation(value: InstalledVersion): boolean {
  return (
    typeof value.version === 'string' &&
    /^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(value.version) &&
    ['fr', 'en'].includes(value.lang) &&
    Array.isArray(value.agents) &&
    value.agents.length > 0 &&
    new Set(value.agents).size === value.agents.length &&
    value.agents.every((agent) => Object.hasOwn(AGENT_SPECS, agent)) &&
    !!value.skills &&
    ['core', 'support', 'extras'].every((level) => {
      const count = value.skills[level as SkillLevel];
      return Number.isInteger(count) && count >= 0;
    })
  );
}

export function inspectProject(options: DiagnosticOptions): {
  result: DoctorResult;
  missingFiles: ExpectedFile[];
} {
  const { cwd, kitRoot } = options;
  const findings: Finding[] = [];
  const missingFiles: ExpectedFile[] = [];
  const add = (
    id: string,
    severity: Finding['severity'],
    path: string,
    message: string,
    remediation: Finding['remediation'],
    agent: Finding['agent'] = 'shared',
  ) => {
    findings.push({ id: `${id}:${path}`, severity, path, agent, message, remediation });
  };
  let installed: InstalledVersion | null = null;
  let installation: DoctorResult['installation'] = 'missing';
  try {
    const record = readVersion(cwd);
    if (record) {
      if (!validInstallation(record)) throw new Error('Invalid installation fields.');
      installed = record;
      installation = 'installed';
    }
  } catch {
    installation = 'invalid';
    add(
      'installation.invalid',
      'error',
      '.agents/.composed-kit-version',
      'Installation record is invalid. Review its source; no settings or repair defaults will be invented.',
      'review',
    );
  }
  if (installation === 'missing') {
    add(
      'installation.missing',
      'error',
      '.agents/.composed-kit-version',
      'Missing .agents/.composed-kit-version installation record. A project AGENTS.md or product contract is not a Build Kit installation. Plan adoption with explicit agent/language/skills and preserve project instructions before init.',
      'adopt',
    );
  }
  if (installed && installed.version !== KIT_VERSION) {
    add(
      'installation.version',
      'warning',
      '.agents/.composed-kit-version',
      `Version drift: installed v${installed.version}, kit v${KIT_VERSION}. Review custom files and run composed-kit update before repair.`,
      'update',
    );
  }
  const agents = options.agent ? [options.agent] : (installed?.agents ?? []);
  if (installed && options.agent && !installed.agents.includes(options.agent)) {
    add(
      'agent.unconfigured',
      'error',
      '.agents/.composed-kit-version',
      `${options.agent} is not a configured agent. Review the installation configuration; repair will not silently register it.`,
      'review',
      options.agent,
    );
  }
  let manifestInvalid = false;
  let sourceCompatible = false;
  if (installed) {
    try {
      const manifest = readManagedManifest(cwd);
      try {
        const source = collectInstallationSource(kitRoot);
        sourceCompatible = manifest?.source?.content_sha256 === source.content_sha256;
        if (!manifest?.source)
          add(
            'installation.source-unknown',
            'warning',
            MANIFEST_PATH,
            'No native source provenance is recorded. Same version does not prove the same source; review and update before repair.',
            'update',
          );
        else if (!sourceCompatible)
          add(
            'installation.source-drift',
            'warning',
            MANIFEST_PATH,
            'Installed source fingerprint differs from the executing kit, even if versions match. Review and update before repair; retained files may remain older.',
            'update',
          );
        else if (manifest.source.git.revision !== source.git.revision)
          add(
            'installation.revision-drift',
            'warning',
            MANIFEST_PATH,
            'Git revision differs while the scoped source fingerprint matches. Inspect provenance; this is not a content difference.',
            'review',
          );
        if (source.git.worktree === 'modified')
          add(
            'kit.source-modified',
            'warning',
            MANIFEST_PATH,
            'The executing kit source has local modifications. Its fingerprint records observed content; this is not an official release identity.',
            'review',
          );
      } catch (error) {
        add(
          'kit.source-unreadable',
          'error',
          '',
          `Cannot establish compatible executing source: ${(error as Error).message} No repair writes are allowed.`,
          'review',
        );
      }
      if (!manifest)
        add(
          'manifest.missing',
          'warning',
          MANIFEST_PATH,
          'Legacy installation has no managed baselines. Update conservatively; unknown local files require reconciliation.',
          'update',
        );
      for (const [path, hash] of Object.entries(manifest?.files ?? {})) {
        try {
          const target = safeProjectPath(cwd, path);
          if (existsSync(target) && digest(readFileSync(target)) !== hash)
            add(
              'managed.modified',
              'warning',
              path,
              'Managed file differs from its last generated baseline; preserve or explicitly back up before replacement.',
              'review',
            );
        } catch {
          manifestInvalid = true;
          add(
            'managed.unsafe',
            'error',
            path,
            'Managed path is linked or cannot be inspected safely.',
            'review',
          );
        }
      }
    } catch {
      manifestInvalid = true;
      add(
        'manifest.invalid',
        'error',
        MANIFEST_PATH,
        'Invalid managed manifest; reconcile before mutation.',
        'review',
      );
    }
  }
  const canCreate =
    !!installed && installed.version === KIT_VERSION && !manifestInvalid && sourceCompatible;
  const checkFile = (
    path: string,
    severity: Finding['severity'],
    content?: string,
    agent: Finding['agent'] = 'shared',
  ) => {
    const absolute = join(cwd, path);
    if (!existsSync(absolute)) {
      // A dangling link is an existing destination, not an absent generated file.
      try {
        lstatSync(absolute);
        add(
          'file.dangling-link',
          'error',
          path,
          `Broken link at ${path}; review its ownership and target.`,
          'review',
          agent,
        );
        return;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          add('file.unreadable', 'error', path, `Cannot inspect ${path}.`, 'review', agent);
          return;
        }
      }
      const repairable = canCreate && content !== undefined;
      add(
        'file.missing',
        severity,
        path,
        `Missing ${path}.`,
        repairable ? 'create-missing' : installed ? 'update' : 'adopt',
        agent,
      );
      if (repairable) missingFiles.push({ path, content });
      return;
    }
    try {
      if (!lstatSync(absolute).isFile()) {
        add(
          'file.not-regular',
          'error',
          path,
          `${path} is not a regular file; review it before repair.`,
          'review',
          agent,
        );
      }
    } catch {
      add('file.unreadable', 'error', path, `Cannot inspect ${path}.`, 'review', agent);
    }
  };

  if (installed) {
    try {
      if (JSON.parse(readFileSync(join(kitRoot, 'package.json'), 'utf8')).version !== KIT_VERSION) {
        throw new Error('Kit source version does not match the CLI.');
      }
      const levels = (['core', 'support', 'extras'] as SkillLevel[]).filter(
        (level) => installed.skills[level] > 0,
      );
      const source = join(kitRoot, 'skills/catalog.json');
      const skills: Skill[] = [];
      const selectedSkills = readCatalogSkills(source, levels);
      for (const item of selectedSkills) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.name)) throw new Error('Invalid skill path.');
        const path = `skills/${item.level}/${item.name}/SKILL.md`;
        const content = readFileSync(
          join(kitRoot, 'skills', item.level, item.name, `SKILL.${installed.lang}.md`),
          'utf8',
        ).replace(/\r\n/g, '\n');
        let metadata = parseSkillFrontmatter(content);
        const local = join(cwd, path);
        if (existsSync(local) && lstatSync(local).isFile()) {
          try {
            metadata = parseSkillFrontmatter(readFileSync(local, 'utf8'));
          } catch {
            add(
              'skill.invalid',
              'error',
              path,
              'Local skill metadata is invalid. Preserve and review this customization.',
              'review',
            );
          }
        }
        skills.push({ ...metadata, level: item.level, path });
        checkFile(path, 'error', content);
        if (agents.includes('cline') && installed.agents.includes('cline')) {
          const mirror = `.cline/skills/${item.name}/SKILL.md`;
          const shared = join(cwd, path);
          const sharedContent =
            existsSync(shared) && lstatSync(shared).isFile()
              ? readFileSync(shared, 'utf8')
              : content;
          checkFile(mirror, 'error', sharedContent, 'cline');
          if (
            existsSync(join(cwd, mirror)) &&
            lstatSync(join(cwd, mirror)).isFile() &&
            readFileSync(join(cwd, mirror), 'utf8') !== sharedContent
          ) {
            add(
              'cline.mirror-drift',
              'warning',
              mirror,
              'Cline mirror differs from the shared skill. Review local customizations; no existing file will be overwritten.',
              'review',
              'cline',
            );
          }
        }
      }
      const catalog = JSON.parse(readFileSync(source, 'utf8'));
      const selected = new Set(selectedSkills.map((skill) => skill.name));
      catalog.skills = catalog.skills.filter((skill: { name: string }) => selected.has(skill.name));
      checkFile('skills/catalog.json', 'warning', `${JSON.stringify(catalog, null, 2)}\n`);
      if (existsSync(join(cwd, 'skills/catalog.json'))) {
        try {
          const current = JSON.parse(readFileSync(join(cwd, 'skills/catalog.json'), 'utf8'));
          if (!Array.isArray(current.skills)) throw new Error('Invalid skills.');
          for (const key of [
            'stack_selection_policy',
            'execution_policy',
            'delivery_policy',
            'artifact_protocol',
            'runtime_capability_protocol',
            'knowledge_policy',
          ]) {
            if (!isDeepStrictEqual(current[key], catalog[key]))
              add(
                `catalog.policy-drift.${key}`,
                'warning',
                'skills/catalog.json',
                `Installed ${key} differs from the checked-out kit. Review local policy before update.`,
                'review',
              );
          }
        } catch {
          add(
            'catalog.invalid',
            'error',
            'skills/catalog.json',
            'Skill catalog is invalid; preserve and review it before replacement.',
            'review',
          );
        }
      }
      const vars = {
        PROJECT_NAME: basename(cwd),
        KIT_VERSION,
        INSTALLED_AGENTS: installed.agents.join(', '),
        SKILLS_INDEX: renderSkillsIndex(skills),
      };
      const bridges = new Map<string, { template: string; agent: Finding['agent'] }>([
        ['AGENTS.md', { template: 'AGENTS.md', agent: 'shared' }],
      ]);
      for (const agent of agents.filter((agent) => installed.agents.includes(agent))) {
        const spec = AGENT_SPECS[agent];
        if (spec.output !== 'AGENTS.md')
          bridges.set(spec.output, { template: spec.templateBase, agent });
      }
      for (const [path, spec] of bridges) {
        const content = renderTemplate(
          readFileSync(join(kitRoot, 'bridges', `${spec.template}.${installed.lang}.tpl`), 'utf8'),
          vars,
        );
        checkFile(path, 'error', content, spec.agent);
        if (
          existsSync(join(cwd, path)) &&
          lstatSync(join(cwd, path)).isFile() &&
          !readFileSync(join(cwd, path), 'utf8').includes('Generated by composed-build-kit')
        ) {
          add(
            'bridge.custom',
            'warning',
            path,
            'Existing instructions are not identified as a generated kit bridge. Review and merge; repair preserves them.',
            'review',
            spec.agent,
          );
        }
      }
      for (const path of ['memory/MEMORY.md', 'memory/_README.md', 'work/README.md']) {
        checkFile(
          `.agents/${path}`,
          path === 'memory/MEMORY.md' ? 'error' : 'warning',
          readFileSync(join(kitRoot, path), 'utf8'),
        );
        if (path !== 'memory/MEMORY.md') {
          try {
            const guide = safeProjectPath(cwd, `.agents/${path}`);
            if (
              existsSync(guide) &&
              readFileSync(guide, 'utf8').replace(/\r\n/g, '\n') !==
                readFileSync(join(kitRoot, path), 'utf8').replace(/\r\n/g, '\n')
            )
              add(
                'seed.review',
                'warning',
                `.agents/${path}`,
                'Guide differs from the current seed. It may be customized or older; compare and merge manually. No automatic refresh or ownership is inferred.',
                'review',
              );
          } catch {
            add(
              'file.unsafe',
              'error',
              `.agents/${path}`,
              'Seed guide path is linked or cannot be inspected safely; no guide content was read.',
              'review',
            );
          }
        }
      }
      safeProjectPath(cwd, PROJECT_INSTRUCTIONS_PATH);
    } catch {
      missingFiles.length = 0;
      for (const finding of findings) {
        if (finding.remediation === 'create-missing') finding.remediation = 'review';
      }
      add(
        'kit.unreadable',
        'error',
        '',
        'Cannot prepare expected kit files from this source/configuration. No repair writes are allowed.',
        'review',
      );
    }
  } else {
    for (const path of ['AGENTS.md', 'skills/catalog.json', '.agents/memory/MEMORY.md'])
      checkFile(path, 'error');
    for (const agent of agents) {
      const path = AGENT_SPECS[agent].output;
      if (path !== 'AGENTS.md') checkFile(path, 'error', undefined, agent);
    }
    if (existsSync(join(cwd, 'AGENTS.md')))
      add(
        'instructions.project-owned',
        'warning',
        'AGENTS.md',
        'Project instructions already exist. Preserve and reconcile them during adoption; do not run a blind forced init.',
        'review',
      );
  }

  for (const path of ['AGENTS.md', 'IMPLEMENTATION-PROMPT.md']) {
    const absolute = join(cwd, path);
    if (!existsSync(absolute) || !lstatSync(absolute).isFile()) continue;
    const text = readFileSync(absolute, 'utf8');
    if (/build[ -]?kit[^.]{0,120}(?:éventuell?e?|optional)/i.test(text))
      add(
        'instructions.optional-kit',
        'warning',
        path,
        'Instructions describe the kit as optional. Review whether that matches the requested delivery method; this is a heuristic, not semantic validation.',
        'review',
      );
    if (/(?:choisir|choose)\s+(?:le\s+)?(?:langage|language),?\s*(?:le\s+)?framework/i.test(text))
      add(
        'instructions.stack-review',
        'warning',
        path,
        'Review autonomous language/framework selection against user-owned stack decisions. Preserve established choices; study and await required open choices.',
        'review',
      );
    if (
      path === 'IMPLEMENTATION-PROMPT.md' &&
      !installed &&
      !/composed-kit|\.composed-kit-version/i.test(text)
    )
      add(
        'instructions.bootstrap-missing',
        'warning',
        path,
        'Implementation prompt has no explicit kit installation check. Add a pinned delivery-method prerequisite distinct from product/validation inputs.',
        'review',
      );
  }

  if (installed?.agents.includes('claude-code') && agents.includes('claude-code')) {
    const mirror = planClaudeMemory({ projectRoot: cwd });
    if (mirror.status !== 'linked') {
      add(
        `claude.memory-${mirror.status}`,
        'warning',
        '.agents/memory',
        `Claude Code memory: ${mirror.status}. ${mirror.reason} Expected: ${mirror.destination ?? 'unresolved'}. Legacy paths: ${mirror.legacy_paths.join(', ') || 'none'}. Diagnosis never modifies the user home; use an explicitly reviewed --claude-memory=link plan where supported.`,
        'review',
        'claude-code',
      );
    }
  }
  return {
    missingFiles,
    result: {
      format_version: 1,
      scope: 'installation-and-instructions',
      runtime_verification: 'not_performed',
      cwd,
      agents,
      installation,
      healthy: !findings.some((finding) => finding.severity === 'error'),
      errors: findings
        .filter((finding) => finding.severity === 'error')
        .map((finding) => finding.message),
      warnings: findings
        .filter((finding) => finding.severity === 'warning')
        .map((finding) => finding.message),
      findings,
    },
  };
}
