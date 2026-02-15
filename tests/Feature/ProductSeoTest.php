<?php

/**
 * Property 15: SEO meta tags rendered on public pages
 *
 * For any public page with associated SEO data, the rendered HTML head should contain
 * a <title> tag matching the meta_title, a <meta name="description"> tag matching the
 * meta_description, and og:title and og:description meta tags matching the respective
 * SEO fields.
 *
 * Since this is an Inertia.js app, the actual HTML rendering of meta tags happens
 * client-side via the SeoHead React component. We verify that the correct SEO props
 * are passed to the Inertia page, which is the server's responsibility.
 *
 * Validates: Requirements 12.3, 12.4
 *
 * @group Feature: product-showcase
 * @group Property 15: SEO meta tags rendered on public pages
 */

use App\Models\Category;
use App\Models\Division;
use App\Models\Product;
use App\Models\SeoMetadata;
use Inertia\Testing\AssertableInertia as Assert;

const SEO_TAGS_MIN_ITERATIONS = 100;

/**
 * Generate a random non-empty string of 1-80 characters.
 */
function generateRandomSeoTagString(): string
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 éèêàâç';
    $charArray = mb_str_split($chars);
    $length = random_int(1, 80);
    $result = '';

    for ($i = 0; $i < $length; $i++) {
        $result .= $charArray[random_int(0, count($charArray) - 1)];
    }

    return $result;
}

/**
 * Generate a random fake image path.
 */
function generateRandomSeoTagImagePath(): string
{
    $extensions = ['jpg', 'png', 'webp'];
    $ext = $extensions[random_int(0, count($extensions) - 1)];
    return 'images/seo-' . random_int(1, 99999) . '.' . $ext;
}


/**
 * Property test: Division pages pass correct default SEO props (no custom SeoMetadata).
 *
 * For each iteration:
 * 1. Create a division with random name and hero_subtitle
 * 2. Request GET /division/{slug}
 * 3. Verify the Inertia seo props match: meta_title = name, meta_description = hero_subtitle
 *
 * Validates: Requirements 12.3, 12.4
 */
it('Property 15: Division pages pass correct default SEO props via Inertia', function () {
    $this->withoutVite();

    for ($i = 0; $i < SEO_TAGS_MIN_ITERATIONS; $i++) {
        $name = generateRandomSeoTagString();
        $heroSubtitle = generateRandomSeoTagString();
        $heroImage = generateRandomSeoTagImagePath();

        $division = Division::create([
            'name' => $name,
            'slug' => "seo-tag-div-{$i}",
            'hero_image' => $heroImage,
            'hero_title' => 'Hero Title',
            'hero_subtitle' => $heroSubtitle,
            'order' => $i,
            'is_active' => true,
        ]);

        $response = $this->get("/division/{$division->slug}");
        $response->assertOk();

        $response->assertInertia(function (Assert $page) use ($i, $name, $heroSubtitle, $heroImage, $division) {
            $page->component('division/show');

            $seo = $page->toArray()['props']['seo'];

            // meta_title should match the division name (default fallback)
            expect($seo['meta_title'])->toBe(
                $name,
                "Division seo.meta_title should be the division name (iteration {$i})"
            );

            // meta_description should match the hero_subtitle (default fallback)
            expect($seo['meta_description'])->toBe(
                $heroSubtitle,
                "Division seo.meta_description should be the hero_subtitle (iteration {$i})"
            );

            // canonical_url should be set
            expect($seo['canonical_url'])->toBe(
                url("/division/{$division->slug}"),
                "Division seo.canonical_url should match the division URL (iteration {$i})"
            );

            // og_image should be present (derived from hero_image)
            expect($seo['og_image'])->not->toBeNull(
                "Division seo.og_image should not be null when hero_image is set (iteration {$i})"
            );
        });

        $division->delete();
    }
})->group('Feature: product-showcase', 'Property 15: SEO meta tags rendered on public pages');

