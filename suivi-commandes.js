const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '—').replace(/[&<>"']/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[char]));
const date = value => value ? new Intl.DateTimeFormat('fr-FR',{dateStyle:'short',timeStyle:'short'}).format(new Date(value)) : '—';
let token = sessionStorage.getItem('bx_admin_token') || '';
let allOrders = [];
let selected = '';

async function api(path = '', options = {}) {
  const response = await fetch(`/api/orders/admin${path}`, { ...options, headers: { Authorization:`Bearer ${token}`,'Content-Type':'application/json',...(options.headers||{}) } });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Erreur du suivi');
  return result;
}
function message(text, type='') { $('#message').textContent=text; $('#message').className=`message ${type}`; }
function showDashboard() { $('#login').hidden=true; $('#dashboard').hidden=false; $('#disconnect').hidden=false; }
function showLogin() { $('#login').hidden=false; $('#dashboard').hidden=true; $('#disconnect').hidden=true; }

async function loadOrders() {
  message('Chargement…');
  try { allOrders=(await api('?limit=100')).orders; renderOrders(); message(`${allOrders.length} commande(s) chargée(s).`,'ok'); }
  catch(error){ message(error.message,'error'); if(/Accès/.test(error.message)) logout(); }
}
function renderOrders() {
  const query=$('#search').value.trim().toLowerCase();
  const rows=allOrders.filter(order=>[order.paypal_order_id,order.handle,order.customer_email,order.pack].some(value=>String(value||'').toLowerCase().includes(query)));
  $('#orders').innerHTML=rows.map(order=>`<button class="order ${selected===order.paypal_order_id?'active':''}" data-id="${esc(order.paypal_order_id)}"><strong>${esc(order.handle||order.post_link||order.pack)}</strong><span>${esc(order.pack)}</span><span>${date(order.created_at)} · ${esc(order.amount)} €</span><span class="badge">${esc(order.status)}</span></button>`).join('')||'<p>Aucune commande trouvée.</p>';
  document.querySelectorAll('.order').forEach(button=>button.addEventListener('click',()=>loadDetail(button.dataset.id)));
}
async function loadDetail(orderId) {
  selected=orderId; renderOrders(); message('Chargement de la commande…');
  try { const data=await api(`?orderId=${encodeURIComponent(orderId)}`); renderDetail(data); message('Commande chargée.','ok'); }
  catch(error){message(error.message,'error')}
}
function renderDetail({order,snapshots}) {
  $('#empty').hidden=true; $('#detail').hidden=false;
  const current=[...snapshots].reverse().find(item=>item.metric==='followers'&&['claim','refill','post_delivery'].includes(item.stage));
  const refill=order.followers_guaranteed_floor!=null&&current?Math.max(0,order.followers_guaranteed_floor-current.count_value):null;
  $('#detail').innerHTML=`<h2>${esc(order.pack)}</h2><div class="facts">
    <div class="fact"><span>Référence PayPal</span><strong>${esc(order.paypal_order_id)}</strong></div><div class="fact"><span>Statut</span><strong>${esc(order.status)}</strong></div>
    <div class="fact"><span>Profil</span><strong>${esc(order.handle)}</strong></div><div class="fact"><span>E-mail</span><strong>${esc(order.customer_email)}</strong></div>
    <div class="fact"><span>Abonnés commandés</span><strong>${esc(order.followers_ordered)}</strong></div><div class="fact"><span>Likes commandés</span><strong>${esc(order.likes_ordered)}</strong></div>
  </div><div class="guarantee"><strong>Seuil garanti : ${esc(order.followers_guaranteed_floor)}</strong><br><span>Garantie jusqu’au ${date(order.warranty_ends_at)}${refill===null?'':` · Remplacement suggéré : ${refill}`}</span></div>
  <form id="snapshotForm" class="snapshot-form"><select id="stage"><option value="pre_delivery">Avant livraison</option><option value="post_delivery">Après livraison</option><option value="claim">Demande SAV</option><option value="refill">Après remplacement</option><option value="order">À la commande</option></select><select id="metric"><option value="followers">Abonnés</option><option value="likes">Likes</option><option value="views">Vues</option></select><input id="count" type="number" min="0" step="1" placeholder="Compteur contrôlé" required><textarea id="note" placeholder="Note facultative"></textarea><button type="submit">Enregistrer le relevé horodaté</button></form>
  <div class="timeline"><h2>Historique</h2>${[...snapshots].reverse().map(item=>`<div class="event"><strong>${esc(item.count_value)} ${esc(item.metric)}</strong><span>${esc(item.stage)} · ${date(item.recorded_at)}</span>${item.note?`<p>${esc(item.note)}</p>`:''}</div>`).join('')||'<p>Aucun relevé.</p>'}</div>`;
  $('#snapshotForm').addEventListener('submit',event=>saveSnapshot(event,order.paypal_order_id));
}
async function saveSnapshot(event,orderId) {
  event.preventDefault(); const button=event.currentTarget.querySelector('button'); button.disabled=true;
  try { await api('',{method:'POST',body:JSON.stringify({orderId,stage:$('#stage').value,metric:$('#metric').value,count:Number($('#count').value),note:$('#note').value})}); await loadDetail(orderId); message('Relevé enregistré et horodaté.','ok'); }
  catch(error){message(error.message,'error');button.disabled=false}
}
function logout(){token='';sessionStorage.removeItem('bx_admin_token');showLogin()}
$('#loginForm').addEventListener('submit',async event=>{event.preventDefault();token=$('#token').value;sessionStorage.setItem('bx_admin_token',token);showDashboard();await loadOrders()});
$('#disconnect').addEventListener('click',logout); $('#refresh').addEventListener('click',loadOrders); $('#search').addEventListener('input',renderOrders);
if(token){showDashboard();loadOrders()}else showLogin();
