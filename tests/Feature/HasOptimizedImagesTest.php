<?php

use App\Concerns\HasOptimizedImages;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

function createModelWithOptimizedImages(): Model
{
    return new class extends Model
    {
        use HasOptimizedImages;
    };
}

it('returns the correct AVIF URL', function () {
    $model = createModelWithOptimizedImages();

    $url = $model->getOptimizedImageUrl('uploads/hero-image.jpg');

    expect($url)->toEndWith('/storage/uploads/hero-image.avif');
});

it('returns the original image URL from getImageUrl', function () {
    $model = createModelWithOptimizedImages();

    $url = $model->getImageUrl('uploads/hero-image.jpg');

    expect($url)->toEndWith('/storage/uploads/hero-image.jpg');
});

it('handles nested directory paths correctly', function () {
    $model = createModelWithOptimizedImages();

    $url = $model->getOptimizedImageUrl('products/gallery/photo.jpg');

    expect($url)->toEndWith('/storage/products/gallery/photo.avif');
});

it('handles filenames with hyphens correctly', function () {
    $model = createModelWithOptimizedImages();

    $url = $model->getOptimizedImageUrl('uploads/my-great-photo.png');

    expect($url)->toEndWith('/storage/uploads/my-great-photo.avif');
});
