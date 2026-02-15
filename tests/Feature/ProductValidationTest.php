<?php

/**
 * Property 3: Content-mode conditional validation
 *
 * For any product submission, if content_mode is "detailed" then description must be
 * present for validation to pass, and if content_mode is "brochure_only" then brochure_file
 * must be present for validation to pass. Conversely, omitting description for a detailed
 * product or omitting brochure_file for a brochure_only product should result in a
 * validation error.
 *
 * Validates: Requirements 4.2, 4.3, 5.1, 5.2
 *
 * @group Feature: product-showcase
 * @group Property 3: Content-mode conditional validation
 */

use App\Models\Brand;
use App\Models\Category;
use App\Models\Division;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

const PROPERTY3_ITERATIONS = 100;

/**
 * Generate a random non-empty string for text fields.
 */
function randomText(int $minLen = 3, int $maxLen = 100): string
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 éèêàâç';
    $charArray = mb_str_split($chars);
    $length = random_int($minLen, $maxLen);
    $result = '';
    for ($i = 0; $i < $length; $i++) {
        $result .= $charArray[random_int(0, count($charArray) - 1)];
    }
    return $result;
}

/**
 * Generate a random unique slug.
 */
function randomSlug(): string
{
    return Str::slug(randomText(5, 30)) . '-' . Str::random(8);
}

/**
 * Build base product data shared by both content modes.
 */
function baseProductData(int $divisionId, int $categoryId): array
{
    return [
        'division_id' => $divisionId,
        'category_id' => $categoryId,
        'name' => randomText(3, 60),
        'slug' => randomSlug(),
        'short_description' => randomText(10, 200),
        'featured_image' => UploadedFile::fake()->image('product-' . Str::random(6) . '.jpg', 640, 480),
        'is_active' => (bool) random_int(0, 1),
        'order' => random_int(0, 100),
    ];
}


/**
 * Property 3a: Detailed product WITH description should pass validation.
 *
 * For any random product data where content_mode is "detailed" and description is present,
 * the store request should not return a validation error for the description field.
 *
 * Validates: Requirements 4.2, 5.2
 */
it('Property 3: detailed product with description passes validation', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $division = Division::create([
        'name' => 'Test Division',
        'slug' => 'test-division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'Test Category',
        'slug' => 'test-category',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < PROPERTY3_ITERATIONS; $i++) {
        $data = baseProductData($division->id, $category->id);
        $data['content_mode'] = 'detailed';
        $data['description'] = randomText(10, 500);

        $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

        // Should not have validation errors for description
        $response->assertSessionDoesntHaveErrors('description');
    }
})->group('Feature: product-showcase', 'Property 3: Content-mode conditional validation');

/**
 * Property 3b: Detailed product WITHOUT description should fail validation.
 *
 * For any random product data where content_mode is "detailed" and description is omitted,
 * the store request should return a validation error for the description field.
 *
 * Validates: Requirements 4.2, 5.2
 */
it('Property 3: detailed product without description fails validation', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $division = Division::create([
        'name' => 'Test Division',
        'slug' => 'test-division-b',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'Test Category',
        'slug' => 'test-category-b',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < PROPERTY3_ITERATIONS; $i++) {
        $data = baseProductData($division->id, $category->id);
        $data['content_mode'] = 'detailed';
        // Explicitly omit description

        $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

        $response->assertSessionHasErrors('description');
    }
})->group('Feature: product-showcase', 'Property 3: Content-mode conditional validation');

/**
 * Property 3c: Brochure-only product WITH brochure_file should pass validation.
 *
 * For any random product data where content_mode is "brochure_only" and brochure_file is present,
 * the store request should not return a validation error for the brochure_file field.
 *
 * Validates: Requirements 4.3, 5.1
 */
it('Property 3: brochure_only product with brochure_file passes validation', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $division = Division::create([
        'name' => 'Test Division',
        'slug' => 'test-division-c',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'Test Category',
        'slug' => 'test-category-c',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < PROPERTY3_ITERATIONS; $i++) {
        $data = baseProductData($division->id, $category->id);
        $data['content_mode'] = 'brochure_only';
        $data['brochure_file'] = UploadedFile::fake()->create('brochure-' . Str::random(6) . '.pdf', 1024, 'application/pdf');

        $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

        $response->assertSessionDoesntHaveErrors('brochure_file');
    }
})->group('Feature: product-showcase', 'Property 3: Content-mode conditional validation');

/**
 * Property 3d: Brochure-only product WITHOUT brochure_file should fail validation.
 *
 * For any random product data where content_mode is "brochure_only" and brochure_file is omitted,
 * the store request should return a validation error for the brochure_file field.
 *
 * Validates: Requirements 4.3, 5.1
 */
