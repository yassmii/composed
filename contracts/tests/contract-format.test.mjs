import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
	mkdirSync,
	mkdtempSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import {
	indexContract,
	readContract,
	validateContractDocument,
} from "../scripts/lib/contract-format.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const template = (version = "0.2") =>
	readContract(
		join(
			ROOT,
			"templates",
			version === "0.2" ? "contract-0.2.yaml" : "contract.yaml",
		),
	).document;
const codes = (document) =>
	validateContractDocument(document).map((item) => item.code);

test("both formats accept candidate maturity without accepting unknown statuses", () => {
	for (const format of ["0.1", "0.2"]) {
		const contract = template(format);
		for (const status of ["draft", "candidate", "stable", "deprecated"]) {
			contract.status = status;
			assert.deepEqual(validateContractDocument(contract), [], `${format}: ${status}`);
		}
		contract.status = "reviewed";
		assert.ok(codes(contract).includes("schema.invalid"));
	}
});

test("both formats validate while legacy contracts need no verification metadata", () => {
	assert.deepEqual(validateContractDocument(template("0.1")), []);
	assert.deepEqual(validateContractDocument(template()), []);
	const legacy = template("0.1");
	legacy.acceptance[0].verifies = ["REQ-001"];
	assert.ok(codes(legacy).includes("schema.invalid"));
	assert.equal(
		indexContract(template("0.1")).acceptance.get("ACC-001").verification,
		undefined,
	);
});

test("index contains only normative clauses and explicit dependency references", () => {
	const document = template();
	document.capabilities[0].requirements[0].depends_on = ["INV-001"];
	const { clauses, acceptance } = indexContract(document);
	assert.deepEqual(
		[...clauses.keys()],
		["REQ-001", "INV-001", "POL-001", "QA-001"],
	);
	assert.deepEqual(
		[...clauses.values()].map((item) => item.kind),
		["requirement", "invariant", "policy", "quality"],
	);
	assert.deepEqual(clauses.get("REQ-001").dependsOn, ["INV-001"]);
	assert.strictEqual(
		clauses.get("REQ-001").value,
		document.capabilities[0].requirements[0],
	);
	assert.deepEqual(acceptance.get("ACC-001").verifies, ["REQ-001", "INV-001"]);
	assert.deepEqual([...indexContract(null).clauses], []);
});

test("both formats retain duplicate identifier and unknown actor diagnostics", () => {
	for (const version of ["0.1", "0.2"]) {
		const document = template(version);
		document.domain.entities[0].id = document.actors[0].id;
		document.capabilities[0].actor = "ACT-MISSING";
		assert.ok(codes(document).includes("id.duplicate"));
		assert.ok(codes(document).includes("actor.unknown"));
	}
});

test("verifies cannot resolve missing identifiers or non-normative records", () => {
	for (const id of [
		"REQ-MISSING",
		"CAP-001",
		"ACT-001",
		"ACC-001",
		"MET-001",
	]) {
		const document = template();
		document.acceptance[0].verifies.push(id);
		assert.ok(codes(document).includes("acceptance.unknown-clause"), id);
	}
});

test("every normative clause needs declared acceptance coverage, including optional capabilities", () => {
	const document = template();
	document.capabilities[0].priority = "could";
	assert.deepEqual(validateContractDocument(document), []);
	document.acceptance[0].verifies = ["REQ-001"];
	assert.ok(
		validateContractDocument(document).some(
			(item) =>
				item.code === "acceptance.uncovered-clause" && item.path === "INV-001",
		),
	);
	document.acceptance[0].verifies = ["INV-001"];
	assert.ok(
		validateContractDocument(document).some(
			(item) =>
				item.code === "acceptance.uncovered-clause" && item.path === "REQ-001",
		),
	);
});

test("proof requirements reject missing, duplicate or unsupported dimensions", () => {
	const mutations = [
		(item) => {
			Reflect.deleteProperty(item, "verification");
		},
		(item) => {
			item.verification.methods = [];
		},
		(item) => {
			item.verification.methods = ["automated", "automated"];
		},
		(item) => {
			item.verification.methods = ["hybrid"];
		},
		(item) => {
			item.verification.boundary = "http";
		},
		(item) => {
			item.verification.case_kinds = [];
		},
		(item) => {
			item.verification.case_kinds = ["positive", "positive"];
		},
		(item) => {
			item.verification.case_kinds = ["fake"];
		},
		(item) => {
			item.verifies = [];
		},
		(item) => {
			item.verifies = ["REQ-001", "REQ-001"];
		},
	];
	for (const mutate of mutations) {
		const document = template();
		mutate(document.acceptance[0]);
		assert.ok(codes(document).includes("schema.invalid"));
	}
	const mixed = template();
	mixed.acceptance[0].verification.methods = ["automated", "manual"];
	assert.deepEqual(validateContractDocument(mixed), []);
});

