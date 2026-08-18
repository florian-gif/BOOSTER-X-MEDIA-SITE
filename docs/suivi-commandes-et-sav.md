# Activation du suivi Booster X

Le code de traçabilité est prêt. Il utilise une base Postgres Supabase via son API serveur et ne transmet jamais la clé d'administration au navigateur public.

## 1. Créer les tables

Dans l'éditeur SQL Supabase, exécuter `database/001_order_tracking.sql`.

## 2. Configurer les variables serveur

Ajouter dans le projet Vercel :

- `SUPABASE_URL` : adresse du projet Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` : clé serveur Supabase, jamais une clé publique.
- `BX_ADMIN_TOKEN` : mot de passe long et aléatoire réservé au tableau de suivi.

Les variables PayPal et Resend déjà utilisées restent inchangées.

## 3. Utiliser le tableau

Après déploiement, ouvrir `/suivi-commandes.html` et saisir `BX_ADMIN_TOKEN`.

Pour chaque commande :

1. Contrôler le profil public.
2. Enregistrer le compteur « Avant livraison ».
3. Effectuer la livraison.
4. Enregistrer le compteur « Après livraison ».
5. En cas de SAV, enregistrer « Demande SAV », puis « Après remplacement ».

Le seuil garanti est calculé côté serveur : compteur avant livraison + quantité d'abonnés commandée. La garantie est ouverte pour 60 jours lors du relevé après livraison.

## Limite Instagram

Le compte client ne saisit jamais lui-même son compteur. La version actuelle utilise un relevé contrôlé par Booster X, car l'API officielle Instagram ne couvre pas tous les comptes personnels publics. Une récupération officielle peut ensuite être ajoutée pour les comptes professionnels et créateurs compatibles.
