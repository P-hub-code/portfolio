# Guide de Migration : Actions Synchrones → Thunks Async (API)

## ⚠️ PROBLÈMES IDENTIFIÉS

### 1. **Tricycle.tsx - Réservation de course**

**Code actuel (lignes 110-163) :**
```typescript
// ❌ PROBLÈME : Actions synchrones appelées directement
dispatch(setActiveTrip(newTrip));
dispatch(debit(selectedTricycle.price));
```

**Problèmes :**
- ✅ Le state Redux est modifié **AVANT** la confirmation de l'API
- ✅ Si l'API échoue, le state est déjà modifié (incohérence)
- ✅ Pas de rollback possible
- ✅ Le débit se fait côté client au lieu du serveur
- ✅ Pas de gestion d'erreur API

**Solution nécessaire :**
```typescript
// ✅ CORRECT : Utiliser un thunk qui appelle l'API d'abord
dispatch(reserveTripThunk({
  driverId: selectedTricycle.id,
  departure: selectedTricycle.departure,
  destination: selectedTricycle.destination,
  price: selectedTricycle.price,
}));
```

---

### 2. **wallet.slice.ts - Opérations financières**

**Code actuel :**
```typescript
// ❌ PROBLÈME : Actions synchrones pour des opérations critiques
debit: (state, action: PayloadAction<number>) => {
    state.balance = Math.max(0, state.balance - action.payload);
},
credit: (state, action: PayloadAction<number>) => {
    state.balance += action.payload;
},
```

**Problèmes :**
- ✅ Les opérations financières doivent être validées par le backend
- ✅ Risque de double débit si l'API est appelée deux fois
- ✅ Pas de vérification du solde réel côté serveur
- ✅ Pas de transaction atomique (débit + création de course)

**Solution nécessaire :**
```typescript
// ✅ CORRECT : Thunks qui appellent l'API et mettent à jour le state après confirmation
dispatch(rechargeWalletThunk({ amount: 1000, paymentMethod: 'mobile_money' }));
dispatch(debitWalletThunk({ amount: 2500, reason: 'trip_reservation', tripId: 'trip-123' }));
```

---

### 3. **mobility.slice.ts - Gestion des courses**

**Code actuel :**
```typescript
// ❌ PROBLÈME : Actions synchrones sans validation backend
setActiveTrip: (state, action: PayloadAction<Trip>) => {
    state.activeTrip = action.payload;
},
```

**Problèmes :**
- ✅ La course est créée côté client sans ID serveur
- ✅ Pas de synchronisation avec le backend
- ✅ Risque de conflit si plusieurs clients réservent le même tricycle
- ✅ Pas de validation des données (prix, disponibilité, etc.)

**Solution nécessaire :**
```typescript
// ✅ CORRECT : Thunk qui crée la course via API et met à jour le state
dispatch(createTripThunk(tripData));
dispatch(cancelTripThunk(tripId));
dispatch(updateTripStatusThunk({ tripId, status: 'in_progress' }));
```

---

## 🔧 PLAN DE MIGRATION

### Étape 1 : Créer les Thunks (Actions Async)

**Fichiers à créer :**
- `src/store/wallet/wallet.thunks.ts` - Thunks pour wallet (recharge, débit, historique)
- `src/store/mobility/mobility.thunks.ts` - Thunks pour courses (créer, annuler, mettre à jour)
- `src/store/auth/auth.thunks.ts` - Thunks pour auth (login, logout, refresh token)
- `src/store/user/user.thunks.ts` - Thunks pour user (charger profil, mettre à jour)

**Structure d'un thunk :**
```typescript
export const reserveTripThunk = createAsyncThunk(
    'mobility/reserveTrip',
    async (tripData: ReserveTripPayload, { rejectWithValue }) => {
        try {
            // 1. Appel API
            const response = await api.post('/trips', tripData);
            
            // 2. Retourner les données pour le reducer
            return response.data;
        } catch (error) {
            // 3. Gérer les erreurs
            return rejectWithValue(error.message);
        }
    }
);
```

---

### Étape 2 : Modifier les Slices pour gérer les Thunks

**Ajouter `extraReducers` dans chaque slice :**

```typescript
const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        // Actions synchrones (gardées pour usage interne)
        setBalance: (state, action) => { ... },
    },
    extraReducers: (builder) => {
        // Gérer les états des thunks
        builder
            .addCase(rechargeWalletThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(rechargeWalletThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.balance = action.payload.balance; // Balance depuis l'API
                state.transactions.unshift(action.payload.transaction);
            })
            .addCase(rechargeWalletThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});
```

