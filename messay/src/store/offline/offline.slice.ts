/**
 * offline.slice.ts
 * ---------------------------------
 * Slice Redux pour la gestion offline
 * 
 * RÔLE MÉTIER :
 * - Détecter l'état de la connexion réseau
 * - Gérer les actions en attente de synchronisation
 * - Synchroniser avec le backend quand la connexion revient
 * 
 * UTILISÉ PAR :
 * - Tous les composants qui doivent gérer le mode offline
 * - Système de synchronisation automatique
 * 
 * NOTE :
 * Ce slice sera implémenté plus tard, lors de l'ajout de la gestion offline.
 * Pour l'instant, on crée juste la structure de base.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OfflineState, NetworkStatus, PendingAction } from './offline.types';

/**
 * État initial du slice offline
 */
const initialState: OfflineState = {
    networkStatus: 'online', // Par défaut, on suppose en ligne
    pendingActions: [],
    isSyncing: false,
};

/**
 * Slice Redux pour la gestion offline
 */
const offlineSlice = createSlice({
    name: 'offline',
    initialState,
    reducers: {
        /**
         * Action : Définir le statut de la connexion réseau
         * Utilisée par le système de détection réseau
         * 
         * Payload : 'online' ou 'offline'
         */
        setNetworkStatus: (state, action: PayloadAction<NetworkStatus>) => {
            state.networkStatus = action.payload;
        },
        
        /**
         * Action : Ajouter une action en attente
         * Utilisée quand une action doit être synchronisée plus tard
         * 
         * Payload : Action en attente
         */
        addPendingAction: (state, action: PayloadAction<PendingAction>) => {
            state.pendingActions.push(action.payload);
        },
        
        /**
         * Action : Retirer une action en attente
         * Utilisée après une synchronisation réussie
         * 
         * Payload : ID de l'action à retirer
         */
        removePendingAction: (state, action: PayloadAction<string>) => {
            state.pendingActions = state.pendingActions.filter(
                (action) => action.id !== action.payload
            );
        },
        
        /**
         * Action : Définir l'état de synchronisation
         * Utilisée pendant la synchronisation avec le backend
         * 
         * Payload : true si synchronisation en cours, false sinon
         */
        setSyncing: (state, action: PayloadAction<boolean>) => {
            state.isSyncing = action.payload;
        },
        
        /**
         * Action : Réinitialiser l'offline
         * Utilisée lors de la déconnexion
         */
        resetOffline: (state) => {
            state.pendingActions = [];
            state.isSyncing = false;
        },
    },
});

/**
 * Export des actions pour utilisation dans les composants
 * 
 * Exemple d'utilisation (plus tard) :
 * dispatch(setNetworkStatus('offline'));
 * dispatch(addPendingAction(pendingAction));
 */
export const {
    setNetworkStatus,
    addPendingAction,
    removePendingAction,
    setSyncing,
    resetOffline,
} = offlineSlice.actions;

/**
 * Export du reducer pour utilisation dans rootReducer
 */
export default offlineSlice.reducer;



























