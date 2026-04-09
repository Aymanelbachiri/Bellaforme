<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoMetadata;
use App\Models\SolutionsSetting;
use App\Rules\ImageOrPath;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SolutionsController extends Controller
{
    public function edit(): Response
    {
        $settings = SolutionsSetting::firstOrCreate([], [
            'hero_title' => '',
            'hero_subtitle' => '',
            'hero_image' => '',
            'sections' => [],
        ]);

        $seo = SeoMetadata::where('seoable_type', 'page')->where('seoable_id', 13)->first();

        return Inertia::render('admin/solutions/edit', [
            'settings' => $settings,
            'seo' => [
                'meta_title' => $seo->meta_title ?? '',
                'meta_description' => $seo->meta_description ?? '',
            ],
        ]);
    }

    public function update(Request $request, ImageOptimizer $imageOptimizer): RedirectResponse
    {
        $validated = $request->validate([
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string', 'max:1000'],
            'hero_image' => ['nullable', new ImageOrPath],
            'sections' => ['nullable', 'array'],
            'sections.*.title' => ['required', 'string', 'max:255'],
            'sections.*.description' => ['nullable', 'string', 'max:5000'],
            'sections.*.image' => ['nullable', 'string', 'max:500'],
            'section_images.*' => ['nullable', new ImageOrPath],
            'section_brochures.*' => ['nullable', new \App\Rules\PdfFileOrPath],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ]);

        $settings = SolutionsSetting::firstOrCreate([], [
            'hero_title' => '',
            'hero_subtitle' => '',
            'hero_image' => '',
            'sections' => [],
        ]);

        $data = [
            'hero_title' => $validated['hero_title'] ?? '',
            'hero_subtitle' => $validated['hero_subtitle'] ?? '',
        ];

        // Handle hero image
        $resolvedHero = $imageOptimizer->resolveImage($request, 'hero_image', 'solutions');
        if ($resolvedHero && $resolvedHero !== $settings->hero_image) {
            if ($settings->hero_image) {
                $imageOptimizer->delete($settings->hero_image);
            }
            $data['hero_image'] = $resolvedHero;
        }

        // Handle sections with images
        $sections = $validated['sections'] ?? [];
        $sectionImages = $request->file('section_images', []);
        $sectionImagePaths = $request->input('section_images', []);
        $sectionBrochures = $request->file('section_brochures', []);
        $sectionBrochurePaths = $request->input('section_brochures', []);
        $existingSections = $settings->sections ?? [];

        foreach ($sections as $index => &$section) {
            // Handle image
            if (isset($sectionImages[$index])) {
                $section['image'] = $imageOptimizer->optimize($sectionImages[$index], 'solutions/sections');
            } elseif (isset($sectionImagePaths[$index]) && is_string($sectionImagePaths[$index]) && Storage::disk('public')->exists($sectionImagePaths[$index])) {
                $section['image'] = $sectionImagePaths[$index];
            } elseif (empty($section['image']) && isset($existingSections[$index]['image'])) {
                $section['image'] = $existingSections[$index]['image'];
            }

            // Handle brochure
            if (isset($sectionBrochures[$index])) {
                $section['brochure'] = $sectionBrochures[$index]->store('solutions/brochures', 'public');
            } elseif (isset($sectionBrochurePaths[$index]) && is_string($sectionBrochurePaths[$index]) && Storage::disk('public')->exists($sectionBrochurePaths[$index])) {
                $section['brochure'] = $sectionBrochurePaths[$index];
            } elseif (!isset($section['brochure']) && isset($existingSections[$index]['brochure'])) {
                $section['brochure'] = $existingSections[$index]['brochure'];
            }
        }
        unset($section);

        $data['sections'] = $sections;

        $settings->update($data);

        // Save SEO metadata
        $seo = SeoMetadata::firstOrNew([
            'seoable_type' => 'page',
            'seoable_id' => 13,
        ]);
        $seo->meta_title = $validated['meta_title'] ?? null;
        $seo->meta_description = $validated['meta_description'] ?? null;
        $seo->save();

        return back()->with('success', 'Les paramètres des solutions ont été mis à jour.');
    }
}
