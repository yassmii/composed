import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const options = parseArgs(process.argv.slice(2));
const catalog = JSON.parse(readFileSync(join(root, 'skills/catalog.json'), 'utf8'));
const suite = JSON.parse(readFileSync(join(root, 'evals/scenarios.json'), 'utf8'));
const scenarios = selectScenarios(suite.scenarios, options.scenarios);
const adapter = await loadAdapter(options.adapter);
const outputDir = resolve(
  options.output ??
    join(root, 'evals/runs', `${options.adapter}-${new Date().toISOString().replaceAll(':', '-')}`),
);

mkdirSync(outputDir, { recursive: true });
const results = [];

for (const scenario of scenarios) {
  const input = {
    scenario,
    catalog,
    response_contract: {
      format: 'json',
      fields: ['primary_skill', 'risk', 'response', 'evidence', 'artifacts'],
      instruction:
        'Return JSON only. `response` contains the user-facing answer; `evidence` and `artifacts` are arrays of strings.',
    },
  };
  const startedAt = new Date().toISOString();
  const answer = await adapter.run(input, options);
  const grade = gradeAnswer(scenario, answer);
  const result = { scenario_id: scenario.id, started_at: startedAt, answer, grade };
  results.push(result);
  writeFileSync(join(outputDir, `${scenario.id}.json`), `${JSON.stringify(result, null, 2)}\n`);
}

const passed = results.filter((result) => result.grade.passed).length;
const summary = {
  adapter: options.adapter,
  generated_at: new Date().toISOString(),
  total: results.length,
  passed,
  failed: results.length - passed,
  score: results.length === 0 ? 0 : Number((passed / results.length).toFixed(3)),
  scenarios: results.map((result) => ({
    id: result.scenario_id,
    passed: result.grade.passed,
    failures: result.grade.failures,
  })),
};
writeFileSync(join(outputDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(
  `${summary.adapter}: ${passed}/${summary.total} passed (${Math.round(summary.score * 100)}%)`,
);
console.log(`Results: ${outputDir}`);

if (summary.failed > 0 && !options.allowFail) process.exit(1);

function parseArgs(argv) {
  const options = { adapter: 'fixture', scenarios: [], args: [], allowFail: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--adapter') options.adapter = requiredValue(argv, ++index, arg);
    else if (arg === '--scenario') options.scenarios.push(requiredValue(argv, ++index, arg));
    else if (arg === '--output') options.output = requiredValue(argv, ++index, arg);
    else if (arg === '--command') options.command = requiredValue(argv, ++index, arg);
    else if (arg === '--arg') options.args.push(requiredValue(argv, ++index, arg));
    else if (arg === '--allow-fail') options.allowFail = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

function requiredValue(argv, index, option) {
  const value = argv[index];
  if (!value) throw new Error(`${option} requires a value`);
  return value;
}

function selectScenarios(allScenarios, requestedIds) {
  if (requestedIds.length === 0) return allScenarios;
  const requested = new Set(requestedIds);
  const selected = allScenarios.filter((scenario) => requested.has(scenario.id));
  if (selected.length !== requested.size) {
    const found = new Set(selected.map((scenario) => scenario.id));
    throw new Error(
      `Unknown scenario: ${[...requested].filter((id) => !found.has(id)).join(', ')}`,
    );
  }
  return selected;
}

async function loadAdapter(name) {
  const builtIn = join(root, 'evals/adapters', `${name}.mjs`);
  const source = existsSync(builtIn) ? builtIn : resolve(name);
  if (!existsSync(source)) throw new Error(`Adapter not found: ${name}`);
  const adapter = await import(pathToFileURL(source).href);
  if (typeof adapter.run !== 'function')
    throw new Error(`Adapter ${name} must export run(input, options)`);
  return adapter;
}

function gradeAnswer(scenario, answer) {
  const failures = [];
  if (!answer || typeof answer !== 'object')
    return { passed: false, failures: ['adapter did not return an object'] };
  if (answer.primary_skill !== scenario.primary_skill) {
    failures.push(
      `primary_skill: expected ${scenario.primary_skill}, got ${String(answer.primary_skill)}`,
    );
  }
  if (answer.risk !== scenario.risk)
    failures.push(`risk: expected ${scenario.risk}, got ${String(answer.risk)}`);
  if (typeof answer.response !== 'string') {
    failures.push('response must be a string');
    return { passed: false, failures };
  }

  const response = answer.response.toLowerCase();
  for (const phrase of scenario.must_include) {
    if (!response.includes(phrase.toLowerCase())) failures.push(`missing: ${phrase}`);
  }
  for (const phrase of scenario.must_not) {
    if (response.includes(phrase.toLowerCase())) failures.push(`forbidden phrase: ${phrase}`);
  }
  if (!Array.isArray(answer.evidence)) failures.push('evidence must be an array');
  if (!Array.isArray(answer.artifacts)) failures.push('artifacts must be an array');
  return { passed: failures.length === 0, failures };
}
