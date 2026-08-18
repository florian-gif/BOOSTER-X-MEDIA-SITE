const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const pages = {
  'index.html': 'Packs d’abonnés Instagram et TikTok',
  'instagram-abonnes.html': 'Acheter des abonnés Instagram',
  'instagram-likes.html': 'Acheter des likes Instagram',
  'tiktok-abonnes.html': 'Acheter des abonnés TikTok',
  'guide-visibilite-instagram.html': 'Comment augmenter sa visibilité Instagram'
};

test('indexable pages have focused and complete SEO metadata', () => {
  for (const [file, expectedTitle] of Object.entries(pages)) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
    assert.match(title, new RegExp(expectedTitle));
    assert.ok(title.length <= 60, `${file} title is too long`);
    assert.ok(description.length >= 100 && description.length <= 160, `${file} description length is ${description.length}`);
    assert.match(html, /<meta name="robots" content="index,follow/);
    assert.match(html, /<link rel="canonical" href="https:\/\/www\.boosterxmedia\.com\//);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${file} must have one H1`);
  }
});

test('commercial pages link to the rest of the SEO cluster', () => {
  const expectedLinks = ['instagram-abonnes.html', 'instagram-likes.html', 'tiktok-abonnes.html', 'guide-visibilite-instagram.html'];
  for (const file of expectedLinks) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    for (const link of expectedLinks.filter(candidate => candidate !== file)) {
      assert.match(html, new RegExp(`href="${link}"`), `${file} must link to ${link}`);
    }
  }
});

test('sitemap advertises the updated canonical French pages', () => {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  for (const file of Object.keys(pages)) {
    const url = file === 'index.html' ? 'https://www.boosterxmedia.com/' : `https://www.boosterxmedia.com/${file}`;
    assert.match(sitemap, new RegExp(`<loc>${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/loc><lastmod>2026-08-18<\\/lastmod>`));
  }
});

test('English mode translates the updated homepage heading', () => {
  const language = fs.readFileSync(path.join(root, 'language.js'), 'utf8');
  assert.match(language, /'Des abonnés Instagram et TikTok pour': 'Instagram and TikTok followers to'/);
  assert.match(language, /'renforcer votre profil\.': 'strengthen your profile\.'/);
});
