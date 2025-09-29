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
            // Load Stripe secret key from config/services.php
            Stripe::setApiKey(config('services.stripe.secret'));

            $email = $request->input('email');
            $items = $request->input('items', []);

            // Log raw request items
            Log::info('Incoming items', $items);

            if (!$email || empty($items)) {
                return response()->json(['error' => 'Missing required parameters'], 400);
            }

            $subtotal = 0;
            foreach ($items as $item) {
                if (!isset($item['unit_price'], $item['quantity'])) {
                    Log::warning('Invalid item data', $item);
                    return response()->json(['error' => 'Invalid item data'], 400);
                }
                // unit_price is expected in pence
                $subtotal += ((int) $item['unit_price']) * ((int) $item['quantity']);
            }

            $vat = round($subtotal * 0.2);
            $total = $subtotal + $vat;

            $paymentIntent = PaymentIntent::create([
                'amount' => $total, // still in pence
                'currency' => 'gbp',
                'receipt_email' => $email,
                'metadata' => [
                    'items' => json_encode($items),
                    'subtotal' => $subtotal,
                    'vat' => $vat,
                ],
            ]);

            // Normalize items for frontend (convert back to £)
            $normalizedItems = array_map(function ($item) {
                return [
                    'name' => $item['name'] ?? 'Unknown',
                    'quantity' => (int) ($item['quantity'] ?? 1),
                    'unit_price' => isset($item['unit_price']) ? $item['unit_price'] / 100 : 0,
                    'image' => $item['image'] ?? null,
                ];
            }, $items);

            // Log outgoing response
            Log::info('PaymentIntent created', [
                'id' => $paymentIntent->id,
                'subtotal (£)' => $subtotal / 100,
                'vat (£)' => $vat / 100,
                'total (£)' => $total / 100,
                'client_secret' => $paymentIntent->client_secret,
                'items' => $normalizedItems,
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'subtotal' => $subtotal / 100,
                'vat' => $vat / 100,
                'total' => $total / 100,
                'items' => $normalizedItems,
            ]);

        } catch (\Exception $e) {
            Log::error('Stripe PaymentIntent error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
