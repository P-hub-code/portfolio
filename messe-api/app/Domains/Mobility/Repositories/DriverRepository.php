<?php

namespace App\Domains\Mobility\Repositories;

use App\Domains\Identity\Models\User;
use App\Domains\Mobility\Models\Driver;
use Illuminate\Database\Eloquent\Collection;

/**
 * Repository DriverRepository - Gère l'accès aux données des profils chauffeurs
 * 
 * Ce repository encapsule toute la logique d'accès à la base de données
 * pour les profils chauffeurs. Il suit le pattern Repository pour séparer
 * la logique métier de l'accès aux données.
 * 
 * Responsabilités :
 * - Recherche et création de profils chauffeurs
 * - Mise à jour des informations et disponibilité
 * - Recherche de chauffeurs disponibles
 */
class DriverRepository
{
    /**
     * Trouve un profil chauffeur par son ID utilisateur
     * 
     * Cette méthode recherche un profil chauffeur existant pour un utilisateur donné.
     * Retourne null si l'utilisateur n'a pas de profil chauffeur.
     * 
     * Exemple d'utilisation :
     * $driver = $repository->findByUser($user);
     *
     * @param User $user L'utilisateur dont on cherche le profil chauffeur
     * @return Driver|null Le profil chauffeur trouvé ou null s'il n'existe pas
     */
    public function findByUser(User $user): ?Driver
    {
        return Driver::where('user_id', $user->id)
            ->with(['user'])
            ->first();
    }

    /**
     * Trouve un profil chauffeur par son ID
     * 
     * Cette méthode recherche un profil chauffeur par son identifiant unique.
     * 
     * Exemple d'utilisation :
     * $driver = $repository->findById(123);
     *
     * @param int $id L'identifiant du profil chauffeur
     * @return Driver|null Le profil chauffeur trouvé ou null s'il n'existe pas
     */
    public function findById(int $id): ?Driver
    {
        return Driver::with(['user'])->find($id);
    }

    /**
     * Crée un nouveau profil chauffeur
     * 
     * Cette méthode enregistre un nouveau profil chauffeur avec toutes les données
     * fournies. Les données doivent être validées avant l'appel.
     * 
     * Structure attendue de $data :
     * [
     *   'user_id' => int,
     *   'license_number' => string (unique),
     *   'vehicle_type' => string,
     *   'vehicle_plate' => string|null,
     *   'vehicle_model' => string|null,
     *   'vehicle_color' => string|null,
     *   'is_available' => bool,
     *   'status' => 'active' | 'suspended' | 'inactive'
     * ]
     *
     * @param array $data Les données du profil chauffeur à créer
     * @return Driver Le profil chauffeur créé avec son ID
     */
    public function create(array $data): Driver
    {
        return Driver::create($data);
    }

    /**
     * Met à jour les informations d'un profil chauffeur
     * 
     * Cette méthode permet de mettre à jour plusieurs champs d'un profil chauffeur
     * en une seule opération.
     * 
     * Exemple d'utilisation :
     * $repository->update($driver, ['is_available' => true, 'vehicle_color' => 'Rouge']);
     *
     * @param Driver $driver Le profil chauffeur à mettre à jour
     * @param array $data Les données à mettre à jour
     * @return bool True si la mise à jour a réussi, false sinon
     */
    public function update(Driver $driver, array $data): bool
    {
        return $driver->update($data);
    }

    /**
     * Met à jour la disponibilité d'un chauffeur
     * 
     * Cette méthode permet de changer rapidement la disponibilité d'un chauffeur
     * sans avoir à passer toutes les données.
     * 
     * Exemple d'utilisation :
     * $repository->updateAvailability($driver, true); // Rendre disponible
     *
     * @param Driver $driver Le profil chauffeur à mettre à jour
     * @param bool $isAvailable La nouvelle disponibilité (true = disponible, false = non disponible)
     * @return bool True si la mise à jour a réussi, false sinon
     */
    public function updateAvailability(Driver $driver, bool $isAvailable): bool
    {
        return $driver->update(['is_available' => $isAvailable]);
    }

    /**
     * Récupère les chauffeurs disponibles
     * 
     * Cette méthode retourne tous les chauffeurs qui sont :
     * - Actifs (status = 'active')
     * - Disponibles (is_available = true)
     * 
     * Utilisé pour assigner automatiquement un chauffeur à un nouveau trajet.
     * 
     * Exemple d'utilisation :
     * $availableDrivers = $repository->getAvailableDrivers();
     *
     * @return Collection Les chauffeurs disponibles
     */
    public function getAvailableDrivers(): Collection
    {
        return Driver::where('status', 'active')
            ->where('is_available', true)
            ->with(['user'])
            ->get();
    }

    /**
     * Met à jour le nombre total de trajets d'un chauffeur
     * 
     * Cette méthode incrémente le compteur total_trips d'un chauffeur.
     * Utilisée après chaque trajet complété pour maintenir les statistiques.
     * 
     * Exemple d'utilisation :
     * $repository->incrementTotalTrips($driver);
     *
     * @param Driver $driver Le profil chauffeur à mettre à jour
     * @return bool True si la mise à jour a réussi, false sinon
     */
    public function incrementTotalTrips(Driver $driver): bool
    {
        return $driver->increment('total_trips');
    }

    /**
     * Met à jour la note moyenne d'un chauffeur
     * 
     * Cette méthode met à jour la note moyenne (rating) d'un chauffeur.
     * La note doit être calculée en amont (moyenne de toutes les évaluations).
     * 
     * Exemple d'utilisation :
     * $repository->updateRating($driver, 4.5); // Note sur 5
     *
     * @param Driver $driver Le profil chauffeur à mettre à jour
     * @param float $rating La nouvelle note moyenne (entre 0 et 5)
     * @return bool True si la mise à jour a réussi, false sinon
     */
    public function updateRating(Driver $driver, float $rating): bool
    {
        return $driver->update(['rating' => $rating]);
    }
}









