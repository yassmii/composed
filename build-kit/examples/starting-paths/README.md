# Three worked starting paths

These are authored walkthroughs using files in this checkout, not transcripts of independent agent
sessions or a user study. They show the input, sources to recover, remaining decision and next action.
The task-filter cases reuse a synthetic example; its decisions are fixed for the exercise only.
The command below executes real local assertions. Sample responses apply only to the stated sources
and results; rerun and inspect before using them as current evidence.

## A new product need

**Starting context:** an agent can read this Composed source checkout. No project or stack exists yet.
The person supplies the need, not paths to individual contract clauses:

> I want to define a wealth-advisory product for advisers in France. What can we reuse, and what
> do we need to decide first?

The [root README](../../../README.md) leads to the [contract index](../../../contracts/README.md).
Following the [consumer instructions](../../../contracts/AGENTS.md), inspect the
[wealth-advisory entry](../../../contracts/product-types/wealth-advisory/README.md), its
[contract](../../../contracts/product-types/wealth-advisory/contracts/contract.yaml),
[research](../../../contracts/product-types/wealth-advisory/research/comparison.md) and
[author review](../../../contracts/product-types/wealth-advisory/contracts/review.md).

| Recovered from the sources | Still needs a decision |
| --- | --- |
| `wealth-advisory@0.1.0`, format 0.2, **draft**; a candidate to reuse, not an adopted project pin. | Whether this contract fits the intended service and which version the project will adopt. |
| The draft covers discovery, balance sheet, diagnosis, scenarios, recommendations, handover and follow-up. | Which advice domain and client situation to examine first, with the responsible professional. |
| `REQ-WAD-001/002` require an explicit service scope; `REQ-WAD-015` bounds specialised models. | The service profile and models actually supported. The contract does not make these choices for a new project. |
| The author review keeps business review open and product cases unexecuted. No stack is selected. | Product review before claiming maturity; a stack choice before technology-dependent implementation. |

A useful first response, grounded in those sources:

> I found the wealth-advisory draft. It already covers the advice and follow-up journey, but the
> service profile and specialised models still need business review. To make that review concrete,
> which advice domain and client situation should we examine first? I can then map that choice to
> the existing requirements and identify the gaps. No product acceptance has been demonstrated.

**Next owner/action:** the product owner supplies that priority; the agent prepares a focused
coverage/gap assessment using the existing IDs. It does not restart the entire product definition.
In another project, first follow its existing contract references. If the checkout is unavailable,
ask for access or its location; installing the Build Kit does not copy product contracts.
These contract observations describe the repository draft, not legal or financial advice.

## An existing project with agreed decisions

**Starting context:** the agent is working on the repository's `product-loop` teaching example.
Its [README](../product-loop/README.md) identifies the scope and Node.js ESM environment. For this
exercise, use D1 as the supplied decision; it is not an actual customer's approval or a Composed
product-contract pin. The request names the feature without enumerating its source files:

> Continue the task-filter feature using the decisions already in this project.

The README links the sources the agent needs:

| Source found | What it settles |
| --- | --- |
| [product.md, D1](../product-loop/product.md#d1-illustrative-delivery-decision) | Opt-in open tasks, all tasks by default, original order/identity, no deletion; persistence and accounts deferred. |
| [Acceptance A1–A6](../product-loop/product.md#acceptance) | Selection, two distinct empty states, reversibility/non-mutation and invalid mode. |
| [task-view.mjs](../product-loop/task-view.mjs) | The selected view-model behaviour is already implemented; no UI is present. |
| [verify.mjs](../product-loop/verify.mjs) and [acceptance.mjs](../product-loop/acceptance.mjs) | The existing check command, criteria and deliberately wrong implementation. |

From the repository root, with Node >=20 and no dependency installation:

```bash
node build-kit/examples/product-loop/verify.mjs
```

On the reference files, the expected result is exit 0, A1–A6 passing, and the wrong implementation
rejected (it fails A2 and A4). `product_effectiveness` remains `not_assessed`. An unexpected result
means investigate the actual failure before reporting completion.

After executing that command successfully, the response can be:

> D1's local filter is already implemented. The six acceptance checks passed, and the counterexample
> failed A2 and A4 as intended. The module slice is verified; the interface and user benefit are
> still unverified. If the next scope is a usable screen, the next decision is the host application
> and its existing stack. The UX states are already described in product.md.

**Next owner/action:** the product owner identifies the host application if UI integration is wanted;
the agent then inspects it and reuses its established stack. No new product/UX workshop or module
rewrite is justified by this request. For a real pinned-contract project, recover its pin and
acceptance IDs in the same way, and preserve them throughout implementation and verification.

## A correction or work to resume

**Starting context:** continue the same task-filter exercise with the
[sample handoff](resume.md). It deliberately contains an earlier, overbroad “filter validated” note
without execution evidence. This is a fictional stale-context fixture, not a historical test result.

> Resume the task-filter work and take the next step.

From the current work entry, follow the handoff to D1, the module, the README command and UX states.
Compare the note's claim with the actual scope: no interface is implemented, so “filter validated”
cannot establish a validated screen. Run the existing command above when current module evidence is
needed; a check run from this same unchanged context can be reused rather than repeated ritualistically.

After the successful check, a useful resume response is:

> The previous note overstates completion: only the local module is implemented. Current checks
> cover A1–A6 and reject the counterexample; no screen has been tested. The remaining UI work needs
> a host application. Which existing application should receive the filter? I will reuse its stack
> and the already described UX states.

**Next owner/action:** the product owner resolves that one scope question. The agent preserves the
earlier note and records the corrected scope in the actual work item. If multiple active items fit
“resume”, it first asks which one; it does not pick the most recently modified folder automatically.

For a bounded correction in an existing interface, identify the actual component and expected
behaviour, make the scoped change and report the relevant check. In this example there is no screen
whose label can be corrected: a wording request must not silently become permission to build one.

## What this demonstrates

The person supplies a need or names the work. Source links supply the detailed decisions, IDs and
check command. Each path ends in either a scoped result or one concrete next decision with an owner.
Existing instruction policies already cover source reuse, proportional work and resumption; these
walkthroughs do not establish how reliably a fresh agent follows them. That requires a separate
observed session, and easier use still requires user feedback.
