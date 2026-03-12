/**
 * mobility.types.ts
 * ---------------------------------
 * Types TypeScript pour le domaine Mobilité
 * 
 * RÔLE :
 * - Définir les types du state mobility
 * - Définir les types des courses/trips
 * - Centraliser les types pour une meilleure maintenabilité
 */

/**
 * Statut d'une course
 */
export type TripStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Course active
 */
export interface Trip {
    id: string;
    driverId: string;
    driverName: string;
    departure: string; // Point de départ
    destination: string; // Destination
    estimatedTime: string; // Ex: "18 min"
    distance: string; // Ex: "6.5 km"
    price: number; // Prix en francs CFA
    status: TripStatus;
    createdAt: string; // ISO date string
    startedAt?: string; // ISO date string
    completedAt?: string; // ISO date string
}

/**
 * État du slice mobility
 */
export interface MobilityState {
    /**
     * Course active (en cours ou en attente)
     * null si aucune course active
     */
    activeTrip: Trip | null;
    
    /**
     * Historique des courses
     */
    tripHistory: Trip[];
    
    /**
     * Indique si une opération est en cours (réservation, annulation, etc.)
     */
    isLoading: boolean;
    
    /**
     * Message d'erreur en cas d'échec
     */
    error: string | null;
}



























