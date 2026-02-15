<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Division;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function show(string $divisionSlug, string $categorySlug): Response
    {
        $division = Division::where('slug', $divisionSlug)
            ->where('is_active', true)
            ->firstOrFail();

        $category = Category::where('slug', $categorySlug)
            ->where('division_id', $division->id)
            ->where('is_active', true)
            ->firstOrFail();

        // Get brands that have active products in this category
        $brandIds = $category->products()
            ->where('is_active', true)
            ->whereNotNull('brand_id')
            ->pluck('brand_id')
            ->unique();

        $brands = Brand::whereIn('id', $brandIds)
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        $seoData = $category->getSeoData();

        return Inertia::render('category/show', [
            'division' => $division,
            'category' => $category,
            'brands' => $brands,
            'seo' => [
                'meta_title' => $seoData['meta_title'],
                'meta_description' => $seoData['meta_description'],
                'og_image' => $seoData['og_image'] ? asset('storage/' . $seoData['og_image']) : null,
                'canonical_url' => url("/{$division->slug}/category/{$category->slug}"),
            ],
        ]);
    }
}
