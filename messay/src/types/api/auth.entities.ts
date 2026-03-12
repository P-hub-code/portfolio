/**
 * auth.entities.ts
 * ---------------------------------
 * Entités et contrats d'API pour le domaine Auth / OTP.
 *
 * Ces types servent de référence pour le backend :
 * - structure des utilisateurs
 * - structure des OTP
 * - payloads des endpoints d'authentification.
 */

export interface UserEntity {
    id: string;
    phoneNumber: string; // Format : +225XXXXXXXXXX
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
}

export type OTPStatus = 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'USED';

export interface OTPEntity {
    id: string;
    phoneNumber: string;
    code: string; // 6 chiffres
    type: 'SMS' | 'WHATSAPP';
    status: OTPStatus;
    expiresAt: string;
    verifiedAt?: string;
    attempts: number;
    maxAttempts: number;
    createdAt: string;
}

export interface RequestOTPRequest {
    phoneNumber: string;
    method?: 'SMS' | 'WHATSAPP';
}

export interface RequestOTPResponse {
    success: boolean;
    message: string;
    otpId?: string;
    expiresIn: number;
    /**
     * En mode développement seulement, le backend peut renvoyer le code
     * directement pour faciliter les tests (jamais en production).
     */
    code?: string;
}

export interface VerifyOTPRequest {
    phoneNumber: string;
    code: string;
    otpId?: string;
}

export interface VerifyOTPResponse {
    success: boolean;
    message: string;
    isValid: boolean;
    token?: string;
    requiresRegistration?: boolean;
    user?: UserEntity;
}

export interface RegisterRequest {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email?: string;
    otpId: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    token: string;
    user: UserEntity;
}

export interface AuthErrorResponse {
    success: false;
    error: string;
    code?: string;
    details?: unknown;
}


