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

        // Handle image upload
        $data['image'] = $this->imageOptimizer->optimize($request->file('image'), 'categories');

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

        // Handle image upload if a new one is provided
        if ($request->hasFile('image')) {
            $this->imageOptimizer->delete($category->image);
            $data['image'] = $this->imageOptimizer->optimize($request->file('image'), 'categories');
        } else {
            unset($data['image']);
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

        if ($request->hasFile('og_image')) {
            $seoData['og_image'] = $this->imageOptimizer->optimize($request->file('og_image'), 'seo');
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
