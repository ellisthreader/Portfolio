<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ShippingService;
use Illuminate\Support\Facades\Log;

class ShippingController extends Controller
{
    protected $shippingService;

    public function __construct(ShippingService $shippingService)
    {
        $this->shippingService = $shippingService;
    }

    public function calculate(Request $request)
    {
        try {
            $method = $request->input('method');
            $items = $request->input('items', []);
            $country = $request->input('country', 'GB');
            $postcode = $request->input('postcode', '');

            if (!$method || empty($items)) {
                return response()->json(['error' => 'Missing parameters'], 400);
            }

            $cost = $this->shippingService->calculate($method, $items, $country, $postcode);

            Log::info('Shipping calculated', [
                'method' => $method,
                'items' => $items,
                'country' => $country,
                'postcode' => $postcode,
                'cost' => $cost,
            ]);

            return response()->json([
                'cost' => $cost,
            ]);

        } catch (\Exception $e) {
            Log::error('Shipping calculation error: ' . $e->getMessage());
            return response()->json(['error' => 'Shipping calculation failed'], 500);
        }
    }
}
