<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Division;
use App\Models\Product;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly ImageOptimizer $imageOptimizer,
    ) {}

    public function index(): Response
    {
        $query = Product::with(['division', 'category', 'brand'])->orderBy('order');

        if ($search = request('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('admin/products/index', [
            'products' => $query->paginate(15)->withQueryString(),
            'filters' => ['search' => $search ?? ''],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/create', [
            'divisions' => Division::orderBy('name')->get(['id', 'name']),
            'categories' => Category::orderBy('name')->get(['id', 'name', 'division_id']),
            'brands' => Brand::where('is_partner', true)->with('divisions:id')->orderBy('name')->get(['id', 'name']),
            'nextOrder' => (Product::max('order') ?? -1) + 1,
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $data['featured_image'] = $this->imageOptimizer->resolveImage($request, 'featured_image', 'products');

        // Handle brochure_file: upload (keep name, add suffix if exists) or use existing path from media picker
        if ($request->hasFile('brochure_file')) {
            $data['brochure_file'] = $this->storeBrochureWithOriginalName($request->file('brochure_file'));
        } elseif (is_string($request->input('brochure_file')) && Storage::disk('public')->exists($request->input('brochure_file'))) {
            $data['brochure_file'] = $request->input('brochure_file');
        }

        // Extract SEO fields and specifications/gallery before creating product
        $seoData = $this->extractSeoData($data, $request);
        $specifications = $data['specifications'] ?? null;
        $gallery = $request->file('gallery');
        $galleryOrder = $request->input('gallery_order');

        // Remove non-product fields
        unset($data['meta_title'], $data['meta_description'], $data['og_image'], $data['specifications'], $data['gallery'], $data['gallery_order']);

        $product = Product::create($data);

        // Save SEO metadata
        if ($this->hasSeoData($seoData)) {
            $product->seo()->create($seoData);
        }

        // Sync specifications and gallery for detailed products
        if ($product->content_mode === 'detailed') {
            $this->syncSpecifications($product, $specifications);
            $this->syncGalleryImages($product, $gallery, $galleryOrder);
        }

        return to_route('admin.products.index');
    }

    public function edit(Product $product): Response
    {
        $product->load(['specifications' => fn ($q) => $q->orderBy('order'), 'images' => fn ($q) => $q->orderBy('order'), 'seo']);

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'divisions' => Division::orderBy('name')->get(['id', 'name']),
            'categories' => Category::orderBy('name')->get(['id', 'name', 'division_id']),
            'brands' => Brand::where('is_partner', true)->with('divisions:id')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();

        $resolvedFeatured = $this->imageOptimizer->resolveImage($request, 'featured_image', 'products');
        if ($resolvedFeatured && $resolvedFeatured !== $product->featured_image) {
            $this->imageOptimizer->delete($product->featured_image);
            $data['featured_image'] = $resolvedFeatured;
        } else {
            unset($data['featured_image']);
        }

        // Handle brochure_file: upload (keep name, add suffix if exists), existing path, or keep current
        if ($request->hasFile('brochure_file')) {
            if ($product->brochure_file) {
                Storage::disk('public')->delete($product->brochure_file);
            }
            $data['brochure_file'] = $this->storeBrochureWithOriginalName($request->file('brochure_file'));
        } elseif (is_string($request->input('brochure_file')) && Storage::disk('public')->exists($request->input('brochure_file'))) {
            $data['brochure_file'] = $request->input('brochure_file');
        } else {
            unset($data['brochure_file']);
        }

        // Extract SEO fields and specifications/gallery
        $seoData = $this->extractSeoData($data, $request);
        $specifications = $data['specifications'] ?? null;
        $gallery = $request->file('gallery');
        $galleryOrder = $request->input('gallery_order');

        // Remove non-product fields
        unset($data['meta_title'], $data['meta_description'], $data['og_image'], $data['specifications'], $data['gallery'], $data['gallery_order']);

        $product->update($data);

        // Update or create SEO metadata
        $product->seo()->updateOrCreate(
            ['seoable_type' => Product::class, 'seoable_id' => $product->id],
            $seoData,
        );

        // Handle content_mode-specific sync
        if ($product->content_mode === 'detailed') {
            $this->syncSpecifications($product, $specifications);
            $this->syncGalleryImages($product, $gallery, $galleryOrder);
        } else {
            // brochure_only: remove existing specifications and gallery images
            $product->specifications()->delete();
            $this->deleteGalleryImages($product);
        }

        return to_route('admin.products.index');
    }

    public function destroy(Product $product): RedirectResponse
    {
        // Delete featured_image and optimized versions
        if ($product->featured_image) {
            $this->imageOptimizer->delete($product->featured_image);
        }

        // Delete brochure_file
        if ($product->brochure_file) {
            Storage::disk('public')->delete($product->brochure_file);
        }

        // Delete gallery images and optimized versions
        $this->deleteGalleryImages($product);

        // Delete og_image if it exists
        if ($product->seo && $product->seo->og_image) {
            $this->imageOptimizer->delete($product->seo->og_image);
        }

        // Cascade delete handles specs/images DB records
        $product->delete();

        return to_route('admin.products.index');
    }

    /**
     * Sync product specifications — delete all existing, then recreate from input.
     */
    private function syncSpecifications(Product $product, ?array $specifications): void
    {
        $product->specifications()->delete();

        if (empty($specifications)) {
            return;
        }

        foreach ($specifications as $index => $spec) {
            $product->specifications()->create([
                'label' => $spec['label'],
                'value' => $spec['value'],
                'order' => $index,
            ]);
        }
    }

    /**
     * Sync gallery images — create ProductImage records from uploaded files and/or existing paths.
     * $galleryOrderJson: optional JSON array of { type: 'file', index: int } | { type: 'path', path: string } in display order.
     */
    private function syncGalleryImages(Product $product, ?array $galleryFiles, ?string $galleryOrderJson = null): void
    {
        $galleryFiles = $galleryFiles ?? [];
        $orderEntries = $galleryOrderJson ? json_decode($galleryOrderJson, true) : null;

        if ($orderEntries && is_array($orderEntries)) {
            $maxOrder = $product->images()->max('order') ?? -1;
            foreach ($orderEntries as $i => $entry) {
                if (! is_array($entry) || empty($entry['type'])) {
                    continue;
                }
                if ($entry['type'] === 'path' && ! empty($entry['path'])) {
                    $imagePath = $entry['path'];
                } elseif ($entry['type'] === 'file' && isset($entry['index']) && isset($galleryFiles[$entry['index']])) {
                    $imagePath = $this->imageOptimizer->optimize($galleryFiles[$entry['index']], 'products/gallery');
                } else {
                    continue;
                }
                $product->images()->create([
                    'image_path' => $imagePath,
                    'order' => $maxOrder + $i + 1,
                ]);
            }
            return;
        }

        // Legacy: no gallery_order — treat gallery as list of files only
        if (empty($galleryFiles)) {
            return;
        }
        $maxOrder = $product->images()->max('order') ?? -1;
        foreach ($galleryFiles as $index => $file) {
            $imagePath = $this->imageOptimizer->optimize($file, 'products/gallery');
            $product->images()->create([
                'image_path' => $imagePath,
                'order' => $maxOrder + $index + 1,
            ]);
        }
    }

    /**
     * Delete all gallery images and their optimized versions from storage.
     */
    private function deleteGalleryImages(Product $product): void
    {
        foreach ($product->images as $image) {
            $this->imageOptimizer->delete($image->image_path);
        }

        $product->images()->delete();
    }

    /**
     * Store brochure PDF keeping original filename; add -1, -2 suffix if file already exists.
     */
    private function storeBrochureWithOriginalName(\Illuminate\Http\UploadedFile $file): string
    {
        $disk = Storage::disk('public');
        $directory = 'products/brochures';
        $originalName = $file->getClientOriginalName();
        $name = pathinfo($originalName, PATHINFO_FILENAME);
        $ext = strtolower($file->getClientOriginalExtension() ?: 'pdf');
        $name = preg_replace('/[^a-zA-Z0-9._-]/', '_', $name);

        $finalName = $name.'.'.$ext;
        $counter = 1;
        while ($disk->exists($directory.'/'.$finalName)) {
            $finalName = $name.'-'.$counter.'.'.$ext;
            $counter++;
        }

        return $file->storeAs($directory, $finalName, 'public');
    }

    /**
     * Extract SEO data from validated data, handling og_image upload.
     */
    private function extractSeoData(array &$data, StoreProductRequest|UpdateProductRequest $request): array
    {
        $seoData = [
            'meta_title' => $data['meta_title'] ?? null,
            'meta_description' => $data['meta_description'] ?? null,
            'og_image' => null,
        ];

        $resolvedOg = $this->imageOptimizer->resolveImage($request, 'og_image', 'seo');
        if ($resolvedOg) {
            $seoData['og_image'] = $resolvedOg;
        }

        return $seoData;
    }

    /**
     * Check if any SEO data is non-null.
     */
    private function hasSeoData(array $seoData): bool
    {
        return $seoData['meta_title'] !== null
            || $seoData['meta_description'] !== null
            || $seoData['og_image'] !== null;
    }
}
