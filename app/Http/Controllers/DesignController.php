<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignController extends Controller
{
    public function show(Request $request)
    {
        $product = Product::with(['images', 'variants'])->where('slug', $request->slug)->firstOrFail();

        // Optionally, filter selected colour / size
        $selectedColour = $request->colour;
        $selectedSize = $request->size;

        return Inertia::render('Design/Design', [
            'product' => $product,
            'selectedColour' => $selectedColour,
            'selectedSize' => $selectedSize,
        ]);
    }
}