it('Property 3: brochure_only product without brochure_file fails validation', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $division = Division::create([
        'name' => 'Test Division',
        'slug' => 'test-division-d',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'Test Category',
        'slug' => 'test-category-d',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < PROPERTY3_ITERATIONS; $i++) {
        $data = baseProductData($division->id, $category->id);
        $data['content_mode'] = 'brochure_only';
        // Explicitly omit brochure_file

        $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

        $response->assertSessionHasErrors('brochure_file');
    }
})->group('Feature: product-showcase', 'Property 3: Content-mode conditional validation');


// ============================================================================
// Property 4: Content_mode enum validation
//
// For any string value submitted as content_mode that is not "detailed" or
// "brochure_only", the Product API should reject the request with a validation error.
//
// Validates: Requirements 5.4
//
// @group Feature: product-showcase
// @group Property 4: Content_mode enum validation
// ============================================================================

const PROPERTY4_ITERATIONS = 100;

/**
 * Generate a random string that is NOT "detailed" or "brochure_only".
 *
 * Note: Laravel's TrimStrings middleware trims whitespace, so we avoid
 * whitespace-padded valid values that would be trimmed to valid ones.
 */
function randomInvalidContentMode(): string
{
    $validModes = ['detailed', 'brochure_only'];

    // Mix of strategies to generate diverse invalid values
    $strategies = [
        // Random alphanumeric strings
        fn () => Str::random(random_int(1, 30)),
        // Common typos / near-misses
        fn () => collect(['detail', 'details', 'Detailed', 'DETAILED', 'brochure', 'brochure_Only', 'BROCHURE_ONLY', 'catalog', 'full', 'simple'])
            ->random(),
        // Strings with special characters
        fn () => Str::random(random_int(1, 5)) . collect(['!', '@', '#', '$', '%', '^', '&', '*', '<', '>', '/', '\\'])->random() . Str::random(random_int(1, 5)),
        // Numeric strings
        fn () => (string) random_int(0, 9999),
        // Unicode / accented characters
        fn () => collect(['détaillé', 'brochüre', 'catàlogo', 'ñoño'])->random(),
        // Prefixed/suffixed valid values (structurally different)
        fn () => collect($validModes)->random() . '_' . Str::random(3),
    ];

    // Keep generating until we get something that's not a valid mode
    // Also check trimmed version since Laravel trims input
    do {
        $strategy = $strategies[random_int(0, count($strategies) - 1)];
        $value = $strategy();
    } while (in_array($value, $validModes, true) || in_array(trim($value), $validModes, true));

    return $value;
}

/**
 * Property 4a: Any invalid content_mode string should fail validation.
 *
 * For any randomly generated string that is not "detailed" or "brochure_only",
 * submitting it as content_mode should result in a validation error.
 *
 * Validates: Requirements 5.4
 */
it('Property 4: invalid content_mode strings are rejected with validation error', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $division = Division::create([
        'name' => 'P4 Division',
        'slug' => 'p4-division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'P4 Category',
        'slug' => 'p4-category',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < PROPERTY4_ITERATIONS; $i++) {
        $data = baseProductData($division->id, $category->id);
        $data['content_mode'] = randomInvalidContentMode();
        $data['description'] = randomText(10, 200);
        $data['brochure_file'] = UploadedFile::fake()->create('brochure.pdf', 1024, 'application/pdf');

        $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

        $response->assertSessionHasErrors('content_mode');
    }
})->group('Feature: product-showcase', 'Property 4: Content_mode enum validation');

/**
 * Property 4b: Empty string as content_mode should fail validation.
 *
 * Validates: Requirements 5.4
 */
