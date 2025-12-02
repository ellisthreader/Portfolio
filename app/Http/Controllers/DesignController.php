<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class DesignController extends Controller
{
    /**
     * Show the Design page for a product.
     */
    public function show(Request $request, $slug)
    {
        $selectedColour = $request->query('colour');
        $selectedSize   = $request->query('size');

        Log::info("=== DesignController@show called ===", [
            'slug' => $slug,
            'colour' => $selectedColour,
            'size' => $selectedSize
        ]);

        $product = Product::with(['images', 'variants.images', 'categories'])
            ->where('slug', $slug)
            ->firstOrFail();

        Log::info("=== Product fetched ===", [
            'product_id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'categories_count' => $product->categories->count(),
            'category_names' => $product->categories->pluck('name')->all()
        ]);

        // Build colourProducts for frontend
        $product->colourProducts = collect($product->variants)
            ->groupBy('colour')
            ->map(function ($group, $colour) use ($product) {
                $firstVariant = $group->first();

                $images = $firstVariant->images->isNotEmpty()
                    ? $firstVariant->images->pluck('path')->map(fn($path) => asset($path))->all()
                    : $product->images->pluck('path')->map(fn($path) => asset($path))->all();

                return [
                    'colour' => $colour,
                    'slug' => $firstVariant->slug,
                    'sizes' => $group->pluck('size')->unique()->values()->all(),
                    'images' => $images,
                ];
            })
            ->values()
            ->all();

        Log::info("=== colourProducts built ===", ['colourProducts' => $product->colourProducts]);
        Log::info("=== Selected colour/size ===", [
            'selectedColour' => $selectedColour,
            'selectedSize' => $selectedSize
        ]);

        return Inertia::render('Design/Design', [
            'product' => $product,
            'selectedColour' => $selectedColour,
            'selectedSize' => $selectedSize,
        ]);
    }

    /**
     * Show Change Product page with similar categories
     */
    public function changeProduct(Request $request)
    {
        $productId = $request->query('product');

        if (!$productId) {
            Log::warning("=== No product query parameter passed to changeProduct ===", [
                'request_query' => $request->query()
            ]);
            abort(400, 'Product ID is required.');
        }

        Log::info("=== DesignController@changeProduct called ===", [
            'query_product_id' => $productId
        ]);

        $product = Product::with('categories')->findOrFail($productId);

        Log::info("=== Product fetched for ChangeProduct ===", [
            'product_id' => $product->id,
            'product_name' => $product->name,
            'categories_count' => $product->categories->count(),
            'categories' => $product->categories->pluck('name')->all()
        ]);

        // Get subsection of the first category (adjust as needed)
        $subsection = $product->categories->first()?->subsection;

        Log::info("=== Subsection determined ===", ['subsection' => $subsection]);

        $categories = $subsection
            ? Category::where('subsection', $subsection)->orderBy('name')->get()
            : Category::all();

        Log::info("=== Categories fetched for ChangeProduct ===", [
            'categories_count' => $categories->count(),
            'category_names' => $categories->pluck('name')->all()
        ]);

        return Inertia::render('Design/ChangeProduct', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }
}
