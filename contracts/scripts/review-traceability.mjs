#!/usr/bin/env node
/** Review source → observation → contract-clause traceability for every product type. */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { get as getHttp } from "node:http";
import { get as getHttps } from "node:https";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { parse as parseYaml } from "yaml";

const ROOT = resolve(import.meta.dirname, "..");
const CORE_SECTIONS = [
	"capabilities",
	"invariants",
	"policies",
	"quality_attributes",
];
const EVIDENCE_BASES = new Set([
	"supported_convergence",
	"supported_pattern",
	"supported_pattern_and_choice",
]);
const CHOICE_BASE = "explicit_project_choice";
const schemaFiles = {
	sources: "research-sources.schema.json",
	observations: "research-observations.schema.json",
	traceability: "contract-traceability.schema.json",
};

function makeValidator(file) {
	const ajv = new Ajv2020({ allErrors: true, strict: false });
	addFormats(ajv);
	return ajv.compile(
		JSON.parse(readFileSync(resolve(ROOT, "specs", file), "utf8")),
	);
}

const validators = Object.fromEntries(
	Object.entries(schemaFiles).map(([name, file]) => [
		name,
		makeValidator(file),
	]),
);

function loadYaml(path) {
	return parseYaml(readFileSync(path, "utf8"));
}

function schemaErrors(name, document) {
	const validator = validators[name];
	return validator(document)
		? []
		: validator.errors.map(
				(error) => `${name}${error.instancePath || "$"}: ${error.message}`,
			);
}

function duplicates(values) {
	const counts = new Map();
	for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
	return [...counts].filter(([, count]) => count > 1).map(([value]) => value);
}

function clauseIds(contract) {
	const identifiers = new Set(
		CORE_SECTIONS.flatMap((section) =>
			contract[section].map((entry) => entry.id),
		),
	);
	for (const capability of contract.capabilities) {
		for (const requirement of capability.requirements)
			identifiers.add(requirement.id);
	}
	return identifiers;
}

async function contentError(source) {
	try {
		const content = await retrieve(source.url);
		const actual = createHash("sha256")
			.update(normalizeContent(source, content))
			.digest("hex");
		return actual === source.content_sha256
			? null
			: `${source.id} content hash differs from the reviewed snapshot`;
	} catch (error) {
		return `${source.id} could not be retrieved: ${error.message}`;
	}
}

