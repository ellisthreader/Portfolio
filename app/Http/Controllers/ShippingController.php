<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ShippingService;

class ShippingController extends Controller
{
    protected ShippingService $shippingService;

    public function __construct(ShippingService $shippingService)
    {
        $this->shippingService = $shippingService;
    }

    public function rates(Request $request)
    {
        $validated = $request->validate([
            'to_address' => 'required|array',
            'parcel'     => 'required|array',
        ]);

        // Your business' FROM address (fixed)
        $fromAddress = [
            'name'    => "Ellis' Courses",
            'street1' => '390 Springfield Road',
            'city'    => 'Chelmsford',
            'zip'     => 'CM2 6AT',
            'country' => 'GB',
        ];

        // Use real TO address provided by the request
        $toAddress = $validated['to_address'];

        // Use real parcel dimensions from request
        $parcel = $validated['parcel'];

        $rates = $this->shippingService->getRates($fromAddress, $toAddress, $parcel);

        return response()->json($rates);
    }
}
