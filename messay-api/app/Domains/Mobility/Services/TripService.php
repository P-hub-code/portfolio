<?php

namespace App\Domains\Mobility\Services;

use App\Core\Services\GoogleMapsService;
use App\Domains\Identity\Models\User;
use App\Domains\Mobility\Models\Driver;
use App\Domains\Mobility\Models\Trip;
use App\Domains\Mobility\Repositories\DriverRepository;
use App\Domains\Mobility\Repositories\TripRepository;
use App\Domains\Wallet\Services\WalletService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Service TripService - Gère toute la logique métier des trajets
 * 
 * Ce service centralise toute la logique métier liée aux trajets (courses).
 * Il orchestre les repositories et services pour effectuer les opérations complexes
 * tout en garantissant la cohérence des données (transactions atomiques).
 * 
 * Responsabilités :
 * - Création de trajets avec calcul automatique du prix
 * - Assignation automatique de chauffeurs disponibles
 * - Gestion du cycle de vie des trajets (pending → accepted → in_progress → completed)
 * - Débit automatique du wallet lors de l'acceptation
 * - Remboursement automatique en cas d'annulation
 * - Validation des règles métier (solde suffisant, trajet actif, etc.)
 * 
 * Pattern utilisé :
 * - Service Layer : Séparation de la logique métier de la couche présentation
 * - Repository Pattern : Abstraction de l'accès aux données
 * - Transaction Pattern : Garantie de cohérence des données
 */
class TripService
{
    /**
     * Repository pour l'accès aux données des trajets
     *
     * @var TripRepository
     */
    protected TripRepository $tripRepository;
    
    /**
     * Repository pour l'accès aux données des chauffeurs
     *
     * @var DriverRepository
     */
    protected DriverRepository $driverRepository;
    
    /**
     * Service pour les opérations sur les wallets
     *
     * @var WalletService
     */
    protected WalletService $walletService;

    /**
     * Service Google Maps pour calculs de distance et géocodage
     *
     * @var GoogleMapsService
     */
    protected GoogleMapsService $googleMapsService;

    /**
     * Prix de base fixe en FCFA
     * 
     * Frais de base appliqués à chaque trajet.
     *
     * @var float
     */
    protected float $basePrice = 200.00; // 200 FCFA de base

    /**
     * Prix par kilomètre en FCFA
     * 
     * Prix appliqué pour chaque kilomètre parcouru.
     *
     * @var float
     */
    protected float $pricePerKilometer = 100.00; // 100 FCFA par km

    /**
     * Constructeur avec injection de dépendances
     * 
     * Les repositories et services sont injectés automatiquement par le conteneur
     * d'injection de dépendances de Laravel.
     *
     * @param TripRepository $tripRepository
     * @param DriverRepository $driverRepository
     * @param WalletService $walletService
     * @param GoogleMapsService $googleMapsService
     */
    public function __construct(
        TripRepository $tripRepository,
        DriverRepository $driverRepository,
        WalletService $walletService,
        GoogleMapsService $googleMapsService
    ) {
        $this->tripRepository = $tripRepository;
        $this->driverRepository = $driverRepository;
        $this->walletService = $walletService;
        $this->googleMapsService = $googleMapsService;
    }

