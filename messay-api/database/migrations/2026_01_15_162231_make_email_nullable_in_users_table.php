<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Rend la colonne email nullable (téléphone = identifiant principal).
     */
    public function up(): void
    {
        // Utilisation de SQL brut car doctrine/dbal n'est pas installé
        $driver = DB::getDriverName();
        
        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE users MODIFY email VARCHAR(191) NULL');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE users ALTER COLUMN email DROP NOT NULL');
        } elseif ($driver === 'sqlite') {
            // SQLite nécessite une recréation de table, on laisse tel quel pour l'instant
            // En production, utiliser doctrine/dbal pour les modifications de colonnes
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();
        
        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE users MODIFY email VARCHAR(191) NOT NULL');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE users ALTER COLUMN email SET NOT NULL');
        }
    }
};
