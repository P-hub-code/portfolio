/**
 * index.ts
 * ---------------------------------
 * Configuration globale du store Redux
 * 
 * RÔLE :
 * - Créer et configurer le store Redux unique de l'application
 * - Activer Redux DevTools en développement
 * - Exporter les types TypeScript pour une utilisation type-safe
 * 
 * IMPORTANT :
 * Ce store est unique pour toute l'application.
 * Tous les composants y accèdent via useSelector/useDispatch.
 */

import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

/**
 * Configuration du store Redux
 * 
 * configureStore de Redux Toolkit :
 * - Combine automatiquement les reducers
 * - Active Redux DevTools en développement
 * - Ajoute les middlewares par défaut (thunk, etc.)
 * - Configure les checks d'erreur en développement
 */
export const store = configureStore({
    /**
     * Root reducer : combine tous les reducers de l'application
     */
    reducer: rootReducer,

    /**
     * Redux DevTools
     * 
     * __DEV__ : variable React Native (true en dev, false en production)
     * 
     * En développement :
     * - DevTools activé → permet de voir les actions, le state, time-travel
     * 
     * En production :
     * - DevTools désactivé → pas d'impact sur les performances
     */
    devTools: __DEV__,

    /**
     * Middleware
     * 
     * Redux Toolkit ajoute automatiquement :
     * - Redux Thunk (pour les actions async)
     * - Checks d'immutabilité en développement
     * - Checks de sérialisation en développement
     * 
     * Pas besoin de les configurer manuellement.
     */
});

/**
 * Types TypeScript pour une utilisation type-safe
 * 
 * RootState : Type du state global
 * Utilisation : useSelector((state: RootState) => state.wallet.balance)
 * 
 * AppDispatch : Type de la fonction dispatch
 * Utilisation : const dispatch = useDispatch<AppDispatch>();
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Export du store pour utilisation dans Provider (App.tsx)
 */
export default store;