/**
 * mobility.thunks.example.ts
 * ---------------------------------
 * EXEMPLE de thunks pour la mobilité
 * 
 * ⚠️ CE FICHIER EST UN EXEMPLE - À COPIER/ADAPTER QUAND L'API SERA PRÊTE
 * 
 * RÔLE :
 * - Définir les actions async (thunks) pour les opérations mobilité
 * - Appeler l'API backend
 * - Gérer les états de chargement et les erreurs
 * 
 * UTILISATION :
 * 1. Quand l'API sera prête, créer `mobility.thunks.ts` basé sur cet exemple
 * 2. Remplacer les appels API mockés par les vrais appels
 * 3. Importer et utiliser dans les composants
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { Trip, TripStatus } from './mobility.types';

/**
 * Types pour les payloads des thunks
 */
interface ReserveTripPayload {
    driverId: string;
    departure: string;
    destination: string;
    price: number;
    estimatedTime: string;
    distance: string;
}

interface UpdateTripStatusPayload {
    tripId: string;
    status: TripStatus;
}

/**
 * Thunk : Réserver une course
 * 
 * FLUX :
 * 1. Dispatch pending → isLoading = true
 * 2. Appel API POST /trips
 * 3. Si succès → Dispatch fulfilled → setActiveTrip avec les données de l'API
 * 4. Si erreur → Dispatch rejected → setError
 * 
 * UTILISATION DANS UN COMPOSANT :
 * dispatch(reserveTripThunk({
 *   driverId: 'driver-123',
 *   departure: 'Plateau',
 *   destination: 'Cocody',
 *   price: 2500,
 *   estimatedTime: '18 min',
 *   distance: '6.5 km',
 * }));
 */
export const reserveTripThunk = createAsyncThunk(
    /**
     * Nom de l'action (utilisé dans extraReducers)
     * Format : 'slice/actionName'
     */
    'mobility/reserveTrip',
    
    /**
     * Fonction async qui appelle l'API
     * 
     * @param payload - Données de la réservation
     * @param thunkAPI - API Redux Toolkit (dispatch, getState, rejectWithValue, etc.)
     */
    async (payload: ReserveTripPayload, { rejectWithValue }) => {
        try {
            /**
             * TODO : Remplacer par le vrai appel API
             * 
             * Exemple avec axios :
             * const response = await api.post('/trips', payload);
             * return response.data;
             * 
             * Exemple avec fetch :
             * const response = await fetch('/api/trips', {
             *   method: 'POST',
             *   headers: { 'Content-Type': 'application/json' },
             *   body: JSON.stringify(payload),
             * });
             * const data = await response.json();
             * return data;
             */
            
            // SIMULATION : Appel API (à remplacer)
            await new Promise<void>(resolve => {
                setTimeout(() => resolve(), 1000);
            }); // Simule un délai réseau
            
            // SIMULATION : Réponse de l'API (à remplacer)
            const mockResponse = {
                trip: {
                    id: `trip-${Date.now()}`, // ID généré par le backend
                    driverId: payload.driverId,
                    driverName: 'Kouamé Yves', // Vient du backend
                    departure: payload.departure,
                    destination: payload.destination,
                    estimatedTime: payload.estimatedTime,
                    distance: payload.distance,
                    price: payload.price,
                    status: 'pending' as TripStatus,
                    createdAt: new Date().toISOString(),
                },
                // Le backend peut aussi retourner le nouveau solde
                walletBalance: 1000, // Solde après débit
            };
            
            return mockResponse;
        } catch (error: any) {
            /**
             * Gestion des erreurs
             * 
             * rejectWithValue permet de passer des données d'erreur personnalisées
             * qui seront disponibles dans action.payload du cas rejected
             */
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Erreur lors de la réservation de la course'
            );
        }
    }
);

/**
 * Thunk : Annuler une course
 * 
 * FLUX :
 * 1. Dispatch pending → isLoading = true
 * 2. Appel API DELETE /trips/:id
 * 3. Si succès → Dispatch fulfilled → cancelActiveTrip
 * 4. Si erreur → Dispatch rejected → setError
 */
export const cancelTripThunk = createAsyncThunk(
    'mobility/cancelTrip',
    async (tripId: string, { rejectWithValue }) => {
        try {
            // TODO : Remplacer par le vrai appel API
            // await api.delete(`/trips/${tripId}`);
            
            await new Promise<void>(resolve => {
                setTimeout(() => resolve(), 500);
            });
            
            return { tripId };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Erreur lors de l\'annulation de la course'
            );
        }
    }
);

/**
 * Thunk : Mettre à jour le statut d'une course
 * 
 * Utilisé quand le statut change (pending → accepted → in_progress → completed)
 */
export const updateTripStatusThunk = createAsyncThunk(
    'mobility/updateTripStatus',
    async (payload: UpdateTripStatusPayload, { rejectWithValue }) => {
        try {
            // TODO : Remplacer par le vrai appel API
            // await api.patch(`/trips/${payload.tripId}/status`, { status: payload.status });
            
            await new Promise<void>(resolve => {
                setTimeout(() => resolve(), 500);
            });
            
            return payload;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Erreur lors de la mise à jour du statut'
            );
        }
    }
);

/**
 * Thunk : Charger la course active
 * 
 * Utilisé au démarrage de l'app pour vérifier s'il y a une course en cours
 */
export const fetchActiveTripThunk = createAsyncThunk(
    'mobility/fetchActiveTrip',
    async (_, { rejectWithValue }) => {
        try {
            // TODO : Remplacer par le vrai appel API
            // const response = await api.get('/trips/active');
            // return response.data;
            
            await new Promise<void>(resolve => {
                setTimeout(() => resolve(), 500);
            });
            
            // SIMULATION : Pas de course active
            return null;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Erreur lors du chargement de la course active'
            );
        }
    }
);

/**
 * Thunk : Charger l'historique des courses
 */
export const fetchTripHistoryThunk = createAsyncThunk(
    'mobility/fetchTripHistory',
    async (_, { rejectWithValue }) => {
        try {
            // TODO : Remplacer par le vrai appel API
            // const response = await api.get('/trips/history');
            // return response.data;
            
            await new Promise<void>(resolve => {
                setTimeout(() => resolve(), 500);
            });
            
            // SIMULATION : Historique vide
            return [];
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Erreur lors du chargement de l\'historique'
            );
        }
    }
);

