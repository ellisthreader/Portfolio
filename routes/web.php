<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Carbon;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// -----------------------------
// Public Pages
// -----------------------------
Route::get('/', function () {
    return Inertia::render('Welcome/Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

Route::get('/projects', fn() => Inertia::render('Projects/Projects'))->name('projects');
Route::get('/courses', fn() => Inertia::render('Courses/Index'))->name('courses');
Route::get('/checkout', fn() => Inertia::render('CheckoutPage'))->name('checkout');

// ✅ Order confirmation page
Route::get('/order-confirmed', function (Request $request) {
    $items = $request->get('items', []);

    return Inertia::render('OrderConfirmed', [
        'email'    => $request->get('email'),
        'items'    => $items, // array of purchased items [{id, title, image, price, quantity}]
        'subtotal' => $request->get('subtotal'),
        'vat'      => $request->get('vat'),
        'total'    => $request->get('total'),
    ]);
})->name('order.confirmed');

// -----------------------------
// Authentication Pages
// -----------------------------
Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Auth/Login'))->name('register');

// -----------------------------
// Password Reset Page (GET form)
// -----------------------------
Route::get('/reset-password/{token}', function (Request $request, $token) {
    return Inertia::render('Auth/ResetPassword', [
        'token' => $token,
        'email' => $request->email,
    ]);
})->name('password.reset');

// -----------------------------
// Authentication API (POST)
// -----------------------------
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// -----------------------------
// Username & Email Availability Checks
// -----------------------------
Route::get('/check-username', function (Request $request) {
    $username = $request->query('username');
    $exists = User::where('username', $username)->exists();
    $suggestions = [];

    if ($exists) {
        for ($i = 1; $i <= 5; $i++) {
            $newName = $username . $i;
            if (!User::where('username', $newName)->exists()) {
                $suggestions[] = $newName;
            }
        }
    }

    return response()->json([
        'exists' => $exists,
        'suggestions' => $suggestions,
    ]);
});

Route::get('/check-email', function (Request $request) {
    $email = $request->query('email');
    $exists = User::where('email', $email)->exists();

    return response()->json([
        'exists' => $exists,
        'message' => $exists ? 'This email is already registered.' : 'Email is available.',
    ]);
});

// -----------------------------
// Stripe Checkout API
// -----------------------------
Route::post('/create-checkout-session', [CheckoutController::class, 'createCheckoutSession']);

// -----------------------------
// Dashboard (requires auth + verified email)
// -----------------------------
Route::get('/dashboard', fn() => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// -----------------------------
// Profile Routes (requires auth)
// -----------------------------
Route::middleware('auth')->group(function () {
    Route::get('/profile', fn() => redirect()->route('profile.edit'));
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/generate-avatar', [ProfileController::class, 'generateRandomAvatar'])->name('profile.generate-avatar');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// -----------------------------
// Email Verification Routes
// -----------------------------
Route::get('/email/verify', fn() => Inertia::render('Auth/VerifyEmail'))
    ->middleware('auth')
    ->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect()->route('profile.edit')->with('verified', 1);
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $user = $request->user();
    $cooldownMinutes = 1;

    $remaining = 0;
    if ($user->last_verification_sent_at) {
        $last = Carbon::parse($user->last_verification_sent_at);
        $elapsed = $last->diffInSeconds(now());
        $remaining = max(0, ($cooldownMinutes * 60) - $elapsed);
    }

    if ($remaining > 0) {
        return response()->json([
            'success' => false,
            'message' => 'Please wait before resending.',
            'remaining_seconds' => $remaining,
            'cooldown_ends_at' => $user->last_verification_sent_at->addMinutes($cooldownMinutes)->toIso8601String(),
            'server_time' => now()->toIso8601String(),
        ], 429);
    }

    $user->update(['last_verification_sent_at' => now()]);

    return response()->json([
        'success' => true,
        'message' => 'Verification email sent!',
        'remaining_seconds' => $cooldownMinutes * 60,
        'cooldown_ends_at' => now()->addMinutes($cooldownMinutes)->toIso8601String(),
        'server_time' => now()->toIso8601String(),
    ]);
})->middleware(['auth'])->name('verification.send');
