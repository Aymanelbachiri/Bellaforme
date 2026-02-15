<?php

/**
 * Property 6: Brochure_only products return 404 on detail endpoint
 *
 * For any product with content_mode "brochure_only", requesting GET /api/product/{slug}
 * should return a 404 HTTP response.
 *
 * Validates: Requirements 7.3, 10.4
 *
 * @group Feature: product-showcase
 * @group Property 6: Brochure_only products return 404 on detail endpoint
 */

use App\Models\Category;
use App\Models\Division;
use App\Models\Product;
use Illuminate\Support\Str;

const PROPERTY6_ITERATIONS = 100;

/**
 * Generate a random non-empty string for text fields.
 */
function p6RandomText(int $minLen = 3, int $maxLen = 80): string
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $length = random_int($minLen, $maxLen);
    $result = '';
    for ($i = 0; $i < $length; $i++) {
        $result .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $result;
}

/**
 * Generate a unique slug for a product.
 */
function p6RandomSlug(): string
{
    return 'p6-' . Str::random(12) . '-' . random_int(1, 99999);
}

/**
 * Property 6: Any brochure_only product should return 404 on GET /api/product/{slug}.
 *
 * For each iteration, create a brochure_only product with random data directly in the
 * database, then request the detail endpoint and assert a 404 response.
 *
 * Validates: Requirements 7.3, 10.4
 */
