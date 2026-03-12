/**
 * mobility.slice.EXAMPLE_WITH_THUNKS.ts
 * ---------------------------------
 * EXEMPLE de slice modifié pour gérer les thunks
 * 
 * ⚠️ CE FICHIER EST UN EXEMPLE - À COPIER/ADAPTER DANS mobility.slice.ts QUAND L'API SERA PRÊTE
 * 
 * DIFFÉRENCES AVEC LA VERSION ACTUELLE :
 * - Ajout de `extraReducers` pour gérer les états des thunks (pending, fulfilled, rejected)
 * - Les actions synchrones (setActiveTrip, etc.) sont toujours présentes
 *   car elles seront appelées par les thunks dans extraReducers
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MobilityState, Trip, TripStatus } from './mobility.types';

/**
 * Import des thunks (à créer dans mobility.thunks.ts)
 */
import {
    reserveTripThunk,
    cancelTripThunk,
    updateTripStatusThunk,
    fetchActiveTripThunk,
    fetchTripHistoryThunk,
} from './mobility.thunks';

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
 * 
 * MODIFICATIONS POUR LES THUNKS :
 * - Ajout de `extraReducers` pour gérer les états async
 * - Les `reducers` (actions synchrones) sont gardés pour usage interne
 */
const mobilitySlice = createSlice({
    name: 'mobility',
    initialState,
    reducers: {
        /**
         * Actions synchrones (gardées pour usage interne ou optimistic updates)
         * 
         * NOTE : Ces actions seront principalement appelées par les thunks
         * dans extraReducers, mais peuvent aussi être utilisées directement
         * pour des mises à jour optimistes (UX améliorée).
         */
        setActiveTrip: (state, action: PayloadAction<Trip>) => {
            state.activeTrip = action.payload;
            state.error = null;
        },
        
        updateTripStatus: (state, action: PayloadAction<TripStatus>) => {
            if (state.activeTrip) {
                state.activeTrip.status = action.payload;
                
                if (action.payload === 'completed' && state.activeTrip) {
                    state.tripHistory.unshift({
                        ...state.activeTrip,
                        completedAt: new Date().toISOString(),
                    });
                    state.activeTrip = null;
                }
            }
        },
        
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
        
        setTripHistory: (state, action: PayloadAction<Trip[]>) => {
            state.tripHistory = action.payload;
        },
        
        addToHistory: (state, action: PayloadAction<Trip>) => {
            state.tripHistory.unshift(action.payload);
        },
        
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        
        resetMobility: (state) => {
            state.activeTrip = null;
            state.tripHistory = [];
            state.error = null;
            state.isLoading = false;
        },
    },
    
    /**
     * extraReducers : Gère les états des thunks (actions async)
     * 
     * Chaque thunk génère 3 actions automatiquement :
     * - pending : Début de l'opération async
     * - fulfilled : Succès (avec les données retournées)
     * - rejected : Erreur (avec le message d'erreur)
     */
    extraReducers: (builder) => {
        /**
         * Thunk : reserveTripThunk
         * 
         * FLUX :
         * 1. pending → isLoading = true, error = null
         * 2. fulfilled → setActiveTrip avec les données de l'API, isLoading = false
         * 3. rejected → setError avec le message, isLoading = false
         */
        builder
            .addCase(reserveTripThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(reserveTripThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                // Les données viennent de l'API (garanties valides)
                state.activeTrip = action.payload.trip;
                
                // Si l'API retourne aussi le nouveau solde, on peut le mettre à jour
                // (nécessite d'importer et dispatcher une action wallet depuis le thunk)
            })
            .addCase(reserveTripThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || 'Erreur lors de la réservation';
            });
        
        /**
         * Thunk : cancelTripThunk
         */
        builder
            .addCase(cancelTripThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(cancelTripThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                // Annuler la course active
                if (state.activeTrip && state.activeTrip.id === action.payload.tripId) {
                    state.activeTrip.status = 'cancelled';
                    state.tripHistory.unshift({
                        ...state.activeTrip,
                        completedAt: new Date().toISOString(),
                    });
                    state.activeTrip = null;
                }
            })
            .addCase(cancelTripThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || 'Erreur lors de l\'annulation';
            });
        
        /**
         * Thunk : updateTripStatusThunk
         */
        builder
            .addCase(updateTripStatusThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTripStatusThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                // Mettre à jour le statut de la course active
                if (state.activeTrip && state.activeTrip.id === action.payload.tripId) {
                    state.activeTrip.status = action.payload.status;
                    
                    // Si complétée, déplacer vers l'historique
                    if (action.payload.status === 'completed') {
                        state.tripHistory.unshift({
                            ...state.activeTrip,
                            completedAt: new Date().toISOString(),
                        });
                        state.activeTrip = null;
                    }
                }
            })
            .addCase(updateTripStatusThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || 'Erreur lors de la mise à jour';
            });
        
        /**
         * Thunk : fetchActiveTripThunk
         */
        builder
            .addCase(fetchActiveTripThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchActiveTripThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                // action.payload peut être null (pas de course active) ou un Trip
                state.activeTrip = action.payload;
            })
            .addCase(fetchActiveTripThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || 'Erreur lors du chargement';
            });
        
        /**
         * Thunk : fetchTripHistoryThunk
         */
        builder
            .addCase(fetchTripHistoryThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTripHistoryThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tripHistory = action.payload;
            })
            .addCase(fetchTripHistoryThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || 'Erreur lors du chargement';
            });
    },
});

/**
 * Export des actions synchrones (toujours disponibles)
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
 * Export du reducer
 */
export default mobilitySlice.reducer;



























