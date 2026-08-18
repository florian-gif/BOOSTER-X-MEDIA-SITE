const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

test('confirmation pages load analytics before recording a purchase', () => {
  for (const file of ['merci.html', 'merci-en.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.match(html, /<script src="analytics-loader\.js"><\/script>/);
    assert.match(html, /<script src="tracking\.js"><\/script>/);
    assert.match(html, /trackEvent\('purchase'/);
    assert.match(html, /bx_purchase_tracked_/);
    assert.match(html, /const purchase = result\.purchase/);
  }
});

test('purchase is forwarded to GA4 and TikTok with commerce data', () => {
  const calls = [];
  const context = {
    window: {},
    document: { querySelector: () => null, querySelectorAll: () => [] },
    localStorage: { getItem: () => null, setItem: () => {} },
    gtag: (...args) => calls.push(['ga4', ...args]),
    ttq: { track: (...args) => calls.push(['tiktok', ...args]) }
  };
  context.window.gtag = context.gtag;
  context.window.ttq = context.ttq;
  vm.runInNewContext(fs.readFileSync(path.join(root, 'tracking.js'), 'utf8'), context);

  context.window.trackEvent('purchase', {
    transaction_id: 'PAYPAL-123',
    value: 19.9,
    currency: 'EUR',
    items: [{ item_id: 'Instagram Followers 1K', item_name: 'Instagram Followers 1K', price: 19.9, quantity: 1 }]
  });

  assert.equal(calls[0][0], 'ga4');
  assert.equal(calls[0][2], 'purchase');
  assert.equal(calls[1][0], 'tiktok');
  assert.equal(calls[1][1], 'Purchase');
  assert.equal(calls[1][2].value, 19.9);
  assert.equal(calls[1][2].currency, 'EUR');
  assert.equal(calls[1][2].content_id, 'Instagram Followers 1K');
});
