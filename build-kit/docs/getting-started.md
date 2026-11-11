# Getting started with Composed Build Kit

## Choose your starting point

Open your agent in the project and describe what you want to do. A known document or handoff link
helps, but you do not need to collect every source, acceptance ID or command first. The agent starts
with project instructions and the README, then follows relevant decisions, memory and work links.
If a needed source is inaccessible or several active tasks fit, it asks a targeted question.

Already installed? Start below. Otherwise, follow [installation](#install) first. For product
exploration alone, you can read the [contracts](../../contracts/README.md) without installing the kit.

### A new product need

> I want to define a wealth-advisory product for advisers in France. What can we reuse, and what
> do we need to decide first?

Expect a relevant contract and its version/status, what it covers, and the next product decision.
The agent looks in the accessible Composed checkout or project references; if neither supplies the
contract, it asks where to find it. It preserves draft status and proposes any missing rules explicitly.
See the [worked starting point](../examples/starting-paths/README.md#a-new-product-need).

### An existing project with agreed decisions

> Continue the task-filter feature using the decisions already in this project.

Expect the agent to find the brief, agreed stack and acceptance criteria, inspect the current code,
and advance the next authorised slice. It reuses completed work and reports actual checks with their
limits. A material contradiction or missing decision blocks only the affected action.
See the [worked starting point](../examples/starting-paths/README.md#an-existing-project-with-agreed-decisions).

### A correction or work to resume

> Correct the empty-state wording: when every task is completed, say “No open tasks”.

Or:

> Resume the task-filter work and take the next step.

Expect a scoped correction with relevant checks, or a current state recovered from the work and its
sources. An old green result needs its applicability checked. If the intended work is ambiguous,
the agent asks which item to resume. See the [worked resume](../examples/starting-paths/README.md#a-correction-or-work-to-resume).

At a handoff or a decision point, the useful response says what is done, what was actually verified,
what remains open and who takes the next action, with source links. The examples show this response;
a small correction can simply report its change and check.

## Install

You need Node 20+ and npm from the same OS, a target Git repository, and your chosen coding agent.
Node runs the kit; your project keeps its own stack. The standalone npm package is not published.

Clone Composed and install its dependencies once:

```bash
git clone https://github.com/yassmii/composed.git
cd composed
npm ci
```

Then, from your project's root, run the checked-out kit (replace `/path/to/composed`):

```bash
node /path/to/composed/build-kit/bin/composed-kit.mjs init
```

Choose the instruction language, **the agent you actually use**, and skills. Core is the default
starting set; Support adds situational specialists, and Extras adds presentations. You can add
Support later. The wizard's “agents” choice installs instructions for those tools; it does not
install or launch the tools themselves. See [options and installed files](adoption.md#installation-options).

If existing instructions conflict, installation stops before project writes. Follow
[safe adoption](adoption.md#fresh-or-manual-projects) to preserve them. After installation, open a
fresh agent session in the project and use one of the requests above.

## Decisions and checks

Your product rules come from the selected contract and accepted project decisions. An existing
stack is reused; a new stack needs your choice or explicit delegation before scaffolding. Keep
available external skills and tools: the agent selects the expertise needed without repeating an
already completed workshop. See [skill cooperation](skill-catalog.md#use-an-external-skill).

Work follows its scope and risk: small eligible corrections stay direct; substantial work keeps
applicable evidence and independent review. Complex implementation requires actual native delegation
unless you explicitly choose single-agent execution; that choice does not waive a required review.
The kit cannot supply missing runtime capabilities. See [proportionate delivery](proportionate-delivery.md).
Passing checks establish selected behaviour; user benefit needs separate observation.

## When you need more

| Need | Reference |
| --- | --- |
| See the three paths with actual source files and a runnable check | [Worked starting paths](../examples/starting-paths/README.md) |
| Check a change, reuse evidence or validate against a contract | [Validation by task](validation.md) |
| Update, switch language, preserve local instructions or remove the kit | [Safe adoption and lifecycle](adoption.md) |
| Diagnose an installation or preview a repair | [Diagnostics](diagnostics.md) |
| Recover decisions and work across sessions | [Knowledge and resume](knowledge-lifecycle.md#resume-an-active-work-item) |
| Understand delivery evidence and product learning | [Product delivery](product-delivery.md) |
| Check delegation, reviews or write access | [Runtime capabilities](runtime-capabilities.md) |
