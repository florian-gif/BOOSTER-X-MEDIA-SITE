const { PACKS, PACK_DETAILS, paypalApi, paypalEnvironment, accessToken } = require('./_config');
const { configured: trackingConfigured, createOrder: saveTrackedOrder } = require('../orders/_store');
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { pack, platform, type, handle = '', postLink = '', email = '', lang = 'fr' } = req.body || {};
    const amount = PACKS[pack];
    const quantities = PACK_DETAILS[pack];
    if (!amount || !email || (type !== 'likes' && !handle) || (type !== 'followers' && !postLink)) return res.status(400).json({ error: 'Informations incomplètes' });
    const origin = `https://${req.headers['x-forwarded-host'] || req.headers.host || 'www.boosterxmedia.com'}`;
    const token = await accessToken();
    let cleanPostLink = postLink;
    try { const url = new URL(postLink); cleanPostLink = `${url.origin}${url.pathname}`; } catch (_) {}
    const safeLang = lang === 'en' ? 'en' : 'fr';
    const details = `Profil: ${handle || '—'} | Publication: ${cleanPostLink || '—'} | Email: ${email}`;
    const response = await fetch(`${paypalApi()}/v2/checkout/orders`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': `bx-${Date.now()}-${Math.random().toString(36).slice(2)}` }, body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: 'EUR', value: amount, breakdown: { item_total: { currency_code: 'EUR', value: amount } } }, description: details.slice(0, 127), custom_id: `${handle}|${cleanPostLink}|${email}`.slice(0, 127), items: [{ name: pack.slice(0, 127), description: details.slice(0, 127), quantity: '1', unit_amount: { currency_code: 'EUR', value: amount } }] }], payment_source: { paypal: { experience_context: { brand_name: 'BoosterX Media', user_action: 'PAY_NOW', return_url: `${origin}/${safeLang === 'en' ? 'merci-en.html' : 'merci.html'}`, cancel_url: `${origin}/${safeLang === 'en' ? '?lang=en' : ''}#packs` } } } }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'PayPal order creation failed');
    const approvalUrl = data.links?.find(link => ['payer-action', 'approve', 'payer'].includes(link.rel))?.href;
    if (!approvalUrl) throw new Error('PayPal approval link missing');
    if (trackingConfigured()) {
      const normalizedHandle = handle.trim().replace(/^@+/, '').toLowerCase();
      await saveTrackedOrder({
        paypal_order_id: data.id,
        pack,
        platform,
        service_type: type,
        handle: handle.trim() || null,
        normalized_handle: normalizedHandle || null,
        post_link: cleanPostLink || null,
        customer_email: email.trim().toLowerCase(),
        amount: Number(amount),
        currency: 'EUR',
        payment_environment: paypalEnvironment(),
        followers_ordered: quantities?.followers || 0,
        likes_ordered: quantities?.likes || 0
      });
    }
    return res.status(200).json({ orderId: data.id, approvalUrl, tracking: trackingConfigured() });
  } catch (error) { return res.status(500).json({ error: 'Impossible de préparer le paiement' }); }
};
