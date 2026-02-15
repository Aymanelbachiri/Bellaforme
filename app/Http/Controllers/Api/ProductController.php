<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * GET /api/products?category=slug&brand=slug
     *
     * Return active products, optionally filtered by category and brand slugs.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::active();

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->input('category'));
            });
        }

        if ($request->filled('brand')) {
            $query->whereHas('brand', function ($q) use ($request) {
                $q->where('slug', $request->input('brand'));
            });
        }

        $products = $query->get([
            'id',
            'name',
            'slug',
            'content_mode',
            'featured_image',
            'short_description',
            'brochure_file',
        ]);

        return response()->json($products);
    }

    /**
     * GET /api/product/{slug}
     *
     * Return full product data for detailed products. 404 for brochure_only or not found.
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)
            ->detailed()
            ->with(['images' => fn ($q) => $q->orderBy('order'), 'specifications' => fn ($q) => $q->orderBy('order'), 'brand'])
            ->first();

        if (!$product) {
            abort(404);
        }

        return response()->json($product);
    }
}
