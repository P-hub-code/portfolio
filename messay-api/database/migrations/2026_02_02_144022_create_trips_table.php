<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécute la migration : crée la table des trajets.
     * 
     * Cette table stocke toutes les informations relatives aux trajets (courses) effectués
     * dans l'application. Un trajet lie un passager (user) à un chauffeur (driver) optionnel.
     * 
     * Structure de la table :
     * - id : Identifiant unique du trajet
     * - user_id : Référence vers le passager (cascade sur suppression)
     * - driver_id : Référence vers le chauffeur assigné (nullable, cascade sur suppression)
     * - departure : Point de départ (adresse ou coordonnées)
     * - destination : Point d'arrivée (adresse ou coordonnées)
     * - departure_lat : Latitude du point de départ (pour calcul de distance)
     * - departure_lng : Longitude du point de départ
     * - destination_lat : Latitude du point d'arrivée
     * - destination_lng : Longitude du point d'arrivée
     * - distance : Distance estimée en kilomètres
     * - estimated_time : Temps estimé du trajet (en minutes)
     * - price : Prix du trajet en FCFA
     * - status : Statut du trajet (pending, accepted, in_progress, completed, cancelled)
     * - payment_status : Statut du paiement (pending, paid, refunded)
     * - transaction_id : Référence vers la transaction wallet associée
     * - cancelled_at : Date d'annulation (si annulé)
     * - cancelled_by : Qui a annulé (user, driver, system)
     * - cancellation_reason : Raison de l'annulation
     * - started_at : Date de début du trajet (quand le chauffeur démarre)
     * - completed_at : Date de fin du trajet (quand le chauffeur arrive à destination)
     * - timestamps : created_at et updated_at pour le suivi temporel
     */
    public function up(): void
    {
        Schema::create('trajets', function (Blueprint $table) {
            // Identifiant unique auto-incrémenté
            $table->id();
            
            // Référence vers le passager (utilisateur qui demande le trajet)
            // onDelete('cascade') supprime les trajets si l'utilisateur est supprimé
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Référence vers le chauffeur assigné (nullable car pas encore assigné au départ)
            // onDelete('set null') met null si le chauffeur est supprimé (préserve l'historique)
            $table->foreignId('driver_id')->nullable()->constrained('chauffeurs')->onDelete('set null');
            
            // Point de départ (adresse textuelle)
            // Exemple : "Plateau, Rue de la République, Abidjan"
            $table->string('departure', 255);
            
            // Point d'arrivée (adresse textuelle)
            // Exemple : "Cocody, Angré 7ème Tranche, Abidjan"
            $table->string('destination', 255);
            
            // Coordonnées GPS du point de départ (pour calcul de distance)
            // Permet de calculer la distance réelle et le temps de trajet
            $table->decimal('departure_lat', 10, 8)->nullable();
            $table->decimal('departure_lng', 11, 8)->nullable();
            
            // Coordonnées GPS du point d'arrivée
            $table->decimal('destination_lat', 10, 8)->nullable();
            $table->decimal('destination_lng', 11, 8)->nullable();
            
            // Distance estimée en kilomètres
            // decimal(8, 2) permet de stocker jusqu'à 999999.99 km
            $table->decimal('distance', 8, 2)->nullable();
            
            // Temps estimé du trajet en minutes
            // Exemple : 18 pour "18 minutes"
            $table->unsignedInteger('estimated_time')->nullable();
            
            // Prix du trajet en FCFA (Franc CFA)
            // decimal(10, 2) permet de stocker jusqu'à 99 999 999.99 FCFA
            $table->decimal('price', 10, 2);
            
            // Statut du trajet :
            // - pending : Trajet créé, en attente d'acceptation par un chauffeur
            // - accepted : Trajet accepté par un chauffeur, en attente de démarrage
            // - in_progress : Trajet en cours (chauffeur a démarré)
            // - completed : Trajet terminé avec succès
            // - cancelled : Trajet annulé (par le passager, le chauffeur ou le système)
            $table->enum('status', ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'])->default('pending');
            
            // Statut du paiement :
            // - pending : Paiement en attente (trajet pas encore payé)
            // - paid : Paiement effectué (débité du wallet du passager)
            // - refunded : Paiement remboursé (en cas d'annulation)
            $table->enum('payment_status', ['pending', 'paid', 'refunded'])->default('pending');
            
            // Référence vers la transaction wallet associée
            // Permet de lier le trajet à la transaction de paiement/remboursement
            $table->foreignId('transaction_id')->nullable()->constrained('transactions')->onDelete('set null');
            
            // Date et heure d'annulation (si le trajet a été annulé)
            $table->timestamp('cancelled_at')->nullable();
            
            // Qui a annulé le trajet :
            // - user : Annulé par le passager
            // - driver : Annulé par le chauffeur
            // - system : Annulé automatiquement par le système (ex: timeout)
            $table->enum('cancelled_by', ['user', 'driver', 'system'])->nullable();
            
            // Raison de l'annulation (texte libre)
            // Exemple : "Changement de plan", "Urgence", "Chauffeur non disponible"
            $table->text('cancellation_reason')->nullable();
            
            // Date et heure de début du trajet
            // Rempli lorsque le chauffeur démarre le trajet (status = in_progress)
            $table->timestamp('started_at')->nullable();
            
            // Date et heure de fin du trajet
            // Rempli lorsque le chauffeur arrive à destination (status = completed)
            $table->timestamp('completed_at')->nullable();
            
            // Timestamps automatiques (created_at, updated_at)
            $table->timestamps();
            
            // Index pour optimiser les recherches fréquentes
            $table->index('user_id');         // Recherche rapide par passager
            $table->index('driver_id');       // Recherche rapide par chauffeur
            $table->index('status');          // Filtrage rapide par statut
            $table->index('payment_status');  // Filtrage rapide par statut de paiement
            $table->index('created_at');      // Tri chronologique et filtrage par date
            $table->index(['status', 'driver_id']); // Recherche des trajets actifs d'un chauffeur
        });
    }

    /**
     * Annule la migration : supprime la table des trajets.
     * 
     * Cette méthode est appelée lors d'un rollback de migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('trajets');
    }
};
