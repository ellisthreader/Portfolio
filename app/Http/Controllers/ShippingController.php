<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ShippingService;
use Illuminate\Support\Facades\Log;

class ShippingController extends Controller
{
    protected ShippingService $shippingService;

    public function __construct(ShippingService $shippingService)
    {
        $this->shippingService = $shippingService;
    }

    /**
     * Calculate shipping options or cost
     */
    public function calculate(Request $request)
    {
        $payload = $request->all();
        Log::info('ShippingController@calculate called', ['payload' => $payload]);

        $country = $request->input('country', '');
        $postcode = $request->input('postcode', '');
        $items = $request->input('items', []);
        $service = $request->input('service', null);

        // Get all services
        $services = $this->shippingService->getServices($items, $country, $postcode);

        if ($service) {
            $filtered = array_filter($services, fn($s) => $s['code'] === $service);
            $cost = $filtered ? array_values($filtered)[0]['cost'] : 0;

            Log::info('Shipping cost calculated', [
                'method' => $service,
                'country' => $country,
                'cost' => $cost
            ]);

            return response()->json(['cost' => $cost]);
        }

        // Return all available services if no specific service selected
        return response()->json(['services' => $services]);
    }
}
