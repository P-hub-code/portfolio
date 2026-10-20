<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request CancelTripRequest - Validation des données d'annulation de trajet
 * 
 * Cette classe gère la validation des données envoyées lors d'une requête
 * d'annulation de trajet (POST /api/mobility/trips/{id}/cancel).
 * 
 * Champs validés :
 * - reason : Raison de l'annulation (optionnel, chaîne de caractères, max 500)
 */
class CancelTripRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête
     * 
     * Tout utilisateur authentifié peut annuler un trajet (le sien ou celui
     * qui lui est assigné s'il est chauffeur).
     * L'authentification est gérée par le middleware auth:sanctum sur la route.
     *
     * @return bool True si l'utilisateur est autorisé, false sinon
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Définit les règles de validation pour les champs de la requête
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Raison de l'annulation (optionnelle mais recommandée)
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Définit les messages d'erreur personnalisés en français
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // Erreurs pour le champ 'reason'
            'reason.string' => 'La raison de l\'annulation doit être une chaîne de caractères.',
            'reason.max' => 'La raison de l\'annulation ne peut pas dépasser 500 caractères.',
        ];
    }
}
