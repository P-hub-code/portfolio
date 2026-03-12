<?php

namespace App\Domains\Wallet\Repositories;

use App\Domains\Identity\Models\User;
use App\Domains\Wallet\Models\Wallet;
use Illuminate\Database\Eloquent\Collection;

/**
 * Repository WalletRepository - Gère l'accès aux données des wallets
 * 
 * Ce repository encapsule toute la logique d'accès à la base de données
 * pour les wallets. Il suit le pattern Repository pour séparer la logique
 * métier (dans WalletService) de l'accès aux données.
 * 
 * Responsabilités :
 * - Recherche et création de wallets
 * - Mise à jour des soldes et statuts
 * - Abstraction de la couche d'accès aux données
 */
class WalletRepository
{
    /**
     * Trouve un wallet existant pour un utilisateur ou en crée un nouveau
     * 
     * Cette méthode garantit qu'un utilisateur a toujours un wallet.
     * Si le wallet n'existe pas, il est créé automatiquement avec :
     * - Solde initial à 0.00 FCFA
     * - Statut 'active'
     * 
     * Utilisé dans WalletService::getWallet() pour s'assurer qu'un wallet
     * existe toujours avant d'effectuer des opérations.
     * 
     * Logique :
     * 1. Recherche un wallet avec user_id = $user->id
     * 2. Si trouvé : retourne le wallet existant
     * 3. Si non trouvé : crée un nouveau wallet avec les valeurs par défaut
     *
     * @param User $user L'utilisateur pour lequel trouver/créer le wallet
     * @return Wallet Le wallet trouvé ou créé
     */
    public function findOrCreateForUser(User $user): Wallet
    {
        return Wallet::firstOrCreate(
            // Critères de recherche : wallet avec cet user_id
            ['user_id' => $user->id],
            // Valeurs par défaut si création nécessaire
            [
                'balance' => 0.00,      // Solde initial à zéro
                'status' => 'active',   // Statut actif par défaut
            ]
        );
    }

    /**
     * Récupère le wallet d'un utilisateur s'il existe
     * 
     * Cette méthode recherche simplement un wallet existant sans le créer.
     * Contrairement à findOrCreateForUser(), elle retourne null si le wallet
     * n'existe pas.
     * 
     * Utilisé dans les cas où on veut vérifier l'existence d'un wallet
     * sans le créer automatiquement.
     *
     * @param User $user L'utilisateur dont on cherche le wallet
     * @return Wallet|null Le wallet trouvé ou null s'il n'existe pas
     */
    public function findByUser(User $user): ?Wallet
    {
        return Wallet::where('user_id', $user->id)->first();
    }

    /**
     * Met à jour le solde d'un wallet
     * 
     * Cette méthode met à jour directement le solde du wallet dans la base de données.
     * Elle est utilisée après chaque transaction (recharge, débit, crédit) pour
     * maintenir la cohérence du solde.
     * 
     * Important : Cette méthode ne vérifie pas la validité du montant.
     * La validation doit être faite dans le service (WalletService) avant l'appel.
     * 
     * Exemple d'utilisation :
     * $newBalance = $wallet->balance + $rechargeAmount;
     * $repository->updateBalance($wallet, $newBalance);
     *
     * @param Wallet $wallet Le wallet à mettre à jour
     * @param float $amount Le nouveau solde à définir (en FCFA)
     * @return bool True si la mise à jour a réussi, false sinon
     */
    public function updateBalance(Wallet $wallet, float $amount): bool
    {
        return $wallet->update(['balance' => $amount]);
    }

    /**
     * Met à jour le statut d'un wallet
     * 
     * Cette méthode permet de changer le statut d'un wallet :
     * - 'active' : Wallet actif et utilisable
     * - 'suspended' : Wallet temporairement suspendu
     * - 'closed' : Wallet fermé définitivement
     * 
     * Utilisé pour gérer les blocages administratifs ou les fermetures de compte.
     * 
     * Exemple d'utilisation :
     * $repository->updateStatus($wallet, 'suspended'); // Suspendre le wallet
     *
     * @param Wallet $wallet Le wallet à mettre à jour
     * @param string $status Le nouveau statut ('active', 'suspended', 'closed')
     * @return bool True si la mise à jour a réussi, false sinon
     */
    public function updateStatus(Wallet $wallet, string $status): bool
    {
        return $wallet->update(['status' => $status]);
    }
}

