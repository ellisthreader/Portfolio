<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // -------------------------
        // Shoes
        // -------------------------
        $shoes = [
            [
                'slug' => 'cloudmonster',
                'brand' => 'ON',
                'name' => 'Cloudmonster',
                'price' => 160.00,
                'original_price' => null,
                'colours' => ['White', 'Black'],
                'images' => [
                    'White' => [
                        '/images/Trending/cloudtecW1.png',
                        '/images/Trending/cloudtecW2.png',
                        '/images/Trending/cloudtecW3.png',
                        '/images/Trending/cloudtecW4.png',
                    ],
                    'Black' => [
                        '/images/Trending/cloudtecB1.png',
                        '/images/Trending/cloudtecB2.png',
                        '/images/Trending/cloudtecB3.png',
                        '/images/Trending/cloudtecB4.png',
                    ],
                ],
                'sizes' => [
                    'White' => ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
                    'Black' => ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
                ],
                'specifications' =>
                    "Lace up in a sports-inspired style with these men's Cloudmonster trainers from On Running. ".
                    "Smooth, breathable textile upper for lasting wear. ".
                    "Secure lace fastening with plush padding around the ankle collar. ".
                    "Ultra-lightweight chunky midsole with CloudTec cushioning. Tough rubber sole. Finished with On Running branding.",
            ],
            [
                'slug' => 'low-vulcanized',
                'brand' => 'Off White',
                'name' => 'Low Vulcanized Leather Trainers',
                'price' => 149.99,
                'original_price' => 300.00,
                'colours' => ['White', 'Black'],
                'images' => [
                    'White' => ['/images/Trending/offwhiteV1.avif', '/images/Trending/offwhiteV2.avif'],
                    'Black' => ['/images/Trending/offwhiteV1.avif', '/images/Trending/offwhiteV2.avif'],
                ],
                'sizes' => [
                    'White' => ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
                    'Black' => ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
                ],
                'specifications' => "Specifications placeholder for Low Vulcanized Leather Trainers.",
            ],
        ];

        foreach ($shoes as $item) {
            // Use first colour's images for default
            $firstColour = $item['colours'][0];

            Product::create([
                'brand' => $item['brand'],
                'name' => $item['name'],
                'slug' => $item['slug'],
                'type' => 'Trending Shoes',
                'price' => $item['price'],
                'original_price' => $item['original_price'],
                'description' => 'Detailed description for '.$item['name'].'.',
                'images' => json_encode($item['images'][$firstColour]),
                'sizes' => json_encode($item['sizes'][$firstColour]),
                'colour' => json_encode($item['colours']),
                'specifications' => $item['specifications'],
            ]);
        }

        // -------------------------
        // Coats & Jackets
        // -------------------------
        $coats = [
            [
                'slug' => 'moncler-maya-puffer',
                'brand' => 'MONCLER',
                'name' => "Men's Nylon Maya Down Puffer Jacket",
                'price' => 1300.00,
                'colours' => ['Black', 'Navy'],
            ],
            [
                'slug' => 'polo-ralph-lauren-elcap',
                'brand' => 'Polo Ralph Lauren',
                'name' => 'El Cap Puffer Down Jacket',
                'price' => 445.00,
                'colours' => ['Black', 'Navy'],
            ],
        ];

        foreach ($coats as $item) {
            Product::create([
                'brand' => $item['brand'],
                'name' => $item['name'],
                'slug' => $item['slug'],
                'type' => 'Coats & Jackets',
                'price' => $item['price'],
                'original_price' => $item['original_price'] ?? null,
                'description' => 'Detailed description for '.$item['name'].'.',
                'images' => json_encode([
                    '/images/Trending/'.$item['slug'].'1.avif',
                    '/images/Trending/'.$item['slug'].'2.avif',
                ]),
                'sizes' => json_encode(['S', 'M', 'L', 'XL']),
                'colour' => json_encode($item['colours']),
                'specifications' => 'Specifications placeholder for '.$item['name'].'.',
            ]);
        }

        // -------------------------
        // Hoodies
        // -------------------------
        $hoodies = [
            [
                'slug' => 'polo-tech-hoodie',
                'brand' => 'POLO RALPH LAUREN',
                'name' => "Men's Full-Zip Tech Hoodie",
                'price' => 145.00,
                'colours' => ['Black', 'White'],
            ],
        ];

        foreach ($hoodies as $item) {
            Product::create([
                'brand' => $item['brand'],
                'name' => $item['name'],
                'slug' => $item['slug'],
                'type' => 'Hoodies',
                'price' => $item['price'],
                'original_price' => $item['original_price'] ?? null,
                'description' => 'Detailed description for '.$item['name'].'.',
                'images' => json_encode([
                    '/images/Trending/'.$item['slug'].'1.avif',
                    '/images/Trending/'.$item['slug'].'2.avif',
                ]),
                'sizes' => json_encode([
                    'Black' => ['S', 'M', 'L', 'XL'],
                    'White' => ['S', 'M', 'L', 'XL'],
                ]),
                'colour' => json_encode($item['colours']),
                'specifications' => 'Specifications placeholder for '.$item['name'].'.',
            ]);
        }
    }
}
