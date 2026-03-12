/**
 * offline.types.ts
 * ---------------------------------
 * Types TypeScript pour le domaine Offline
 * 
 * RÔLE :
 * - Définir les types du state offline
 * - Gérer la synchronisation avec le backend
 * - Centraliser les types pour une meilleure maintenabilité
 * 
 * NOTE :
 * Ce slice sera implémenté plus tard, lors de l'ajout de la gestion offline.
 * Pour l'instant, on définit juste la structure de base.
 */

/**
 * État de la connexion réseau
 */
export type NetworkStatus = 'online' | 'offline';

/**
 * Action en attente de synchronisation
 */
export interface PendingAction {
    id: string;
    type: string; // Type d'action (ex: 'wallet/recharge', 'mobility/reserve')
    payload: any; // Données de l'action
    timestamp: string; // ISO date string
    retryCount: number; // Nombre de tentatives
}

/**
 * État du slice offline
 */
export interface OfflineState {
    /**
     * Statut de la connexion réseau
     */
    networkStatus: NetworkStatus;
    
    /**
     * Liste des actions en attente de synchronisation
     */
    pendingActions: PendingAction[];
    
    /**
     * Indique si une synchronisation est en cours
     */
    isSyncing: boolean;
}



























