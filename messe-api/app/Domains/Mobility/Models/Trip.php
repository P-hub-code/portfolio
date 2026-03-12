<?php

namespace App\Domains\Mobility\Models;

use App\Domains\Identity\Models\User;
use App\Domains\Mobility\Models\Driver;
use App\Domains\Wallet\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle Trip - Représente un trajet (course) dans l'application MESSÉ
 * 
 * Ce modèle gère toutes les informations relatives à un trajet effectué par un passager.
 * Un trajet lie un passager (user) à un chauffeur (driver) optionnel et suit le cycle
 * de vie complet du trajet depuis sa création jusqu'à son achèvement ou annulation.
 * 
 * Relations :
 * - belongsTo User : Un trajet appartient à un passager (relation N:1)
 * - belongsTo Driver : Un trajet peut être assigné à un chauffeur (relation N:1, nullable)
 * - belongsTo Transaction : Un trajet peut être lié à une transaction wallet (relation N:1, nullable)
 * 
 * Logique métier :
 * - Le trajet est créé avec le statut 'pending' (en attente d'acceptation)
 * - Le prix est calculé automatiquement selon la distance
 * - Le paiement est débité du wallet du passager lors de l'acceptation
 * - Le remboursement est effectué automatiquement en cas d'annulation
 * - Les statuts suivent le cycle : pending → accepted → in_progress → completed
 */
class Trip extends Model
{
    use HasFactory;

    /**
     * Nom de la table associée au modèle dans la base de données
     *
     * @var string
     */
    protected $table = 'trajets';

    /**
     * Attributs qui peuvent être assignés en masse (mass assignment)
     * 
     * Ces champs peuvent être remplis directement via create() ou update()
     * pour éviter les failles de sécurité (mass assignment protection)
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',              // Identifiant du passager
        'driver_id',            // Identifiant du chauffeur (nullable)
        'departure',            // Point de départ (adresse)
        'destination',          // Point d'arrivée (adresse)
        'departure_lat',        // Latitude du point de départ
        'departure_lng',        // Longitude du point de départ
        'destination_lat',      // Latitude du point d'arrivée
        'destination_lng',      // Longitude du point d'arrivée
        'distance',             // Distance estimée en kilomètres
        'estimated_time',       // Temps estimé en minutes
        'price',                // Prix du trajet en FCFA
        'status',               // Statut du trajet (pending, accepted, in_progress, completed, cancelled)
        'payment_status',       // Statut du paiement (pending, paid, refunded)
        'transaction_id',       // Référence vers la transaction wallet
        'cancelled_at',         // Date d'annulation
        'cancelled_by',         // Qui a annulé (user, driver, system)
        'cancellation_reason',  // Raison de l'annulation
        'started_at',           // Date de début du trajet
        'completed_at',         // Date de fin du trajet
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
            // Convertit les coordonnées GPS en décimal
            'departure_lat' => 'decimal:8',
            'departure_lng' => 'decimal:8',
            'destination_lat' => 'decimal:8',
            'destination_lng' => 'decimal:8',
            
            // Convertit la distance en décimal
            'distance' => 'decimal:2',
            
            // Convertit le prix en décimal
            'price' => 'decimal:2',
            
            // Convertit les timestamps en instances Carbon
            'cancelled_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Relation Eloquent : Un trajet appartient à un passager (utilisateur)
     * 
     * Relation N:1 avec le modèle User
     * Permet d'accéder au passager via $trip->user
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation Eloquent : Un trajet peut être assigné à un chauffeur
     * 
     * Relation N:1 avec le modèle Driver (nullable)
     * Permet d'accéder au chauffeur via $trip->driver
     *
     * @return BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    /**
     * Relation Eloquent : Un trajet peut être lié à une transaction wallet
     * 
     * Relation N:1 avec le modèle Transaction (nullable)
     * Permet d'accéder à la transaction de paiement via $trip->transaction
     *
     * @return BelongsTo
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Vérifie si le trajet est en attente (pending)
     * 
     * @return bool
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Vérifie si le trajet est accepté par un chauffeur
     * 
     * @return bool
     */
    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    /**
     * Vérifie si le trajet est en cours
     * 
     * @return bool
     */
    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }

    /**
     * Vérifie si le trajet est terminé
     * 
     * @return bool
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Vérifie si le trajet est annulé
     * 
     * @return bool
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Vérifie si le trajet est payé
     * 
     * @return bool
     */
    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    /**
     * Vérifie si le trajet peut être annulé
     * 
     * Un trajet peut être annulé s'il n'est pas déjà terminé ou annulé
     * 
     * @return bool
     */
    public function canBeCancelled(): bool
    {
        return !$this->isCompleted() && !$this->isCancelled();
    }
}

