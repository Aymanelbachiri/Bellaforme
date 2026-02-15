<?php

/**
 * Property 14: SEO metadata fallback defaults
 *
 * For any entity (Division, Category, or Product) that has empty SEO metadata fields,
 * the getSeoData() method should return non-empty default values: meta_title derived
 * from the entity name, meta_description derived from the entity short_description or
 * hero_subtitle, and og_image derived from the entity featured_image or hero_image.
 *
 * Validates: Requirements 12.6
 *
 * @group Feature: product-showcase
 * @group Property 14: SEO metadata fallback defaults
 */

use App\Models\Category;
use App\Models\Division;
use App\Models\Product;

const SEO_MIN_ITERATIONS = 100;

/**
 * Generate a random non-empty string of 1-100 characters using letters, numbers,
 * spaces, and accented characters.
 */
function generateRandomSeoString(): string
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 éèêëàâçùûüôîï';
    $charArray = mb_str_split($chars);
    $length = random_int(1, 100);
    $result = '';

    for ($i = 0; $i < $length; $i++) {
        $result .= $charArray[random_int(0, count($charArray) - 1)];
    }

    return $result;
}

/**
 * Generate a random fake image path.
 */
function generateRandomImagePath(): string
{
    $dirs = ['images', 'uploads', 'media', 'storage'];
    $extensions = ['jpg', 'png', 'webp'];
    $dir = $dirs[random_int(0, count($dirs) - 1)];
    $ext = $extensions[random_int(0, count($extensions) - 1)];
    $filename = 'img-' . random_int(1, 99999);

    return "{$dir}/{$filename}.{$ext}";
}

/**
 * Property test: Division without SeoMetadata record falls back correctly.
 *
 * For any Division with random name, hero_subtitle, and hero_image:
 *   - meta_title = name
 *   - meta_description = hero_subtitle
 *   - og_image = hero_image
 *   - meta_title is always non-empty (since name is always non-empty)
 *
 * Validates: Requirements 12.6
 */
it('Property 14: Division getSeoData() returns fallback defaults from entity fields across random inputs', function () {
    for ($i = 0; $i < SEO_MIN_ITERATIONS; $i++) {
        $name = generateRandomSeoString();
        $heroSubtitle = generateRandomSeoString();
        $heroImage = generateRandomImagePath();

        $division = Division::create([
            'name' => $name,
            'slug' => "seo-div-{$i}",
            'hero_image' => $heroImage,
            'hero_title' => 'Test Title',
            'hero_subtitle' => $heroSubtitle,
            'order' => 1,
            'is_active' => true,
        ]);

        // No SeoMetadata record created — should use fallbacks
        $seoData = $division->getSeoData();

        // meta_title falls back to name
        expect($seoData['meta_title'])->toBe(
            $name,
            "Division meta_title should fall back to name (iteration {$i})"
        );

        // meta_title is non-empty since name is always non-empty
        expect($seoData['meta_title'])->not->toBeEmpty(
            "Division meta_title should be non-empty (iteration {$i})"
        );

        // meta_description falls back to hero_subtitle
        expect($seoData['meta_description'])->toBe(
            $heroSubtitle,
            "Division meta_description should fall back to hero_subtitle (iteration {$i})"
        );

        // og_image falls back to hero_image
        expect($seoData['og_image'])->toBe(
            $heroImage,
            "Division og_image should fall back to hero_image (iteration {$i})"
        );

        // Verify array structure
        expect($seoData)->toHaveKeys(['meta_title', 'meta_description', 'og_image']);

        $division->delete();
    }
})->group('Feature: product-showcase', 'Property 14: SEO metadata fallback defaults');

/**
 * Property test: Category without SeoMetadata record falls back correctly.
 *
 * Category has no short_description, hero_subtitle, featured_image, or hero_image fields.
 * So:
 *   - meta_title = name
 *   - meta_description = '' (empty string, no fallback source)
 *   - og_image = null (no fallback source)
 *
 * Validates: Requirements 12.6
 */
