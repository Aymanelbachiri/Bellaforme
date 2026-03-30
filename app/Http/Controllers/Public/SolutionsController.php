<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SeoMetadata;
use App\Models\SolutionsSetting;
use Inertia\Inertia;
use Inertia\Response;

class SolutionsController extends Controller
{
    public function index(): Response
    {
        $settings = SolutionsSetting::first();

        $seo = SeoMetadata::where('seoable_type', 'page')
            ->where('seoable_id', 13)
            ->first();

        return Inertia::render('nos-solutions', [
            'settings' => $settings,
            'seo' => [
                'meta_title' => $seo?->meta_title ?? 'Nos Solutions à vos Projets - Bella Forme Group',
                'meta_description' => $seo?->meta_description ?? 'Bella Forme Group vous accompagne dans vos projets : consulting, conception, équipement, installation, formation et SAV.',
                'og_image' => $seo?->og_image ? asset('storage/' . $seo->og_image) : null,
                'canonical_url' => url('/nos-solutions'),
            ],
        ]);
    }
}
