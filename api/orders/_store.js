const jsonHeaders = () => ({
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json'
});

function configured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function request(path, options = {}) {
  if (!configured()) return null;
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { ...jsonHeaders(), Prefer: 'return=representation', ...(options.headers || {}) }
  });
  const body = await response.text();
  const data = body ? JSON.parse(body) : null;
  if (!response.ok) throw new Error(`Order store error ${response.status}`);
  return data;
}

async function createOrder(order) {
  const rows = await request('bx_orders', { method: 'POST', body: JSON.stringify(order) });
  return rows?.[0] || null;
}

async function updateOrderByPaypalId(paypalOrderId, changes) {
  const id = encodeURIComponent(paypalOrderId);
  const rows = await request(`bx_orders?paypal_order_id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ ...changes, updated_at: new Date().toISOString() })
  });
  return rows?.[0] || null;
}

async function getOrderByPaypalId(paypalOrderId) {
  const id = encodeURIComponent(paypalOrderId);
  const rows = await request(`bx_orders?paypal_order_id=eq.${id}&select=*`);
  return rows?.[0] || null;
}

async function listOrders(limit = 50) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 100));
  return (await request(`bx_orders?select=*&order=created_at.desc&limit=${safeLimit}`)) || [];
}

async function addSnapshot(snapshot) {
  const rows = await request('bx_order_snapshots', { method: 'POST', body: JSON.stringify(snapshot) });
  return rows?.[0] || null;
}

async function listSnapshots(orderId) {
  const id = encodeURIComponent(orderId);
  return (await request(`bx_order_snapshots?order_id=eq.${id}&select=*&order=recorded_at.asc`)) || [];
}

module.exports = { configured, createOrder, updateOrderByPaypalId, getOrderByPaypalId, listOrders, addSnapshot, listSnapshots };
