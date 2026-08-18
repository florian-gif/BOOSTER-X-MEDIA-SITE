const CONSENT_KEY = 'boosterx_analytics_consent';

function tiktokEvent(name, params) {
  const eventNames = {
    select_item: 'ViewContent',
    begin_checkout: 'InitiateCheckout',
    purchase: 'Purchase'
  };
  const eventName = eventNames[name];
  if (!eventName) return;

  const item = params.items?.[0] || {};
  const price = Number(item.price ?? params.value);
  const properties = {
    content_id: item.item_id || item.item_name,
    content_name: item.item_name,
    content_type: 'product',
    quantity: Number(item.quantity) || 1,
    currency: params.currency || 'EUR',
    value: Number(params.value) || price || 0
  };
  if (Number.isFinite(price)) properties.price = price;

  ttq.track(eventName, properties);
}

window.trackEvent = function trackEvent(name, params = {}) {
  try { if (window.gtag) gtag('event', name, params); } catch (_) {}
  try { if (window.ttq) tiktokEvent(name, params); } catch (_) {}
};

function applyAnalyticsConsent(choice) {
  const granted = choice === 'granted';
  try { if (window.gtag) gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }); } catch (_) {}
  try { if (window.ttq) granted ? ttq.grantConsent() : ttq.revokeConsent(); } catch (_) {}
}

const consentBanner = document.querySelector('#cookieBanner');
const savedConsent = localStorage.getItem(CONSENT_KEY);
if (savedConsent) applyAnalyticsConsent(savedConsent);
else if (consentBanner) consentBanner.hidden = false;

document.querySelector('#cookieAccept')?.addEventListener('click', () => {
  localStorage.setItem(CONSENT_KEY, 'granted');
  applyAnalyticsConsent('granted');
  consentBanner.hidden = true;
  trackEvent('consent_update', { consent_choice: 'granted' });
});
document.querySelector('#cookieReject')?.addEventListener('click', () => {
  localStorage.setItem(CONSENT_KEY, 'denied');
  applyAnalyticsConsent('denied');
  consentBanner.hidden = true;
});
document.querySelector('#cookieSettings')?.addEventListener('click', () => { consentBanner.hidden = false; });

document.querySelectorAll('#ig-link,#tt-link,#wa-link,[data-track]').forEach(link => link.addEventListener('click', event => {
  trackEvent('outbound_click', { link_name: event.currentTarget.dataset.track || event.currentTarget.id, link_url: event.currentTarget.href });
}));

document.querySelectorAll('.faq-list details').forEach(item => item.addEventListener('toggle', () => {
  if (item.open) trackEvent('faq_open', { question: item.querySelector('summary')?.textContent.trim().replace('+', '').trim() });
}));
