<?php

namespace Database\Factories;

use App\Domains\Identity\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Identity\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Format téléphone Côte d'Ivoire : +225XXXXXXXXX (10 chiffres après +225)
        // Les numéros commencent généralement par 07, 05, 01, etc.
        $phonePrefix = fake()->randomElement(['07', '05', '01', '09']);
        
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'telephone' => '+225' . $phonePrefix . fake()->numerify('########'), // Format international Côte d'Ivoire
            'role' => 'passager', // Rôle par défaut
            'status' => 'active',
            'is_verified' => false,
            'verified_at' => null,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the user is a driver.
     */
    public function driver(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'driver',
        ]);
    }

    /**
     * Indicate that the user's telephone is verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
            'verified_at' => now(),
        ]);
    }

    /**
     * Indicate that the user is blocked.
     */
    public function blocked(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'blocked',
        ]);
    }

    /**
     * Indicate that the user is suspended.
     */
    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'suspended',
        ]);
    }
}
