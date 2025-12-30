<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Box>
 */
class BoxFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,  // Get an existing user randomly
            'reference' => $this->faker->unique()->randomNumber(5),
            'name' => ['Caixa 01', 'Caixa 02', 'Caixa 03', 'Caixa 04', 'Caixa 05'][rand(0, 4)],
            'number' => $this->faker->randomNumber(2),
            'description' => ['Pneu', 'Retrovisor', 'Farol', 'Lanterna', 'Bateria'][rand(0, 4)],
        ];
    }
}
