import assert from 'node:assert/strict';

const check = (id, kind, run) => ({ id, kind, run });
const timeout = (operation) => {
  let timer;
  return Promise.race([
    Promise.resolve().then(operation),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Check exceeded 500 ms')), 500);
    }),
  ]).finally(() => clearTimeout(timer));
};

const heldFixture = (overrides = {}) =>
  Object.freeze({
    state: 'held',
    amount: 500,
    captured: 0,
    expiresAt: 100,
    revision: 3,
    label: 'fixture',
    ...overrides,
  });

export const checkDefinitions = {
  'cart-totals': [
    check('cart.basic-total', 'regression', ({ calculateCart }) => {
      assert.deepEqual(calculateCart([{ unitPriceCents: 250, quantity: 2 }]), {
        subtotalCents: 500,
        discountCents: 0,
        shippingCents: 0,
        totalCents: 500,
      });
    }),
    check('cart.basic-shipping', 'regression', ({ calculateCart }) => {
      assert.deepEqual(
        calculateCart([{ unitPriceCents: 100, quantity: 1 }], { shippingCents: 25 }),
        { subtotalCents: 100, discountCents: 0, shippingCents: 25, totalCents: 125 },
      );
    }),
    check('cart.order-wide-rounding', 'acceptance', ({ calculateCart }) => {
      assert.deepEqual(
        calculateCart([{ unitPriceCents: 1, quantity: 2 }], { discountBasisPoints: 5000 }),
        { subtotalCents: 2, discountCents: 1, shippingCents: 0, totalCents: 1 },
      );
      assert.equal(
        calculateCart([{ unitPriceCents: 1, quantity: 1 }], { discountBasisPoints: 5000 })
          .discountCents,
        1,
      );
    }),
    check('cart.post-discount-threshold', 'acceptance', ({ calculateCart }) => {
      assert.deepEqual(
        calculateCart([{ unitPriceCents: 1000, quantity: 1 }], {
          discountBasisPoints: 5000,
          shippingCents: 99,
          freeShippingThresholdCents: 800,
        }),
        { subtotalCents: 1000, discountCents: 500, shippingCents: 99, totalCents: 599 },
      );
    }),
    check('cart.inclusive-threshold', 'acceptance', ({ calculateCart }) => {
      assert.equal(
        calculateCart([{ unitPriceCents: 1000, quantity: 1 }], {
          discountBasisPoints: 2000,
          shippingCents: 99,
          freeShippingThresholdCents: 800,
        }).shippingCents,
        0,
      );
      assert.equal(
        calculateCart([{ unitPriceCents: 0, quantity: 1 }], {
          shippingCents: 99,
          freeShippingThresholdCents: 0,
        }).shippingCents,
        0,
      );
    }),
    check('cart.empty-and-full-discount', 'acceptance', ({ calculateCart }) => {
      assert.deepEqual(calculateCart([], { shippingCents: 999 }), {
        subtotalCents: 0,
        discountCents: 0,
        shippingCents: 0,
        totalCents: 0,
      });
      assert.equal(
        calculateCart([{ unitPriceCents: 200, quantity: 3 }], { discountBasisPoints: 10000 })
          .totalCents,
        0,
      );
    }),
    check('cart.invalid-items', 'acceptance', ({ calculateCart }) => {
      for (const items of [
        null,
        {},
        [{ unitPriceCents: -1, quantity: 1 }],
        [{ unitPriceCents: 1.5, quantity: 1 }],
        [{ unitPriceCents: 1, quantity: 0 }],
        [{ unitPriceCents: 1, quantity: 1.5 }],
        [{ unitPriceCents: 0, quantity: Number.MAX_SAFE_INTEGER + 1 }],
        [{ unitPriceCents: Number.NaN, quantity: 1 }],
      ])
        assert.throws(() => calculateCart(items), RangeError);
    }),
    check('cart.invalid-options', 'acceptance', ({ calculateCart }) => {
      const items = [{ unitPriceCents: 10, quantity: 1 }];
      for (const options of [
        { discountBasisPoints: 10001 },
        { discountBasisPoints: -1 },
        { discountBasisPoints: 1.5 },
        { shippingCents: -1 },
        { shippingCents: Number.POSITIVE_INFINITY },
        { freeShippingThresholdCents: -1 },
        { freeShippingThresholdCents: '0' },
      ])
        assert.throws(() => calculateCart(items, options), RangeError);
    }),
    check('cart.safe-integer-boundary', 'acceptance', ({ calculateCart }) => {
      assert.throws(
        () => calculateCart([{ unitPriceCents: Number.MAX_SAFE_INTEGER, quantity: 2 }]),
        RangeError,
      );
      assert.throws(
        () =>
          calculateCart([{ unitPriceCents: Number.MAX_SAFE_INTEGER, quantity: 1 }], {
            shippingCents: 1,
          }),
        RangeError,
      );
      assert.equal(
        calculateCart([{ unitPriceCents: Number.MAX_SAFE_INTEGER, quantity: 1 }]).totalCents,
        Number.MAX_SAFE_INTEGER,
      );
      assert.equal(
        calculateCart([{ unitPriceCents: Number.MAX_SAFE_INTEGER, quantity: 1 }], {
          discountBasisPoints: 3333,
        }).discountCents,
        3002099511605172,
      );
    }),
    check('cart.input-preserved', 'acceptance', ({ calculateCart }) => {
      const items = Object.freeze([Object.freeze({ unitPriceCents: 150, quantity: 2 })]);
      const options = Object.freeze({ discountBasisPoints: 1000, shippingCents: 25 });
      assert.equal(calculateCart(items, options).totalCents, 295);
      assert.deepEqual(items, [{ unitPriceCents: 150, quantity: 2 }]);
    }),
  ],
  'retry-operation': [
    check('retry.success-identity', 'regression', async ({ withRetry }) => {
      const value = { ok: true };
      assert.equal(await withRetry(async () => value), value);
    }),
    check('retry.timeout-recovery', 'regression', async ({ withRetry }) => {
      let calls = 0;
      assert.equal(
        await withRetry(async () => {
          if (++calls === 1) throw Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' });
          return 42;
        }),
        42,
      );
      assert.equal(calls, 2);
    }),
    check('retry.only-declared-codes', 'acceptance', async ({ withRetry }) => {
      let calls = 0;
      const error = Object.assign(new Error('denied'), { code: 'EACCES' });
      await assert.rejects(
        () =>
          withRetry(async () => {
            calls++;
            throw error;
          }),
        (caught) => caught === error,
      );
      assert.equal(calls, 1);
    }),
    check('retry.exhaustion-preserves-error', 'acceptance', async ({ withRetry }) => {
      let calls = 0;
      const error = Object.assign(new Error('reset'), { code: 'ECONNRESET' });
      await assert.rejects(
        () =>
          withRetry(async () => {
            calls++;
            throw error;
          }),
        (caught) => caught === error,
      );
      assert.equal(calls, 3);
    }),
    check('retry.one-based-attempts', 'acceptance', async ({ withRetry }) => {
      const attempts = [];
      assert.equal(
        await withRetry(async (attempt) => {
          attempts.push(attempt);
          if (attempts.length < 3) throw Object.assign(new Error('reset'), { code: 'ECONNRESET' });
          return 'done';
        }),
        'done',
      );
      assert.deepEqual(attempts, [1, 2, 3]);
    }),
    check('retry.custom-code-and-one-attempt', 'acceptance', async ({ withRetry }) => {
      let calls = 0;
      const error = Object.assign(new Error('custom'), { code: 'EAGAIN' });
      await assert.rejects(
        () =>
          withRetry(
            async () => {
              calls++;
              throw error;
            },
            { maxAttempts: 1, retryCodes: ['EAGAIN'] },
          ),
        (caught) => caught === error,
      );
      assert.equal(calls, 1);
      calls = 0;
      assert.equal(
        await withRetry(
          async () => {
            if (++calls === 1) throw error;
            return 9;
          },
          { retryCodes: ['EAGAIN'] },
        ),
        9,
      );
    }),
    check('retry.empty-policy-does-not-retry', 'acceptance', async ({ withRetry }) => {
      let calls = 0;
      const error = Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' });
      await assert.rejects(
        () =>
          withRetry(
            async () => {
              calls++;
              throw error;
            },
            { retryCodes: [] },
          ),
        (caught) => caught === error,
      );
      assert.equal(calls, 1);
    }),
    check('retry.invalid-config-before-call', 'acceptance', async ({ withRetry }) => {
      let calls = 0;
      const operation = async () => {
        calls++;
        return true;
      };
      for (const maxAttempts of [0, 11, 1.5, Number.POSITIVE_INFINITY, '3'])
        await assert.rejects(() => withRetry(operation, { maxAttempts }), RangeError);
      for (const retryCodes of [null, 'ETIMEDOUT', [1], ['']])
        await assert.rejects(() => withRetry(operation, { retryCodes }), TypeError);
      await assert.rejects(() => withRetry(null), TypeError);
      assert.equal(calls, 0);
    }),
    check('retry.abort-before-first-call', 'acceptance', async ({ withRetry }) => {
      let calls = 0;
      const controller = new AbortController();
      const reason = new Error('cancelled');
      controller.abort(reason);
      await assert.rejects(
        () =>
          withRetry(
            async () => {
              calls++;
            },
            { signal: controller.signal },
          ),
        (caught) => caught === reason,
      );
      assert.equal(calls, 0);
    }),
    check('retry.abort-before-next-call', 'acceptance', async ({ withRetry }) => {
      let calls = 0;
      const controller = new AbortController();
      const reason = new Error('cancelled');
      await assert.rejects(
        () =>
          withRetry(
            async () => {
              calls++;
              controller.abort(reason);
              throw Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' });
            },
            { signal: controller.signal },
          ),
        (caught) => caught === reason,
      );
      assert.equal(calls, 1);
    }),
  ],
  'csv-record': [
    check('csv.plain-fields', 'regression', ({ parseCsvRecord }) => {
      assert.deepEqual(parseCsvRecord('alpha,beta'), ['alpha', 'beta']);
    }),
    check('csv.empty-fields', 'regression', ({ parseCsvRecord }) => {
      assert.deepEqual(parseCsvRecord('alpha,,gamma,'), ['alpha', '', 'gamma', '']);
    }),
    check('csv.quoted-comma', 'acceptance', ({ parseCsvRecord }) => {
      assert.deepEqual(parseCsvRecord('a,"b,c",d'), ['a', 'b,c', 'd']);
    }),
    check('csv.doubled-quotes', 'acceptance', ({ parseCsvRecord }) => {
      assert.deepEqual(parseCsvRecord('"a""b",""""'), ['a"b', '"']);
    }),
    check('csv.empty-record-and-quoted-empty', 'acceptance', ({ parseCsvRecord }) => {
      assert.deepEqual(parseCsvRecord(''), ['']);
      assert.deepEqual(parseCsvRecord('"",,""'), ['', '', '']);
    }),
    check('csv.whitespace-preserved', 'acceptance', ({ parseCsvRecord }) => {
      assert.deepEqual(parseCsvRecord(' a ," b ", c '), [' a ', ' b ', ' c ']);
    }),
    check('csv.unmatched-or-misplaced-quotes', 'acceptance', ({ parseCsvRecord }) => {
      for (const value of ['"open', 'ab"cd', '"done"x', '"done" '])
        assert.throws(() => parseCsvRecord(value), SyntaxError);
    }),
    check('csv.no-physical-newlines', 'acceptance', ({ parseCsvRecord }) => {
      for (const value of ['a\nb', 'a\r\nb', '"a\nb"', '"a\rb"'])
        assert.throws(() => parseCsvRecord(value), SyntaxError);
    }),
    check('csv.non-string-rejected', 'acceptance', ({ parseCsvRecord }) => {
      for (const value of [null, undefined, 42, ['a', 'b']])
        assert.throws(() => parseCsvRecord(value), TypeError);
    }),
    check('csv.calls-are-independent', 'acceptance', ({ parseCsvRecord }) => {
      assert.deepEqual(parseCsvRecord('"x,y"'), ['x,y']);
      assert.deepEqual(parseCsvRecord('one'), ['one']);
      assert.deepEqual(parseCsvRecord(',,,'), ['', '', '', '']);
    }),
  ],
  'reservation-expiry': [
    check('reservation.confirm-before-expiry', 'regression', ({ confirm }) => {
      assert.deepEqual(confirm({ state: 'active', expiresAt: 10 }, 9), {
        state: 'confirmed',
        expiresAt: 10,
      });
    }),
    check('reservation.expiry-boundary', 'acceptance', ({ confirm }) => {
      for (const now of [9, 10, 11]) {
        const input = Object.freeze({ state: 'active', expiresAt: 10, label: 'fixture' });
        assert.deepEqual(confirm(input, now), {
          ...input,
          state: now < 10 ? 'confirmed' : 'expired',
        });
        assert.equal(input.state, 'active');
      }
    }),
    check('reservation.terminal-states', 'acceptance', ({ confirm }) => {
      for (const state of ['confirmed', 'cancelled', 'expired']) {
        for (const now of [9, 10, 11]) {
          const input = Object.freeze({ state, expiresAt: 10, label: 'fixture' });
          assert.deepEqual(confirm(input, now), input);
        }
      }
    }),
  ],
  'revision-approval': [
    check('approval.current-revision-reviewer', 'regression', ({ approve }) => {
      assert.deepEqual(approve({ revision: 2, state: 'draft' }, 2, 'reviewer'), {
        status: 'ok',
        document: { revision: 2, state: 'approved' },
      });
    }),
    check('approval.authority-and-revision', 'acceptance', ({ approve }) => {
      for (const role of ['editor', 'reviewer']) {
        for (const revision of [1, 2, 3]) {
          const input = Object.freeze({ revision: 2, state: 'draft', label: 'fixture' });
          const status = role !== 'reviewer' ? 'forbidden' : revision !== 2 ? 'conflict' : 'ok';
          assert.deepEqual(approve(input, revision, role), {
            status,
            document: { ...input, state: status === 'ok' ? 'approved' : 'draft' },
          });
          assert.equal(input.state, 'draft');
        }
      }
    }),
    check('approval.idempotence', 'acceptance', ({ approve }) => {
      const input = Object.freeze({ revision: 2, state: 'approved', label: 'fixture' });
      assert.deepEqual(approve(input, 2, 'reviewer'), { status: 'ok', document: input });
      assert.deepEqual(approve(input, 1, 'reviewer'), { status: 'conflict', document: input });
    }),
  ],
  'hold-decision': [
    check('hold.owner-capture', 'regression', ({ decide }) => {
      const hold = heldFixture();
      assert.deepEqual(
        decide(hold, { type: 'capture', actor: 'owner', expectedRevision: 3, amount: 500 }, 50),
        { status: 'ok', hold: { ...hold, state: 'captured', captured: 500, revision: 4 } },
      );
    }),
    check('hold.operator-release', 'regression', ({ decide }) => {
      const hold = heldFixture();
      assert.deepEqual(
        decide(hold, { type: 'release', actor: 'operator', expectedRevision: 3 }, 50),
        {
          status: 'ok',
          hold: { ...hold, state: 'released', revision: 4 },
        },
      );
    }),
    check('hold.owner-only-commands', 'acceptance', ({ decide }) => {
      const hold = heldFixture();
      for (const command of [
        { type: 'capture', actor: 'operator', expectedRevision: 3, amount: 100 },
        { type: 'extend', actor: 'operator', expectedRevision: 3, until: 200 },
      ])
        assert.deepEqual(decide(hold, command, 50), { status: 'forbidden', hold });
      assert.equal(
        decide(hold, { type: 'release', actor: 'owner', expectedRevision: 3 }, 50).status,
        'ok',
      );
    }),
    check('hold.role-before-other-rules', 'acceptance', ({ decide }) => {
      const capture = { type: 'capture', actor: 'operator', expectedRevision: 1, amount: 9999 };
      const released = heldFixture({ state: 'released' });
      assert.deepEqual(decide(released, capture, 50), { status: 'forbidden', hold: released });
      const hold = heldFixture();
      assert.deepEqual(decide(hold, capture, 100), { status: 'forbidden', hold });
      assert.deepEqual(decide(hold, capture, 50), { status: 'forbidden', hold });
    }),
    check('hold.closed-states', 'acceptance', ({ decide }) => {
      for (const state of ['released', 'captured', 'expired']) {
        const hold = heldFixture({ state });
        for (const now of [50, 100, 150])
          for (const expectedRevision of [2, 3])
            assert.deepEqual(
              decide(hold, { type: 'release', actor: 'owner', expectedRevision }, now),
              {
                status: 'closed',
                hold,
              },
            );
      }
    }),
    check('hold.expiry-boundary', 'acceptance', ({ decide }) => {
      const hold = heldFixture();
      const release = { type: 'release', actor: 'owner', expectedRevision: 3 };
      assert.equal(decide(hold, release, 99).status, 'ok');
      for (const now of [100, 101])
        assert.deepEqual(decide(hold, release, now), {
          status: 'expired',
          hold: { ...hold, state: 'expired', revision: 4 },
        });
    }),
    check('hold.expiry-before-conflict', 'acceptance', ({ decide }) => {
      const hold = heldFixture();
      const stale = { type: 'release', actor: 'owner', expectedRevision: 2 };
      assert.deepEqual(decide(hold, stale, 99), { status: 'conflict', hold });
      assert.deepEqual(decide(hold, stale, 100), {
        status: 'expired',
        hold: { ...hold, state: 'expired', revision: 4 },
      });
    }),
    check('hold.conflict-before-invalid', 'acceptance', ({ decide }) => {
      const hold = heldFixture();
      assert.deepEqual(
        decide(hold, { type: 'capture', actor: 'owner', expectedRevision: 4, amount: 0 }, 50),
        { status: 'conflict', hold },
      );
    }),
    check('hold.capture-range', 'acceptance', ({ decide }) => {
      const hold = heldFixture();
      const capture = (amount) =>
        decide(hold, { type: 'capture', actor: 'owner', expectedRevision: 3, amount }, 50);
      for (const amount of [0, -1, 501])
        assert.deepEqual(capture(amount), { status: 'invalid', hold });
      for (const amount of [1, 500])
        assert.deepEqual(capture(amount), {
          status: 'ok',
          hold: { ...hold, state: 'captured', captured: amount, revision: 4 },
        });
    }),
    check('hold.extend-range', 'acceptance', ({ decide }) => {
      const hold = heldFixture();
      const extend = (until) =>
        decide(hold, { type: 'extend', actor: 'owner', expectedRevision: 3, until }, 50);
      for (const until of [99, 100, 3701])
        assert.deepEqual(extend(until), { status: 'invalid', hold });
      for (const until of [101, 3700])
        assert.deepEqual(extend(until), {
          status: 'ok',
          hold: { ...hold, expiresAt: until, revision: 4 },
        });
    }),
    check('hold.input-preserved', 'acceptance', ({ decide }) => {
      const hold = heldFixture();
      const snapshot = { ...hold };
      for (const command of [
        { type: 'capture', actor: 'owner', expectedRevision: 3, amount: 200 },
        { type: 'extend', actor: 'owner', expectedRevision: 3, until: 150 },
        { type: 'release', actor: 'operator', expectedRevision: 3 },
        { type: 'capture', actor: 'operator', expectedRevision: 3, amount: 200 },
      ]) {
        const result = decide(hold, Object.freeze(command), 50);
        assert.equal(result.hold.label, 'fixture');
        assert.deepEqual(hold, snapshot);
      }
      assert.deepEqual(
        decide(hold, { type: 'release', actor: 'owner', expectedRevision: 3 }, 100).hold,
        {
          ...snapshot,
          state: 'expired',
          revision: 4,
        },
      );
    }),
  ],
};

export async function evaluateModule(taskId, candidate) {
  const definitions = checkDefinitions[taskId];
  if (!definitions) throw new Error(`Unknown task: ${taskId}`);
  const checks = [];
  for (const definition of definitions) {
    try {
      await timeout(() => definition.run(candidate));
      checks.push({ id: definition.id, kind: definition.kind, passed: true });
    } catch (error) {
      checks.push({
        id: definition.id,
        kind: definition.kind,
        passed: false,
        message: String(error?.message ?? error).slice(0, 600),
      });
    }
  }
  return checks;
}
