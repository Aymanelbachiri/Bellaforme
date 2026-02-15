<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoMetadata;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeoController extends Controller
{
    /**
     * Static pages with their identifiers.
     */
    private const STATIC_PAGES = [
        ['key' => 'homepage', 'label' => 'Homepage', 'seoable_id' => 1],
        ['key' => 'contact', 'label' => 'Contact', 'seoable_id' => 2],
        ['key' => 'about', 'label' => 'About', 'seoable_id' => 3],
    ];

    private const SEOABLE_TYPE = 'page';

    public function edit(): Response
    {
        $pages = [];

        foreach (self::STATIC_PAGES as $page) {
            $seo = SeoMetadata::where('seoable_type', self::SEOABLE_TYPE)
                ->where('seoable_id', $page['seoable_id'])
                ->first();

            $pages[] = [
                'key' => $page['key'],
                'label' => $page['label'],
                'seoable_id' => $page['seoable_id'],
                'meta_title' => $seo->meta_title ?? '',
                'meta_description' => $seo->meta_description ?? '',
                'og_image' => $seo->og_image ?? null,
            ];
        }

        return Inertia::render('admin/seo/edit', [
            'pages' => $pages,
        ]);
    }

    public function update(Request $request, ImageOptimizer $imageOptimizer): RedirectResponse
    {
        $validated = $request->validate([
            'pages' => ['required', 'array', 'size:' . count(self::STATIC_PAGES)],
            'pages.*.seoable_id' => ['required', 'integer'],
            'pages.*.meta_title' => ['nullable', 'string', 'max:255'],
            'pages.*.meta_description' => ['nullable', 'string', 'max:500'],
            'pages.*.og_image' => ['nullable', 'image', 'max:10240'],
        ]);

        foreach ($validated['pages'] as $index => $pageData) {
            $seo = SeoMetadata::firstOrNew([
                'seoable_type' => self::SEOABLE_TYPE,
                'seoable_id' => $pageData['seoable_id'],
            ]);

            $seo->meta_title = $pageData['meta_title'] ?? null;
            $seo->meta_description = $pageData['meta_description'] ?? null;

            if ($request->hasFile("pages.{$index}.og_image")) {
                // Delete old og_image if it exists
                if ($seo->og_image) {
                    $imageOptimizer->delete($seo->og_image);
                }

                $seo->og_image = $imageOptimizer->optimize(
                    $request->file("pages.{$index}.og_image"),
                    'seo'
                );
            }

            $seo->save();
        }

        return back()->with('success', 'SEO settings updated successfully.');
    }
}