it('Property 6: brochure_only products return 404 on detail endpoint', function () {
    $division = Division::create([
        'name' => 'P6 Division',
        'slug' => 'p6-division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'P6 Category',
        'slug' => 'p6-category',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < PROPERTY6_ITERATIONS; $i++) {
        $slug = p6RandomSlug();

        $product = Product::create([
            'division_id' => $division->id,
            'category_id' => $category->id,
            'content_mode' => 'brochure_only',
            'name' => p6RandomText(3, 60),
            'slug' => $slug,
            'short_description' => p6RandomText(10, 200),
            'featured_image' => 'images/product-' . Str::random(6) . '.jpg',
            'brochure_file' => 'brochures/brochure-' . Str::random(6) . '.pdf',
            'is_active' => (bool) random_int(0, 1),
            'order' => random_int(0, 100),
        ]);

        $response = $this->getJson("/api/product/{$slug}");

        $response->assertStatus(404);
    }
})->group('Feature: product-showcase', 'Property 6: Brochure_only products return 404 on detail endpoint');

/**
 * Sanity check: A detailed product should return 200 on GET /api/product/{slug}.
 *
 * This contrast test verifies that the endpoint works correctly for detailed products,
 * confirming the 404 for brochure_only is due to content_mode filtering, not a broken endpoint.
 *
 * Validates: Requirements 7.3, 10.4
 */
it('Property 6: detailed products return 200 on detail endpoint (sanity check)', function () {
    $division = Division::create([
        'name' => 'P6 Sanity Division',
        'slug' => 'p6-sanity-division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'P6 Sanity Category',
        'slug' => 'p6-sanity-category',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < PROPERTY6_ITERATIONS; $i++) {
        $slug = p6RandomSlug();

        Product::create([
            'division_id' => $division->id,
            'category_id' => $category->id,
            'content_mode' => 'detailed',
            'name' => p6RandomText(3, 60),
            'slug' => $slug,
            'short_description' => p6RandomText(10, 200),
            'description' => p6RandomText(20, 300),
            'featured_image' => 'images/product-' . Str::random(6) . '.jpg',
            'is_active' => true,
            'order' => random_int(0, 100),
        ]);

        $response = $this->getJson("/api/product/{$slug}");

        $response->assertStatus(200);
    }
})->group('Feature: product-showcase', 'Property 6: Brochure_only products return 404 on detail endpoint');


/**
 * Property 8: Product listing with category and brand filters
 *
 * For any category and optional brand filter, the GET /api/products endpoint should return
 * only active products belonging to that category (and matching the brand if specified),
 * and every returned product should include the fields: id, name, slug, content_mode,
 * featured_image, short_description, and brochure_file.
 *
 * Validates: Requirements 6.6, 10.1, 10.2
 *
 * @group Feature: product-showcase
 * @group Property 8: Product listing with category and brand filters
 */

use App\Models\Brand;

const PROPERTY8_ITERATIONS = 100;
const PROPERTY8_REQUIRED_FIELDS = ['id', 'name', 'slug', 'content_mode', 'featured_image', 'short_description', 'brochure_file'];

/**
 * Generate a unique slug for Property 8 entities.
 */
function p8RandomSlug(string $prefix = 'p8'): string
{
    return $prefix . '-' . Str::random(10) . '-' . random_int(1, 99999);
}

/**
 * Property 8: Category filter returns only active products in that category with required fields.
 *
 * For each iteration:
 * 1. Create random divisions, categories, brands, and products (mix of active/inactive, different categories)
 * 2. Query GET /api/products?category={slug} and verify only active products in that category are returned
 * 3. Verify every returned product has the required fields
 *
 * Validates: Requirements 6.6, 10.1, 10.2
 */
it('Property 8: category filter returns only active products in that category with required fields', function () {
    for ($i = 0; $i < PROPERTY8_ITERATIONS; $i++) {
        // Create a division
        $division = Division::create([
            'name' => 'P8 Div ' . $i,
            'slug' => p8RandomSlug('p8div'),
            'hero_image' => 'images/hero.jpg',
            'hero_title' => 'Hero',
            'hero_subtitle' => 'Sub',
            'order' => 1,
            'is_active' => true,
        ]);

        // Create 2 categories
        $targetCategory = Category::create([
            'division_id' => $division->id,
            'name' => 'P8 Target Cat ' . $i,
            'slug' => p8RandomSlug('p8cat-target'),
            'image' => 'images/cat.jpg',
            'order' => 1,
            'is_active' => true,
        ]);
        $otherCategory = Category::create([
            'division_id' => $division->id,
            'name' => 'P8 Other Cat ' . $i,
            'slug' => p8RandomSlug('p8cat-other'),
            'image' => 'images/cat.jpg',
            'order' => 2,
            'is_active' => true,
        ]);

        // Create a brand
        $brand = Brand::create([
            'name' => 'P8 Brand ' . $i,
            'slug' => p8RandomSlug('p8brand'),
            'logo' => 'images/logo.png',
            'is_partner' => false,
            'is_reference' => false,
            'order' => 1,
            'is_active' => true,
        ]);

        // Randomly decide how many products per category (1-3)
        $numTargetActive = random_int(1, 3);
        $numTargetInactive = random_int(0, 2);
        $numOtherActive = random_int(0, 2);

        $expectedSlugs = [];

        // Create active products in target category
        for ($j = 0; $j < $numTargetActive; $j++) {
            $slug = p8RandomSlug('p8prod');
            $contentMode = random_int(0, 1) ? 'detailed' : 'brochure_only';
            Product::create([
                'division_id' => $division->id,
                'category_id' => $targetCategory->id,
                'brand_id' => $brand->id,
                'content_mode' => $contentMode,
                'name' => p6RandomText(3, 40),
                'slug' => $slug,
                'short_description' => p6RandomText(10, 100),
                'description' => $contentMode === 'detailed' ? p6RandomText(20, 200) : null,
                'featured_image' => 'images/prod-' . Str::random(6) . '.jpg',
                'brochure_file' => $contentMode === 'brochure_only' ? 'brochures/b-' . Str::random(6) . '.pdf' : null,
                'is_active' => true,
                'order' => random_int(0, 100),
            ]);
            $expectedSlugs[] = $slug;
        }

        // Create inactive products in target category (should NOT appear)
        for ($j = 0; $j < $numTargetInactive; $j++) {
            $contentMode = random_int(0, 1) ? 'detailed' : 'brochure_only';
            Product::create([
                'division_id' => $division->id,
                'category_id' => $targetCategory->id,
                'brand_id' => $brand->id,
                'content_mode' => $contentMode,
                'name' => p6RandomText(3, 40),
                'slug' => p8RandomSlug('p8prod-inactive'),
                'short_description' => p6RandomText(10, 100),
                'description' => $contentMode === 'detailed' ? p6RandomText(20, 200) : null,
                'featured_image' => 'images/prod-' . Str::random(6) . '.jpg',
                'brochure_file' => $contentMode === 'brochure_only' ? 'brochures/b-' . Str::random(6) . '.pdf' : null,
                'is_active' => false,
                'order' => random_int(0, 100),
            ]);
        }

        // Create active products in OTHER category (should NOT appear)
        for ($j = 0; $j < $numOtherActive; $j++) {
            $contentMode = random_int(0, 1) ? 'detailed' : 'brochure_only';
            Product::create([
                'division_id' => $division->id,
                'category_id' => $otherCategory->id,
                'brand_id' => $brand->id,
                'content_mode' => $contentMode,
                'name' => p6RandomText(3, 40),
                'slug' => p8RandomSlug('p8prod-other'),
                'short_description' => p6RandomText(10, 100),
                'description' => $contentMode === 'detailed' ? p6RandomText(20, 200) : null,
                'featured_image' => 'images/prod-' . Str::random(6) . '.jpg',
                'brochure_file' => $contentMode === 'brochure_only' ? 'brochures/b-' . Str::random(6) . '.pdf' : null,
                'is_active' => true,
                'order' => random_int(0, 100),
            ]);
        }

        // Query with category filter
        $response = $this->getJson('/api/products?category=' . $targetCategory->slug);
        $response->assertStatus(200);

        $data = $response->json();

        // All returned products should be active and in the target category
        $returnedSlugs = array_column($data, 'slug');
        sort($expectedSlugs);
        sort($returnedSlugs);
        expect($returnedSlugs)->toBe($expectedSlugs);

        // Every returned product must have the required fields
        foreach ($data as $product) {
            foreach (PROPERTY8_REQUIRED_FIELDS as $field) {
                expect($product)->toHaveKey($field);
            }
        }

        // Clean up for next iteration
        Product::where('division_id', $division->id)->delete();
        $targetCategory->delete();
        $otherCategory->delete();
        $brand->delete();
        $division->delete();
    }
})->group('Feature: product-showcase', 'Property 8: Product listing with category and brand filters');

/**
 * Property 8: Category + brand filter returns only active products matching both filters.
 *
 * For each iteration:
 * 1. Create divisions, categories, multiple brands, and products with varied brand assignments
 * 2. Query GET /api/products?category={slug}&brand={slug} and verify only active products
 *    matching both the category and brand are returned
 * 3. Verify every returned product has the required fields
 *
 * Validates: Requirements 6.6, 10.1, 10.2
 */
it('Property 8: category + brand filter returns only active products matching both', function () {
    for ($i = 0; $i < PROPERTY8_ITERATIONS; $i++) {
        $division = Division::create([
            'name' => 'P8B Div ' . $i,
            'slug' => p8RandomSlug('p8bdiv'),
            'hero_image' => 'images/hero.jpg',
            'hero_title' => 'Hero',
            'hero_subtitle' => 'Sub',
            'order' => 1,
            'is_active' => true,
        ]);

        $category = Category::create([
            'division_id' => $division->id,
            'name' => 'P8B Cat ' . $i,
            'slug' => p8RandomSlug('p8bcat'),
            'image' => 'images/cat.jpg',
            'order' => 1,
            'is_active' => true,
        ]);

        // Create 2 brands
        $targetBrand = Brand::create([
            'name' => 'P8B Target Brand ' . $i,
            'slug' => p8RandomSlug('p8bbrand-target'),
            'logo' => 'images/logo.png',
            'is_partner' => false,
            'is_reference' => false,
            'order' => 1,
            'is_active' => true,
        ]);
        $otherBrand = Brand::create([
            'name' => 'P8B Other Brand ' . $i,
            'slug' => p8RandomSlug('p8bbrand-other'),
            'logo' => 'images/logo.png',
            'is_partner' => false,
            'is_reference' => false,
            'order' => 2,
            'is_active' => true,
        ]);

        $numTargetBrandActive = random_int(1, 3);
        $numTargetBrandInactive = random_int(0, 2);
        $numOtherBrandActive = random_int(0, 2);

        $expectedSlugs = [];

        // Active products in target category + target brand (should appear)
        for ($j = 0; $j < $numTargetBrandActive; $j++) {
            $slug = p8RandomSlug('p8bprod');
            $contentMode = random_int(0, 1) ? 'detailed' : 'brochure_only';
            Product::create([
                'division_id' => $division->id,
                'category_id' => $category->id,
                'brand_id' => $targetBrand->id,
                'content_mode' => $contentMode,
                'name' => p6RandomText(3, 40),
                'slug' => $slug,
                'short_description' => p6RandomText(10, 100),
                'description' => $contentMode === 'detailed' ? p6RandomText(20, 200) : null,
                'featured_image' => 'images/prod-' . Str::random(6) . '.jpg',
                'brochure_file' => $contentMode === 'brochure_only' ? 'brochures/b-' . Str::random(6) . '.pdf' : null,
                'is_active' => true,
                'order' => random_int(0, 100),
            ]);
            $expectedSlugs[] = $slug;
        }

        // Inactive products in target category + target brand (should NOT appear)
        for ($j = 0; $j < $numTargetBrandInactive; $j++) {
            $contentMode = random_int(0, 1) ? 'detailed' : 'brochure_only';
            Product::create([
                'division_id' => $division->id,
                'category_id' => $category->id,
                'brand_id' => $targetBrand->id,
                'content_mode' => $contentMode,
                'name' => p6RandomText(3, 40),
                'slug' => p8RandomSlug('p8bprod-inactive'),
                'short_description' => p6RandomText(10, 100),
                'description' => $contentMode === 'detailed' ? p6RandomText(20, 200) : null,
                'featured_image' => 'images/prod-' . Str::random(6) . '.jpg',
                'brochure_file' => $contentMode === 'brochure_only' ? 'brochures/b-' . Str::random(6) . '.pdf' : null,
                'is_active' => false,
                'order' => random_int(0, 100),
            ]);
        }

        // Active products in target category + OTHER brand (should NOT appear)
        for ($j = 0; $j < $numOtherBrandActive; $j++) {
            $contentMode = random_int(0, 1) ? 'detailed' : 'brochure_only';
            Product::create([
                'division_id' => $division->id,
                'category_id' => $category->id,
                'brand_id' => $otherBrand->id,
                'content_mode' => $contentMode,
                'name' => p6RandomText(3, 40),
                'slug' => p8RandomSlug('p8bprod-other'),
                'short_description' => p6RandomText(10, 100),
                'description' => $contentMode === 'detailed' ? p6RandomText(20, 200) : null,
                'featured_image' => 'images/prod-' . Str::random(6) . '.jpg',
                'brochure_file' => $contentMode === 'brochure_only' ? 'brochures/b-' . Str::random(6) . '.pdf' : null,
                'is_active' => true,
                'order' => random_int(0, 100),
            ]);
        }

        // Query with category + brand filter
        $response = $this->getJson('/api/products?category=' . $category->slug . '&brand=' . $targetBrand->slug);
        $response->assertStatus(200);

        $data = $response->json();

        // All returned products should match both filters
        $returnedSlugs = array_column($data, 'slug');
        sort($expectedSlugs);
        sort($returnedSlugs);
        expect($returnedSlugs)->toBe($expectedSlugs);

        // Every returned product must have the required fields
        foreach ($data as $product) {
            foreach (PROPERTY8_REQUIRED_FIELDS as $field) {
                expect($product)->toHaveKey($field);
            }
        }

        // Clean up for next iteration
        Product::where('division_id', $division->id)->delete();
        $category->delete();
        $targetBrand->delete();
        $otherBrand->delete();
        $division->delete();
    }
})->group('Feature: product-showcase', 'Property 8: Product listing with category and brand filters');


/**
 * Property 10: API product detail returns complete data for detailed products
 *
 * For any product with content_mode "detailed", requesting GET /api/product/{slug}
 * should return a response containing: description, specifications array, gallery images
 * array, video_url, and brand information.
 *
 * Validates: Requirements 10.3
 *
 * @group Feature: product-showcase
 * @group Property 10: API product detail returns complete data for detailed products
 */

use App\Models\ProductImage;
use App\Models\ProductSpecification;

const PROPERTY10_ITERATIONS = 100;

/**
 * Generate a unique slug for Property 10 entities.
 */
function p10RandomSlug(string $prefix = 'p10'): string
{
    return $prefix . '-' . Str::random(10) . '-' . random_int(1, 99999);
}

/**
 * Property 10: Detailed products return complete data via GET /api/product/{slug}.
 *
 * For each iteration:
 * 1. Create a brand, division, category, and a detailed product with random specs, images, and video_url
 * 2. GET /api/product/{slug} and verify the response contains description, specifications, images, video_url, and brand
 *
 * Validates: Requirements 10.3
 */
it('Property 10: API product detail returns complete data for detailed products', function () {
    for ($i = 0; $i < PROPERTY10_ITERATIONS; $i++) {
        $division = Division::create([
            'name' => 'P10 Div ' . $i,
            'slug' => p10RandomSlug('p10div'),
            'hero_image' => 'images/hero.jpg',
            'hero_title' => 'Hero',
            'hero_subtitle' => 'Sub',
            'order' => 1,
            'is_active' => true,
        ]);

        $category = Category::create([
            'division_id' => $division->id,
            'name' => 'P10 Cat ' . $i,
            'slug' => p10RandomSlug('p10cat'),
            'image' => 'images/cat.jpg',
            'order' => 1,
            'is_active' => true,
        ]);

        $brand = Brand::create([
            'name' => 'P10 Brand ' . p6RandomText(3, 20),
            'slug' => p10RandomSlug('p10brand'),
            'logo' => 'images/logo-' . Str::random(4) . '.png',
            'is_partner' => (bool) random_int(0, 1),
            'is_reference' => (bool) random_int(0, 1),
            'order' => random_int(1, 50),
            'is_active' => true,
        ]);

        // Random video_url: sometimes present, sometimes null
        $videoUrl = random_int(0, 1) ? 'https://www.youtube.com/watch?v=' . Str::random(11) : null;

        $slug = p10RandomSlug('p10prod');
        $description = p6RandomText(20, 300);

        $product = Product::create([
            'division_id' => $division->id,
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'content_mode' => 'detailed',
            'name' => p6RandomText(3, 60),
            'slug' => $slug,
            'short_description' => p6RandomText(10, 100),
            'description' => $description,
            'featured_image' => 'images/prod-' . Str::random(6) . '.jpg',
            'video_url' => $videoUrl,
            'is_active' => true,
            'order' => random_int(0, 100),
        ]);

        // Create random number of specifications (1-5)
        $numSpecs = random_int(1, 5);
        for ($s = 0; $s < $numSpecs; $s++) {
            ProductSpecification::create([
                'product_id' => $product->id,
                'label' => p6RandomText(3, 30),
                'value' => p6RandomText(3, 50),
                'order' => $s + 1,
            ]);
        }

        // Create random number of gallery images (1-4)
        $numImages = random_int(1, 4);
        for ($g = 0; $g < $numImages; $g++) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => 'images/gallery-' . Str::random(8) . '.jpg',
                'order' => $g + 1,
            ]);
        }

        // Request the detail endpoint
        $response = $this->getJson("/api/product/{$slug}");
        $response->assertStatus(200);

        $data = $response->json();

        // Verify description is present and is a non-null string
        expect($data)->toHaveKey('description');
        expect($data['description'])->toBeString()->not->toBeEmpty();
        expect($data['description'])->toBe($description);

        // Verify specifications is an array with the correct count
        expect($data)->toHaveKey('specifications');
        expect($data['specifications'])->toBeArray();
        expect(count($data['specifications']))->toBe($numSpecs);

        // Verify images (gallery) is an array with the correct count
        expect($data)->toHaveKey('images');
        expect($data['images'])->toBeArray();
        expect(count($data['images']))->toBe($numImages);

        // Verify video_url is present in the response
        expect($data)->toHaveKey('video_url');
        expect($data['video_url'])->toBe($videoUrl);

        // Verify brand information is present as an object
        expect($data)->toHaveKey('brand');
        expect($data['brand'])->toBeArray();
        expect($data['brand']['id'])->toBe($brand->id);
        expect($data['brand']['name'])->toBe($brand->name);

        // Clean up for next iteration
        ProductSpecification::where('product_id', $product->id)->delete();
        ProductImage::where('product_id', $product->id)->delete();
        $product->delete();
        $category->delete();
        $brand->delete();
        $division->delete();
    }
})->group('Feature: product-showcase', 'Property 10: API product detail returns complete data for detailed products');