it('Property 4: empty string content_mode is rejected', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $division = Division::create([
        'name' => 'P4b Division',
        'slug' => 'p4b-division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'P4b Category',
        'slug' => 'p4b-category',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    $data = baseProductData($division->id, $category->id);
    $data['content_mode'] = '';

    $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

    $response->assertSessionHasErrors('content_mode');
})->group('Feature: product-showcase', 'Property 4: Content_mode enum validation');

/**
 * Property 4c: Null content_mode should fail validation.
 *
 * Validates: Requirements 5.4
 */
it('Property 4: null content_mode is rejected', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $division = Division::create([
        'name' => 'P4c Division',
        'slug' => 'p4c-division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'P4c Category',
        'slug' => 'p4c-category',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    $data = baseProductData($division->id, $category->id);
    $data['content_mode'] = null;

    $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

    $response->assertSessionHasErrors('content_mode');
})->group('Feature: product-showcase', 'Property 4: Content_mode enum validation');

/**
 * Property 4d: Missing content_mode field should fail validation.
 *
 * Validates: Requirements 5.4
 */
it('Property 4: missing content_mode is rejected', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $division = Division::create([
        'name' => 'P4d Division',
        'slug' => 'p4d-division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'P4d Category',
        'slug' => 'p4d-category',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    $data = baseProductData($division->id, $category->id);
    // Don't include content_mode at all

    $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

    $response->assertSessionHasErrors('content_mode');
})->group('Feature: product-showcase', 'Property 4: Content_mode enum validation');

/**
 * Property 4e: Numeric values as content_mode should fail validation.
 *
 * Validates: Requirements 5.4
 */
it('Property 4: numeric content_mode values are rejected', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $division = Division::create([
        'name' => 'P4e Division',
        'slug' => 'p4e-division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'P4e Category',
        'slug' => 'p4e-category',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    $numericValues = [0, 1, 2, -1, 42, 3.14, PHP_INT_MAX];

    foreach ($numericValues as $value) {
        $data = baseProductData($division->id, $category->id);
        $data['content_mode'] = $value;

        $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

        $response->assertSessionHasErrors('content_mode');
    }
})->group('Feature: product-showcase', 'Property 4: Content_mode enum validation');


// ============================================================================
// Property 5: Brochure_only strips specifications and gallery
//
// For any product submission with content_mode "brochure_only" that includes
// specifications or gallery image data, the saved product should have zero
// specifications and zero gallery images in the database.
//
// Validates: Requirements 5.3
//
// @group Feature: product-showcase
// @group Property 5: Brochure_only strips specifications and gallery
// ============================================================================

const PROPERTY5_ITERATIONS = 100;

/**
 * Generate a random array of specification label/value pairs.
 */
function randomSpecifications(): array
{
    $count = random_int(1, 5);
    $specs = [];
    for ($i = 0; $i < $count; $i++) {
        $specs[] = [
            'label' => randomText(3, 30),
            'value' => randomText(3, 50),
        ];
    }
    return $specs;
}

/**
 * Generate a random array of fake gallery image uploads.
 */
function randomGalleryImages(): array
{
    $count = random_int(1, 3);
    $images = [];
    for ($i = 0; $i < $count; $i++) {
        $images[] = UploadedFile::fake()->image('gallery-' . Str::random(6) . '.jpg', 320, 240);
    }
    return $images;
}

/**
 * Property 5: Brochure_only product with specifications and gallery should have
 * zero specifications and zero gallery images after saving.
 *
 * For each iteration, submit a brochure_only product with random specifications
 * and gallery data, then verify the database has 0 specs and 0 gallery images.
 *
 * Validates: Requirements 5.3
 */
it('Property 5: brochure_only strips specifications and gallery data', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $division = Division::create([
        'name' => 'P5 Division',
        'slug' => 'p5-division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Hero',
        'hero_subtitle' => 'Sub',
        'order' => 1,
        'is_active' => true,
    ]);
    $category = Category::create([
        'division_id' => $division->id,
        'name' => 'P5 Category',
        'slug' => 'p5-category',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < PROPERTY5_ITERATIONS; $i++) {
        $data = baseProductData($division->id, $category->id);
        $data['content_mode'] = 'brochure_only';
        $data['brochure_file'] = UploadedFile::fake()->create('brochure-' . Str::random(6) . '.pdf', 1024, 'application/pdf');

        // Randomly include specifications, gallery, or both
        $includeSpecs = (bool) random_int(0, 1);
        $includeGallery = (bool) random_int(0, 1);

        // Ensure at least one is included
        if (!$includeSpecs && !$includeGallery) {
            $includeSpecs = true;
        }

        if ($includeSpecs) {
            $data['specifications'] = randomSpecifications();
        }
        if ($includeGallery) {
            $data['gallery'] = randomGalleryImages();
        }

        $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

        // The request should succeed (redirect, not validation error)
        $response->assertSessionDoesntHaveErrors();

        // Find the most recently created product
        $product = Product::latest('id')->first();

        expect($product)->not->toBeNull();
        expect($product->content_mode)->toBe('brochure_only');
        expect($product->specifications()->count())->toBe(0, "Iteration {$i}: brochure_only product should have 0 specifications");
        expect($product->images()->count())->toBe(0, "Iteration {$i}: brochure_only product should have 0 gallery images");
    }
})->group('Feature: product-showcase', 'Property 5: Brochure_only strips specifications and gallery');