it('Property 14: Category getSeoData() returns fallback defaults (empty description, null og_image) across random inputs', function () {
    $parentDivision = Division::create([
        'name' => 'Parent Division for SEO Cat Test',
        'slug' => 'seo-parent-div-cat',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Title',
        'hero_subtitle' => 'Subtitle',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < SEO_MIN_ITERATIONS; $i++) {
        $name = generateRandomSeoString();

        $category = Category::create([
            'division_id' => $parentDivision->id,
            'name' => $name,
            'slug' => "seo-cat-{$i}",
            'image' => 'images/cat.jpg',
            'order' => 1,
            'is_active' => true,
        ]);

        // No SeoMetadata record created — should use fallbacks
        $seoData = $category->getSeoData();

        // meta_title falls back to name
        expect($seoData['meta_title'])->toBe(
            $name,
            "Category meta_title should fall back to name (iteration {$i})"
        );

        // meta_title is non-empty
        expect($seoData['meta_title'])->not->toBeEmpty(
            "Category meta_title should be non-empty (iteration {$i})"
        );

        // meta_description is empty string (Category has no short_description or hero_subtitle)
        expect($seoData['meta_description'])->toBe(
            '',
            "Category meta_description should be empty string (iteration {$i})"
        );

        // og_image is null (Category has no featured_image or hero_image)
        expect($seoData['og_image'])->toBeNull(
            "Category og_image should be null (iteration {$i})"
        );

        $category->delete();
    }
})->group('Feature: product-showcase', 'Property 14: SEO metadata fallback defaults');

/**
 * Property test: Product without SeoMetadata record falls back correctly.
 *
 * For any Product with random name, short_description, and featured_image:
 *   - meta_title = name
 *   - meta_description = short_description
 *   - og_image = featured_image
 *
 * Validates: Requirements 12.6
 */
it('Property 14: Product getSeoData() returns fallback defaults from entity fields across random inputs', function () {
    $parentDivision = Division::create([
        'name' => 'Parent Division for SEO Prod Test',
        'slug' => 'seo-parent-div-prod',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Title',
        'hero_subtitle' => 'Subtitle',
        'order' => 1,
        'is_active' => true,
    ]);

    $parentCategory = Category::create([
        'division_id' => $parentDivision->id,
        'name' => 'Parent Category for SEO Prod Test',
        'slug' => 'seo-parent-cat-prod',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < SEO_MIN_ITERATIONS; $i++) {
        $name = generateRandomSeoString();
        $shortDescription = generateRandomSeoString();
        $featuredImage = generateRandomImagePath();

        $product = Product::create([
            'division_id' => $parentDivision->id,
            'category_id' => $parentCategory->id,
            'content_mode' => 'detailed',
            'name' => $name,
            'slug' => "seo-prod-{$i}",
            'short_description' => $shortDescription,
            'featured_image' => $featuredImage,
            'is_active' => true,
            'order' => 1,
        ]);

        // No SeoMetadata record created — should use fallbacks
        $seoData = $product->getSeoData();

        // meta_title falls back to name
        expect($seoData['meta_title'])->toBe(
            $name,
            "Product meta_title should fall back to name (iteration {$i})"
        );

        // meta_title is non-empty
        expect($seoData['meta_title'])->not->toBeEmpty(
            "Product meta_title should be non-empty (iteration {$i})"
        );

        // meta_description falls back to short_description
        expect($seoData['meta_description'])->toBe(
            $shortDescription,
            "Product meta_description should fall back to short_description (iteration {$i})"
        );

        // og_image falls back to featured_image
        expect($seoData['og_image'])->toBe(
            $featuredImage,
            "Product og_image should fall back to featured_image (iteration {$i})"
        );

        // Verify array structure
        expect($seoData)->toHaveKeys(['meta_title', 'meta_description', 'og_image']);

        $product->delete();
    }
})->group('Feature: product-showcase', 'Property 14: SEO metadata fallback defaults');
