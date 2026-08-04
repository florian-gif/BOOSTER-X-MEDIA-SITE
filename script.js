const PAYPAL_HANDLE = 'FlorianDemaison615';
const WHATSAPP_NUMBER = '33770111399';
const modal = document.querySelector('#modal');
const form = document.querySelector('#orderForm');
const fields = ['pack', 'platform', 'type', 'amount'].reduce((all, id) => ({ ...all, [id]: document.querySelector(`#${id}`) }), {});

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
  document.querySelectorAll('.pack-panel').forEach(panel => panel.classList.remove('active'));
  tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
  document.querySelector(`#${tab.dataset.target}`).classList.add('active');
}));

function openModal(button) {
  Object.keys(fields).forEach(key => fields[key].value = button.dataset[key]);
  document.querySelector('#selectedPack').textContent = button.dataset.pack;
  document.querySelector('#modalPrice').textContent = `${Number(button.dataset.amount).toLocaleString('fr-FR', { minimumFractionDigits: Number(button.dataset.amount) % 1 ? 2 : 0 })} €`;
  const postField = document.querySelector('#postField');
  const needsPost = ['likes', 'combo'].includes(button.dataset.type);
  postField.hidden = !needsPost;
  document.querySelector('#postLink').required = needsPost;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.querySelector('#handle').focus(), 50);
}

function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
document.querySelectorAll('.order-btn').forEach(button => button.addEventListener('click', () => openModal(button)));
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

form.addEventListener('submit', event => {
  event.preventDefault();
  const order = {
    pack: fields.pack.value, platform: fields.platform.value, type: fields.type.value, amount: fields.amount.value,
    handle: document.querySelector('#handle').value.trim().replace(/^@/, ''), postLink: document.querySelector('#postLink').value.trim(), email: document.querySelector('#email').value.trim()
  };
  if (!order.handle) return;
  const params = new URLSearchParams({ pack: order.pack, platform: order.platform, type: order.type, amount: order.amount, handle: order.handle, post: order.postLink, email: order.email });
  const message = encodeURIComponent(`Nouvelle commande BoosterX ✅\nPack : ${order.pack}\nPlateforme : ${order.platform}\nType : ${order.type}\nMontant : ${order.amount}€\nPseudo : ${order.handle}\nLien du post : ${order.postLink || '—'}\nEmail : ${order.email}`);
  sessionStorage.setItem('bx_last_order', JSON.stringify(order));
  sessionStorage.setItem('bx_last_wa', `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`);
  sessionStorage.setItem('bx_merci_url', `merci.html?${params}`);
  try { if (window.ttq?.track) ttq.track('InitiateCheckout', { value: Number(order.amount), currency: 'EUR', contents: [{ content_id: order.pack, content_type: order.type }] }); } catch (_) {}
  document.querySelector('#toast').classList.add('show');
  setTimeout(() => { window.location.href = `https://paypal.me/${PAYPAL_HANDLE}/${encodeURIComponent(order.amount)}`; }, 450);
});

function showOrderRecovery() {
  const savedUrl = sessionStorage.getItem('bx_merci_url');
  if (!savedUrl || sessionStorage.getItem('bx_recovery_dismissed') === '1') return;
  document.querySelector('#recoveryLink').href = savedUrl;
  document.querySelector('#orderRecovery').hidden = false;
}
window.addEventListener('pageshow', showOrderRecovery);
document.querySelector('#recoveryClose').addEventListener('click', () => {
  document.querySelector('#orderRecovery').hidden = true;
  sessionStorage.setItem('bx_recovery_dismissed', '1');
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelectorAll('[data-count]').forEach(counter => {
  let done = false;
  new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting || done) return; done = true; const target = Number(counter.dataset.count); const start = performance.now(); const tick = now => { const p = Math.min((now - start) / 1100, 1); counter.textContent = `${(target * (1 - Math.pow(1 - p, 3))).toFixed(1)}K`; if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); })).observe(counter);
});

['brand-link','ig-link','tt-link','wa-link'].forEach(id => document.querySelector(`#${id}`)?.addEventListener('click', event => { try { if (window.gtag) gtag('event','click',{event_category:'outbound',event_label:id,link_url:event.currentTarget.href}); } catch (_) {} }));
