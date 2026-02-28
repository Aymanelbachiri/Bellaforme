<?php

namespace App\Concerns;

use Illuminate\Support\Facades\Storage;

trait HasOptimizedImages
{
    /**
     * Get the URL for the AVIF version of an image.
     *
     * @param  string  $path  The stored path relative to the public disk (e.g. "uploads/hero-image.jpg")
     * @return string  The public URL to the AVIF image
     */
    public function getOptimizedImageUrl(string $path): string
    {
        $pathInfo = pathinfo($path);
        $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];

        return Storage::disk('public')->url("{$basePath}.avif");
    }

    /**
     * Get the URL for the original image.
     *
     * @param  string  $path  The stored path relative to the public disk
     * @return string  The public URL to the original image
     */
    public function getImageUrl(string $path): string
    {
        return Storage::disk('public')->url($path);
    }
}
