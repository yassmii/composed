// Original Composed acceptance example. External tools are prepared separately, never installed here.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { delimiter, dirname, isAbsolute, join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

const example = dirname(fileURLToPath(import.meta.url));
const kit = resolve(example, '../..');
const bridge = join(example, 'tool-bridge.py');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const jsonBytes = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = (path, value) => writeFileSync(path, jsonBytes(value), { flag: 'wx' });

function options(args) {
  const values = new Map();
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    const value = args[index + 1];
    if (
      !['--tools-root', '--python', '--output'].includes(name) ||
      values.has(name) ||
      !value ||
      value.startsWith('--')
    )
      throw new Error(
        'Usage: node verify.mjs --tools-root ABSOLUTE_DIRECTORY --python ABSOLUTE_EXECUTABLE --output NEW_DIRECTORY',
      );
    values.set(name, value);
  }
  if (
    values.size !== 3 ||
    !isAbsolute(values.get('--tools-root')) ||
    !isAbsolute(values.get('--python'))
  )
    throw new Error(
      'Supply --tools-root, --python (both absolute) and --output. No tools are installed automatically.',
    );
  const output = resolve(values.get('--output'));
  if (existsSync(output))
    throw new Error(
      'Output already exists; choose a new directory. Existing evidence is never replaced.',
    );
  if (Number(process.versions.node.split('.')[0]) < 20)
    throw new Error('The optional live example requires Node 20+ for its native LCOV reporter.');
  if (process.platform !== 'linux')
    throw new Error(
      'This pinned live-tool profile has been validated on Linux only. Other platforms are not assessed.',
    );
  return {
    root: resolve(values.get('--tools-root')),
    python: values.get('--python'),
    output,
  };
}

