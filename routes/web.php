<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Auth\AuthController;

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

// -----------------------------
// Authentication Pages
// -----------------------------
Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Auth/Login'))->name('register'); // same page for signup

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
// Dashboard (requires auth)
// -----------------------------
Route::get('/dashboard', fn() => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Profile Routes (requires auth)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/generate-avatar', [ProfileController::class, 'generateRandomAvatar'])->name('profile.generate-avatar');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// -----------------------------
// Include default Laravel Breeze/Jetstream auth routes
// -----------------------------
require __DIR__.'/auth.php';
