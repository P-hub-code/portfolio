<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécute la migration : crée la table des portefeuilles électroniques (wallets).
     * 
     * Cette table stocke les informations de portefeuille pour chaque utilisateur.
     * Chaque utilisateur a un seul wallet (relation 1:1 avec la table users).
     * 
     * Structure de la table :
     * - id : Identifiant unique du wallet
     * - user_id : Référence vers l'utilisateur propriétaire (unique, cascade sur suppression)
     * - balance : Solde actuel en FCFA (décimal avec 2 décimales, défaut 0.00)
     * - status : Statut du wallet (active, suspended, closed)
     * - timestamps : created_at et updated_at pour le suivi temporel
     */
    public function up(): void
    {
        Schema::create('portefeuilles', function (Blueprint $table) {
            // Identifiant unique auto-incrémenté
            $table->id();
            
            // Référence vers l'utilisateur (relation 1:1)
            // unique() garantit qu'un utilisateur ne peut avoir qu'un seul wallet
            // onDelete('cascade') supprime le wallet si l'utilisateur est supprimé
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            
            // Solde du wallet en FCFA (Franc CFA)
            // decimal(15, 2) permet de stocker jusqu'à 999 999 999 999 999.99 FCFA
            // default(0.00) initialise le solde à zéro lors de la création
            $table->decimal('balance', 15, 2)->default(0.00);
            
            // Statut du wallet :
            // - active : Le wallet est actif et peut être utilisé
            // - suspended : Le wallet est temporairement suspendu (blocage administratif)
            // - closed : Le wallet est fermé définitivement
            $table->enum('status', ['active', 'suspended', 'closed'])->default('active');
            
            // Timestamps automatiques (created_at, updated_at)
            $table->timestamps();
            
            // Index pour optimiser les recherches fréquentes
            $table->index('user_id'); // Recherche rapide par utilisateur
            $table->index('status');   // Filtrage rapide par statut
        });
    }

    /**
     * Annule la migration : supprime la table des wallets.
     * 
     * Cette méthode est appelée lors d'un rollback de migration.
     * La suppression en cascade gérée par la clé étrangère s'occupe des transactions liées.
     */
    public function down(): void
    {
        Schema::dropIfExists('portefeuilles');
    }
};
