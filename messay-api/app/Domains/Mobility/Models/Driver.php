<?php

namespace App\Domains\Mobility\Models;

use App\Domains\Identity\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle Driver - Représente un profil chauffeur dans l'application MESSÉ
 * 
 * Ce modèle gère les informations spécifiques aux chauffeurs (conducteurs de tricycles).
 * Chaque chauffeur est lié à un utilisateur (relation 1:1) et peut effectuer plusieurs trajets.
 * 
 * Relations :
 * - belongsTo User : Un chauffeur appartient à un utilisateur (relation 1:1)
 * - hasMany Trip : Un chauffeur peut effectuer plusieurs trajets (relation 1:N)
 * 
 * Logique métier :
 * - Le profil chauffeur est créé lorsqu'un utilisateur devient chauffeur
 * - La disponibilité (is_available) détermine si le chauffeur peut accepter des trajets
 * - La note (rating) est calculée automatiquement à partir des évaluations
 * - Le statut peut être : active, suspended, inactive
 */
class Driver extends Model
{
    use HasFactory;

    /**
     * Nom de la table associée au modèle dans la base de données
     *
     * @var string
     */
    protected $table = 'chauffeurs';

    /**
     * Attributs qui peuvent être assignés en masse (mass assignment)
     * 
     * Ces champs peuvent être remplis directement via create() ou update()
     * pour éviter les failles de sécurité (mass assignment protection)
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',         // Identifiant de l'utilisateur propriétaire
        'license_number',  // Numéro de permis de conduire
        'vehicle_type',    // Type de véhicule (tricycle par défaut)
        'vehicle_plate',   // Numéro de plaque d'immatriculation
        'vehicle_model',   // Modèle du véhicule
        'vehicle_color',   // Couleur du véhicule
        'is_available',    // Disponibilité du chauffeur
        'rating',          // Note moyenne du chauffeur (sur 5 étoiles)
        'total_trips',     // Nombre total de trajets effectués
        'status',          // Statut du profil (active, suspended, inactive)
    ];

    /**
     * Définit les conversions de types pour les attributs du modèle
     * 
     * Permet de convertir automatiquement les valeurs de la base de données
     * vers les types appropriés en PHP pour faciliter la manipulation
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // Convertit la disponibilité en booléen
            'is_available' => 'boolean',
            
            // Convertit la note en décimal avec 2 décimales
            'rating' => 'decimal:2',
        ];
    }

    /**
     * Relation Eloquent : Un chauffeur appartient à un utilisateur
     * 
     * Relation inverse de User -> Driver (1:1)
     * Permet d'accéder à l'utilisateur propriétaire via $driver->user
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation Eloquent : Un chauffeur peut effectuer plusieurs trajets
     * 
     * Relation 1:N avec le modèle Trip
     * Permet d'accéder à tous les trajets du chauffeur via $driver->trips
     *
     * @return HasMany
     */
    public function trips(): HasMany
    {
        return $this->hasMany(Trip::class);
    }

    /**
     * Vérifie si le chauffeur est actif
     * 
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Vérifie si le chauffeur est disponible pour accepter des trajets
     * 
     * Un chauffeur est disponible s'il est actif ET que is_available = true
     * 
     * @return bool
     */
    public function isAvailable(): bool
    {
        return $this->isActive() && $this->is_available;
    }

    /**
     * Vérifie si le chauffeur est suspendu
     * 
     * @return bool
     */
    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }

    /**
     * Récupère les trajets actifs du chauffeur
     * 
     * Un trajet actif est un trajet qui n'est pas terminé ou annulé
     * 
     * @return HasMany
     */
    public function activeTrips(): HasMany
    {
        return $this->trips()
            ->whereIn('status', ['pending', 'accepted', 'in_progress']);
    }
}

