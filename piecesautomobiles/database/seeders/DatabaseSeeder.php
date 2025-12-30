<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Box;
use App\Models\Parts;
use App\Models\PartsSales;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'm@m.com',
            'password' => \bcrypt('123456789'),
        ]);

        \App\Models\User::factory(3)->create();

        Box::factory(5)->create();

        Parts::factory(1000)->create();

        PartsSales::factory(100)->create();
    }
}
