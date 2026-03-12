<?php

namespace App\Http\Controllers;

use App\Core\Services\GoogleMapsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller PlacesController - Gère les requêtes liées à Google Places API
 */
class PlacesController extends Controller
{
    protected GoogleMapsService $googleMapsService;

    public function __construct(GoogleMapsService $googleMapsService)
    {
        $this->googleMapsService = $googleMapsService;
    }

    /**
     * Autocomplétion d'adresses
     */
    public function autocomplete(Request $request): JsonResponse
    {
        $request->validate([
            'input' => 'required|string|min:2|max:255',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
        ]);

        $suggestions = $this->googleMapsService->autocomplete(
            $request->input,
            $request->lat,
            $request->lng
        );

        return response()->json([
            'suggestions' => $suggestions,
        ]);
    }

    /**
     * Détails d'un lieu depuis son place_id
     */
    public function placeDetails(Request $request): JsonResponse
    {
        $request->validate([
            'place_id' => 'required|string',
        ]);

        $details = $this->googleMapsService->getPlaceDetails($request->place_id);

        if (!$details) {
            return response()->json([
                'success' => false,
                'message' => 'Lieu non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'place' => $details,
        ]);
    }

    /**
     * Géocodage : Adresse → Coordonnées GPS
     */
    public function geocode(Request $request): JsonResponse
    {
        $request->validate([
            'address' => 'required|string|max:255',
        ]);

        $result = $this->googleMapsService->geocode($request->address);

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Adresse non trouvée',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'location' => $result,
        ]);
    }

    /**
     * Géocodage inverse : Coordonnées GPS → Adresse
     */
    public function reverseGeocode(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
        ]);

        $result = $this->googleMapsService->reverseGeocode(
            $request->lat,
            $request->lng
        );

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Adresse non trouvée pour ces coordonnées',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'address' => $result,
        ]);
    }

    /**
     * Calcul distance et temps de trajet
     */
    public function route(Request $request): JsonResponse
    {
        $request->validate([
            'origin_lat' => 'required|numeric|between:-90,90',
            'origin_lng' => 'required|numeric|between:-180,180',
            'dest_lat' => 'required|numeric|between:-90,90',
            'dest_lng' => 'required|numeric|between:-180,180',
            'mode' => 'nullable|string|in:driving,walking,bicycling,transit',
        ]);

        $route = $this->googleMapsService->getRouteDistance(
            $request->origin_lat,
            $request->origin_lng,
            $request->dest_lat,
            $request->dest_lng,
            $request->mode ?? 'driving'
        );

        if (!$route) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de calculer l\'itinéraire',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'route' => $route,
        ]);
    }
}






