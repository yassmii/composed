import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { parse } from "yaml";
import { review } from "../scripts/review-traceability.mjs";

const ROOT = resolve(import.meta.dirname, "../product-types");
// This regression freezes the integration batch of 2026-11-01. New draft
// families need no fictitious candidate integration or previous-version archive.
const integratedFamilies = [
	"3d-engine",
	"agent-os",
	"agentic-delivery-harness",
	"career-evidence-platform",
	"collaborative-workspace",
	"e-commerce",
	"git-backed-cms",
	"prospecting-workspace",
	"saas-booking",
	"video-editorial-workflow",
];
const units = integratedFamilies.map((family) => join(ROOT, family));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("canonical contracts use the recorded candidate bytes without stable promotion", () => {
	assert.equal(units.length, 10);
	for (const unit of units) {
		const record = JSON.parse(readFileSync(join(unit, "contracts/integration.json"), "utf8"));
		const current = readFileSync(join(unit, record.current.contract));
		const trace = readFileSync(join(unit, record.current.traceability));
		const document = parse(current.toString("utf8"));
		assert.equal(document.id, record.family);
		assert.equal(document.version, record.current.version);
		assert.equal(document.status, "candidate");
		assert.equal(record.stable_promotion, "not_performed");
		assert.equal(record.proof_transfer, "not_performed");
		assert.equal(digest(current), record.current.contract_sha256);
		assert.equal(digest(trace), record.current.traceability_sha256);
		assert.ok(current.equals(readFileSync(join(unit, record.current.candidate, "contract.yaml"))));
		assert.ok(trace.equals(readFileSync(join(unit, record.current.candidate, "traceability.yaml"))));
		assert.equal(document.acceptance.length, record.current.acceptance_count);
	}
});

test("prior canonical versions keep exact archived files and independently checkable provenance", async () => {
	for (const unit of units) {
		const record = JSON.parse(readFileSync(join(unit, "contracts/integration.json"), "utf8"));
		const archive = join(unit, record.previous.archive);
		for (const file of record.previous.files) {
			assert.equal(digest(readFileSync(join(archive, file.path))), file.sha256, `${record.family}/${file.path}`);
		}
		const previous = parse(readFileSync(join(archive, "contracts/contract.yaml"), "utf8"));
		assert.equal(previous.version, record.previous.version);
		assert.equal(previous.status, record.previous.status);
		assert.deepEqual(await review(archive, false), [], record.family);
	}
});
