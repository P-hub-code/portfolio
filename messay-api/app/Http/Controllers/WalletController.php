<?php

namespace App\Http\Controllers;

use App\Domains\Identity\Models\User;
use App\Domains\Wallet\Services\WalletService;
use App\Http\Requests\RechargeWalletRequest;
use App\Http\Requests\TransferWalletRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller WalletController - Gère les requêtes HTTP liées aux wallets
 * 
 * Ce controller expose les endpoints API pour toutes les opérations sur les wallets.
 * Il fait le lien entre les requêtes HTTP et la logique métier (WalletService).
 * 
 * Tous les endpoints nécessitent une authentification (middleware auth:sanctum).
 * 
 * Endpoints disponibles :
 * - GET /api/wallet : Récupérer le solde
 * - POST /api/wallet/recharge : Recharger le wallet
 * - GET /api/wallet/transactions : Historique des transactions
 * - POST /api/wallet/transfert : Transférer de l'argent
 */
class WalletController extends Controller
{
    /**
     * Service contenant toute la logique métier des wallets
     *
     * @var WalletService
     */
    protected WalletService $walletService;

    /**
     * Constructeur avec injection de dépendances
     * 
     * Le WalletService est injecté automatiquement par Laravel.
     * Cela permet la testabilité et le respect du principe d'inversion de dépendances.
     *
     * @param WalletService $walletService
     */
    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * Récupère le solde et les informations du wallet de l'utilisateur connecté
     * 
     * Endpoint : GET /api/wallet
     * 
     * Cette méthode retourne les informations du wallet de l'utilisateur authentifié :
     * - L'identifiant du wallet
     * - Le solde actuel en FCFA
     * - Le statut du wallet (active, suspended, closed)
     * - La devise (FCFA)
     * 
     * Si le wallet n'existe pas, il est créé automatiquement avec un solde de 0.
     * 
     * Utilisé pour :
     * - Afficher le solde dans l'interface utilisateur
     * - Vérifier le statut du wallet avant une opération
     * 
     * Réponse JSON :
     * {
     *   "wallet": {
     *     "id": 1,
     *     "balance": 5000.00,
     *     "status": "active",
     *     "currency": "FCFA"
     *   }
     * }
     *
     * @param Request $request La requête HTTP (contient l'utilisateur authentifié)
     * @return JsonResponse Réponse JSON avec les informations du wallet
     */
    public function index(Request $request): JsonResponse
    {
        // Récupérer l'utilisateur authentifié depuis le token Sanctum
        $user = $request->user();
        
        // Récupérer le wallet (créé automatiquement si nécessaire)
        $wallet = $this->walletService->getWallet($user);
        
        // Récupérer le solde actuel
        $balance = $this->walletService->getBalance($user);

        // Retourner les informations du wallet au format JSON
        return response()->json([
            'wallet' => [
                'id' => $wallet->id,
                'balance' => $balance,
                'status' => $wallet->status,
                'currency' => 'FCFA',
            ],
        ]);
    }

    /**
     * Recharge le wallet de l'utilisateur connecté avec un montant donné
     * 
     * Endpoint : POST /api/wallet/recharge
     * 
     * Cette méthode permet à un utilisateur de recharger son wallet.
     * Les données sont validées via RechargeWalletRequest avant traitement.
     * 
     * Body JSON attendu :
     * {
     *   "amount": 5000,
     *   "payment_method": "mobile_money" (optionnel, défaut: "mobile_money")
     * }
     * 
     * Processus :
     * 1. Validation des données (RechargeWalletRequest)
     * 2. Appel du service pour effectuer la recharge
     * 3. Retour des informations de la transaction et du nouveau solde
     * 
     * En cas d'erreur (wallet suspendu, montant invalide, etc.), une erreur 400
     * est retournée avec un message explicite.
     * 
     * Réponse JSON (succès - 201) :
     * {
     *   "success": true,
     *   "message": "Wallet rechargé avec succès",
     *   "transaction": {
     *     "id": 1,
     *     "reference": "TXN-507F1F77B1FCE-1706520000",
     *     "amount": 5000.00,
     *     "type": "credit",
     *     "status": "completed",
     *     "created_at": "2026-01-28T16:00:00.000000Z"
     *   },
     *   "new_balance": 5000.00
     * }
     * 
     * Réponse JSON (erreur - 400) :
     * {
     *   "success": false,
     *   "message": "Le wallet est suspendu ou fermé"
     * }
     *
     * @param RechargeWalletRequest $request Requête validée contenant amount et payment_method
     * @return JsonResponse Réponse JSON avec les détails de la transaction ou l'erreur
     */
    public function recharge(RechargeWalletRequest $request): JsonResponse
    {
        try {
            // Récupérer l'utilisateur authentifié
            $user = $request->user();
            
            // Extraire et convertir le montant (validation déjà faite par RechargeWalletRequest)
            $amount = (float) $request->amount;
            
            // Récupérer la méthode de paiement (défaut: mobile_money)
            $paymentMethod = $request->payment_method ?? 'mobile_money';

            // Appeler le service pour effectuer la recharge
            // Le service gère toute la logique métier (validation, transaction atomique, etc.)
            $transaction = $this->walletService->recharge($user, $amount, $paymentMethod);

            // Récupérer le nouveau solde après la recharge
            $newBalance = $this->walletService->getBalance($user);

            // Retourner une réponse de succès avec les détails de la transaction
            return response()->json([
                'success' => true,
                'message' => 'Wallet rechargé avec succès',
                'transaction' => [
                    'id' => $transaction->id,
                    'reference' => $transaction->reference,
                    'amount' => $transaction->amount,
                    'type' => $transaction->type,
                    'status' => $transaction->status,
                    'created_at' => $transaction->created_at,
                ],
                'new_balance' => $newBalance,
            ], 201); // Code HTTP 201 Created
        } catch (\Exception $e) {
            // En cas d'erreur, retourner un message d'erreur explicite
            // Les erreurs possibles :
            // - Montant invalide (<= 0)
            // - Wallet suspendu ou fermé
            // - Erreur lors de la transaction atomique
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400); // Code HTTP 400 Bad Request
        }
    }

