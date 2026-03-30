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
    $type = $request->query('type', 'image');

    $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'];
    $docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
    $optimizedExtensions = ['avif', 'webp'];

    $allowedExtensions = $type === 'document' ? $docExtensions : $imageExtensions;

    $allTopDirs = $disk->directories('');
    $allTopDirs = array_values(array_filter($allTopDirs, fn ($d) => ! str_starts_with(basename($d), '.')));

    $scanDirs = $directory ? [$directory] : $allTopDirs;

    // First pass: collect all file paths and index basenames per directory
    $allFilePaths = [];
    $basenameIndex = [];

    foreach ($scanDirs as $dir) {
        if (! $disk->exists($dir)) {
            continue;
        }

        $subDirs = $disk->directories($dir);
        $dirsToScan = array_merge([$dir], $subDirs);

        foreach ($dirsToScan as $scanDir) {
            foreach ($disk->files($scanDir) as $file) {
                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (! in_array($ext, $allowedExtensions)) {
                    continue;
                }
                $allFilePaths[] = $file;
                $basename = pathinfo($file, PATHINFO_FILENAME);
                $fileDir = dirname($file);
                $basenameIndex[$fileDir][$basename][] = $ext;
            }
        }
    }

    // Second pass: skip optimization variants that have a corresponding original
    $files = [];

    foreach ($allFilePaths as $file) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

        if ($ext === 'webp' && preg_match('/-(thumb|medium|large|xlarge)\.webp$/', $file)) {
            continue;
        }

        if (in_array($ext, $optimizedExtensions)) {
            $basename = pathinfo($file, PATHINFO_FILENAME);
            $fileDir = dirname($file);
            $siblings = $basenameIndex[$fileDir][$basename] ?? [];
            $hasOriginal = ! empty(array_diff($siblings, $optimizedExtensions));
            if ($hasOriginal) {
                continue;
            }
        }

        $files[] = [
            'path' => $file,
            'url' => $disk->url($file),
            'name' => basename($file),
            'directory' => dirname($file),
            'size' => $disk->size($file),
            'modified' => $disk->lastModified($file),
        ];
    }

    usort($files, fn ($a, $b) => $b['modified'] - $a['modified']);

    return response()->json($files);
});
