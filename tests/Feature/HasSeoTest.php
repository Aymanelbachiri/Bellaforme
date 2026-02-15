<?php

use App\Models\Category;
use App\Models\Division;
use App\Models\Product;
use App\Models\SeoMetadata;

beforeEach(function () {
    $this->division = Division::create([
        'name' => 'Esthétique & Médical',
        'hero_image' => 'images/hero-esthetique.jpg',
        'hero_title' => 'Hero Title',
        'hero_subtitle' => 'Discover our aesthetic solutions',
        'order' => 1,
        'is_active' => true,
    ]);

    $this->category = Category::create([
        'division_id' => $this->division->id,
        'name' => 'Appareils Diagnostique',
        'image' => 'images/cat-diagnostic.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    $this->product = Product::create([
        'division_id' => $this->division->id,
        'category_id' => $this->category->id,
        'content_mode' => 'detailed',
        'name' => 'Appareil Haute Fréquence',
        'short_description' => 'High frequency device for skin care',
        'featured_image' => 'images/product-hf.jpg',
        'is_active' => true,
        'order' => 1,
    ]);
});

// --- seo() morphOne relationship ---

it('provides a seo morphOne relationship on Division', function () {
    $seo = $this->division->seo()->create([
        'meta_title' => 'Custom Division Title',
        'meta_description' => 'Custom division description',
        'og_image' => 'images/og-division.jpg',
    ]);

    expect($this->division->seo)->toBeInstanceOf(SeoMetadata::class);
    expect($seo->seoable_type)->toBe(Division::class);
    expect($seo->seoable_id)->toBe($this->division->id);
});

it('provides a seo morphOne relationship on Category', function () {
    $seo = $this->category->seo()->create([
        'meta_title' => 'Custom Category Title',
    ]);

    expect($this->category->seo)->toBeInstanceOf(SeoMetadata::class);
    expect($seo->seoable_type)->toBe(Category::class);
    expect($seo->seoable_id)->toBe($this->category->id);
});

it('provides a seo morphOne relationship on Product', function () {
    $seo = $this->product->seo()->create([
        'meta_title' => 'Custom Product Title',
    ]);

    expect($this->product->seo)->toBeInstanceOf(SeoMetadata::class);
    expect($seo->seoable_type)->toBe(Product::class);
    expect($seo->seoable_id)->toBe($this->product->id);
});

// --- getSeoData() with explicit SEO metadata ---

it('returns explicit SEO metadata when set on Division', function () {
    $this->division->seo()->create([
        'meta_title' => 'Custom Title',
        'meta_description' => 'Custom Description',
        'og_image' => 'images/custom-og.jpg',
    ]);

    $this->division->refresh();
    $seoData = $this->division->getSeoData();

    expect($seoData['meta_title'])->toBe('Custom Title');
    expect($seoData['meta_description'])->toBe('Custom Description');
    expect($seoData['og_image'])->toBe('images/custom-og.jpg');
});

it('returns explicit SEO metadata when set on Product', function () {
    $this->product->seo()->create([
        'meta_title' => 'Product SEO Title',
        'meta_description' => 'Product SEO Desc',
        'og_image' => 'images/product-og.jpg',
    ]);

    $this->product->refresh();
    $seoData = $this->product->getSeoData();

    expect($seoData['meta_title'])->toBe('Product SEO Title');
    expect($seoData['meta_description'])->toBe('Product SEO Desc');
    expect($seoData['og_image'])->toBe('images/product-og.jpg');
});

// --- getSeoData() fallback defaults ---

it('falls back to name for meta_title on Division when SEO is empty', function () {
    $seoData = $this->division->getSeoData();

    expect($seoData['meta_title'])->toBe('Esthétique & Médical');
});

it('falls back to hero_subtitle for meta_description on Division', function () {
    $seoData = $this->division->getSeoData();

    expect($seoData['meta_description'])->toBe('Discover our aesthetic solutions');
});

it('falls back to hero_image for og_image on Division', function () {
    $seoData = $this->division->getSeoData();

    expect($seoData['og_image'])->toBe('images/hero-esthetique.jpg');
});

it('falls back to name for meta_title on Category when SEO is empty', function () {
    $seoData = $this->category->getSeoData();

    expect($seoData['meta_title'])->toBe('Appareils Diagnostique');
});

it('falls back to empty string for meta_description on Category (no short_description or hero_subtitle)', function () {
    $seoData = $this->category->getSeoData();

    expect($seoData['meta_description'])->toBe('');
});

it('falls back to null for og_image on Category (no featured_image or hero_image)', function () {
    $seoData = $this->category->getSeoData();

    expect($seoData['og_image'])->toBeNull();
});

it('falls back to name for meta_title on Product when SEO is empty', function () {
    $seoData = $this->product->getSeoData();

    expect($seoData['meta_title'])->toBe('Appareil Haute Fréquence');
});

it('falls back to short_description for meta_description on Product', function () {
    $seoData = $this->product->getSeoData();

    expect($seoData['meta_description'])->toBe('High frequency device for skin care');
});

it('falls back to featured_image for og_image on Product', function () {
    $seoData = $this->product->getSeoData();

    expect($seoData['og_image'])->toBe('images/product-hf.jpg');
});

// --- Partial SEO metadata (some fields set, others fallback) ---

it('uses explicit meta_title but falls back for meta_description and og_image', function () {
    $this->product->seo()->create([
        'meta_title' => 'Only Title Set',
        'meta_description' => null,
        'og_image' => null,
    ]);

    $this->product->refresh();
    $seoData = $this->product->getSeoData();

    expect($seoData['meta_title'])->toBe('Only Title Set');
    expect($seoData['meta_description'])->toBe('High frequency device for skin care');
    expect($seoData['og_image'])->toBe('images/product-hf.jpg');
});

it('returns correct array keys from getSeoData', function () {
    $seoData = $this->division->getSeoData();

    expect($seoData)->toHaveKeys(['meta_title', 'meta_description', 'og_image']);
});
