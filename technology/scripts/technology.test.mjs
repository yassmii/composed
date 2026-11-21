import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalog, validateCatalog, validateStudies, validateWatchSources, validateLocalLinks } from './validate.mjs';
import { observe, candidateBaseline } from './watch.mjs';

test('initial catalog and studies resolve against the real contract bytes', () => {
  const catalog = loadCatalog();
  assert.deepEqual(validateCatalog(catalog).errors, []);
  assert.deepEqual(validateStudies(catalog), []);
  assert.deepEqual(validateWatchSources(catalog), []);
  assert.deepEqual(validateLocalLinks(), []);
});

test('unsupported evidence and broken provenance cannot masquerade as reviewed research', () => {
  const catalog = loadCatalog();
  catalog.entries[0].capabilities[0].sources = ['nonexistent-source'];
  const result = validateCatalog(catalog, '2026-11-18');
  assert.ok(result.errors.some((e) => e.includes('unknown source')));
  const unsupported = loadCatalog();
  unsupported.entries[0].review_status = 'runtime-tested';
  assert.ok(validateCatalog(unsupported).errors.some((e) => e.includes('review_status')));
});

test('component study references cannot silently outlive catalog capabilities', () => {
  const catalog = loadCatalog();
  catalog.entries.find((entry) => entry.id === 'wasm').capabilities = [];
  const errors = validateStudies(catalog);
  assert.ok(errors.includes('native-components: unknown capability wasm/portable-modules'));
  assert.ok(errors.includes('native-components: unknown capability wasm/host-interfaces'));
});

test('future review dates fail and overdue research is explicitly stale', () => {
  const catalog = loadCatalog();
  catalog.entries = [catalog.entries[0]];
  catalog.entries[0].reviewed_on = '2026-11-18';
  catalog.entries[0].review_due = '2026-12-18';
  assert.ok(validateCatalog(catalog, '2026-11-17').errors.some((e) => e.includes('future')));
  assert.equal(validateCatalog(catalog, '2026-12-17').warnings.length, 0);
  assert.equal(validateCatalog(catalog, '2026-12-18').warnings.length, 1);
  catalog.entries[0].review_due = '2026-11-17';
  assert.ok(validateCatalog(catalog, '2026-11-18').errors.some((e) => e.includes('must follow')));
});

test('missing required dimensions and duplicate IDs fail structural checks', () => {
  const catalog = loadCatalog();
  delete catalog.entries[0].assessment.compatibility;
  assert.ok(validateCatalog(catalog).errors.length);
  const duplicate = loadCatalog();
  duplicate.entries.push(structuredClone(duplicate.entries[0]));
  assert.ok(validateCatalog(duplicate).errors.some((e) => e.includes('Duplicate')));
});

test('monitor distinguishes first observation, unchanged bytes, changed bytes and relocated sources', async () => {
  const source = { id: 'test', entry: 'nodejs', url: 'https://example.com/releases' };
  const fetcher = async () => new Response('release notes');
  const first = await observe(source, undefined, fetcher);
  assert.equal(first.status, 'new');
  assert.equal((await observe(source, first, fetcher)).status, 'unchanged');
  assert.equal((await observe(source, first, async () => new Response('new notes'))).status, 'changed');
  assert.equal((await observe({ ...source, url: 'https://example.com/new' }, first, fetcher)).status, 'new');
});

test('failed requests preserve the last successful observation without claiming freshness', async () => {
  const source = { id: 'test', entry: 'nodejs', url: 'https://example.com/releases' };
  const previous = { test: { url: source.url, sha256: 'prior-hash', observed_on: '2026-11-01' } };
  const failed = await observe(source, previous.test, async () => new Response('', { status: 503 }));
  assert.equal(failed.status, 'unavailable');
  assert.deepEqual(candidateBaseline([failed], previous, '2026-11-18'), previous);
  assert.equal((await observe(source, previous.test, async () => { throw new Error('timeout'); })).status, 'unavailable');
  assert.equal((await observe(source, previous.test, async () => new Response(''))).status, 'unavailable');
});
