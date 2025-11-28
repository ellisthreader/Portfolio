<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // ---------------- WOMEN ----------------
            ['id' => 1,  'section' => 'Women', 'subsection' => 'Clothing', 'name' => 'Jackets & Coats'],
            ['id' => 2,  'section' => 'Women', 'subsection' => 'Clothing', 'name' => 'Hoodies & Sweatshirts'],
            ['id' => 3,  'section' => 'Women', 'subsection' => 'Shoes', 'name' => 'Trainers'],
            ['id' => 4,  'section' => 'Women', 'subsection' => 'Accessories', 'name' => 'Scarves'],

            // ---------------- MEN ----------------
            ['id' => 5,  'section' => 'Men', 'subsection' => 'Clothing', 'name' => 'T-Shirts'],
            ['id' => 6,  'section' => 'Men', 'subsection' => 'Clothing', 'name' => 'Jackets & Coats'],
            ['id' => 7,  'section' => 'Men', 'subsection' => 'Shoes', 'name' => 'Trainers'],
            ['id' => 8,  'section' => 'Men', 'subsection' => 'Accessories', 'name' => 'Hats'],

            // ---------------- GIRL & BOY BABY & NEWBORN ----------------
            ['id' => 79, 'section' => 'Girl', 'subsection' => 'Clothing', 'name' => 'Nightwear', 'age_group' => 'Baby & Newborn'],
            ['id' => 80, 'section' => 'Girl', 'subsection' => 'Clothing', 'name' => 'Jackets & Coats', 'age_group' => 'Baby & Newborn'],
            ['id' => 127,'section' => 'Boy', 'subsection' => 'Clothing', 'name' => 'Nightwear', 'age_group' => 'Baby & Newborn'],
            ['id' => 128,'section' => 'Boy', 'subsection' => 'Clothing', 'name' => 'Jackets & Coats', 'age_group' => 'Baby & Newborn'],

            // ---------------- GIRL & BOY 2-8 ----------------
            ['id' => 95, 'section' => 'Girl', 'subsection' => 'Clothing', 'name' => 'Nightwear', 'age_group' => '2-8'],
            ['id' => 96, 'section' => 'Girl', 'subsection' => 'Clothing', 'name' => 'Jackets & Coats', 'age_group' => '2-8'],
            ['id' => 129,'section' => 'Boy', 'subsection' => 'Clothing', 'name' => 'Nightwear', 'age_group' => '2-8'],
            ['id' => 130,'section' => 'Boy', 'subsection' => 'Clothing', 'name' => 'Jackets & Coats', 'age_group' => '2-8'],

            // ---------------- GIRL & BOY 9-14 ----------------
            ['id' => 111,'section' => 'Girl', 'subsection' => 'Clothing', 'name' => 'Nightwear', 'age_group' => '9-14'],
            ['id' => 112,'section' => 'Girl', 'subsection' => 'Clothing', 'name' => 'Jackets & Coats', 'age_group' => '9-14'],
            ['id' => 127,'section' => 'Boy', 'subsection' => 'Clothing', 'name' => 'Nightwear', 'age_group' => '9-14'],
            ['id' => 128,'section' => 'Boy', 'subsection' => 'Clothing', 'name' => 'Jackets & Coats', 'age_group' => '9-14'],
        ];

        foreach ($categories as &$category) {
            // Build slug: include age_group only if exists
            $slugParts = [];
            if (isset($category['age_group'])) {
                $slugParts[] = $category['age_group'];
            }
            $slugParts[] = $category['section'];
            $slugParts[] = $category['subsection'];
            $slugParts[] = $category['name'];

            $category['slug'] = Str::slug(implode('-', $slugParts)); // e.g., men-shoes-trainers or 2-8-girl-clothing-nightwear
        }

        // Insert into DB preserving IDs
        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['id' => $cat['id']],
                $cat
            );
        }

        $this->command->info("✅ Categories seeded successfully with IDs and proper slugs!");
    }
}
