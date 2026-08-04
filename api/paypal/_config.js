const PACKS = {
  'Instagram Followers 1K': '15.00', 'Instagram Followers 5K': '65.00', 'Instagram Followers 10K': '120.00',
  'Instagram Likes 500': '2.50', 'Instagram Likes 1K': '4.50', 'Instagram Likes 5K': '15.00', 'Instagram Likes 10K': '25.00',
  'TikTok Followers 1K': '15.00', 'TikTok Followers 5K': '65.00', 'TikTok Followers 10K': '120.00',
  'Pack Starter (1K abonnés + 1K likes)': '18.00', 'Pack Boost (5K abonnés + 5K likes)': '75.00', 'Pack Premium (10K abonnés + 10K likes)': '135.00'
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