    /**
     * Récupère l'historique des transactions de l'utilisateur connecté avec filtres et pagination
     * 
     * Endpoint : GET /api/wallet/transactions
     * 
     * Cette méthode permet de consulter toutes les transactions (crédits et débits)
     * effectuées sur le wallet de l'utilisateur.
     * 
     * Paramètres de requête (optionnels) :
     * - type : 'credit' ou 'debit' pour filtrer par type
     * - status : 'pending', 'completed', 'failed', 'cancelled' pour filtrer par statut
     * - category : 'recharge', 'payment', 'refund', 'transfert', 'bonus', 'other'
     * - date_from : Date de début au format Y-m-d (ex: 2026-01-01)
     * - date_to : Date de fin au format Y-m-d (ex: 2026-01-31)
     * 
     * Les résultats sont paginés (15 transactions par page par défaut)
     * et triés par date décroissante (plus récentes en premier).
     * 
     * Exemple d'URL :
     * GET /api/wallet/transactions?type=debit&category=payment&date_from=2026-01-01
     * 
     * Réponse JSON :
     * {
     *   "transactions": [
     *     {
     *       "id": 1,
     *       "type": "debit",
     *       "amount": 2000.00,
     *       "status": "completed",
     *       "reference": "TXN-...",
     *       "description": "Paiement trajet",
     *       "category": "payment",
     *       "created_at": "2026-01-28T16:00:00.000000Z"
     *     }
     *   ],
     *   "pagination": {
     *     "current_page": 1,
     *     "last_page": 5,
     *     "per_page": 15,
     *     "total": 67
     *   }
     * }
     *
     * @param Request $request La requête HTTP (contient les paramètres de filtrage)
     * @return JsonResponse Réponse JSON avec les transactions paginées
     */
    public function transactions(Request $request): JsonResponse
    {
        // Récupérer l'utilisateur authentifié
        $user = $request->user();
        
        // Construire le tableau de filtres à partir des paramètres de requête
        $filters = [
            'type' => $request->type,           // Filtre par type (credit/debit)
            'status' => $request->status,        // Filtre par statut
            'category' => $request->category,    // Filtre par catégorie
            'date_from' => $request->date_from,  // Date de début
            'date_to' => $request->date_to,      // Date de fin
        ];

        // Retirer les valeurs null pour ne garder que les filtres définis
        // Cela évite d'appliquer des filtres vides dans le repository
        $filters = array_filter($filters, fn($value) => $value !== null);

        // Récupérer les transactions avec filtres et pagination (15 par page)
        $transactions = $this->walletService->getTransactions($user, $filters, 15);

        // Retourner les transactions avec les métadonnées de pagination
        return response()->json([
            'transactions' => $transactions->items(), // Liste des transactions de la page actuelle
            'pagination' => [
                'current_page' => $transactions->currentPage(), // Page actuelle
                'last_page' => $transactions->lastPage(),       // Dernière page
                'per_page' => $transactions->perPage(),         // Nombre d'éléments par page
                'total' => $transactions->total(),              // Nombre total de transactions
            ],
        ]);
    }

