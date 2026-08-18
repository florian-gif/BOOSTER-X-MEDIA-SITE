const { configured, getOrderByPaypalId, listOrders, updateOrderByPaypalId, addSnapshot, listSnapshots } = require('./_store');

const ORDER_ID = /^[A-Z0-9]{10,30}$/;
const STAGES = new Set(['order', 'pre_delivery', 'post_delivery', 'claim', 'refill']);
const METRICS = new Set(['followers', 'likes', 'views']);

function authorized(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  return Boolean(process.env.BX_ADMIN_TOKEN && token && token === process.env.BX_ADMIN_TOKEN);
}

module.exports = async function handler(req, res) {
  if (!authorized(req)) return res.status(401).json({ error: 'Accès refusé' });
  if (!configured()) return res.status(503).json({ error: 'Base de suivi non configurée' });
  try {
    if (req.method === 'GET') {
      const orderId = String(req.query?.orderId || '');
      if (!orderId) return res.status(200).json({ orders: await listOrders(req.query?.limit) });
      if (!ORDER_ID.test(orderId)) return res.status(400).json({ error: 'Référence invalide' });
      const order = await getOrderByPaypalId(orderId);
      if (!order) return res.status(404).json({ error: 'Commande introuvable' });
      return res.status(200).json({ order, snapshots: await listSnapshots(order.id) });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const orderId = String(req.body?.orderId || '');
    const stage = String(req.body?.stage || '');
    const metric = String(req.body?.metric || 'followers');
    const count = Number(req.body?.count);
    const note = String(req.body?.note || '').trim().slice(0, 500);
    if (!ORDER_ID.test(orderId) || !STAGES.has(stage) || !METRICS.has(metric) || !Number.isInteger(count) || count < 0) {
      return res.status(400).json({ error: 'Relevé invalide' });
    }
    const order = await getOrderByPaypalId(orderId);
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });

    const snapshot = await addSnapshot({
      order_id: order.id,
      stage,
      metric,
      count_value: count,
      source: 'admin_controlled',
      note: note || null
    });

    const changes = {};
    if (stage === 'pre_delivery' && metric === 'followers' && order.followers_ordered > 0) {
      changes.followers_baseline = count;
      changes.followers_guaranteed_floor = count + order.followers_ordered;
      changes.status = 'processing';
    }
    if (stage === 'post_delivery') {
      changes.status = 'delivered';
      changes.delivered_at = new Date().toISOString();
      changes.warranty_ends_at = new Date(Date.now() + 60 * 86400000).toISOString();
    }
    if (stage === 'refill') changes.status = 'delivered';
    const updated = Object.keys(changes).length ? await updateOrderByPaypalId(orderId, changes) : order;
    return res.status(200).json({ order: updated, snapshot });
  } catch (_) {
    return res.status(500).json({ error: 'Impossible d’enregistrer le relevé' });
  }
};
