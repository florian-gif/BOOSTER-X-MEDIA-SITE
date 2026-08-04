const { PAYPAL_API, accessToken } = require('./_config');
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const orderId = String(req.body?.orderId || '');
  if (!/^[A-Z0-9]{10,30}$/.test(orderId)) return res.status(400).json({ error: 'Invalid order' });
  try {
    const token = await accessToken();
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': `capture-${orderId}` } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Capture failed');
    return res.status(200).json({ status: data.status, orderId: data.id, payer: data.payer?.email_address || '' });
  } catch (error) { return res.status(500).json({ error: 'Impossible de confirmer le paiement' }); }
};
