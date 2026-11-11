import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { parse, stringify } from "yaml";
import { review } from "../scripts/review-traceability.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const PILOT = join(ROOT, "product-types/saas-booking");

test("native validation includes candidate traceability alongside preserved baseline", () => {
	const result = spawnSync(process.execPath, [join(ROOT, "scripts/review-traceability.mjs")], { encoding: "utf8" });
	assert.equal(result.status, 0, result.stderr);
	assert.match(result.stdout, /OK   traceability saas-booking\n/);
	assert.match(result.stdout, /OK   traceability saas-booking\/candidates\/1\.0\.0/);
});

test("candidate review rejects mismatched versions, missing links and unknown research", async () => {
	const unit = mkdtempSync(join(tmpdir(), "composed-research-candidate-"));
	try {
		cpSync(PILOT, unit, { recursive: true });
		const directory = join(unit, "candidates/1.0.0/contracts");
		assert.deepEqual(await review(unit, false, directory), []);
		const path = join(directory, "traceability.yaml");
		const trace = parse(readFileSync(path, "utf8"));
		trace.contract_version = "0.1.0";
		trace.links = trace.links.filter((link) => link.clause !== "POL-BOOK-003");
		trace.links[0].observations = ["OBS-BOOK-UNKNOWN"];
		writeFileSync(path, stringify(trace));
		const errors = await review(unit, false, directory);
		assert.ok(errors.includes("traceability contract_version does not match contract version"));
		assert.ok(errors.includes("untraced clauses: POL-BOOK-003"));
		assert.ok(errors.some((error) => error.includes("unknown observations: OBS-BOOK-UNKNOWN")));
		// A bad candidate must not change the baseline's own applicability.
		assert.deepEqual(await review(unit, false), []);
	} finally {
		rmSync(unit, { recursive: true, force: true });
	}
});
