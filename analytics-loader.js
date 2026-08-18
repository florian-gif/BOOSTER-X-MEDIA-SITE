window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', 'G-YE1X6FCZ5F');

const googleTag = document.createElement('script');
googleTag.async = true;
googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=G-YE1X6FCZ5F';
document.head.appendChild(googleTag);

!function (w, d, t) {
  w.TiktokAnalyticsObject = t;
  const q = w[t] = w[t] || [];
  q.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
  q.setAndDefer = function (target, method) { target[method] = function () { target.push([method].concat([].slice.call(arguments))); }; };
  for (let i = 0; i < q.methods.length; i += 1) q.setAndDefer(q, q.methods[i]);
  q.load = function (pixelId) {
    const script = d.createElement('script');
    const firstScript = d.getElementsByTagName('script')[0];
    q._i = q._i || {};
    q._i[pixelId] = [];
    q._i[pixelId]._u = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    q._t = q._t || {};
    q._t[pixelId] = +new Date();
    q._o = q._o || {};
    script.async = true;
    script.src = `${q._i[pixelId]._u}?sdkid=${pixelId}&lib=${t}`;
    firstScript.parentNode.insertBefore(script, firstScript);
  };
}(window, document, 'ttq');

ttq.holdConsent();
ttq.load('D2NH2U3C77U5B8SR4A30');
ttq.page();
