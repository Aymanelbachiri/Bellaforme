<?php

use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\DivisionController as AdminDivisionController;
use App\Http\Controllers\Admin\EmailSettingsController as AdminEmailSettingsController;
use App\Http\Controllers\Admin\HomepageController as AdminHomepageController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\SeoController as AdminSeoController;
use App\Http\Controllers\Public\CategoryController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\DivisionController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ProductController;
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
        Route::resource('contact-messages', AdminContactMessageController::class)->only(['index', 'show']);
        Route::get('homepage', [AdminHomepageController::class, 'edit'])->name('homepage.edit');
        Route::put('homepage', [AdminHomepageController::class, 'update'])->name('homepage.update');
        Route::get('email-settings', [AdminEmailSettingsController::class, 'edit'])->name('email-settings.edit');
        Route::put('email-settings', [AdminEmailSettingsController::class, 'update'])->name('email-settings.update');
        Route::post('email-settings/test', [AdminEmailSettingsController::class, 'test'])->name('email-settings.test');
        Route::get('seo', [AdminSeoController::class, 'edit'])->name('seo.edit');
        Route::put('seo', [AdminSeoController::class, 'update'])->name('seo.update');
        Route::post('regenerate-images', function () {
            $disk = \Illuminate\Support\Facades\Storage::disk('public');
            $count = 0;

            // Collect all original images (non-webp files in known directories)
            $directories = ['divisions', 'products', 'homepage', 'homepage/slides', 'brands', 'categories'];
            foreach ($directories as $dir) {
                if (!$disk->exists($dir)) continue;
                foreach ($disk->files($dir) as $file) {
                    // Skip webp variants and non-image files
                    if (str_ends_with($file, '.webp')) continue;
                    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) continue;

                    // Regenerate all size variants
                    $pathInfo = pathinfo($file);
                    $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];
                    $fullDiskPath = $disk->path($file);

                    foreach (['thumb' => 150, 'medium' => 600, 'large' => 1200, 'xlarge' => 1920] as $suffix => $width) {
                        try {
                            $image = \Intervention\Image\Laravel\Facades\Image::read($fullDiskPath);
                            $image->scaleDown(width: $width);
                            $webpPath = "{$basePath}-{$suffix}.webp";
                            $image->toWebp(quality: 90)->save($disk->path($webpPath));
                        } catch (\Throwable $e) {
                            continue;
                        }
                    }
                    $count++;
                }
            }

            return back()->with('success', "Regenerated optimized images for {$count} files.");
        })->name('regenerate-images');
    });

require __DIR__.'/settings.php';

// Division routes — must be last to avoid catching /product, /contact, /admin, etc.
Route::get('/{slug}', [DivisionController::class, 'show'])->name('division.show');
Route::get('/{division}/category/{slug}', [CategoryController::class, 'show'])->name('category.show');
