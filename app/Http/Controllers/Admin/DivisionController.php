<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDivisionRequest;
use App\Http\Requests\Admin\UpdateDivisionRequest;
use App\Models\Division;
use App\Services\ImageOptimizer;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class DivisionController extends Controller
{
    public function __construct(
        private readonly ImageOptimizer $imageOptimizer,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/divisions/index', [
            'divisions' => Division::orderBy('order')->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/divisions/create', [
            'nextOrder' => (Division::max('order') ?? -1) + 1,
        ]);
    }

    public function store(StoreDivisionRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Handle hero_image upload
        $data['hero_image'] = $this->imageOptimizer->optimize($request->file('hero_image'), 'divisions');

        // Handle homepage_image upload
        if ($request->hasFile('homepage_image')) {
            $data['homepage_image'] = $this->imageOptimizer->optimize($request->file('homepage_image'), 'divisions');
        }

        // Extract SEO fields
        $seoData = $this->extractSeoData($data, $request);

        // Remove SEO fields from division data
        unset($data['meta_title'], $data['meta_description'], $data['og_image']);

        $division = Division::create($data);

        // Save SEO metadata
        if ($this->hasSeoData($seoData)) {
            $division->seo()->create($seoData);
        }

        return to_route('admin.divisions.index');
    }

    public function edit(Division $division): Response
    {
        $division->load('seo');

        return Inertia::render('admin/divisions/edit', [
            'division' => $division,
        ]);
    }

    public function update(UpdateDivisionRequest $request, Division $division): RedirectResponse
    {
        $data = $request->validated();

        // Handle hero_image upload if a new one is provided
        if ($request->hasFile('hero_image')) {
            $this->imageOptimizer->delete($division->hero_image);
            $data['hero_image'] = $this->imageOptimizer->optimize($request->file('hero_image'), 'divisions');
        } else {
            unset($data['hero_image']);
        }

        // Handle homepage_image upload if a new one is provided
        if ($request->hasFile('homepage_image')) {
            if ($division->homepage_image) {
                $this->imageOptimizer->delete($division->homepage_image);
            }
            $data['homepage_image'] = $this->imageOptimizer->optimize($request->file('homepage_image'), 'divisions');
        } else {
            unset($data['homepage_image']);
        }

        // Extract SEO fields
        $seoData = $this->extractSeoData($data, $request);

        // Remove SEO fields from division data
        unset($data['meta_title'], $data['meta_description'], $data['og_image']);

        $division->update($data);

        // Update or create SEO metadata
        $division->seo()->updateOrCreate(
            ['seoable_type' => Division::class, 'seoable_id' => $division->id],
            $seoData,
        );

        return to_route('admin.divisions.index');
    }

    public function destroy(Division $division): RedirectResponse
    {
        // Delete hero_image and its optimized versions
        if ($division->hero_image) {
            $this->imageOptimizer->delete($division->hero_image);
        }

        // Delete og_image if it exists
        if ($division->seo && $division->seo->og_image) {
            $this->imageOptimizer->delete($division->seo->og_image);
        }

        // Cascade delete handled by DB foreign keys, but delete images for categories/products
        $division->delete();

        return to_route('admin.divisions.index');
    }

    /**
     * Extract SEO data from validated data, handling og_image upload.
     */
    private function extractSeoData(array &$data, StoreDivisionRequest|UpdateDivisionRequest $request): array
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
