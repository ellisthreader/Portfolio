<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        Log::info('PaymentIntent request received', $request->all());

        try {
            Stripe::setApiKey(config('services.stripe.secret'));

            $email = $request->input('email');
            $items = $request->input('items', []);
            $shippingOption = $request->input('shipping_option', 'second_class'); // default to 2nd class

            if (!$email || empty($items)) {
                return response()->json(['error' => 'Missing required parameters'], 400);
            }

            // 🛒 Subtotal (in pence)
            $subtotal = 0;
            foreach ($items as $item) {
                if (!isset($item['unit_price'], $item['quantity'])) {
                    return response()->json(['error' => 'Invalid item data'], 400);
                }
                $subtotal += ((int) $item['unit_price']) * ((int) $item['quantity']);
            }

            // 📦 Shipping cost (in pence)
            $shippingCost = $this->calculateShippingCost($shippingOption);

            // 💷 VAT (20%)
            $vat = round($subtotal * 0.2);

            // 🔢 Total (subtotal + VAT + shipping)
            $total = $subtotal + $vat + $shippingCost;

            $paymentIntent = PaymentIntent::create([
                'amount' => $total, // in pence
                'currency' => 'gbp',
                'receipt_email' => $email,
                'metadata' => [
                    'items' => json_encode($items),
                    'subtotal' => $subtotal,
                    'vat' => $vat,
                    'shipping' => $shippingCost,
                    'shipping_option' => $shippingOption,
                ],
            ]);

            $normalizedItems = array_map(function ($item) {
                return [
                    'name' => $item['name'] ?? 'Unknown',
                    'quantity' => (int) ($item['quantity'] ?? 1),
                    'unit_price' => isset($item['unit_price']) ? $item['unit_price'] / 100 : 0,
                    'image' => $item['image'] ?? null,
                ];
            }, $items);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'subtotal' => $subtotal / 100,
                'vat' => $vat / 100,
                'shipping' => $shippingCost / 100,
                'total' => $total / 100,
                'items' => $normalizedItems,
                'shipping_option' => $shippingOption,
            ]);

        } catch (\Exception $e) {
            Log::error('Stripe PaymentIntent error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Calculate shipping based on option
     * (you can later replace this with Royal Mail API calls)
     */
    private function calculateShippingCost(string $option): int
    {
        switch ($option) {
            case 'first_class':
                return 495; // £4.95 in pence
            case 'second_class':
            default:
                return 295; // £2.95 in pence
        }
    }
}
