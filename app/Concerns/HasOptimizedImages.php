<?php

namespace App\Concerns;

use Illuminate\Support\Facades\Storage;

trait HasOptimizedImages
{
    /**
     * Get the URL for an optimized image at a specific size.
     *
     * @param  string  $path  The stored path relative to the public disk (e.g. "uploads/hero-image.jpg")
     * @param  string  $size  The size variant: 'thumb', 'medium', or 'large'
     * @return string  The public URL to the optimized WebP image
     */
    public function getOptimizedImageUrl(string $path, string $size): string
    {
        $pathInfo = pathinfo($path);
        $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];

        return Storage::disk('public')->url("{$basePath}-{$size}.webp");
    }

    /**
     * Get URLs for all optimized image sizes.
     *
     * @param  string  $path  The stored path relative to the public disk
     * @return array{thumb: string, medium: string, large: string}
     */
    public function getOptimizedImageUrls(string $path): array
    {
        return [
            'thumb' => $this->getOptimizedImageUrl($path, 'thumb'),
            'medium' => $this->getOptimizedImageUrl($path, 'medium'),
            'large' => $this->getOptimizedImageUrl($path, 'large'),
            'xlarge' => $this->getOptimizedImageUrl($path, 'xlarge'),
        ];
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
