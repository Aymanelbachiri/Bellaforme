<?php

use App\Models\EmailSetting;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->withoutVite();
});

test('email settings edit page returns settings without password', function () {
    EmailSetting::create([
        'smtp_host' => 'smtp.example.com',
        'smtp_port' => 587,
        'smtp_username' => 'user@example.com',
        'smtp_password' => 'secret123',
        'encryption' => 'tls',
        'from_address' => 'noreply@example.com',
        'from_name' => 'Bella Forme',
    ]);

    $response = $this->actingAs($this->user)
        ->get(route('admin.email-settings.edit'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/email-settings/edit')
        ->has('settings')
        ->where('settings.smtp_host', 'smtp.example.com')
        ->where('settings.smtp_port', 587)
        ->where('settings.has_password', true)
        ->missing('settings.smtp_password')
    );
});

test('email settings edit creates default settings if none exist', function () {
    $response = $this->actingAs($this->user)
        ->get(route('admin.email-settings.edit'));

    $response->assertOk();
    $this->assertDatabaseCount('email_settings', 1);
});

test('email settings can be updated', function () {
    EmailSetting::create([
        'smtp_host' => 'old.example.com',
        'smtp_port' => 25,
        'smtp_username' => null,
        'smtp_password' => null,
        'encryption' => 'none',
        'from_address' => 'old@example.com',
        'from_name' => 'Old Name',
    ]);

    $response = $this->actingAs($this->user)
        ->put(route('admin.email-settings.update'), [
            'smtp_host' => 'smtp.new.com',
            'smtp_port' => 465,
            'smtp_username' => 'newuser',
            'smtp_password' => 'newpass',
            'encryption' => 'ssl',
            'from_address' => 'new@example.com',
            'from_name' => 'New Name',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $settings = EmailSetting::first();
    expect($settings->smtp_host)->toBe('smtp.new.com');
    expect($settings->smtp_port)->toBe(465);
    expect($settings->encryption)->toBe('ssl');
    expect($settings->from_address)->toBe('new@example.com');
    expect($settings->from_name)->toBe('New Name');
});


test('email settings password is not updated when left blank', function () {
    $settings = EmailSetting::create([
        'smtp_host' => 'smtp.example.com',
        'smtp_port' => 587,
        'smtp_username' => 'user@example.com',
        'smtp_password' => 'original_password',
        'encryption' => 'tls',
        'from_address' => 'noreply@example.com',
        'from_name' => 'Bella Forme',
    ]);

    $this->actingAs($this->user)
        ->put(route('admin.email-settings.update'), [
            'smtp_host' => 'smtp.example.com',
            'smtp_port' => 587,
            'smtp_username' => 'user@example.com',
            'smtp_password' => '',
            'encryption' => 'tls',
            'from_address' => 'noreply@example.com',
            'from_name' => 'Bella Forme',
        ]);

    $settings->refresh();
    expect($settings->smtp_password)->toBe('original_password');
});

test('email settings update validates required fields', function () {
    EmailSetting::create([
        'smtp_host' => 'smtp.example.com',
        'smtp_port' => 587,
        'smtp_username' => null,
        'smtp_password' => null,
        'encryption' => 'tls',
        'from_address' => 'noreply@example.com',
        'from_name' => 'Bella Forme',
    ]);

    $response = $this->actingAs($this->user)
        ->put(route('admin.email-settings.update'), [
            'smtp_host' => '',
            'smtp_port' => '',
            'encryption' => 'invalid',
            'from_address' => 'not-an-email',
            'from_name' => '',
        ]);

    $response->assertSessionHasErrors(['smtp_host', 'smtp_port', 'encryption', 'from_address', 'from_name']);
});

test('email settings test requires valid email', function () {
    $response = $this->actingAs($this->user)
        ->post(route('admin.email-settings.test'), [
            'test_email' => 'not-an-email',
        ]);

    $response->assertSessionHasErrors('test_email');
});

test('email settings test fails when no smtp settings configured', function () {
    $response = $this->actingAs($this->user)
        ->post(route('admin.email-settings.test'), [
            'test_email' => 'test@example.com',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('email settings routes require authentication', function () {
    $this->get(route('admin.email-settings.edit'))
        ->assertRedirect(route('login'));

    $this->put(route('admin.email-settings.update'))
        ->assertRedirect(route('login'));

    $this->post(route('admin.email-settings.test'))
        ->assertRedirect(route('login'));
});
