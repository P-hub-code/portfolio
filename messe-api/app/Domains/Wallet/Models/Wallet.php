<?php

namespace App\Domains\Wallet\Models;

use App\Domains\Identity\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle Wallet - Représente un portefeuille électronique utilisateur
 * 
 * Ce modèle gère les informations d'un wallet (portefeuille électronique) associé à un utilisateur.
 * Chaque utilisateur possède un seul wallet qui stocke son solde et son statut.
 * 
 * Relations :
 * - belongsTo User : Un wallet appartient à un utilisateur (relation 1:1)
 * - hasMany Transaction : Un wallet peut avoir plusieurs transactions
 * 
 * Logique métier :
 * - Le wallet est créé automatiquement lors de la première utilisation
 * - Le solde est en FCFA (Franc CFA)
 * - Le statut peut être : active, suspended, closed
 */
class Wallet extends Model
{
    use HasFactory;

    /**
     * Nom de la table associée au modèle dans la base de données
     *
     * @var string
     */
    protected $table = 'portefeuilles';

    /**
     * Attributs qui peuvent être assignés en masse (mass assignment)
     * 
     * Ces champs peuvent être remplis directement via create() ou update()
     * pour éviter les failles de sécurité (mass assignment protection)
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',    // Identifiant de l'utilisateur propriétaire
        'balance',    // Solde actuel du wallet en FCFA
        'status',     // Statut du wallet (active, suspended, closed)
    ];

    /**
     * Définit les conversions de types pour les attributs du modèle
     * 
     * Permet de convertir automatiquement les valeurs de la base de données
     * vers les types appropriés en PHP
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // Convertit le solde en décimal avec 2 décimales
            // Permet de travailler avec des nombres flottants précis
            'balance' => 'decimal:2',
        ];
    }

    /**
     * Relation Eloquent : Un wallet appartient à un utilisateur
     * 
     * Relation inverse de User -> Wallet (1:1)
     * Permet d'accéder à l'utilisateur propriétaire via $wallet->user
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation Eloquent : Un wallet a plusieurs transactions
     * 
     * Relation 1:N avec le modèle Transaction
     * Permet d'accéder à toutes les transactions du wallet via $wallet->transactions
     *
     * @return HasMany
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Vérifie si le wallet est actif et peut être utilisé
     * 
     * Un wallet actif permet toutes les opérations (recharge, débit, crédit).
     * Un wallet suspendu ou fermé bloque les opérations.
     * 
     * Utilisé dans WalletService pour valider les opérations avant exécution.
     *
     * @return bool True si le wallet est actif, false sinon
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Vérifie si le solde du wallet est suffisant pour un montant donné
     * 
     * Cette méthode est utilisée avant d'effectuer un débit pour s'assurer
     * que l'utilisateur a assez d'argent dans son wallet.
     * 
     * Exemple d'utilisation :
     * if ($wallet->hasSufficientBalance(5000)) {
     *     // Effectuer le débit de 5000 FCFA
     * }
     *
     * @param float $amount Montant à vérifier en FCFA
     * @return bool True si le solde est suffisant, false sinon
     */
    public function hasSufficientBalance(float $amount): bool
    {
        return $this->balance >= $amount;
    }
}

