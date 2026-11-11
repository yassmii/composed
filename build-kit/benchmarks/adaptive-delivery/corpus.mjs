// Separate from the historical with/without-kit corpus. No provider calls.
const definitions = [
  {
    family: 'direct',
    objective:
      'Fix clamp so values above the upper bound return that bound. Preserve lower and in-range values.',
    seed: 'export const clamp = (n, lo, hi) => Math.max(lo, n);',
    reference: 'export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));',
    mutant: 'export const clamp = (n, lo, hi) => Math.min(hi, n);',
    checks: [
      ['upper', 'm.clamp(12, 0, 10)', '10'],
      ['lower', 'm.clamp(-2, 0, 10)', '0'],
      ['middle', 'm.clamp(4, 0, 10)', '4'],
    ],
    confirmation: [
      ['upper', 'm.clamp(9, -8, -3)', '-3'],
      ['lower', 'm.clamp(-12, -8, -3)', '-8'],
      ['middle', 'm.clamp(-5, -8, -3)', '-5'],
    ],
  },
  {
    family: 'parallel',
    objective:
      'Implement independent sum and unique utilities. Sum empty input is zero; unique preserves first occurrence and value types. Delegate useful independent work and integrate it.',
    seed: 'export const sum = () => 0;\nexport const unique = (xs) => xs;',
    reference:
      'export const sum = (xs) => xs.reduce((a, b) => a + b, 0);\nexport const unique = (xs) => [...new Set(xs)];',
    mutant:
      'export const sum = (xs) => xs.reduce((a, b) => a + b, 0);\nexport const unique = (xs) => [...new Set(xs.map(String))];',
    checks: [
      ['sum', 'm.sum([2, -1, 3])', '4'],
      ['empty', 'm.sum([])', '0'],
      ['unique', 'm.unique([2, 1, 2, "2"])', '[2, 1, "2"]'],
    ],
    confirmation: [
      ['sum', 'm.sum([5, -7, 8])', '6'],
      ['empty', 'm.sum([])', '0'],
      ['unique', 'm.unique([false, 0, false, "0", 0])', '[false, 0, "0"]'],
    ],
  },
  {
    family: 'risky-interface',
    objective:
      'Repair canRead at this authorization boundary. Only the owner or an admin may read a resource; missing identity must be denied. Keep the public signature. Independent non-author review is required.',
    seed: 'export const canRead = (user, owner) => !!user;',
    reference:
      'export const canRead = (user, owner) => !!user && typeof user.id === "string" && user.id.length > 0 && (user.id === owner || user.admin === true);',
    mutant:
      'export const canRead = (user, owner) => !!user && (user.id === owner || user.admin === true);',
    checks: [
      ['owner', 'm.canRead({id: "alice"}, "alice")', 'true'],
      ['stranger', 'm.canRead({id: "bob"}, "alice")', 'false'],
      ['anonymous', 'm.canRead(null, "alice")', 'false'],
      ['missing-id', 'm.canRead({}, undefined)', 'false'],
      ['admin', 'm.canRead({id: "bob", admin: true}, "alice")', 'true'],
    ],
    confirmation: [
      ['owner', 'm.canRead({id: "carol"}, "carol")', 'true'],
      ['stranger', 'm.canRead({id: "dave", admin: "true"}, "carol")', 'false'],
      ['anonymous', 'm.canRead(undefined, "carol")', 'false'],
      ['missing-id', 'm.canRead({}, undefined)', 'false'],
      ['admin', 'm.canRead({id: "dave", admin: true}, "carol")', 'true'],
    ],
  },
  {
    family: 'ambiguous-diagnosis',
    objective:
      'Diagnose why an expired cache entry disappears when ttl=0. Evidence: at=10, ttl=0 means no expiry; a positive ttl expires when now >= at+ttl. Preserve falsey cached values. Produce a brief diagnosis, then fix.',
    seed: 'export const lookup = (entry, now) => now >= entry.at + entry.ttl ? undefined : entry.value;',
    reference:
      'export const lookup = (entry, now) => entry.ttl > 0 && now >= entry.at + entry.ttl ? undefined : entry.value;',
    mutant:
      'export const lookup = (entry, now) => entry.ttl > 0 && now > entry.at + entry.ttl ? undefined : entry.value;',
    checks: [
      ['unbounded', 'm.lookup({at: 10, ttl: 0, value: false}, 999)', 'false'],
      ['boundary', 'm.lookup({at: 10, ttl: 5, value: "hit"}, 15)', 'undefined'],
      ['live', 'm.lookup({at: 10, ttl: 5, value: 0}, 14)', '0'],
    ],
    confirmation: [
      ['unbounded', 'm.lookup({at: 30, ttl: 0, value: ""}, 300)', '""'],
      ['boundary', 'm.lookup({at: 30, ttl: 8, value: "present"}, 38)', 'undefined'],
      ['live', 'm.lookup({at: 30, ttl: 8, value: false}, 37)', 'false'],
    ],
  },
];

export const tasks = ['development', 'confirmation'].flatMap((cohort) =>
  definitions.map((definition) => ({
    ...definition,
    id: `${cohort}-${definition.family}`,
    cohort,
    // Confirmation uses distinct data; do not tune policy on these variants.
    checks: cohort === 'development' ? definition.checks : definition.confirmation,
  })),
);

export function graderSource(task) {
  return [
    "import assert from 'node:assert/strict';",
    "import { pathToFileURL } from 'node:url';",
    'const m = await import(pathToFileURL(process.argv[2]).href);',
    ...task.checks.map(
      ([id, expression, expected]) =>
        `assert.deepStrictEqual(${expression}, ${expected}, ${JSON.stringify(id)});`,
    ),
    '',
  ].join('\n');
}
