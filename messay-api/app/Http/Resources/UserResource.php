<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource UserResource - Formate les données utilisateur pour les réponses API
 * 
 * Cette classe transforme le modèle User en un tableau JSON structuré pour
 * les réponses API. Elle suit le pattern API Resource de Laravel pour :
 * - Masquer les champs sensibles (password, tokens, etc.)
 * - Formater les données de manière cohérente
 * - Utiliser des noms de champs en camelCase pour le frontend
 * - Ajouter des transformations si nécessaire
 * 
 * Utilisation :
 * - Retournée dans AuthController::verifyOTP() après authentification
 * - Retournée dans AuthController::user() pour récupérer le profil
 * - Utilisée automatiquement par Laravel pour la sérialisation JSON
 */
class UserResource extends JsonResource
{
    /**
     * Transforme le modèle User en tableau JSON pour la réponse API
     * 
     * Cette méthode définit quels champs sont retournés et comment ils sont nommés.
     * Les noms de champs sont en camelCase pour correspondre aux conventions
     * JavaScript/frontend.
     * 
     * Champs retournés :
     * - id : Identifiant unique de l'utilisateur
     * - fullName : Nom complet (nom et prénoms, un seul champ)
     * - phone : Numéro de téléphone (identifiant principal)
     * - phoneVerified : Indique si le téléphone a été vérifié via OTP
     * - role : Rôle de l'utilisateur ('passager' ou 'driver')
     * - status : Statut du compte ('active', 'blocked', 'suspended')
     * - verified_at : Date de vérification du téléphone
     * - created_at : Date de création du compte
     * - updated_at : Date de dernière mise à jour
     * 
     * Champs masqués (sécurité) :
     * - password : Jamais retourné (même s'il existe en DB)
     * - remember_token : Jamais retourné
     * - email : Non utilisé dans le flux OTP, non retourné
     * 
     * Exemple de réponse JSON :
     * {
     *   "id": 1,
     *   "fullName": "Jean-Pierre Dupont",
     *   "phone": "+2250701234567",
     *   "phoneVerified": true,
     *   "role": "passager",
     *   "status": "active",
     *   "verified_at": "2026-01-28T16:00:00.000000Z",
     *   "created_at": "2026-01-28T16:00:00.000000Z",
     *   "updated_at": "2026-01-28T16:00:00.000000Z"
     * }
     *
     * @param Request $request La requête HTTP (non utilisée ici mais requis par l'interface)
     * @return array<string, mixed> Tableau associatif des données utilisateur formatées
     */
    public function toArray(Request $request): array
    {
        $fullName = trim(($this->first_name ?? '') . ' ' . ($this->last_name ?? ''));

        return [
            // Identifiant unique de l'utilisateur
            'id' => $this->id,

            // Nom complet (nom et prénoms, un seul champ)
            'fullName' => $fullName ?: null,

            // Numéro de téléphone (identifiant principal)
            // Format international Côte d'Ivoire : +225...
            'phone' => $this->telephone,
            
            // Indique si le téléphone a été vérifié via OTP
            // Format camelCase pour le frontend
            'phoneVerified' => $this->is_verified,
            
            // Rôle de l'utilisateur : 'passager' (défaut) ou 'driver' (chauffeur)
            'role' => $this->role,
            
            // Statut du compte : 'active' (défaut), 'blocked', 'suspended'
            'status' => $this->status,
            
            // Date et heure de vérification du téléphone via OTP
            // Format ISO 8601 (ex: 2026-01-28T16:00:00.000000Z)
            'verified_at' => $this->verified_at,
            
            // Date et heure de création du compte
            // Format ISO 8601
            'created_at' => $this->created_at,
            
            // Date et heure de dernière mise à jour du compte
            // Format ISO 8601
            'updated_at' => $this->updated_at,
        ];
    }
}
