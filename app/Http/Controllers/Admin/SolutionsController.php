<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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

        return Inertia::render('admin/solutions/edit', [
            'settings' => $settings,
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
        $existingSections = $settings->sections ?? [];

        foreach ($sections as $index => &$section) {
            if (isset($sectionImages[$index])) {
                $section['image'] = $imageOptimizer->optimize($sectionImages[$index], 'solutions/sections');
            } elseif (isset($sectionImagePaths[$index]) && is_string($sectionImagePaths[$index]) && Storage::disk('public')->exists($sectionImagePaths[$index])) {
                $section['image'] = $sectionImagePaths[$index];
            } elseif (empty($section['image']) && isset($existingSections[$index]['image'])) {
                $section['image'] = $existingSections[$index]['image'];
            }
        }
        unset($section);

        $data['sections'] = $sections;

        $settings->update($data);

        return back()->with('success', 'Les paramètres des solutions ont été mis à jour.');
    }
}
