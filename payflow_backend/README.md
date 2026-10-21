# ⚡ Payflow Backend — Enterprise Payment Gateway & Ledger API

[![NestJS](https://img.shields.io/badge/NestJS-v11.0-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.10-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Paystack](https://img.shields.io/badge/Paystack-Integrated-0BA4DB?logo=paystack&logoColor=white)](https://paystack.com/)
[![Tests](https://img.shields.io/badge/Tests-Jest%20%7C%20Supertest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-Proprietary-black)](LICENSE)

Moteur backend haute performance et hautement sécurisé pour la passerelle de paiement **Payflow**. Conçu selon les architectures modernes en couches (Clean Architecture / Domain-Driven Design modulaire) avec le framework **NestJS**, **Prisma ORM v7**, et une base relationnelle **PostgreSQL**.

---

## 📑 Table des Matières
- [Architecture & Principes Clés](#-architecture--principes-clés)
- [Fonctionnalités Principales](#-fonctionnalités-principales)
- [Modèle de Données & Schéma Prisma](#-modèle-de-données--schéma-prisma)
- [Sécurité & Traitement des Webhooks](#-sécurité--traitement-des-webhooks)
- [Endpoints API REST](#-endpoints-api-rest)
- [Variables d'Environnement](#-variables-denvironnement)
- [Installation & Démarrage](#-installation--démarrage)
- [Stratégie de Tests](#-stratégie-de-tests)
- [Documentation Complémentaire](#-documentation-complémentaire)

---

## 🏛️ Architecture & Principes Clés

Le backend suit les principes d'isolation de domaines et d'inversion de dépendances de NestJS :

```
payflow_backend/
├── src/
│   ├── payments/          # Initialisation des transactions, DTOs de validation, conversion FCFA
│   ├── paystack/          # Client API HTTP résilient pour Paystack (HMAC, retries, headers)
│   ├── transactions/      # Consultation du grand livre (Ledger), filtres, agrégats
│   ├── webhooks/          # Réception sécurisée, audit log, idempotence, état transactionnel
│   ├── prisma/            # Service d'accès aux données (Prisma Client + PostgreSQL adapter)
│   ├── app.controller.ts  # Probes de liveness et de readiness (/health)
│   └── main.ts            # Bootstrap HTTP, CORS dynamique, ValidationPipes globales
├── prisma/
│   └── schema.prisma      # Schéma relationnel Prisma (PostgreSQL)
├── test/                  # Suite de tests E2E Supertest
└── generated/             # Client Prisma typé généré
```

### Principes directeurs :
1. **Isolation stricte des secrets** : Aucune clé privée Paystack (`PAYSTACK_SECRET_KEY`) ni URL de base de données n'est exposée aux clients externes ou au frontend.
2. **Idempotence native** : Tout webhook entrant est journalisé et horodaté avec une clé d'idempotence unique (`event_eventId`) garantissant un traitement sans double écriture.
3. **Atomicité des écritures (ACID)** : Les transitions d'état entre commande (`Order`) et transaction financière (`Transaction`) sont exécutées au sein de transactions de base de données `$transaction`.
4. **Validation stricte (Zero Trust Input)** : Toutes les données entrantes passent par un `ValidationPipe` global avec nettoyage (`whitelist`), rejet des champs non déclarés (`forbidNonWhitelisted`), et assainissement XSS/injections.

---

## ✨ Fonctionnalités Principales

- **Initialisation de Paiement Sécurisée (`POST /payments/initialize`)** :
  - Validation du montant en FCFA (XOF).
  - Conversion automatique en sous-unités monétaires (centimes) requises par l'agrégateur Paystack.
  - Génération d'une référence interne unique horodatée (`PAYFLOW-XXXXXXXX`).
  - Enregistrement immédiat de l'intention d'achat (`Order`) et de la transaction en état `PENDING`.
  - Redirection du client vers l'interface de paiement sécurisée Paystack.

- **Moteur d'Audit & Webhook Handler (`POST /webhooks`)** :
  - Vérification cryptographique de la signature d'en-tête `x-paystack-signature` via HMAC-SHA512.
  - Déduplication automatique des événements via clé d'idempotence.
  - Mise à jour en temps réel des statuts (`PENDING` ➔ `SUCCESS` ou `FAILED`).
  - Conservation de la trace brute de l'événement JSON pour la traçabilité financière.

- **Grand Livre des Transactions (`GET /transactions` & `GET /transactions/:id`)** :
  - Listing chronologique descendant des transactions avec métadonnées client complètes.
  - Consultation détaillée d'un paiement spécifique par identifiant UUID.

- **Sonde de Santé (`GET /health`)** :
  - Monitoring pour les orchestrateurs (Docker, Kubernetes, Vercel, Render) avec retour HTTP `200 OK`.

---

## 🗄️ Modèle de Données & Schéma Prisma

Le schéma relationnel PostgreSQL modélise avec rigueur la séparation entre l'engagement commercial (`Order`), la transaction monétaire (`Transaction`), et l'événement externe (`WebhookEvent`).

```mermaid
erDiagram
    ORDER ||--o{ TRANSACTION : "engendre"
    ORDER {
        uuid id PK
        string reference UK
        string customerName
        string customerEmail
        string customerPhone
        int amount
        string currency
        enum status "PENDING | SUCCESS | FAILED"
        datetime createdAt
        datetime updatedAt
    }
    TRANSACTION {
        uuid id PK
        string internalRef UK
        string paystackRef UK
        uuid orderId FK
        int amount
        string currency
        string channel
        enum status "PENDING | SUCCESS | FAILED"
        datetime createdAt
        datetime updatedAt
    }
    WEBHOOK_EVENT {
        uuid id PK
        string event
        string reference
        string idempotencyKey UK
        enum processingStatus "RECEIVED | PROCESSED | FAILED"
        json payload
        datetime createdAt
    }
```

---

## 🔒 Sécurité & Traitement des Webhooks

Le système intègre une chaîne de sécurité complète pour contrer les attaques courantes (Replay attacks, MITM, Injection) :

```mermaid
sequenceDiagram
    autonumber
    participant P as Paystack API
    participant W as WebhooksController
    participant S as WebhooksService
    participant DB as PostgreSQL (Prisma)

    P->>W: POST /webhooks (Header: x-paystack-signature, Body JSON)
    W->>S: handlePaystackWebhook(signature, body)
    Note over S: Calcul HMAC-SHA512(body, PAYSTACK_SECRET_KEY)
    alt Signature Invalide
        S-->>W: Throw 401 Unauthorized
        W-->>P: 401 Unauthorized (Log alerte sécurité)
    else Signature Valide
        S->>DB: Vérifie idempotencyKey (event + data.id)
        alt Déjà traité (PROCESSED)
            S-->>W: Ignoré (Idempotent)
            W-->>P: 200 OK { received: true }
        else Nouvel événement
            S->>DB: Enregistre WebhookEvent (status: RECEIVED)
            S->>DB: $transaction [Update Transaction status, Update Order status]
            S->>DB: Update WebhookEvent (status: PROCESSED)
            S-->>W: Traitement terminé
            W-->>P: 200 OK { received: true }
        end
    end
```

---

## 📡 Endpoints API REST

Pour une spécification détaillée des formats de payload JSON, consultez [API.md](file:///c:/Users/Administrator/portfolio/payflow_backend/API.md).

| Méthode | Route | Description | Accès / Sécurité |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Sonde de santé de l'API | Public |
| `POST` | `/payments/initialize` | Initialisation de paiement Paystack | Validation DTO stricte |
| `GET` | `/transactions` | Liste de toutes les transactions | Restreint / Frontend |
| `GET` | `/transactions/:id` | Détails complets d'une transaction | Restreint / Frontend |
| `GET` | `/webhooks` | Journal d'audit des webhooks reçus | Restreint / Backoffice |
| `POST` | `/webhooks` | Réception des notifications Paystack | Signature HMAC-SHA512 requise |

---

## ⚙️ Variables d'Environnement

Un fichier `.env` doit être créé à la racine du backend d'après le gabarit [`.env.example`](file:///c:/Users/Administrator/portfolio/payflow_backend/.env.example) :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/payflow_db?schema=public"

# Environnement et Port
NODE_ENV="development"
PORT=3001

# Intégration Paystack
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
PAYSTACK_BASE_URL="https://api.paystack.co"

# CORS & Redirection Frontend
FRONTEND_URL="http://localhost:3000"
```

| Variable | Obligatoire | Rôle & Conseils |
| :--- | :---: | :--- |
| `DATABASE_URL` | **Oui** | Chaîne de connexion PostgreSQL (Postgres local, Neon, Supabase). |
| `PAYSTACK_SECRET_KEY` | **Oui** | Clé secrète Paystack commençant par `sk_test_` (Test) ou `sk_live_` (Production). |
| `FRONTEND_URL` | **Oui** | URL autorisée pour le CORS et utilisée pour le `callback_url` post-paiement. |
| `PORT` | Non | Port d'écoute HTTP (3001 par défaut). |

---

## 🚀 Installation & Démarrage

### 1. Prérequis
- **Node.js** >= 20.x
- **PostgreSQL** >= 15.x
- Un compte marchand / développeur **Paystack**

### 2. Cloner et installer les dépendances
```bash
cd payflow_backend
npm install
```

### 3. Configurer la base de données & Prisma
```bash
# Générer le client Prisma typé
npx prisma generate

# Appliquer les migrations de base de données
npx prisma migrate dev --name init
```

### 4. Démarrer le serveur
```bash
# Mode développement avec rechargement automatique (Watch)
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

Le serveur sera disponible sur `http://localhost:3001` (ou le port défini dans `PORT`).

---

## 🧪 Stratégie de Tests

Le projet intègre une suite de tests rigoureuse :
- **Tests unitaires et de validation DTO** (`*.spec.ts`) : Couverture des regex anti-XSS, sanitization des entrées utilisateurs, validation des formats email et numéros de téléphone.
- **Tests End-to-End (E2E)** (`test/app.e2e-spec.ts`) : Simulation complète de requêtes HTTP avec Supertest, validation des codes de retour (400, 200, 201).

```bash
# Exécuter les tests unitaires
npm test

# Exécuter les tests avec couverture de code
npm run test:cov

# Exécuter les tests End-to-End
npm run test:e2e
```

---

## 📚 Documentation Complémentaire
- [Spécification de l'API REST](file:///c:/Users/Administrator/portfolio/payflow_backend/API.md)
- [Guide d'Architecture Système](file:///c:/Users/Administrator/portfolio/payflow_backend/ARCHITECTURE.md)
- [Guide de Déploiement en Production](file:///c:/Users/Administrator/portfolio/payflow_backend/DEPLOYMENT.md)
- [Guide de Contribution & Standards](file:///c:/Users/Administrator/portfolio/payflow_backend/CONTRIBUTING.md)
