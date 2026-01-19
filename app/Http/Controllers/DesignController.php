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

        // -------------------------------
        // LOAD PRODUCT
        // -------------------------------
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

        // -------------------------------
        // BUILD COLOUR VARIANT STRUCTURE
        // -------------------------------
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

        // -------------------------------
        // HELPER: map product images to URLs
        // -------------------------------
        $mapProducts = function ($products) {
            return $products->map(function ($p) {
                $images = $p->images->isNotEmpty()
                    ? $p->images->pluck('path')->map(fn($path) => asset($path))->all()
                    : [];

                return [
                    'id'            => $p->id,
                    'name'          => $p->name,
                    'slug'          => $p->slug,
                    'brand'         => $p->brand,
                    'price'         => $p->price,
                    'original_price'=> $p->original_price,
                    'images'        => $images,
                ];
            })->values()->all();
        };

        // -----------------------------------------
        // ADULT CATEGORIES
        // -----------------------------------------
        $adultCategories = Category::whereNull('age_group')
            ->orderBy('section')
            ->get()
            ->map(function ($cat) use ($mapProducts) {
                return [
                    'id'       => $cat->id,
                    'name'     => $cat->name,
                    'section'  => $cat->section,
                    'products' => $mapProducts($cat->products()->with('images')->get()),
                ];
            });

        // -----------------------------------------
        // KIDS CATEGORIES
        // -----------------------------------------
        $kidsCategories = Category::whereNotNull('age_group')
            ->orderBy('age_group')
            ->orderBy('section')
            ->get()
            ->groupBy('age_group')
            ->map(function ($group) use ($mapProducts) {
                return $group->map(function ($cat) use ($mapProducts) {
                    return [
                        'id'        => $cat->id,
                        'name'      => $cat->name,
                        'section'   => $cat->section,
                        'age_group' => $cat->age_group,
                        'products'  => $mapProducts($cat->products()->with('images')->get()),
                    ];
                })->values();
            });

        // -----------------------------------------
        // PRODUCT GRID — related products
        // -----------------------------------------
        $categoryNames = $product->categories->pluck('name')->unique();

        $relatedProducts = Product::with('images')
            ->whereHas('categories', function ($q) use ($categoryNames) {
                $q->whereIn('name', $categoryNames);
            })
            ->where('id', '!=', $product->id)
            ->get();

        return Inertia::render('Design/Design', [
            'product'          => $product,
            'selectedColour'   => $selectedColour,
            'selectedSize'     => $selectedSize,
            'adultCategories'  => $adultCategories,
            'kidsCategories'   => $kidsCategories,
            'relatedProducts'  => $relatedProducts
        ]);
    }
}