    /**
     * Transfère de l'argent du wallet de l'utilisateur connecté vers un autre utilisateur
     * 
     * Endpoint : POST /api/wallet/transfert
     * 
     * Cette méthode permet de transférer de l'argent entre deux utilisateurs.
     * Le transfertt consiste en deux opérations atomiques :
     * 1. Débiter le wallet de l'expéditeur
     * 2. Créditer le wallet du destinataire
     * 
     * Body JSON attendu :
     * {
     *   "phone": "+2250701234567",
     *   "amount": 2000,
     *   "description": "transfertt pour trajet" (optionnel)
     * }
     * 
     * Validations effectuées :
     * - Le destinataire doit exister (vérifié par TransferWalletRequest)
     * - L'utilisateur ne peut pas se transférer de l'argent à lui-même
     * - Le solde de l'expéditeur doit être suffisant (géré par WalletService::debit)
     * - Le wallet de l'expéditeur doit être actif (géré par WalletService::debit)
     * 
     * Processus :
     * 1. Validation des données (TransferWalletRequest)
     * 2. Recherche du destinataire par téléphone
     * 3. Vérification que l'expéditeur n'est pas le destinataire
     * 4. Débit du wallet de l'expéditeur (transaction atomique)
     * 5. Crédit du wallet du destinataire (transaction atomique)
     * 6. Retour des informations de la transaction
     * 
     * Note : Si le débit échoue (solde insuffisant), le crédit n'est pas effectué.
     * Chaque opération (débit et crédit) est atomique, mais elles ne sont pas
     * dans la même transaction DB. Dans une version future, on pourra utiliser
     * une transaction DB globale pour garantir l'atomicité complète.
     * 
     * Réponse JSON (succès - 201) :
     * {
     *   "success": true,
     *   "message": "transfertt effectué avec succès",
     *   "transaction": {
     *     "id": 1,
     *     "reference": "TXN-...",
     *     "amount": 2000.00,
     *     "recipient": "+2250701234567",
     *     "status": "completed",
     *     "created_at": "2026-01-28T16:00:00.000000Z"
     *   },
     *   "new_balance": 3000.00
     * }
     * 
     * Réponse JSON (erreur - 400/404) :
     * {
     *   "success": false,
     *   "message": "Solde insuffisant" | "Le destinataire n'existe pas" | etc.
     * }
     *
     * @param TransferWalletRequest $request Requête validée contenant phone, amount et description
     * @return JsonResponse Réponse JSON avec les détails du transfertt ou l'erreur
     */
    public function transfert(TransferWalletRequest $request): JsonResponse
    {
        try {
            // Récupérer l'utilisateur authentifié (expéditeur)
            $user = $request->user();
            
            // Extraire les données de la requête (validation déjà faite par TransferWalletRequest)
            $recipientPhone = $request->phone;
            $amount = (float) $request->amount;
            $description = $request->description ?? "transfertt vers {$recipientPhone}";

            // Étape 1 : Rechercher le destinataire par son numéro de téléphone
            // La validation TransferWalletRequest vérifie déjà que le téléphone existe,
            // mais on le recherche quand même pour obtenir l'objet User complet
            $recipient = User::where('telephone', $recipientPhone)->first();

            // Vérification de sécurité : le destinataire doit exister
            // (normalement déjà vérifié par TransferWalletRequest, mais double vérification)
            if (!$recipient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le destinataire n\'existe pas.',
                ], 404); // Code HTTP 404 Not Found
            }

