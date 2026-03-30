<?php

use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\DivisionController as AdminDivisionController;
use App\Http\Controllers\Admin\EmailSettingsController as AdminEmailSettingsController;
use App\Http\Controllers\Admin\HomepageController as AdminHomepageController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Admin\SeoController as AdminSeoController;
use App\Http\Controllers\Admin\NewsletterController as AdminNewsletterController;
use App\Http\Controllers\Public\BrandsController;
use App\Http\Controllers\Public\CataloguesController;
use App\Http\Controllers\Public\CategoryController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\DivisionController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\NewsletterController;
use App\Http\Controllers\Public\ProductController;
use App\Http\Controllers\Public\ReferencesController;
use App\Http\Controllers\Public\SolutionsController;
use App\Http\Controllers\Admin\SolutionsController as AdminSolutionsController;
use App\Models\Brand;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Division;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/newsletter', [NewsletterController::class, 'store'])->name('newsletter.store');
Route::get('/nos-marques', [BrandsController::class, 'index'])->name('nos-marques');
Route::get('/nos-references', [ReferencesController::class, 'index'])->name('nos-references');
Route::get('/nos-catalogues', [CataloguesController::class, 'index'])->name('nos-catalogues');
Route::get('/nos-solutions', [SolutionsController::class, 'index'])->name('nos-solutions');

Route::get('/qui-sommes-nous', function () {
    $seo = \App\Models\SeoMetadata::where('seoable_type', 'page')->where('seoable_id', 3)->first();

    return Inertia::render('about', [
        'seo' => [
            'meta_title' => $seo?->meta_title ?? 'Qui sommes nous ? - Bella Forme',
            'meta_description' => $seo?->meta_description ?? 'Découvrez Bella Forme Group, référence depuis 30 ans au service des professionnels du bien-être au Maroc.',
            'og_image' => $seo?->og_image ? asset('storage/' . $seo->og_image) : null,
            'canonical_url' => url('/qui-sommes-nous'),
        ],
    ]);
})->name('about');

Route::get('dashboard', function () {
    return Inertia::render('dashboard', [
        'stats' => [
            'divisions' => Division::where('is_active', true)->count(),
            'categories' => Category::where('is_active', true)->count(),
            'brands' => Brand::count(),
            'products' => Product::where('is_active', true)->count(),
        ],
        'recentMessages' => ContactMessage::latest()->take(5)->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('divisions', AdminDivisionController::class);
        Route::resource('categories', AdminCategoryController::class);
        Route::resource('brands', AdminBrandController::class);
        Route::resource('products', AdminProductController::class);
        Route::resource('contact-messages', AdminContactMessageController::class)->only(['index', 'show', 'destroy']);
        Route::post('contact-messages/bulk-destroy', [AdminContactMessageController::class, 'bulkDestroy'])->name('contact-messages.bulk-destroy');
        Route::get('newsletter', [AdminNewsletterController::class, 'index'])->name('newsletter.index');
        Route::get('newsletter/export', [AdminNewsletterController::class, 'export'])->name('newsletter.export');
        Route::delete('newsletter/{subscriber}', [AdminNewsletterController::class, 'destroy'])->name('newsletter.destroy');
        Route::post('newsletter/bulk-destroy', [AdminNewsletterController::class, 'bulkDestroy'])->name('newsletter.bulk-destroy');
        Route::get('homepage', [AdminHomepageController::class, 'edit'])->name('homepage.edit');
        Route::put('homepage', [AdminHomepageController::class, 'update'])->name('homepage.update');
        Route::get('email-settings', [AdminEmailSettingsController::class, 'edit'])->name('email-settings.edit');
        Route::put('email-settings', [AdminEmailSettingsController::class, 'update'])->name('email-settings.update');
        Route::post('email-settings/test', [AdminEmailSettingsController::class, 'test'])->name('email-settings.test');
        Route::get('solutions', [AdminSolutionsController::class, 'edit'])->name('solutions.edit');
        Route::put('solutions', [AdminSolutionsController::class, 'update'])->name('solutions.update');
        Route::get('seo', [AdminSeoController::class, 'edit'])->name('seo.edit');
        Route::put('seo', [AdminSeoController::class, 'update'])->name('seo.update');
        Route::get('media', [AdminMediaController::class, 'index'])->name('media.index');
        Route::get('media/list', [AdminMediaController::class, 'list'])->name('media.list');
        Route::post('media/upload', [AdminMediaController::class, 'upload'])->name('media.upload');
        Route::delete('media/delete', [AdminMediaController::class, 'destroy'])->name('media.destroy');
        Route::post('media/directory', [AdminMediaController::class, 'createDirectory'])->name('media.directory');
        Route::delete('media/directory', [AdminMediaController::class, 'deleteDirectory'])->name('media.directory.delete');
        Route::get('regenerate-images/list', function () {
            $disk = \Illuminate\Support\Facades\Storage::disk('public');
            $images = [];

            $allTopDirs = $disk->directories('');
            $allTopDirs = array_values(array_filter($allTopDirs, fn ($d) => ! str_starts_with(basename($d), '.')));

            foreach ($allTopDirs as $dir) {
                $subDirs = $disk->directories($dir);
                $dirsToScan = array_merge([$dir], $subDirs);

                foreach ($dirsToScan as $scanDir) {
                    foreach ($disk->files($scanDir) as $file) {
                        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

                        if ($ext === 'webp' && preg_match('/-(thumb|medium|large|xlarge)\.webp$/', $file)) {
                            $images[] = ['path' => $file, 'type' => 'stale_webp'];
                            continue;
                        }

                        if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) {
                            $images[] = ['path' => $file, 'type' => 'image'];
                        }
                    }
                }
            }

            return response()->json(['images' => $images]);
        })->name('regenerate-images.list');

        Route::post('regenerate-images/process', function (\Illuminate\Http\Request $request, \App\Services\ImageOptimizer $imageOptimizer) {
            @set_time_limit(120);

            $path = $request->input('path');
            $type = $request->input('type');
            $disk = \Illuminate\Support\Facades\Storage::disk('public');

            if (! $disk->exists($path)) {
                return response()->json(['status' => 'skipped', 'reason' => 'File not found']);
            }

            if ($type === 'stale_webp') {
                $disk->delete($path);
                return response()->json(['status' => 'cleaned']);
            }

            $pathInfo = pathinfo($path);
            $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];
            $fullDiskPath = $disk->path($path);
            $cleaned = false;

            $staleWebp = "{$basePath}.webp";
            if ($disk->exists($staleWebp)) {
                $disk->delete($staleWebp);
                $cleaned = true;
            }

            $imageOptimizer->optimizeFile($fullDiskPath);

            $avif = false;
            try {
                $imageOptimizer->generateAvif($fullDiskPath);
                $avif = true;
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning("AVIF generation failed for {$path}: " . $e->getMessage());
            }

            return response()->json([
                'status' => 'processed',
                'optimized' => true,
                'avif' => $avif,
                'cleaned' => $cleaned,
            ]);
        })->name('regenerate-images.process');
    });

require __DIR__.'/settings.php';

// Division routes — must be last to avoid catching /product, /contact, /admin, etc.
Route::get('/{slug}', [DivisionController::class, 'show'])->name('division.show');
Route::get('/{division}/category/{slug}', [CategoryController::class, 'show'])->name('category.show');
