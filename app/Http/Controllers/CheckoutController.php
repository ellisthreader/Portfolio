<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    /**
     * Create a PaymentIntent for embedded Stripe checkout
     */
    public function createPaymentIntent(Request $request)
    {
        Log::info('PaymentIntent request received', $request->all());

        try {
            // Use backend secret key
            Stripe::setApiKey(env('STRIPE_SECRET'));

            $email = $request->input('email');
            $amount = $request->input('amount'); // in pence
            $items = $request->input('items', []);

            // Validate required parameters
            if (!$email || !$amount || empty($items)) {
                return response()->json(['error' => 'Missing required parameters'], 400);
            }

            // Ensure amount is integer
            $amount = (int)$amount;

            // Create Stripe PaymentIntent
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'gbp',
                'receipt_email' => $email,
                'metadata' => [
                    'items' => json_encode($items),
                ],
            ]);

            Log::info('PaymentIntent created', [
                'id' => $paymentIntent->id,
                'client_secret' => $paymentIntent->client_secret
            ]);

            // Return client_secret to frontend
            return response()->json([
                'client_secret' => $paymentIntent->client_secret
            ]);
        } catch (\Exception $e) {
            Log::error('Stripe PaymentIntent error: ' . $e->getMessage());

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
