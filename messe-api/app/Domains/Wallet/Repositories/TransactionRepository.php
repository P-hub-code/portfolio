<?php

namespace App\Domains\Wallet\Repositories;

use App\Domains\Wallet\Models\Transaction;
use App\Domains\Wallet\Models\Wallet;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Repository TransactionRepository - Gère l'accès aux données des transactions
 * 
 * Ce repository encapsule toute la logique d'accès à la base de données
 * pour les transactions. Il suit le pattern Repository pour séparer la logique
 * métier (dans WalletService) de l'accès aux données.
 * 
 * Responsabilités :
 * - Création de transactions
 * - Recherche et filtrage de transactions
 * - Mise à jour des statuts
 * - Pagination des résultats
 */
class TransactionRepository
{
    /**
     * Crée une nouvelle transaction dans la base de données
     * 
     * Cette méthode enregistre une nouvelle transaction avec toutes les données
     * fournies. Les données doivent être validées avant l'appel.
     * 
     * Structure attendue de $data :
     * [
     *   'wallet_id' => int,
     *   'type' => 'credit' | 'debit',
     *   'amount' => float,
     *   'status' => 'pending' | 'completed' | 'failed' | 'cancelled',
     *   'reference' => string (unique),
     *   'description' => string|null,
     *   'category' => 'recharge' | 'payment' | 'refund' | 'transfert' | 'bonus' | 'other',
     *   'metadata' => array|null,
     *   'completed_at' => Carbon|null
     * ]
     *
     * @param array $data Les données de la transaction à créer
     * @return Transaction La transaction créée avec son ID
     */
    public function create(array $data): Transaction
    {
        return Transaction::create($data);
    }

    /**
     * Récupère les transactions d'un wallet avec filtres et pagination
     * 
     * Cette méthode permet de récupérer l'historique des transactions d'un wallet
     * avec des filtres optionnels et une pagination pour gérer de gros volumes.
     * 
     * Filtres disponibles :
     * - type : Filtrer par type ('credit' ou 'debit')
     * - status : Filtrer par statut ('pending', 'completed', 'failed', 'cancelled')
     * - category : Filtrer par catégorie ('recharge', 'payment', 'refund', 'transfert', 'bonus', 'other')
     * - date_from : Date de début (format Y-m-d)
     * - date_to : Date de fin (format Y-m-d)
     * 
     * Les résultats sont triés par date de création décroissante (plus récentes en premier).
     * 
     * Exemple d'utilisation :
     * $filters = ['type' => 'debit', 'category' => 'payment'];
     * $transactions = $repository->getByWallet($wallet, $filters, 20);
     *
     * @param Wallet $wallet Le wallet dont on veut récupérer les transactions
     * @param array $filters Tableau associatif des filtres à appliquer
     * @param int $perPage Nombre de transactions par page (défaut: 15)
     * @return LengthAwarePaginator Résultats paginés avec métadonnées de pagination
     */
    public function getByWallet(Wallet $wallet, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        // Base de la requête : toutes les transactions de ce wallet
        $query = Transaction::where('wallet_id', $wallet->id);

        // Application des filtres optionnels
        
        // Filtre par type : credit (entrées) ou debit (sorties)
        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        // Filtre par statut : pending, completed, failed, cancelled
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filtre par catégorie : recharge, payment, refund, transfert, bonus, other
        if (isset($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        // Filtre par date de début : transactions à partir de cette date
        if (isset($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        // Filtre par date de fin : transactions jusqu'à cette date
        if (isset($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        // Tri par date de création décroissante (plus récentes en premier)
        // Pagination avec le nombre d'éléments par page spécifié
        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Trouve une transaction par sa référence unique
     * 
     * La référence est un identifiant unique généré lors de la création
     * de la transaction (format : TXN-{UNIQUE_ID}-{TIMESTAMP}).
     * 
     * Utilisé pour :
     * - Rechercher une transaction spécifique
     * - Vérifier l'existence d'une transaction
     * - Éviter les doublons lors de la création
     * 
     * Exemple d'utilisation :
     * $transaction = $repository->findByReference('TXN-507F1F77B1FCE-1706520000');
     *
     * @param string $reference La référence unique de la transaction
     * @return Transaction|null La transaction trouvée ou null si elle n'existe pas
     */
    public function findByReference(string $reference): ?Transaction
    {
        return Transaction::where('reference', $reference)->first();
    }

    /**
     * Met à jour le statut d'une transaction
     * 
     * Cette méthode permet de changer le statut d'une transaction, notamment
     * pour gérer les transactions asynchrones (ex: paiement en attente).
     * 
     * Si le statut passe à 'completed', la date completed_at est automatiquement
     * remplie avec la date/heure actuelle.
     * 
     * Statuts possibles :
     * - 'pending' : En attente
     * - 'completed' : Complétée (completed_at sera rempli)
     * - 'failed' : Échouée
     * - 'cancelled' : Annulée
     * 
     * Exemple d'utilisation :
     * $repository->updateStatus($transaction, 'completed');
     *
     * @param Transaction $transaction La transaction à mettre à jour
     * @param string $status Le nouveau statut à définir
     * @return bool True si la mise à jour a réussi, false sinon
     */
    public function updateStatus(Transaction $transaction, string $status): bool
    {
        $data = ['status' => $status];
        
        // Si la transaction est complétée, enregistrer la date de finalisation
        if ($status === 'completed') {
            $data['completed_at'] = now();
        }

        return $transaction->update($data);
    }
}

