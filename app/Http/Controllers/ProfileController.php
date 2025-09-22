<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ProfileController extends Controller
{
    /**
     * Show the profile edit page.
     */
    public function edit(Request $request)
    {
        $user = $request->user();
        Log::info("ProfileController: Edit page loaded for User ID {$user->id}");

        return inertia('Profile', [
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        Log::info("ProfileController: Update request received for User ID {$user->id}", $request->all());

        // Validate only fields present
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|nullable|string|max:20',
            'bio' => 'sometimes|nullable|string|max:500',
            'avatar' => 'sometimes|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $changes = [];

        // Handle avatar file upload
        if ($request->hasFile('avatar')) {
            Log::info("ProfileController: User ID {$user->id} uploading new avatar");

            if ($user->avatar && !str_starts_with($user->avatar, 'http')) {
                Storage::disk('public')->delete($user->avatar);
                Log::info("ProfileController: Old avatar deleted for User ID {$user->id}", ['old_avatar' => $user->avatar]);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
            $changes['avatar'] = ['old' => $user->avatar, 'new' => $path];
            Log::info("ProfileController: Avatar updated for User ID {$user->id}", $changes['avatar']);
        }

        // Track changes for other fields
        foreach ($validated as $field => $value) {
            if ($field === 'avatar') continue;
            if ($user->$field != $value) {
                $changes[$field] = ['old' => $user->$field, 'new' => $value];
            }
        }

        if (!empty($changes)) {
            Log::info("ProfileController: Fields updated for User ID {$user->id}", $changes);
        } else {
            Log::info("ProfileController: No changes detected for User ID {$user->id}");
        }

        // Update user
        $user->update($validated);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'bio' => $user->bio,
                'avatar_url' => $user->avatar_url,
                'created_at' => $user->created_at,
            ],
        ]);
    }

    /**
     * Delete the authenticated user's profile.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        Log::info("ProfileController: Delete request received for User ID {$user->id}");

        if ($user->avatar && !str_starts_with($user->avatar, 'http')) {
            Storage::disk('public')->delete($user->avatar);
            Log::info("ProfileController: Avatar deleted for User ID {$user->id}", ['deleted_avatar' => $user->avatar]);
        }

        $user->delete();
        auth()->logout();
        Log::info("ProfileController: User ID {$user->id} account deleted and logged out");

        return redirect('/')->with('success', 'Your account has been deleted.');
    }

    /**
     * Generate a random avatar from Unsplash for the authenticated user.
     */
    public function generateRandomAvatar(Request $request)
    {
        $user = $request->user();

        $now = Carbon::now();

        // Ensure last_avatar_generated_at is a Carbon instance
        if ($user->last_avatar_generated_at) {
            $lastGenerated = $user->last_avatar_generated_at instanceof Carbon
                ? $user->last_avatar_generated_at
                : Carbon::parse($user->last_avatar_generated_at);

            if ($lastGenerated->gt($now->subMinutes(10))) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only generate a new avatar once every 10 minutes.',
                ], 429);
            }
        }

        $randomAvatarUrl = 'https://images.unsplash.com/photo-'
            . uniqid()
            . '?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080&h=1080&ixid=M3w4MDYyNTl8MHwxfHNlYXJjaHwyMXx8YmVhdXRpZnVsJTIwYW5pbWFsfGVufDB8MnwxfHwxNzU4NTM0NzcxfDA';

        $user->update([
            'avatar' => $randomAvatarUrl,
            'last_avatar_generated_at' => $now,
        ]);

        Log::info("ProfileController: Random avatar generated for User ID {$user->id}", ['avatar' => $randomAvatarUrl]);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'avatar' => $user->avatar,
                'avatar_url' => $user->avatar_url,
                'last_avatar_generated_at' => $user->last_avatar_generated_at,
            ],
        ]);
    }
}
