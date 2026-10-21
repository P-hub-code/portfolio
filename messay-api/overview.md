# Messay API – Backend RESTful Mobilité & Portefeuille Électronique

## Contexte
API REST sécurisée servant de moteur backend à l'écosystème mobile Messay. Elle orchestre la logique métier des trajets urbains, le calcul de distances/tarifs, l'authentification et les transactions financières du portefeuille digital.

---

## Fonctionnalités principales
- Authentification & Sécurité : Authentification via Laravel Sanctum (Bearer Token) avec synchronisation des identités
- Gestion du Wallet : Consultation du solde, recharges, transferts monétaires P2P et historique immuable des transactions
- Module Trajets (Mobilité) : Création, acceptation par les chauffeurs, suivi du cycle de vie des courses (actif, démarré, terminé, annulé)
- Intégration Google Maps Platform : Autocomplétion d'adresses, géocodage direct et inverse, calcul de matrices de distances et temps de trajet

---

## Architecture technique
- Framework : Laravel 12 (PHP 8.2+)
- Authentification : Laravel Sanctum
- Base de données : MySQL
- Intégrations externes : Google Maps Platform, Firebase Phone Auth
