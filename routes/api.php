<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShippingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Build something great!
|
*/

// -----------------------------
// Checkout / Payments
// -----------------------------
Route::post('/create-payment-intent', [CheckoutController::class, 'createPaymentIntent']);

// -----------------------------
// Shipping
// -----------------------------
// Get available shipping rates from Shippo
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
    // Get authenticated user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Update profile
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
});
