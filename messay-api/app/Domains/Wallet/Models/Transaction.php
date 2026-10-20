<?php

namespace App\Domains\Wallet\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle Transaction - Représente une opération financière sur un wallet
 * 
 * Ce modèle enregistre toutes les transactions (crédits et débits) effectuées
 * sur les wallets. Chaque transaction est traçable via une référence unique.
 * 
 * Relations :
 * - belongsTo Wallet : Une transaction appartient à un wallet
 * 
 * Types de transactions :
 * - credit : Entrée d'argent (recharge, remboursement, bonus, etc.)
 * - debit : Sortie d'argent (paiement, transfertt, etc.)
 * 
 * Statuts possibles :
 * - pending : En attente de traitement
 * - completed : Complétée avec succès
 * - failed : Échouée
 * - cancelled : Annulée
 */
class Transaction extends Model
{
    use HasFactory;

    /**
     * Nom de la table associée au modèle dans la base de données
     *
     * @var string
     */
    protected $table = 'transactions';

    /**
     * Attributs qui peuvent être assignés en masse (mass assignment)
     * 
     * Ces champs peuvent être remplis directement via create() ou update()
     * pour éviter les failles de sécurité (mass assignment protection)
     *
     * @var list<string>
     */
    protected $fillable = [
        'wallet_id',      // Identifiant du wallet concerné
        'type',           // Type de transaction (credit ou debit)
        'amount',         // Montant de la transaction en FCFA
        'status',         // Statut de la transaction (pending, completed, failed, cancelled)
        'reference',      // Référence unique de la transaction
        'description',   // Description textuelle de la transaction
        'category',      // Catégorie (recharge, payment, refund, transfert, bonus, other)
        'metadata',      // Métadonnées JSON supplémentaires
        'completed_at',  // Date et heure de finalisation
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
            // Convertit le montant en décimal avec 2 décimales
            'amount' => 'decimal:2',
            
            // Convertit le champ JSON en tableau PHP associatif
            // Permet de stocker des données structurées (ex: {"trip_id": 123})
            'metadata' => 'array',
            
            // Convertit la date en instance Carbon pour manipulation facile
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Relation Eloquent : Une transaction appartient à un wallet
     * 
     * Relation inverse de Wallet -> Transaction (N:1)
     * Permet d'accéder au wallet concerné via $transaction->wallet
     *
     * @return BelongsTo
     */
    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    /**
     * Vérifie si la transaction est complétée avec succès
     * 
     * Une transaction complétée signifie que l'opération a été finalisée
     * et que le solde du wallet a été mis à jour.
     * 
     * Utilisé pour filtrer les transactions réussies dans les historiques.
     *
     * @return bool True si la transaction est complétée, false sinon
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Vérifie si la transaction est en attente de traitement
     * 
     * Une transaction en attente n'a pas encore été finalisée.
     * Elle peut être complétée, échouée ou annulée ultérieurement.
     * 
     * Utilisé pour gérer les transactions asynchrones (ex: paiement en attente).
     *
     * @return bool True si la transaction est en attente, false sinon
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Génère une référence unique pour une nouvelle transaction
     * 
     * Cette méthode génère un identifiant unique au format :
     * TXN-{UNIQUE_ID}-{TIMESTAMP}
     * 
     * Exemple : TXN-507F1F77B1FCE-1706520000
     * 
     * La référence est utilisée pour :
     * - La traçabilité des transactions
     * - La communication avec l'utilisateur (factures, reçus)
     * - Le suivi dans les systèmes externes (gateways de paiement)
     * 
     * Cette méthode est statique car elle peut être appelée avant la création
     * de l'instance Transaction (ex: pour générer la référence dans le service).
     *
     * @return string Référence unique de la transaction
     */
    public static function generateReference(): string
    {
        // Format : TXN-{ID_UNIQUE}-{TIMESTAMP}
        // TXN = préfixe Transaction
        // uniqid() = génère un identifiant unique basé sur le temps
        // time() = timestamp Unix pour garantir l'unicité
        return 'TXN-' . strtoupper(uniqid()) . '-' . time();
    }
}

