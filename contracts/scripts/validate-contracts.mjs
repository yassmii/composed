#!/usr/bin/env node
/** Validate Composed Contract source format and declared structural relations. */

import { readdirSync, statSync } from "node:fs";
import { basename, dirname, relative, resolve } from "node:path";
import {
	readContract,
	validateContractDocument,
} from "./lib/contract-format.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const defaultPaths = [
	resolve(ROOT, "templates/contract.yaml"),
	resolve(ROOT, "templates/contract-0.2.yaml"),
	resolve(ROOT, "product-types"),
];

function contractFiles(paths) {
	return paths.flatMap((path) => {
		if (!statSync(path).isDirectory()) return [path];
		return walk(path).filter(
			(candidate) =>
				basename(candidate) === "contract.yaml" &&
				basename(dirname(candidate)) === "contracts",
		);
	});
}

function walk(directory) {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const candidate = resolve(directory, entry.name);
		return entry.isDirectory() ? walk(candidate) : [candidate];
	});
}

function validate(path) {
	try {
		return validateContractDocument(readContract(path).document);
	} catch (error) {
		return [{ code: "source.invalid", path: "", message: error.message }];
	}
}

try {
	const requestedPaths = process.argv
		.slice(2)
		.map((path) => resolve(process.cwd(), path));
	const paths = contractFiles(
		requestedPaths.length ? requestedPaths : defaultPaths,
	);
	if (!paths.length) throw new Error("No contract files found.");
	let failed = false;
	for (const path of paths) {
		const errors = validate(path);
		const displayPath = relative(ROOT, path);
		if (errors.length) {
			failed = true;
			for (const error of errors)
				console.error(
					`FAIL ${displayPath}: [${error.code}] ${error.path || "/"}: ${error.message}`,
				);
		} else console.log(`OK   ${displayPath}`);
	}
	process.exitCode = Number(failed);
} catch (error) {
	console.error(`FAIL ${error.message}`);
	process.exitCode = 1;
}
