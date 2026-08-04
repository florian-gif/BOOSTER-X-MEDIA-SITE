const modal = document.querySelector('#modal');
const form = document.querySelector('#orderForm');
const fields = ['pack', 'platform', 'type', 'amount'].reduce((all, id) => ({ ...all, [id]: document.querySelector(`#${id}`) }), {});
const handle = document.querySelector('#handle');
const postLink = document.querySelector('#postLink');
const customerEmail = document.querySelector('#customerEmail');
const handleField = document.querySelector('#handleField');
const postField = document.querySelector('#postField');

function orderItem(order) { return { item_id: order.pack, item_name: order.pack, item_category: order.platform, item_category2: order.type, price: Number(order.amount), quantity: 1 }; }

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
  document.querySelectorAll('.pack-panel').forEach(panel => panel.classList.remove('active'));
  tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
  document.querySelector(`#${tab.dataset.target}`).classList.add('active');
  trackEvent('pack_category_view', { category: tab.dataset.target });
}));

function openModal(button) {
  Object.keys(fields).forEach(key => fields[key].value = button.dataset[key]);
  document.querySelector('#selectedPack').textContent = window.BX_I18N?.packName(button.dataset.pack) || button.dataset.pack;
  const locale = window.BX_I18N?.lang === 'en' ? 'en-GB' : 'fr-FR';
  document.querySelector('#modalPrice').textContent = `${Number(button.dataset.amount).toLocaleString(locale, { minimumFractionDigits: Number(button.dataset.amount) % 1 ? 2 : 0 })} €`;
  const needsHandle = button.dataset.type !== 'likes';
  const needsPost = button.dataset.type !== 'followers';
  handleField.hidden = !needsHandle; handle.required = needsHandle;
  postField.hidden = !needsPost; postLink.required = needsPost;
  handle.value = ''; postLink.value = ''; customerEmail.value = '';
  const selectedOrder = { pack: button.dataset.pack, platform: button.dataset.platform, type: button.dataset.type, amount: button.dataset.amount };
  trackEvent('select_item', { currency: 'EUR', value: Number(selectedOrder.amount), items: [orderItem(selectedOrder)] });
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  setTimeout(() => (needsHandle ? handle : postLink).focus(), 50);
}

function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
document.querySelectorAll('.order-btn').forEach(button => button.addEventListener('click', () => openModal(button)));
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

form.addEventListener('submit', async event => {
  event.preventDefault();
  const order = { pack: fields.pack.value, platform: fields.platform.value, type: fields.type.value, amount: fields.amount.value, handle: handle.value.trim(), postLink: postLink.value.trim(), email: customerEmail.value.trim(), lang: window.BX_I18N?.lang || 'fr' };
  trackEvent('begin_checkout', { currency: 'EUR', value: Number(order.amount), items: [orderItem(order)] });
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true; submit.querySelector('span').textContent = window.BX_I18N?.t('Préparation du paiement…') || 'Préparation du paiement…';
  try {
    const response = await fetch('/api/paypal/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
    const result = await response.json();
    if (!response.ok || !result.approvalUrl) throw new Error(result.error || 'Paiement indisponible');
    sessionStorage.setItem('bx_last_order', JSON.stringify({ ...order, orderId: result.orderId }));
    trackEvent('paypal_redirect', { pack_name: order.pack, platform: order.platform, service_type: order.type, value: Number(order.amount), currency: 'EUR' });
    window.location.href = result.approvalUrl;
  } catch (error) {
    alert(window.BX_I18N?.t('Le paiement est momentanément indisponible. Contactez-nous sur WhatsApp.') || 'Le paiement est momentanément indisponible. Contactez-nous sur WhatsApp.');
    submit.disabled = false; submit.querySelector('span').textContent = window.BX_I18N?.t('Continuer vers PayPal') || 'Continuer vers PayPal';
  }
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelectorAll('[data-count]').forEach(counter => { let done = false; new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting || done) return; done = true; const target = Number(counter.dataset.count); const start = performance.now(); const tick = now => { const p = Math.min((now - start) / 1100, 1); counter.textContent = `${(target * (1 - Math.pow(1 - p, 3))).toFixed(1)}K`; if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); })).observe(counter); });
