<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ShippingService
{
    protected string $shippoToken;

    public function __construct()
    {
        $this->shippoToken = config('services.shippo.token');
        Log::info('ShippingService initialized with Shippo token'); // Log initialization
    }

    /**
     * Get shipping rates from Shippo
     *
     * @param array $fromAddress
     * @param array $toAddress
     * @param array $parcel
     * @return array
     */
    public function getRates(array $fromAddress, array $toAddress, array $parcel): array
    {
        try {
            // Log request data
            Log::info('Shippo Request Data', [
                'address_from' => $fromAddress,
                'address_to' => $toAddress,
                'parcel' => $parcel,
            ]);

            // Send POST request to Shippo
            $response = Http::withHeaders([
                'Authorization' => 'ShippoToken ' . $this->shippoToken,
                'Content-Type' => 'application/json',
            ])->post('https://api.shippo.com/v1/shipments', [
                'address_from' => $fromAddress,
                'address_to'   => $toAddress,
                'parcels'      => [$parcel],
                'async'        => false,
            ]);

            // Log raw response
            Log::info('Shippo Raw Response', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            if ($response->failed()) {
                Log::error('Shippo API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return [];
            }

            // Parse rates from response
            $data = $response->json();
            Log::info('Shippo Parsed Response', $data);

            $rates = $data['rates'] ?? [];
            Log::info('Shippo Rates Extracted', ['count' => count($rates), 'rates' => $rates]);

            return $rates;
        } catch (\Exception $e) {
            Log::error('Shippo API Exception', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return [];
        }
    }
}
