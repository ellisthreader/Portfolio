<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    // -----------------------
    // REGISTER
    // -----------------------
    public function register(Request $request)
    {
        $messages = [
            'username.unique' => 'Username already exists',
            'password.confirmed' => 'Passwords do not match',
        ];

        $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], $messages);

        $username = $request->username;

        // Check for existing username (with suggestions)
        $exists = User::where('username', $username)->exists();
        $suggestions = [];
        if ($exists) {
            for ($i = 1; $i <= 5; $i++) {
                $newName = $username . $i;
                if (!User::where('username', $newName)->exists()) {
                    $suggestions[] = $newName;
                }
            }
            return back()->withErrors(['username' => 'Username already exists'])->with('suggestions', $suggestions);
        }

        // Create the user
        $user = User::create([
            'username' => $username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        Log::info("User created: {$user->email}");

        // Log the user in
        Auth::login($user);

        // Fire Registered event ONCE
        if (! app()->runningUnitTests() && ! session()->has("registered_user_{$user->id}")) {
            Log::info("Firing Registered event for user ID {$user->id}");
            event(new Registered($user));
            session()->put("registered_user_{$user->id}", true);
        }

        // Assign random Unsplash avatar
        try {
            $accessKey = env('UNSPLASH_ACCESS_KEY');
            $response = Http::get('https://api.unsplash.com/photos/random', [
                'query'     => 'cartoon',
                'client_id' => $accessKey,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['urls']['small'])) {
                    $imageUrl = $data['urls']['small'];
                    $imgResp = Http::get($imageUrl);
                    if ($imgResp->successful()) {
                        $extension = $this->mimeToExtension($imgResp->header('Content-Type')) ?? 'jpg';
                        $fileName = 'avatars/' . Str::random(40) . '.' . $extension;
                        Storage::disk('public')->put($fileName, $imgResp->body());
                        $user->avatar = $fileName;
                        $user->avatar_url = Storage::url($fileName);
                        $user->save();
                        Log::info("Avatar saved for {$user->email}");
                    } else {
                        $user->avatar_url = $imageUrl;
                        $user->save();
                        Log::info("Avatar URL assigned (fallback) for {$user->email}");
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error("Unsplash API error for user {$user->email}: " . $e->getMessage());
        }

        // ✅ Redirect to profile edit page instead of returning JSON
        return redirect()->route('profile.edit');
    }

    // -----------------------
    // LOGIN
    // -----------------------
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            // ✅ Redirect to profile edit or dashboard
            return redirect()->intended('/profile/edit');
        }

        return back()->withErrors([
            'email' => 'Incorrect email or password.'
        ])->onlyInput('email');
    }

    // -----------------------
    // LOGOUT
    // -----------------------
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // ✅ Redirect to login page for Inertia
        return redirect()->route('login');
    }

    // -----------------------
    // FORGOT PASSWORD
    // -----------------------
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => ['required','email']]);
        \DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        $status = Password::broker('users')->sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('status', 'Reset link sent successfully.');
        }

        return back()->withErrors([
            'email' => __($status)
        ]);
    }

    // -----------------------
    // RESET PASSWORD
    // -----------------------
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::broker('users')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return redirect()->route('login')->with('status', 'Password reset successful. You can now log in.');
        }

        return back()->withErrors(['email' => 'Invalid or expired link.']);
    }

    // -----------------------
    // Helper: MIME -> extension
    // -----------------------
    private function mimeToExtension(?string $mime): ?string
    {
        if (!$mime) return null;
        $map = [
            'image/jpeg' => 'jpg',
            'image/jpg'  => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'image/gif'  => 'gif',
        ];
        return $map[strtolower($mime)] ?? null;
    }
}
