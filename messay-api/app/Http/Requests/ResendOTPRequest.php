<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request ResendOTPRequest - Validation des données de renvoi de code OTP
 * 
 * Cette classe gère la validation des données envoyées lors d'une requête
 * de renvoi de code OTP (POST /api/auth/resend-otp).
 * 
 * Elle hérite de FormRequest qui fournit :
 * - La validation automatique des données
 * - La gestion des erreurs de validation
 * - L'accès à l'utilisateur authentifié via $this->user() (non utilisé ici car public)
 * 
 * Champs validés :
 * - phone : Numéro de téléphone (obligatoire, format international)
 * 
 * Utilisation :
 * - Appelé depuis l'écran de saisie du code OTP si l'utilisateur n'a pas reçu le SMS
 * - Appelé si le code OTP a expiré et que l'utilisateur veut un nouveau code
 * - Invalide automatiquement tous les anciens codes pour ce téléphone
 */
class ResendOTPRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête
     * 
     * Cette méthode est appelée avant la validation des données.
     * Elle permet de vérifier les permissions de l'utilisateur.
     * 
     * Dans notre cas, le renvoi de code OTP est publique (pas d'authentification requise).
     * Tout le monde peut demander un nouveau code OTP.
     *
     * @return bool True si l'utilisateur est autorisé, false sinon
     */
    public function authorize(): bool
    {
        // Le renvoi de code OTP est publique, pas d'authentification requise
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
     * Format attendu :
     * - Format international Côte d'Ivoire : +225XXXXXXXXX
     * - Exemple : +2250701234567
     * 
     * Note : On ne vérifie pas l'existence du téléphone ici car cette méthode
     * peut être appelée depuis l'inscription (téléphone pas encore créé) ou
     * depuis la connexion (téléphone existant). Le service gère les deux cas.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Numéro de téléphone
            // Format international Côte d'Ivoire : +225XXXXXXXXX
            'phone' => ['required', 'string', 'max:20'],
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
        ];
    }
}
