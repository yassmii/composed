# Worked product loop: optional open-task filter

This example is authored synthetic teaching material. It contains no customer research, real usage
observations, approved product decision or delivered application. The reference is a small pure
module, using the Build Kit's existing Node.js ESM environment only to make selected behaviour
executable. It does not select a stack for projects that install the kit.

Follow the loop:

1. [Product source](product.md): P1 problem, H1 hypothesis, D1 illustrative decision, A1–A6 acceptance
   and the UX states that an eventual UI must support.
2. [Reference module](task-view.mjs): authored implementation of selected view-model behaviour.
3. [Acceptance checks](acceptance.mjs) and [verification command](verify.mjs): actual local execution
   against that module and a plausible wrong implementation.
4. [Learning source](learning.md): explicitly fictional observation, unresolved effectiveness and
   a revisitable next decision. It is not evidence produced by the acceptance command.

From this directory, with Node.js >=20 and no install step or dependencies:

```bash
node verify.mjs
```

From the repository root:

```bash
node build-kit/examples/product-loop/verify.mjs
```

The command exits 0 only if the reference passes all six criteria and the semantic counterexample
is rejected. It prints each assertion result as JSON and keeps `product_effectiveness: not_assessed`.
A green command is evidence that these selected code assertions executed; it is not a completed user
journey, independent review, real-agent delivery or a product-success score. There are no network,
telemetry, recruitment or deployment actions.

## What remains unverified

No interface is implemented: labels, keyboard/focus, screen-reader feedback and usability in
[the UX state proposal](product.md#ux-state-handoff) are not tested here. The module receives an
already-valid local task array; storage, authentication, transport, loading and error recovery are
outside this example. Real users, source/version-specific integration and independent delivery
review would be needed for a real feature. No data in [learning.md](learning.md) is collected by
these scripts.

For minimal requests, source recovery and reassessing an overbroad handoff, see the
[worked starting paths](../starting-paths/README.md). They reuse this module without adding an application.
