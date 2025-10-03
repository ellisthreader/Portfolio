<?php

namespace App\Services;

class ShippingService
{
    /**
     * Get shipping cost based on method, items, and address.
     */
    public function calculate(string $method, array $items, string $country, string $postcode): float
    {
        // Define weights (kg) for products
        $weights = [
            'web-dev-fundamentals-hardcover' => 1.0,
            'tiktok-starterpack' => 5.0,
            'marketing-pack' => 1.0,
        ];

        // Calculate total weight
        $totalWeight = 0;
        foreach ($items as $item) {
            $id = strtolower(str_replace(' ', '-', $item['id'] ?? $item['name']));
            $qty = (int) ($item['quantity'] ?? 1);
            if (isset($weights[$id])) {
                $totalWeight += $weights[$id] * $qty;
            }
        }

        // Base shipping rates per kg
        $baseRates = [
            'RM_1ST' => 5.0, // £ per kg
            'RM_2ND' => 3.0, // £ per kg
        ];

        if (!isset($baseRates[$method])) {
            return 0;
        }

        // Add distance factor (example: outside UK = 2x cost)
        $distanceMultiplier = ($country !== 'GB') ? 2.0 : 1.0;

        // Final cost
        $cost = $baseRates[$method] * $totalWeight * $distanceMultiplier;

        // Round to 2 decimal places
        return round($cost, 2);
    }
}
