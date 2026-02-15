<?php

/**
 * Property 12: Contact form validation
 *
 * For any contact form submission, if name, email, or message is missing, the Contact API
 * should reject the request with a validation error. Additionally, if the email field
 * contains a string that is not a valid email format, the API should reject the request.
 *
 * Validates: Requirements 8.2
 *
 * @group Feature: product-showcase
 * @group Property 12: Contact form validation
 */

use App\Models\ContactMessage;
use Illuminate\Support\Str;

const PROPERTY12_ITERATIONS = 100;

/**
 * Generate a random non-empty string.
 */
function contactRandomText(int $minLen = 3, int $maxLen = 100): string
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    $charArray = str_split($chars);
    $length = random_int($minLen, $maxLen);
    $result = '';
    for ($i = 0; $i < $length; $i++) {
        $result .= $charArray[random_int(0, count($charArray) - 1)];
    }
    return $result;
}

/**
 * Generate a random valid email address.
 */
function contactRandomEmail(): string
{
    $local = Str::lower(Str::random(random_int(3, 15)));
    $domains = ['example.com', 'test.org', 'mail.net', 'demo.io', 'sample.co'];
    return $local . '@' . $domains[random_int(0, count($domains) - 1)];
}

/**
 * Generate a random string that is NOT a valid email format.
 * Uses patterns that Laravel's 'email' validation rule reliably rejects.
 */
function contactRandomInvalidEmail(): string
{
    $strategies = [
        // No @ sign at all
        fn () => Str::random(random_int(5, 20)),
        // Missing local part (starts with @)
        fn () => '@example.com',
        // Double @
        fn () => Str::random(5) . '@@example.com',
        // Spaces in local part
        fn () => 'user name@example.com',
        // Just a plain word
        fn () => collect(['notanemail', 'hello', 'test', '12345', 'plaintext'])->random(),
        // Trailing dot in domain
        fn () => Str::random(5) . '@example.',
        // Empty string
        fn () => '',
        // Only whitespace
        fn () => '   ',
    ];

    return $strategies[random_int(0, count($strategies) - 1)]();
}

/**
 * Build a valid contact form submission with all required fields.
 */
function validContactData(): array
{
    return [
        'name' => contactRandomText(2, 50),
        'email' => contactRandomEmail(),
        'message' => contactRandomText(10, 300),
    ];
}


/**
 * Property 12a: Missing name should produce a validation error on the name field.
 *
 * For any random contact submission where name is omitted, the Contact API should
 * reject the request with a validation error on the name field.
 *
 * Validates: Requirements 8.2
 */
it('Property 12: missing name is rejected with validation error', function () {
    for ($i = 0; $i < PROPERTY12_ITERATIONS; $i++) {
        $data = validContactData();
        unset($data['name']);

        $response = $this->post(route('contact.store'), $data);

        $response->assertSessionHasErrors('name');
    }
})->group('Feature: product-showcase', 'Property 12: Contact form validation');

/**
 * Property 12b: Missing email should produce a validation error on the email field.
 *
 * For any random contact submission where email is omitted, the Contact API should
 * reject the request with a validation error on the email field.
 *
 * Validates: Requirements 8.2
 */
it('Property 12: missing email is rejected with validation error', function () {
    for ($i = 0; $i < PROPERTY12_ITERATIONS; $i++) {
        $data = validContactData();
        unset($data['email']);

        $response = $this->post(route('contact.store'), $data);

        $response->assertSessionHasErrors('email');
    }
})->group('Feature: product-showcase', 'Property 12: Contact form validation');

/**
 * Property 12c: Missing message should produce a validation error on the message field.
 *
 * For any random contact submission where message is omitted, the Contact API should
 * reject the request with a validation error on the message field.
 *
 * Validates: Requirements 8.2
 */
it('Property 12: missing message is rejected with validation error', function () {
    for ($i = 0; $i < PROPERTY12_ITERATIONS; $i++) {
        $data = validContactData();
        unset($data['message']);

        $response = $this->post(route('contact.store'), $data);

        $response->assertSessionHasErrors('message');
    }
})->group('Feature: product-showcase', 'Property 12: Contact form validation');

/**
 * Property 12d: Invalid email format should produce a validation error on the email field.
 *
 * For any random contact submission where email is a string that is not a valid email
 * format, the Contact API should reject the request with a validation error on the email field.
 *
 * Validates: Requirements 8.2
 */
