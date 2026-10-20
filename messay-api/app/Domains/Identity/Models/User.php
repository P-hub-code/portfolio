<?php

namespace App\Domains\Identity\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Modèle User - Représente un utilisateur de l'application MESSÉ
 * 
 * Ce modèle gère les informations des utilisateurs (passagers et chauffeurs).
 * L'authentification se fait uniquement par téléphone + OTP (pas de mot de passe requis).
 * 
 * Caractéristiques principales :
 * - Identifiant principal : téléphone (format international Côte d'Ivoire +225...)
 * - Authentification : OTP par SMS (One-Time Password)
 * - Rôles : passager (par défaut) ou driver (chauffeur)
 * - Statuts : active, blocked, suspended
 * - Vérification : is_verified indique si le téléphone a été vérifié via OTP
 * 
 * Sécurité :
 * - Politique 1 appareil actif : un seul token Sanctum valide à la fois
 * - Tokens révoqués automatiquement lors d'une nouvelle connexion
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Attributs qui peuvent être assignés en masse (mass assignment)
     * 
     * Ces champs peuvent être remplis directement via create() ou update()
     * pour éviter les failles de sécurité (mass assignment protection).
     * 
     * Note : email et password ne sont pas dans fillable car ils ne sont plus
     * utilisés dans le flux d'authentification OTP-only.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',    // Prénom de l'utilisateur (peut être null lors de l'inscription)
        'last_name',     // Nom de famille de l'utilisateur (peut être null lors de l'inscription)
        'telephone',     // Numéro de téléphone (identifiant principal, format +225...)
        'role',          // Rôle : 'passager' (défaut) ou 'driver' (chauffeur)
        'status',        // Statut : 'active' (défaut), 'blocked', 'suspended'
        'is_verified',   // Indique si le téléphone a été vérifié via OTP
        'verified_at',   // Date et heure de la vérification du téléphone
    ];

    /**
     * Attributs qui doivent être cachés lors de la sérialisation JSON
     * 
     * Ces champs ne sont jamais retournés dans les réponses API pour des
     * raisons de sécurité et de confidentialité.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',        // Mot de passe (non utilisé dans le flux OTP, mais présent en DB)
        'remember_token',  // Token de "se souvenir de moi" (non utilisé en API)
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
            // Convertit les timestamps en instances Carbon pour manipulation facile
            'email_verified_at' => 'datetime',  // Date de vérification email (legacy, non utilisé)
            'verified_at' => 'datetime',         // Date de vérification téléphone via OTP
            
            // Hashage automatique du mot de passe (si jamais utilisé)
            'password' => 'hashed',
            
            // Convertit le booléen en type PHP bool
            'is_verified' => 'boolean',
        ];
    }

    /**
     * Relation Eloquent : Un utilisateur peut avoir plusieurs trajets (en tant que passager)
     * 
     * Relation 1:N avec le modèle Trip
     * Permet d'accéder à tous les trajets de l'utilisateur via $user->trips
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function trips(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Domains\Mobility\Models\Trip::class);
    }

    /**
     * Relation Eloquent : Un utilisateur peut avoir un profil chauffeur (optionnel)
     * 
     * Relation 1:1 avec le modèle Driver
     * Permet d'accéder au profil chauffeur via $user->driver
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function driver(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(\App\Domains\Mobility\Models\Driver::class);
    }

    /**
     * Vérifie si l'utilisateur est un chauffeur
     * 
     * @return bool
     */
    public function isDriver(): bool
    {
        return $this->role === 'driver';
    }
}

