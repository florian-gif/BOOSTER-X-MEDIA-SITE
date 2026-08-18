const test = require('node:test');
const assert = require('node:assert/strict');
const { PACKS, PACK_DETAILS } = require('../api/paypal/_config');
const admin = require('../api/orders/admin');
const createPaypalOrder = require('../api/paypal/create-order');

test('every payable pack has server-side tracking quantities', () => {
  assert.deepEqual(Object.keys(PACK_DETAILS).sort(), Object.keys(PACKS).sort());
  for (const details of Object.values(PACK_DETAILS)) {
    assert.equal(Number.isInteger(details.followers), true);
    assert.equal(Number.isInteger(details.likes), true);
    assert.equal(details.followers > 0 || details.likes > 0, true);
  }
});

test('admin tracking rejects requests without the server token', async () => {
  const req = { method: 'GET', headers: {}, query: {} };
  let statusCode;
  let payload;
  const res = { status(code) { statusCode = code; return this; }, json(value) { payload = value; return value; } };
  await admin(req, res);
  assert.equal(statusCode, 401);
  assert.equal(payload.error, 'Accès refusé');
});

test('checkout records the server-side quantity and price', async () => {
  const previousFetch = global.fetch;
  const previousEnv = { ...process.env };
  let stored;
  process.env.PAYPAL_CLIENT_ID = 'client';
  process.env.PAYPAL_CLIENT_SECRET = 'secret';
  process.env.SUPABASE_URL = 'https://database.example';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  global.fetch = async (url, options = {}) => {
    if (url.endsWith('/v1/oauth2/token')) return { ok: true, json: async () => ({ access_token: 'paypal-token' }) };
    if (url.endsWith('/v2/checkout/orders')) return { ok: true, json: async () => ({ id: 'PAYPALORDER123', links: [{ rel: 'approve', href: 'https://paypal.example/approve' }] }) };
    if (url === 'https://database.example/rest/v1/bx_orders') {
      stored = JSON.parse(options.body);
      return { ok: true, text: async () => JSON.stringify([{ id: 'internal-order', ...stored }]) };
    }
    throw new Error(`Unexpected request: ${url}`);
  };
  let statusCode;
  let payload;
  const req = { method: 'POST', headers: { host: 'www.boosterxmedia.com' }, body: { pack: 'Instagram Followers 1K', platform: 'Instagram', type: 'followers', handle: '@Exemple', email: 'CLIENT@EXAMPLE.COM', amount: '0.01' } };
  const res = { status(code) { statusCode = code; return this; }, json(value) { payload = value; return value; } };
  try {
    await createPaypalOrder(req, res);
    assert.equal(statusCode, 200);
    assert.equal(payload.tracking, true);
    assert.equal(stored.amount, 19.9);
    assert.equal(stored.followers_ordered, 1000);
    assert.equal(stored.normalized_handle, 'exemple');
    assert.equal(stored.customer_email, 'client@example.com');
  } finally {
    global.fetch = previousFetch;
    process.env = previousEnv;
  }
});

test('controlled pre-delivery snapshot calculates the guaranteed floor', async () => {
  const previousFetch = global.fetch;
  const previousEnv = { ...process.env };
  process.env.SUPABASE_URL = 'https://database.example';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  process.env.BX_ADMIN_TOKEN = 'admin-secret';
  global.fetch = async (url, options = {}) => {
    if (url.includes('/bx_orders?paypal_order_id=eq.PAYPALORDER123') && (!options.method || options.method === 'GET')) {
      return { ok: true, text: async () => JSON.stringify([{ id: 'internal-order', paypal_order_id: 'PAYPALORDER123', followers_ordered: 1000, status: 'paid' }]) };
    }
    if (url.endsWith('/bx_order_snapshots') && options.method === 'POST') {
      return { ok: true, text: async () => JSON.stringify([{ id: 1, ...JSON.parse(options.body) }]) };
    }
    if (url.includes('/bx_orders?paypal_order_id=eq.PAYPALORDER123') && options.method === 'PATCH') {
      return { ok: true, text: async () => JSON.stringify([{ id: 'internal-order', paypal_order_id: 'PAYPALORDER123', ...JSON.parse(options.body) }]) };
    }
    throw new Error(`Unexpected request: ${url}`);
  };
  let statusCode;
  let payload;
  const req = { method: 'POST', headers: { authorization: 'Bearer admin-secret' }, body: { orderId: 'PAYPALORDER123', stage: 'pre_delivery', metric: 'followers', count: 800 } };
  const res = { status(code) { statusCode = code; return this; }, json(value) { payload = value; return value; } };
  try {
    await admin(req, res);
    assert.equal(statusCode, 200);
    assert.equal(payload.order.followers_baseline, 800);
    assert.equal(payload.order.followers_guaranteed_floor, 1800);
    assert.equal(payload.snapshot.source, 'admin_controlled');
  } finally {
    global.fetch = previousFetch;
    process.env = previousEnv;
  }
});