/**
 * Property test: Product detail pages pass correct default SEO props (no custom SeoMetadata).
 *
 * For each iteration:
 * 1. Create a detailed product with random name and short_description
 * 2. Request GET /product/{slug}
 * 3. Verify the Inertia seo props match: meta_title = name, meta_description = short_description
 *
 * Validates: Requirements 12.3, 12.4
 */
it('Property 15: Product detail pages pass correct default SEO props via Inertia', function () {
    $this->withoutVite();

    $division = Division::create([
        'name' => 'SEO Tag Product Division',
        'slug' => 'seo-tag-prod-div',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Title',
        'hero_subtitle' => 'Subtitle',
        'order' => 1,
        'is_active' => true,
    ]);

    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'SEO Tag Product Category',
        'slug' => 'seo-tag-prod-cat',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < SEO_TAGS_MIN_ITERATIONS; $i++) {
        $name = generateRandomSeoTagString();
        $shortDescription = generateRandomSeoTagString();
        $featuredImage = generateRandomSeoTagImagePath();

        $product = Product::create([
            'division_id' => $division->id,
            'category_id' => $category->id,
            'content_mode' => 'detailed',
            'name' => $name,
            'slug' => "seo-tag-prod-{$i}",
            'short_description' => $shortDescription,
            'description' => 'Full description for detailed product.',
            'featured_image' => $featuredImage,
            'is_active' => true,
            'order' => $i,
        ]);

        $response = $this->get("/product/{$product->slug}");
        $response->assertOk();

        $response->assertInertia(function (Assert $page) use ($i, $name, $shortDescription, $product) {
            $page->component('product/show');

            $seo = $page->toArray()['props']['seo'];

            // meta_title should match the product name (default fallback)
            expect($seo['meta_title'])->toBe(
                $name,
                "Product seo.meta_title should be the product name (iteration {$i})"
            );

            // meta_description should match the short_description (default fallback)
            expect($seo['meta_description'])->toBe(
                $shortDescription,
                "Product seo.meta_description should be the short_description (iteration {$i})"
            );

            // canonical_url should be set
            expect($seo['canonical_url'])->toBe(
                url("/product/{$product->slug}"),
                "Product seo.canonical_url should match the product URL (iteration {$i})"
            );

            // og_image should be present (derived from featured_image)
            expect($seo['og_image'])->not->toBeNull(
                "Product seo.og_image should not be null when featured_image is set (iteration {$i})"
            );
        });

        $product->delete();
    }

    $category->delete();
    $division->delete();
})->group('Feature: product-showcase', 'Property 15: SEO meta tags rendered on public pages');


/**
 * Property test: Custom SeoMetadata overrides default SEO props on division pages.
 *
 * For each iteration:
 * 1. Create a division with random name/hero_subtitle
 * 2. Create a SeoMetadata record with custom meta_title and meta_description
 * 3. Request GET /division/{slug}
 * 4. Verify the Inertia seo props use the custom SeoMetadata values, not the defaults
 *
 * Validates: Requirements 12.3, 12.4
 */
it('Property 15: Custom SeoMetadata overrides default SEO props on division pages', function () {
    $this->withoutVite();

    for ($i = 0; $i < SEO_TAGS_MIN_ITERATIONS; $i++) {
        $name = generateRandomSeoTagString();
        $heroSubtitle = generateRandomSeoTagString();
        $customTitle = generateRandomSeoTagString();
        $customDescription = generateRandomSeoTagString();
        $customOgImage = generateRandomSeoTagImagePath();

        $division = Division::create([
            'name' => $name,
            'slug' => "seo-custom-div-{$i}",
            'hero_image' => 'images/hero.jpg',
            'hero_title' => 'Hero Title',
            'hero_subtitle' => $heroSubtitle,
            'order' => $i,
            'is_active' => true,
        ]);

        // Create custom SeoMetadata for this division
        SeoMetadata::create([
            'seoable_type' => Division::class,
            'seoable_id' => $division->id,
            'meta_title' => $customTitle,
            'meta_description' => $customDescription,
            'og_image' => $customOgImage,
        ]);

        $response = $this->get("/division/{$division->slug}");
        $response->assertOk();

        $response->assertInertia(function (Assert $page) use ($i, $customTitle, $customDescription, $name, $heroSubtitle) {
            $page->component('division/show');

            $seo = $page->toArray()['props']['seo'];

            // meta_title should use the custom SeoMetadata value, NOT the division name
            expect($seo['meta_title'])->toBe(
                $customTitle,
                "Division seo.meta_title should use custom SeoMetadata value (iteration {$i})"
            );
            expect($seo['meta_title'])->not->toBe(
                $name,
                "Division seo.meta_title should NOT fall back to name when custom SeoMetadata exists (iteration {$i})"
            );

            // meta_description should use the custom SeoMetadata value, NOT the hero_subtitle
            expect($seo['meta_description'])->toBe(
                $customDescription,
                "Division seo.meta_description should use custom SeoMetadata value (iteration {$i})"
            );
        });

        // Clean up
        SeoMetadata::where('seoable_type', Division::class)
            ->where('seoable_id', $division->id)
            ->delete();
        $division->delete();
    }
})->group('Feature: product-showcase', 'Property 15: SEO meta tags rendered on public pages');