            // Vérification de sécurité : l'utilisateur ne peut pas se transférer de l'argent à lui-même
            if ($recipient->id === $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez pas transférer de l\'argent à vous-même.',
                ], 400); // Code HTTP 400 Bad Request
            }

            // Étape 2 : Débiter le wallet de l'expéditeur
            // Générer une référence unique pour la transaction de débit
            $debitReference = \App\Domains\Wallet\Models\Transaction::generateReference();
            
            // Effectuer le débit (vérifie le solde suffisant et wallet actif)
            // Si le débit échoue, une exception est levée et le crédit ne sera pas effectué
            $debitTransaction = $this->walletService->debit(
                $user,                          // Utilisateur expéditeur
                $amount,                        // Montant à transférer
                $debitReference,                // Référence unique
                "transfertt vers {$recipientPhone}", // Description
                'transfert',                     // Catégorie : transfertt
                [                               // Métadonnées pour traçabilité
                    'recipient_id' => $recipient->id,
                    'recipient_phone' => $recipientPhone
                ]
            );

            // Étape 3 : Créditer le wallet du destinataire
            // Générer une référence unique pour la transaction de crédit
            $creditReference = \App\Domains\Wallet\Models\Transaction::generateReference();
            
            // Effectuer le crédit (ajoute l'argent au wallet du destinataire)
            $creditTransaction = $this->walletService->credit(
                $recipient,                     // Utilisateur destinataire
                $amount,                        // Montant reçu
                $creditReference,               // Référence unique
                "transfertt reçu de {$user->telephone}", // Description
                'transfert',                     // Catégorie : transfertt
                [                               // Métadonnées pour traçabilité
                    'sender_id' => $user->id,
                    'sender_phone' => $user->telephone
                ]
            );

            // Récupérer le nouveau solde de l'expéditeur après le transfertt
            $newBalance = $this->walletService->getBalance($user);

            // Retourner une réponse de succès avec les détails de la transaction de débit
            return response()->json([
                'success' => true,
                'message' => 'transfertt effectué avec succès',
                'transaction' => [
                    'id' => $debitTransaction->id,
                    'reference' => $debitTransaction->reference,
                    'amount' => $debitTransaction->amount,
                    'recipient' => $recipientPhone,
                    'status' => $debitTransaction->status,
                    'created_at' => $debitTransaction->created_at,
                ],
                'new_balance' => $newBalance,
            ], 201); // Code HTTP 201 Created
        } catch (\Exception $e) {
            // En cas d'erreur, retourner un message d'erreur explicite
            // Les erreurs possibles :
            // - Solde insuffisant
            // - Wallet suspendu ou fermé
            // - Erreur lors d'une des transactions atomiques
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400); // Code HTTP 400 Bad Request
        }
    }
}
