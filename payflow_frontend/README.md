# 💳 Payflow Frontend — Next.js Enterprise Payment Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-Proprietary-black)](LICENSE)

Interface web moderne, ultra-réactive et haute fidélité pour la gestion, l'initiation et le monitoring en temps réel des transactions de la plateforme **Payflow**. Conçue avec **Next.js 16** (App Router), **React 19**, et le moteur de styles **Tailwind CSS v4** intégrant un design system sur-mesure aux normes Material Design 3.

---

## 📑 Table des Matières
- [Présentation des Écrans & Fonctionnalités](#-présentation-des-écrans--fonctionnalités)
- [Design System & Tokens](#-design-system--tokens)
- [Architecture & Arborescence](#-architecture--arborescence)
- [Résilience & Gestion des Pannes](#-résilience--gestion-des-pannes)
- [Variables d'Environnement](#-variables-denvironnement)
- [Installation & Démarrage Local](#-installation--démarrage-local)
- [Documentation Complémentaire](#-documentation-complémentaire)

---

## 🖥️ Présentation des Écrans & Fonctionnalités

### 1. 📊 Tableau de Bord Financier (`/`)
- **Indicateurs Clés de Performance (KPI)** : Calcul dynamique et agrégation en temps réel du volume total traité (FCFA), du taux de succès, et du nombre de transactions réussies vs échouées.
- **Activité Récente** : Flux interactif des derniers flux financiers avec statut visuel réactif (`SUCCESS`, `FAILED`, `PENDING`).
- **Gestion des Pannes Réseau** : Détection granulaire entre indisponibilité du backend (serveur éteint) et erreurs HTTP applicatives avec guidage utilisateur.

### 2. 💸 Terminal d'Initiation de Paiement (`/payments/new`)
- Formulaire épuré avec validation en temps réel :
  - Nom complet du client assaini contre les failles d'injection (XSS, balises HTML).
  - Validation stricte des adresses email RFC 5322.
  - Saisie du numéro de téléphone et de la description.
  - Montant en FCFA naturel (le calcul en sous-unités monétaires est géré de manière transparente par le backend).
- Choix du mode de règlement : Carte bancaire ou Mobile Money (Orange Money, MTN, Moov, Wave).
- Redirection sécurisée vers la page de paiement hébergée Paystack.

### 3. 🔄 Suivi Réactif de Statut (`/payments/status/[reference]`)
- Page d'atterrissage après le paiement Paystack (`callback_url`).
- **Moteur de Polling Intelligent** : Interroge l'API à intervalle régulier (5s, jusqu'à 24 tentatives) jusqu'à ce que le webhook Paystack confirme l'encaissement.
- Affichage d'un reçu transactionnel avec référence interne, référence Paystack, montant et horodatage.

### 4. 📑 Grand Livre des Transactions (`/transactions` & `/transactions/[id]`)
- Table des transactions avec recherche plein texte multi-critères (par référence, client, montant, canal, statut).
- Vue détaillée d'une transaction avec décomposition de la commande (`Order`) associée.

### 5. 📡 Journal d'Audit des Webhooks (`/webhooks`)
- Console de monitoring dédiée aux administrateurs pour visualiser les événements bruts reçus de l'agrégateur.
- Suivi du statut de traitement (`RECEIVED`, `PROCESSED`, `FAILED`) et vérification de l'idempotence.

---

## 🎨 Design System & Tokens

Le frontend implémente la spécification **Tailwind CSS v4** via la directive `@theme` dans [`globals.css`](file:///c:/Users/Administrator/portfolio/payflow_frontend/src/app/globals.css) :

| Rôle Sémantique | Token CSS | Valeur Hex | Aperçu d'Usage |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `--color-primary` | `#5427e6` | Boutons d'action, accents, bordures actives |
| **Primary Container**| `--color-primary-container` | `#6d4aff` | Cartes d'indicateurs principales |
| **Success (Confirmé)**| `--color-secondary` | `#006e2f` | Badges de succès, graphiques positifs |
| **Warning (En cours)**| `--color-tertiary` | `#794b00` | Badges de transactions en attente |
| **Error (Échec)** | `--color-error` | `#ba1a1a` | Alertes de paiement échoué, rejets |
| **Surface Principale**| `--color-surface` | `#f4f5fb` | Fond d'écran global haute luminosité |

Effets graphiques avancés :
- **Glassmorphism** (`backdrop-blur-md` avec opacité fine).
- Micro-transitions CSS fluides sur l'ensemble des éléments interactifs.

---

## 📁 Architecture & Arborescence

```
payflow_frontend/
├── src/
│   ├── app/                    # Next.js App Router (pages & layouts)
│   │   ├── layout.tsx          # Shell racine, polices Geist / Inter, balises méta SEO
│   │   ├── page.tsx            # Tableau de bord principal (KPIs & Activité)
│   │   ├── globals.css         # Thème Tailwind v4 et design tokens
│   │   ├── payments/
│   │   │   ├── new/page.tsx    # Formulaire d'initialisation de paiement
│   │   │   └── status/[reference]/page.tsx # Poller réactif de statut post-paiement
│   │   ├── transactions/
│   │   │   ├── page.tsx        # Grand livre et recherche de transactions
│   │   │   └── [id]/page.tsx   # Vue détaillée d'une transaction
│   │   └── webhooks/
│   │       └── page.tsx        # Console de surveillance des webhooks
│   ├── components/             # Composants d'interface modulaires
│   │   ├── AppLayout.tsx       # Disposition adaptative avec Sidebar
│   │   ├── Header.tsx          # Barre de navigation supérieure et recherche
│   │   ├── Sidebar.tsx         # Menu latéral rétractable et navigation active
│   │   ├── StatCard.tsx        # Carte métrique avec indicateur d'évolution
│   │   ├── RecentActivity.tsx  # Liste chronologique des paiements récents
│   │   └── StatusBadge.tsx     # Badge sémantique normalisé (Success/Pending/Failed)
│   ├── lib/
│   │   └── api.ts              # Client HTTP fetch typé avec gestion d'erreurs
│   └── types/
│       └── index.ts            # Interfaces TypeScript partagées (Transaction, Webhook)
```

---

## 🛡️ Résilience & Gestion des Pannes

L'application a été conçue pour offrir une expérience utilisateur irréprochable même lors d'incidents d'infrastructure :
1. **Détection d'état hors-ligne** : Si le backend est indisponible ou non démarré, le tableau de bord affiche un écran d'alerte explicatif avec invitation à réactualiser, plutôt qu'une page blanche ou une erreur non gérée.
2. **Isolation Client Component** : Les composants transactionnels sont annotés `"use client"` et `force-dynamic` pour garantir la fraîcheur absolue des données financières sans mise en cache agressive.
3. **Protection contre les fuites de secrets** : Seule la variable publique `NEXT_PUBLIC_API_URL` est accessible au navigateur. Aucun secret Paystack n'est importé côté client.

---

## ⚙️ Variables d'Environnement

Créez un fichier `.env.local` à la racine de `payflow_frontend` :

```env
# URL de l'API Backend NestJS
NEXT_PUBLIC_API_URL=http://localhost:3001
```

En production (sur Vercel), configurez la variable pour pointer vers l'URL publique de votre backend (ex: `https://api.votredomaine.com`).

---

## 🚀 Installation & Démarrage Local

### 1. Prérequis
- **Node.js** >= 20.x
- **Backend Payflow** démarré (sur le port 3001 par défaut)

### 2. Cloner et installer les dépendances
```bash
cd payflow_frontend
npm install
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

### 4. Build de production
```bash
npm run build
npm run start
```

---

## 📚 Documentation Complémentaire
- [Guide d'Architecture Frontend](file:///c:/Users/Administrator/portfolio/payflow_frontend/ARCHITECTURE.md)
- [Guide de Déploiement Vercel](file:///c:/Users/Administrator/portfolio/payflow_frontend/DEPLOYMENT.md)
- [Guide de Contribution](file:///c:/Users/Administrator/portfolio/payflow_frontend/CONTRIBUTING.md)
- [Contrat API Backend](file:///c:/Users/Administrator/portfolio/payflow_backend/API.md)
