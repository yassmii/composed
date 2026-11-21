# Native components and WebAssembly: when to consider them

Reference: technology 0.2.0; documentation study dated 2026-11-18. This is a component-selection
guide for the two initial studies, not a claim to have studied every 3D, embedded or media contract.
All experiments below are **not_run**. No numeric performance ranking is available.

| Option | Evidence and plausible use | Main trade-off | Evidence required before selection |
| --- | --- | --- | --- |
| C | c/dialect-selection; integrate an existing library or hardware interface | Explicit ownership, ABI and memory-safety work | Target compiler/dialect, sanitizer/fuzz results, FFI lifetime and buffer checks |
| C++ | cpp/feature-matrix; reuse an engine, codec or native SDK | Compiler/STL/ABI matrix and lifetime complexity | Reproducible native build, exception/allocator boundary tests and representative profiling |
| Rust | rust/ownership; implement a native parser, service or bounded computation | Learning, build and integration costs; unsafe/FFI remains a review boundary | Toolchain/MSRV matrix, input fuzzing and end-to-end measurements |
| ASM | asm/isa-specific; narrow hardware routine after profiling | CPU/ABI dependence and specialist maintenance | Optimized compiler baseline, CPU feature dispatch, correctness tests and portable fallback |
| WASM | wasm/portable-modules and wasm/host-interfaces; reuse a module in supported browser/server hosts | Engine features, host API and crossing-boundary overhead | Guest/compiler/engine/WASI matrix, time/memory limits, import permissions and copy-cost measurements |

## Booking

None of these options is necessary merely because a product handles concurrent reservations.
The database transaction and idempotent state transitions remain decisive; native compilation does
not enforce them. Consider a bounded native or WASM module only if a genuine requirement (for example
an existing library integration) or measurement supports it. Do not invent an optimization feature
absent from the pinned product contract. Keep the authoritative allocation decision on the server;
client-side WASM is not trusted authorization or capacity enforcement.

## Collaborative workspace

A native or WASM module may be worth studying for measured parsing, indexing or document-processing
work. First verify that such work is already required. Browser processing needs compatible bindings,
offline storage and memory budgets; a standalone WASI host has a different API/permission boundary.
The canonical Git writer, resource permissions and durable acceptance protocol remain application
responsibilities. A sandbox does not make an imported host function safe: restrict file, network,
clock and other capabilities to the declared policy and bound execution resources.

## Compare the whole path

Measure startup and steady-state latency, peak memory, serialization and copying, concurrent load,
failure recovery, artifact size and build/deployment effort. Include the simplest existing-language
implementation and optimized compiler output as baselines. Choose a component boundary only when
the measured benefit justifies the new runtime/toolchain and ownership burden. Preserve accepted
project technology choices unless the user approves or has delegated the change.
