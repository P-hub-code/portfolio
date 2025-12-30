<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Parts;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PartsSales>
 */
class PartsSalesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::inRandomOrder()->first();  // Get an existing user randomly
        $part = Parts::where('user_id', $user->id)
            ->where('quantity', '>', 0) // Only get parts with quantity > 0
            ->inRandomOrder()
            ->first(); // Get an existing part of the same user
        if (!$part) {
            return []; // Skip creating the entry if no part with quantity > 0 is found
        }
        $quantity = Parts::where('user_id', $user->id)->inRandomOrder()->first()->quantity; // Get an quantity of one existing part of the same user
        $quantity = $this->faker->numberBetween(1, $quantity); // Get a random quantity between 1 and the quantity of the part
        $part->update(['quantity' => $part->quantity - $quantity]); // Update the quantity of the part (decrease it by the quantity of the sale)
        $part->save(); // Save the part

        return [
            'user_id' => $user->id,
            'part_id' => $part->id,
            'date' => $this->faker->date(),
            'price' => $this->faker->randomFloat(2, 0, 1000),
            'quantity' => $quantity,
            'notes' => $this->faker->text(),
        ];
    }
}
