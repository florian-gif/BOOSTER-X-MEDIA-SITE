const PACKS = {
  'Instagram Followers 1K': '19.90', 'Instagram Followers 5K': '89.90', 'Instagram Followers 10K': '169.90',
  'Instagram Likes 500': '3.90', 'Instagram Likes 1K': '5.90', 'Instagram Likes 5K': '16.90', 'Instagram Likes 10K': '26.90',
  'TikTok Followers 1K': '19.90', 'TikTok Followers 5K': '89.90', 'TikTok Followers 10K': '169.90',
  'Pack Starter (1K abonnés + 1K likes)': '22.90', 'Pack Boost (5K abonnés + 5K likes)': '99.90', 'Pack Premium (10K abonnés + 10K likes)': '179.90'
};
const PAYPAL_API = 'https://api-m.paypal.com';
async function accessToken() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) throw new Error('PayPal credentials missing');
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
  if (!response.ok) throw new Error('PayPal authentication failed');
  return (await response.json()).access_token;
}
module.exports = { PACKS, PAYPAL_API, accessToken };
