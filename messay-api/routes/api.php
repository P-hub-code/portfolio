<?php

/**
 * Routes API MESSÉ
 * - Routes publiques : /api/auth/* (inscription, connexion, OTP)
 * - Routes protégées : Nécessitent Authorization: Bearer {token}
 */

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlacesController;
use App\Http\Controllers\TripController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

// Routes d'authentification (publiques)
// OTP désactivé : Firebase Phone Auth gère l'inscription/connexion côté mobile (retour 410)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOTP']);
    Route::post('/resend-otp', [AuthController::class, 'resendOTP']);
});

// Routes protégées (nécessitent token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::post('/auth/logout', [AuthController::class, 'logout']);     // Déconnexion
    Route::get('/user', [AuthController::class, 'user']);               // Informations utilisateur
    Route::put('/user', [AuthController::class, 'updateProfile']);      // Mettre à jour profil (fullName)

    // Wallet
    Route::prefix('wallet')->group(function () {
        Route::get('/', [WalletController::class, 'index']);             // Solde du wallet
        Route::post('/recharge', [WalletController::class, 'recharge']); // Recharger le wallet
        Route::get('/transactions', [WalletController::class, 'transactions']); // Historique transactions
        Route::post('/transfert', [WalletController::class, 'transfert']); // Transférer de l'argent
    });

    // Mobility (Trajets)
    Route::prefix('mobility/trips')->group(function () {
        Route::post('/', [TripController::class, 'store']);              // Créer un trajet
        Route::get('/', [TripController::class, 'index']);              // Liste des trajets
        Route::get('/active', [TripController::class, 'active']);       // Trajet actif
        Route::get('/{id}', [TripController::class, 'show']);            // Détails d'un trajet
        Route::post('/{id}/cancel', [TripController::class, 'cancel']); // Annuler un trajet
        Route::post('/{id}/accept', [TripController::class, 'accept']); // Accepter un trajet (chauffeur)
        Route::post('/{id}/start', [TripController::class, 'start']);   // Démarrer un trajet (chauffeur)
        Route::post('/{id}/complete', [TripController::class, 'complete']); // Terminer un trajet (chauffeur)
    });

    // Places (Google Maps)
    Route::prefix('places')->group(function () {
        Route::get('/autocomplete', [PlacesController::class, 'autocomplete']); // Autocomplétion d'adresses
        Route::get('/details', [PlacesController::class, 'placeDetails']);      // Détails d'un lieu
        Route::get('/geocode', [PlacesController::class, 'geocode']);           // Adresse → Coordonnées
        Route::get('/reverse-geocode', [PlacesController::class, 'reverseGeocode']); // Coordonnées → Adresse
        Route::get('/route', [PlacesController::class, 'route']);                // Distance et temps de trajet
    });
});
