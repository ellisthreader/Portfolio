<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Log;

class ProductSearchController extends Controller
{
    /**
     * Category search endpoint for the autocomplete search bar.
     *
     * GET /search-categories?q=...
     */
    public function searchCategories(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $queryBuilder = Category::query()
            ->with(['products.images']); // include products + their images

        if ($q !== '') {
            $like = '%' . str_replace('%', '\\%', $q) . '%';

            $queryBuilder->where(function ($builder) use ($like) {
                $builder->where('name', 'LIKE', $like)
                        ->orWhere('section', 'LIKE', $like)
                        ->orWhere('subsection', 'LIKE', $like)
                        ->orWhere('age_group', 'LIKE', $like) // ✅ allow searching by age group
                        ->orWhere('slug', 'LIKE', $like);
            });
        }

        // Fetch categories
        $categories = $queryBuilder
            ->orderBy('age_group')
            ->orderBy('section')
            ->orderBy('subsection')
            ->orderBy('name')
            ->get();

        // Build frontend response
        $results = $categories->map(function ($c) {
            return [
                'id'         => $c->id,
                'name'       => $c->name,
                'slug'       => $c->slug,
                'section'    => $c->section,
                'subsection' => $c->subsection,
                'age_group'  => $c->age_group, // ✅ send age group to frontend

                // include products
                'products'   => $c->products->map(function ($p) {
                    return [
                        'id'    => $p->id,
                        'name'  => $p->name,
                        'slug'  => $p->slug,
                        'price' => $p->price,
                        'image' => $p->images->first()
                            ? asset($p->images->first()->path)
                            : null,
                    ];
                })->values()->all(),
            ];
        })->values();

        // 🔥 LOG FULL PAYLOAD (categories + products)
        Log::info("📦 Category Search Response Sent", [
            'query'             => $q,
            'categories_found'  => $results->count(),
            'categories'        => $results,
        ]);

        return response()->json($results);
    }
}