/**
 * Property test: Custom SeoMetadata overrides default SEO props on product detail pages.
 *
 * For each iteration:
 * 1. Create a detailed product with random name/short_description
 * 2. Create a SeoMetadata record with custom meta_title and meta_description
 * 3. Request GET /product/{slug}
 * 4. Verify the Inertia seo props use the custom SeoMetadata values, not the defaults
 *
 * Validates: Requirements 12.3, 12.4
 */
it('Property 15: Custom SeoMetadata overrides default SEO props on product detail pages', function () {
    $this->withoutVite();

    $division = Division::create([
        'name' => 'SEO Custom Product Division',
        'slug' => 'seo-custom-prod-div',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Title',
        'hero_subtitle' => 'Subtitle',
        'order' => 1,
        'is_active' => true,
    ]);

    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'SEO Custom Product Category',
        'slug' => 'seo-custom-prod-cat',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < SEO_TAGS_MIN_ITERATIONS; $i++) {
        $name = generateRandomSeoTagString();
        $shortDescription = generateRandomSeoTagString();
        $customTitle = generateRandomSeoTagString();
        $customDescription = generateRandomSeoTagString();
        $customOgImage = generateRandomSeoTagImagePath();

        $product = Product::create([
            'division_id' => $division->id,
            'category_id' => $category->id,
            'content_mode' => 'detailed',
            'name' => $name,
            'slug' => "seo-custom-prod-{$i}",
            'short_description' => $shortDescription,
            'description' => 'Full description for detailed product.',
            'featured_image' => 'images/product.jpg',
            'is_active' => true,
            'order' => $i,
        ]);

        // Create custom SeoMetadata for this product
        SeoMetadata::create([
            'seoable_type' => Product::class,
            'seoable_id' => $product->id,
            'meta_title' => $customTitle,
            'meta_description' => $customDescription,
            'og_image' => $customOgImage,
        ]);

        $response = $this->get("/product/{$product->slug}");
        $response->assertOk();

        $response->assertInertia(function (Assert $page) use ($i, $customTitle, $customDescription, $name, $shortDescription) {
            $page->component('product/show');

            $seo = $page->toArray()['props']['seo'];

            // meta_title should use the custom SeoMetadata value, NOT the product name
            expect($seo['meta_title'])->toBe(
                $customTitle,
                "Product seo.meta_title should use custom SeoMetadata value (iteration {$i})"
            );

            // meta_description should use the custom SeoMetadata value, NOT the short_description
            expect($seo['meta_description'])->toBe(
                $customDescription,
                "Product seo.meta_description should use custom SeoMetadata value (iteration {$i})"
            );
        });

        // Clean up
        SeoMetadata::where('seoable_type', Product::class)
            ->where('seoable_id', $product->id)
            ->delete();
        $product->delete();
    }

    $category->delete();
    $division->delete();
})->group('Feature: product-showcase', 'Property 15: SEO meta tags rendered on public pages');
