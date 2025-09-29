<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail; // Required for email verification
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Carbon;

class User extends Authenticatable implements MustVerifyEmail
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
        'name',    
        'phone',   
        'bio',     
        'avatar',  
        'last_avatar_generated_at', 
        'last_verification_sent_at', 
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
        'last_avatar_generated_at' => 'datetime:UTC',
        'last_verification_sent_at' => 'datetime', 
        'password' => 'hashed',
    ];

    /**
     * Accessor to get the full URL of the avatar.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->avatar) {
            return null;
        }

        if (str_starts_with($this->avatar, 'http://') || str_starts_with($this->avatar, 'https://')) {
            return $this->avatar;
        }

        return asset('storage/' . $this->avatar);
    }

    /**
     * Override the default password reset notification to use a custom styled email.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * Optional helper to check cooldown before resending verification email.
     */
    public function canSendVerificationEmail(int $cooldownSeconds = 60): bool
    {
        if (!$this->last_verification_sent_at) {
            return true;
        }

        return $this->last_verification_sent_at->diffInSeconds(now()) >= $cooldownSeconds;
    }

    /**
     * Optional: mark verification email as sent (for cooldown tracking)
     */
    public function markVerificationEmailSent(): void
    {
        $this->update(['last_verification_sent_at' => now()]);
    }
}
