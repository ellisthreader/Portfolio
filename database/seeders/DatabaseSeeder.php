<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // -------------------------------------------
        // ✅ Register all your seeders here
        // -------------------------------------------
        $this->call([
            ProductSeeder::class, // Seeds product data
            // You can add more later, e.g.:
            // UsersTableSeeder::class,
            // OrdersTableSeeder::class,
        ]);
    }
}
