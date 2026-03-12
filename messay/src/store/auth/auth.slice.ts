/**
 * auth.slice.ts
 * ---------------------------------
 * Slice Redux pour l'authentification
 * 
 * RÔLE MÉTIER :
 * - Gérer l'état d'authentification de l'utilisateur
 * - Stocker le token JWT
 * - Gérer la connexion/déconnexion
 * 
 * UTILISÉ PAR :
 * - DashboardHeader (afficher le prénom utilisateur)
 * - Navigation guards (protéger les routes)
 * - Tous les composants qui ont besoin de savoir si l'utilisateur est connecté
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginResponse } from './auth.types';

/**
 * État initial du slice auth
 */
const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

/**
 * Slice Redux pour l'authentification
 * 
 * createSlice génère automatiquement :
 * - Les actions (setToken, setUser, logout, etc.)
 * - Le reducer
 * - Les action creators
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Action : Définir le token d'authentification
         * Utilisée après une connexion réussie
         * 
         * Payload : Token JWT
         */
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },
        
        /**
         * Action : Définir les données utilisateur
         * Utilisée après une connexion réussie
         * 
         * Payload : Données utilisateur (id, firstName, lastName, email)
         */
        setUser: (state, action: PayloadAction<LoginResponse['user']>) => {
            // Les données utilisateur sont stockées dans le slice user
            // Cette action peut être utilisée pour synchroniser auth et user
            state.isAuthenticated = true;
        },
        
        /**
         * Action : Définir l'état de chargement
         * Utilisée pendant les appels API (login, logout)
         * 
         * Payload : true si chargement en cours, false sinon
         */
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        
        /**
         * Action : Définir une erreur
         * Utilisée en cas d'échec d'authentification
         * 
         * Payload : Message d'erreur
         */
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        
        /**
         * Action : Déconnecter l'utilisateur
         * Réinitialise tout l'état d'authentification
         */
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
        },
        
        /**
         * Action : Connexion réussie
         * Combine setToken et setUser en une seule action
         * 
         * Payload : Réponse complète de l'API (token + user)
         */
        loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
            // Note : Les données user seront gérées par le slice user
        },
    },
});

/**
 * Export des actions pour utilisation dans les composants
 * 
 * Exemple d'utilisation :
 * dispatch(setToken('abc123'));
 * dispatch(logout());
 */
export const {
    setToken,
    setUser,
    setLoading,
    setError,
    logout,
    loginSuccess,
} = authSlice.actions;

/**
 * Export du reducer pour utilisation dans rootReducer
 */
export default authSlice.reducer;



























