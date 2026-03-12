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
            // Téléphone : identifiant principal (mobile-first)
            $table->string('telephone', 20)->unique()->nullable()->after('name');
            
            // Rôle utilisateur (passager/chauffeur)
            $table->enum('role', ['passager', 'driver'])->default('passager')->after('telephone');
            
            // Statut du compte (actif/bloqué/suspendu)
            $table->enum('status', ['active', 'blocked', 'suspended'])->default('active')->after('role');
            
            // Vérification téléphone (SMS/KYC)
            $table->boolean('is_verified')->default(false)->after('status');
            $table->timestamp('verified_at')->nullable()->after('is_verified');
            
            // Email devient optionnel (téléphone = identifiant principal)
            // Note: Modification de la colonne email dans une migration séparée
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['telephone', 'role', 'status', 'is_verified', 'verified_at']);
            // Note: Modification de la colonne email dans une migration séparée
        });
    }
};
