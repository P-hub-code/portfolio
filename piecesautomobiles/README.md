# Garage Parts SaaS

L'application **Garage Parts SaaS** développée avec **Laravel**, **React** et **Vite** permet de gérer les véhicules d’un garage, leurs pièces et leurs emplacements physiques dans l’entrepôt (ex. : boîtes, étagères, armoires).

## Fonctionnalités

-   [x] Authentification utilisateur : Les utilisateurs peuvent se connecter à l'application.
-   [x] Gestion de l'entrepôt :
-   [x] Ajouter des boîtes : Les utilisateurs peuvent ajouter de nouvelles boîtes de stockage dans l'entrepôt.
-   [x] Ajouter des pièces : Les utilisateurs peuvent ajouter des pièces dans l'entrepôt et les associer à des boîtes spécifiques.
-   [ ] Ajouter des étagères : Les utilisateurs peuvent ajouter des étagères dans l'entrepôt.
-   [ ] Ajouter des armoires : Les utilisateurs peuvent ajouter des armoires dans l'entrepôt.
-   [ ] Gestion des véhicules : Permet aux utilisateurs de gérer les véhicules et leurs détails ; un véhicule peut avoir plusieurs pièces.
-   [x] Suivi des emplacements physiques : Les utilisateurs peuvent suivre l’emplacement physique des pièces dans les boîtes, étagères et armoires.
-   [x] Recherche avancée : Les utilisateurs peuvent rechercher des pièces et des véhicules selon différents critères.
-   [ ] Rapports : Générer des rapports sur l'inventaire et l'état des véhicules et des pièces.
-   [ ] Rôles et permissions : Implémenter des rôles et permissions pour les utilisateurs avec différents niveaux d'accès.
-   [ ] Notifications : Les utilisateurs reçoivent des notifications sur les changements et mises à jour dans l'entrepôt.

## Installation et lancement

Pour exécuter l'application localement, suivez ces étapes :

1. Cloner le dépôt.
2. Aller dans le dossier `vite-react-garagem-saas`.
3. Installer les dépendances avec `npm install`.
4. Démarrer le serveur de développement avec `npm run dev`.
5. Générer la version de production avec `npm run build`.

## Backend avec Laravel

Le backend de l'application est développé avec **Laravel**. Pour déployer ou lancer le serveur Laravel, suivez ces étapes :

1. Cloner le dépôt du projet.
2. Aller dans le dossier du projet Laravel.
3. Installer les dépendances avec `composer install`.
4. Créer un fichier `.env` et copier le contenu de `.env.example` dedans.
5. Générer la clé de l’application avec :  
```bash
php artisan key:generate --ansi
