import { createHash } from "node:crypto";
import {
	constants,
	closeSync,
	fstatSync,
	lstatSync,
	openSync,
	readFileSync,
	readSync,
} from "node:fs";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import { parseDocument } from "yaml";

const MAX_CONTRACT_BYTES = 2 * 1024 * 1024;
const MAX_NODES = 100000;
const MAX_DEPTH = 64;
const ROOT = resolve(import.meta.dirname, "../..");
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validators = new Map(
	[
		["0.1", "product-contract.schema.json"],
		["0.2", "product-contract-0.2.schema.json"],
	].map(([version, filename]) => [
		version,
		ajv.compile(
			JSON.parse(readFileSync(resolve(ROOT, "specs", filename), "utf8")),
		),
	]),
);

const record = (value) =>
	value !== null && typeof value === "object" && !Array.isArray(value);
const array = (value) => (Array.isArray(value) ? value : []);
const escaped = (key) => String(key).replace(/~/g, "~0").replace(/\//g, "~1");
const finding = (code, path, message) => ({ code, path, message });

/** Hash the exact supplied source bytes; parsing does not normalize the identity. */
export function readContract(filename) {
	const stat = lstatSync(filename);
	if (!stat.isFile() || stat.isSymbolicLink())
		throw new Error("Contract source must be an ordinary file.");
	if (stat.size > MAX_CONTRACT_BYTES)
		throw new Error("Contract source exceeds the 2 MiB read limit.");
	const fd = openSync(
		filename,
		constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0),
	);
	let bytes;
	try {
		const opened = fstatSync(fd);
		if (!opened.isFile())
			throw new Error("Contract source must be an ordinary file.");
		if (opened.size > MAX_CONTRACT_BYTES)
			throw new Error("Contract source exceeds the 2 MiB read limit.");
		const buffer = Buffer.allocUnsafe(MAX_CONTRACT_BYTES + 1);
		let length = 0;
		while (length < buffer.length) {
			const read = readSync(fd, buffer, length, buffer.length - length, null);
			if (read === 0) break;
			length += read;
		}
		if (length > MAX_CONTRACT_BYTES)
			throw new Error("Contract source exceeds the 2 MiB read limit.");
		bytes = buffer.subarray(0, length);
	} finally {
		closeSync(fd);
	}
	const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	const parsed = parseDocument(text, { uniqueKeys: true, strict: true });
	if (parsed.errors.length || parsed.warnings.length) {
		const diagnostics = [...parsed.errors, ...parsed.warnings]
			.map((item) => item.message)
			.join("; ");
		throw new Error(`Invalid contract YAML/JSON: ${diagnostics}`);
	}
	const document = parsed.toJS({ maxAliasCount: 100 });
	return { document, sha256: createHash("sha256").update(bytes).digest("hex") };
}

/** Extract only normative clauses. Validate first before relying on identifier uniqueness. */
export function indexContract(document) {
	const clauses = new Map();
	const acceptance = new Map();
	if (!record(document)) return { clauses, acceptance };
	const add = (value, kind) => {
		if (!record(value) || typeof value.id !== "string") return;
		clauses.set(value.id, {
			id: value.id,
			kind,
			value,
			dependsOn: array(value.depends_on).filter((id) => typeof id === "string"),
		});
	};
	for (const capability of array(document.capabilities)) {
		if (record(capability))
			for (const requirement of array(capability.requirements))
				add(requirement, "requirement");
	}
	for (const value of array(document.invariants)) add(value, "invariant");
	for (const value of array(document.policies)) add(value, "policy");
	for (const value of array(document.quality_attributes)) add(value, "quality");
	for (const value of array(document.acceptance)) {
		if (record(value) && typeof value.id === "string")
			acceptance.set(value.id, value);
	}
	return { clauses, acceptance };
}

/** Bounded traversal also rejects cyclic in-memory/YAML-alias documents before validation. */
function identities(document) {
	const found = [];
	const findings = [];
	const ancestors = new Set();
	let nodes = 0;
	const walk = (value, path, depth) => {
		nodes++;
		if (nodes > MAX_NODES || depth > MAX_DEPTH) {
			throw new Error(
				"Contract document exceeds traversal limits (100000 nodes, depth 64).",
			);
		}
		if (value === null || typeof value !== "object") return;
		if (ancestors.has(value))
			throw new Error("Contract document contains a cycle.");
		ancestors.add(value);
		if (record(value) && typeof value.id === "string")
			found.push([value.id, path]);
		for (const [key, child] of Object.entries(value))
			walk(child, `${path}/${escaped(key)}`, depth + 1);
		ancestors.delete(value);
	};
	try {
		walk(document, "", 0);
	} catch (error) {
		findings.push(finding("document.limit", "", error.message));
	}
	return { found, findings };
}

/** Structural/relational validity only; it neither executes cases nor proves product behavior. */
export function validateContractDocument(document) {
	const { found, findings } = identities(document);
	if (findings.length) return findings;
	const validator = validators.get(
		record(document) ? document.schema_version : undefined,
	);
	if (!validator)
		return [
			finding(
				"schema.version",
				"/schema_version",
				"Unsupported contract schema_version; expected 0.1 or 0.2.",
			),
		];
	if (!validator(document)) {
		for (const error of validator.errors ?? [])
			findings.push(
				finding(
					"schema.invalid",
					error.instancePath,
					error.message ?? "Invalid contract field.",
				),
			);
	}
	const seen = new Map();
	for (const [id, path] of found) {
		if (seen.has(id))
			findings.push(
				finding(
					"id.duplicate",
					path,
					`Duplicate id ${JSON.stringify(id)}; first declared at ${seen.get(id) || "/"}.`,
				),
			);
		else seen.set(id, path);
	}
	if (!record(document)) return findings;
	const actorIds = new Set(
		array(document.actors)
			.filter(record)
			.map((actor) => actor.id),
	);
	for (const [index, capability] of array(document.capabilities).entries()) {
		if (record(capability) && !actorIds.has(capability.actor))
			findings.push(
				finding(
					"actor.unknown",
					`/capabilities/${index}/actor`,
					`Capability ${JSON.stringify(capability.id ?? "<unknown>")} references an unknown actor ${JSON.stringify(capability.actor)}.`,
				),
			);
	}
	if (document.schema_version !== "0.2") return findings;
	const { clauses, acceptance } = indexContract(document);
	const covered = new Set();
	for (const [id, clause] of clauses) {
		for (const dependency of clause.dependsOn) {
			if (dependency === id)
				findings.push(
					finding(
						"dependency.self",
						id,
						`Clause ${id} cannot depend on itself.`,
					),
				);
			else if (!clauses.has(dependency))
				findings.push(
					finding(
						"dependency.unknown",
						id,
						`Clause ${id} references unknown normative dependency ${dependency}.`,
					),
				);
		}
	}
	for (const [id, item] of acceptance) {
		for (const target of array(item.verifies)) {
			if (!clauses.has(target))
				findings.push(
					finding(
						"acceptance.unknown-clause",
						id,
						`Acceptance ${id} verifies unknown or non-normative clause ${JSON.stringify(target)}.`,
					),
				);
			else covered.add(target);
		}
	}
	for (const id of clauses.keys()) {
		if (!covered.has(id))
			findings.push(
				finding(
					"acceptance.uncovered-clause",
					id,
					`Normative clause ${id} has no acceptance verifies link.`,
				),
			);
	}
	return findings;
}