    /**
     * Crée un nouveau trajet pour un utilisateur
     * 
     * Cette méthode crée un trajet avec les informations fournies, calcule automatiquement
     * le prix selon la distance, et assigne un chauffeur disponible si possible.
     * 
     * Le trajet est créé avec le statut 'pending' (en attente d'acceptation).
     * Le paiement n'est pas débité immédiatement, mais lors de l'acceptation par le chauffeur.
     * 
     * Structure attendue de $data :
     * [
     *   'departure' => string (adresse de départ),
     *   'destination' => string (adresse d'arrivée),
     *   'departure_lat' => float|null (latitude de départ),
     *   'departure_lng' => float|null (longitude de départ),
     *   'destination_lat' => float|null (latitude d'arrivée),
     *   'destination_lng' => float|null (longitude d'arrivée),
     *   'distance' => float|null (distance en km, calculée si non fournie),
     *   'estimated_time' => int|null (temps estimé en minutes)
     * ]
     * 
     * Règles métier :
     * - Un utilisateur ne peut avoir qu'un seul trajet actif à la fois
     * - Le prix est calculé automatiquement selon la distance
     * - Un chauffeur disponible est assigné automatiquement si possible
     * 
     * @param User $user L'utilisateur qui demande le trajet
     * @param array $data Les données du trajet (départ, destination, etc.)
     * @return Trip Le trajet créé
     * @throws \Exception Si l'utilisateur a déjà un trajet actif
     */
    public function createTrip(User $user, array $data): Trip
    {
        // Vérifier qu'il n'y a pas déjà un trajet actif
        $activeTrip = $this->tripRepository->getActiveTripForUser($user);
        if ($activeTrip) {
            throw new \Exception("Vous avez déjà un trajet en cours. Annulez-le d'abord.");
        }

        // Calculer la distance et le temps si non fournis
        if ((!isset($data['distance']) || !isset($data['estimated_time'])) 
            && isset($data['departure_lat'], $data['departure_lng'], $data['destination_lat'], $data['destination_lng'])) {
            
            // Utiliser Google Maps API pour obtenir distance et temps réels par route
            $route = $this->googleMapsService->getRouteDistance(
                $data['departure_lat'],
                $data['departure_lng'],
                $data['destination_lat'],
                $data['destination_lng']
            );

            if ($route) {
                // Distance et temps depuis Google Maps (plus précis)
                $data['distance'] = $route['distance'];
                $data['estimated_time'] = $route['duration'];
            } else {
                // Fallback : calcul Haversine si Google Maps API indisponible
                if (!isset($data['distance'])) {
                    $data['distance'] = $this->calculateDistance(
                        $data['departure_lat'],
                        $data['departure_lng'],
                        $data['destination_lat'],
                        $data['destination_lng']
                    );
                }
                if (!isset($data['estimated_time'])) {
                    $data['estimated_time'] = $this->calculateEstimatedTime($data['distance']);
                }
            }
        }

        // Calculer le prix selon la distance
        $data['price'] = $this->calculatePrice($data['distance'] ?? 0);

        // Ajouter l'utilisateur et définir le statut initial
        $data['user_id'] = $user->id;
        $data['status'] = 'pending';
        $data['payment_status'] = 'pending';

        // Créer le trajet
        $trip = $this->tripRepository->create($data);

        // Essayer d'assigner un chauffeur disponible automatiquement
        $this->assignAvailableDriver($trip);

        Log::info("Trajet créé", [
            'trip_id' => $trip->id,
            'user_id' => $user->id,
            'price' => $trip->price,
            'distance' => $trip->distance,
        ]);

        return $trip;
    }

    /**
     * Assign un chauffeur disponible à un trajet
     * 
     * Cette méthode recherche un chauffeur disponible et l'assigne au trajet.
     * Si aucun chauffeur n'est disponible, le trajet reste en attente.
     * 
     * @param Trip $trip Le trajet à assigner
     * @return Driver|null Le chauffeur assigné ou null si aucun disponible
     */
    public function assignAvailableDriver(Trip $trip): ?Driver
    {
        // Récupérer les chauffeurs disponibles
        $availableDrivers = $this->driverRepository->getAvailableDrivers();

        if ($availableDrivers->isEmpty()) {
            Log::info("Aucun chauffeur disponible pour le trajet", ['trip_id' => $trip->id]);
            return null;
        }

        // Pour l'instant, on prend le premier chauffeur disponible
        // TODO: Implémenter un algorithme plus sophistiqué (proximité, note, etc.)
        $driver = $availableDrivers->first();

        // Assigner le chauffeur au trajet
        $this->tripRepository->update($trip, [
            'driver_id' => $driver->id,
            'status' => 'accepted',
        ]);

        Log::info("Chauffeur assigné au trajet", [
            'trip_id' => $trip->id,
            'driver_id' => $driver->id,
        ]);

        return $driver;
    }

