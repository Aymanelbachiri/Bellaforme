<?php

/**
 * Property 1: Slug auto-generation from name
 *
 * For any model that uses the HasSlug trait (Division, Category, Brand, Product),
 * if the slug field is empty when saving, the resulting slug should be a URL-safe,
 * lowercased, hyphenated version of the name field, and it should be non-empty.
 *
 * Validates: Requirements 1.3, 2.3, 3.3, 4.6
 *
 * @group Feature: product-showcase
 * @group Property 1: Slug auto-generation from name
 */

use App\Models\Brand;
use App\Models\Category;
use App\Models\Division;
use App\Models\Product;
use Illuminate\Support\Str;

const MIN_ITERATIONS = 100;

/**
 * Generate a random string that includes letters, numbers, spaces,
 * special characters, unicode, and accented characters.
 */
function generateRandomName(): string
{
    $charSets = [
        'abcdefghijklmnopqrstuvwxyz',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '0123456789',
        ' ',
        'éèêëàâçùûüôîïÉÈÊËÀÂÇÙÛÜÔÎÏ',
        'äöüßñõ',
        '!@#$%^&*()-_=+[]{}|;:,.<>?/',
    ];

    $length = random_int(1, 80);
    $name = '';

    for ($i = 0; $i < $length; $i++) {
        $setIndex = random_int(0, count($charSets) - 1);
        $set = mb_str_split($charSets[$setIndex]);
        $name .= $set[random_int(0, count($set) - 1)];
    }

    return $name;
}

/**
 * Helper to create a Division with a given name and empty slug.
 */
function createDivisionWithName(string $name): Division
{
    return Division::create([
        'name' => $name,
        'slug' => '',
        'hero_image' => 'images/test.jpg',
        'hero_title' => 'Test',
        'hero_subtitle' => 'Test',
        'order' => 1,
        'is_active' => true,
    ]);
}


/**
 * Property test: For any random name, when a Division is created with an empty slug,
 * the auto-generated slug must be:
 *   1. Non-empty (as long as the name produces a non-empty slug via Str::slug)
 *   2. URL-safe: only lowercase letters, numbers, and hyphens
 *   3. Equal to Str::slug(name)
 *
 * Validates: Requirements 1.3, 2.3, 3.3, 4.6
 */
it('Property 1: slug is auto-generated as a URL-safe, lowercased, hyphenated version of name across random inputs', function () {
    $urlSafePattern = '/^[a-z0-9]+(-[a-z0-9]+)*$/';
    $testedCount = 0;
    $skippedCount = 0;

    for ($i = 0; $i < MIN_ITERATIONS + 50; $i++) {
        $name = generateRandomName();
        $expectedSlug = Str::slug($name);

        // Skip names that produce empty slugs (e.g., all special characters)
        if ($expectedSlug === '') {
            $skippedCount++;
            continue;
        }

        $division = createDivisionWithName($name);

        // 1. Slug must be non-empty
        expect($division->slug)->not->toBeEmpty(
            "Slug should be non-empty for name: '{$name}'"
        );

        // 2. Slug must be URL-safe (lowercase letters, numbers, hyphens only)
        expect($division->slug)->toMatch(
            $urlSafePattern,
            "Slug '{$division->slug}' is not URL-safe for name: '{$name}'"
        );

        // 3. Slug must equal Str::slug(name)
        expect($division->slug)->toBe(
            $expectedSlug,
            "Slug '{$division->slug}' does not match expected '{$expectedSlug}' for name: '{$name}'"
        );

        $testedCount++;

        // Clean up to avoid unique constraint issues on slug
        $division->delete();

        if ($testedCount >= MIN_ITERATIONS) {
            break;
        }
    }

    // Ensure we actually tested at least MIN_ITERATIONS names
    expect($testedCount)->toBeGreaterThanOrEqual(
        MIN_ITERATIONS,
        "Only tested {$testedCount} names (skipped {$skippedCount}). Need at least " . MIN_ITERATIONS
    );
})->group('Feature: product-showcase', 'Property 1: Slug auto-generation from name');

/**
 * Property test: Verify the property holds across all four model types.
 * Uses a smaller iteration count per model since the core logic is shared via the trait.
 *
 * Validates: Requirements 1.3, 2.3, 3.3, 4.6
 */
it('Property 1: slug auto-generation works consistently across Division, Category, Brand, and Product models', function () {
    $urlSafePattern = '/^[a-z0-9]+(-[a-z0-9]+)*$/';

    // Create shared parent records for Category and Product
    $parentDivision = Division::create([
        'name' => 'Parent Division',
        'hero_image' => 'images/hero.jpg',
        'hero_title' => 'Title',
        'hero_subtitle' => 'Subtitle',
        'order' => 1,
        'is_active' => true,
    ]);

    $parentCategory = Category::create([
        'division_id' => $parentDivision->id,
        'name' => 'Parent Category',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    $modelsToTest = ['Division', 'Category', 'Brand', 'Product'];

    foreach ($modelsToTest as $modelName) {
        $testedCount = 0;

        for ($i = 0; $i < 40; $i++) {
            $name = generateRandomName();
            $expectedSlug = Str::slug($name);

            if ($expectedSlug === '') {
                continue;
            }

            $model = match ($modelName) {
                'Division' => Division::create([
                    'name' => $name,
                    'slug' => '',
                    'hero_image' => 'images/test.jpg',
                    'hero_title' => 'Test',
                    'hero_subtitle' => 'Test',
                    'order' => 1,
                    'is_active' => true,
                ]),
                'Category' => Category::create([
                    'division_id' => $parentDivision->id,
                    'name' => $name,
                    'slug' => '',
                    'image' => 'images/cat.jpg',
                    'order' => 1,
                    'is_active' => true,
                ]),
                'Brand' => Brand::create([
                    'name' => $name,
                    'slug' => '',
                    'logo' => 'images/logo.png',
                    'order' => 1,
                    'is_active' => true,
                ]),
                'Product' => Product::create([
                    'division_id' => $parentDivision->id,
                    'category_id' => $parentCategory->id,
                    'content_mode' => 'detailed',
                    'name' => $name,
                    'slug' => '',
                    'short_description' => 'Test product',
                    'featured_image' => 'images/test.jpg',
                    'is_active' => true,
                    'order' => 1,
                ]),
            };

            expect($model->slug)->not->toBeEmpty();
            expect($model->slug)->toMatch($urlSafePattern);
            expect($model->slug)->toBe($expectedSlug);

            $model->delete();
            $testedCount++;

            if ($testedCount >= 25) {
                break;
            }
        }

        expect($testedCount)->toBeGreaterThanOrEqual(
            25,
            "Only tested {$testedCount} names for {$modelName}. Need at least 25."
        );
    }
})->group('Feature: product-showcase', 'Property 1: Slug auto-generation from name');
