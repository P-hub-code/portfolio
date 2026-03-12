/**
 * firebase-phone-auth.ts
 * ---------------------------------
 * Service Firebase Phone Auth pour l'envoi et la vérification des codes OTP par SMS.
 * Firebase envoie le SMS directement (numéros réels ou numéros de test configurés en console).
 */

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

let pendingConfirmation: FirebaseAuthTypes.ConfirmationResult | null = null;

/**
 * Envoie un code OTP par SMS au numéro donné (Firebase envoie réellement le SMS).
 * Stocke la confirmation pour vérification ultérieure.
 */
export async function sendPhoneOtp(
    phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    pendingConfirmation = confirmation;
    return confirmation;
}

/**
 * Récupère la confirmation en attente (après navigation vers OTPVerificationScreen).
 */
export function getPendingConfirmation(): FirebaseAuthTypes.ConfirmationResult | null {
    return pendingConfirmation;
}

/**
 * Efface la confirmation en attente.
 */
export function clearPendingConfirmation(): void {
    pendingConfirmation = null;
}

/**
 * Vérifie le code OTP saisi par l'utilisateur.
 * Retourne les credentials Firebase en cas de succès.
 */
export async function verifyPhoneOtp(
    code: string
): Promise<FirebaseAuthTypes.UserCredential> {
    const confirmation = getPendingConfirmation();
    if (!confirmation) {
        throw new Error('Aucune demande OTP en cours. Retournez à l\'écran précédent.');
    }
    const credential = await confirmation.confirm(code);
    clearPendingConfirmation();
    if (!credential) {
        throw new Error('Vérification échouée. Veuillez réessayer.');
    }
    return credential;
}

/**
 * Renvoie un nouveau code OTP par SMS (réenvoi).
 */
export async function resendPhoneOtp(
    phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> {
    return sendPhoneOtp(phoneNumber);
}
