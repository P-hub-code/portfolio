<?php

namespace App\Domains\Wallet\Services;

use App\Domains\Identity\Models\User;
use App\Domains\Wallet\Models\Transaction;
use App\Domains\Wallet\Models\Wallet;
use App\Domains\Wallet\Repositories\TransactionRepository;
use App\Domains\Wallet\Repositories\WalletRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Service WalletService - Gère toute la logique métier des wallets
 * 
 * Ce service centralise toute la logique métier liée aux wallets et transactions.
 * Il orchestre les repositories pour effectuer les opérations complexes tout en
 * garantissant la cohérence des données (transactions atomiques).
 * 
 * Responsabilités :
 * - Gestion du cycle de vie des wallets (création automatique)
 * - Opérations financières (recharge, débit, crédit)
 * - Validation des règles métier (solde suffisant, wallet actif, etc.)
 * - Gestion des transactions atomiques (rollback en cas d'erreur)
 * - Journalisation des opérations (logs)
 * 
 * Pattern utilisé :
 * - Service Layer : Séparation de la logique métier de la couche présentation
 * - Repository Pattern : Abstraction de l'accès aux données
 * - Transaction Pattern : Garantie de cohérence des données
 */
class WalletService
{
    /**
     * Repository pour l'accès aux données des wallets
     *
     * @var WalletRepository
     */
    protected WalletRepository $walletRepository;
    
    /**
     * Repository pour l'accès aux données des transactions
     *
     * @var TransactionRepository
     */
    protected TransactionRepository $transactionRepository;

    /**
     * Constructeur avec injection de dépendances
     * 
     * Les repositories sont injectés automatiquement par le conteneur
     * d'injection de dépendances de Laravel. Cela permet :
     * - La testabilité (mocks faciles)
     * - La flexibilité (changement d'implémentation sans modifier le service)
     * - Le respect du principe d'inversion de dépendances (SOLID)
     *
     * @param WalletRepository $walletRepository
     * @param TransactionRepository $transactionRepository
     */
    public function __construct(
        WalletRepository $walletRepository,
        TransactionRepository $transactionRepository
    ) {
        $this->walletRepository = $walletRepository;
        $this->transactionRepository = $transactionRepository;
    }

    /**
     * Récupère le wallet d'un utilisateur ou le crée s'il n'existe pas
     * 
     * Cette méthode garantit qu'un utilisateur a toujours un wallet.
     * Si le wallet n'existe pas, il est créé automatiquement avec :
     * - Solde initial à 0.00 FCFA
     * - Statut 'active'
     * 
     * Cette approche "lazy creation" évite de créer des wallets inutiles
     * pour les utilisateurs qui n'utilisent jamais cette fonctionnalité.
     * 
     * Utilisé comme point d'entrée pour toutes les opérations sur wallet.
     *
     * @param User $user L'utilisateur dont on veut récupérer le wallet
     * @return Wallet Le wallet trouvé ou créé
     */
    public function getWallet(User $user): Wallet
    {
        return $this->walletRepository->findOrCreateForUser($user);
    }

    /**
     * Récupère le solde actuel du wallet d'un utilisateur
     * 
     * Cette méthode retourne simplement le solde en FCFA.
     * Si le wallet n'existe pas, il est créé automatiquement avec un solde de 0.
     * 
     * Utilisé pour :
     * - Afficher le solde à l'utilisateur
     * - Vérifier le solde avant une opération
     * - Retourner le nouveau solde après une opération
     *
     * @param User $user L'utilisateur dont on veut connaître le solde
     * @return float Le solde actuel en FCFA
     */
    public function getBalance(User $user): float
    {
        $wallet = $this->getWallet($user);
        return (float) $wallet->balance;
    }

    /**
     * Recharge le wallet d'un utilisateur avec un montant donné
     * 
     * Cette méthode effectue une opération de crédit (entrée d'argent) dans le wallet.
     * Elle est utilisée lorsque l'utilisateur recharge son wallet via :
     * - Mobile Money (Orange Money, MTN Mobile Money, etc.)
     * - Carte bancaire
     * - Virement bancaire
     * 
     * Processus :
     * 1. Validation du montant (doit être > 0)
     * 2. Vérification que le wallet est actif
     * 3. Création de la transaction de type 'credit'
     * 4. Mise à jour du solde du wallet (solde + montant)
     * 5. Journalisation de l'opération
     * 
     * La transaction est effectuée de manière atomique (DB transaction) :
     * - Si une erreur survient, toutes les modifications sont annulées (rollback)
     * - Garantit la cohérence des données (solde = somme des transactions)
     * 
     * Note : Actuellement, la recharge est considérée comme immédiate (status: 'completed').
     * Dans une version future, on pourra gérer des recharges asynchrones (status: 'pending')
     * en attendant la confirmation du gateway de paiement.
     *
     * @param User $user L'utilisateur qui recharge son wallet
     * @param float $amount Le montant à recharger en FCFA (doit être > 0)
     * @param string $paymentMethod La méthode de paiement utilisée (défaut: 'mobile_money')
     * @param array $metadata Métadonnées supplémentaires (ex: transaction_id du gateway)
     * @return Transaction La transaction créée avec toutes ses informations
     * @throws \InvalidArgumentException Si le montant est invalide (<= 0)
     * @throws \Exception Si le wallet est suspendu ou fermé
     * @throws \Exception Si une erreur survient lors de l'opération (rollback automatique)
     */
    public function recharge(User $user, float $amount, string $paymentMethod = 'mobile_money', array $metadata = []): Transaction
    {
        // Validation : le montant doit être strictement positif
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Le montant doit être supérieur à 0');
        }

        // Récupérer ou créer le wallet de l'utilisateur
        $wallet = $this->getWallet($user);

        // Vérification : le wallet doit être actif pour accepter une recharge
        if (!$wallet->isActive()) {
            throw new \Exception('Le wallet est suspendu ou fermé');
        }

        // Début de la transaction atomique
        // Toutes les opérations suivantes seront annulées en cas d'erreur
        DB::beginTransaction();

        try {
            // Étape 1 : Créer l'enregistrement de transaction
            // Cette transaction représente l'opération de recharge
            $transaction = $this->transactionRepository->create([
                'wallet_id' => $wallet->id,
                'type' => 'credit',           // Type crédit = entrée d'argent
                'amount' => $amount,          // Montant rechargé
                'status' => 'completed',       // Statut complété (recharge immédiate)
                'reference' => Transaction::generateReference(), // Référence unique
                'description' => "Rechargement de {$amount} FCFA via {$paymentMethod}",
                'category' => 'recharge',      // Catégorie : recharge
                'metadata' => array_merge($metadata, ['payment_method' => $paymentMethod]),
                'completed_at' => now(),       // Date de finalisation
            ]);

            // Étape 2 : Mettre à jour le solde du wallet
            // Le nouveau solde = ancien solde + montant rechargé
            $newBalance = $wallet->balance + $amount;
            $this->walletRepository->updateBalance($wallet, $newBalance);

            // Valider toutes les modifications (commit)
            // Si on arrive ici, tout s'est bien passé
            DB::commit();

            // Journalisation de l'opération réussie
            // Permet le suivi et le debugging en production
            Log::info('Wallet rechargé', [
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'amount' => $amount,
                'transaction_id' => $transaction->id,
            ]);

            return $transaction;
        } catch (\Exception $e) {
            // En cas d'erreur, annuler toutes les modifications (rollback)
            // Garantit que le wallet et les transactions restent cohérents
            DB::rollBack();
            
            // Journalisation de l'erreur pour debugging
            Log::error('Erreur lors de la recharge du wallet', [
                'user_id' => $user->id,
                'amount' => $amount,
                'error' => $e->getMessage(),
            ]);
            
            // Relancer l'exception pour que le controller puisse la gérer
            throw $e;
        }
    }

    /**
     * Débite (retire) un montant du wallet d'un utilisateur
     * 
     * Cette méthode effectue une opération de débit (sortie d'argent) dans le wallet.
     * Elle est utilisée pour :
     * - Payer un trajet (Mobility)
     * - Payer un événement (Events)
     * - Transférer de l'argent à un autre utilisateur
     * - Toute autre opération nécessitant un paiement
     * 
     * Processus :
     * 1. Validation du montant (doit être > 0)
     * 2. Vérification que le wallet est actif
     * 3. Vérification que le solde est suffisant (règle métier importante)
     * 4. Création de la transaction de type 'debit'
     * 5. Mise à jour du solde du wallet (solde - montant)
     * 6. Journalisation de l'opération
     * 
     * La transaction est effectuée de manière atomique (DB transaction) :
     * - Si une erreur survient, toutes les modifications sont annulées (rollback)
     * - Garantit la cohérence des données (solde = somme des transactions)
     * 
     * Règle métier importante :
     * Le solde doit être suffisant avant d'effectuer le débit. Si ce n'est pas le cas,
     * une exception est levée et l'opération est refusée.
     *
     * @param User $user L'utilisateur dont on débite le wallet
     * @param float $amount Le montant à débiter en FCFA (doit être > 0)
     * @param string $reference La référence unique de la transaction (générée en amont)
     * @param string $description Description de l'opération (défaut: "Débit de X FCFA")
     * @param string $category Catégorie de la transaction (défaut: 'payment')
     * @param array $metadata Métadonnées supplémentaires (ex: trip_id, event_id)
     * @return Transaction La transaction créée avec toutes ses informations
     * @throws \InvalidArgumentException Si le montant est invalide (<= 0)
     * @throws \Exception Si le wallet est suspendu ou fermé
     * @throws \Exception Si le solde est insuffisant
     * @throws \Exception Si une erreur survient lors de l'opération (rollback automatique)
     */
    public function debit(User $user, float $amount, string $reference, string $description = '', string $category = 'payment', array $metadata = []): Transaction
    {
        // Validation : le montant doit être strictement positif
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Le montant doit être supérieur à 0');
        }

        // Récupérer ou créer le wallet de l'utilisateur
        $wallet = $this->getWallet($user);

        // Vérification : le wallet doit être actif pour accepter un débit
        if (!$wallet->isActive()) {
            throw new \Exception('Le wallet est suspendu ou fermé');
        }

        // Règle métier importante : vérifier que le solde est suffisant
        // Cette vérification évite les soldes négatifs
        if (!$wallet->hasSufficientBalance($amount)) {
            throw new \Exception('Solde insuffisant');
        }

        // Début de la transaction atomique
        // Toutes les opérations suivantes seront annulées en cas d'erreur
        DB::beginTransaction();

        try {
            // Étape 1 : Créer l'enregistrement de transaction
            // Cette transaction représente l'opération de débit
            $transaction = $this->transactionRepository->create([
                'wallet_id' => $wallet->id,
                'type' => 'debit',            // Type débit = sortie d'argent
                'amount' => $amount,          // Montant débité
                'status' => 'completed',       // Statut complété (débit immédiat)
                'reference' => $reference,     // Référence unique fournie
                'description' => $description ?: "Débit de {$amount} FCFA",
                'category' => $category,       // Catégorie (payment, transfert, etc.)
                'metadata' => $metadata,       // Métadonnées contextuelles
                'completed_at' => now(),       // Date de finalisation
            ]);

            // Étape 2 : Mettre à jour le solde du wallet
            // Le nouveau solde = ancien solde - montant débité
            $newBalance = $wallet->balance - $amount;
            $this->walletRepository->updateBalance($wallet, $newBalance);

            // Valider toutes les modifications (commit)
            // Si on arrive ici, tout s'est bien passé
            DB::commit();

            // Journalisation de l'opération réussie
            // Permet le suivi et le debugging en production
            Log::info('Wallet débité', [
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'amount' => $amount,
                'transaction_id' => $transaction->id,
            ]);

            return $transaction;
        } catch (\Exception $e) {
            // En cas d'erreur, annuler toutes les modifications (rollback)
            // Garantit que le wallet et les transactions restent cohérents
            DB::rollBack();
            
            // Journalisation de l'erreur pour debugging
            Log::error('Erreur lors du débit du wallet', [
                'user_id' => $user->id,
                'amount' => $amount,
                'error' => $e->getMessage(),
            ]);
            
            // Relancer l'exception pour que le controller puisse la gérer
            throw $e;
        }
    }

    /**
     * Crédite (ajoute) un montant au wallet d'un utilisateur
     * 
     * Cette méthode effectue une opération de crédit (entrée d'argent) dans le wallet.
     * Elle est utilisée pour :
     * - Rembourser un utilisateur (refund)
     * - Créditer un chauffeur après un trajet (payment)
     * - Transférer de l'argent reçu d'un autre utilisateur
     * - Attribuer un bonus ou une promotion
     * 
     * Processus :
     * 1. Validation du montant (doit être > 0)
     * 2. Vérification que le wallet est actif
     * 3. Création de la transaction de type 'credit'
     * 4. Mise à jour du solde du wallet (solde + montant)
     * 5. Journalisation de l'opération
     * 
     * La transaction est effectuée de manière atomique (DB transaction) :
     * - Si une erreur survient, toutes les modifications sont annulées (rollback)
     * - Garantit la cohérence des données (solde = somme des transactions)
     * 
     * Note : Contrairement au débit, le crédit ne nécessite pas de vérification
     * de solde suffisant (on ajoute de l'argent, donc pas de risque de solde négatif).
     *
     * @param User $user L'utilisateur dont on crédite le wallet
     * @param float $amount Le montant à créditer en FCFA (doit être > 0)
     * @param string $reference La référence unique de la transaction (générée en amont)
     * @param string $description Description de l'opération (défaut: "Crédit de X FCFA")
     * @param string $category Catégorie de la transaction (défaut: 'refund')
     * @param array $metadata Métadonnées supplémentaires (ex: original_transaction_id)
     * @return Transaction La transaction créée avec toutes ses informations
     * @throws \InvalidArgumentException Si le montant est invalide (<= 0)
     * @throws \Exception Si le wallet est suspendu ou fermé
     * @throws \Exception Si une erreur survient lors de l'opération (rollback automatique)
     */
    public function credit(User $user, float $amount, string $reference, string $description = '', string $category = 'refund', array $metadata = []): Transaction
    {
        // Validation : le montant doit être strictement positif
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Le montant doit être supérieur à 0');
        }

        // Récupérer ou créer le wallet de l'utilisateur
        $wallet = $this->getWallet($user);

        // Vérification : le wallet doit être actif pour accepter un crédit
        if (!$wallet->isActive()) {
            throw new \Exception('Le wallet est suspendu ou fermé');
        }

        // Début de la transaction atomique
        // Toutes les opérations suivantes seront annulées en cas d'erreur
        DB::beginTransaction();

        try {
            // Étape 1 : Créer l'enregistrement de transaction
            // Cette transaction représente l'opération de crédit
            $transaction = $this->transactionRepository->create([
                'wallet_id' => $wallet->id,
                'type' => 'credit',           // Type crédit = entrée d'argent
                'amount' => $amount,          // Montant crédité
                'status' => 'completed',       // Statut complété (crédit immédiat)
                'reference' => $reference,     // Référence unique fournie
                'description' => $description ?: "Crédit de {$amount} FCFA",
                'category' => $category,       // Catégorie (refund, transfert, bonus, etc.)
                'metadata' => $metadata,      // Métadonnées contextuelles
                'completed_at' => now(),       // Date de finalisation
            ]);

            // Étape 2 : Mettre à jour le solde du wallet
            // Le nouveau solde = ancien solde + montant crédité
            $newBalance = $wallet->balance + $amount;
            $this->walletRepository->updateBalance($wallet, $newBalance);

            // Valider toutes les modifications (commit)
            // Si on arrive ici, tout s'est bien passé
            DB::commit();

            // Journalisation de l'opération réussie
            // Permet le suivi et le debugging en production
            Log::info('Wallet crédité', [
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'amount' => $amount,
                'transaction_id' => $transaction->id,
            ]);

            return $transaction;
        } catch (\Exception $e) {
            // En cas d'erreur, annuler toutes les modifications (rollback)
            // Garantit que le wallet et les transactions restent cohérents
            DB::rollBack();
            
            // Journalisation de l'erreur pour debugging
            Log::error('Erreur lors du crédit du wallet', [
                'user_id' => $user->id,
                'amount' => $amount,
                'error' => $e->getMessage(),
            ]);
            
            // Relancer l'exception pour que le controller puisse la gérer
            throw $e;
        }
    }

    /**
     * Récupère l'historique des transactions d'un utilisateur avec filtres et pagination
     * 
     * Cette méthode permet de consulter toutes les transactions (crédits et débits)
     * effectuées sur le wallet d'un utilisateur, avec la possibilité de filtrer
     * et de paginer les résultats.
     * 
     * Filtres disponibles :
     * - type : 'credit' ou 'debit' pour filtrer par type de transaction
     * - status : 'pending', 'completed', 'failed', 'cancelled' pour filtrer par statut
     * - category : 'recharge', 'payment', 'refund', 'transfert', 'bonus', 'other'
     * - date_from : Date de début au format Y-m-d
     * - date_to : Date de fin au format Y-m-d
     * 
     * Les résultats sont paginés pour gérer de gros volumes de transactions
     * et sont triés par date de création décroissante (plus récentes en premier).
     * 
     * Utilisé pour :
     * - Afficher l'historique des transactions à l'utilisateur
     * - Générer des rapports financiers
     * - Filtrer les transactions par période ou type
     *
     * @param User $user L'utilisateur dont on veut récupérer les transactions
     * @param array $filters Tableau associatif des filtres à appliquer (optionnel)
     * @param int $perPage Nombre de transactions par page (défaut: 15)
     * @return \Illuminate\Pagination\LengthAwarePaginator Résultats paginés avec métadonnées
     */
    public function getTransactions(User $user, array $filters = [], int $perPage = 15): \Illuminate\Pagination\LengthAwarePaginator
    {
        // Récupérer le wallet de l'utilisateur (créé automatiquement si nécessaire)
        $wallet = $this->getWallet($user);
        
        // Déléguer la récupération au repository avec les filtres et la pagination
        return $this->transactionRepository->getByWallet($wallet, $filters, $perPage);
    }
}

