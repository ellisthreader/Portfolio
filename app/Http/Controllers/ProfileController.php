<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use App\Services\UnsplashService;

class ProfileController extends Controller
{
    protected UnsplashService $unsplash;
    protected int $cooldownMinutes = 5;

    public function __construct(UnsplashService $unsplash)
    {
        $this->unsplash = $unsplash;
    }

    /**
     * Show the profile edit page with cooldown metadata.
     */
    public function edit(Request $request)
    {
        $user = $request->user();
        $remaining = $this->getRemainingCooldown($user);
        $cooldownEnds = $this->getCooldownEndsAt($user);

        Log::info("ProfileController: Edit page loaded for User ID {$user->id}", [
            'remaining_seconds' => $remaining,
            'cooldown_ends_at' => $cooldownEnds,
        ]);

        return inertia('Profile', [
            'auth' => [
                'user' => array_merge($user->toArray(), [
                    'remaining_seconds' => $remaining,
                    'cooldown_ends_at' => $cooldownEnds,
                    'server_time' => Carbon::now('UTC')->toIso8601String(),
                ]),
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

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|nullable|string|max:20',
            'bio' => 'sometimes|nullable|string|max:500',
            'avatar' => 'sometimes|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar && !str_starts_with($user->avatar, 'http')) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
            $validated['avatar_url'] = asset("storage/{$path}");
        }

        $user->update($validated);
        $user->refresh();

        $remaining = $this->getRemainingCooldown($user);
        $cooldownEnds = $this->getCooldownEndsAt($user);

        return response()->json([
            'success' => true,
            'user' => array_merge($user->toArray(), [
                'remaining_seconds' => $remaining,
                'cooldown_ends_at' => $cooldownEnds,
                'server_time' => Carbon::now('UTC')->toIso8601String(),
            ]),
        ]);
    }

    /**
     * Generate a random avatar from Unsplash.
     */
    public function generateRandomAvatar(Request $request)
    {
        $user = $request->user();
        $remaining = $this->getRemainingCooldown($user);

        Log::info("ProfileController: Generate random avatar request for User ID {$user->id}", [
            'remaining_seconds' => $remaining
        ]);

        if ($remaining > 0) {
            Log::warning("ProfileController: Cooldown active for User ID {$user->id}", [
                'remaining_seconds' => $remaining
            ]);

            return response()->json([
                'success' => false,
                'message' => "You can only generate a new avatar once every {$this->cooldownMinutes} minutes.",
                'remaining_seconds' => $remaining,
                'cooldown_ends_at' => $this->getCooldownEndsAt($user),
                'server_time' => Carbon::now('UTC')->toIso8601String(),
            ], 429);
        }

        $randomAvatarUrl = $this->unsplash->getRandomMushroomImage();
        if (!$randomAvatarUrl) {
            return response()->json([
                'success' => false,
                'message' => 'Could not fetch avatar from Unsplash.',
                'remaining_seconds' => 0,
                'cooldown_ends_at' => null,
                'server_time' => Carbon::now('UTC')->toIso8601String(),
            ], 500);
        }

        $user->update([
            'avatar' => $randomAvatarUrl,
            'avatar_url' => $randomAvatarUrl,
            'last_avatar_generated_at' => Carbon::now('UTC'),
        ]);

        $user->refresh();

        $remaining = $this->getRemainingCooldown($user);
        $cooldownEnds = $this->getCooldownEndsAt($user);

        Log::info("ProfileController: Random avatar generated for User ID {$user->id}", [
            'avatar_url' => $randomAvatarUrl,
            'remaining_seconds' => $remaining
        ]);

        return response()->json([
            'success' => true,
            'user' => array_merge($user->toArray(), [
                'remaining_seconds' => $remaining,
                'cooldown_ends_at' => $cooldownEnds,
                'server_time' => Carbon::now('UTC')->toIso8601String(),
            ]),
        ]);
    }

    /**
     * Helper: remaining seconds until cooldown ends
     */
    private function getRemainingCooldown($user): int
    {
        if (!$user->last_avatar_generated_at) {
            return 0;
        }

        $last = Carbon::parse($user->last_avatar_generated_at, 'UTC');
        $now = Carbon::now('UTC');

        // elapsed = now - last
        $elapsed = $last->diffInSeconds($now);

        $remaining = max(0, ($this->cooldownMinutes * 60) - $elapsed);

        Log::info("Cooldown debug", [
            'last_avatar_generated_at' => $last->toIso8601String(),
            'now' => $now->toIso8601String(),
            'elapsed' => $elapsed,
            'remaining' => $remaining
        ]);

        return $remaining;
    }


    /**
     * Helper: cooldown end timestamp ISO
     */
    private function getCooldownEndsAt($user): ?string
    {
        if (!$user->last_avatar_generated_at) {
            return null;
        }

        return Carbon::parse($user->last_avatar_generated_at, 'UTC')
            ->addMinutes($this->cooldownMinutes)
            ->toIso8601String();
    }
}
