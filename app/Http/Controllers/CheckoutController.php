<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf; // ✅ For PDF generation
use Shippo;

class CheckoutController extends Controller
{
    /**
     * Create a Stripe PaymentIntent
     */
    public function createPaymentIntent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'email' => 'required|email',
            'shipping.cost' => 'nullable|numeric',
            'discount_code' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            $data = $request->all();
            $items = $data['items'];
            $shipping_cents = isset($data['shipping']['cost']) ? intval($data['shipping']['cost']) : 0;

            $subtotal_cents = 0;
            foreach ($items as $it) {
                $price = isset($it['unit_price_cents'])
                    ? intval($it['unit_price_cents'])
                    : intval(round(($it['unit_price'] ?? 0) * 100));
                $qty = intval($it['quantity'] ?? 1);
                $subtotal_cents += $price * $qty;
            }

            $discount_cents = 0;
            $discount_code = $data['discount_code'] ?? null;
            if ($discount_code) {
                $coupon = Coupon::where('code', $discount_code)->where('active', 1)->first();
                if ($coupon) {
                    $discount_cents = $coupon->type === 'percent'
                        ? intval(round($subtotal_cents * ($coupon->value / 100)))
                        : intval(round($coupon->value * 100));
                }
            }

            $discounted_subtotal_cents = max($subtotal_cents - $discount_cents, 0);
            $vat_cents = intval(round($discounted_subtotal_cents * 0.2));
            $total_cents = $discounted_subtotal_cents + $vat_cents + $shipping_cents;

