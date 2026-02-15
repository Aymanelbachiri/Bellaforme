<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Division;
use App\Models\Product;

it('auto-generates slug from name when slug is empty on Division', function () {
    $division = Division::create([
        'name' => 'Esthétique & Médical',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Title',
        'hero_subtitle' => 'Subtitle',
        'order' => 1,
        'is_active' => true,
    ]);

    expect($division->slug)->toBe('esthetique-medical');
});

it('does not overwrite an explicitly provided slug on Division', function () {
    $division = Division::create([
        'name' => 'Sport & Fitness',
        'slug' => 'custom-slug',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Title',
        'hero_subtitle' => 'Subtitle',
        'order' => 1,
        'is_active' => true,
    ]);

    expect($division->slug)->toBe('custom-slug');
});

it('auto-generates slug from name when slug is empty on Category', function () {
    $division = Division::create([
        'name' => 'Test Division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Title',
        'hero_subtitle' => 'Subtitle',
        'order' => 1,
        'is_active' => true,
    ]);

    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'Appareils Diagnostique',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    expect($category->slug)->toBe('appareils-diagnostique');
});

it('auto-generates slug from name when slug is empty on Brand', function () {
    $brand = Brand::create([
        'name' => 'Bella Forme Pro',
        'logo' => 'images/logo.png',
        'order' => 1,
        'is_active' => true,
    ]);

    expect($brand->slug)->toBe('bella-forme-pro');
});

it('auto-generates slug from name when slug is empty on Product', function () {
    $division = Division::create([
        'name' => 'Division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Title',
        'hero_subtitle' => 'Subtitle',
        'order' => 1,
        'is_active' => true,
    ]);

    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'Category',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    $product = Product::create([
        'division_id' => $division->id,
        'category_id' => $category->id,
        'content_mode' => 'detailed',
        'name' => 'Appareil Haute Fréquence',
        'short_description' => 'A product',
        'featured_image' => 'images/test.jpg',
        'is_active' => true,
        'order' => 1,
    ]);

    expect($product->slug)->toBe('appareil-haute-frequence');
});
