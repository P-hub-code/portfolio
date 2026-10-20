<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request CreateTripRequest - Validation des données de création de trajet
 * 
 * Cette classe gère la validation des données envoyées lors d'une requête
 * de création de trajet (POST /api/mobility/trips).
 * 
 * Champs validés :
 * - departure : Point de départ (obligatoire, chaîne de caractères)
 * - destination : Point d'arrivée (obligatoire, chaîne de caractères)
 * - departure_lat : Latitude du point de départ (optionnel, numérique)
 * - departure_lng : Longitude du point de départ (optionnel, numérique)
 * - destination_lat : Latitude du point d'arrivée (optionnel, numérique)
 * - destination_lng : Longitude du point d'arrivée (optionnel, numérique)
 * - distance : Distance en kilomètres (optionnel, numérique, min 0)
 * - estimated_time : Temps estimé en minutes (optionnel, entier, min 1)
 */
class CreateTripRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête
     * 
     * Tout utilisateur authentifié peut créer un trajet.
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
            // Point de départ (obligatoire)
            'departure' => ['required', 'string', 'max:255'],
            
            // Point d'arrivée (obligatoire)
            'destination' => ['required', 'string', 'max:255'],
            
            // Coordonnées GPS du point de départ (optionnelles mais recommandées)
            // Si fournies, permettent le calcul automatique de la distance
            'departure_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'departure_lng' => ['nullable', 'numeric', 'between:-180,180'],
            
            // Coordonnées GPS du point d'arrivée (optionnelles mais recommandées)
            'destination_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'destination_lng' => ['nullable', 'numeric', 'between:-180,180'],
            
            // Distance en kilomètres (optionnelle, calculée automatiquement si coordonnées fournies)
            'distance' => ['nullable', 'numeric', 'min:0', 'max:1000'],
            
            // Temps estimé en minutes (optionnel, calculé automatiquement si distance fournie)
            'estimated_time' => ['nullable', 'integer', 'min:1', 'max:1440'], // Max 24h
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
            // Erreurs pour le champ 'departure'
            'departure.required' => 'Le point de départ est obligatoire.',
            'departure.string' => 'Le point de départ doit être une adresse valide.',
            'departure.max' => 'Le point de départ ne peut pas dépasser 255 caractères.',
            
            // Erreurs pour le champ 'destination'
            'destination.required' => 'Le point d\'arrivée est obligatoire.',
            'destination.string' => 'Le point d\'arrivée doit être une adresse valide.',
            'destination.max' => 'Le point d\'arrivée ne peut pas dépasser 255 caractères.',
            
            // Erreurs pour les coordonnées GPS
            'departure_lat.numeric' => 'La latitude de départ doit être un nombre.',
            'departure_lat.between' => 'La latitude de départ doit être entre -90 et 90.',
            'departure_lng.numeric' => 'La longitude de départ doit être un nombre.',
            'departure_lng.between' => 'La longitude de départ doit être entre -180 et 180.',
            'destination_lat.numeric' => 'La latitude d\'arrivée doit être un nombre.',
            'destination_lat.between' => 'La latitude d\'arrivée doit être entre -90 et 90.',
            'destination_lng.numeric' => 'La longitude d\'arrivée doit être un nombre.',
            'destination_lng.between' => 'La longitude d\'arrivée doit être entre -180 et 180.',
            
            // Erreurs pour la distance
            'distance.numeric' => 'La distance doit être un nombre.',
            'distance.min' => 'La distance ne peut pas être négative.',
            'distance.max' => 'La distance ne peut pas dépasser 1000 km.',
            
            // Erreurs pour le temps estimé
            'estimated_time.integer' => 'Le temps estimé doit être un nombre entier.',
            'estimated_time.min' => 'Le temps estimé doit être d\'au moins 1 minute.',
            'estimated_time.max' => 'Le temps estimé ne peut pas dépasser 1440 minutes (24h).',
        ];
    }
}
