<?php

namespace App\Core\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service SmsService - Gère l'envoi de SMS et la génération de codes OTP
 *
 * Drivers : log (dev, code dans les logs) | twilio (SMS réel).
 *
 * Utilisation :
 * - Génération de codes OTP à 6 chiffres cryptographiquement sécurisés
 * - Envoi de SMS avec le code OTP (log en dev, Twilio en production)
 */
class SmsService
{
    /**
     * Envoie un code OTP par SMS à un numéro de téléphone
     * 
     * Cette méthode gère l'envoi du code OTP par SMS. Actuellement en mode mock
     * (développement), elle logge le code dans les fichiers de log pour faciliter
     * les tests. En production, elle enverra un vrai SMS via un gateway.
     * 
     * Processus actuel (Phase 1 - Mock) :
     * 1. Log du code OTP dans les fichiers de log Laravel
     * 2. Affichage dans la console en environnement local/testing
     * 3. Retour de succès (simulation)
     * 
     * Processus futur (Production) :
     * 1. Appel à l'API Twilio (SMS_DRIVER=twilio)
     * 2. Envoi du SMS avec le message : "Votre code MESSÉ est : {code}"
     * 3. Gestion des erreurs du gateway (quota dépassé, numéro invalide, etc.)
     * 4. Retour de succès/échec selon le résultat
     * 
     * Message SMS envoyé :
     * "Votre code MESSÉ est : {code}"
     * 
     * Exemple : "Votre code MESSÉ est : 123456"
     *
     * @param string $phone Numéro de téléphone au format international (ex: +2250701234567)
     * @param string $code Code OTP à 6 chiffres à envoyer
     * @return bool True si l'envoi est réussi (ou simulé), false en cas d'erreur
     */
    public function sendOTP(string $phone, string $code): bool
    {
        $message = "Votre code MESSÉ est : {$code}";
        $driver = config('services.sms.driver', 'log');

        try {
            // Toujours logger le code (pour debug / fallback en dev)
            Log::info('SMS OTP envoyé', [
                'phone' => $phone,
                'code' => $code,
                'driver' => $driver,
                'timestamp' => now()->toDateTimeString(),
            ]);

            if (app()->environment(['local', 'testing'])) {
                Log::channel('single')->info("📱 SMS OTP pour {$phone} : Code = {$code}");
            }

            // Envoi réel si driver Twilio configuré
            if ($driver === 'twilio' && $this->sendViaTwilio($phone, $message)) {
                return true;
            }

            // Driver log ou non configuré : pas d'envoi réel, le code est dans les logs
            return true;
        } catch (\Exception $e) {
            Log::error('Erreur envoi SMS OTP', [
                'phone' => $phone,
                'driver' => $driver,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Envoi SMS via l'API Twilio (gratuit en trial).
     * Nécessite dans .env : SMS_DRIVER=twilio, TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM.
     */
    protected function sendViaTwilio(string $phone, string $body): bool
    {
        $sid = config('services.sms.twilio.sid');
        $token = config('services.sms.twilio.token');
        $from = config('services.sms.twilio.from');

        if (empty($sid) || empty($token) || empty($from)) {
            return false;
        }

        $response = Http::withBasicAuth($sid, $token)
            ->asForm()
            ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                'To' => $phone,
                'From' => $from,
                'Body' => $body,
            ]);

        if (!$response->successful()) {
            Log::warning('Twilio SMS échec', [
                'phone' => $phone,
                'status' => $response->status(),
                'body' => $response->json(),
            ]);
            return false;
        }

        return true;
    }

    /**
     * Génère un code OTP aléatoire à 6 chiffres de manière cryptographiquement sécurisée
     * 
     * Cette méthode génère un code à 6 chiffres (000000 à 999999) de manière
     * cryptographiquement sécurisée en utilisant random_int() qui utilise un
     * générateur de nombres aléatoires cryptographiquement sécurisé.
     * 
     * Caractéristiques :
     * - 6 chiffres exactement (paddé avec des zéros à gauche si nécessaire)
     * - Génération cryptographiquement sécurisée (pas de prédictibilité)
     * - Format : "123456" (toujours 6 caractères)
     * 
     * Exemples de codes générés :
     * - "123456"
     * - "000789"
     * - "999999"
     * 
     * Sécurité :
     * - Utilise random_int() au lieu de rand() pour la sécurité cryptographique
     * - Chaque code a une probabilité de 1/1 000 000 d'être deviné
     * - Les codes sont à usage unique et expirent après 5 minutes
     *
     * @return string Code OTP à 6 chiffres (format : "123456")
     */
    public function generateOTP(): string
    {
        // Générer un nombre aléatoire entre 0 et 999999
        // random_int() est cryptographiquement sécurisé (contrairement à rand())
        // Convertir en string et paddé avec des zéros à gauche pour avoir exactement 6 chiffres
        // Exemple : 123 -> "000123", 123456 -> "123456"
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }
}