            Stripe::setApiKey(env('STRIPE_SECRET'));
            $paymentIntent = PaymentIntent::create([
                'amount' => $total_cents,
                'currency' => 'gbp',
                'automatic_payment_methods' => ['enabled' => true],
                'metadata' => [
                    'email' => $data['email'],
                    'discount_code' => $discount_code ?? '',
                    'user_id' => optional(auth()->user())->id,
                ],
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'subtotal' => $subtotal_cents / 100,
                'discount' => $discount_cents / 100,
                'vat' => $vat_cents / 100,
                'shipping' => $shipping_cents / 100,
                'total' => $total_cents / 100,
            ]);
        } catch (\Throwable $e) {
            Log::error("[Checkout] PaymentIntent error", ['msg' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Store order after successful payment
     */
    public function storeOrder(Request $request)
    {
        Log::info('[storeOrder] Incoming request', ['request' => $request->all()]);

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'items' => 'required|array|min:1',
            'totals.total' => 'required|numeric',
            'delivery.firstName' => 'required|string',
            'delivery.lastName' => 'required|string',
            'delivery.line1' => 'nullable|string',
            'delivery.city' => 'nullable|string',
            'delivery.postcode' => 'nullable|string',
            'delivery.country' => 'nullable|string',
            'payment_intent_id' => 'nullable|string',
            'discount_code' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }

        try {
            DB::beginTransaction();
            $data = $request->all();

            // 🧾 Create the main order
            $order = Order::create([
                'user_id' => optional(auth()->user())->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'email' => $data['email'],
                'subtotal' => $data['totals']['subtotal'] ?? 0,
                'discount_code' => $data['discount_code'] ?? null,
                'discount_amount' => $data['totals']['discount'] ?? 0,
                'vat' => $data['totals']['vat'] ?? 0,
                'shipping' => $data['totals']['shipping'] ?? 0,
                'total' => $data['totals']['total'] ?? 0,
                'payment_intent_id' => $data['payment_intent_id'] ?? null,
                'status' => 'paid',
                'first_name' => $data['delivery']['firstName'],
                'last_name' => $data['delivery']['lastName'],
                'phone' => $data['delivery']['phone'] ?? null,
                'address_line1' => $data['delivery']['line1'] ?? null,
                'address_line2' => $data['delivery']['line2'] ?? null,
                'city' => $data['delivery']['city'] ?? null,
                'postcode' => $data['delivery']['postcode'] ?? null,
                'country' => $data['delivery']['country'] ?? null,
            ]);

            // 🧩 Save each order item
            foreach ($data['items'] as $item) {
                $filename = $item['image'] ?? null;
                Log::info('[storeOrder] Processing item', ['item' => $item]);

                if ($filename && !Str::startsWith($filename, ['http://', 'https://'])) {
                    $filename = url($filename);
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'product_name' => $item['title'],
                    'image_url' => $filename,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'line_total' => $item['price'] * $item['quantity'],
                ]);
            }

            // 🚚 (Optional) Create shipping label
            try {
                \Shippo::setApiKey(env('SHIPPO_API_KEY'));
                $shipment = \Shippo_Shipment::create([
                    'address_from' => [
                        'name' => env('SHIPPO_FROM_NAME', 'Your Store Name'),
                        'street1' => env('SHIPPO_FROM_ADDRESS', '123 Example St'),
                        'city' => env('SHIPPO_FROM_CITY', 'London'),
                        'zip' => env('SHIPPO_FROM_ZIP', 'E1 1AA'),
                        'country' => env('SHIPPO_FROM_COUNTRY', 'GB'),
                    ],
                    'address_to' => [
                        'name' => $order->first_name . ' ' . $order->last_name,
                        'street1' => $order->address_line1,
                        'city' => $order->city,
                        'zip' => $order->postcode,
                        'country' => $order->country,
                    ],
                    'parcels' => [[
                        'length' => '10',
                        'width' => '7',
                        'height' => '2',
                        'distance_unit' => 'in',
                        'weight' => '1',
                        'mass_unit' => 'lb',
                    ]],
                    'async' => false,
                ]);

                $rate = $shipment['rates'][0];
                $transaction = \Shippo_Transaction::create([
                    'rate' => $rate['object_id'],
                    'label_file_type' => 'PDF',
                    'async' => false,
                ]);

                $order->tracking_number = $transaction['tracking_number'] ?? null;
                $order->tracking_url = $transaction['tracking_url_provider'] ?? null;
                $order->carrier = $transaction['carrier'] ?? null;
                $order->save();
            } catch (\Throwable $shippoError) {
                Log::error('[Shippo] Failed to create shipping label', [
                    'msg' => $shippoError->getMessage(),
                ]);
            }

            // ✅ Generate and save PDF invoice
            try {
                $order->load('items');
                $pdf = Pdf::loadView('invoices.invoice', ['order' => $order]);
                $filePath = 'invoices/invoice_' . $order->order_number . '.pdf';
                Storage::disk('public')->put($filePath, $pdf->output());
                $order->update(['invoice_path' => $filePath]);
            } catch (\Throwable $pdfError) {
                Log::error('[Invoice PDF] Failed to generate invoice', [
                    'msg' => $pdfError->getMessage(),
                ]);
            }

            DB::commit();

            Log::info('[storeOrder] Order stored successfully', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ]);

            return response()->json([
                'success' => true,
                'order_number' => $order->order_number,
                'invoice_url' => asset('storage/' . $order->invoice_path),
                'tracking_number' => $order->tracking_number,
                'tracking_url' => $order->tracking_url,
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('[storeOrder] Error storing order', [
                'msg' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Order confirmation page (Inertia)
     */
    public function orderConfirmed($orderNumber)
    {
        $order = Order::with('items')->where('order_number', $orderNumber)->first();

        if (!$order) {
            return Inertia::render('Errors/NotFound', ['message' => 'Order not found.']);
        }

        foreach ($order->items as $item) {
            if (!$item->image_url || !Str::startsWith($item->image_url, ['http://', 'https://'])) {
                $item->image_url = asset('images/' . ($item->image_url ?? 'placeholder.jpg'));
            }
        }

        return Inertia::render('OrderConfirmed', [
            'order' => array_merge($order->toArray(), [
                'invoice_url' => $order->invoice_path
                    ? asset('storage/' . $order->invoice_path)
                    : null,
            ]),
        ]);
    }

    public function showOrder($orderNumber)
    {
        $order = Order::with('items')->where('order_number', $orderNumber)->first();

        if (!$order) {
            return Inertia::render('Errors/NotFound', ['message' => 'Order not found.']);
        }

        foreach ($order->items as $item) {
            if (!$item->image_url || !Str::startsWith($item->image_url, ['http://', 'https://'])) {
                $item->image_url = asset('images/' . ($item->image_url ?? 'placeholder.jpg'));
            }
        }

        return Inertia::render('Orders/OrderDetails', [
            'order' => array_merge($order->toArray(), [
                'invoice_url' => $order->invoice_path
                    ? asset('storage/' . $order->invoice_path)
                    : null,
            ]),
        ]);
    }

    public function latestOrder(Request $request)
    {
        $userId = optional(auth()->user())->id;
        if (!$userId) {
            return response()->json(['success' => false, 'message' => 'User not logged in']);
        }

        $order = Order::with('items')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found']);
        }

        foreach ($order->items as $item) {
            if (!$item->image_url || !Str::startsWith($item->image_url, ['http://', 'https://'])) {
                $item->image_url = asset('images/' . ($item->image_url ?? 'placeholder.jpg'));
            }
        }

        return response()->json([
            'success' => true,
            'order' => array_merge($order->toArray(), [
                'invoice_url' => $order->invoice_path
                    ? asset('storage/' . $order->invoice_path)
                    : null,
            ]),
        ]);
    }

    public function userOrders(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $orders = Order::with('items')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        $formattedOrders = $orders->map(function ($order, $index) {
            foreach ($order->items as $item) {
                if (!$item->image_url || !Str::startsWith($item->image_url, ['http://', 'https://'])) {
                    $item->image_url = asset('images/' . ($item->image_url ?? 'placeholder.jpg'));
                }
            }
            return array_merge($order->toArray(), [
                'order_position' => $index + 1,
                'invoice_url' => $order->invoice_path
                    ? asset('storage/' . $order->invoice_path)
                    : null,
            ]);
        });

        return response()->json([
            'success' => true,
            'orders' => $formattedOrders,
        ]);
    }
}
