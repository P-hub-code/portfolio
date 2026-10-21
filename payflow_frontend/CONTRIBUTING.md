# 🤝 Guide de Contribution — Payflow Frontend

Bienvenue sur le projet **Payflow Frontend**. Ce document rassemble les conventions d'ingénierie logicielle, les règles de style et les consignes d'accessibilité pour contribuer au tableau de bord.

---

## 🎨 Principes de Conception d'Interface

### 1. Respect des Tokens du Design System
- N'utilisez pas de valeurs arbitraires Tailwind (ex: `bg-[#5427e6]`).
- Utilisez exclusivement les tokens sémantiques définis dans `globals.css` :
  - `bg-primary` pour les actions principales.
  - `bg-secondary` / `text-secondary` pour les statuts de succès.
  - `bg-tertiary` / `text-tertiary` pour les statuts en attente.
  - `bg-error` / `text-error` pour les erreurs ou échecs.

### 2. Accessibilité & Ergonomie (a11y)
- Tous les champs de formulaire interactifs doivent être accompagnés d'un label explicite (`<label htmlFor="...">`).
- Les éléments cliquables doivent posséder des zones de clic adaptées au tactile (minimum 44x44px).
- Respectez les contrastes de couleurs WCAG AA pour la lisibilité sur fond clair ou sombre.

### 3. Typage TypeScript Strict
- Toute nouvelle structure de données (transaction, métrique, événement webhook) doit être typée dans `src/types/index.ts`.
- Évitez le type `any` non documenté.

---

## 🌿 Conventions de Commit & Workflow Git

Nous suivons le standard **Conventional Commits** :

```
<type>(<scope>): <description claire et concise>
```

### Exemples :
- `feat(dashboard): add export to csv button for transactions`
- `fix(payments): prevent double submission on slow network`
- `style(sidebar): refine active link background opacity`
- `refactor(api): centralize network timeout handling`

---

## 📋 Checklist de Validation de PR

- [ ] L'application compile sans avertissement ni erreur (`npm run build`).
- [ ] Le linter ne remonte aucune violation (`npm run lint`).
- [ ] Les formulaires intègrent une validation immédiate côté client.
- [ ] L'interface est responsive sur mobile (375px), tablette (768px) et desktop (1280px+).
- [ ] Aucun secret d'environnement ni clé privée n'a été inséré dans le code source.
