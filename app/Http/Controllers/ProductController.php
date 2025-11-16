<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * List products by type (e.g. Trending Shoes)
     */
    public function index($type)
    {
        $products = Product::where('type', $type)->get()->map(function ($product) {
            // Flatten images array if needed
            $product->images = is_string($product->images)
                ? json_decode($product->images, true)
                : $product->images;

            $product->sizes = is_string($product->sizes)
                ? json_decode($product->sizes, true)
                : $product->sizes;

            $product->colour = is_string($product->colour)
                ? json_decode($product->colour, true)
                : $product->colour;

            // Build colourProducts for React
            $product->colourProducts = collect($product->colour)->map(function ($colour) use ($product) {
                $images = $product->images;
                if (isset($product->images[$colour])) {
                    // If images are stored per colour
                    $images = $product->images[$colour];
                }
                return [
                    'colour' => $colour,
                    'slug' => $product->slug,
                    'firstImage' => is_array($images) ? $images[0] : $images,
                ];
            })->toArray();

            return $product;
        });

        return Inertia::render('Products/Index', [
            'type' => $type,
            'products' => $products,
        ]);
    }

    /**
     * Show individual product
     */
    public function show($slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        // Decode JSON fields
        $product->images = is_string($product->images)
            ? json_decode($product->images, true)
            : $product->images;

        $product->sizes = is_string($product->sizes)
            ? json_decode($product->sizes, true)
            : $product->sizes;

        $product->colour = is_string($product->colour)
            ? json_decode($product->colour, true)
            : $product->colour;

        // Build colourProducts array for React
        $product->colourProducts = collect($product->colour)->map(function ($colour) use ($product) {
            $images = $product->images;
            if (isset($product->images[$colour])) {
                // If images are stored per colour
                $images = $product->images[$colour];
            }

            return [
                'colour' => $colour,
                'slug' => $product->slug,
                'firstImage' => is_array($images) ? $images[0] : $images,
            ];
        })->toArray();

        return Inertia::render('Product/ProductLayout', [
            'product' => $product,
        ]);
    }
}