    /**
     * Accepte un trajet (pour un chauffeur)
     * 
     * Cette méthode permet à un chauffeur d'accepter un trajet qui lui a été assigné.
     * Le paiement est débité du wallet du passager à ce moment-là.
     * 
     * Règles métier :
     * - Le trajet doit être en statut 'pending' ou 'accepted'
     * - Le chauffeur doit être disponible
     * - Le wallet du passager doit avoir un solde suffisant
     * 
     * @param Trip $trip Le trajet à accepter
     * @param Driver $driver Le chauffeur qui accepte
     * @return Trip Le trajet mis à jour
     * @throws \Exception Si le trajet ne peut pas être accepté
     */
    public function acceptTrip(Trip $trip, Driver $driver): Trip
    {
        // Vérifier que le trajet peut être accepté
        if (!$trip->isPending() && !$trip->isAccepted()) {
            throw new \Exception("Ce trajet ne peut plus être accepté.");
        }

        // Vérifier que le chauffeur est disponible
        if (!$driver->isAvailable()) {
            throw new \Exception("Vous n'êtes pas disponible pour accepter ce trajet.");
        }

        // Vérifier que le trajet est bien assigné à ce chauffeur
        if ($trip->driver_id !== $driver->id) {
            throw new \Exception("Ce trajet n'est pas assigné à vous.");
        }

        // Débiter le wallet du passager
        DB::beginTransaction();
        try {
            // Débiter le wallet
            $transaction = $this->walletService->debit(
                $trip->user,
                $trip->price,
                "Paiement trajet #{$trip->id}",
                'payment',
                ['trip_id' => $trip->id, 'driver_id' => $driver->id]
            );

            // Mettre à jour le trajet
            $this->tripRepository->update($trip, [
                'status' => 'accepted',
                'payment_status' => 'paid',
                'transaction_id' => $transaction->id,
            ]);

            DB::commit();

            Log::info("Trajet accepté et payé", [
                'trip_id' => $trip->id,
                'driver_id' => $driver->id,
                'transaction_id' => $transaction->id,
            ]);

            return $trip->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur lors de l'acceptation du trajet", [
                'trip_id' => $trip->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Démarre un trajet (pour un chauffeur)
     * 
     * Cette méthode marque le début effectif du trajet lorsque le chauffeur
     * démarre la course.
     * 
     * @param Trip $trip Le trajet à démarrer
     * @return Trip Le trajet mis à jour
     * @throws \Exception Si le trajet ne peut pas être démarré
     */
    public function startTrip(Trip $trip): Trip
    {
        if (!$trip->isAccepted()) {
            throw new \Exception("Ce trajet doit être accepté avant de pouvoir démarrer.");
        }

        $this->tripRepository->update($trip, [
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        Log::info("Trajet démarré", ['trip_id' => $trip->id]);

        return $trip->fresh();
    }

    /**
     * Termine un trajet (pour un chauffeur)
     * 
     * Cette méthode marque la fin du trajet lorsque le chauffeur arrive
     * à destination.
     * 
     * @param Trip $trip Le trajet à terminer
     * @return Trip Le trajet mis à jour
     * @throws \Exception Si le trajet ne peut pas être terminé
     */
    public function completeTrip(Trip $trip): Trip
    {
        if (!$trip->isInProgress()) {
            throw new \Exception("Ce trajet doit être en cours pour pouvoir être terminé.");
        }

        $this->tripRepository->update($trip, [
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // Incrémenter le nombre de trajets du chauffeur
        if ($trip->driver) {
            $this->driverRepository->incrementTotalTrips($trip->driver);
        }

        Log::info("Trajet terminé", ['trip_id' => $trip->id]);

        return $trip->fresh();
    }

    /**
     * Annule un trajet
     * 
     * Cette méthode annule un trajet et rembourse automatiquement le passager
     * si le paiement avait déjà été effectué.
     * 
     * Règles métier :
     * - Seul le passager ou le chauffeur peut annuler
     * - Si le trajet est payé, un remboursement automatique est effectué
     * - Le trajet ne peut pas être annulé s'il est déjà terminé
     * 
     * @param Trip $trip Le trajet à annuler
     * @param User $user L'utilisateur qui annule (passager ou chauffeur)
     * @param string|null $reason La raison de l'annulation (optionnel)
     * @return Trip Le trajet annulé
     * @throws \Exception Si le trajet ne peut pas être annulé
     */
    public function cancelTrip(Trip $trip, User $user, ?string $reason = null): Trip
    {
        // Vérifier que le trajet peut être annulé
        if (!$trip->canBeCancelled()) {
            throw new \Exception("Ce trajet ne peut plus être annulé.");
        }

        // Déterminer qui annule
        $cancelledBy = 'user';
        if ($trip->driver_id && $user->id === $trip->driver->user_id) {
            $cancelledBy = 'driver';
        }

        DB::beginTransaction();
        try {
            // Rembourser si le trajet était payé
            if ($trip->isPaid() && $trip->transaction_id) {
                $this->walletService->credit(
                    $trip->user,
                    $trip->price,
                    "Remboursement trajet #{$trip->id} annulé",
                    'refund',
                    ['trip_id' => $trip->id, 'original_transaction_id' => $trip->transaction_id]
                );

                $this->tripRepository->update($trip, [
                    'payment_status' => 'refunded',
                ]);
            }

            // Annuler le trajet
            $this->tripRepository->update($trip, [
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancelled_by' => $cancelledBy,
                'cancellation_reason' => $reason,
            ]);

            DB::commit();

            Log::info("Trajet annulé", [
                'trip_id' => $trip->id,
                'cancelled_by' => $cancelledBy,
                'reason' => $reason,
            ]);

            return $trip->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur lors de l'annulation du trajet", [
                'trip_id' => $trip->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Récupère un trajet par son ID
     * 
     * @param int $tripId L'identifiant du trajet
     * @return Trip Le trajet trouvé
     * @throws \Exception Si le trajet n'existe pas
     */
    public function getTrip(int $tripId): Trip
    {
        $trip = $this->tripRepository->findById($tripId);
        
        if (!$trip) {
            throw new \Exception("Trajet non trouvé.");
        }

        return $trip;
    }

    /**
     * Récupère le trajet actif d'un utilisateur
     * 
     * @param User $user L'utilisateur
     * @return Trip|null Le trajet actif ou null
     */
    public function getActiveTrip(User $user): ?Trip
    {
        return $this->tripRepository->getActiveTripForUser($user);
    }

    /**
     * Récupère l'historique des trajets d'un utilisateur
     * 
     * @param User $user L'utilisateur
     * @param array $filters Les filtres à appliquer (optionnel)
     * @param int $perPage Le nombre de résultats par page (défaut: 15)
     * @return \Illuminate\Pagination\LengthAwarePaginator Les trajets paginés
     */
    public function getTrips(User $user, array $filters = [], int $perPage = 15)
    {
        return $this->tripRepository->getByUser($user, $filters, $perPage);
    }

    /**
     * Calcule le prix d'un trajet selon la distance
     * 
     * Formule : prix = 200 + (distance × 100)
     * 
     * @param float $distance La distance en kilomètres
     * @return float Le prix en FCFA
     */
    protected function calculatePrice(float $distance): float
    {
        return $this->basePrice + ($distance * $this->pricePerKilometer);
    }

    /**
     * Calcule la distance entre deux points GPS (formule de Haversine)
     * 
     * @param float $lat1 Latitude du point de départ
     * @param float $lng1 Longitude du point de départ
     * @param float $lat2 Latitude du point d'arrivée
     * @param float $lng2 Longitude du point d'arrivée
     * @return float La distance en kilomètres
     */
    protected function calculateDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371; // Rayon de la Terre en km

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($earthRadius * $c, 2);
    }

    /**
     * Calcule le temps estimé d'un trajet selon la distance
     * 
     * Formule simplifiée : temps = distance * vitesse_moyenne
     * Vitesse moyenne estimée : 30 km/h en ville
     * 
     * @param float $distance La distance en kilomètres
     * @return int Le temps estimé en minutes
     */
    protected function calculateEstimatedTime(float $distance): int
    {
        $averageSpeed = 30; // km/h
        $timeInHours = $distance / $averageSpeed;
        return (int) round($timeInHours * 60); // Convertir en minutes
    }
}



