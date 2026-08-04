const { PACKS, PAYPAL_API, accessToken } = require('./_config');
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { pack, platform, type, handle = '', postLink = '', email = '' } = req.body || {};
    const amount = PACKS[pack];
    if (!amount || !email || (type !== 'likes' && !handle) || (type !== 'followers' && !postLink)) return res.status(400).json({ error: 'Informations incomplètes' });
    const origin = `https://${req.headers['x-forwarded-host'] || req.headers.host || 'www.boosterxmedia.com'}`;
    const token = await accessToken();
    const details = `Profil: ${handle || '—'} | Publication: ${postLink || '—'} | Email: ${email}`;
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': `bx-${Date.now()}-${Math.random().toString(36).slice(2)}` }, body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: 'EUR', value: amount, breakdown: { item_total: { currency_code: 'EUR', value: amount } } }, description: details.slice(0, 127), custom_id: `${type}|${handle}|${email}`.slice(0, 127), items: [{ name: pack.slice(0, 127), description: details.slice(0, 127), quantity: '1', unit_amount: { currency_code: 'EUR', value: amount } }] }], payment_source: { paypal: { experience_context: { brand_name: 'BoosterX Media', user_action: 'PAY_NOW', return_url: `${origin}/merci.html`, cancel_url: `${origin}/#packs` } } } }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'PayPal order creation failed');
    const approvalUrl = data.links?.find(link => ['payer-action', 'approve', 'payer'].includes(link.rel))?.href;
    if (!approvalUrl) throw new Error('PayPal approval link missing');
    return res.status(200).json({ orderId: data.id, approvalUrl });
  } catch (error) { return res.status(500).json({ error: 'Impossible de préparer le paiement' }); }
};
