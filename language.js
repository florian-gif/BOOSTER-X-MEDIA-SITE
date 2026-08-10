(() => {
  const params = new URLSearchParams(location.search);
  const requested = params.get('lang');
  let saved = 'fr';
  try { saved = localStorage.getItem('boosterx_language') || 'fr'; } catch (_) {}
  const lang = requested === 'en' ? 'en' : requested === 'fr' ? 'fr' : saved === 'en' ? 'en' : 'fr';
  try { localStorage.setItem('boosterx_language', lang); } catch (_) {}

  const translations = {
    'Aller au contenu': 'Skip to content',
    'Pourquoi nous': 'Why us',
    'Nos packs': 'Our packages',
    'Nos services': 'Our services',
    'Voir les offres': 'View offers',
    'Instagram & TikTok, simplement': 'Instagram & TikTok, made simple',
    'Votre visibilité mérite un vrai': 'Your visibility deserves a real',
    'coup d’accélérateur.': 'boost.',
    'Développez votre présence avec des abonnés et des likes livrés rapidement. Des packs clairs, un paiement sécurisé et un accompagnement humain.': 'Grow your presence with followers and likes delivered quickly. Clear packages, secure payment and personal support.',
    'Découvrir les packs': 'Explore packages',
    'Parler à un conseiller': 'Chat with an advisor',
    'Une équipe disponible avant et après votre commande': 'A team available before and after your order',
    'Support 7j/7': 'Support 7 days a week',
    'Simulation de profil': 'Profile simulation',
    'Objectif': 'Goal',
    'Visibilité': 'Visibility',
    'Signal social': 'Social signal',
    'Profil renforcé': 'Stronger profile',
    'Progression': 'Progress',
    'Selon votre contenu': 'Depending on your content',
    'Économisez 2,90 €': 'Save €2.90',
    'Économisez 6,90 €': 'Save €6.90',
    'Économisez 16,90 €': 'Save €16.90',
    'Économisez 9,60 €': 'Save €9.60',
    'Économisez 29,10 €': 'Save €29.10',
    'Profil': 'Profile',
    'Créateur digital': 'Digital creator',
    'K abonnés': 'K followers',
    'satisfaction': 'satisfaction',
    'Croissance': 'Growth',
    'Nouveaux likes': 'New likes',
    'Progression continue': 'Steady progress',
    'Livraison rapide': 'Fast delivery',
    'Paiement sécurisé': 'Secure payment',
    'Support réactif': 'Responsive support',
    'Sans mot de passe': 'No password required',
    'L’expérience BoosterX': 'The BoosterX experience',
    'Tout ce qu’il faut pour avancer': 'Everything you need to move forward',
    'en confiance.': 'with confidence.',
    'Un service pensé pour être simple du premier clic jusqu’à la livraison.': 'A service designed to be simple from your first click to delivery.',
    'Livraison maîtrisée': 'Reliable delivery',
    'Votre commande est prise en charge rapidement et livrée progressivement.': 'Your order is handled quickly and delivered progressively.',
    '24 à 48 heures en moyenne': '24 to 48 hours on average',
    'Aucune donnée sensible': 'No sensitive information',
    'Nous ne demandons jamais votre mot de passe. Votre compte reste entre vos mains.': 'We never ask for your password. You remain in full control of your account.',
    'Votre confidentialité d’abord': 'Your privacy comes first',
    'Support humain': 'Personal support',
    'Une question avant ou après la commande ? Notre équipe vous répond sur WhatsApp.': 'A question before or after ordering? Our team is available on WhatsApp.',
    'Disponible 7 jours sur 7': 'Available 7 days a week',
    'Des offres transparentes': 'Straightforward offers',
    'Choisissez le boost qui vous': 'Choose the boost that',
    'correspond.': 'fits your goals.',
    'Aucun abonnement ni frais cachés. Vous payez une seule fois.': 'No subscription or hidden fees. Pay once, with no recurring charge.',
    'Packs à la carte': 'Individual packages',
    'Packs combinés': 'Bundle packages',
    'Économisez': 'Save',
    'Abonnés': 'Followers',
    'Renforcez la crédibilité de votre profil.': 'Build trust and credibility for your profile.',
    'abonnés': 'followers',
    'Populaire': 'Popular',
    'Livraison 24–48h': 'Delivery in 24–48h',
    'Le plus demandé': 'Most popular',
    'Donnez plus d’impact à vos publications.': 'Give your posts more impact.',
    'Suivi inclus': 'Support included',
    'Faites grandir votre communauté TikTok et rapprochez-vous des critères de monétisation.': 'Grow your TikTok community and move closer to monetization eligibility.',
    'Meilleur choix': 'Best value',
    'likes': 'likes',
    'Choisir Starter': 'Choose Starter',
    'Choisir Boost': 'Choose Boost',
    'Choisir Premium': 'Choose Premium',
    'Paiement sécurisé via': 'Secure payment with',
    'Aucun abonnement': 'No subscription',
    'Support après commande': 'Post-purchase support',
    'Comment ça marche ?': 'How does it work?',
    'Commandez en': 'Order in',
    '3 étapes.': '3 steps.',
    'Choisissez votre pack': 'Choose your package',
    'Sélectionnez l’offre adaptée à votre objectif.': 'Select the offer that matches your goal.',
    'Indiquez votre profil': 'Enter your profile',
    'PayPal associe directement votre pseudo ou votre lien au paiement.': 'Your username or post link is securely linked to your PayPal payment.',
    'Suivez la livraison': 'Track your delivery',
    'Votre commande est prise en charge avec les informations transmises.': 'Your order is processed using the information you provide.',
    'Besoin d’être rassuré ?': 'Need more information?',
    'Les réponses à vos': 'Answers to your',
    'questions.': 'questions.',
    'Vous ne trouvez pas la réponse ? Écrivez-nous directement.': 'Can’t find your answer? Message us directly.',
    'Contacter le support →': 'Contact support →',
    'Dois-je donner mon mot de passe ?': 'Do I need to share my password?',
    'Non, jamais. Nous avons uniquement besoin de votre pseudo public et, pour les likes, du lien de la publication concernée.': 'Never. We only need your public username and, for likes, the link to the relevant post.',
    'Quel est le délai de livraison ?': 'How long does delivery take?',
    'Les abonnés garantissent-ils la monétisation TikTok ?': 'Do followers guarantee TikTok monetization?',
    'Non. Ils peuvent vous rapprocher d’un seuil d’abonnés, mais TikTok applique aussi d’autres critères d’éligibilité et vérifie le respect de ses règles. La création de contenu et les vues restent indispensables.': 'No. They may bring you closer to a follower threshold, but TikTok also applies other eligibility criteria and checks compliance with its rules. Content creation and views remain essential.',
    'La plupart des commandes sont traitées sous 24 à 48 heures. Le délai peut varier légèrement selon la taille du pack.': 'Most orders are processed within 24 to 48 hours. Timing may vary slightly depending on package size.',
    'Comment se passe le paiement ?': 'How does payment work?',
    'Vous êtes redirigé vers PayPal pour effectuer un paiement sécurisé. Aucun abonnement n’est créé.': 'You are redirected to PayPal for secure payment. No subscription is created.',
    'Que faire après le paiement ?': 'What happens after payment?',
    'Rien de plus : votre profil ou votre lien de publication est enregistré avec le paiement. Notre équipe peut prendre en charge la commande directement.': 'Nothing else: your profile or post link is saved with the payment so our team can process your order directly.',
    'Puis-je vous contacter avant de commander ?': 'Can I contact you before ordering?',
    'Bien sûr. Notre équipe est disponible sur WhatsApp pour vous aider à choisir le pack le plus adapté.': 'Of course. Our team is available on WhatsApp to help you choose the right package.',
    'Conseils et services': 'Guides and services',
    'Développez votre présence': 'Grow your presence',
    'réseau par réseau.': 'on every platform.',
    'Découvrez nos solutions et nos conseils pour choisir le boost adapté à votre objectif.': 'Explore our services and guidance to choose the right boost for your goals.',
    'Abonnés Instagram': 'Instagram Followers',
    'Renforcez la visibilité et la crédibilité de votre profil.': 'Increase your profile’s visibility and credibility.',
    'Découvrir →': 'Discover →',
    'Likes Instagram': 'Instagram Likes',
    'Donnez davantage d’impact à vos publications et Reels.': 'Give your posts and Reels greater impact.',
    'Abonnés TikTok': 'TikTok Followers',
    'Développez la présence de votre compte TikTok.': 'Grow your TikTok account’s presence.',
    'Guide': 'Guide',
    'Visibilité Instagram': 'Instagram Visibility',
    'Les bonnes pratiques pour construire une présence cohérente.': 'Best practices for building a consistent presence.',
    'Lire le guide →': 'Read the guide →',
    'Prêt à passer au niveau supérieur ?': 'Ready for the next level?',
    'Donnez à votre profil la visibilité qu’il mérite.': 'Give your profile the visibility it deserves.',
    'Choisissez votre pack et lancez votre croissance en quelques minutes.': 'Choose your package and start growing in minutes.',
    'Votre partenaire visibilité sur Instagram & TikTok.': 'Your growth partner for Instagram & TikTok.',
    '© 2026 BoosterX Media. Tous droits réservés.': '© 2026 BoosterX Media. All rights reserved.',
    'Gérer les cookies': 'Cookie settings',
    'Finaliser la commande': 'Complete your order',
    'Confirmez votre pack': 'Confirm your package',
    'Votre pack': 'Your package',
    'Pseudo du profil': 'Profile username',
    'Lien de la publication': 'Post link',
    'Adresse e-mail': 'Email address',
    'Ces informations seront associées automatiquement au paiement.': 'This information will be securely linked to your payment.',
    '🔒 Aucun mot de passe ne vous sera demandé.': '🔒 We will never ask for your password.',
    'Continuer vers PayPal': 'Continue to PayPal',
    'Vous serez redirigé vers PayPal pour valider le paiement sécurisé.': 'You will be redirected to PayPal to complete your secure payment.',
    'Pack confirmé': 'Package confirmed',
    'Redirection vers le paiement sécurisé…': 'Redirecting to secure payment…',
    'Votre confidentialité': 'Your privacy',
    'Nous utilisons des outils de mesure pour comprendre les visites et améliorer nos offres. Vous pouvez accepter ou refuser ces mesures.': 'We use analytics to understand visits and improve our services. You can accept or decline these measurements.',
    'Refuser': 'Decline',
    'Accepter': 'Accept',
    'Préparation du paiement…': 'Preparing payment…',
    'Le paiement est momentanément indisponible. Contactez-nous sur WhatsApp.': 'Payment is temporarily unavailable. Please contact us on WhatsApp.'
  };

  const packNames = {
    'Instagram Followers 1K': 'Instagram Followers 1K', 'Instagram Followers 5K': 'Instagram Followers 5K', 'Instagram Followers 10K': 'Instagram Followers 10K',
    'Instagram Likes 500': 'Instagram Likes 500', 'Instagram Likes 1K': 'Instagram Likes 1K', 'Instagram Likes 5K': 'Instagram Likes 5K', 'Instagram Likes 10K': 'Instagram Likes 10K',
    'TikTok Followers 1K': 'TikTok Followers 1K', 'TikTok Followers 5K': 'TikTok Followers 5K', 'TikTok Followers 10K': 'TikTok Followers 10K',
    'Pack Starter (1K abonnés + 1K likes)': 'Starter Package (1K followers + 1K likes)',
    'Pack Boost (5K abonnés + 5K likes)': 'Boost Package (5K followers + 5K likes)',
    'Pack Premium (10K abonnés + 10K likes)': 'Premium Package (10K followers + 10K likes)'
  };

  const t = value => lang === 'en' ? (translations[value] || value) : value;
  window.BX_I18N = { lang, t, packName: value => lang === 'en' ? (packNames[value] || value) : value };
  if (lang !== 'en') return;

  document.documentElement.lang = 'en';
  document.title = 'Instagram & TikTok Growth — BoosterX Media';
  document.querySelector('meta[name="description"]')?.setAttribute('content', 'Grow your visibility on Instagram and TikTok with follower and like packages, fast delivery, secure payment and personal support.');
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'BoosterX Media — Accelerate your visibility');
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'Instagram & TikTok: clear packages, fast delivery and personal support.');
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', 'https://www.boosterxmedia.com/?lang=en');

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const entries = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
  nodes.forEach(node => {
    let value = node.nodeValue;
    entries.forEach(([source, target]) => { value = value.split(source).join(target); });
    node.nodeValue = value;
  });

  document.querySelector('#handle')?.setAttribute('placeholder', '@yourprofile');
  document.querySelector('#customerEmail')?.setAttribute('placeholder', 'you@example.com');
  document.querySelectorAll('.choice-list strong,.combo-price').forEach(price => { price.textContent = price.textContent.replace(',', '.'); });
  document.querySelector('#languageSwitch').textContent = 'FR';
  document.querySelector('#languageSwitch').href = location.pathname || '/';
  document.querySelector('#languageSwitch').setAttribute('aria-label', 'Voir le site en français');
  document.querySelector('#languageSwitch').addEventListener('click', () => { try { localStorage.setItem('boosterx_language', 'fr'); } catch (_) {} });
  document.querySelector('nav')?.setAttribute('aria-label', 'Main navigation');
  document.querySelector('.tabs')?.setAttribute('aria-label', 'Package types');
  document.querySelector('.hero-visual')?.setAttribute('aria-label', 'Preview of social media growth');
  document.querySelector('.stars')?.setAttribute('aria-label', 'Support available 7 days a week');
  document.querySelector('.trust-strip')?.setAttribute('aria-label', 'Our commitments');
  document.querySelector('#cookieBanner')?.setAttribute('aria-label', 'Privacy preferences');
})();
