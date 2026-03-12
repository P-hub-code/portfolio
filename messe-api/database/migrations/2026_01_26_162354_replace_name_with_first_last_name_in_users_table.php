<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Ajouter les nouvelles colonnes
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
        });

        // Migrer les données existantes (si name contient "Prénom Nom")
        // Note: Cette migration suppose que name peut être divisé
        // Pour des données existantes, on peut faire une migration de données séparée
        
        Schema::table('users', function (Blueprint $table) {
            // Supprimer l'ancienne colonne name
            $table->dropColumn('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Recréer name
            $table->string('name')->after('id');
        });

        // Fusionner first_name et last_name dans name (si nécessaire)
        
        Schema::table('users', function (Blueprint $table) {
            // Supprimer les nouvelles colonnes
            $table->dropColumn(['first_name', 'last_name']);
        });
    }
};
