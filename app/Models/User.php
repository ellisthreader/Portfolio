<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'name',    // full name
        'phone',   // optional phone
        'bio',     // user bio
        'avatar',  // avatar file path or URL
        'last_avatar_generated_at', // track when random avatar was generated
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_avatar_generated_at' => 'datetime', // <-- added
        'password' => 'hashed',
    ];

    /**
     * Accessor to get the full URL of the avatar.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->avatar) return null;

        // If avatar is already a full URL, return as-is
        if (str_starts_with($this->avatar, 'http://') || str_starts_with($this->avatar, 'https://')) {
            return $this->avatar;
        }

        // Otherwise, treat it as a local storage path
        return asset('storage/' . $this->avatar);
    }

    /**
     * Override the default password reset notification to use a custom styled email.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
