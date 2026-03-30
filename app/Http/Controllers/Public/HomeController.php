<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\HomepageSetting;
use App\Models\SeoMetadata;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $settings = HomepageSetting::first();
        $divisions = Division::active()->get();
        $seo = SeoMetadata::where('seoable_type', 'page')->where('seoable_id', 1)->first();

        return Inertia::render('home', [
            'settings' => $settings,
            'divisions' => $divisions,
            'seo' => [
                'meta_title' => $seo?->meta_title ?? 'Bella Forme Group - Votre espace professionnel',
                'meta_description' => $seo?->meta_description ?? $settings?->hero_subtitle ?? 'Votre espace professionnel dédié aux équipements et solutions.',
                'og_image' => $seo?->og_image ? asset('storage/' . $seo->og_image) : ($settings?->hero_image ? asset('storage/' . $settings->hero_image) : null),
                'canonical_url' => url('/'),
            ],
        ]);
    }
}
