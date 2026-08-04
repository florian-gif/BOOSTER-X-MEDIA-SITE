const { PAYPAL_API, accessToken } = require('./_config');
const escapeHtml = value => String(value || '—').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

async function notifySeller(orderId, payment) {
  if (!process.env.RESEND_API_KEY || !process.env.ORDER_NOTIFICATION_EMAIL) return false;
  const unit = payment.purchase_units?.[0] || {};
  const capture = unit.payments?.captures?.[0] || {};
  const item = unit.items?.[0] || {};
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'User-Agent': 'BoosterX-Media/1.0', 'Idempotency-Key': `paypal-${orderId}` },
    body: JSON.stringify({
      from: process.env.ORDER_FROM_EMAIL || 'BoosterX Media <onboarding@resend.dev>',
      to: [process.env.ORDER_NOTIFICATION_EMAIL],
      subject: `Nouvelle commande BoosterX — ${item.name || orderId}`,
      html: `<h2>Nouvelle commande payée</h2><p><b>Pack :</b> ${escapeHtml(item.name)}</p><p><b>Montant :</b> ${escapeHtml(capture.amount?.value)} ${escapeHtml(capture.amount?.currency_code || 'EUR')}</p><p><b>Informations de livraison :</b><br>${escapeHtml(item.description || unit.description)}</p><p><b>Référence PayPal :</b> ${escapeHtml(orderId)}</p>`
    })
  });
  return response.ok;
}
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const orderId = String(req.body?.orderId || '');
  if (!/^[A-Z0-9]{10,30}$/.test(orderId)) return res.status(400).json({ error: 'Invalid order' });
  try {
    const token = await accessToken();
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': `capture-${orderId}` } });
    let data = await response.json();
    if (!response.ok) {
      const alreadyCaptured = data.details?.some(detail => detail.issue === 'ORDER_ALREADY_CAPTURED');
      if (!alreadyCaptured) throw new Error(data.message || 'Capture failed');
      const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } });
      data = await orderResponse.json();
      if (!orderResponse.ok) throw new Error('Unable to retrieve captured order');
    }
    let notified = false;
    if (data.status === 'COMPLETED') notified = await notifySeller(orderId, data);
    return res.status(200).json({ status: data.status, orderId: data.id, payer: data.payer?.email_address || '', notified });
  } catch (error) { return res.status(500).json({ error: 'Impossible de confirmer le paiement' }); }
};
