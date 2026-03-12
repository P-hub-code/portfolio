<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request RegisterRequest - Validation des données d'inscription
 * 
 * Cette classe gère la validation des données envoyées lors d'une requête
 * d'inscription (POST /api/auth/register).
 * 
 * Elle hérite de FormRequest qui fournit :
 * - La validation automatique des données
 * - La gestion des erreurs de validation
 * - L'accès à l'utilisateur authentifié via $this->user() (non utilisé ici car public)
 * 
 * Champs validés :
 * - phone : Numéro de téléphone (obligatoire, unique, format international)
 * 
 * Logique de validation :
 * - Le téléphone doit être unique dans la table users
 * - Si le téléphone existe déjà, l'utilisateur doit utiliser la connexion
 */
class RegisterRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête
     * 
     * Cette méthode est appelée avant la validation des données.
     * Elle permet de vérifier les permissions de l'utilisateur.
     * 
     * Dans notre cas, l'inscription est publique (pas d'authentification requise).
     * Tout le monde peut demander un code OTP pour s'inscrire.
     *
     * @return bool True si l'utilisateur est autorisé, false sinon
     */
    public function authorize(): bool
    {
        // L'inscription est publique, pas d'authentification requise
        return true;
    }

    /**
     * Définit les règles de validation pour les champs de la requête
     * 
     * Ces règles sont appliquées automatiquement par Laravel avant que
     * la requête n'atteigne le controller. Si la validation échoue, une
     * réponse JSON 422 est retournée avec les erreurs.
     * 
     * Règles appliquées pour 'phone' :
     * - required : Le champ est obligatoire
     * - string : Doit être une chaîne de caractères
     * - max:20 : Maximum 20 caractères (format international avec indicatif)
     * - unique:users,telephone : Le téléphone doit être unique dans la table users
     * 
     * Format attendu :
     * - Format international Côte d'Ivoire : +225XXXXXXXXX
     * - Exemple : +2250701234567
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Numéro de téléphone
            // unique:users,telephone vérifie que le téléphone n'existe pas déjà
            // Si le téléphone existe, l'utilisateur doit utiliser la connexion
            'phone' => ['required', 'string', 'max:20', 'unique:users,telephone'],
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
            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'phone.unique' => 'Ce numéro de téléphone est déjà utilisé.',
        ];
    }
}
