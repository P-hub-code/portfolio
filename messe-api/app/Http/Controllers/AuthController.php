<?php

namespace App\Http\Controllers;

use App\Domains\Identity\Models\User;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResendOTPRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\VerifyOTPRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller AuthController - Gère toutes les opérations d'authentification
 *
 * Note : L'authentification par téléphone utilise désormais Firebase Phone Auth côté mobile.
 * Le backend ne gère plus la génération, l'envoi ni la vérification des codes OTP.
 *
 * Endpoints OTP désactivés (HTTP 410 Gone) :
 * - POST /api/auth/register : OTP désactivé (Firebase gère l'inscription)
 * - POST /api/auth/login : OTP désactivé (Firebase gère la connexion)
 * - POST /api/auth/verify-otp : Désactivé (vérification côté Firebase)
 * - POST /api/auth/resend-otp : Désactivé (renvoi géré par Firebase)
 *
 * Endpoints actifs :
 * - POST /api/auth/logout : Révoquer le token actuel
 * - GET /api/user : Récupérer les informations de l'utilisateur connecté
 * - PUT /api/user : Mettre à jour le profil (fullName)
 *
 * Pour sync profil backend : l'app peut envoyer un Firebase ID token pour créer/mettre
 * à jour l'utilisateur (voir vérification Firebase Admin côté backend si besoin).
 */
class AuthController extends Controller
{
    /**
     * Inscription : Génère et envoie un code OTP pour créer un nouveau compte
     * 
     * Endpoint : POST /api/auth/register
     * 
     * Cette méthode est la première étape du processus d'inscription.
     * Elle vérifie que le téléphone n'est pas déjà enregistré, puis génère
     * et envoie un code OTP par SMS.
     * 
     * Body JSON attendu :
     * {
     *   "phone": "+2250701234567"
     * }
     * 
     * Processus :
     * 1. Validation des données (RegisterRequest)
     * 2. Vérification que le téléphone n'existe pas déjà
     * 3. Génération et envoi d'un code OTP
     * 4. Retour d'une confirmation avec le délai d'expiration
     * 
     * Réponse JSON (succès - 200) :
     * {
     *   "success": true,
     *   "message": "OTP envoyé",
     *   "expiresIn": 300
     * }
     * 
     * Réponse JSON (erreur - 422) :
     * {
     *   "errors": {
     *     "phone": [
     *       "Ce numéro de téléphone est déjà enregistré. Utilisez la connexion."
     *     ]
     *   }
     * }
     * 
     * Note : L'utilisateur n'est pas encore créé à ce stade. Il sera créé lors
     * de la vérification du code OTP (verifyOTP) si le code est valide.
     *
     * @param RegisterRequest $request Requête validée contenant le téléphone
     * @return JsonResponse Réponse JSON avec confirmation d'envoi ou erreur
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // OTP désactivé : Firebase Phone Auth gère désormais l'inscription côté mobile.
        // Le backend ne génère plus de code, n'envoie plus de SMS et n'alimente plus codes_otp.
        return response()->json([
            'success' => false,
            'message' => 'L\'inscription utilise désormais Firebase Phone Auth. Cet endpoint est désactivé pour le flux mobile.',
        ], 410);
    }

    /**
     * Connexion : Génère et envoie un code OTP pour se connecter avec un compte existant
     * 
     * Endpoint : POST /api/auth/login
     * 
     * Cette méthode est la première étape du processus de connexion.
     * Elle vérifie que le téléphone existe, que le compte est actif, puis génère
     * et envoie un code OTP par SMS.
     * 
     * Body JSON attendu :
     * {
     *   "phone": "+2250701234567"
     * }
     * 
     * Processus :
     * 1. Validation des données (LoginRequest)
     * 2. Vérification que le téléphone existe dans la base
     * 3. Vérification que le compte est actif (pas bloqué ni suspendu)
     * 4. Génération et envoi d'un code OTP
     * 5. Retour d'une confirmation avec le délai d'expiration
     * 
     * Réponse JSON (succès - 200) :
     * {
     *   "success": true,
     *   "message": "OTP envoyé",
     *   "expiresIn": 300
     * }
     * 
     * Réponse JSON (erreur - 422) :
     * {
     *   "errors": {
     *     "phone": [
     *       "Ce numéro de téléphone n'est pas enregistré. Inscrivez-vous d'abord."
     *     ]
     *   }
     * }
     * 
     * ou
     * 
     * {
     *   "errors": {
     *     "phone": [
     *       "Votre compte est bloqué." | "Votre compte est suspendu."
     *     ]
     *   }
     * }
     *
     * @param LoginRequest $request Requête validée contenant le téléphone
     * @return JsonResponse Réponse JSON avec confirmation d'envoi ou erreur
     * @throws ValidationException Si le téléphone n'existe pas ou le compte est bloqué/suspendu
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // OTP désactivé : Firebase Phone Auth gère désormais la connexion côté mobile.
        return response()->json([
            'success' => false,
            'message' => 'La connexion utilise désormais Firebase Phone Auth. Cet endpoint est désactivé pour le flux mobile.',
        ], 410);
    }

    /**
     * Vérifie le code OTP et crée/connecte l'utilisateur avec génération d'un token
     * 
     * Endpoint : POST /api/auth/verify-otp
     * 
     * Cette méthode est la deuxième étape du processus d'authentification.
     * Elle vérifie le code OTP saisi par l'utilisateur et :
     * - Si l'utilisateur n'existe pas : crée un nouveau compte (inscription)
     * - Si l'utilisateur existe : met à jour la vérification (connexion)
     * 
     * Body JSON attendu :
     * {
     *   "phone": "+2250701234567",
     *   "code": "123456"
     * }
     * 
     * Processus :
     * 1. Validation des données (VerifyOTPRequest)
     * 2. Recherche d'un code OTP valide (non utilisé, non expiré)
     * 3. Marquage du code comme utilisé (empêche la réutilisation)
     * 4. Création ou récupération de l'utilisateur
     * 5. Révocation de tous les anciens tokens (politique 1 appareil actif)
     * 6. Génération d'un nouveau token Sanctum
     * 7. Retour du token et des informations utilisateur
     * 
     * Réponse JSON (succès - 200) :
     * {
     *   "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     *   "user": {
     *     "id": 1,
     *     "fullName": null,
     *     "phone": "+2250701234567",
     *     "phoneVerified": true,
     *     "role": "passager",
     *     "status": "active",
     *     "verified_at": "2026-01-28T16:00:00.000000Z",
     *     ...
     *   }
     * }
     * 
     * Réponse JSON (erreur - 422) :
     * {
     *   "errors": {
     *     "code": [
     *       "Code OTP invalide ou expiré."
     *     ]
     *   }
     * }
     * 
     * Sécurité :
     * - Le code OTP ne peut être utilisé qu'une fois
     * - Le code expire après 5 minutes
     * - Tous les anciens tokens sont révoqués (1 appareil actif)
     *
     * @param VerifyOTPRequest $request Requête validée contenant phone et code
     * @return JsonResponse Réponse JSON avec token et informations utilisateur
     * @throws ValidationException Si le code OTP est invalide ou expiré
     */
    public function verifyOTP(VerifyOTPRequest $request): JsonResponse
    {
        // OTP désactivé : la vérification du code est désormais gérée côté Firebase.
        // Le backend ne valide plus les codes depuis codes_otp.
        return response()->json([
            'success' => false,
            'message' => 'La vérification OTP est désormais gérée par Firebase Phone Auth. Cet endpoint est désactivé pour le flux mobile.',
        ], 410);
    }

    /**
     * Renvoie un nouveau code OTP pour un téléphone donné
     * 
     * Endpoint : POST /api/auth/resend-otp
     * 
     * Cette méthode permet de demander un nouveau code OTP si l'utilisateur
     * n'a pas reçu le SMS ou si le code a expiré.
     * 
     * Body JSON attendu :
     * {
     *   "phone": "+2250701234567"
     * }
     * 
     * Processus :
     * 1. Validation des données (ResendOTPRequest)
     * 2. Invalidation de tous les anciens codes OTP pour ce téléphone
     * 3. Génération d'un nouveau code OTP
     * 4. Envoi du nouveau code par SMS
     * 5. Retour d'une confirmation avec le délai d'expiration
     * 
     * Réponse JSON (succès - 200) :
     * {
     *   "success": true,
     *   "message": "OTP renvoyé",
     *   "expiresIn": 300
     * }
     * 
     * Note : Cette méthode peut être appelée depuis l'écran d'inscription
     * ou de connexion. Elle invalide automatiquement les anciens codes pour
     * garantir qu'un seul code valide existe à la fois.
     *
     * @param ResendOTPRequest $request Requête validée contenant le téléphone
     * @return JsonResponse Réponse JSON avec confirmation d'envoi
     */
    public function resendOTP(ResendOTPRequest $request): JsonResponse
    {
        // OTP désactivé : Firebase gère le renvoi de code côté client.
        return response()->json([
            'success' => false,
            'message' => 'Le renvoi de code OTP est désormais géré par Firebase. Cet endpoint est désactivé pour le flux mobile.',
        ], 410);
    }

    /**
     * Déconnecte l'utilisateur en révoquant son token d'authentification actuel
     * 
     * Endpoint : POST /api/auth/logout
     * 
     * Cette méthode révoque le token Sanctum utilisé pour authentifier la requête.
     * Après la déconnexion, le token ne peut plus être utilisé pour les requêtes authentifiées.
     * 
     * Headers requis :
     * - Authorization: Bearer {token}
     * 
     * Processus :
     * 1. Récupération de l'utilisateur authentifié via le token
     * 2. Suppression du token actuel (révocation)
     * 3. Retour d'une confirmation de déconnexion
     * 
     * Réponse JSON (succès - 200) :
     * {
     *   "message": "Déconnexion réussie"
     * }
     * 
     * Réponse JSON (erreur - 401) :
     * {
     *   "message": "Unauthenticated."
     * }
     * 
     * Note : Seul le token utilisé pour cette requête est révoqué.
     * Si l'utilisateur a plusieurs tokens (théoriquement impossible avec la politique
     * 1 appareil actif), seul le token actuel est supprimé.
     *
     * @param Request $request La requête HTTP (contient l'utilisateur authentifié via token)
     * @return JsonResponse Réponse JSON avec confirmation de déconnexion
     */
    public function logout(Request $request): JsonResponse
    {
        // Récupérer l'utilisateur authentifié depuis le token Sanctum
        // Supprimer le token actuel utilisé pour cette requête
        // Cela révoque le token et empêche son utilisation future
        $request->user()->currentAccessToken()->delete();

        // Retourner une confirmation de déconnexion
        return response()->json([
            'message' => 'Déconnexion réussie',
        ]);
    }

    /**
     * Récupère les informations de l'utilisateur authentifié
     * 
     * Endpoint : GET /api/user
     * 
     * Cette méthode retourne les informations complètes de l'utilisateur
     * authentifié via son token Sanctum.
     * 
     * Headers requis :
     * - Authorization: Bearer {token}
     * - Accept: application/json
     * 
     * Utilisé pour :
     * - Vérifier la validité du token au démarrage de l'application
     * - Récupérer les informations utilisateur pour affichage
     * - Rafraîchir les données utilisateur après une mise à jour
     * 
     * Réponse JSON (succès - 200) :
     * {
     *   "user": {
     *     "id": 1,
     *     "fullName": null,
     *     "phone": "+2250701234567",
     *     "phoneVerified": true,
     *     "role": "passager",
     *     "status": "active",
     *     "verified_at": "2026-01-28T16:00:00.000000Z",
     *     "created_at": "2026-01-28T16:00:00.000000Z",
     *     "updated_at": "2026-01-28T16:00:00.000000Z"
     *   }
     * }
     * 
     * Réponse JSON (erreur - 401) :
     * {
     *   "message": "Unauthenticated."
     * }
     * 
     * Note : Si le token est invalide ou expiré, une erreur 401 est retournée.
     * Le frontend doit alors rediriger vers l'écran de connexion.
     *
     * @param Request $request La requête HTTP (contient l'utilisateur authentifié via token)
     * @return JsonResponse Réponse JSON avec les informations utilisateur formatées
     */
    public function user(Request $request): JsonResponse
    {
        // Récupérer l'utilisateur authentifié depuis le token Sanctum
        // Formater les données avec UserResource pour un formatage cohérent
        // UserResource masque les champs sensibles et formate les données pour l'API
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    /**
     * Met à jour le profil de l'utilisateur authentifié (fullName)
     *
     * Endpoint : PUT /api/user
     * Body : { "fullName": "Nom et prénoms" }
     * Header : Authorization: Bearer {token}
     * Stockage : fullName est stocké dans first_name, last_name = null
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update([
            'first_name' => $request->fullName,
            'last_name' => null,
        ]);

        return response()->json([
            'user' => new UserResource($user->fresh()),
        ]);
    }
}
