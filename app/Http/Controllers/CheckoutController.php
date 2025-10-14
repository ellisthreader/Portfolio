<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Coupon;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class CheckoutController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        try {
            $data = $request->all();
            Log::info("[Checkout] Incoming create-payment-intent", $data);

            $items = $data['items'] ?? [];
            // shipping cost in cents if provided, fallback to shipping.cost in pence or £
            $shipping_cents = 0;
            if (isset($data['shipping']['cost'])) {
                $shipping_cents = intval($data['shipping']['cost']);
            } elseif (isset($data['shippingCost'])) {
                $shipping_cents = intval(round(floatval($data['shippingCost']) * 100));
            }

            // --- compute subtotal in cents
            $subtotal_cents = 0;
            foreach ($items as $it) {
                if (isset($it['unit_price_cents'])) {
                    $unit = intval($it['unit_price_cents']);
                } else {
                    $unit = intval(round(floatval($it['unit_price'] ?? 0) * 100));
                }
                $qty = intval($it['quantity'] ?? 1);
                $subtotal_cents += $unit * $qty;
            }

            // --- discount (in cents) applied only to product subtotal
            $discount_cents = 0;
            $discount_code = $data['discount_code'] ?? ($data['discount'] ?? null);

            if ($discount_code) {
                $coupon = Coupon::where('code', $discount_code)
                    ->where('active', 1)
                    ->first();

                if ($coupon) {
                    if ($coupon->type === 'percent') {
                        // 'value' assumed to be percent (e.g. 25)
                        $discount_cents = intval(round($subtotal_cents * ($coupon->value / 100)));
                    } else {
                        // 'value' assumed fixed amount in pence if stored as cents, otherwise as pounds in value
                        // adapt based on your DB; here we assume value is stored in pence if >1000, else £
                        $discount_cents = intval($coupon->value);
                        if ($discount_cents <= 10000 && $discount_cents < $subtotal_cents && $discount_cents < 1000) {
                            // if likely stored as £ (e.g. 5 means £5), convert to cents
                            $discount_cents = intval(round(floatval($coupon->value) * 100));
                        }
                        $discount_cents = min($discount_cents, $subtotal_cents);
                    }
                } else {
                    Log::warning("[Checkout] Invalid coupon code: {$discount_code}");
                }
            }

            $discounted_subtotal_cents = max($subtotal_cents - $discount_cents, 0);

            // --- VAT 20% on discounted subtotal
            $vat_cents = intval(round($discounted_subtotal_cents * 0.2));

            // --- total cents = discounted subtotal + vat + shipping
            $total_cents = max($discounted_subtotal_cents + $vat_cents + $shipping_cents, 0);

            Log::info("[Checkout] Totals (cents)", [
                'subtotal_cents' => $subtotal_cents,
                'discount_cents' => $discount_cents,
                'discounted_subtotal_cents' => $discounted_subtotal_cents,
                'vat_cents' => $vat_cents,
                'shipping_cents' => $shipping_cents,
                'total_cents' => $total_cents,
            ]);

            Stripe::setApiKey(env('STRIPE_SECRET'));

            $paymentIntent = PaymentIntent::create([
                'amount' => $total_cents,
                'currency' => 'gbp',
                'metadata' => [
                    'email' => $data['email'] ?? null,
                    'discount_code' => $discount_code ?? null,
                ],
                'automatic_payment_methods' => ['enabled' => true],
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'amount' => $total_cents,
                'total' => number_format($total_cents / 100, 2, '.', ''),
            ]);
        } catch (\Throwable $e) {
            Log::error("[Checkout] createPaymentIntent error: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
