<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class DesignController extends Controller
{
    public function show(Request $request, $slug)
    {
        $selectedColour = $request->query('colour');
        $selectedSize   = $request->query('size');

        Log::info("=== DesignController@show called ===", [
            'slug' => $slug,
            'colour' => $selectedColour,
            'size' => $selectedSize
        ]);

        $product = Product::with([
            'images',
            'variants.images',
            'categories'
        ])
        ->where('slug', $slug)
        ->firstOrFail();

        Log::info("=== Product fetched ===", [
            'product_id' => $product->id,
            'categories' => $product->categories->pluck('name')->all()
        ]);

        // Build color variants
        $product->colourProducts = collect($product->variants)
            ->groupBy('colour')
            ->map(function ($group, $colour) use ($product) {
                $firstVariant = $group->first();

                $images = $firstVariant->images->isNotEmpty()
                    ? $firstVariant->images->pluck('path')->map(fn($p) => asset($p))->all()
                    : $product->images->pluck('path')->map(fn($p) => asset($p))->all();

                return [
                    'colour' => $colour,
                    'slug'   => $firstVariant->slug,
                    'sizes'  => $group->pluck('size')->unique()->values()->all(),
                    'images' => $images,
                ];
            })
            ->values()
            ->all();

        // Fetch all categories with same name
        $categoryNames = $product->categories->pluck('name')->unique();

        $categories = Category::whereIn('name', $categoryNames)
            ->with([
                // Load real product data for the grid
                'products' => function ($q) {
                    $q->with('images'); // also loads first image
                }
            ])
            ->orderBy('section')
            ->get();

        // Organise into adult + kids
        $adultCategories = $categories->whereNull('age_group')->values();
        $kidsCategories = $categories
            ->whereNotNull('age_group')
            ->groupBy('age_group')
            ->map(fn($group) => $group->values());

        Log::info("=== Categories prepared ===", [
            'adult_count' => $adultCategories->count(),
            'kids_groups' => $kidsCategories->keys()->all()
        ]);

        return Inertia::render('Design/Design', [
            'product'          => $product,
            'selectedColour'   => $selectedColour,
            'selectedSize'     => $selectedSize,
            'adultCategories'  => $adultCategories,
            'kidsCategories'   => $kidsCategories
        ]);
    }
}
