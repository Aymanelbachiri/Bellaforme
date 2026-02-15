<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/contact-messages/index', [
            'contactMessages' => ContactMessage::with('product:id,name,slug')
                ->orderByDesc('created_at')
                ->paginate(15),
        ]);
    }

    public function show(ContactMessage $contactMessage): Response
    {
        $contactMessage->load('product:id,name,slug,featured_image');

        return Inertia::render('admin/contact-messages/show', [
            'contactMessage' => $contactMessage,
        ]);
    }
}
