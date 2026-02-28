<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class ImageOptimizer
{
    /**
     * Store the original file and generate an AVIF version (no rescaling).
     *
     * @param  UploadedFile  $file  The uploaded image file
     * @param  string  $directory  The directory on the public disk to store files in
     * @return string  The path to the original file (relative to public disk)
     */
    public function optimize(UploadedFile $file, string $directory): string
    {
        $originalPath = $file->store($directory, 'public');

        $pathInfo = pathinfo($originalPath);
        $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];

        $fullDiskPath = Storage::disk('public')->path($originalPath);

        $image = Image::read($fullDiskPath);
        $avifPath = "{$basePath}.avif";
        $avifFullPath = Storage::disk('public')->path($avifPath);
        $image->toAvif(quality: 75)->save($avifFullPath);

        return $originalPath;
    }

    /**
     * Delete the original file and its AVIF version.
     *
     * @param  string  $path  The path to the original file (relative to public disk)
     */
    public function delete(string $path): void
    {
        $disk = Storage::disk('public');

        $disk->delete($path);

        $pathInfo = pathinfo($path);
        $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];
        $disk->delete("{$basePath}.avif");
    }
}
