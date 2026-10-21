# 🤝 Guide de Contribution — Payflow Backend

Bienvenue sur le projet **Payflow Backend**. Ce document décrit les standards d'ingénierie logicielle, les conventions de code et les procédures de validation pour contribuer au projet.

---

## 🛠️ Standards de Développement

### 1. Typage & Qualité de Code
- **TypeScript Strict** : Aucun type `any` implicite n'est toléré dans le code de production.
- **Validation DTO obligatoire** : Tout endpoint acceptant un payload JSON entrant doit définir un DTO décoré avec `class-validator` et `class-transformer`.
- **Inversion de Contrôle** : Tous les services doivent être déclarés avec le décorateur `@Injectable()` et enregistrés dans leurs modules respectifs.

### 2. Formatage & Linter
Le projet utilise **ESLint 9** et **Prettier** :
```bash
# Vérifier et corriger les erreurs de lint
npm run lint

# Formater l'ensemble des fichiers
npm run format
```

---

## 🌿 Stratégie Git & Conventions de Commit

Nous appliquons la convention **Conventional Commits** :

```
<type>(<scope>): <description courte en minuscules>

[corps optionnel décrivant la motivation du changement]
```

### Types autorisés :
- `feat` : Nouvelle fonctionnalité API ou métier.
- `fix` : Correction d'un bug ou d'un comportement inattendu.
- `refactor` : Modification du code sans changement de comportement externe.
- `test` : Ajout ou mise à jour de tests unitaires / E2E.
- `docs` : Documentation technique ou commentaires d'architecture.
- `chore` : Mise à jour des dépendances, configuration CI/CD ou outillage.

*Exemples :*
- `feat(payments): add support for mobile money channel`
- `fix(webhooks): handle empty customer phone gracefully`
- `test(dto): add xss injection test vectors for customer name`

---

## 🧪 Exigence sur les Tests

Toute nouvelle fonctionnalité ou correction de bug doit s'accompagner de ses tests automatisés :
1. **Tests unitaires de validation** dans `src/**/dto/*.spec.ts`.
2. **Tests d'intégration / E2E** dans `test/app.e2e-spec.ts`.
3. Validation préalable avant soumission :
   ```bash
   npm run lint
   npm test
   npm run build
   ```

---

## 📋 Checklist avant Pull Request (PR)

- [ ] Les tests existants et nouveaux passent avec succès (`npm test`).
- [ ] Le build de production s'exécute sans erreur (`npm run build`).
- [ ] Aucun secret, mot de passe ou clé API n'est présent dans le commit (`git diff`).
- [ ] Les nouvelles routes sont documentées dans `API.md` et `README.md`.
- [ ] Si une migration de base de données est requise, elle est testée en local via `npx prisma migrate dev`.
