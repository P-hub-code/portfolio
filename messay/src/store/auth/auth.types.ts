/**
 * auth.types.ts
 * ---------------------------------
 * Types TypeScript pour le domaine Authentification
 * 
 * RÔLE :
 * - Définir les types du state auth
 * - Définir les types des actions/payloads
 * - Centraliser les types pour une meilleure maintenabilité
 */

/**
 * État de l'authentification
 */
export interface AuthState {
    /**
     * Token d'authentification JWT
     * null si l'utilisateur n'est pas connecté
     */
    token: string | null;
    
    /**
     * Indique si l'utilisateur est authentifié
     */
    isAuthenticated: boolean;
    
    /**
     * Indique si une requête d'authentification est en cours
     */
    isLoading: boolean;
    
    /**
     * Message d'erreur en cas d'échec d'authentification
     */
    error: string | null;
}

/**
 * Données de connexion
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Réponse de l'API après connexion (verify-otp)
 */
export interface LoginResponse {
    token: string;
    user: {
        id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
    };
}









