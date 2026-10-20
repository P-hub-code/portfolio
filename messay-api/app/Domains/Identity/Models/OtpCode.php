<?php

namespace App\Domains\Identity\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle OtpCode - Représente un code OTP (One-Time Password) envoyé par SMS
 * 
 * Ce modèle gère les codes OTP à usage unique utilisés pour l'authentification
 * par téléphone. Chaque code est valable pendant 5 minutes et ne peut être utilisé qu'une fois.
 * 
 * Cycle de vie d'un code OTP :
 * 1. Génération : Un code à 6 chiffres est généré aléatoirement
 * 2. Envoi : Le code est envoyé par SMS à l'utilisateur
 * 3. Stockage : Le code est enregistré en base avec expiration (5 minutes)
 * 4. Validation : L'utilisateur saisit le code reçu
 * 5. Vérification : Le code est vérifié (non utilisé, non expiré)
 * 6. Utilisation : Le code est marqué comme utilisé après vérification réussie
 * 
 * Sécurité :
 * - Un seul code valide par téléphone à la fois (anciens codes invalidés)
 * - Expiration automatique après 5 minutes
 * - Code à usage unique (ne peut être utilisé qu'une fois)
 */
class OtpCode extends Model
{
    /**
     * Nom de la table associée au modèle dans la base de données
     *
     * @var string
     */
    protected $table = 'codes_otp';

    /**
     * Attributs qui peuvent être assignés en masse (mass assignment)
     * 
     * Ces champs peuvent être remplis directement via create() ou update()
     * pour éviter les failles de sécurité (mass assignment protection).
     *
     * @var list<string>
     */
    protected $fillable = [
        'phone',        // Numéro de téléphone destinataire (format international +225...)
        'code',         // Code OTP à 6 chiffres (ex: "123456")
        'expires_at',   // Date et heure d'expiration du code (5 minutes après création)
        'used',         // Indique si le code a déjà été utilisé (true/false)
    ];

    /**
     * Définit les conversions de types pour les attributs du modèle
     * 
     * Permet de convertir automatiquement les valeurs de la base de données
     * vers les types appropriés en PHP pour faciliter la manipulation.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // Convertit la date d'expiration en instance Carbon pour manipulation facile
            'expires_at' => 'datetime',
            
            // Convertit le booléen en type PHP bool
            'used' => 'boolean',
        ];
    }

    /**
     * Vérifie si le code OTP est valide (non expiré et non utilisé)
     * 
     * Un code OTP est valide si :
     * - Il n'a pas encore été utilisé (used = false)
     * - Il n'a pas expiré (expires_at est dans le futur)
     * 
     * Utilisé dans AuthController::verifyOTP() pour valider le code saisi par l'utilisateur.
     * 
     * Exemple d'utilisation :
     * if ($otpCode->isValid()) {
     *     // Le code est valide, procéder à l'authentification
     * }
     *
     * @return bool True si le code est valide, false sinon
     */
    public function isValid(): bool
    {
        return !$this->used && $this->expires_at->isFuture();
    }

    /**
     * Marque le code OTP comme utilisé
     * 
     * Cette méthode est appelée après une vérification réussie du code OTP.
     * Une fois marqué comme utilisé, le code ne peut plus être réutilisé,
     * même s'il n'a pas encore expiré.
     * 
     * Utilisé dans AuthController::verifyOTP() après validation du code.
     * 
     * Exemple d'utilisation :
     * if ($otpCode->isValid()) {
     *     $otpCode->markAsUsed(); // Empêche la réutilisation du code
     *     // Procéder à l'authentification
     * }
     *
     * @return bool True si la mise à jour a réussi, false sinon
     */
    public function markAsUsed(): bool
    {
        return $this->update(['used' => true]);
    }

    /**
     * Scope Eloquent : Trouve un code OTP valide pour un téléphone et un code donnés
     * 
     * Ce scope permet de rechercher un code OTP qui :
     * - Correspond au téléphone fourni
     * - Correspond au code fourni
     * - N'a pas encore été utilisé (used = false)
     * - N'a pas encore expiré (expires_at > maintenant)
     * 
     * Utilisé dans AuthController::verifyOTP() pour valider le code saisi.
     * 
     * Exemple d'utilisation :
     * $otpCode = OtpCode::validForPhoneAndCode('+2250701234567', '123456')->first();
     * if ($otpCode) {
     *     // Code valide trouvé
     * }
     *
     * @param \Illuminate\Database\Eloquent\Builder $query Le builder de requête Eloquent
     * @param string $phone Le numéro de téléphone à rechercher
     * @param string $code Le code OTP à rechercher
     * @return \Illuminate\Database\Eloquent\Builder Le builder avec les conditions appliquées
     */
    public function scopeValidForPhoneAndCode($query, string $phone, string $code)
    {
        return $query->where('phone', $phone)              // Correspond au téléphone
            ->where('code', $code)                          // Correspond au code
            ->where('used', false)                         // N'a pas encore été utilisé
            ->where('expires_at', '>', now());              // N'a pas encore expiré
    }

    /**
     * Scope Eloquent : Invalide tous les codes OTP précédents pour un téléphone
     * 
     * Ce scope marque tous les codes OTP non utilisés d'un téléphone comme utilisés.
     * Cela garantit qu'un seul code OTP valide existe à la fois pour un téléphone donné.
     * 
     * Utilisé dans AuthController::generateAndSendOTP() avant de créer un nouveau code,
     * pour invalider les anciens codes et éviter la confusion.
     * 
     * Exemple d'utilisation :
     * OtpCode::invalidatePreviousForPhone('+2250701234567');
     * // Tous les anciens codes pour ce téléphone sont maintenant invalides
     *
     * @param \Illuminate\Database\Eloquent\Builder $query Le builder de requête Eloquent
     * @param string $phone Le numéro de téléphone pour lequel invalider les codes
     * @return \Illuminate\Database\Eloquent\Builder Le builder avec la mise à jour appliquée
     */
    public function scopeInvalidatePreviousForPhone($query, string $phone)
    {
        return $query->where('phone', $phone)              // Pour ce téléphone
            ->where('used', false)                         // Codes non encore utilisés
            ->update(['used' => true]);                    // Les marquer comme utilisés
    }
}









