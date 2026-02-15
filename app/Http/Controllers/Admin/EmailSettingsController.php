<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailSetting;
use App\Services\DynamicSmtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class EmailSettingsController extends Controller
{
    public function edit(): Response
    {
        $settings = EmailSetting::firstOrCreate([], [
            'smtp_host' => '',
            'smtp_port' => 587,
            'smtp_username' => '',
            'smtp_password' => null,
            'encryption' => 'tls',
            'from_address' => '',
            'from_name' => '',
        ]);

        return Inertia::render('admin/email-settings/edit', [
            'settings' => [
                'id' => $settings->id,
                'smtp_host' => $settings->smtp_host,
                'smtp_port' => $settings->smtp_port,
                'smtp_username' => $settings->smtp_username,
                'encryption' => $settings->encryption,
                'from_address' => $settings->from_address,
                'from_name' => $settings->from_name,
                'has_password' => !empty($settings->smtp_password),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'smtp_host' => ['required', 'string', 'max:255'],
            'smtp_port' => ['required', 'integer'],
            'smtp_username' => ['nullable', 'string', 'max:255'],
            'smtp_password' => ['nullable', 'string', 'max:255'],
            'encryption' => ['required', 'in:none,tls,ssl'],
            'from_address' => ['required', 'email', 'max:255'],
            'from_name' => ['required', 'string', 'max:255'],
        ]);

        $settings = EmailSetting::firstOrCreate([], [
            'smtp_host' => '',
            'smtp_port' => 587,
            'smtp_username' => '',
            'smtp_password' => null,
            'encryption' => 'tls',
            'from_address' => '',
            'from_name' => '',
        ]);

        $data = [
            'smtp_host' => $validated['smtp_host'],
            'smtp_port' => $validated['smtp_port'],
            'smtp_username' => $validated['smtp_username'],
            'encryption' => $validated['encryption'],
            'from_address' => $validated['from_address'],
            'from_name' => $validated['from_name'],
        ];

        // Only update password if a new value is provided
        if (!empty($validated['smtp_password'])) {
            $data['smtp_password'] = $validated['smtp_password'];
        }

        $settings->update($data);

        return back()->with('success', 'Email settings updated successfully.');
    }

    public function test(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'test_email' => ['required', 'email'],
        ]);

        $smtpService = app(DynamicSmtpService::class);

        if (!$smtpService->configure()) {
            return back()->with('error', 'SMTP settings are not configured. Please save your settings first.');
        }

        try {
            Mail::raw('This is a test email from Bella Forme Group', function ($message) use ($validated) {
                $message->to($validated['test_email'])
                    ->subject('Test Email - Bella Forme Group');
            });

            return back()->with('success', 'Test email sent successfully to ' . $validated['test_email']);
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to send test email: ' . $e->getMessage());
        }
    }
}
