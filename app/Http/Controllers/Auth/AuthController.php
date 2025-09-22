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

        // Validate input
        $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], $messages);

        $username = $request->username;

        // Check for existing username and provide suggestions
        $exists = User::where('username', $username)->exists();
        $suggestions = [];
        if ($exists) {
            for ($i = 1; $i <= 5; $i++) {
                $newName = $username . $i;
                if (!User::where('username', $newName)->exists()) {
                    $suggestions[] = $newName;
                }
            }
            return response()->json([
                'errors' => ['username' => 'Username already exists'],
                'suggestions' => $suggestions
            ], 422);
        }

        // Create the user
        $user = User::create([
            'username' => $username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign random Unsplash avatar
        try {
            $accessKey = env('UNSPLASH_ACCESS_KEY'); // Add to .env
            $response = Http::get('https://api.unsplash.com/photos/random', [
                'query'     => 'cartoon',
                'client_id' => $accessKey,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['urls']['small'])) {
                    $imageUrl = $data['urls']['small'];

                    // Download image locally
                    $imgResp = Http::get($imageUrl);
                    if ($imgResp->successful()) {
                        $extension = $this->mimeToExtension($imgResp->header('Content-Type')) ?? 'jpg';
                        $fileName = 'avatars/' . Str::random(40) . '.' . $extension;

                        Storage::disk('public')->put($fileName, $imgResp->body());
                        $user->avatar = $fileName; // local storage path
                        $user->avatar_url = Storage::url($fileName); // public URL
                        $user->save();
                    } else {
                        // fallback: store Unsplash URL directly
                        $user->avatar_url = $imageUrl;
                        $user->save();
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error("Unsplash API error for user {$user->email}: " . $e->getMessage());
        }

        // Login user and return JSON
        Auth::login($user);

        return response()->json([
            'success' => true,
            'user' => [
                'id'         => $user->id,
                'username'   => $user->username,
                'avatar_url' => $user->avatar_url,
            ]
        ]);
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
            return response()->json(['success' => true]);
        }

        return response()->json([
            'errors' => ['email' => ['Incorrect email or password.']]
        ], 422);
    }

    // -----------------------
    // LOGOUT
    // -----------------------
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['success' => true]);
    }

    // -----------------------
    // FORGOT PASSWORD
    // -----------------------
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required','email']
        ]);

        \DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        $status = Password::broker('users')->sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['status' => 'Reset link sent successfully.'], 200);
        }

        return response()->json([
            'errors' => ['email' => __($status)]
        ], 422);
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
            return response()->json(['success' => true], 200);
        }

        return response()->json([
            'errors' => ['email' => 'Invalid or expired link.']
        ], 422);
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
