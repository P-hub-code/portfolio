<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Fixe la longueur par défaut des strings pour MySQL avec utf8mb4
        // Cela évite l'erreur "La clé est trop longue" pour les index uniques
        Schema::defaultStringLength(191);
    }
}
