<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SeoMetadata;
use Inertia\Inertia;
use Inertia\Response;

class CataloguesController extends Controller
{
    public function index(): Response
    {
        $products = Product::where('is_active', true)
            ->whereNotNull('brochure_file')
            ->where('brochure_file', '!=', '')
            ->with(['brand', 'category', 'division'])
            ->orderBy('order')
            ->get();

        $seo = SeoMetadata::where('seoable_type', 'page')
            ->where('seoable_id', 12)
            ->first();

        return Inertia::render('nos-catalogues', [
            'products' => $products,
            'seo' => [
                'meta_title' => $seo?->meta_title ?? 'Nos Catalogues - Bella Forme Group',
                'meta_description' => $seo?->meta_description ?? 'Consultez et téléchargez nos catalogues produits. Équipements de fitness, spa, et bien-être professionnels.',
                'og_image' => $seo?->og_image ? asset('storage/' . $seo->og_image) : null,
                'canonical_url' => url('/nos-catalogues'),
            ],
        ]);
    }
}
