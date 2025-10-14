<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\CouponController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within the "api" middleware group.
|
*/

// -----------------------------
// Checkout / Payments
// -----------------------------
Route::post('/create-payment-intent', [CheckoutController::class, 'createPaymentIntent']);

// -----------------------------
// Discounts
// -----------------------------
// ✅ Validate discount code (new)
Route::post('/discount/validate', [CouponController::class, 'apply']); // <-- updated to 'apply'

// -----------------------------
// Shipping
// -----------------------------
Route::post('/shipping/rates', [ShippingController::class, 'rates']);

// Optional: If you want a separate route to calculate cost for a selected service
// Route::post('/shipping-cost', [ShippingController::class, 'calculate']);

// -----------------------------
// Authentication
// -----------------------------
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// -----------------------------
// Protected routes (require auth)
// -----------------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
});
