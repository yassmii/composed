import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import YAML from 'yaml';

export const root = fileURLToPath(new URL('../', import.meta.url));
const read = (name) => readFileSync(path.join(root, name), 'utf8');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const schemaCheck = ajv.compile(JSON.parse(read('schema/catalog.schema.json')));
export const loadCatalog = () => YAML.parse(read('catalog.yaml'));

function duplicates(values, label, errors) {
  if (new Set(values).size !== values.length) errors.push(`Duplicate ${label}`);
}

export function validateCatalog(catalog, today = new Date().toISOString().slice(0, 10)) {
  const errors = [];
  const warnings = [];
  if (!schemaCheck(catalog)) return { errors: schemaCheck.errors.map((e) => `${e.instancePath} ${e.message}`), warnings };
  duplicates(catalog.entries.map((e) => e.id), 'entry ID', errors);
  duplicates(catalog.entries.flatMap((e) => e.sources.map((s) => s.id)), 'source ID', errors);
  for (const entry of catalog.entries) validateEntry(entry, today, errors, warnings);
  return { errors, warnings };
}

function validateEntry(entry, today, errors, warnings) {
  const sourceIds = new Set(entry.sources.map((s) => s.id));
  duplicates(entry.capabilities.map((c) => c.id), `${entry.id} capability ID`, errors);
  for (const capability of entry.capabilities) {
    for (const id of capability.sources) {
      if (!sourceIds.has(id)) errors.push(`${entry.id}/${capability.id}: unknown source ${id}`);
    }
  }
  if (entry.reviewed_on > today) errors.push(`${entry.id}: review is in the future`);
  if (entry.review_due <= entry.reviewed_on) errors.push(`${entry.id}: review_due must follow reviewed_on`);
  if (entry.review_due <= today) warnings.push(`${entry.id}: review due ${entry.review_due}`);
}

function collectIds(value, ids = new Set()) {
  if (Array.isArray(value)) value.forEach((item) => collectIds(item, ids));
  else if (value && typeof value === 'object') {
    if (typeof value.id === 'string') ids.add(value.id);
    Object.values(value).forEach((item) => collectIds(item, ids));
  }
  return ids;
}

export function validateStudies(catalog) {
  const errors = [];
  const studies = JSON.parse(read('studies/manifest.json'));
  for (const study of studies) {
    const body = read(study.document);
    for (const reference of study.technology_references) {
      const [entryId, capabilityId] = reference.split('/');
      const entry = catalog.entries.find((e) => e.id === entryId);
      if (!entry?.capabilities.some((c) => c.id === capabilityId)) errors.push(`${study.id}: unknown capability ${reference}`);
      if (!body.includes(reference)) errors.push(`${study.id}: unused manifest reference ${reference}`);
    }
    if (study.kind === 'component') continue;
    const bytes = readFileSync(path.join(root, study.contract));
    const contract = YAML.parse(bytes.toString('utf8'));
    if (contract.id !== study.id || contract.version !== study.version) errors.push(`${study.id}: contract identity drift`);
    if (createHash('sha256').update(bytes).digest('hex') !== study.sha256) errors.push(`${study.id}: contract bytes changed; review study`);
    const ids = collectIds(contract);
    for (const id of body.match(/(?:REQ|INV|POL|QA|ACC)-[A-Z]+-\d+/g) ?? []) {
      if (!ids.has(id)) errors.push(`${study.id}: unknown clause ${id}`);
    }
  }
  return errors;
}

export function validateWatchSources(catalog) {
  const sources = JSON.parse(read('watch-sources.json'));
  const errors = [];
  duplicates(sources.map((s) => s.id), 'watch source ID', errors);
  for (const source of sources) {
    if (!source.id || !source.kind || !catalog.entries.some((e) => e.id === source.entry)) errors.push(`Invalid watch entry ${source.id}`);
    try {
      if (new URL(source.url).protocol !== 'https:') throw new Error('HTTPS required');
    } catch { errors.push(`Invalid watch URL ${source.id}`); }
  }
  return errors;
}

export function validateLocalLinks(directory = root) {
  const errors = [];
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, item.name);
    if (item.isDirectory() && item.name !== 'reports') errors.push(...validateLocalLinks(filename));
    if (!item.isFile() || !item.name.endsWith('.md')) continue;
    for (const [, target] of readFileSync(filename, 'utf8').matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
      if (/^(?:https?:|#)/.test(target)) continue;
      if (!existsSync(path.resolve(directory, target.split('#')[0]))) errors.push(`${filename}: broken local link ${target}`);
    }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const catalog = loadCatalog();
    const result = validateCatalog(catalog);
    if (!result.errors.length) result.errors.push(...validateStudies(catalog), ...validateWatchSources(catalog), ...validateLocalLinks());
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.errors.length || (process.argv.includes('--strict-freshness') && result.warnings.length) ? 1 : 0;
  } catch (error) {
    console.error(`Technology validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
