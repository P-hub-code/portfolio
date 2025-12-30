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
        Schema::create('parts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->string('sku')->unique()->nullable();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('brand');
            $table->string('model');
            $table->string('year');
            $table->string('price')->nullable();
            $table->string('image')->nullable();
            $table->string('quantity')->nullable();

            // Part belongs to a box or null if it is not in a box
            $table->bigInteger('box_id')->unsigned()->nullable();

            $table->foreign('box_id')->references('id')->on('boxes');

            $table->index('sku');
            $table->index('name');
            $table->index('brand');
            $table->index('model');
            $table->index('year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parts');
    }
};
