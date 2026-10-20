<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request VerifyOTPRequest - Validation des données de vérification OTP
 * 
 * Cette classe gère la validation des données envoyées lors d'une requête
 * de vérification de code OTP (POST /api/auth/verify-otp).
 * 
 * Elle hérite de FormRequest qui fournit :
 * - La validation automatique des données
 * - La gestion des erreurs de validation
 * - L'accès à l'utilisateur authentifié via $this->user() (non utilisé ici car public)
 * 
 * Champs validés :
 * - phone : Numéro de téléphone (obligatoire, format international)
 * - code : Code OTP à 6 chiffres (obligatoire, exactement 6 chiffres, uniquement des chiffres)
 * 
 * Logique de validation :
 * - Le code doit contenir exactement 6 chiffres (pas de lettres, pas d'espaces)
 * - Format attendu : "123456" (6 chiffres consécutifs)
 */
class VerifyOTPRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête
     * 
     * Cette méthode est appelée avant la validation des données.
     * Elle permet de vérifier les permissions de l'utilisateur.
     * 
     * Dans notre cas, la vérification OTP est publique (pas d'authentification requise).
     * C'est l'étape qui permet d'obtenir l'authentification.
     *
     * @return bool True si l'utilisateur est autorisé, false sinon
     */
    public function authorize(): bool
    {
        // La vérification OTP est publique, pas d'authentification requise
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
     * 
     * Règles appliquées pour 'code' :
     * - required : Le champ est obligatoire
     * - string : Doit être une chaîne de caractères
     * - size:6 : Doit contenir exactement 6 caractères
     * - regex:/^[0-9]{6}$/ : Doit contenir uniquement des chiffres (0-9)
     * 
     * Format attendu pour 'code' :
     * - Exactement 6 chiffres : "123456"
     * - Pas de lettres : "ABC123" → invalide
     * - Pas d'espaces : "123 456" → invalide
     * - Pas de caractères spéciaux : "123-45" → invalide
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Numéro de téléphone
            // Format international Côte d'Ivoire : +225XXXXXXXXX
            'phone' => ['required', 'string', 'max:20'],
            
            // Code OTP à 6 chiffres
            // size:6 garantit exactement 6 caractères
            // regex:/^[0-9]{6}$/ garantit que ce sont uniquement des chiffres
            // Format attendu : "123456" (6 chiffres consécutifs)
            'code' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
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
            
            // Erreurs pour le champ 'code'
            'code.required' => 'Le code OTP est obligatoire.',
            'code.size' => 'Le code OTP doit contenir 6 chiffres.',
            'code.regex' => 'Le code OTP doit contenir uniquement des chiffres.',
        ];
    }
}
