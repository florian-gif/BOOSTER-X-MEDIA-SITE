# Activation du suivi Booster X

Le code de traçabilité est actif sur la version de test. Il utilise une base Postgres Supabase via son API serveur et ne transmet jamais la clé Supabase au navigateur public.

État au 18 août 2026 : tables créées, droits `service_role` limités aux tables de suivi, variables Vercel configurées et parcours complet vérifié avec un paiement PayPal Sandbox de 3,90 €.

La commande payée apparaît avec le statut `paid`, l'environnement `Test Sandbox`, 500 likes et son relevé horodaté. Aucun argent réel n'a été débité.

## Reproduire la configuration

Dans l'éditeur SQL Supabase, exécuter `database/001_order_tracking.sql`.

### Variables serveur

Ajouter dans le projet Vercel :

- `SUPABASE_URL` : adresse du projet Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` : clé serveur Supabase, jamais une clé publique.
- `BX_ADMIN_TOKEN` : mot de passe long et aléatoire réservé au tableau de suivi.

Les variables PayPal et Resend déjà utilisées restent inchangées.

Pour les tests, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` et `PAYPAL_ENVIRONMENT=sandbox` sont limités à Preview. Les clés PayPal réelles sont limitées à Production afin qu'une version de test ne puisse jamais créer un paiement réel.

## Utiliser le tableau

Après déploiement, ouvrir `/suivi-commandes.html` et saisir `BX_ADMIN_TOKEN`.

Version de test actuelle : `https://booster-x-media-site-git-agent-su-5fe3f1-flos-projects-7316169c.vercel.app/suivi-commandes.html`.

Pour chaque commande :

1. Contrôler le profil public.
2. Enregistrer le compteur « Avant livraison ».
3. Effectuer la livraison.
4. Enregistrer le compteur « Après livraison ».
5. En cas de SAV, enregistrer « Demande SAV », puis « Après remplacement ».

Le seuil garanti est calculé côté serveur : compteur avant livraison + quantité d'abonnés commandée. La garantie est ouverte pour 60 jours lors du relevé après livraison.

## Limite Instagram

Le compte client ne saisit jamais lui-même son compteur. La version actuelle utilise un relevé contrôlé par Booster X, car l'API officielle Instagram ne couvre pas tous les comptes personnels publics. Une récupération officielle peut ensuite être ajoutée pour les comptes professionnels et créateurs compatibles.
