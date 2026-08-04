const PAYPAL_LINKS = {
  'Instagram Followers 1K': 'https://www.paypal.com/ncp/payment/KT6QWU9M7GMHU',
  'Instagram Followers 5K': 'https://www.paypal.com/ncp/payment/TJ4VG5JHG7RZQ',
  'Instagram Followers 10K': 'https://www.paypal.com/ncp/payment/6F3E6BAYJEEWC',
  'Instagram Likes 500': 'https://www.paypal.com/ncp/payment/W3867EV5HMGXC',
  'Instagram Likes 1K': 'https://www.paypal.com/ncp/payment/3QNKVNMEEUBKY',
  'Instagram Likes 5K': 'https://www.paypal.com/ncp/payment/QDKJTGM53NDTQ',
  'Instagram Likes 10K': 'https://www.paypal.com/ncp/payment/94SPTKN3YJFJA',
  'TikTok Followers 1K': 'https://www.paypal.com/ncp/payment/8QEC5D9HGVC8A',
  'TikTok Followers 5K': 'https://www.paypal.com/ncp/payment/T5U26EETDQ3E4',
  'TikTok Followers 10K': 'https://www.paypal.com/ncp/payment/WQUZG33TDNUXG',
  'Pack Starter (1K abonnés + 1K likes)': 'https://www.paypal.com/ncp/payment/YXJDC642K2G2Y',
  'Pack Boost (5K abonnés + 5K likes)': 'https://www.paypal.com/ncp/payment/JAAN6GKPLQWWY',
  'Pack Premium (10K abonnés + 10K likes)': 'https://www.paypal.com/ncp/payment/CL4TXBBJV4HA2'
};
const modal = document.querySelector('#modal');
const form = document.querySelector('#orderForm');
const fields = ['pack', 'platform', 'type', 'amount'].reduce((all, id) => ({ ...all, [id]: document.querySelector(`#${id}`) }), {});
const CONSENT_KEY = 'boosterx_analytics_consent';

function trackEvent(name, params = {}) {
  try { if (window.gtag) gtag('event', name, params); } catch (_) {}
}

function orderItem(order) {
  return { item_id: order.pack, item_name: order.pack, item_category: order.platform, item_category2: order.type, price: Number(order.amount), quantity: 1 };
}

function applyAnalyticsConsent(choice) {
  const granted = choice === 'granted';
  try { if (window.gtag) gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }); } catch (_) {}
  try { if (window.ttq) granted ? ttq.grantConsent() : ttq.revokeConsent(); } catch (_) {}
}

const savedConsent = localStorage.getItem(CONSENT_KEY);
if (savedConsent) applyAnalyticsConsent(savedConsent);
else document.querySelector('#cookieBanner').hidden = false;

document.querySelector('#cookieAccept').addEventListener('click', () => {
  localStorage.setItem(CONSENT_KEY, 'granted');
  applyAnalyticsConsent('granted');
  document.querySelector('#cookieBanner').hidden = true;
  trackEvent('consent_update', { consent_choice: 'granted' });
});
document.querySelector('#cookieReject').addEventListener('click', () => {
  localStorage.setItem(CONSENT_KEY, 'denied');
  applyAnalyticsConsent('denied');
  document.querySelector('#cookieBanner').hidden = true;
});
document.querySelector('#cookieSettings').addEventListener('click', () => {
  document.querySelector('#cookieBanner').hidden = false;
});

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
  document.querySelectorAll('.pack-panel').forEach(panel => panel.classList.remove('active'));
  tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
  document.querySelector(`#${tab.dataset.target}`).classList.add('active');
  trackEvent('pack_category_view', { category: tab.dataset.target });
}));

function openModal(button) {
  Object.keys(fields).forEach(key => fields[key].value = button.dataset[key]);
  document.querySelector('#selectedPack').textContent = button.dataset.pack;
  document.querySelector('#modalPrice').textContent = `${Number(button.dataset.amount).toLocaleString('fr-FR', { minimumFractionDigits: Number(button.dataset.amount) % 1 ? 2 : 0 })} €`;
  const instructions = {
    followers: `PayPal vous demandera le pseudo du profil ${button.dataset.platform}.`,
    likes: 'PayPal vous demandera le lien de la publication Instagram.',
    combo: 'PayPal vous demandera le pseudo du profil et le lien de la publication.'
  };
  document.querySelector('#paypalInfo').textContent = instructions[button.dataset.type];
  const selectedOrder = { pack: button.dataset.pack, platform: button.dataset.platform, type: button.dataset.type, amount: button.dataset.amount };
  trackEvent('select_item', { currency: 'EUR', value: Number(selectedOrder.amount), items: [orderItem(selectedOrder)] });
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => form.querySelector('button[type="submit"]').focus(), 50);
}

function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
document.querySelectorAll('.order-btn').forEach(button => button.addEventListener('click', () => openModal(button)));
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

form.addEventListener('submit', event => {
  event.preventDefault();
  const order = { pack: fields.pack.value, platform: fields.platform.value, type: fields.type.value, amount: fields.amount.value };
  trackEvent('begin_checkout', { currency: 'EUR', value: Number(order.amount), items: [orderItem(order)] });
  trackEvent('paypal_redirect', { pack_name: order.pack, platform: order.platform, service_type: order.type, value: Number(order.amount), currency: 'EUR' });
  try { if (window.ttq?.track) ttq.track('InitiateCheckout', { value: Number(order.amount), currency: 'EUR', contents: [{ content_id: order.pack, content_type: order.type }] }); } catch (_) {}
  document.querySelector('#toast').classList.add('show');
  const paypalUrl = PAYPAL_LINKS[order.pack];
  if (!paypalUrl) {
    document.querySelector('#toast').classList.remove('show');
    alert('Ce lien de paiement est momentanément indisponible. Contactez-nous sur WhatsApp.');
    return;
  }
  setTimeout(() => { window.location.href = paypalUrl; }, 450);
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelectorAll('[data-count]').forEach(counter => {
  let done = false;
  new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting || done) return; done = true; const target = Number(counter.dataset.count); const start = performance.now(); const tick = now => { const p = Math.min((now - start) / 1100, 1); counter.textContent = `${(target * (1 - Math.pow(1 - p, 3))).toFixed(1)}K`; if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); })).observe(counter);
});

document.querySelectorAll('#ig-link,#tt-link,#wa-link,[data-track]').forEach(link => link.addEventListener('click', event => {
  trackEvent('outbound_click', { link_name: event.currentTarget.dataset.track || event.currentTarget.id, link_url: event.currentTarget.href });
}));

document.querySelectorAll('.faq-list details').forEach(item => item.addEventListener('toggle', () => {
  if (item.open) trackEvent('faq_open', { question: item.querySelector('summary')?.textContent.trim().replace('+', '').trim() });
}));
