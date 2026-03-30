<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)
            ->where('content_mode', 'detailed')
            ->where('is_active', true)
            ->with(['images' => fn ($q) => $q->orderBy('order'), 'specifications' => fn ($q) => $q->orderBy('order'), 'brand', 'category.division'])
            ->firstOrFail();

        $seoData = $product->getSeoData();

        return Inertia::render('product/show', [
            'product' => $product,
            'seo' => [
                'meta_title' => $seoData['meta_title'],
                'meta_description' => $seoData['meta_description'],
                'og_image' => $seoData['og_image'] ? asset('storage/' . $seoData['og_image']) : null,
                'canonical_url' => url("/product/{$product->slug}"),
            ],
        ]);
    }
}