function normalizeContent(source, content) {
	if (source.content_normalization === "cloudflare_ephemera") {
		return Buffer.from(
			content
				.toString("utf8")
				.replace(/\/cdn-cgi\/l\/email-protection#[a-f0-9]+/gi, "/cdn-cgi/l/email-protection#[redacted]")
				.replace(/data-cfemail="[^"]+"/gi, 'data-cfemail="[redacted]"')
				.replace(/window\.__CF\$cv\$params=\{[^}]*\};/g, "window.__CF$cv$params={redacted};"),
			"utf8",
		);
	}
	if (source.content_normalization === "html_article_text") {
		const html = content.toString("utf8");
		const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
		const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
		const text = (article ?? main ?? html)
			.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
			.replace(/<[^>]+>/g, " ")
			.replace(/&#x([\da-f]+);/gi, (_, code) =>
				String.fromCodePoint(Number.parseInt(code, 16)),
			)
			.replace(/&#(\d+);/g, (_, code) =>
				String.fromCodePoint(Number.parseInt(code, 10)),
			)
			.replace(/&(nbsp|amp|lt|gt|quot|apos);/gi, (_, entity) =>
				({ nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" })[
					entity.toLowerCase()
				],
			)
			.normalize("NFC")
			.replace(/\s+/g, " ")
			.trim();
		return Buffer.from(text, "utf8");
	}

	return content;
}

function retrieve(url, redirectsRemaining = 5) {
	return new Promise((resolveContent, reject) => {
		const requestUrl = new URL(url);
		const request = (requestUrl.protocol === "https:" ? getHttps : getHttp)(
			requestUrl,
			{ headers: { "User-Agent": "Mozilla/5.0" }, timeout: 30_000 },
			(response) => {
				const status = response.statusCode ?? 0;
				if (status >= 300 && status < 400 && response.headers.location) {
					response.resume();
					if (redirectsRemaining === 0) {
						reject(new Error("too many redirects"));
						return;
					}
					retrieve(
						new URL(response.headers.location, requestUrl).toString(),
						redirectsRemaining - 1,
					)
						.then(resolveContent)
						.catch(reject);
					return;
				}
				if (status < 200 || status >= 300) {
					response.resume();
					reject(new Error(`HTTP ${status}`));
					return;
				}
				const chunks = [];
				response.on("data", (chunk) => chunks.push(chunk));
				response.on("end", () => resolveContent(Buffer.concat(chunks)));
			},
		);
		request.on("error", reject);
		request.on("timeout", () =>
			request.destroy(new Error("request timed out")),
		);
	});
}

export async function review(
	unit,
	verifyContent,
	contractDirectory = resolve(unit, "contracts"),
) {
	const contract = loadYaml(resolve(contractDirectory, "contract.yaml"));
	const sourcesDocument = loadYaml(resolve(unit, "research/sources.yaml"));
	const observationsDocument = loadYaml(
		resolve(unit, "research/observations.yaml"),
	);
	const traceability = loadYaml(resolve(contractDirectory, "traceability.yaml"));
	const failures = [
		...schemaErrors("sources", sourcesDocument),
		...schemaErrors("observations", observationsDocument),
		...schemaErrors("traceability", traceability),
	];

	if (traceability.contract_id !== contract.id)
		failures.push("traceability contract_id does not match contract id");
	if (traceability.contract_version !== contract.version)
		failures.push(
			"traceability contract_version does not match contract version",
		);

	const sources = sourcesDocument.sources ?? [];
	const observations = observationsDocument.observations ?? [];
	const sourceIds = sources.map((entry) => entry.id);
	const observationIds = observations.map((entry) => entry.id);
	for (const identifier of duplicates(sourceIds))
		failures.push(`duplicate source id ${identifier}`);
	for (const identifier of duplicates(observationIds))
		failures.push(`duplicate observation id ${identifier}`);

	const knownSources = new Set(sourceIds);
	const knownObservations = new Set(observationIds);
	for (const observation of observations) {
		const unknown = observation.sources.filter(
			(source) => !knownSources.has(source),
		);
		if (unknown.length > 0)
			failures.push(
				`${observation.id} references unknown sources: ${[...new Set(unknown)].sort().join(", ")}`,
			);
	}

	const links = traceability.links ?? [];
	const linked = new Map(links.map((link) => [link.clause, link]));
	if (linked.size !== links.length)
		failures.push("traceability contains duplicate clause links");
	const missing = [...clauseIds(contract)]
		.filter((clause) => !linked.has(clause))
		.sort();
	if (missing.length > 0)
		failures.push(`untraced clauses: ${missing.join(", ")}`);
	for (const [clause, link] of linked) {
		const evidence = new Set(link.observations);
		const unknown = [...evidence]
			.filter((observation) => !knownObservations.has(observation))
			.sort();
		if (unknown.length > 0)
			failures.push(
				`${clause} references unknown observations: ${unknown.join(", ")}`,
			);
		if (EVIDENCE_BASES.has(link.basis) && evidence.size === 0)
			failures.push(`${clause} claims evidence but has no observations`);
		if (link.basis === CHOICE_BASE && evidence.size > 0)
			failures.push(
				`${clause} is a project choice but includes evidence; use a combined basis instead`,
			);
	}

	if (verifyContent) {
		for (const source of sources) {
			const error = await contentError(source);
			if (error) failures.push(error);
		}
	}
	return failures;
}

async function main() {
	const verifyContent = process.argv.slice(2).includes("--verify-content");
	let failed = false;
	const units = readdirSync(resolve(ROOT, "product-types"), { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.sort((a, b) => a.name.localeCompare(b.name));
	for (const entry of units) {
		const unit = resolve(ROOT, "product-types", entry.name);
		const baseline = resolve(unit, "contracts");
		const directories = [[entry.name, baseline]];
		const candidates = resolve(unit, "candidates");
		if (existsSync(candidates)) {
			const versions = readdirSync(candidates, { withFileTypes: true })
				.filter((item) => item.isDirectory())
				.sort((a, b) => a.name.localeCompare(b.name));
			for (const candidate of versions) {
				directories.push([
					`${entry.name}/candidates/${candidate.name}`,
					resolve(candidates, candidate.name, "contracts"),
				]);
			}
		}
		for (const [name, directory] of directories) {
			// Shared research is retrieved once, even with several candidates.
			const failures = await review(unit, verifyContent && directory === baseline, directory);
			if (failures.length > 0) {
				failed = true;
				for (const failure of failures) console.error(`FAIL ${name}: ${failure}`);
			} else {
				console.log(`OK   traceability ${name}`);
			}
		}
	}
	process.exitCode = Number(failed);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	await main();
}
