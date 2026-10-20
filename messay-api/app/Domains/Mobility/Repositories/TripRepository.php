<?php

namespace App\Domains\Mobility\Repositories;

use App\Domains\Identity\Models\User;
use App\Domains\Mobility\Models\Trip;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Repository TripRepository - Gère l'accès aux données des trajets
 * 
 * Ce repository encapsule toute la logique d'accès à la base de données
 * pour les trajets. Il suit le pattern Repository pour séparer la logique
 * métier (dans TripService) de l'accès aux données.
 * 
 * Responsabilités :
 * - Création de trajets
 * - Recherche et filtrage de trajets
 * - Mise à jour des statuts
 * - Pagination des résultats
 */
class TripRepository
{
    /**
     * Crée un nouveau trajet dans la base de données
     * 
     * Cette méthode enregistre un nouveau trajet avec toutes les données
     * fournies. Les données doivent être validées avant l'appel.
     * 
     * Structure attendue de $data :
     * [
     *   'user_id' => int,
     *   'driver_id' => int|null,
     *   'departure' => string,
     *   'destination' => string,
     *   'departure_lat' => float|null,
     *   'departure_lng' => float|null,
     *   'destination_lat' => float|null,
     *   'destination_lng' => float|null,
     *   'distance' => float|null,
     *   'estimated_time' => int|null,
     *   'price' => float,
     *   'status' => 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled',
     *   'payment_status' => 'pending' | 'paid' | 'refunded',
     *   ...
     * ]
     *
     * @param array $data Les données du trajet à créer
     * @return Trip Le trajet créé avec son ID
     */
    public function create(array $data): Trip
    {
        return Trip::create($data);
    }

    /**
     * Trouve un trajet par son ID
     * 
     * Cette méthode recherche un trajet spécifique par son identifiant unique.
     * Les relations (user, driver, transaction) sont chargées automatiquement
     * pour éviter les requêtes N+1.
     * 
     * Exemple d'utilisation :
     * $trip = $repository->findById(123);
     *
     * @param int $id L'identifiant du trajet
     * @return Trip|null Le trajet trouvé ou null s'il n'existe pas
     */
    public function findById(int $id): ?Trip
    {
        return Trip::with(['user', 'driver', 'transaction'])
            ->find($id);
    }

    /**
     * Récupère les trajets d'un utilisateur avec filtres et pagination
     * 
     * Cette méthode permet de récupérer l'historique des trajets d'un utilisateur
     * avec des options de filtrage (par statut, date, etc.) et de pagination.
     * 
     * Filtres disponibles dans $filters :
     * - 'status' : Filtrer par statut (pending, accepted, in_progress, completed, cancelled)
     * - 'payment_status' : Filtrer par statut de paiement (pending, paid, refunded)
     * - 'date_from' : Date de début pour filtrer par période
     * - 'date_to' : Date de fin pour filtrer par période
     * 
     * Exemple d'utilisation :
     * $trips = $repository->getByUser($user, ['status' => 'completed'], 15);
     *
     * @param User $user L'utilisateur dont on veut les trajets
     * @param array $filters Les filtres à appliquer (optionnel)
     * @param int $perPage Le nombre de résultats par page (défaut: 15)
     * @return LengthAwarePaginator Les trajets paginés
     */
    public function getByUser(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Trip::where('user_id', $user->id)
            ->with(['driver', 'transaction'])
            ->orderBy('created_at', 'desc');

        // Appliquer les filtres
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        if (isset($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->paginate($perPage);
    }

    /**
     * Récupère le trajet actif d'un utilisateur
     * 
     * Un trajet actif est un trajet qui n'est pas terminé ou annulé
     * (status: pending, accepted, in_progress).
     * 
     * Un utilisateur ne peut avoir qu'un seul trajet actif à la fois.
     * 
     * Exemple d'utilisation :
     * $activeTrip = $repository->getActiveTripForUser($user);
     *
     * @param User $user L'utilisateur dont on cherche le trajet actif
     * @return Trip|null Le trajet actif ou null s'il n'y en a pas
     */
    public function getActiveTripForUser(User $user): ?Trip
    {
        return Trip::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'accepted', 'in_progress'])
            ->with(['driver', 'transaction'])
            ->latest()
            ->first();
    }

    /**
     * Récupère les trajets disponibles pour les chauffeurs
     * 
     * Cette méthode retourne les trajets en attente (pending) qui peuvent
     * être acceptés par des chauffeurs disponibles.
     * 
     * Utilisé par les chauffeurs pour voir les trajets disponibles.
     * 
     * Exemple d'utilisation :
     * $availableTrips = $repository->getAvailableTrips(10);
     *
     * @param int $limit Le nombre maximum de trajets à retourner (défaut: 10)
     * @return Collection Les trajets disponibles
     */
    public function getAvailableTrips(int $limit = 10): Collection
    {
        return Trip::where('status', 'pending')
            ->whereNull('driver_id')
            ->with(['user'])
            ->orderBy('created_at', 'asc')
            ->limit($limit)
            ->get();
    }

    /**
     * Récupère les trajets d'un chauffeur avec filtres et pagination
     * 
     * Cette méthode permet de récupérer l'historique des trajets d'un chauffeur
     * avec des options de filtrage et de pagination.
     * 
     * Exemple d'utilisation :
     * $trips = $repository->getByDriver($driver, ['status' => 'completed'], 15);
     *
     * @param int $driverId L'identifiant du chauffeur
     * @param array $filters Les filtres à appliquer (optionnel)
     * @param int $perPage Le nombre de résultats par page (défaut: 15)
     * @return LengthAwarePaginator Les trajets paginés
     */
    public function getByDriver(int $driverId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Trip::where('driver_id', $driverId)
            ->with(['user', 'transaction'])
            ->orderBy('created_at', 'desc');

        // Appliquer les filtres
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        return $query->paginate($perPage);
    }

    /**
     * Met à jour le statut d'un trajet
     * 
     * Cette méthode permet de changer le statut d'un trajet.
     * 
     * Statuts possibles :
     * - 'pending' : En attente d'acceptation
     * - 'accepted' : Accepté par un chauffeur
     * - 'in_progress' : En cours
     * - 'completed' : Terminé
     * - 'cancelled' : Annulé
     * 
     * Exemple d'utilisation :
     * $repository->updateStatus($trip, 'accepted');
     *
     * @param Trip $trip Le trajet à mettre à jour
     * @param string $status Le nouveau statut à définir
     * @return bool True si la mise à jour a réussi, false sinon
     */
    public function updateStatus(Trip $trip, string $status): bool
    {
        return $trip->update(['status' => $status]);
    }

    /**
     * Met à jour les informations d'un trajet
     * 
     * Cette méthode permet de mettre à jour plusieurs champs d'un trajet
     * en une seule opération.
     * 
     * Exemple d'utilisation :
     * $repository->update($trip, ['driver_id' => 5, 'status' => 'accepted']);
     *
     * @param Trip $trip Le trajet à mettre à jour
     * @param array $data Les données à mettre à jour
     * @return bool True si la mise à jour a réussi, false sinon
     */
    public function update(Trip $trip, array $data): bool
    {
        return $trip->update($data);
    }
}









