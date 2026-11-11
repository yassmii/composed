import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const catalog = JSON.parse(readFileSync(join(root, 'skills/catalog.json'), 'utf8'));
const scenarios = JSON.parse(readFileSync(join(root, 'evals/scenarios.json'), 'utf8'));
const errors = [];

const policy = catalog.execution_policy;
const stackPolicy = catalog.stack_selection_policy;
const delivery = catalog.delivery_policy;
if (
  !delivery ||
  !['direct', 'planned', 'complex'].every(
    (mode) => typeof delivery[mode]?.evidence === 'string' && delivery[mode].evidence.length > 0,
  ) ||
  !Array.isArray(delivery.direct?.correction_conditions) ||
  delivery.direct.correction_conditions.length === 0 ||
  typeof delivery.loading !== 'string'
) {
  errors.push(
    'delivery_policy must distinguish direct, planned and complex evidence and eligibility',
  );
}
if (
  stackPolicy?.default !== 'ask-user-before-selection' ||
  !['new-project', 'poc', 'stack-change'].every((trigger) =>
    stackPolicy?.applies_to?.includes(trigger),
  ) ||
  !stackPolicy?.decision_states?.includes('pending') ||
  stackPolicy?.ready_states?.includes('pending') ||
  !['user-selected', 'user-delegated', 'existing-project'].every((state) =>
    stackPolicy?.ready_states?.includes(state),
  ) ||
  !['stack-selection', 'scaffolding', 'dependency-installation', 'dependent-implementation'].every(
    (action) => stackPolicy?.pending_blocks?.includes(action),
  ) ||
  stackPolicy?.delegation !== 'explicit-stack-delegation-only' ||
  stackPolicy?.recommendation !== 'study-options-and-recommend-then-wait-for-user-choice'
) {
  errors.push('stack_selection_policy must wait for a user stack decision before dependent work');
}

if (
  policy?.default_mode !== 'multi-agent-required' ||
  policy?.minimum_native_delegations !== 1 ||
  policy?.unavailable !== 'block-before-implementation' ||
  policy?.single_agent_override !== 'explicit-user-request-only' ||
  policy?.delegation_record !== '.agents/work/<work-item>/agents.md' ||
  !catalog.artifact_protocol?.files?.includes('agents.md')
) {
  errors.push(
    'execution_policy must require real native delegation, evidence and explicit override',
  );
}

// Structural policy checks only: no model calls or claims of runtime compliance.
const assignment = catalog.model_assignment_policy;
const requiredLists = {
  qualification: [
    'deliverable',
    'acceptance',
    'risk',
    'unknowns',
    'required_tools',
    'dependencies',
    'write_scope',
    'evidence',
  ],
  eligibility: ['tools', 'data_transmission', 'permissions', 'user_constraints', 'availability'],
  capability_states: ['available', 'unavailable', 'unknown'],
  optional_profiles: ['fast', 'standard', 'deep'],
  authority: [
    'applicable_user_and_project_constraints',
    'session_choices_within_scope',
    'local_defaults',
  ],
  brief: [
    'outcome',
    'useful_sources',
    'constraints',
    'write_ownership',
    'exit_criteria',
    'result_format',
    'attempt_limit',
  ],
  record: [
    'assignment_reason',
    'execution_mode',
    'runtime_id',
    'requested_model',
    'observed_model',
    'workspace',
    'status',
    'duration_if_available',
    'result',
    'evidence',
  ],
};
for (const [key, values] of Object.entries(requiredLists)) {
  const actual = assignment?.[key];
  if (!Array.isArray(actual) || values.some((value) => !actual.includes(value))) {
    errors.push(`model_assignment_policy.${key} must include ${values.join(', ')}`);
  }
}
if (JSON.stringify(assignment?.authority) !== JSON.stringify(requiredLists.authority)) {
  errors.push(
    'model_assignment_policy.authority must preserve constraint/session/default precedence',
  );
}
if (assignment?.no_remote_fallback !== true) {
  errors.push('model_assignment_policy must prohibit silent local-to-remote fallback');
}
for (const key of [
  'scope',
  'profiles',
  'selection',
  'configuration',
  'scheduling',
  'escalation',
  'validation',
  'trace',
]) {
  if (typeof assignment?.[key] !== 'string' || !assignment[key].trim()) {
    errors.push(`model_assignment_policy.${key} must be non-empty guidance`);
  }
}

if (!Array.isArray(catalog.skills) || catalog.skills.length === 0) {
  errors.push('catalog.skills must be a non-empty array');
}

const names = new Set();
for (const skill of catalog.skills ?? []) {
  if (!skill.name || !skill.level || !skill.when || !skill.not_when || !skill.risk) {
    errors.push(`incomplete contract for ${skill.name ?? '<unnamed>'}`);
    continue;
  }
  if (names.has(skill.name)) errors.push(`duplicate skill: ${skill.name}`);
  names.add(skill.name);
  for (const lang of ['fr', 'en']) {
    const path = join(root, 'skills', skill.level, skill.name, `SKILL.${lang}.md`);
    if (!existsSync(path)) {
      errors.push(`missing ${path}`);
      continue;
    }
    const content = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
    const frontmatter = /^---\n([\s\S]*?)\n---/.exec(content)?.[1];
    if (!frontmatter || !frontmatter.split('\n').includes(`name: ${skill.name}`)) {
      errors.push(`frontmatter name does not match catalog: ${path}`);
    }
  }
}

const scenarioIds = new Set();
for (const scenario of scenarios.scenarios ?? []) {
  if (scenarioIds.has(scenario.id)) errors.push(`duplicate scenario: ${scenario.id}`);
  scenarioIds.add(scenario.id);
  if (
    !scenario.id ||
    !scenario.prompt ||
    !scenario.risk ||
    !Array.isArray(scenario.must_include) ||
    !Array.isArray(scenario.must_not)
  ) {
    errors.push(`incomplete eval scenario ${scenario.id ?? '<unnamed>'}`);
    continue;
  }
  if (!names.has(scenario.primary_skill)) {
    errors.push(`scenario ${scenario.id} references unknown skill ${scenario.primary_skill}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `✗ ${error}`).join('\n'));
  process.exit(1);
}

console.log(
  `✓ Agentic catalog: ${names.size} skills, ${scenarios.scenarios.length} evaluation scenarios`,
);
