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
        Schema::create('shelves', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('reference');
            $table->string('name')->nullable();
            $table->string('number')->nullable();
            $table->string('description')->nullable();

            // Shelf must belongs to a cabinet
            $table->foreignId('cabinet_id')->constrained('cabinets')->onDelete('cascade');

            $table->index('reference');
            $table->index('name');
            $table->index('number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shelves');
    }
};
