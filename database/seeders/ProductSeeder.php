<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Image;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [

            // 🔥 CLOUDMONSTER BLACK
            [
                'brand'          => 'On Running',
                'name'           => 'Cloudmonster',
                'slug'           => 'cloudmonster-black',
                'description'    => 'The Cloudmonster running shoe from On Running.',
                'price'          => 160,
                'original_price' => null,
                'is_trending'    => false,

                // ✅ Fixed: real slug from CategorySeeder
                'categories'     => ['men-trainers-shoes'],

                'images' => [
                    'images/Trending/cloudtecB1.png',
                    'images/Trending/cloudtecB2.png',
                    'images/Trending/cloudtecB3.png',
                    'images/Trending/cloudtecB4.png',
                ],
                'variants' => [
                    [
                        'colour' => 'Black',
                        'sizes'  => ['7', '9', '11'],
                    ],
                ],
            ],

            // 🔥 CLOUDMONSTER WHITE
            [
                'brand'          => 'On Running',
                'name'           => 'Cloudmonster',
                'slug'           => 'cloudmonster-white',
                'description'    => 'The Cloudmonster running shoe from On Running.',
                'price'          => 160,
                'original_price' => null,
                'is_trending'    => true,

                // ✅ Fixed
                'categories'     => ['women-trainers-shoes'],

                'images' => [
                    'images/Trending/cloudtecW1.png',
                    'images/Trending/cloudtecW2.png',
                    'images/Trending/cloudtecW3.png',
                    'images/Trending/cloudtecW4.png',
                ],
                'variants' => [
                    [
                        'colour' => 'White',
                        'sizes'  => ['7','8','9','10','11'],
                    ],
                ],
            ],

            // Pegasus (Blue)
            [
                'brand'          => 'Nike',
                'name'           => 'Air Zoom Pegasus 40 - Blue',
                'slug'           => 'air-zoom-pegasus-40-blue',
                'description'    => 'The Nike Air Zoom Pegasus 40 for everyday running.',
                'price'          => 140,
                'original_price' => 170,
                'is_trending'    => false,

                // ✅ Fixed
                'categories'     => ['men-trainers-shoes'],

                'images' => [
                    'images/Trending/pegasusB1.png',
                    'images/Trending/pegasusB2.png',
                ],
                'variants' => [
                    [
                        'colour' => 'Blue',
                        'sizes'  => ['7','8','9','10','11','12'],
                    ],
                ],
            ],

            // Pegasus (Red)
            [
                'brand'          => 'Nike',
                'name'           => 'Air Zoom Pegasus 40 - Red',
                'slug'           => 'air-zoom-pegasus-40-red',
                'description'    => 'The Nike Air Zoom Pegasus 40 for everyday running.',
                'price'          => 140,
                'original_price' => 170,
                'is_trending'    => false,

                // ✅ Fixed
                'categories'     => ['men-trainers-shoes'],

                'images' => [
                    'images/Trending/pegasusR1.png',
                    'images/Trending/pegasusR2.png',
                ],
                'variants' => [
                    [
                        'colour' => 'Red',
                        'sizes'  => ['7','8','9','10','11','12'],
                    ],
                ],
            ],

            // GUCCI GG Monogram Print Silk Shirt
            [
                'brand'          => 'GUCCI',
                'name'           => 'GG Monogram Print Silk Shirt',
                'slug'           => 'gg-monogram-print-silk-shirt',
                'description'    => 'Luxury GG Monogram silk shirt from Gucci.',
                'price'          => 1000,
                'original_price' => 1400,
                'is_trending'    => true,

                // ✅ Fixed (correct slugs)
                'categories'     => [
                    'men-shirts-clothing',
                    'women-shirts-clothing',
                ],

                'images' => [
                    'images/Products/GG/GGSilkShirt1.avif',
                    'images/Products/GG/GGSilkShirt2.avif',
                ],
                'variants' => [
                    [
                        'colour' => 'Brown Blue Mc',
                        'sizes'  => ['6', '8', '10'],
                    ],
                ],
            ],
        ];

        foreach ($products as $data) {

            $categorySlugs = $data['categories'] ?? [];
            unset($data['categories']);

            // Create product
            $product = Product::create([
                'brand'          => $data['brand'],
                'name'           => $data['name'],
                'slug'           => $data['slug'],
                'description'    => $data['description'],
                'price'          => $data['price'],
                'original_price' => $data['original_price'],
                'is_trending'    => $data['is_trending'],
            ]);

            // Attach categories
            if (!empty($categorySlugs)) {
                $categoryIds = Category::whereIn('slug', $categorySlugs)->pluck('id')->toArray();

                if (!empty($categoryIds)) {
                    $product->categories()->syncWithoutDetaching($categoryIds);
                }
            }

            // Save images
            foreach ($data['images'] as $img) {
                Image::create([
                    'imageable_id'   => $product->id,
                    'imageable_type' => Product::class,
                    'path'           => $img,
                ]);
            }

            // Save variants
            foreach ($data['variants'] as $variant) {
                foreach ($variant['sizes'] as $size) {
                    ProductVariant::create([
                        'product_id'     => $product->id,
                        'sku'            => strtoupper(Str::random(10)),
                        'colour'         => $variant['colour'],
                        'size'           => $size,
                        'price'          => $data['price'],
                        'original_price' => $data['original_price'],
                        'stock'          => 10,
                    ]);
                }
            }
        }
    }
}
