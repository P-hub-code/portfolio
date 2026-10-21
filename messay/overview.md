# Messay – Application Mobile de Mobilité & Paiement

## Contexte
Application mobile cross-platform (iOS / Android) destinée à la commande de courses urbaines (mobilité) et à la gestion d'un portefeuille électronique (wallet) pour des transactions financières dématérialisées.

---

## Fonctionnalités principales
- Authentification sécurisée par téléphone via Firebase Phone Auth (OTP SMS)
- Gestion du profil utilisateur et persistance de la session
- Module Mobilité : recherche d'adresses, sélection de points de départ/destination, calcul d'itinéraires et estimation du tarif, commande de trajet en temps réel
- Module Wallet : consultation du solde, rechargement du portefeuille, transfert d'argent de pair à pair (P2P), historique détaillé des transactions
- Interface utilisateur fluide, moderne et réactive avec gestion globale d'état via Redux Toolkit

---

## Architecture technique
- Frontend : React Native (TypeScript)
- Gestion d'état : Redux Toolkit
- Navigation : React Navigation (Bottom Tabs, Native Stack)
- Services tiers : Firebase Auth & Analytics, Google Places / Geocoding (via API Backend)
