<?php

/**
 * Property 18: SMTP password encryption
 *
 * For any saved email settings with a non-null smtp_password, the raw value stored
 * in the database should not equal the plaintext password (it should be encrypted).
 *
 * Validates: Requirements 13.3
 *
 * @group Feature: product-showcase
 * @group Property 18: SMTP password encryption
 */

use App\Models\EmailSetting;
use Illuminate\Support\Facades\DB;

const PROPERTY18_ITERATIONS = 100;

/**
 * Generate a random plaintext password string.
 */
function smtpRandomPassword(int $minLen = 4, int $maxLen = 64): string
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/';
    $length = random_int($minLen, $maxLen);
    $result = '';
    for ($i = 0; $i < $length; $i++) {
        $result .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $result;
}

beforeEach(function () {
    EmailSetting::query()->delete();
});

/**
 * Property 18a: Raw database value of smtp_password is never equal to the plaintext password.
 *
 * For any random plaintext password, after saving an EmailSetting, the raw value
 * in the database (bypassing the encrypted cast) should differ from the plaintext.
 *
 * **Validates: Requirements 13.3**
 */
it('Property 18: raw stored smtp_password does not equal the plaintext password', function () {
    for ($i = 0; $i < PROPERTY18_ITERATIONS; $i++) {
        $plaintext = smtpRandomPassword();

        EmailSetting::query()->delete();

        $setting = EmailSetting::create([
            'smtp_host' => 'smtp.test.com',
            'smtp_port' => 587,
            'smtp_username' => 'user',
            'smtp_password' => $plaintext,
            'encryption' => 'tls',
            'from_address' => 'test@example.com',
            'from_name' => 'Test',
        ]);

        // Read the raw value from the database, bypassing the encrypted cast
        $rawRow = DB::table('email_settings')
            ->where('id', $setting->id)
            ->first();

        expect($rawRow->smtp_password)->not->toBeNull(
            "Raw smtp_password should not be null for plaintext: '{$plaintext}'"
        );

        expect($rawRow->smtp_password)->not->toBe(
            $plaintext,
            "Raw smtp_password should not equal plaintext '{$plaintext}' (iteration {$i})"
        );
    }
})->group('Feature: product-showcase', 'Property 18: SMTP password encryption');

/**
 * Property 18b: Decrypted smtp_password (via model) equals the original plaintext.
 *
 * For any random plaintext password, after saving and re-reading through the model,
 * the decrypted value should match the original plaintext exactly.
 *
 * **Validates: Requirements 13.3**
 */
it('Property 18: decrypted smtp_password matches the original plaintext', function () {
    for ($i = 0; $i < PROPERTY18_ITERATIONS; $i++) {
        $plaintext = smtpRandomPassword();

        EmailSetting::query()->delete();

        $setting = EmailSetting::create([
            'smtp_host' => 'smtp.test.com',
            'smtp_port' => 587,
            'smtp_username' => 'user',
            'smtp_password' => $plaintext,
            'encryption' => 'tls',
            'from_address' => 'test@example.com',
            'from_name' => 'Test',
        ]);

        // Re-read through the model (which applies the encrypted cast to decrypt)
        $fresh = EmailSetting::find($setting->id);

        expect($fresh->smtp_password)->toBe(
            $plaintext,
            "Decrypted smtp_password should equal plaintext '{$plaintext}' (iteration {$i})"
        );
    }
})->group('Feature: product-showcase', 'Property 18: SMTP password encryption');