export function runExample(args) {
  const { root, python, output } = options(args);
  // A prepared interpreter is explicit authority to execute it; this is not a sandbox.
  const environment = {
    ...process.env,
    PATH: `${dirname(process.execPath)}${delimiter}${process.env.PATH ?? ''}`,
    PYTHONDONTWRITEBYTECODE: '1',
  };
  const inspect = spawnSync(python, ['-I', bridge, 'inspect', root], {
    encoding: 'utf8',
    timeout: 30000,
    maxBuffer: 2 * 1024 * 1024,
    env: environment,
    shell: false,
  });
  if (inspect.error || inspect.signal || inspect.status !== 0)
    throw new Error(
      `Prepared tools are unavailable: ${inspect.error?.message ?? inspect.stderr ?? inspect.status}`,
    );
  const context = JSON.parse(inspect.stdout);
  context.node = {
    version: process.version,
    executable: process.execPath,
    arch: process.arch,
  };
  context.example = {
    checker_sha256: hash(readFileSync(fileURLToPath(import.meta.url))),
    bridge_sha256: hash(readFileSync(bridge)),
    fixture_sha256: Object.fromEntries(
      [
        'access.mjs',
        'weak.test.mjs',
        'strong.test.mjs',
        'duplicates.ts',
        'assertions.mjs',
        'cases.json',
        'labels.mjs',
        'fixture-spec.md',
      ].map((name) => [name, hash(readFileSync(join(example, 'fixtures', name)))]),
    ),
  };
  mkdirSync(output); // Parent must exist. Explicit output remains available, including after failure.
  mkdirSync(join(output, 'commands'));
  writeJson(join(output, 'environment.json'), context);
  let sequence = 0;
  const executions = [];

  function execute(label, command, cwd, expected = 0, timeout = 30000) {
    const ordinal = String(++sequence).padStart(2, '0');
    const stem = join(output, 'commands', `${ordinal}-${label}`);
    const start = Date.now();
    const monotonic = performance.now();
    const result = spawnSync(command[0], command.slice(1), {
      cwd,
      encoding: 'utf8',
      timeout,
      maxBuffer: 2 * 1024 * 1024,
      env: environment,
      shell: false,
    });
    const finish = Date.now();
    writeFileSync(`${stem}.stdout`, result.stdout ?? '', { flag: 'wx' });
    writeFileSync(`${stem}.stderr`, result.stderr ?? '', { flag: 'wx' });
    const record = {
      command,
      cwd,
      exit_code: result.status,
      signal: result.signal,
      error: result.error?.message ?? null,
      started_at: new Date(start).toISOString(),
      finished_at: new Date(finish).toISOString(),
      duration_ms: Math.round(performance.now() - monotonic),
      duration_source: 'monotonic',
      wall_clock_regressed: finish < start,
      expected_exit_code: expected,
      stdout_sha256: hash(result.stdout ?? ''),
      stderr_sha256: hash(result.stderr ?? ''),
      limitations: [
        'Deadline/output bounds cover the direct child; arbitrary descendants are not supervised.',
      ],
    };
    writeJson(`${stem}.json`, record);
    executions.push(record);
    if (result.error || result.signal || result.status !== expected)
      throw new Error(
        `${label} did not complete with expected exit ${expected}: ${record.error ?? record.signal ?? result.status}; inspect ${stem}`,
      );
    return result;
  }

  function fixture(name, test) {
    const directory = join(output, name);
    mkdirSync(directory);
    for (const subdir of ['src', 'tests', 'checker', 'coverage'])
      mkdirSync(join(directory, subdir));
    copyFileSync(join(example, 'fixtures/access.mjs'), join(directory, 'src/access.mjs'));
    copyFileSync(join(example, 'fixtures/duplicates.ts'), join(directory, 'src/duplicates.ts'));
    copyFileSync(join(example, 'fixtures', test), join(directory, 'tests/access.test.mjs'));
    for (const name of ['assertions.mjs', 'cases.json', 'labels.mjs'])
      copyFileSync(join(example, 'fixtures', name), join(directory, 'checker', name));
    copyFileSync(join(example, 'fixtures/fixture-spec.md'), join(directory, 'fixture-spec.md'));
    writeJson(join(directory, 'package.json'), {
      private: true,
      type: 'module',
      scripts: { test: 'node --test tests/access.test.mjs' },
    });
    writeJson(join(directory, 'tool-context.json'), context);
    return directory;
  }

  function analyze(name, test, outcome, code) {
    const directory = fixture(name, test);
    const coverage = execute(
      `${name}-coverage`,
      [
        process.execPath,
        '--test',
        '--experimental-test-coverage',
        '--test-reporter=lcov',
        'tests/access.test.mjs',
      ],
      directory,
    );
    writeFileSync(join(directory, 'coverage/lcov.info'), coverage.stdout, {
      flag: 'wx',
    });
    assert.ok(
      coverage.stdout.includes('SF:src/access.mjs'),
      'Native coverage must identify the selected actual source.',
    );
    const subjects = [
      'src/access.mjs',
      'tests/access.test.mjs',
      'checker/assertions.mjs',
      'checker/cases.json',
      'checker/labels.mjs',
      'fixture-spec.md',
      'package.json',
      'coverage/lcov.info',
      'tool-context.json',
    ];
    const baseline = execute(
      `${name}-baseline-evidence`,
      [
        process.execPath,
        join(kit, 'bin/composed-kit.mjs'),
        'evidence',
        'run',
        '--cwd',
        directory,
        ...subjects.flatMap((subject) => ['--subject', subject]),
        '--requirement',
        'EXAMPLE-BOUNDARY-001',
        '--acceptance',
        'EXAMPLE-TEST-001',
        '--output',
        'baseline-receipt.json',
        '--json',
        '--',
        process.execPath,
        '--test',
        'tests/access.test.mjs',
      ],
      directory,
    );
    assert.equal(JSON.parse(baseline.stdout).healthy, true);
    for (const [tool, argv, expected] of [
      ['crapper', ['--use-existing-coverage', 'src/access.mjs'], 0],
      ['dryer', ['src/duplicates.ts'], 0],
      [
        'mutator',
        [
          '--use-existing-coverage',
          '--mutate-all',
          '--max-workers',
          '1',
          '--verbose',
          'src/access.mjs',
        ],
        code,
      ],
    ])
      execute(
        `${name}-${tool}`,
        [python, '-I', bridge, 'run', root, tool, ...argv],
        directory,
        expected,
        120000,
      );
    const facts = JSON.parse(
      execute(`${name}-facts`, [python, '-I', bridge, 'facts', root, directory], directory).stdout,
    );
    assert.equal(facts.boundary_mutant.status, outcome);
    assert.equal(facts.mutation_forms[0].sites, 1);
    assert.equal(facts.mutation_forms[0].uncovered, 0);
    assert.ok(Number.isFinite(facts.eligible.crap) && facts.eligible.coverage > 0);
    assert.ok(
      facts.duplicate_candidates.length > 0,
      'The duplicate fixture must produce a real candidate.',
    );
    writeJson(join(directory, 'observed-fixture-facts.json'), facts);
    return { directory, facts };
  }

  const weak = analyze('weak-tests', 'weak.test.mjs', 'survived', 3);
  const strong = analyze('strong-tests', 'strong.test.mjs', 'killed', 0);
  assert.equal(
    hash(readFileSync(join(weak.directory, 'src/access.mjs'))),
    hash(readFileSync(join(strong.directory, 'src/access.mjs'))),
  );

  // Independently attribute this one known mutant to a compiling behavioral counterexample.
  const counterexample = fixture('semantic-counterexample', 'strong.test.mjs');
  const original = readFileSync(join(counterexample, 'src/access.mjs'), 'utf8');
  writeFileSync(join(counterexample, 'src/access.mjs'), original.replace('>= 24', '> 24'));
  execute(
    'counterexample-compiles',
    [process.execPath, '--check', 'src/access.mjs'],
    counterexample,
  );
  const rejection = execute(
    'counterexample-assertion',
    [process.execPath, '--test', 'tests/access.test.mjs'],
    counterexample,
    1,
  );
  assert.ok(
    rejection.stdout.includes('ERR_ASSERTION'),
    'The compiling counterexample must fail its observable boundary assertion.',
  );

  const staleReports = {};
  for (const [name, path, bytes] of [
    ['tests', 'tests/access.test.mjs', readFileSync(join(example, 'fixtures/strong.test.mjs'))],
    [
      'checker',
      'checker/assertions.mjs',
      `${readFileSync(join(weak.directory, 'checker/assertions.mjs'), 'utf8')}\n// Changed checker bytes.\n`,
    ],
    [
      'configuration',
      'checker/cases.json',
      jsonBytes({
        ordinary: [{ hours: 48, expected: true }],
        boundary: { hours: 24, expected: true },
      }),
    ],
    [
      'dependency',
      'checker/labels.mjs',
      `${readFileSync(join(weak.directory, 'checker/labels.mjs'), 'utf8')}\n// Changed selected dependency bytes.\n`,
    ],
  ]) {
    const stale = join(output, `stale-${name}`);
    cpSync(weak.directory, stale, { recursive: true });
    writeFileSync(join(stale, path), bytes);
    const report = JSON.parse(
      execute(
        `changed-${name}-invalidate`,
        [
          process.execPath,
          join(kit, 'bin/composed-kit.mjs'),
          'verify',
          '--cwd',
          stale,
          '--evidence',
          'baseline-receipt.json',
          '--json',
        ],
        stale,
        1,
      ).stdout,
    );
    assert.equal(report.applicability, 'stale');
    assert.equal(report.recorded_status, 'passed');
    assert.equal(
      hash(readFileSync(join(stale, 'src/access.mjs'))),
      hash(readFileSync(join(weak.directory, 'src/access.mjs'))),
    );
    staleReports[name] = report;
  }
  writeJson(join(output, 'stale-reports.json'), staleReports);

  const after = JSON.parse(
    execute('post-run-environment', [python, '-I', bridge, 'inspect', root], output).stdout,
  );
  for (const key of ['sources', 'distributions', 'grammar_cache'])
    assert.deepEqual(
      after[key],
      context[key],
      `Selected prepared ${key} changed during the example.`,
    );
  writeJson(join(output, 'executions.json'), executions);
  const summary = {
    format_version: 1,
    scope: 'synthetic-engineering-quality-example',
    status: 'passed',
    weak_tests: {
      baseline: 'passed',
      boundary_mutant: 'survived',
      tool_exit_code: 3,
    },
    strong_tests: {
      baseline: 'passed',
      boundary_mutant: 'killed',
      tool_exit_code: 0,
    },
    counterexample: { compiles: true, boundary_assertion_failed: true },
    changed_tests: {
      source_unchanged: true,
      historical_result: 'passed',
      applicability: 'stale',
    },
    changed_checker_configuration_dependency: {
      source_unchanged: true,
      applicability: 'stale',
      controls: Object.keys(staleReports),
    },
    duplicate_decision:
      'retain separate synthetic domain labels; similarity is a review candidate, not authority to merge',
    quality_gate: 'informational',
    product_conformance: 'not_assessed',
    limitations: [
      'Illustrative EXAMPLE identifiers do not declare or satisfy a normative product contract.',
      'Native EDN metrics and the selected fixture checks do not certify arbitrary tests, architecture or product quality.',
      'Prepared tools and caches are inspected, not network/process sandboxed or authenticated.',
      'Receipt verification checks selected fixture files; external engine/interpreter dependencies require a new live context inspection, not just the unchanged context snapshot.',
      'The engine does not expose elimination reasons; independent attribution applies only to the explicit compiling counterexample.',
    ],
  };
  writeJson(join(output, 'summary.json'), summary);
  console.log(JSON.stringify({ ...summary, artifacts: output }, null, 2));
  return summary;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    runExample(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
