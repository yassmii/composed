# Why Composed

[Version française](vision.fr.md)

Draft introduction to the project, written on 5 November 2026. This text sets out the reasoning
behind Composed. It does not describe current progress; see the component READMEs for that.

## Code is no longer the expensive part

For thirty years, the difficulty of a piece of software was measured by how much code had to be
written. Methods, tools and teams were organised around that constraint. It is disappearing. An
agent produces in an hour what a team produced in a week, and will do it again tomorrow in
another stack if asked.

What remains expensive is everything else: knowing precisely which product to build, which rules
it must never break, how to recognise that it is ready, and how to prove that what was built
matches what was wanted. Today that knowledge lives in prompts, tickets, mock-ups and a few
people's heads. It is rewritten for every project, rarely checked, never shared.

Composed starts from this observation: product knowledge deserves the same treatment as code.
Versioned, reviewed, testable, reusable, and independent of the technology that implements it.

## A product contract, not a technical specification

A Composed contract defines a type of product: a SaaS booking service, an online shop, a
collaborative workspace, a scriptable 3D engine. It states the promise made to the user, the
actors and their permissions, the entities and their lifecycle, the invariants that are not up
for negotiation, the policies, the acceptance criteria, and the evidence expected before the
product is declared ready.

It names no language, framework or database. A Rust implementation and a TypeScript
implementation can both conform to the same contract. That is what makes it reusable, and what
makes implementations comparable.

Every clause carries a stable identifier. A commit, a test or a review cites the identifier it
serves. A capability missing from the contract is not invented along the way: it goes through a
versioned proposal. The contract is the source of truth for the product, and the code answers to
it, not the other way round.

## Contracts grounded in research, not opinion

A contract is not a wish list. Each product type begins with a study of comparable existing
products, from dated and versioned primary sources. Observations are atomic and attributed.
Where products converge, the convergence becomes a clause; where they diverge, the divergence
becomes an explicit design choice with its reason.

Traceability runs both ways: a clause points to the observations behind it, and a change in a
source triggers a review of the clauses that depend on it. A fashionable technique, a new
framework or a good benchmark score does not become a requirement by itself. Research proposes;
an identified authority decides; the decision is versioned.

## Evidence is separate from the claim

Three statements are too often confused: the agent says it is done, the tests pass, the product
does what it should. Composed keeps them apart.

A conformance suite, external to the implementation, runs the contract's acceptance scenarios
against the product through its public interfaces. It returns a verdict per case: passed,
failed, blocked, not run. A blocked case is not a success. A report identifies the contract
version, the profile version and the exact revision of the candidate. No overall conformance is
claimed until the full profile has been observed.

The judge itself is checked: it must accept a correct reference and reject a known defect and a
plausible mutant before its verdicts count. An unfavourable result is kept. An invariant is
never weakened to improve a score.

## Products evolve, and so do contracts

A product can conform to a contract that no longer describes the right outcome. Composed
therefore provides two loops that do not stop at the first delivery. Continuous research watches
sources, comparable products and counter-examples. Continuous improvement collects acceptance
failures, incidents and user corrections.

Both feed the same circuit: observe, triage, research, propose, decide, version, revalidate.
Identifiers stay stable or receive an explicit mapping. An existing implementation stays pinned
to its version until it chooses to adopt the change. Nothing changes silently under a project's
feet.

## The method is a means, not the centre

The Build Kit provides one way to consume a contract with agents: read the clauses, scope a
slice, choose the stack with the user, implement while citing identifiers, run the evidence, and
hand over in a form the next session can read. It is agnostic of the agent tool and installs
alongside whatever the project already uses.

It is not mandatory. A team with its own habits can produce a conforming implementation without
adopting it. The contract and its conformance suite are the standard; the kit is support. Its
own effects are measured by a paired benchmark, with and without the kit, and the results are
published as they are.

## What Composed would like to make possible

That one person, with an agent and the stack of their choice, can build a product of a known type
starting from a contract that has already been studied, reviewed and made testable, instead of
rediscovering everything. That two teams who do not know each other can implement the same
contract and have their disagreements flow back into the contract rather than stay in their
heads. That a conformance report means the same thing from one project to the next.

A standard is only worth its independent implementations. Composed publishes its contracts, its
suites, its reference implementations and its results, including those that are not in its
favour, so that others can reuse them, contradict them and improve them.
