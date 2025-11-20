<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Top-level category
        $women = Category::create([
            'name' => 'Women',
            'slug' => 'women',
            'level' => 1
        ]);

        // Second-level categories under WOMEN
        $secondLevel = [
            'Clothing',
            'Shoes',
            'Accessories',
            'Best Selling',
            'Sale',
            'New In',
            'Brands'
        ];

        $secondLevelIds = [];

        foreach ($secondLevel as $category) {
            $cat = Category::create([
                'name' => $category,
                'slug' => Str::slug($category),
                'parent_id' => $women->id,
                'level' => 2
            ]);
            $secondLevelIds[$category] = $cat->id;
        }

        // Third-level categories under CLOTHING
        $clothingChildren = [
            'Dresses',
            'Tops',
            'Coats & Jackets',
            'Hoodies & Sweatshirts',
            'Knitwear',
            'Co-Ords',
            'Jeans',
            'Trousers',
            'Tracksuits',
            'Joggers',
            'Sports',
            'Playsuits & Jumpsuits',
            'Denim',
            'Skirts',
            'Blazers'
        ];

        foreach ($clothingChildren as $child) {
            Category::create([
                'name' => $child,
                'slug' => Str::slug($child),
                'parent_id' => $secondLevelIds['Clothing'],
                'level' => 3
            ]);
        }

        // Optional: you can also add Lingerie section later similarly
    }
}
