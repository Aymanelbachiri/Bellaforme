<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBrandRequest;
use App\Http\Requests\Admin\UpdateBrandRequest;
use App\Models\Brand;
use App\Models\Division;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function __construct(
        private readonly ImageOptimizer $imageOptimizer,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/brands/index', [
            'brands' => Brand::with('divisions')->orderBy('order')->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/brands/create', [
            'divisions' => Division::orderBy('name')->get(['id', 'name']),
            'nextOrder' => (Brand::max('order') ?? -1) + 1,
        ]);
    }

    public function store(StoreBrandRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $divisionIds = $data['division_ids'] ?? [];
        unset($data['division_ids']);

        // Handle logo upload
        $data['logo'] = $this->imageOptimizer->optimize($request->file('logo'), 'brands');

        $brand = Brand::create($data);
        $brand->divisions()->sync($divisionIds);

        return to_route('admin.brands.index');
    }

    public function edit(Brand $brand): Response
    {
        $brand->load('divisions');

        return Inertia::render('admin/brands/edit', [
            'brand' => $brand,
            'divisions' => Division::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateBrandRequest $request, Brand $brand): RedirectResponse
    {
        $data = $request->validated();
        $divisionIds = $data['division_ids'] ?? [];
        unset($data['division_ids']);

        // Handle logo upload if a new one is provided
        if ($request->hasFile('logo')) {
            $this->imageOptimizer->delete($brand->logo);
            $data['logo'] = $this->imageOptimizer->optimize($request->file('logo'), 'brands');
        } else {
            unset($data['logo']);
        }

        $brand->update($data);
        $brand->divisions()->sync($divisionIds);

        return to_route('admin.brands.index');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        // Delete logo and its optimized versions
        if ($brand->logo) {
            $this->imageOptimizer->delete($brand->logo);
        }

        $brand->delete();

        return to_route('admin.brands.index');
    }
}
