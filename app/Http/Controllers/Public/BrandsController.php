<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\SeoMetadata;
use Inertia\Inertia;
use Inertia\Response;

class BrandsController extends Controller
{
    public function index(): Response
    {
        $divisions = Division::where('is_active', true)
            ->with(['brands' => function ($query) {
                $query->where('is_active', true)
                    ->where('is_partner', true)
                    ->orderBy('order');
            }])
            ->orderBy('order')
            ->get()
            ->filter(fn ($d) => $d->brands->isNotEmpty())
            ->values();

        $seo = SeoMetadata::where('seoable_type', 'page')
            ->where('seoable_id', 10)
            ->first();

        return Inertia::render('nos-marques', [
            'divisions' => $divisions,
            'seo' => [
                'meta_title' => $seo?->meta_title ?? 'Nos Marques - Bella Forme Group',
                'meta_description' => $seo?->meta_description ?? 'Découvrez les marques partenaires de Bella Forme Group, distributeur exclusif des marques leaders en équipements de fitness et bien-être.',
                'og_image' => $seo?->og_image ? asset('storage/' . $seo->og_image) : null,
                'canonical_url' => url('/nos-marques'),
            ],
        ]);
    }
}
