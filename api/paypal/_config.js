const PACKS = {
  'Instagram Followers 1K': '19.90', 'Instagram Followers 5K': '89.90', 'Instagram Followers 10K': '169.90',
  'Instagram Likes 500': '3.90', 'Instagram Likes 1K': '5.90', 'Instagram Likes 5K': '16.90', 'Instagram Likes 10K': '26.90',
  'TikTok Followers 1K': '19.90', 'TikTok Followers 5K': '89.90', 'TikTok Followers 10K': '169.90',
  'Pack Starter (1K abonnés + 1K likes)': '22.90', 'Pack Boost (5K abonnés + 5K likes)': '99.90', 'Pack Premium (10K abonnés + 10K likes)': '179.90'
};
const PACK_DETAILS = {
  'Instagram Followers 1K': { followers: 1000, likes: 0 },
  'Instagram Followers 5K': { followers: 5000, likes: 0 },
  'Instagram Followers 10K': { followers: 10000, likes: 0 },
  'Instagram Likes 500': { followers: 0, likes: 500 },
  'Instagram Likes 1K': { followers: 0, likes: 1000 },
  'Instagram Likes 5K': { followers: 0, likes: 5000 },
  'Instagram Likes 10K': { followers: 0, likes: 10000 },
  'TikTok Followers 1K': { followers: 1000, likes: 0 },
  'TikTok Followers 5K': { followers: 5000, likes: 0 },
  'TikTok Followers 10K': { followers: 10000, likes: 0 },
  'Pack Starter (1K abonnés + 1K likes)': { followers: 1000, likes: 1000 },
  'Pack Boost (5K abonnés + 5K likes)': { followers: 5000, likes: 5000 },
  'Pack Premium (10K abonnés + 10K likes)': { followers: 10000, likes: 10000 }
};
const PAYPAL_API = 'https://api-m.paypal.com';
async function accessToken() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) throw new Error('PayPal credentials missing');
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
  if (!response.ok) throw new Error('PayPal authentication failed');
  return (await response.json()).access_token;
}
module.exports = { PACKS, PACK_DETAILS, PAYPAL_API, accessToken };
