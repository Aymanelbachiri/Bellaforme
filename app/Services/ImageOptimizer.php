<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class ImageOptimizer
{
    /**
     * Sizes for WebP optimization (width in pixels).
     */
    private const SIZES = [
        'thumb' => 150,
        'medium' => 600,
        'large' => 1200,
        'xlarge' => 1920,
    ];

    /**
     * Store the original file and generate optimized WebP versions.
     *
     * @param  UploadedFile  $file  The uploaded image file
     * @param  string  $directory  The directory on the public disk to store files in
     * @return string  The path to the original file (relative to public disk)
     */
    public function optimize(UploadedFile $file, string $directory): string
    {
        // Store the original file on the public disk
        $originalPath = $file->store($directory, 'public');

        // Derive the base name without extension for naming optimized versions
        $pathInfo = pathinfo($originalPath);
        $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];

        // Read the original image once
        $fullDiskPath = Storage::disk('public')->path($originalPath);

        foreach (self::SIZES as $suffix => $width) {
            $image = Image::read($fullDiskPath);
            $image->scaleDown(width: $width);

            $webpPath = "{$basePath}-{$suffix}.webp";
            $webpFullPath = Storage::disk('public')->path($webpPath);

            $image->toWebp(quality: 90)->save($webpFullPath);
        }

        return $originalPath;
    }

    /**
     * Delete the original file and all optimized WebP versions.
     *
     * @param  string  $path  The path to the original file (relative to public disk)
     */
    public function delete(string $path): void
    {
        $disk = Storage::disk('public');

        // Delete the original
        $disk->delete($path);

        // Delete all optimized versions
        $pathInfo = pathinfo($path);
        $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];

        foreach (array_keys(self::SIZES) as $suffix) {
            $disk->delete("{$basePath}-{$suffix}.webp");
        }
    }
}
