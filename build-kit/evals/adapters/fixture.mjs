/** Deterministic adapter used to verify the harness without calling a model. */
export async function run({ scenario }) {
  return {
    primary_skill: scenario.primary_skill,
    risk: scenario.risk,
    response: scenario.must_include.join('\n'),
    evidence: ['fixture response'],
    artifacts: [],
  };
}
