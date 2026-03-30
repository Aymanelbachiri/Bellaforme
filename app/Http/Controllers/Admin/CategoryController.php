<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Models\Division;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private readonly ImageOptimizer $imageOptimizer,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/categories/index', [
            'categories' => Category::with('division')->orderBy('order')->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/categories/create', [
            'divisions' => Division::orderBy('name')->get(['id', 'name']),
            'nextOrder' => (Category::max('order') ?? -1) + 1,
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $data['image'] = $this->imageOptimizer->resolveImage($request, 'image', 'categories');

        $heroImage = $this->imageOptimizer->resolveImage($request, 'hero_image', 'categories');
        if ($heroImage) {
            $data['hero_image'] = $heroImage;
        }

        $videoCover = $this->imageOptimizer->resolveImage($request, 'video_cover', 'categories');
        if ($videoCover) {
            $data['video_cover'] = $videoCover;
        }

        // Extract SEO fields
        $seoData = $this->extractSeoData($data, $request);

        // Remove SEO fields from category data
        unset($data['meta_title'], $data['meta_description'], $data['og_image']);

        $category = Category::create($data);

        // Save SEO metadata
        if ($this->hasSeoData($seoData)) {
            $category->seo()->create($seoData);
        }

        return to_route('admin.categories.index');
    }

    public function edit(Category $category): Response
    {
        $category->load('seo');

        return Inertia::render('admin/categories/edit', [
            'category' => $category,
            'divisions' => Division::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $data = $request->validated();

        $resolvedImage = $this->imageOptimizer->resolveImage($request, 'image', 'categories');
        if ($resolvedImage && $resolvedImage !== $category->image) {
            $this->imageOptimizer->delete($category->image);
            $data['image'] = $resolvedImage;
        } else {
            unset($data['image']);
        }

        $resolvedHero = $this->imageOptimizer->resolveImage($request, 'hero_image', 'categories');
        if ($resolvedHero && $resolvedHero !== $category->hero_image) {
            if ($category->hero_image) {
                $this->imageOptimizer->delete($category->hero_image);
            }
            $data['hero_image'] = $resolvedHero;
        } else {
            unset($data['hero_image']);
        }

        $resolvedCover = $this->imageOptimizer->resolveImage($request, 'video_cover', 'categories');
        if ($resolvedCover && $resolvedCover !== $category->video_cover) {
            if ($category->video_cover) {
                $this->imageOptimizer->delete($category->video_cover);
            }
            $data['video_cover'] = $resolvedCover;
        } else {
            unset($data['video_cover']);
        }

        // Extract SEO fields
        $seoData = $this->extractSeoData($data, $request);

        // Remove SEO fields from category data
        unset($data['meta_title'], $data['meta_description'], $data['og_image']);

        $category->update($data);

        // Update or create SEO metadata
        $category->seo()->updateOrCreate(
            ['seoable_type' => Category::class, 'seoable_id' => $category->id],
            $seoData,
        );

        return to_route('admin.categories.index');
    }

    public function destroy(Category $category): RedirectResponse
    {
        // Delete image and its optimized versions
        if ($category->image) {
            $this->imageOptimizer->delete($category->image);
        }

        // Delete hero image
        if ($category->hero_image) {
            $this->imageOptimizer->delete($category->hero_image);
        }

        // Delete video cover
        if ($category->video_cover) {
            $this->imageOptimizer->delete($category->video_cover);
        }

        // Delete og_image if it exists
        if ($category->seo && $category->seo->og_image) {
            $this->imageOptimizer->delete($category->seo->og_image);
        }

        $category->delete();

        return to_route('admin.categories.index');
    }

    /**
     * Extract SEO data from validated data, handling og_image upload.
     */
    private function extractSeoData(array &$data, StoreCategoryRequest|UpdateCategoryRequest $request): array
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