---

### Étape 3 : Modifier les Composants

**AVANT (Tricycle.tsx) :**
```typescript
// ❌ Actions synchrones
dispatch(setActiveTrip(newTrip));
dispatch(debit(selectedTricycle.price));
```

**APRÈS (Tricycle.tsx) :**
```typescript
// ✅ Thunk async
dispatch(reserveTripThunk({
    driverId: selectedTricycle.id,
    departure: selectedTricycle.departure,
    destination: selectedTricycle.destination,
    price: selectedTricycle.price,
}));
```

---

## 📋 CHECKLIST DE MIGRATION

### Wallet
- [ ] Créer `wallet.thunks.ts` avec :
  - [ ] `rechargeWalletThunk` - Recharger le portefeuille
  - [ ] `debitWalletThunk` - Débiter (appelé par d'autres thunks)
  - [ ] `fetchWalletBalanceThunk` - Charger le solde
  - [ ] `fetchTransactionsThunk` - Charger l'historique
- [ ] Ajouter `extraReducers` dans `wallet.slice.ts`
- [ ] Modifier `WalletCard.tsx` pour utiliser `fetchWalletBalanceThunk` au montage
- [ ] Modifier les composants qui appellent `debit()` directement

### Mobility
- [ ] Créer `mobility.thunks.ts` avec :
  - [ ] `reserveTripThunk` - Réserver une course
  - [ ] `cancelTripThunk` - Annuler une course
  - [ ] `updateTripStatusThunk` - Mettre à jour le statut
  - [ ] `fetchActiveTripThunk` - Charger la course active
  - [ ] `fetchTripHistoryThunk` - Charger l'historique
- [ ] Ajouter `extraReducers` dans `mobility.slice.ts`
- [ ] Modifier `Tricycle.tsx` pour utiliser `reserveTripThunk`
- [ ] Supprimer les appels directs à `setActiveTrip()` et `debit()`

### Auth
- [ ] Créer `auth.thunks.ts` avec :
  - [ ] `loginThunk` - Connexion
  - [ ] `logoutThunk` - Déconnexion
  - [ ] `refreshTokenThunk` - Rafraîchir le token
- [ ] Ajouter `extraReducers` dans `auth.slice.ts`

### User
- [ ] Créer `user.thunks.ts` avec :
  - [ ] `fetchUserProfileThunk` - Charger le profil
  - [ ] `updateUserProfileThunk` - Mettre à jour le profil
- [ ] Ajouter `extraReducers` dans `user.slice.ts`
- [ ] Modifier `DashboardHeader.tsx` pour utiliser `fetchUserProfileThunk` au montage

---

## 🎯 BONNES PRATIQUES

### 1. **Ordre des opérations**
```typescript
// ✅ CORRECT : API d'abord, puis Redux
const response = await api.post('/trips', data);
dispatch(setActiveTrip(response.data.trip));
dispatch(debitWalletThunk({ amount: response.data.trip.price, tripId: response.data.trip.id }));

// ❌ INCORRECT : Redux d'abord, puis API
dispatch(setActiveTrip(trip));
await api.post('/trips', data); // Si ça échoue, le state est déjà modifié
```

### 2. **Gestion des erreurs**
```typescript
// ✅ CORRECT : Rollback en cas d'erreur
try {
    const response = await api.post('/trips', data);
    dispatch(setActiveTrip(response.data.trip));
} catch (error) {
    // Pas besoin de rollback, le state n'a pas été modifié
    dispatch(setError(error.message));
}
```

### 3. **Optimistic Updates (optionnel)**
```typescript
// Pour améliorer l'UX, on peut mettre à jour le state immédiatement
// puis annuler si l'API échoue
dispatch(setActiveTrip(trip)); // Optimistic update
try {
    await api.post('/trips', data);
} catch (error) {
    dispatch(cancelActiveTrip()); // Rollback
    dispatch(setError(error.message));
}
```

---

## ⚠️ POINTS D'ATTENTION

1. **Ne pas supprimer les actions synchrones** : Elles seront utilisées par les thunks dans `extraReducers`
2. **Toujours valider côté serveur** : Ne jamais faire confiance aux données client
3. **Gérer les états de chargement** : Utiliser `isLoading` pour afficher des loaders
4. **Gérer les erreurs** : Toujours afficher les erreurs à l'utilisateur
5. **Tests** : Tester les cas d'erreur (API down, timeout, etc.)

---

## 📝 EXEMPLE COMPLET

Voir `src/store/wallet/wallet.thunks.example.ts` (à créer) pour un exemple complet de thunk avec gestion d'erreurs.


































