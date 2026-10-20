<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request RechargeWalletRequest - Validation des données de recharge de wallet
 * 
 * Cette classe gère la validation des données envoyées lors d'une requête
 * de recharge de wallet (POST /api/wallet/recharge).
 * 
 * Elle hérite de FormRequest qui fournit :
 * - La validation automatique des données
 * - La gestion des erreurs de validation
 * - L'accès à l'utilisateur authentifié via $this->user()
 * 
 * Champs validés :
 * - amount : Montant de la recharge (obligatoire, numérique, min 100, max 1M FCFA)
 * - payment_method : Méthode de paiement (optionnel, doit être dans la liste autorisée)
 */
class RechargeWalletRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête
     * 
     * Cette méthode est appelée avant la validation des données.
     * Elle permet de vérifier les permissions de l'utilisateur.
     * 
     * Dans notre cas, tout utilisateur authentifié peut recharger son wallet.
     * L'authentification est gérée par le middleware auth:sanctum sur la route.
     *
     * @return bool True si l'utilisateur est autorisé, false sinon
     */
    public function authorize(): bool
    {
        // Tout utilisateur authentifié peut recharger son wallet
        return true;
    }

    /**
     * Définit les règles de validation pour les champs de la requête
     * 
     * Ces règles sont appliquées automatiquement par Laravel avant que
     * la requête n'atteigne le controller. Si la validation échoue, une
     * réponse JSON 422 est retournée avec les erreurs.
     * 
     * Règles appliquées :
     * - amount : 
     *   * required : Le champ est obligatoire
     *   * numeric : Doit être un nombre (entier ou décimal)
     *   * min:100 : Minimum 100 FCFA (pour éviter les micro-transactions)
     *   * max:1000000 : Maximum 1 000 000 FCFA (limite de sécurité)
     * 
     * - payment_method :
     *   * nullable : Le champ est optionnel
     *   * string : Doit être une chaîne de caractères
     *   * in:mobile_money,card,bank_transfert : Doit être une des valeurs autorisées
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Montant de la recharge
            // Min 100 FCFA pour éviter les micro-transactions coûteuses en frais
            // Max 1M FCFA pour limiter les risques de fraude
            'amount' => ['required', 'numeric', 'min:100', 'max:1000000'],
            
            // Méthode de paiement (optionnel, défaut: mobile_money)
            // Les valeurs autorisées sont les méthodes de paiement supportées
            'payment_method' => ['nullable', 'string', 'in:mobile_money,card,bank_transfert'],
        ];
    }

    /**
     * Définit les messages d'erreur personnalisés en français
     * 
     * Ces messages remplacent les messages par défaut de Laravel (en anglais)
     * pour offrir une meilleure expérience utilisateur en français.
     * 
     * Les messages sont retournés dans la réponse JSON 422 en cas d'erreur de validation.
     *
     * @return array<string, string> Tableau associatif [règle.champ => message]
     */
    public function messages(): array
    {
        return [
            // Erreurs pour le champ 'amount'
            'amount.required' => 'Le montant est obligatoire.',
            'amount.numeric' => 'Le montant doit être un nombre.',
            'amount.min' => 'Le montant minimum est de 100 FCFA.',
            'amount.max' => 'Le montant maximum est de 1 000 000 FCFA.',
            
            // Erreurs pour le champ 'payment_method'
            'payment_method.in' => 'La méthode de paiement n\'est pas valide.',
        ];
    }
}
