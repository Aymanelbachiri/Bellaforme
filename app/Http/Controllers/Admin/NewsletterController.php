<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class NewsletterController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/newsletter/index', [
            'subscribers' => NewsletterSubscriber::orderByDesc('created_at')->paginate(20),
        ]);
    }

    public function destroy(NewsletterSubscriber $subscriber): RedirectResponse
    {
        $subscriber->delete();

        return redirect()->route('admin.newsletter.index');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:newsletter_subscribers,id',
        ]);

        NewsletterSubscriber::whereIn('id', $request->ids)->delete();

        return redirect()->route('admin.newsletter.index');
    }

    public function export(): StreamedResponse
    {
        $subscribers = NewsletterSubscriber::orderByDesc('created_at')->get();

        return response()->streamDownload(function () use ($subscribers) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Email', 'Date d\'inscription']);

            foreach ($subscribers as $sub) {
                fputcsv($handle, [
                    $sub->email,
                    $sub->created_at->format('d/m/Y H:i'),
                ]);
            }

            fclose($handle);
        }, 'newsletter-subscribers-' . now()->format('Y-m-d') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
