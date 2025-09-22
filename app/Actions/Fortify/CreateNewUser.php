<?php
// app/Actions/Fortify/CreateNewUser.php
namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        // Create the user first
        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);

        Log::info("New user created: {$user->email}");

        // Generate random avatar using Unsplash API
        try {
            Log::debug("Sending request to Unsplash API for {$user->email}...");

            $accessKey = env('UNSPLASH_ACCESS_KEY'); // put your key in .env
            $response = Http::get('https://api.unsplash.com/photos/random', [
                'query' => 'cartoon',
                'client_id' => $accessKey,
            ]);

            Log::debug("Unsplash response status: " . $response->status());

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['urls']['small'])) {
                    $imageUrl = $data['urls']['small'];
                    Log::debug("Unsplash returned image URL for {$user->email}: {$imageUrl}");

                    // Download the image
                    $imgResp = Http::get($imageUrl);
                    if ($imgResp->successful()) {
                        $extension = $this->mimeToExtension($imgResp->header('Content-Type')) ?? 'jpg';
                        $fileName = 'avatars/' . Str::random(40) . '.' . $extension;

                        Storage::disk('public')->put($fileName, $imgResp->body());

                        $user->avatar = $fileName;
                        $user->save();

                        Log::info("Avatar downloaded and saved for {$user->email}: {$fileName}");
                    } else {
                        // fallback: store Unsplash URL directly
                        $user->avatar = $imageUrl;
                        $user->save();
                        Log::warning("Could not download Unsplash image, stored URL directly for {$user->email}");
                    }
                } else {
                    Log::warning("Unsplash returned unexpected payload for {$user->email}: " . json_encode($data));
                }
            } else {
                Log::error("Unsplash API failed with status {$response->status()} for {$user->email}: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Unsplash API exception for {$user->email}: " . $e->getMessage());
        }

        return $user;
    }

    private function mimeToExtension(?string $mime): ?string
    {
        if (!$mime) return null;
        $map = [
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
        ];
        return $map[strtolower($mime)] ?? null;
    }
}
