<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomepageSetting;
use App\Rules\ImageOrPath;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomepageController extends Controller
{
    public function edit(): Response
    {
        $settings = HomepageSetting::firstOrCreate([], [
            'hero_image' => '',
            'hero_title' => '',
            'hero_subtitle' => '',
            'hero_slides' => [],
            'stats' => [],
        ]);

        return Inertia::render('admin/homepage/edit', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, ImageOptimizer $imageOptimizer): RedirectResponse
    {
        $validated = $request->validate([
            'hero_image' => ['nullable', new ImageOrPath],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string', 'max:255'],
            'hero_slides' => ['nullable', 'array'],
            'hero_slides.*.type' => ['required', 'in:image,video'],
            'hero_slides.*.media_url' => ['nullable', 'string', 'max:500'],
            'hero_slides.*.title' => ['nullable', 'string', 'max:255'],
            'hero_slides.*.subtitle' => ['nullable', 'string', 'max:1000'],
            'hero_slides.*.button_text' => ['nullable', 'string', 'max:255'],
            'hero_slides.*.button_url' => ['nullable', 'string', 'max:500'],
            'hero_slide_images.*' => ['nullable', new ImageOrPath],
            'stats' => ['nullable', 'array'],
            'stats.*.label' => ['required', 'string', 'max:255'],
            'stats.*.value' => ['required', 'string', 'max:255'],
        ]);

        $settings = HomepageSetting::firstOrCreate([], [
            'hero_image' => '',
            'hero_title' => '',
            'hero_subtitle' => '',
            'hero_slides' => [],
            'stats' => [],
        ]);

        $data = [
            'hero_title' => $validated['hero_title'] ?? '',
            'hero_subtitle' => $validated['hero_subtitle'] ?? '',
            'stats' => $validated['stats'] ?? [],
        ];

        $resolvedHero = $imageOptimizer->resolveImage($request, 'hero_image', 'homepage');
        if ($resolvedHero && $resolvedHero !== $settings->hero_image) {
            if ($settings->hero_image) {
                $imageOptimizer->delete($settings->hero_image);
            }
            $data['hero_image'] = $resolvedHero;
        }

        $slides = $validated['hero_slides'] ?? [];
        $slideImages = $request->file('hero_slide_images', []);
        $slideImagePaths = $request->input('hero_slide_images', []);
        $existingSlides = $settings->hero_slides ?? [];

        foreach ($slides as $index => &$slide) {
            if ($slide['type'] === 'image' && isset($slideImages[$index])) {
                $slide['media_url'] = $imageOptimizer->optimize($slideImages[$index], 'homepage/slides');
            } elseif ($slide['type'] === 'image' && isset($slideImagePaths[$index]) && is_string($slideImagePaths[$index]) && Storage::disk('public')->exists($slideImagePaths[$index])) {
                $slide['media_url'] = $slideImagePaths[$index];
            } elseif ($slide['type'] === 'image' && empty($slide['media_url']) && isset($existingSlides[$index]['media_url'])) {
                $slide['media_url'] = $existingSlides[$index]['media_url'];
            }
        }
        unset($slide);

        $data['hero_slides'] = $slides;

        $settings->update($data);

        return back()->with('success', 'Homepage settings updated successfully.');
    }
}
