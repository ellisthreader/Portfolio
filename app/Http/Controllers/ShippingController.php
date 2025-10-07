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

    public function rates(Request $request)
    {
        // 👇 Add this line to confirm the controller and function were triggered
        Log::info('ShippingController@rates called', [
            'timestamp' => now()->toDateTimeString(),
            'request_source' => $request->header('Referer'),
        ]);

        $request->validate([
            'to_address' => 'required|array',
            'parcel' => 'required|array',
        ]);

        // Fixed from address for Ellis' Courses
        $fromAddress = [
            'name' => "Ellis' Courses",
            'street1' => '390 Springfield Road',
            'city' => 'Chelmsford',
            'state' => '',
            'zip' => 'CM2 6AT',
            'country' => 'GB',
        ];

        $toAddress = $request->input('to_address');
        $parcel = $request->input('parcel');

        // Log incoming request from frontend
        Log::info('ShippingController: Incoming request', [
            'to_address' => $toAddress,
            'parcel' => $parcel,
        ]);

        // Get rates from Shippo (logs will also be in ShippingService)
        $rates = $this->shippingService->getRates($fromAddress, $toAddress, $parcel);

        // Log the rates returned
        Log::info('ShippingController: Shippo rates returned', [
            'rates' => $rates,
        ]);

        return response()->json($rates);
    }
}
