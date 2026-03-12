/**
 * user.slice.ts
 * ---------------------------------
 * Slice Redux pour les données utilisateur
 * 
 * RÔLE MÉTIER :
 * - Gérer les données de l'utilisateur connecté
 * - Stocker le profil utilisateur
 * - Mettre à jour les informations utilisateur
 * 
 * UTILISÉ PAR :
 * - DashboardHeader (afficher "Bonjour, {firstName} 👋")
 * - Profil utilisateur
 * - Historique des transactions (filtrer par utilisateur)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, User } from './user.types';

/**
 * État initial du slice user
 */
const initialState: UserState = {
    currentUser: null,
    isLoading: false,
    error: null,
};

/**
 * Slice Redux pour les données utilisateur
 */
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        /**
         * Action : Définir l'utilisateur connecté
         * Utilisée après une connexion réussie ou lors du chargement du profil
         * 
         * Payload : Données complètes de l'utilisateur
         */
        setCurrentUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            state.error = null;
        },
        
        /**
         * Action : Mettre à jour les données utilisateur
         * Utilisée après une modification du profil
         * 
         * Payload : Données utilisateur partiellement mises à jour
         */
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.currentUser) {
                state.currentUser = {
                    ...state.currentUser,
                    ...action.payload,
                };
            }
        },
        
        /**
         * Action : Définir l'état de chargement
         * Utilisée pendant les appels API (chargement du profil, mise à jour)
         * 
         * Payload : true si chargement en cours, false sinon
         */
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        
        /**
         * Action : Définir une erreur
         * Utilisée en cas d'échec d'une opération
         * 
         * Payload : Message d'erreur
         */
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        
        /**
         * Action : Réinitialiser l'utilisateur
         * Utilisée lors de la déconnexion
         */
        clearUser: (state) => {
            state.currentUser = null;
            state.error = null;
            state.isLoading = false;
        },
    },
});

/**
 * Export des actions pour utilisation dans les composants
 * 
 * Exemple d'utilisation :
 * dispatch(setCurrentUser(userData));
 * dispatch(updateUser({ firstName: 'Nouveau prénom' }));
 */
export const {
    setCurrentUser,
    updateUser,
    setLoading,
    setError,
    clearUser,
} = userSlice.actions;

/**
 * Export du reducer pour utilisation dans rootReducer
 */
export default userSlice.reducer;



























