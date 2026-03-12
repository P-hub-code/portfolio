/**
 * rootReducer.ts
 * ---------------------------------
 * Combinaison de tous les reducers de l'application
 * 
 * RÔLE :
 * - Assemble tous les slices (domaines métier) en un seul reducer
 * - Définit la structure globale du state Redux
 * 
 * STRUCTURE DU STATE GLOBAL :
 * {
 *   auth: { ... },      // État authentification
 *   wallet: { ... },    // État portefeuille
 *   mobility: { ... }, // État mobilité/courses
 *   user: { ... },      // Données utilisateur
 *   offline: { ... }    // Gestion offline
 * }
 */

import { combineReducers } from '@reduxjs/toolkit';

/**
 * Import des reducers de chaque slice
 * Chaque slice exporte son reducer qui sera combiné ici
 */
import authReducer from './auth/auth.slice';
import walletReducer from './wallet/wallet.slice';
import mobilityReducer from './mobility/mobility.slice';
import userReducer from './user/user.slice';
import offlineReducer from './offline/offline.slice';

/**
 * Root Reducer
 * 
 * Combine tous les reducers de l'application.
 * Chaque clé correspond à un domaine métier.
 * 
 * Exemple d'utilisation :
 * - state.auth → état authentification
 * - state.wallet → état portefeuille
 * - state.mobility → état mobilité
 */
export const rootReducer = combineReducers({
    auth: authReducer,
    wallet: walletReducer,
    mobility: mobilityReducer,
    user: userReducer,
    offline: offlineReducer,
});

