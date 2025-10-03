<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class ShippingService
{
    protected array $weights = [
        201 => 1.0, // Webdev fundamentals book
        202 => 3.0, // Tiktok starter pack
        203 => 1.0, // Marketing productivity
    ];

    protected array $domesticServices = [
        'RM_1' => 'Special Delivery Guaranteed by 1pm',
        'RM_24' => 'Tracked 24',
        'RM_48' => 'Tracked 48',
    ];

    /**
     * Calculate total weight of items
     */
    public function calculateWeight(array $items): float
    {
        $total = 0;
        foreach ($items as $item) {
            $id = $item['id'];
            $qty = $item['quantity'] ?? 1;
            if (isset($this->weights[$id])) {
                $total += $this->weights[$id] * $qty;
            } else {
                Log::warning("Unknown product id {$id}, using fallback weight 0.5kg");
                $total += 0.5 * $qty;
            }
        }
        Log::debug('Total weight calculated', ['weight' => $total]);
        return $total;
    }

    /**
     * Get shipping services with costs
     */
    public function getServices(array $items, string $country = '', string $postcode = ''): array
    {
        $weight = $this->calculateWeight($items);
        $country = strtoupper($country);
        $isDomestic = in_array($country, ['GB', 'UK']);

        Log::info($isDomestic ? 'Domestic shipping applied' : 'International shipping applied', ['country' => $country]);

        $services = [];

        if ($isDomestic) {
            foreach ($this->domesticServices as $code => $name) {
                $base = match($code) {
                    'RM_1' => 5.0,
                    'RM_24' => 3.0,
                    'RM_48' => 2.5,
                    default => 3.0
                };
                $cost = round($base * $weight, 2);
                $services[] = ['code' => $code, 'name' => $name, 'cost' => $cost];
                Log::info('Domestic shipping cost', ['code' => $code, 'cost' => $cost]);
            }
        } else {
            // International rules
            if ($weight <= 2) {
                $services[] = [
                    'code' => 'INT_ECO',
                    'name' => 'International Economy',
                    'cost' => 10.0,
                    'delivery_time' => '15-80 business days'
                ];
                $services[] = [
                    'code' => 'INT_TRACKED',
                    'name' => 'International Tracked',
                    'cost' => $country === 'EU' ? 15.0 : 18.0,
                    'delivery_time' => $country === 'EU' ? '3-5 business days' : '6-7 business days'
                ];
            } else {
                $services[] = [
                    'code' => 'INT_TRACKED_HEAVY',
                    'name' => 'International Tracked & Signed Heavier',
                    'cost' => $country === 'EU' ? 20.0 : 25.0,
                    'delivery_time' => $country === 'EU' ? '3-5 business days' : '6-7 business days'
                ];
            }
        }

        return $services;
    }
}
