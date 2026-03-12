/**
 * user.api.ts
 * ---------------------------------
 * Appels API pour les données utilisateur
 * @see README_API_FRONTEND.md
 *
 * GET /api/user  - Charger le profil
 * PUT /api/user  - Mettre à jour le nom (fullName)
 */

import { apiRequest } from './client';

/** Réponse GET /api/user */
export interface UserApiResponse {
    user: {
        id: number;
        fullName: string | null;
        phone: string;
        phoneVerified: boolean;
        role: 'passager' | 'driver';
        status: string;
        verified_at: string | null;
        created_at: string;
        updated_at: string;
    };
}

/** Body PUT /api/user */
export interface UpdateProfileRequest {
    fullName: string;
}

/** Compatibilité interne (firstName/lastName dérivés de fullName) */
export interface UserResponse {
    id: string | number;
    fullName?: string | null;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    phoneNumber?: string;
    [key: string]: unknown;
}

/**
 * Charger le profil utilisateur connecté
 * GET /api/user
 * Header: Authorization: Bearer {token}
 */
export async function getUser(token: string): Promise<UserApiResponse> {
    return apiRequest<UserApiResponse>('/api/user', {
        method: 'GET',
        token,
    });
}

/**
 * Mettre à jour le nom complet
 * PUT /api/user
 * Body: { fullName: string } (requis, max 255 caractères)
 */
export async function updateUserProfile(
    token: string,
    payload: UpdateProfileRequest
): Promise<UserApiResponse> {
    return apiRequest<UserApiResponse>('/api/user', {
        method: 'PUT',
        token,
        body: payload,
    });
}
