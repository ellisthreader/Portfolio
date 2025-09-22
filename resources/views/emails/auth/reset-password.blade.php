@component('mail::message')
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f9fafb; padding: 20px 0; font-family: Arial, sans-serif;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <tr>
                    <td align="center" style="padding: 0; margin: 0;">
                        <img src="https://source.unsplash.com/600x200/?technology,business" alt="Header Image" style="display: block; width: 100%; max-width: 600px; height: auto; border-bottom: 3px solid #2563eb;">
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px;">
                        <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 20px;">Hello {{ $user->username }},</h1>
                        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                            We received a request to reset the password for your account. If you made this request, click the button below to set a new password.
                        </p>
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="{{ url("/reset-password/{$token}?email={$user->email}") }}" 
                               style="background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: bold; padding: 14px 28px; border-radius: 6px; text-decoration: none; display: inline-block;">
                                Reset Password
                            </a>
                        </p>
                        <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
                            This password reset link will expire in <strong>{{ config('auth.passwords.'.config('auth.defaults.passwords').'.expire') }} minutes</strong>.
                        </p>
                        <p style="font-size: 14px; color: #6b7280;">
                            If you did not request a password reset, you can safely ignore this email.
                        </p>
                        <p style="margin-top: 30px; font-size: 14px; color: #374151;">
                            Thanks,<br>
                            <strong>Ellis T</strong>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
@endcomponent
