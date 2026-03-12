<?php

namespace App\Core\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service GoogleMapsService - Intégration avec Google Maps API
 * 
 * Ce service permet d'utiliser les APIs Google Maps côté backend pour :
 * - Calculer la distance réelle par route (Directions API)
 * - Obtenir le temps de trajet avec conditions de trafic (Directions API)
 * - Convertir une adresse en coordonnées GPS (Geocoding API)
 * - Convertir des coordonnées GPS en adresse (Reverse Geocoding API)
 * - Obtenir l'autocomplétion d'adresses (Places API)
 * 
 * Configuration requise :
 * - Clé API Google Maps dans .env : GOOGLE_MAPS_API_KEY
 * - APIs activées : Directions API, Geocoding API, Places API
 */
class GoogleMapsService
{
    /**
     * URL de base pour les APIs Google Maps
     */
    protected string $baseUrl = 'https://maps.googleapis.com/maps/api';

    /**
     * Clé API Google Maps (depuis .env)
     */
    protected ?string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.google_maps.api_key');
        
        if (empty($this->apiKey)) {
            Log::warning('Google Maps API Key non configurée dans .env');
        }
    }

    /**
     * Calcule la distance et le temps de trajet entre deux points
     * 
     * Utilise la Directions API pour obtenir la distance réelle par route
     * et le temps estimé avec conditions de trafic.
     * 
     * @param float $originLat Latitude du point de départ
     * @param float $originLng Longitude du point de départ
     * @param float $destLat Latitude du point d'arrivée
     * @param float $destLng Longitude du point d'arrivée
     * @param string $mode Mode de transport : 'driving', 'walking', 'bicycling', 'transit'
     * @return array|null ['distance' => float (km), 'duration' => int (minutes), 'polyline' => string]
     */
    public function getRouteDistance(
        float $originLat,
        float $originLng,
        float $destLat,
        float $destLng,
        string $mode = 'driving'
    ): ?array {
        if (empty($this->apiKey)) {
            return null;
        }

        try {
            $url = "{$this->baseUrl}/directions/json";
            
            $response = Http::get($url, [
                'origin' => "{$originLat},{$originLng}",
                'destination' => "{$destLat},{$destLng}",
                'mode' => $mode,
                'key' => $this->apiKey,
                'language' => 'fr',
                'region' => 'ci', // Côte d'Ivoire
            ]);

            if (!$response->successful()) {
                Log::error('Erreur Google Directions API', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            $data = $response->json();

            if ($data['status'] !== 'OK' || empty($data['routes'])) {
                Log::warning('Aucun itinéraire trouvé', ['status' => $data['status']]);
                return null;
            }

            $route = $data['routes'][0];
            $leg = $route['legs'][0];

            // Distance en mètres → kilomètres
            $distanceKm = $leg['distance']['value'] / 1000;
            
            // Durée en secondes → minutes
            $durationMinutes = (int) round($leg['duration']['value'] / 60);

            // Polyline pour tracer l'itinéraire sur la carte
            $polyline = $route['overview_polyline']['points'] ?? null;

            return [
                'distance' => round($distanceKm, 2),
                'duration' => $durationMinutes,
                'polyline' => $polyline,
            ];
        } catch (\Exception $e) {
            Log::error('Exception Google Directions API', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Convertit une adresse en coordonnées GPS (géocodage)
     * 
     * @param string $address Adresse complète (ex: "Plateau, Abidjan, Côte d'Ivoire")
     * @return array|null ['lat' => float, 'lng' => float, 'formatted_address' => string]
     */
    public function geocode(string $address): ?array
    {
        if (empty($this->apiKey)) {
            return null;
        }

        try {
            $url = "{$this->baseUrl}/geocode/json";
            
            $response = Http::get($url, [
                'address' => $address,
                'key' => $this->apiKey,
                'language' => 'fr',
                'region' => 'ci',
            ]);

            if (!$response->successful()) {
                Log::error('Erreur Google Geocoding API', [
                    'status' => $response->status(),
                ]);
                return null;
            }

            $data = $response->json();

            if ($data['status'] !== 'OK' || empty($data['results'])) {
                return null;
            }

            $result = $data['results'][0];
            $location = $result['geometry']['location'];

            return [
                'lat' => $location['lat'],
                'lng' => $location['lng'],
                'formatted_address' => $result['formatted_address'],
            ];
        } catch (\Exception $e) {
            Log::error('Exception Google Geocoding API', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Convertit des coordonnées GPS en adresse (géocodage inverse)
     * 
     * @param float $lat Latitude
     * @param float $lng Longitude
     * @return array|null ['formatted_address' => string, 'components' => array]
     */
    public function reverseGeocode(float $lat, float $lng): ?array
    {
        if (empty($this->apiKey)) {
            return null;
        }

        try {
            $url = "{$this->baseUrl}/geocode/json";
            
            $response = Http::get($url, [
                'latlng' => "{$lat},{$lng}",
                'key' => $this->apiKey,
                'language' => 'fr',
                'region' => 'ci',
            ]);

            if (!$response->successful()) {
                Log::error('Erreur Google Reverse Geocoding API', [
                    'status' => $response->status(),
                ]);
                return null;
            }

            $data = $response->json();

            if ($data['status'] !== 'OK' || empty($data['results'])) {
                return null;
            }

            $result = $data['results'][0];

            return [
                'formatted_address' => $result['formatted_address'],
                'components' => $result['address_components'],
            ];
        } catch (\Exception $e) {
            Log::error('Exception Google Reverse Geocoding API', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Recherche d'autocomplétion d'adresses (Places API)
     * 
     * @param string $input Texte saisi par l'utilisateur
     * @param float|null $lat Latitude pour biaiser la recherche (optionnel)
     * @param float|null $lng Longitude pour biaiser la recherche (optionnel)
     * @return array Liste de suggestions d'adresses
     */
    public function autocomplete(string $input, ?float $lat = null, ?float $lng = null): array
    {
        if (empty($this->apiKey)) {
            return [];
        }

        try {
            $url = "{$this->baseUrl}/place/autocomplete/json";
            
            $params = [
                'input' => $input,
                'key' => $this->apiKey,
                'language' => 'fr',
                'components' => 'country:ci', // Limiter à la Côte d'Ivoire
            ];

            // Biaiser la recherche vers une position si fournie
            if ($lat && $lng) {
                $params['location'] = "{$lat},{$lng}";
                $params['radius'] = 50000; // 50 km
            }

            $response = Http::get($url, $params);

            if (!$response->successful()) {
                Log::error('Erreur Google Places Autocomplete API', [
                    'status' => $response->status(),
                ]);
                return [];
            }

            $data = $response->json();

            if ($data['status'] !== 'OK' && $data['status'] !== 'ZERO_RESULTS') {
                Log::warning('Places Autocomplete API status', ['status' => $data['status']]);
                return [];
            }

            $predictions = $data['predictions'] ?? [];

            return array_map(function ($prediction) {
                return [
                    'place_id' => $prediction['place_id'],
                    'description' => $prediction['description'],
                    'main_text' => $prediction['structured_formatting']['main_text'] ?? '',
                    'secondary_text' => $prediction['structured_formatting']['secondary_text'] ?? '',
                ];
            }, $predictions);
        } catch (\Exception $e) {
            Log::error('Exception Google Places Autocomplete API', [
                'message' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Récupère les détails d'un lieu à partir de son place_id
     * 
     * @param string $placeId Place ID de Google Places
     * @return array|null ['lat' => float, 'lng' => float, 'formatted_address' => string]
     */
    public function getPlaceDetails(string $placeId): ?array
    {
        if (empty($this->apiKey)) {
            return null;
        }

        try {
            $url = "{$this->baseUrl}/place/details/json";
            
            $response = Http::get($url, [
                'place_id' => $placeId,
                'key' => $this->apiKey,
                'language' => 'fr',
                'fields' => 'geometry,formatted_address',
            ]);

            if (!$response->successful()) {
                Log::error('Erreur Google Places Details API', [
                    'status' => $response->status(),
                ]);
                return null;
            }

            $data = $response->json();

            if ($data['status'] !== 'OK' || !isset($data['result'])) {
                return null;
            }

            $result = $data['result'];
            $location = $result['geometry']['location'];

            return [
                'lat' => $location['lat'],
                'lng' => $location['lng'],
                'formatted_address' => $result['formatted_address'],
            ];
        } catch (\Exception $e) {
            Log::error('Exception Google Places Details API', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }
}

