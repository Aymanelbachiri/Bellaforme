<?php

use App\Services\ImageOptimizer;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

it('stores the original file and returns its path', function () {
    $optimizer = new ImageOptimizer();
    $file = UploadedFile::fake()->image('hero.jpg', 1600, 900);

    $path = $optimizer->optimize($file, 'uploads');

    expect($path)->toStartWith('uploads/');
    Storage::disk('public')->assertExists($path);
});

it('generates three WebP optimized versions alongside the original', function () {
    $optimizer = new ImageOptimizer();
    $file = UploadedFile::fake()->image('product-photo.jpg', 2000, 1200);

    $path = $optimizer->optimize($file, 'images');

    $pathInfo = pathinfo($path);
    $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];

    Storage::disk('public')->assertExists($path);
    Storage::disk('public')->assertExists("{$basePath}-thumb.webp");
    Storage::disk('public')->assertExists("{$basePath}-medium.webp");
    Storage::disk('public')->assertExists("{$basePath}-large.webp");
});

it('uses correct naming convention for optimized files', function () {
    $optimizer = new ImageOptimizer();
    $file = UploadedFile::fake()->image('my-image.png', 1400, 800);

    $path = $optimizer->optimize($file, 'uploads');

    $pathInfo = pathinfo($path);
    $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];

    // Verify the naming pattern: {filename}-{size}.webp
    expect("{$basePath}-thumb.webp")->toContain('-thumb.webp');
    expect("{$basePath}-medium.webp")->toContain('-medium.webp');
    expect("{$basePath}-large.webp")->toContain('-large.webp');

    Storage::disk('public')->assertExists("{$basePath}-thumb.webp");
    Storage::disk('public')->assertExists("{$basePath}-medium.webp");
    Storage::disk('public')->assertExists("{$basePath}-large.webp");
});

it('deletes the original file and all optimized versions', function () {
    $optimizer = new ImageOptimizer();
    $file = UploadedFile::fake()->image('to-delete.jpg', 1600, 900);

    $path = $optimizer->optimize($file, 'uploads');

    $pathInfo = pathinfo($path);
    $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];

    // Verify all files exist before deletion
    Storage::disk('public')->assertExists($path);
    Storage::disk('public')->assertExists("{$basePath}-thumb.webp");
    Storage::disk('public')->assertExists("{$basePath}-medium.webp");
    Storage::disk('public')->assertExists("{$basePath}-large.webp");

    // Delete
    $optimizer->delete($path);

    // Verify all files are removed
    Storage::disk('public')->assertMissing($path);
    Storage::disk('public')->assertMissing("{$basePath}-thumb.webp");
    Storage::disk('public')->assertMissing("{$basePath}-medium.webp");
    Storage::disk('public')->assertMissing("{$basePath}-large.webp");
});

it('silently handles deletion when files do not exist', function () {
    $optimizer = new ImageOptimizer();

    // Should not throw any exception
    $optimizer->delete('nonexistent/image.jpg');

    expect(true)->toBeTrue();
});

it('stores files in the specified directory', function () {
    $optimizer = new ImageOptimizer();
    $file = UploadedFile::fake()->image('test.jpg', 800, 600);

    $path = $optimizer->optimize($file, 'products/gallery');

    expect($path)->toStartWith('products/gallery/');
});

/**
 * Property 20: Image optimization generates all required sizes
 *
 * For any uploaded image, the ImageOptimizer service should produce three
 * additional WebP files (thumbnail, medium, large) alongside the original,
 * and all three files should exist on the public disk.
 *
 * Validates: Requirements 14.1
 *
 * @group Feature: product-showcase
 * @group Property 20: Image optimization generates all required sizes
 */
it('Property 20: image optimization generates all required WebP sizes for random images', function () {
    $optimizer = new ImageOptimizer();
    $extensions = ['jpg', 'jpeg', 'png'];
    $minIterations = 100;

    for ($i = 0; $i < $minIterations; $i++) {
        // Generate random dimensions and filename (capped to avoid memory exhaustion with GD)
        $width = rand(200, 1400);
        $height = rand(200, 1400);
        $nameLength = rand(3, 20);
        $randomName = substr(str_shuffle(str_repeat('abcdefghijklmnopqrstuvwxyz0123456789', 2)), 0, $nameLength);
        $ext = $extensions[array_rand($extensions)];
        $filename = "{$randomName}.{$ext}";
        $directory = 'test-uploads';

        $file = UploadedFile::fake()->image($filename, $width, $height);

        $path = $optimizer->optimize($file, $directory);

        // The original file should exist
        Storage::disk('public')->assertExists($path);

        // Derive the base path for optimized versions
        $pathInfo = pathinfo($path);
        $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];

        // All three WebP variants must exist
        Storage::disk('public')->assertExists("{$basePath}-thumb.webp");
        Storage::disk('public')->assertExists("{$basePath}-medium.webp");
        Storage::disk('public')->assertExists("{$basePath}-large.webp");
    }
})->group('Feature: product-showcase', 'Property 20: Image optimization generates all required sizes');

/**
 * Property 21: Image deletion removes all optimized versions
 *
 * For any image that has been optimized, when the original image is deleted,
 * all associated optimized versions (thumbnail, medium, large WebP) should
 * also be removed from storage.
 *
 * Validates: Requirements 14.4
 *
 * @group Feature: product-showcase
 * @group Property 21: Image deletion removes all optimized versions
 */
it('Property 21: image deletion removes all optimized versions for random images', function () {
    $optimizer = new ImageOptimizer();
    $extensions = ['jpg', 'jpeg', 'png'];
    $minIterations = 100;

    for ($i = 0; $i < $minIterations; $i++) {
        // Generate random dimensions and filename (capped to avoid memory exhaustion with GD)
        $width = rand(200, 1400);
        $height = rand(200, 1400);
        $nameLength = rand(3, 20);
        $randomName = substr(str_shuffle(str_repeat('abcdefghijklmnopqrstuvwxyz0123456789', 2)), 0, $nameLength);
        $ext = $extensions[array_rand($extensions)];
        $filename = "{$randomName}.{$ext}";
        $directory = 'test-deletion';

        $file = UploadedFile::fake()->image($filename, $width, $height);

        // Step 1: Optimize the image (creates original + 3 WebP variants)
        $path = $optimizer->optimize($file, $directory);

        $pathInfo = pathinfo($path);
        $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];

        // Step 2: Verify all 4 files exist
        Storage::disk('public')->assertExists($path);
        Storage::disk('public')->assertExists("{$basePath}-thumb.webp");
        Storage::disk('public')->assertExists("{$basePath}-medium.webp");
        Storage::disk('public')->assertExists("{$basePath}-large.webp");

        // Step 3: Delete via optimizer
        $optimizer->delete($path);

        // Step 4: Verify all 4 files are gone
        Storage::disk('public')->assertMissing($path);
        Storage::disk('public')->assertMissing("{$basePath}-thumb.webp");
        Storage::disk('public')->assertMissing("{$basePath}-medium.webp");
        Storage::disk('public')->assertMissing("{$basePath}-large.webp");
    }
})->group('Feature: product-showcase', 'Property 21: Image deletion removes all optimized versions');
