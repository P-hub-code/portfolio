<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécute la migration : crée la table des profils chauffeurs.
     * 
     * Cette table stocke les informations spécifiques aux chauffeurs (conducteurs de tricycles).
     * Chaque chauffeur est lié à un utilisateur (relation 1:1 avec la table users).
     * 
     * Structure de la table :
     * - id : Identifiant unique du profil chauffeur
     * - user_id : Référence vers l'utilisateur (unique, cascade sur suppression)
     * - license_number : Numéro de permis de conduire (unique)
     * - vehicle_type : Type de véhicule (tricycle par défaut)
     * - vehicle_plate : Numéro de plaque d'immatriculation
     * - vehicle_model : Modèle du véhicule (optionnel)
     * - vehicle_color : Couleur du véhicule (optionnel)
     * - is_available : Indique si le chauffeur est disponible pour accepter des trajets
     * - rating : Note moyenne du chauffeur (sur 5 étoiles)
     * - total_trips : Nombre total de trajets effectués
     * - status : Statut du profil (active, suspended, inactive)
     * - timestamps : created_at et updated_at pour le suivi temporel
     */
    public function up(): void
    {
        Schema::create('chauffeurs', function (Blueprint $table) {
            // Identifiant unique auto-incrémenté
            $table->id();
            
            // Référence vers l'utilisateur (relation 1:1)
            // unique() garantit qu'un utilisateur ne peut avoir qu'un seul profil chauffeur
            // onDelete('cascade') supprime le profil si l'utilisateur est supprimé
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            
            // Numéro de permis de conduire (obligatoire, unique)
            // Permet d'identifier de manière unique chaque chauffeur
            $table->string('license_number', 50)->unique();
            
            // Type de véhicule (tricycle par défaut, mais extensible)
            // Permet d'ajouter d'autres types de véhicules à l'avenir
            $table->string('vehicle_type', 50)->default('tricycle');
            
            // Numéro de plaque d'immatriculation du véhicule
            // Format libre pour s'adapter aux différents formats de plaques
            $table->string('vehicle_plate', 20)->nullable();
            
            // Modèle du véhicule (optionnel, ex: "Bajaj", "TVS", etc.)
            $table->string('vehicle_model', 100)->nullable();
            
            // Couleur du véhicule (optionnel, pour faciliter l'identification)
            $table->string('vehicle_color', 50)->nullable();
            
            // Disponibilité du chauffeur
            // true = disponible pour accepter des trajets
            // false = non disponible (hors ligne, en pause, etc.)
            $table->boolean('is_available')->default(false);
            
            // Note moyenne du chauffeur (sur 5 étoiles)
            // decimal(3, 2) permet de stocker des valeurs de 0.00 à 5.00
            // null si le chauffeur n'a pas encore de note
            $table->decimal('rating', 3, 2)->nullable()->default(null);
            
            // Nombre total de trajets effectués
            // Permet de calculer des statistiques et de filtrer les chauffeurs expérimentés
            $table->unsignedInteger('total_trips')->default(0);
            
            // Statut du profil chauffeur :
            // - active : Le profil est actif et le chauffeur peut travailler
            // - suspended : Le profil est temporairement suspendu (sanction, vérification)
            // - inactive : Le profil est inactif (chauffeur ne travaille plus)
            $table->enum('status', ['active', 'suspended', 'inactive'])->default('active');
            
            // Timestamps automatiques (created_at, updated_at)
            $table->timestamps();
            
            // Index pour optimiser les recherches fréquentes
            $table->index('user_id');        // Recherche rapide par utilisateur
            $table->index('is_available');   // Filtrage rapide des chauffeurs disponibles
            $table->index('status');         // Filtrage rapide par statut
            $table->index('rating');         // Tri par note (pour afficher les meilleurs chauffeurs)
        });
    }

    /**
     * Annule la migration : supprime la table des profils chauffeurs.
     * 
     * Cette méthode est appelée lors d'un rollback de migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('chauffeurs');
    }
};
