/**
 * auth.api.ts
 * ---------------------------------
 * Appels API pour l'authentification Messay
 * @see README_API_FRONTEND.md
 */

import { apiRequest } from './client';

const AUTH_PATH = '/api/auth';

/** Réponse générique de succès */
export interface ApiSuccessResponse {
    success?: boolean;
    message?: string;
}

/** Réponse login/register (envoi OTP) */
export interface SendOtpResponse {
    success?: boolean;
    message?: string;
    [key: string]: unknown;
}

/** Réponse verify-otp */
export interface VerifyOtpResponse {
    success?: boolean;
    token?: string;
    user?: {
        id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        [key: string]: unknown;
    };
    requiresRegistration?: boolean;
    [key: string]: unknown;
}

/**
 * Inscription → envoie OTP par SMS
 * Backend (table codes_otp) attend la clé "phone", pas "phoneNumber"
 */
export async function register(phoneNumber: string): Promise<SendOtpResponse> {
    return apiRequest<SendOtpResponse>(`${AUTH_PATH}/register`, {
        method: 'POST',
        body: { phone: phoneNumber },
    });
}

/**
 * Connexion → envoie OTP par SMS
 * Backend attend "phone"
 */
export async function login(phoneNumber: string): Promise<SendOtpResponse> {
    return apiRequest<SendOtpResponse>(`${AUTH_PATH}/login`, {
        method: 'POST',
        body: { phone: phoneNumber },
    });
}

/**
 * Vérification OTP → renvoie le token
 * Backend attend "phone" pour correspondre à la table codes_otp
 */
export async function verifyOtp(
    phoneNumber: string,
    code: string
): Promise<VerifyOtpResponse> {
    return apiRequest<VerifyOtpResponse>(`${AUTH_PATH}/verify-otp`, {
        method: 'POST',
        body: { phone: phoneNumber, code },
    });
}

/**
 * Renvoi du code OTP
 * Backend attend "phone"
 */
export async function resendOtp(
    phoneNumber: string
): Promise<SendOtpResponse> {
    return apiRequest<SendOtpResponse>(`${AUTH_PATH}/resend-otp`, {
        method: 'POST',
        body: { phone: phoneNumber },
    });
}

/**
 * Déconnexion (requiert le token)
 */
export async function logout(token: string): Promise<ApiSuccessResponse> {
    return apiRequest<ApiSuccessResponse>(`${AUTH_PATH}/logout`, {
        method: 'POST',
        token,
    });
}
