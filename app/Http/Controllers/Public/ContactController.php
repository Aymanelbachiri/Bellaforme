<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Mail\ContactFormNotification;
use App\Models\ContactMessage;
use App\Models\EmailSetting;
use App\Services\DynamicSmtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('contact', [
            'product_id' => $request->query('product_id'),
            'seo' => [
                'meta_title' => 'Contactez-nous - Bella Forme Group',
                'meta_description' => 'Contactez Bella Forme Group pour toute demande de devis ou d\'information sur nos équipements professionnels.',
                'og_image' => null,
                'canonical_url' => url('/contact'),
            ],
        ]);
    }

    public function store(StoreContactMessageRequest $request)
    {
        $contactMessage = ContactMessage::create($request->validated());

        try {
            $smtpService = app(DynamicSmtpService::class);

            if ($smtpService->configure()) {
                $emailSettings = EmailSetting::first();
                Mail::to($emailSettings->from_address)
                    ->send(new ContactFormNotification($contactMessage));
            }
        } catch (\Throwable $e) {
            Log::error('Failed to send contact form notification email: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
    }
}