test("human review requires manual verification exclusively", () => {
	for (const methods of [
		["automated"],
		["automated", "manual"],
		["manual", "automated"],
	]) {
		const document = template();
		document.acceptance[0].verification.boundary = "human-review";
		document.acceptance[0].verification.methods = methods;
		assert.ok(codes(document).includes("schema.invalid"));
	}
	const document = template();
	document.acceptance[0].verification.boundary = "human-review";
	document.acceptance[0].verification.methods = ["manual"];
	assert.deepEqual(validateContractDocument(document), []);
	for (const boundary of [
		"artifact",
		"component",
		"integration",
		"public-interface",
		"field-observation",
	]) {
		document.acceptance[0].verification.boundary = boundary;
		assert.deepEqual(validateContractDocument(document), []);
		document.acceptance[0].verification.methods = ["automated", "manual"];
		assert.deepEqual(validateContractDocument(document), []);
		document.acceptance[0].verification.methods = ["manual"];
	}
});

test("dependencies reject unknown, non-normative, self and repeated references", () => {
	for (const [depends_on, code] of [
		[["REQ-MISSING"], "dependency.unknown"],
		[["CAP-001"], "dependency.unknown"],
		[["REQ-001"], "dependency.self"],
		[["INV-001", "INV-001"], "schema.invalid"],
	]) {
		const document = template();
		document.capabilities[0].requirements[0].depends_on = depends_on;
		assert.ok(codes(document).includes(code));
	}
});

test("mutual dependencies remain valid for consumers using visited-set closure", () => {
	const document = template();
	document.capabilities[0].requirements[0].depends_on = ["INV-001"];
	document.invariants[0].depends_on = ["REQ-001"];
	assert.deepEqual(validateContractDocument(document), []);
	assert.deepEqual(indexContract(document).clauses.get("INV-001").dependsOn, [
		"REQ-001",
	]);
});

test("invalid shapes, unsupported versions, cycles and deep documents return findings", () => {
	for (const value of [null, [], {}, { schema_version: "0.3" }])
		assert.ok(codes(value).includes("schema.version"));
	const malformed = template();
	malformed.capabilities = [null];
	malformed.acceptance = [null];
	assert.ok(codes(malformed).includes("schema.invalid"));
	const cycle = template();
	cycle.extensions = cycle;
	assert.ok(codes(cycle).includes("document.limit"));
	const deep = template();
	deep.extensions = {};
	let current = deep.extensions;
	for (let i = 0; i < 70; i++) {
		current.child = {};
		current = current.child;
	}
	assert.ok(codes(deep).includes("document.limit"));
});

test("JSON source hashes commit exact bytes, including final line endings", () => {
	const root = mkdtempSync(join(tmpdir(), "contract-exact-source-"));
	try {
		const path = join(root, "source.json");
		const bytes = Buffer.from(`${JSON.stringify(template())}\r\n`);
		writeFileSync(path, bytes);
		const parsed = readContract(path);
		assert.deepEqual(validateContractDocument(parsed.document), []);
		assert.equal(
			parsed.sha256,
			createHash("sha256").update(bytes).digest("hex"),
		);
		writeFileSync(path, `${JSON.stringify(template())}\n`);
		assert.notEqual(readContract(path).sha256, parsed.sha256);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test("source reader rejects duplicate keys, unsafe tags, invalid text and oversized sources", () => {
	const root = mkdtempSync(join(tmpdir(), "contract-invalid-source-"));
	try {
		const path = join(root, "source.yaml");
		for (const content of [
			"schema_version: 0.2\nschema_version: 0.1\n",
			"value: !unknown content\n",
			"a: [broken",
		]) {
			writeFileSync(path, content);
			assert.throws(() => readContract(path), /Invalid contract YAML\/JSON/);
		}
		writeFileSync(path, Buffer.from([0xff]));
		assert.throws(() => readContract(path));
		writeFileSync(path, Buffer.alloc(2 * 1024 * 1024 + 1, "x"));
		assert.throws(() => readContract(path), /2 MiB/);
		assert.throws(() => readContract(root), /ordinary file/);
		const target = join(root, "target");
		mkdirSync(target);
		symlinkSync(
			target,
			join(root, "linked"),
			process.platform === "win32" ? "junction" : "dir",
		);
		assert.throws(() => readContract(join(root, "linked")), /ordinary file/);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test("public CLI validates legacy corpus and the new template, rejecting invalid links", () => {
	const command = join(ROOT, "scripts/validate-contracts.mjs");
	const output = execFileSync(process.execPath, [command], {
		encoding: "utf8",
	});
	assert.match(output, /OK\s+templates[/\\]contract\.yaml/);
	assert.match(output, /OK\s+templates[/\\]contract-0\.2\.yaml/);
	assert.match(output, /OK\s+product-types/);
	const root = mkdtempSync(join(tmpdir(), "contract-cli-"));
	try {
		const bad = template();
		bad.acceptance[0].verifies.push("REQ-MISSING");
		const path = join(root, "invalid.json");
		writeFileSync(path, JSON.stringify(bad));
		const result = spawnSync(process.execPath, [command, path], {
			encoding: "utf8",
		});
		assert.equal(result.status, 1);
		assert.match(result.stderr, /acceptance\.unknown-clause/);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
