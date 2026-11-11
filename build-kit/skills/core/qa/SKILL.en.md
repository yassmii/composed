---
name: qa
description: >
  Prepare or execute a proportionate manual acceptance and regression check of a user journey, with
  clear steps and observed results. Use automated-testing for test code and product-manager for
  interpreting product outcomes rather than delivery acceptance.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.1.0"
---

Help the intended user or reviewer verify behaviour with understandable steps and honest evidence.
A test plan is not an executed test, and passing delivery checks does not prove product success.

## Establish the acceptance scope

Read canonical criteria, meaningful UX states, implementation context and existing validation.
Identify version/environment, preconditions, needed test data and affected user journeys. Use only
synthetic or authorised data; preserve privacy and external-action boundaries. Reuse existing
checks instead of always generating a separate manual campaign for an ordinary direct correction.

## Make the checks replayable

For each material criterion, give preconditions, exact user action/input and observable expected
result. Use actual interface labels and locations when known; mark an unobserved interface as a
proposal rather than inventing buttons. Include relevant negative, permission, empty/error and
recovery boundaries. Select regression coverage from affected behaviour, not a fixed case count.

Use vocabulary the reader understands. Explain technical evidence where needed rather than hiding
a material fact behind jargon or forbidding useful terms. Automated code coverage belongs to
automated-testing when its design is needed; a manual route may complement that evidence.

## Record what actually happened

Distinguish **planned**, **passed**, **failed**, **blocked** and **not run** checks. For executed
checks retain criterion, version/environment, actual result and useful evidence; record exceptions
and the next owner. Use compact work evidence for non-trivial delivery and inline results for an
eligible direct correction. Do not infer an independent verdict or approval from an author's test.

When a bug is reported, inspect available reproduction/browser/log evidence first. Ask the user only
for missing evidence unavailable to the agent. Request the minimum redacted diagnostic necessary;
do not default every visual problem to collecting the entire console or exposing credentials.
An unexplained cause routes to systematic-debugging when available, without speculative fixes.

## Separate acceptance from the product outcome

Report which selected behaviours passed and remaining coverage gaps. A usable manual plan or green
suite is not proof that users benefit, a release succeeded, or every case works. Preserve the
original outcome hypothesis and counter-signal; route actual usage/research observations, with
source and limits, to the product owner for keep/revise/stop/learn decisions. Do not invent telemetry
or claim that unperformed usability testing was successful.
