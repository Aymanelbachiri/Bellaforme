<?php

/**
 * Property 17: Email settings validation
 *
 * For any email settings submission, if smtp_host, smtp_port, from_address, or from_name
 * is missing, the API should reject the request with a validation error. If from_address
 * is not a valid email format, the API should reject the request.
 *
 * Validates: Requirements 13.2
 *
 * @group Feature: product-showcase
 * @group Property 17: Email settings validation
 */

use App\Models\EmailSetting;
use App\Models\User;
use Illuminate\Support\Str;

const PROPERTY17_ITERATIONS = 100;

/**
 * Generate a random non-empty string.
 */
function emailSettingsRandomString(int $minLen = 3, int $maxLen = 50): string
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $length = random_int($minLen, $maxLen);
    $result = '';
    for ($i = 0; $i < $length; $i++) {
        $result .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $result;
}

/**
 * Generate a random valid email address.
 */
function emailSettingsRandomEmail(): string
{
    $local = Str::lower(Str::random(random_int(3, 12)));
    $domains = ['example.com', 'test.org', 'mail.net', 'demo.io', 'sample.co'];
    return $local . '@' . $domains[random_int(0, count($domains) - 1)];
}

/**
 * Generate a random invalid email string.
 */
function emailSettingsRandomInvalidEmail(): string
{
    $strategies = [
        fn () => Str::random(random_int(5, 20)),
        fn () => '@example.com',
        fn () => Str::random(5) . '@@example.com',
        fn () => 'user name@example.com',
        fn () => collect(['notanemail', 'hello', 'test', '12345'])->random(),
        fn () => Str::random(5) . '@example.',
    ];

    return $strategies[random_int(0, count($strategies) - 1)]();
}

/**
 * Generate a random valid SMTP port.
 */
function emailSettingsRandomPort(): int
{
    return collect([25, 465, 587, 2525, random_int(1, 65535)])->random();
}

/**
 * Build a complete valid email settings payload.
 */
function validEmailSettingsData(): array
{
    return [
        'smtp_host' => emailSettingsRandomString(5, 30) . '.example.com',
        'smtp_port' => emailSettingsRandomPort(),
        'smtp_username' => emailSettingsRandomString(3, 20),
        'smtp_password' => emailSettingsRandomString(8, 30),
        'encryption' => collect(['none', 'tls', 'ssl'])->random(),
        'from_address' => emailSettingsRandomEmail(),
        'from_name' => emailSettingsRandomString(3, 30),
    ];
}

beforeEach(function () {
    $this->user = User::factory()->create();

    // Ensure an EmailSetting record exists for updates
    EmailSetting::query()->delete();
    EmailSetting::create([
        'smtp_host' => 'smtp.initial.com',
        'smtp_port' => 587,
        'smtp_username' => 'initial',
        'smtp_password' => 'initialpass',
        'encryption' => 'tls',
        'from_address' => 'initial@example.com',
        'from_name' => 'Initial',
    ]);
});


/**
 * Property 17a: Missing smtp_host should produce a validation error.
 *
 * For any random email settings submission where smtp_host is omitted,
 * the API should reject the request with a validation error on smtp_host.
 *
 * Validates: Requirements 13.2
 */
it('Property 17: missing smtp_host is rejected with validation error', function () {
    for ($i = 0; $i < PROPERTY17_ITERATIONS; $i++) {
        $data = validEmailSettingsData();
        unset($data['smtp_host']);

        $response = $this->actingAs($this->user)
            ->put(route('admin.email-settings.update'), $data);

        $response->assertSessionHasErrors('smtp_host');
    }
})->group('Feature: product-showcase', 'Property 17: Email settings validation');

/**
 * Property 17b: Missing smtp_port should produce a validation error.
 *
 * For any random email settings submission where smtp_port is omitted,
 * the API should reject the request with a validation error on smtp_port.
 *
 * Validates: Requirements 13.2
 */
it('Property 17: missing smtp_port is rejected with validation error', function () {
    for ($i = 0; $i < PROPERTY17_ITERATIONS; $i++) {
        $data = validEmailSettingsData();
        unset($data['smtp_port']);

        $response = $this->actingAs($this->user)
            ->put(route('admin.email-settings.update'), $data);

        $response->assertSessionHasErrors('smtp_port');
    }
})->group('Feature: product-showcase', 'Property 17: Email settings validation');

/**
 * Property 17c: Missing from_address should produce a validation error.
 *
 * For any random email settings submission where from_address is omitted,
 * the API should reject the request with a validation error on from_address.
 *
 * Validates: Requirements 13.2
 */
it('Property 17: missing from_address is rejected with validation error', function () {
    for ($i = 0; $i < PROPERTY17_ITERATIONS; $i++) {
        $data = validEmailSettingsData();
        unset($data['from_address']);

        $response = $this->actingAs($this->user)
            ->put(route('admin.email-settings.update'), $data);

        $response->assertSessionHasErrors('from_address');
    }
})->group('Feature: product-showcase', 'Property 17: Email settings validation');

/**
 * Property 17d: Missing from_name should produce a validation error.
 *
 * For any random email settings submission where from_name is omitted,
 * the API should reject the request with a validation error on from_name.
 *
 * Validates: Requirements 13.2
 */
it('Property 17: missing from_name is rejected with validation error', function () {
    for ($i = 0; $i < PROPERTY17_ITERATIONS; $i++) {
        $data = validEmailSettingsData();
        unset($data['from_name']);

        $response = $this->actingAs($this->user)
            ->put(route('admin.email-settings.update'), $data);

        $response->assertSessionHasErrors('from_name');
    }
})->group('Feature: product-showcase', 'Property 17: Email settings validation');

/**
 * Property 17e: Invalid from_address format should produce a validation error.
 *
 * For any random email settings submission where from_address is not a valid email,
 * the API should reject the request with a validation error on from_address.
 *
 * Validates: Requirements 13.2
 */
it('Property 17: invalid from_address format is rejected with validation error', function () {
    for ($i = 0; $i < PROPERTY17_ITERATIONS; $i++) {
        $data = validEmailSettingsData();
        $data['from_address'] = emailSettingsRandomInvalidEmail();

        $response = $this->actingAs($this->user)
            ->put(route('admin.email-settings.update'), $data);

        $response->assertSessionHasErrors('from_address');
    }
})->group('Feature: product-showcase', 'Property 17: Email settings validation');

/**
 * Property 17f: Valid submission with all required fields should succeed.
 *
 * For any random email settings submission with all required fields valid,
 * the API should accept the request and update the settings in the database.
 *
 * Validates: Requirements 13.2
 */
it('Property 17: valid submission with all required fields succeeds', function () {
    for ($i = 0; $i < PROPERTY17_ITERATIONS; $i++) {
        $data = validEmailSettingsData();

        $response = $this->actingAs($this->user)
            ->put(route('admin.email-settings.update'), $data);

        $response->assertSessionDoesntHaveErrors(['smtp_host', 'smtp_port', 'from_address', 'from_name']);
        $response->assertRedirect();

        $settings = EmailSetting::first();
        expect($settings->smtp_host)->toBe($data['smtp_host']);
        expect($settings->smtp_port)->toBe($data['smtp_port']);
        expect($settings->from_address)->toBe($data['from_address']);
        expect($settings->from_name)->toBe($data['from_name']);
    }
})->group('Feature: product-showcase', 'Property 17: Email settings validation');
