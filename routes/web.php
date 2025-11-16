<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\LiveChatController;
use App\Http\Controllers\AdminChatController;
use App\Http\Controllers\ProductController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// -----------------------------
// Public Pages
// -----------------------------
Route::get('/', fn() => Inertia::render('Welcome/Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
]))->name('home');

Route::get('/projects', fn() => Inertia::render('Projects/Projects'))->name('projects');
Route::get('/courses', fn() => Inertia::render('Courses/Index'))->name('courses');
Route::get('/checkout', fn() => Inertia::render('CheckoutPage'))->name('checkout');

// -----------------------------
// ✅ Product Pages (Dynamic from Database)
// -----------------------------
Route::get('/products/{type}', [ProductController::class, 'index'])->name('products.index');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');

// -----------------------------
// Order Confirmation Pages
// -----------------------------
Route::get('/order-confirmed/{orderNumber}', [CheckoutController::class, 'orderConfirmed'])->name('order.confirmed');
Route::get('/order-confirmed', fn() => redirect('/'))->name('order.confirmed.redirect');

// -----------------------------
// Orders (auth required)
// -----------------------------
Route::middleware('auth')->group(function () {
    Route::get('/user-orders', [CheckoutController::class, 'userOrders'])->name('orders.list');
    Route::get('/orders/{orderNumber}', [CheckoutController::class, 'showOrder'])->name('orders.show');
});

Route::get('/order-latest', [CheckoutController::class, 'latestOrder'])->name('order.latest');

// -----------------------------
// Stripe Checkout API
// -----------------------------
Route::post('/create-payment-intent', [CheckoutController::class, 'createPaymentIntent']);
Route::post('/checkout/store-order', [CheckoutController::class, 'storeOrder'])->name('checkout.store');

// -----------------------------
// Auth Pages
// -----------------------------
Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Auth/Login'))->name('register');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Password reset
Route::get('/reset-password/{token}', fn(Request $request, $token) => Inertia::render('Auth/ResetPassword', [
    'token' => $token,
    'email' => $request->email,
]))->name('password.reset');

Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');

// -----------------------------
// Dashboard (user)
// -----------------------------
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');
});

// -----------------------------
// Admin Dashboard + Live Chat Manager
// -----------------------------
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {

    // Admin home dashboard
    Route::get('/dashboard', fn() => Inertia::render('Admin/Dashboard'))->name('admin.dashboard');

    // Live Chats Manager
    Route::get('/livechats', [AdminChatController::class, 'index'])->name('admin.livechats');
    Route::get('/active-chats', [AdminChatController::class, 'activeChats'])->name('admin.active.chats');
    Route::get('/livechats/{chat}', [AdminChatController::class, 'show'])->name('admin.livechats.show');
    Route::get('/livechats/{chat}/messages', [AdminChatController::class, 'messages'])->name('admin.livechats.messages');
    Route::post('/livechats/{chat}/send', [AdminChatController::class, 'sendMessage'])->name('admin.livechats.send');
    Route::post('/livechats/{chat}/join', [AdminChatController::class, 'joinChat'])->name('admin.livechats.join');
    Route::post('/livechats/{chat}/system-message', [AdminChatController::class, 'sendSystemMessage'])->name('admin.livechats.system-message');
    Route::patch('/livechats/{chat}/rename', [AdminChatController::class, 'renameChat'])->name('admin.livechats.rename');
    Route::delete('/livechats/{chat}', [AdminChatController::class, 'destroy'])->name('admin.livechats.destroy');
});

// -----------------------------
// Profile Management
// -----------------------------
Route::middleware('auth')->group(function () {
    Route::get('/profile', fn() => redirect()->route('profile.edit'));
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update.custom');
    Route::post('/profile/generate-avatar', [ProfileController::class, 'generateRandomAvatar'])->name('profile.generate-avatar');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// -----------------------------
// Email Verification
// -----------------------------
Route::get('/email/verify', fn() => Inertia::render('Auth/VerifyEmail'))
    ->middleware('auth')
    ->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', fn(EmailVerificationRequest $request) => redirect()->route('profile.edit')->with('verified', 1))
    ->middleware(['auth', 'signed'])
    ->name('verification.verify');

Route::post('/email/verification-notification', fn(Request $request) => $request->user()->update(['last_verification_sent_at' => now()]))
    ->middleware('auth')
    ->name('verification.send');

// -----------------------------
// Help Centre & FAQ Pages
// -----------------------------
Route::get('/help', fn() => Inertia::render('Help/HelpCentre'))->name('help');
Route::get('/help/orders', fn() => Inertia::render('Help/OrdersShipping'))->name('help.orders');
Route::get('/help/returns', fn() => Inertia::render('Help/ReturnsRefunds'))->name('help.returns');
Route::get('/help/account', fn() => Inertia::render('Help/AccountManagement'))->name('help.account');
Route::get('/help/payments', fn() => Inertia::render('Help/PaymentsBilling'))->name('help.payments');
Route::get('/help/technical', fn() => Inertia::render('Help/TechnicalSupport'))->name('help.technical');
Route::get('/help/privacy', fn() => Inertia::render('Help/PrivacySecurity'))->name('help.privacy');
Route::get('/support', fn() => Inertia::render('Help/Support'))->name('support');
Route::get('/faq', fn() => Inertia::render('Help/FAQ'))->name('faq');

// -----------------------------
// Customer Livechat (frontend page + API)
// -----------------------------
Route::get('/help/livechat', fn() => Inertia::render('Help/Livechat'))->name('help.livechat');

// Guest/User Livechat API Routes
Route::get('/livechat/messages', [LiveChatController::class, 'fetchMessages'])->name('livechat.messages');
Route::post('/livechat/message', [LiveChatController::class, 'sendMessage'])->name('livechat.send');
Route::delete('/livechat/{chat}', [LiveChatController::class, 'deleteChat'])->name('livechat.delete');

// Optional Chat API
Route::get('/api/chat', [ChatController::class, 'index'])->name('chat.index');

// -----------------------------
// Invoices
// -----------------------------
Route::get('/invoice/{orderId}', [InvoiceController::class, 'download'])->name('invoice.download');

// -----------------------------
// Username & Email Checks
// -----------------------------
Route::get('/check-username', fn(Request $request) => response()->json([
    'exists' => User::where('username', $request->username)->exists(),
]))->name('check.username');

Route::get('/check-email', fn(Request $request) => response()->json([
    'exists' => User::where('email', $request->email)->exists(),
]))->name('check.email');
