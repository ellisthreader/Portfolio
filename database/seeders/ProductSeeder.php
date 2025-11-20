<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Image;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [

            // 🔥 CLOUDMONSTER BLACK
            [
                'category_id'    => 1,
                'brand'          => 'On Running',
                'name'           => 'Cloudmonster',
                'slug'           => 'cloudmonster-black',
                'description'    => 'The Cloudmonster running shoe from On Running.',
                'price'          => 160,
                'original_price' => null,
                'is_trending'    => false,

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
                'category_id'    => 1,
                'brand'          => 'On Running',
                'name'           => 'Cloudmonster',
                'slug'           => 'cloudmonster-white',
                'description'    => 'The Cloudmonster running shoe from On Running.',
                'price'          => 160,
                'original_price' => null,
                'is_trending'    => true,

                'images' => [
                    'images/Trending/cloudtecW1.png',
                    'images/Trending/cloudtecW2.png',
                    'images/Trending/cloudtecW3.png',
                    'images/Trending/cloudtecW4.png',
                ],

                'variants' => [
                    [
                        'colour' => 'White',
                        'sizes'  => ['7', '8', '9', '10', '11'],
                    ],
                ],
            ],

            // ------------------------------------------------------------
            // EXAMPLE: Pegasus (kept same structure)
            // ------------------------------------------------------------
            [
                'category_id'    => 1,
                'brand'          => 'Nike',
                'name'           => 'Air Zoom Pegasus 40 - Blue',
                'slug'           => 'air-zoom-pegasus-40-blue',
                'description'    => 'The Nike Air Zoom Pegasus 40 for everyday running.',
                'price'          => 140,
                'original_price' => 170,
                'is_trending'    => false,

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

            [
                'category_id'    => 1,
                'brand'          => 'Nike',
                'name'           => 'Air Zoom Pegasus 40 - Red',
                'slug'           => 'air-zoom-pegasus-40-red',
                'description'    => 'The Nike Air Zoom Pegasus 40 for everyday running.',
                'price'          => 140,
                'original_price' => 170,
                'is_trending'    => false,

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
        ];

        foreach ($products as $data) {

            // Create product
            $product = Product::create([
                'category_id'    => $data['category_id'],
                'brand'          => $data['brand'],
                'name'           => $data['name'],
                'slug'           => $data['slug'],
                'description'    => $data['description'],
                'price'          => $data['price'],
                'original_price' => $data['original_price'],
                'is_trending'    => $data['is_trending'],
            ]);

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
