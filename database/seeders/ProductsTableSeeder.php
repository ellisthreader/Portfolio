<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['name' => 'TikTok Creator Rewards Programme', 'photo_url' => 'tiktok.jpeg', 'stock' => 1, 'price' => 19.99],
            ['name' => 'Digital Marketing Mastery', 'photo_url' => 'marketing.jpeg', 'stock' => 1, 'price' => 29.99],
            ['name' => 'Web Development Fundamentals', 'photo_url' => 'webdev.jpeg', 'stock' => 1, 'price' => 39.99],
            ['name' => 'Web Dev Fundamentals (Paperback)', 'photo_url' => 'webdev-paperback.jpeg', 'stock' => 1, 'price' => 24.99],
            ['name' => 'TikTok Creator Starter Pack', 'photo_url' => 'tiktok-starter-pack.jpeg', 'stock' => 1, 'price' => 14.99],
            ['name' => 'Marketing Productivity Pack', 'photo_url' => 'marketing-pack.jpeg', 'stock' => 1, 'price' => 9.99],
        ];

        DB::table('products')->insert($products);
    }
}
