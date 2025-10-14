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
        Log::info('ShippingService initialized', ['token_present' => !empty($this->shippoToken)]);
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
            $payload = [
                'address_from' => $fromAddress,
                'address_to'   => $toAddress,
                'parcels'      => [$parcel],
                'async'        => false,
            ];

            // Log the exact payload being sent
            Log::info('Shippo Request Payload', ['payload' => $payload]);

            $response = Http::withHeaders([
                'Authorization' => 'ShippoToken ' . $this->shippoToken,
                'Content-Type'  => 'application/json',
            ])->post('https://api.goshippo.com/v1/shipments', $payload);


            Log::info('Shippo Raw Response', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            if ($response->failed()) {
                Log::error('Shippo API returned failed status', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return [];
            }

            $data = $response->json();

            if (!isset($data['rates']) || !is_array($data['rates'])) {
                Log::warning('Shippo response does not contain "rates"', $data);
                return [];
            }

            return $data['rates'];

        } catch (\Exception $e) {
            Log::error('Shippo API Exception', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);
            return [];
        }
    }
}