/**
 * Property 11: Product JSON serialization round-trip
 *
 * For any valid Product object, serializing it to JSON via the API and then deserializing
 * the JSON response should produce an object with equivalent field values for all product
 * attributes.
 *
 * Validates: Requirements 10.5
 *
 * @group Feature: product-showcase
 * @group Property 11: Product JSON serialization round-trip
 */

const PROPERTY11_ITERATIONS = 100;

/**
 * Generate a unique slug for Property 11 entities.
 */
function p11RandomSlug(string $prefix = 'p11'): string
{
    return $prefix . '-' . Str::random(10) . '-' . random_int(1, 99999);
}

/**
 * Property 11: JSON round-trip preserves all product attributes.
 *
 * For each iteration:
 * 1. Create a detailed product with random data, brand, specs, and images
 * 2. GET /api/product/{slug} to get the JSON response
 * 3. Verify the deserialized JSON matches the original model attributes
 *
 * Validates: Requirements 10.5
 */
it('Property 11: Product JSON serialization round-trip preserves all attributes', function () {
    for ($i = 0; $i < PROPERTY11_ITERATIONS; $i++) {
        $division = Division::create([
            'name' => 'P11 Div ' . $i,
            'slug' => p11RandomSlug('p11div'),
            'hero_image' => 'images/hero.jpg',
            'hero_title' => 'Hero',
            'hero_subtitle' => 'Sub',
            'order' => 1,
            'is_active' => true,
        ]);

        $category = Category::create([
            'division_id' => $division->id,
            'name' => 'P11 Cat ' . $i,
            'slug' => p11RandomSlug('p11cat'),
            'image' => 'images/cat.jpg',
            'order' => 1,
            'is_active' => true,
        ]);

        $brand = Brand::create([
            'name' => 'P11 Brand ' . p6RandomText(3, 20),
            'slug' => p11RandomSlug('p11brand'),
            'logo' => 'images/logo-' . Str::random(4) . '.png',
            'is_partner' => (bool) random_int(0, 1),
            'is_reference' => (bool) random_int(0, 1),
            'order' => random_int(1, 50),
            'is_active' => true,
        ]);

        // Random field values
        $name = p6RandomText(3, 60);
        $slug = p11RandomSlug('p11prod');
        $shortDescription = p6RandomText(10, 150);
        $description = p6RandomText(20, 300);
        $featuredImage = 'images/prod-' . Str::random(6) . '.jpg';
        $videoUrl = random_int(0, 1) ? 'https://www.youtube.com/watch?v=' . Str::random(11) : null;
        $isActive = true; // must be active for the endpoint to find it via detailed scope
        $order = random_int(0, 100);

        $product = Product::create([
            'division_id' => $division->id,
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'content_mode' => 'detailed',
            'name' => $name,
            'slug' => $slug,
            'short_description' => $shortDescription,
            'description' => $description,
            'featured_image' => $featuredImage,
            'video_url' => $videoUrl,
            'is_active' => $isActive,
            'order' => $order,
        ]);

        // Create random specifications
        $numSpecs = random_int(1, 5);
        $specs = [];
        for ($s = 0; $s < $numSpecs; $s++) {
            $spec = ProductSpecification::create([
                'product_id' => $product->id,
                'label' => p6RandomText(3, 30),
                'value' => p6RandomText(3, 50),
                'order' => $s + 1,
            ]);
            $specs[] = $spec;
        }

        // Create random gallery images
        $numImages = random_int(1, 4);
        $images = [];
        for ($g = 0; $g < $numImages; $g++) {
            $img = ProductImage::create([
                'product_id' => $product->id,
                'image_path' => 'images/gallery-' . Str::random(8) . '.jpg',
                'order' => $g + 1,
            ]);
            $images[] = $img;
        }

        // GET the API endpoint
        $response = $this->getJson("/api/product/{$slug}");
        $response->assertStatus(200);

        $data = $response->json();

        // Round-trip: verify core product scalar attributes
        expect($data['id'])->toBe($product->id);
        expect($data['name'])->toBe($name);
        expect($data['slug'])->toBe($slug);
        expect($data['content_mode'])->toBe('detailed');
        expect($data['short_description'])->toBe($shortDescription);
        expect($data['description'])->toBe($description);
        expect($data['featured_image'])->toBe($featuredImage);
        expect($data['video_url'])->toBe($videoUrl);
        expect($data['is_active'])->toBe($isActive);
        expect($data['order'])->toBe($order);

        // Verify foreign keys
        expect($data['division_id'])->toBe($division->id);
        expect($data['category_id'])->toBe($category->id);
        expect($data['brand_id'])->toBe($brand->id);

        // Verify brand relationship round-trip
        expect($data['brand'])->toBeArray();
        expect($data['brand']['id'])->toBe($brand->id);
        expect($data['brand']['name'])->toBe($brand->name);
        expect($data['brand']['slug'])->toBe($brand->slug);

        // Verify specifications round-trip
        expect($data['specifications'])->toBeArray();
        expect(count($data['specifications']))->toBe($numSpecs);
        for ($s = 0; $s < $numSpecs; $s++) {
            expect($data['specifications'][$s]['id'])->toBe($specs[$s]->id);
            expect($data['specifications'][$s]['label'])->toBe($specs[$s]->label);
            expect($data['specifications'][$s]['value'])->toBe($specs[$s]->value);
            expect($data['specifications'][$s]['order'])->toBe($specs[$s]->order);
        }

        // Verify images round-trip
        expect($data['images'])->toBeArray();
        expect(count($data['images']))->toBe($numImages);
        for ($g = 0; $g < $numImages; $g++) {
            expect($data['images'][$g]['id'])->toBe($images[$g]->id);
            expect($data['images'][$g]['image_path'])->toBe($images[$g]->image_path);
            expect($data['images'][$g]['order'])->toBe($images[$g]->order);
        }

        // Clean up for next iteration
        ProductSpecification::where('product_id', $product->id)->delete();
        ProductImage::where('product_id', $product->id)->delete();
        $product->delete();
        $category->delete();
        $brand->delete();
        $division->delete();
    }
})->group('Feature: product-showcase', 'Property 11: Product JSON serialization round-trip');
