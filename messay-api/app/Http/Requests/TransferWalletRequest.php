<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request transfertWalletRequest - Validation des données de transfertt d'argent
 * 
 * Cette classe gère la validation des données envoyées lors d'une requête
 * de transfertt d'argent entre utilisateurs (POST /api/wallet/transfert).
 * 
 * Elle hérite de FormRequest qui fournit:
 * - La validation automatique des données
 * - La gestion des erreurs de validation
 * - L'accès à l'utilisateur authentifié via $this->user()
 * 
 * Champs validés :
 * - phone : Numéro de téléphone du destinataire (obligatoire, doit exister dans users)
 * - amount : Montant du transfertt (obligatoire, numérique, min 100, max 1M FCFA)
 * - description : Description optionnelle du transfertt (max 255 caractères)
 */
class TransferWalletRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête
     * 
     * Cette méthode est appelée avant la validation des données.
     * Elle permet de vérifier les permissions de l'utilisateur.
     * 
     * Dans notre cas, tout utilisateur authentifié peut transférer de l'argent.
     * L'authentification est gérée par le middleware auth:sanctum sur la route.
     * 
     * Note : La vérification que l'utilisateur ne se transfère pas à lui-même
     * est faite dans le controller, pas ici.
     *
     * @return bool True si l'utilisateur est autorisé, false sinon
     */
    public function authorize(): bool
    {
        // Tout utilisateur authentifié peut transférer de l'argent
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
     * - phone :
     *   * required : Le champ est obligatoire
     *   * string : Doit être une chaîne de caractères
     *   * max:20 : Maximum 20 caractères (format international)
     *   * exists:users,telephone : Le téléphone doit exister dans la table users
     * 
     * - amount :
     *   * required : Le champ est obligatoire
     *   * numeric : Doit être un nombre (entier ou décimal)
     *   * min:100 : Minimum 100 FCFA (pour éviter les micro-transactions)
     *   * max:1000000 : Maximum 1 000 000 FCFA (limite de sécurité)
     * 
     * - description :
     *   * nullable : Le champ est optionnel
     *   * string : Doit être une chaîne de caractères
     *   * max:255 : Maximum 255 caractères (limite de la colonne DB)
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Numéro de téléphone du destinataire
            // exists:users,telephone vérifie que le téléphone existe dans la table users
            // Cela évite de tenter un transfertt vers un utilisateur inexistant
            'phone' => ['required', 'string', 'max:20', 'exists:users,telephone'],
            
            // Montant du transfertt
            // Min 100 FCFA pour éviter les micro-transactions coûteuses en frais
            // Max 1M FCFA pour limiter les risques de fraude
            'amount' => ['required', 'numeric', 'min:100', 'max:1000000'],
            
            // Description optionnelle du transfertt
            // Permet à l'utilisateur d'ajouter un message (ex: "Pour le trajet")
            'description' => ['nullable', 'string', 'max:255'],
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
            // Erreurs pour le champ 'phone'
            'phone.required' => 'Le numéro de téléphone du destinataire est obligatoire.',
            'phone.exists' => 'Le numéro de téléphone n\'existe pas dans notre système.',
            
            // Erreurs pour le champ 'amount'
            'amount.required' => 'Le montant est obligatoire.',
            'amount.numeric' => 'Le montant doit être un nombre.',
            'amount.min' => 'Le montant minimum est de 100 FCFA.',
            'amount.max' => 'Le montant maximum est de 1 000 000 FCFA.',
            
            // Erreurs pour le champ 'description'
            'description.max' => 'La description ne peut pas dépasser 255 caractères.',
        ];
    }
}
