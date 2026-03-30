<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer as SpatieOptimizer;

class ImageOptimizer
{
    /**
     * Store the original file, optimize it with Spatie, and generate an AVIF companion.
     */
    public function optimize(UploadedFile $file, string $directory): string
    {
        $originalPath = $file->store($directory, 'public');
        $fullDiskPath = Storage::disk('public')->path($originalPath);

        $this->optimizeFile($fullDiskPath);
        $this->generateAvif($fullDiskPath);

        return $originalPath;
    }

    /**
     * Resolve an image field: if it's a file upload, optimize it;
     * if it's an existing storage path string, return it as-is.
     */
    public function resolveImage(Request $request, string $field, string $directory): ?string
    {
        if ($request->hasFile($field)) {
            return $this->optimize($request->file($field), $directory);
        }

        $value = $request->input($field);

        if (is_string($value) && Storage::disk('public')->exists($value)) {
            return $value;
        }

        return null;
    }

    /**
     * Delete the original file and its AVIF companion.
     */
    public function delete(string $path): void
    {
        $disk = Storage::disk('public');

        $disk->delete($path);

        $pathInfo = pathinfo($path);
        $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];
        $disk->delete("{$basePath}.avif");
    }

    /**
     * Optimize a file in-place using Spatie (jpegoptim, pngquant, etc.).
     * Uses external CLI binaries -- no PHP memory pressure.
     */
    public function optimizeFile(string $absolutePath): void
    {
        try {
            SpatieOptimizer::optimize($absolutePath);
        } catch (\Throwable) {
        }
    }

    /**
     * Generate an AVIF companion using native PHP GD functions.
     * Temporarily raises memory_limit for large images, then restores it.
     */
    public function generateAvif(string $absolutePath): void
    {
        $ext = strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION));

        if (! in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'])) {
            return;
        }

        $previousLimit = ini_get('memory_limit');
        @ini_set('memory_limit', '4G');

        try {
            $image = match ($ext) {
                'jpg', 'jpeg' => @imagecreatefromjpeg($absolutePath),
                'png' => @imagecreatefrompng($absolutePath),
                'gif' => @imagecreatefromgif($absolutePath),
                'webp' => @imagecreatefromwebp($absolutePath),
                'bmp' => @imagecreatefrombmp($absolutePath),
                default => false,
            };

            if ($image === false) {
                return;
            }

            if ($ext === 'png') {
                imagealphablending($image, false);
                imagesavealpha($image, true);
            }

            $pathInfo = pathinfo($absolutePath);
            $avifPath = $pathInfo['dirname'] . DIRECTORY_SEPARATOR . $pathInfo['filename'] . '.avif';

            imageavif($image, $avifPath, 75);
            imagedestroy($image);
        } finally {
            @ini_set('memory_limit', $previousLimit);
        }
    }
}
