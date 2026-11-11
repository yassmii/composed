# Agent operating system research

Status: **initial**.

- `sources.yaml` records every source with an immutable URL (a raw file pinned to an exact commit, or a versioned paper), a locator, the retrieval date, and a SHA-256 snapshot of the bytes at that URL.
- `observations.yaml` holds atomic, paraphrased facts about observable product behaviour. It does not carry interpretation or product choices.
- `comparison.md` separates convergence, divergence, and the resulting product choices.

The primary reference is AIOS (`agiresearch/AIOS`), the only candidate that presents itself as an operating system for LLM agents. It is read from its README and shared-memory document at commit `292d98f78c835499df18cdb6de6325bba1895862`, and from the peer-reviewed design paper (arXiv 2403.16971v5, COLM 2025). The repository at that commit contains no licence file; it is used only as read-only evidence and is paraphrased, never copied.

OpenHands is the comparison reference for agent execution: sandboxes, risk-based confirmation, event history, persistence, context condensation, secrets, and budgets. It is read from the official documentation repository (`OpenHands/docs`) at a pinned commit. The main OpenHands repository now hosts a desktop front end whose architecture page delegates sandboxing to other components, so it was not used.

The Model Context Protocol specification (revision 2026-07-28) is the reference for the tool boundary: user consent, untrusted tool metadata, and the duties of hosts and tool servers. It is a protocol, not an agent OS, and is evidence for tool mediation only.

Letta (`letta-ai/letta`) was examined and excluded: at the pinned commit its repository README makes only a one-line claim about stateful memory, and its documentation is not published in a versioned repository.


## Corpus refresh — 2026-11-01

Status: **recorded corpus rechecked**. This is a bounded update of 15 existing sources: 15 initial hashes unchanged, 0 changed and reviewed, 0 unavailable.

The fifteen recorded immutable sources were retrieved at their existing pins and all hashes matched. No drift was found at those pins. This is not a survey of newer AIOS, OpenHands or MCP revisions, and not an implementation assessment.

Review newer upstream revisions, retention/erasure, delegated confirmation and measured scheduling fairness in the deeper pass. Existing product choices remain unchanged.

[Source-by-source record](refresh-2026-11-01.json) includes previous/current hashes,
retrieval errors, dependent observations and affected clauses.
[Original source manifest](history/sources-before-refresh-2026-11-01.yaml) preserves prior records.
Old response bodies are unavailable: hash drift does not date or classify a historical
behaviour change. New observations are research inputs, with no automatic normative adoption.

Owner for this manual pass: repository agent; decision authority: Composed maintainer.
Budget: the recorded corpus and changed passages, with a second retrieval of changed
sources; no new provider survey, runtime experiment or background schedule. Revisit
on source drift or the requested deepening pass. Research maturity remains initial;
this author review does not promote a contract or certify an implementation.
Baseline contract/traceability bytes, consumer pins and Build Kit remain unchanged.
All product cases are not_run; existing proof is not transferred.