it('Property 12: invalid email format is rejected with validation error', function () {
    for ($i = 0; $i < PROPERTY12_ITERATIONS; $i++) {
        $data = validContactData();
        $data['email'] = contactRandomInvalidEmail();

        $response = $this->post(route('contact.store'), $data);

        $response->assertSessionHasErrors('email');
    }
})->group('Feature: product-showcase', 'Property 12: Contact form validation');

/**
 * Property 12e: Valid submission with all required fields should succeed.
 *
 * For any random contact submission with valid name, email, and message,
 * the Contact API should accept the request and save the message to the database.
 *
 * Validates: Requirements 8.2
 */
it('Property 12: valid submission with all required fields succeeds', function () {
    for ($i = 0; $i < PROPERTY12_ITERATIONS; $i++) {
        $data = validContactData();
        $countBefore = ContactMessage::count();

        $response = $this->post(route('contact.store'), $data);

        $response->assertSessionDoesntHaveErrors(['name', 'email', 'message']);

        // A new contact message should have been created
        expect(ContactMessage::count())->toBe($countBefore + 1);

        $latest = ContactMessage::latest('id')->first();
        expect($latest->email)->toBe($data['email']);
    }
})->group('Feature: product-showcase', 'Property 12: Contact form validation');


/**
 * Property 19: Contact submission resilience to email failure
 *
 * For any contact form submission, even if the SMTP settings are misconfigured or absent,
 * the contact message should still be persisted to the database successfully.
 *
 * Validates: Requirements 13.6
 *
 * @group Feature: product-showcase
 * @group Property 19: Contact submission resilience to email failure
 */

use App\Models\EmailSetting;

const PROPERTY19_ITERATIONS = 100;

/**
 * Property 19a: Contact message persists when no EmailSetting exists (SMTP not configured).
 *
 * For any valid contact form submission, when no EmailSetting record exists in the database,
 * the contact message should still be saved and the response should redirect with success.
 *
 * Validates: Requirements 13.6
 */
it('Property 19: contact message persists when no email settings exist', function () {
    // Ensure no email settings exist
    EmailSetting::query()->delete();

    for ($i = 0; $i < PROPERTY19_ITERATIONS; $i++) {
        $data = validContactData();
        $countBefore = ContactMessage::count();

        $response = $this->post(route('contact.store'), $data);

        // Message should be persisted
        expect(ContactMessage::count())->toBe($countBefore + 1);

        // Verify the saved record matches (email is not trimmed, so exact match is safe)
        $latest = ContactMessage::latest('id')->first();
        expect($latest->email)->toBe($data['email']);
        expect(trim($latest->name))->toBe(trim($data['name']));
        expect(trim($latest->message))->toBe(trim($data['message']));

        // Response should redirect with success
        $response->assertRedirect();
        $response->assertSessionHas('success');
    }
})->group('Feature: product-showcase', 'Property 19: Contact submission resilience to email failure');

/**
 * Property 19b: Contact message persists when EmailSetting has invalid/misconfigured SMTP.
 *
 * For any valid contact form submission, when EmailSetting exists but with invalid SMTP
 * configuration (unreachable host, wrong port), the contact message should still be saved
 * and the response should redirect with success.
 *
 * Validates: Requirements 13.6
 */
it('Property 19: contact message persists with misconfigured SMTP settings', function () {
    // Ensure no leftover settings
    EmailSetting::query()->delete();

    // Create a misconfigured email setting with an unreachable SMTP host
    EmailSetting::create([
        'smtp_host' => 'invalid.nonexistent.host.example',
        'smtp_port' => 99999,
        'smtp_username' => 'baduser',
        'smtp_password' => 'badpassword',
        'encryption' => 'none',
        'from_address' => 'test@example.com',
        'from_name' => 'Test',
    ]);

    for ($i = 0; $i < PROPERTY19_ITERATIONS; $i++) {
        $data = validContactData();
        $countBefore = ContactMessage::count();

        $response = $this->post(route('contact.store'), $data);

        // Message should be persisted regardless of email failure
        expect(ContactMessage::count())->toBe($countBefore + 1);

        // Verify the saved record matches (email is not trimmed, so exact match is safe)
        $latest = ContactMessage::latest('id')->first();
        expect($latest->email)->toBe($data['email']);
        expect(trim($latest->name))->toBe(trim($data['name']));
        expect(trim($latest->message))->toBe(trim($data['message']));

        // Response should redirect with success
        $response->assertRedirect();
        $response->assertSessionHas('success');
    }
})->group('Feature: product-showcase', 'Property 19: Contact submission resilience to email failure');
