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

it('returns the correct optimized URL for thumb size', function () {
    $model = createModelWithOptimizedImages();

    $url = $model->getOptimizedImageUrl('uploads/hero-image.jpg', 'thumb');

    expect($url)->toEndWith('/storage/uploads/hero-image-thumb.webp');
});

it('returns the correct optimized URL for medium size', function () {
    $model = createModelWithOptimizedImages();

    $url = $model->getOptimizedImageUrl('uploads/hero-image.jpg', 'medium');

    expect($url)->toEndWith('/storage/uploads/hero-image-medium.webp');
});

it('returns the correct optimized URL for large size', function () {
    $model = createModelWithOptimizedImages();

    $url = $model->getOptimizedImageUrl('uploads/hero-image.jpg', 'large');

    expect($url)->toEndWith('/storage/uploads/hero-image-large.webp');
});

it('returns all three optimized URLs from getOptimizedImageUrls', function () {
    $model = createModelWithOptimizedImages();

    $urls = $model->getOptimizedImageUrls('uploads/product-photo.png');

    expect($urls)->toHaveKeys(['thumb', 'medium', 'large']);
    expect($urls['thumb'])->toEndWith('/storage/uploads/product-photo-thumb.webp');
    expect($urls['medium'])->toEndWith('/storage/uploads/product-photo-medium.webp');
    expect($urls['large'])->toEndWith('/storage/uploads/product-photo-large.webp');
});

it('returns the original image URL from getImageUrl', function () {
    $model = createModelWithOptimizedImages();

    $url = $model->getImageUrl('uploads/hero-image.jpg');

    expect($url)->toEndWith('/storage/uploads/hero-image.jpg');
});

it('handles nested directory paths correctly', function () {
    $model = createModelWithOptimizedImages();

    $url = $model->getOptimizedImageUrl('products/gallery/photo.jpg', 'medium');

    expect($url)->toEndWith('/storage/products/gallery/photo-medium.webp');
});

it('handles filenames with hyphens correctly', function () {
    $model = createModelWithOptimizedImages();

    $url = $model->getOptimizedImageUrl('uploads/my-great-photo.png', 'thumb');

    expect($url)->toEndWith('/storage/uploads/my-great-photo-thumb.webp');
});
