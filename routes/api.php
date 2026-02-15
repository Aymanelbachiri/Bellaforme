<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Product listing and detail endpoints for the public frontend.
| These routes are loaded by RouteServiceProvider with the "api" prefix.
|
*/

Route::get('/products', [ProductController::class, 'index']);
Route::get('/product/{slug}', [ProductController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Media Library endpoint (authenticated)
|--------------------------------------------------------------------------
*/
Route::middleware(['web', 'auth'])->get('/media', function (\Illuminate\Http\Request $request) {
    $disk = \Illuminate\Support\Facades\Storage::disk('public');
    $directory = $request->query('directory', '');
    $type = $request->query('type', 'image'); // image or document

    $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    $docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];

    $allowedExtensions = $type === 'document' ? $docExtensions : $imageExtensions;

    // Scan directories
    $directories = ['divisions', 'products', 'homepage', 'homepage/slides', 'brands', 'categories', 'seo'];
    if ($directory) {
        $directories = [$directory];
    }

    $files = [];
    foreach ($directories as $dir) {
        if (!$disk->exists($dir)) continue;
        foreach ($disk->files($dir) as $file) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (!in_array($ext, $allowedExtensions)) continue;
            // Skip optimized webp variants (contain -thumb, -medium, -large, -xlarge)
            if ($ext === 'webp' && preg_match('/-(thumb|medium|large|xlarge)\.webp$/', $file)) continue;

            $files[] = [
                'path' => $file,
                'url' => $disk->url($file),
                'name' => basename($file),
                'directory' => dirname($file),
                'size' => $disk->size($file),
                'modified' => $disk->lastModified($file),
            ];
        }
    }

    // Sort by most recent
    usort($files, fn($a, $b) => $b['modified'] - $a['modified']);

    return response()->json($files);
});
