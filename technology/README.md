# Technology reference

Version **0.2.0**, research preview. This independently versioned reference helps humans and agents
compare implementation options for a Composed contract. It is not a product contract, a prescribed
stack, a package lockfile, or evidence of product conformance. Original material uses the root MIT
license; linked upstream projects retain their own licenses.

Start with the [selection protocol](selection.md), inspect [catalog.yaml](catalog.yaml), then write
a project-owned [decision](templates/decision.md). Worked studies cover [booking](studies/booking.md)
and [collaborative workspaces](studies/collaborative-workspace.md). These studies make explicit
synthetic assumptions; they are not approved stacks for real projects.

## Initial coverage

| Entry | Category | Useful question |
| --- | --- | --- |
| typescript | Language | Can shared static types help this team, and where is runtime validation needed? |
| python | Language | Does the team's Python expertise outweigh a second browser language? |
| nodejs | Runtime | Can the workload keep the event loop responsive? |
| django | Backend framework | Does integrated server-side application structure fit the product? |
| nestjs | Backend framework | Is a modular TypeScript backend worth its integration surface? |
| react | UI library | Does the interaction model justify a client application? |
| postgresql | Database | Which transactions and retries enforce the invariants? |
| sqlite | Embedded database | Can local durable storage and a single concurrent writer meet the workload? |
| hono | HTTP framework | Is a small HTTP layer enough given the project's identity and operator needs? |
| yjs | Collaboration library | How will convergent updates meet authorization and durability rules? |
| git | Versioned storage tool | How will canonical commits and projections remain consistent? |
| csharp | Language | Does a typed .NET domain model fit the team and integrations? |
| dotnet | Runtime/platform | Which support lifecycle and deployment model fit operations? |
| aspnet-core | Backend framework | Can HTTP and SignalR facilities serve this application? |
| ef-core | Persistence library | Which transaction boundaries and provider semantics enforce invariants? |
| rust | Language | Do ownership and resource control justify the engineering cost? |
| tokio | Async runtime | How will task scheduling, cancellation and backpressure work? |
| axum | HTTP framework | Does a modular Rust API fit better than an integrated application framework? |
| c | Language | Is a native library, hardware target or constrained component required? |
| cpp | Language | Does an existing engine or native SDK justify its complexity? |
| asm | ISA-specific language family | Is a measured hardware-specific routine worth maintaining? |
| wasm | Execution format | Which source language, engine and host interfaces make a portable module useful? |

Coverage is deliberately limited to two initial product families. Missing technologies are **not
rejected technologies**. Expand research when constraints suggest Go, Java, PHP, other UI
frameworks, databases or services. No benchmark, exact dependency combination, deployment price or
complete license audit was executed for this preview. Documentation-backed facts and architectural
judgments are kept separate. Consult each entry's review date; mutable unversioned documentation
does not establish compatibility for every release.

The entries are not interchangeable options: languages, runtimes, frameworks and execution
formats occupy different layers. ASM coverage currently uses NASM/x86 as its documented example;
ARM and RISC-V need separate research. WASM can be a compilation target for a component, not a
replacement name for its source language or host. Read the [native/component comparison](studies/native-components.md)
before introducing C, C++, assembly or WASM into either initial product family.

## Read the data

Each entry records a version scope, source-backed capabilities (native, extension, or application
work), advantages and limitations, fit/avoid contexts, operations/costs, compatibility checks,
declared upstream license and deployment-audit status, unresolved questions, and review dates. An
`unverified` license status means the exact deployment/dependency audit is pending, even when the
linked upstream license has been read. Each capability names the
specific source supporting it. Judgments are contextual recommendations, not upstream guarantees.
`documentation-reviewed` means the stated sources were read; it never means runtime-tested.

The [schema](schema/catalog.schema.json) is the format authority. Dates and links are validated;
semantic correctness still needs a reviewer. A stale entry remains historical evidence but must be
rechecked before it supports a consequential recommendation. An unknown license or compatibility
constraint remains a blocker when the project requires it.

## Validate and maintain

From the repository root, with its existing Node >=20 dependencies:

```sh
npm run validate:technology
npm run test:technology
npm run watch:technology
```

Validation is offline and reports overdue reviews without breaking historical checkouts. Add
`-- --strict-freshness` to fail on stale entries. The watch command uses the network and produces a
local review report and a candidate observation baseline under `technology/reports/` (ignored by
Git). See [maintenance](maintenance.md) for ownership, weekly monitoring, monthly review and
quarterly comparisons. The scheduled workflow publishes an Actions artifact, not an automatic
change to recommendations. It becomes scheduled only once merged onto the default branch and
enabled in GitHub Actions.
