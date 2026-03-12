/**
 * mobility.slice.ts
 * ---------------------------------
 * Slice Redux pour la mobilité (Tricycles, Courses)
 * 
 * RÔLE MÉTIER :
 * - Gérer la course active
 * - Gérer l'historique des courses
 * - Gérer les opérations (réservation, annulation, etc.)
 * 
 * UTILISÉ PAR :
 * - Tricycle.tsx - Afficher le statut de la course active
 * - Dashboard.tsx - Afficher une notification "Course en cours"
 * - Wallet.tsx - Afficher le montant en attente de débit
 * - ReserveButton - Gérer la réservation
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MobilityState, Trip, TripStatus } from './mobility.types';

/**
 * État initial du slice mobility
 */
const initialState: MobilityState = {
    activeTrip: null,
    tripHistory: [],
    isLoading: false,
    error: null,
};

/**
 * Slice Redux pour la mobilité
 */
const mobilitySlice = createSlice({
    name: 'mobility',
    initialState,
    reducers: {
        /**
         * Action : Définir la course active
         * Utilisée lors d'une réservation réussie
         * 
         * Payload : Données de la course
         * 
         * Exemple :
         * dispatch(setActiveTrip({
         *   id: 'trip-123',
         *   driverId: 'driver-1',
         *   driverName: 'Kouamé Yves',
         *   departure: 'Plateau',
         *   destination: 'Cocody',
         *   estimatedTime: '18 min',
         *   distance: '6.5 km',
         *   price: 2500,
         *   status: 'pending',
         *   createdAt: new Date().toISOString()
         * }));
         */
        setActiveTrip: (state, action: PayloadAction<Trip>) => {
            state.activeTrip = action.payload;
            state.error = null;
        },
        
        /**
         * Action : Mettre à jour le statut de la course active
         * Utilisée quand le statut change (pending → accepted → in_progress → completed)
         * 
         * Payload : Nouveau statut
         * 
         * Exemple :
         * dispatch(updateTripStatus('in_progress'));
         */
        updateTripStatus: (state, action: PayloadAction<TripStatus>) => {
            if (state.activeTrip) {
                state.activeTrip.status = action.payload;
                
                // Si la course est complétée, la déplacer vers l'historique
                if (action.payload === 'completed' && state.activeTrip) {
                    state.tripHistory.unshift({
                        ...state.activeTrip,
                        completedAt: new Date().toISOString(),
                    });
                    state.activeTrip = null;
                }
            }
        },
        
        /**
         * Action : Annuler la course active
         * Utilisée lors d'une annulation
         */
        cancelActiveTrip: (state) => {
            if (state.activeTrip) {
                state.activeTrip.status = 'cancelled';
                state.tripHistory.unshift({
                    ...state.activeTrip,
                    completedAt: new Date().toISOString(),
                });
                state.activeTrip = null;
            }
        },
        
        /**
         * Action : Définir l'historique des courses
         * Utilisée lors du chargement de l'historique depuis l'API
         * 
         * Payload : Liste complète des courses
         */
        setTripHistory: (state, action: PayloadAction<Trip[]>) => {
            state.tripHistory = action.payload;
        },
        
        /**
         * Action : Ajouter une course à l'historique
         * Utilisée après la complétion d'une course
         * 
         * Payload : Course complétée
         */
        addToHistory: (state, action: PayloadAction<Trip>) => {
            state.tripHistory.unshift(action.payload);
        },
        
        /**
         * Action : Définir l'état de chargement
         * Utilisée pendant les appels API (réservation, annulation, etc.)
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
         * Action : Réinitialiser la mobilité
         * Utilisée lors de la déconnexion
         */
        resetMobility: (state) => {
            state.activeTrip = null;
            state.tripHistory = [];
            state.error = null;
            state.isLoading = false;
        },
    },
});

/**
 * Export des actions pour utilisation dans les composants
 * 
 * Exemple d'utilisation :
 * dispatch(setActiveTrip(tripData));
 * dispatch(updateTripStatus('in_progress'));
 * dispatch(cancelActiveTrip());
 */
export const {
    setActiveTrip,
    updateTripStatus,
    cancelActiveTrip,
    setTripHistory,
    addToHistory,
    setLoading,
    setError,
    resetMobility,
} = mobilitySlice.actions;

/**
 * Export du reducer pour utilisation dans rootReducer
 */
export default mobilitySlice.reducer;