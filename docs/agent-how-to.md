# How to use Composed, for agents

This page is written for a coding agent that has been pointed at this repository. It tells you
what to do for each of the four things a person usually asks. Follow the section that matches
the request and skip the others.

There is no package to install. Everything here is plain files in a Git checkout, and you do the
setup yourself with the commands below.

## What is here

- `contracts/` holds product contracts: what a type of product must do, its rules, and the
  acceptance cases that prove it. They name no technology.
- `build-kit/` holds an optional delivery method: instructions and skills copied into a project.
- A separate repository, [composed-validation](https://github.com/yassmii/composed-validation),
  holds the suites that judge an implementation from outside.

Every contract is a release candidate or a draft. None is stable. Say so when you report.

## 1. Build a product from a contract

You need no installation for this.

1. Find the contract: `contracts/product-types/<family>/contracts/contract.yaml`. The table in
   the [README](../README.md#contracts) lists the families. If none fits the request, say so
   and stop; do not bend a contract to fit.
2. Pin it. Record in the project, before writing code: the contract `id` and `version`, the
   commit of this repository, and the SHA-256 of the contract file. Later work refers to those
   exact bytes.
3. Read the contract in full, then the family's `research/comparison.md`. The research explains
   why a clause exists.
4. Apply the [consumer protocol](../contracts/AGENTS.md). In short: invariants, policies and
   acceptance cases are not negotiable; cite a `REQ-`, `INV-`, `POL-`, `QA-` or `ACC-` identifier
   in each piece of work; do not add behaviour the contract does not state.
5. Ask the person for the stack. A contract never implies a language, framework or database, and
   neither does silence or "keep it simple".
6. Turn each acceptance case into a check that can fail. Work toward the next failing case.
7. Report one verdict per acceptance case: `pass`, `fail`, `blocked` or `not_run`. A case you did
   not execute is `not_run`, never `pass`. Do not write that the product conforms to the
   contract: your own tests are not an external verdict.

## 2. Install the Build Kit in a project

Do this only when the person wants the delivery method, not just a contract. It needs Node 20 or
later. Node runs the kit only; do not add Node or any dependency to the person's project.

Clone this repository outside the project and install the kit's own dependencies:

```bash
git clone https://github.com/yassmii/composed.git
cd composed && npm ci
```

Preview first. This writes nothing and prints the planned files and any conflict as JSON:

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs init --yes --dry-run --json \
  --lang=en --agents=codex --skills=core --cwd=/path/to/project
```

Then install with the same command without `--dry-run --json`. Choose the values:

| Option | Values |
| --- | --- |
| `--lang` | `en` or `fr` |
| `--agents` | One or more of `claude-code`, `codex`, `cursor`, `gemini`, `cline`, `windsurf`, `aider`, comma-separated. Pick the agent the person actually uses. |
| `--skills` | `core`, optionally with `support` and `extras`, comma-separated. Start with `core`. |

If you are an agent that is not in that list and you read `AGENTS.md` at the project root, use
`--agents=codex`: it writes `AGENTS.md` and nothing agent-specific. The skills are then plain
files under `skills/<level>/<name>/SKILL.md`; read the one whose trigger matches the task.

Rules while installing:

- If the preview lists a conflict, stop and show it to the person. Do not pass `--force` on your
  own: it replaces instructions they wrote.
- Project-specific rules go in `.agents/project-instructions.md`, which the kit never replaces.
- Check the result with `composed-kit.mjs doctor --cwd=/path/to/project`.
- Tell the person to start a fresh session in the project so the new instructions are loaded.

To update a project later, run `update` in place of `init`, with a preview first.

## 3. Get a verdict from outside

Your own tests show what you checked. An external suite shows what someone else's cases found.

1. Clone composed-validation next to this repository and run `npm ci`, then `npm run validate`.
2. Look for a profile under `profiles/<family>/`. Its suite guide is under
   `suites/<family>/<version>/README.md`. Not every contract has a profile, and most profiles
   have planned cases with no runner yet; the repository README says which is which.
3. Where a runner exists, write an adapter that translates the suite's actions to the product's
   public interface. Keep it black-box: it must not reach into the product's internals or compute
   the expected answers itself.
4. Run the suite against an immutable revision of the product and keep the report. Give the
   person the tally as it is, including `fail`, `blocked` and `not_run`.

Do not edit a suite to make a case pass. If a case looks wrong, describe why and leave the
decision to the person.

## 4. Work on rules the contract does not cover

Real products grow beyond their contract. When that happens, keep a judge: write the project's
own rules and acceptance cases in `.agents/work/<work-item>/acceptance.md` before implementing,
freeze them, and work toward the next failing case. The
[acceptance-led delivery guide](../build-kit/docs/acceptance-led-delivery.md) has the template.
Give local rules identifiers that cannot be confused with the contract's. A local rule never
weakens a contract clause.

If a rule would apply to every product of that type, tell the person it is a candidate for the
contract itself. Do not edit a pinned contract.

## What you must not do

- Change a contract, a pinned version or a validation suite to fit the implementation.
- Present a planned, skipped or unexecuted check as a result.
- Choose the stack for the person without being asked to.
- Claim conformance to a contract. Report cases and verdicts.
- Push, publish or send anything outside the project without the person asking.
