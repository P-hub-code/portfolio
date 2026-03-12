/**
 * user.types.ts
 * ---------------------------------
 * Types TypeScript pour le domaine Utilisateur.
 *
 * Rôle :
 * - Définir les types des données utilisateur
 * - Centraliser les types pour une meilleure maintenabilité
 */

/**
 * Données utilisateur complètes
 */
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * État du slice user
 */
export interface UserState {
    /**
     * Données de l'utilisateur connecté
     * null si aucun utilisateur connecté
     */
    currentUser: User | null;

    /**
     * Indique si les données utilisateur sont en cours de chargement
     */
    isLoading: boolean;

    /**
     * Message d'erreur en cas d'échec
     */
    error: string | null;
}



