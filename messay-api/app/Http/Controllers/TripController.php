<?php

namespace App\Http\Controllers;

use App\Domains\Identity\Models\User;
use App\Domains\Mobility\Models\Driver;
use App\Domains\Mobility\Models\Trip;
use App\Domains\Mobility\Repositories\DriverRepository;
use App\Domains\Mobility\Services\TripService;
use App\Http\Requests\CancelTripRequest;
use App\Http\Requests\CreateTripRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller TripController - Gère les requêtes HTTP liées aux trajets
 */
class TripController extends Controller
{
    protected TripService $tripService;
    protected DriverRepository $driverRepository;

    public function __construct(
        TripService $tripService,
        DriverRepository $driverRepository
    ) {
        $this->tripService = $tripService;
        $this->driverRepository = $driverRepository;
    }

    /**
     * Crée une nouvelle demande de trajet
     */
    public function store(CreateTripRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $data = $request->only([
                'departure',
                'destination',
                'departure_lat',
                'departure_lng',
                'destination_lat',
                'destination_lng',
                'distance',
                'estimated_time',
            ]);

            $trip = $this->tripService->createTrip($user, $data);
            return response()->json([
                'success' => true,
                'message' => 'Trajet créé avec succès',
                'trip' => [
                    'id' => $trip->id,
                    'departure' => $trip->departure,
                    'destination' => $trip->destination,
                    'distance' => $trip->distance,
                    'estimated_time' => $trip->estimated_time,
                    'price' => $trip->price,
                    'status' => $trip->status,
                    'payment_status' => $trip->payment_status,
                    'driver' => $trip->driver ? [
                        'id' => $trip->driver->id,
                        'user' => [
                            'id' => $trip->driver->user->id,
                            'firstName' => $trip->driver->user->first_name,
                            'lastName' => $trip->driver->user->last_name,
                            'phone' => $trip->driver->user->telephone,
                        ],
                        'vehicle_type' => $trip->driver->vehicle_type,
                        'vehicle_plate' => $trip->driver->vehicle_plate,
                        'rating' => $trip->driver->rating,
                    ] : null,
                    'created_at' => $trip->created_at,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $filters = [
            'status' => $request->status,
            'payment_status' => $request->payment_status,
        ];
        $filters = array_filter($filters, fn($value) => $value !== null);
        $trips = $this->tripService->getTrips($user, $filters, 15);
        $formattedTrips = $trips->map(function ($trip) {
            return [
                'id' => $trip->id,
                'departure' => $trip->departure,
                'destination' => $trip->destination,
                'distance' => $trip->distance,
                'estimated_time' => $trip->estimated_time,
                'price' => $trip->price,
                'status' => $trip->status,
                'payment_status' => $trip->payment_status,
                'driver' => $trip->driver ? [
                    'id' => $trip->driver->id,
                    'user' => [
                        'firstName' => $trip->driver->user->first_name,
                        'lastName' => $trip->driver->user->last_name,
                    ],
                    'vehicle_type' => $trip->driver->vehicle_type,
                ] : null,
                'created_at' => $trip->created_at,
                'completed_at' => $trip->completed_at,
            ];
        });
        return response()->json([
            'trips' => $formattedTrips,
            'pagination' => [
                'current_page' => $trips->currentPage(),
                'last_page' => $trips->lastPage(),
                'per_page' => $trips->perPage(),
                'total' => $trips->total(),
            ],
        ]);
    }

    public function active(Request $request): JsonResponse
    {
        $user = $request->user();
        $trip = $this->tripService->getActiveTrip($user);

        if (!$trip) {
            return response()->json(['trip' => null]);
        }

        return response()->json([
            'trip' => [
                'id' => $trip->id,
                'departure' => $trip->departure,
                'destination' => $trip->destination,
                'distance' => $trip->distance,
                'estimated_time' => $trip->estimated_time,
                'price' => $trip->price,
                'status' => $trip->status,
                'payment_status' => $trip->payment_status,
                'driver' => $trip->driver ? [
                    'id' => $trip->driver->id,
                    'user' => [
                        'firstName' => $trip->driver->user->first_name,
                        'lastName' => $trip->driver->user->last_name,
                        'phone' => $trip->driver->user->telephone,
                    ],
                    'vehicle_type' => $trip->driver->vehicle_type,
                    'vehicle_plate' => $trip->driver->vehicle_plate,
                    'rating' => $trip->driver->rating,
                ] : null,
                'started_at' => $trip->started_at,
                'created_at' => $trip->created_at,
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        try {
            $trip = $this->tripService->getTrip($id);
            return response()->json([
                'trip' => [
                    'id' => $trip->id,
                    'departure' => $trip->departure,
                    'destination' => $trip->destination,
                    'distance' => $trip->distance,
                    'estimated_time' => $trip->estimated_time,
                    'price' => $trip->price,
                    'status' => $trip->status,
                    'payment_status' => $trip->payment_status,
                    'driver' => $trip->driver ? [
                        'id' => $trip->driver->id,
                        'user' => [
                            'firstName' => $trip->driver->user->first_name,
                            'lastName' => $trip->driver->user->last_name,
                            'phone' => $trip->driver->user->telephone,
                        ],
                        'vehicle_type' => $trip->driver->vehicle_type,
                        'vehicle_plate' => $trip->driver->vehicle_plate,
                        'rating' => $trip->driver->rating,
                    ] : null,
                    'cancelled_at' => $trip->cancelled_at,
                    'cancelled_by' => $trip->cancelled_by,
                    'cancellation_reason' => $trip->cancellation_reason,
                    'started_at' => $trip->started_at,
                    'completed_at' => $trip->completed_at,
                    'created_at' => $trip->created_at,
                ],
            ]);
        } catch (\Exception $e) {
            // En cas d'erreur, retourner un message d'erreur
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404); // Code HTTP 404 Not Found
        }
    }

    public function cancel(int $id, CancelTripRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $trip = $this->tripService->getTrip($id);

            if (
                $trip->user_id !== $user->id &&
                (!$trip->driver_id || $trip->driver->user_id !== $user->id)
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à annuler ce trajet.',
                ], 403);
            }

            $trip = $this->tripService->cancelTrip($trip, $user, $request->reason);
            return response()->json([
                'success' => true,
                'message' => 'Trajet annulé avec succès',
                'trip' => [
                    'id' => $trip->id,
                    'status' => $trip->status,
                    'payment_status' => $trip->payment_status,
                    'cancelled_at' => $trip->cancelled_at,
                    'cancelled_by' => $trip->cancelled_by,
                    'cancellation_reason' => $trip->cancellation_reason,
                ],
            ]);
        } catch (\Exception $e) {
            // En cas d'erreur, retourner un message d'erreur
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function accept(int $id, Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user->isDriver()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous devez être un chauffeur pour accepter un trajet.',
                ], 403);
            }

            $driver = $this->driverRepository->findByUser($user);
            if (!$driver) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profil chauffeur non trouvé.',
                ], 404);
            }

            $trip = $this->tripService->getTrip($id);
            $trip = $this->tripService->acceptTrip($trip, $driver);
            return response()->json([
                'success' => true,
                'message' => 'Trajet accepté avec succès',
                'trip' => [
                    'id' => $trip->id,
                    'status' => $trip->status,
                    'payment_status' => $trip->payment_status,
                ],
            ]);
        } catch (\Exception $e) {
            // En cas d'erreur, retourner un message d'erreur
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function start(int $id, Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $trip = $this->tripService->getTrip($id);

            if (!$trip->driver_id || $trip->driver->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à démarrer ce trajet.',
                ], 403);
            }

            $trip = $this->tripService->startTrip($trip);
            return response()->json([
                'success' => true,
                'message' => 'Trajet démarré avec succès',
                'trip' => [
                    'id' => $trip->id,
                    'status' => $trip->status,
                    'started_at' => $trip->started_at,
                ],
            ]);
        } catch (\Exception $e) {
            // En cas d'erreur, retourner un message d'erreur
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function complete(int $id, Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $trip = $this->tripService->getTrip($id);

            if (!$trip->driver_id || $trip->driver->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à terminer ce trajet.',
                ], 403);
            }

            $trip = $this->tripService->completeTrip($trip);
            return response()->json([
                'success' => true,
                'message' => 'Trajet terminé avec succès',
                'trip' => [
                    'id' => $trip->id,
                    'status' => $trip->status,
                    'completed_at' => $trip->completed_at,
                ],
            ]);
        } catch (\Exception $e) {
            // En cas d'erreur, retourner un message d'erreur
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
