# 🚀 Guide de Déploiement en Production — Payflow Backend

Ce guide détaille les procédures d'hébergement, la configuration des variables d'environnement, les migrations de base de données et la mise en production du backend **Payflow**.

---

## 🎯 Plateformes Recommandées

| Composant | Option Recommandée | Alternatives |
| :--- | :--- | :--- |
| **API Server (NestJS)** | **Vercel** / **Render** | Railway, AWS App Runner, Fly.io, Docker ECS |
| **Base de Données** | **Neon PostgreSQL** / **Supabase** | AWS RDS Aurora, Render Postgres |
| **Passerelle Bancaire** | **Paystack** | Mobile Money Aggregators, Stripe |

---

## 🔐 1. Matrice des Variables d'Environnement

Configurez les variables suivantes dans le panneau d'administration de votre hébergeur (ex: Vercel Project Settings > Environment Variables) :

| Variable | Environnement Staging | Environnement Production | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | `production` | `production` | Active les optimisations de performance de Node.js. |
| `DATABASE_URL` | `postgresql://.../payflow_stage` | `postgresql://.../payflow_prod` | Chaîne de connexion PostgreSQL avec SSL (`sslmode=require`). |
| `PAYSTACK_SECRET_KEY` | `sk_test_...` | `sk_live_...` | Clé API secrète marchande Paystack. |
| `PAYSTACK_PUBLIC_KEY` | `pk_test_...` | `pk_live_...` | Clé API publique marchande Paystack. |
| `PAYSTACK_BASE_URL` | `https://api.paystack.co` | `https://api.paystack.co` | Point d'entrée de l'API Paystack. |
| `FRONTEND_URL` | `https://payflow-stage.vercel.app` | `https://payflow.example.com` | URL utilisée pour configurer le CORS et le callback URL. |
| `PORT` | `3001` (ou assigné par l'hôte) | Dynamique | Port d'écoute du serveur HTTP. |

> [!CAUTION]
> Ne commitez jamais les fichiers `.env` contenant de vraies clés secrètes dans votre dépôt Git. Utilisez toujours le gestionnaire de secrets de votre plateforme d'hébergement.

---

## 🗄️ 2. Pipeline de Migration de Base de Données

Avant chaque déploiement d'une nouvelle version de l'API, les migrations Prisma doivent être appliquées :

```bash
# Dans le script de build ou release command :
npx prisma migrate deploy
```

Dans `package.json`, le script `postinstall` exécute automatiquement :
```bash
prisma generate
```
Cela garantit que le client Prisma typé est recompilé dans le runtime cible lors du build Vercel ou Docker.

---

## 🔗 3. Configuration du Webhook sur le Dashboard Paystack

Pour que Paystack puisse notifier Payflow en temps réel des encaissements :

1. Connectez-vous à votre [Dashboard Paystack](https://dashboard.paystack.com/#/settings/developer).
2. Rendez-vous dans **Settings** ➔ **API Keys & Webhooks**.
3. Renseignez le champ **Live Webhook URL** (ou **Test Webhook URL** en développement) :
   ```
   https://<votre-domaine-api>/webhooks
   ```
4. Cliquez sur **Save Changes**.
5. Paystack transmettra désormais tous les événements (`charge.success`, `charge.failed`) signés avec votre `PAYSTACK_SECRET_KEY`.

---

## 🐳 4. Déploiement Conteneurisé (Docker)

Pour les déploiements sur Kubernetes, AWS ECS ou des VM dédiées :

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main"]
```

---

## 🩺 5. Surveillance & Santé du Service

- **Probe de liveness / readiness** :
  Configurez votre load balancer pour requêter régulièrement :
  ```http
  GET /health
  ```
  Un statut HTTP `200` avec `{"status":"ok"}` atteste du bon fonctionnement du processus Node.js.
