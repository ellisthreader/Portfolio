<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index($type)
    {
        $products = Product::where('type', $type)
            ->with(['images', 'variants'])
            ->get()
            ->map(fn ($product) => $this->formatProduct($product));

        return Inertia::render('Products/Index', [
            'type' => $type,
            'products' => $products,
        ]);
    }

    public function trending()
    {
        $products = Product::where('is_trending', true)
            ->with(['images', 'variants'])
            ->get()
            ->map(fn ($product) => $this->formatProduct($product));

        return $products;
    }

    public function show($slug)
    {
        if (!is_string($slug)) {
            abort(400, "Invalid product slug");
        }

        Log::info("🔎 Product requested", ['slug' => $slug]);

        // Load the main product
        $product = Product::where('slug', $slug)
            ->with(['images', 'variants'])
            ->firstOrFail();

        // Format the main product
        $product = $this->formatProduct($product);

        // ---------------------------------------------
        // 🔥 Load sibling colour products
        // ---------------------------------------------

        // base slug = remove last "-colour"
        $baseSlug = preg_replace('/-\w+$/', '', $slug);

        $siblings = Product::where('slug', 'LIKE', $baseSlug . '-%')
            ->with(['images', 'variants'])
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        // Build colour switcher list
        $product->colourProducts = $siblings->map(function ($p) {
            return [
                'colour' => $p->colour[0] ?? 'Unknown',
                'slug'   => $p->slug,
                'sizes'  => $p->sizes,
                'images' => $p->images,
            ];
        })->values()->toArray();

        Log::info("🎨 Sibling colours loaded", [
            'colourProducts' => $product->colourProducts
        ]);

        return Inertia::render('Product/ProductLayout', [
            'product' => $product,
        ]);
    }

    /**
     * FORMAT PRODUCT RESPONSE
     */
    private function formatProduct($product)
    {
        $product->slug = (string) $product->slug;

        // Extract all available colours + sizes
        $allColours = $product->variants->pluck('colour')->unique()->values()->all();
        $allSizes   = $product->variants->pluck('size')->unique()->values()->all();

        // Normalize product images
        $productImages = $product->images->map(fn ($img) => asset($img->path))->values()->all();

        return (object)[
            'id' => $product->id,
            'brand' => $product->brand,
            'name' => $product->name,
            'slug' => $product->slug,
            'category_id' => $product->category_id,
            'description' => $product->description,
            'price' => $product->price,
            'original_price' => $product->original_price,
            'is_trending' => $product->is_trending,
            'is_sale' => $product->is_sale,
            'images' => $productImages,
            'sizes' => $allSizes,
            'colour' => $allColours,
            'specifications' => $product->specifications ?? '',
            'variants' => $product->variants,
            'type' => $product->type ?? 'Misc',

            // Will be populated in show() for siblings
            'colourProducts' => [],
        ];
    }
}
