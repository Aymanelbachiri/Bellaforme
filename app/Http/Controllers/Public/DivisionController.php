<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Division;
use Inertia\Inertia;
use Inertia\Response;

class DivisionController extends Controller
{
    public function show(string $slug): Response
    {
        $division = Division::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $categories = $division->categories()
            ->active()
            ->get();

        // Brands directly assigned to this division OR linked via products
        $productBrandIds = $division->products()
            ->where('is_active', true)
            ->whereNotNull('brand_id')
            ->pluck('brand_id')
            ->unique();

        $divisionBrandIds = $division->brands()->pluck('brands.id');

        $allBrandIds = $productBrandIds->merge($divisionBrandIds)->unique();

        $referenceBrands = Brand::whereIn('id', $allBrandIds)
            ->where('is_active', true)
            ->where('is_reference', true)
            ->orderBy('order')
            ->get();

        $partnerBrands = Brand::whereIn('id', $allBrandIds)
            ->where('is_active', true)
            ->where('is_partner', true)
            ->orderBy('order')
            ->get();

        $seoData = $division->getSeoData();

        return Inertia::render('division/show', [
            'division' => $division,
            'categories' => $categories,
            'referenceBrands' => $referenceBrands,
            'partnerBrands' => $partnerBrands,
            'seo' => [
                'meta_title' => $seoData['meta_title'],
                'meta_description' => $seoData['meta_description'],
                'og_image' => $seoData['og_image'] ? asset('storage/' . $seoData['og_image']) : null,
                'canonical_url' => url("/{$division->slug}"),
            ],
        ]);
    }
}
