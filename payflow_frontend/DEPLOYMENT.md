# 🚀 Guide de Déploiement en Production — Payflow Frontend

Ce guide décrit les étapes pour déployer et maintenir en production l'interface web **Payflow** sur la plateforme **Vercel** ou tout hébergeur moderne de conteneurs/Node.js.

---

## ☁️ Déploiement sur Vercel (Recommandé)

### 1. Liaison du Dépôt
1. Rendez-vous sur [vercel.com](https://vercel.com/) et connectez-vous avec votre compte GitHub / GitLab.
2. Cliquez sur **Add New...** ➔ **Project**.
3. Importez le dépôt contenant `payflow_frontend`.
4. Sélectionnez **Next.js** comme Framework Preset.
5. Définissez le **Root Directory** sur `payflow_frontend` si vous êtes dans un monorepo.

### 2. Configuration des Variables d'Environnement
Dans la section **Environment Variables** de Vercel, ajoutez :

| Nom de Variable | Exemple Staging | Exemple Production | Rôle |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://api-stage.votredomaine.com` | `https://api.votredomaine.com` | URL de base du backend NestJS exposée au navigateur. |

> [!IMPORTANT]
> Assurez-vous que le backend NestJS autorise l'URL du frontend dans sa configuration `FRONTEND_URL` pour que les requêtes CORS soient acceptées.

### 3. Commande de Build & Output
- **Build Command** : `npm run build`
- **Output Directory** : `.next` (par défaut pour Next.js)
- **Install Command** : `npm install`

---

## 🐳 Déploiement Conteneurisé (Docker / Standalone)

Pour déployer le frontend sur une infrastructure cloud privée (Kubernetes, AWS ECS, Google Cloud Run) :

```dockerfile
FROM node:20-alpine AS base

# 1. Dépendances
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2. Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Image de Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]
```

---

## ⚡ Optimisation des Performances & Core Web Vitals

- **LCP (Largest Contentful Paint)** : Les icônes SVG sont directement inline ou optimisées pour éviter des allers-retours réseau bloquants.
- **Polices auto-hébergées** : `next/font` optimise la police `Geist` sans téléchargement externe depuis Google Fonts, éliminant les pénalités de latence DNS.
- **Client Bundling** : Les bibliothèques lourdes sont exclues du bundle client initial ; `apiFetch` est dynamique pour accélérer l'affichage de la première page utile (FCP).
