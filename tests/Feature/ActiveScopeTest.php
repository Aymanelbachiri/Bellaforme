<?php

/**
 * Property 2: Active-only filtering with correct ordering
 *
 * For any set of records (divisions, categories, or products) with mixed is_active
 * values and varying order values, querying with the active scope should return only
 * records where is_active is true, and the results should be sorted by the order
 * field in ascending order.
 *
 * Validates: Requirements 1.4, 2.4, 6.5
 *
 * @group Feature: product-showcase
 * @group Property 2: Active-only filtering with correct ordering
 */

use App\Models\Category;
use App\Models\Division;
use App\Models\Product;

const PBT_MIN_ITERATIONS = 100;

/**
 * Generate a random batch of records with mixed is_active and random order values.
 *
 * @return array{active: list<bool>, orders: list<int>}
 */
function generateRandomRecordSet(): array
{
    $count = random_int(1, 20);
    $active = [];
    $orders = [];

    for ($i = 0; $i < $count; $i++) {
        $active[] = (bool) random_int(0, 1);
        $orders[] = random_int(-100, 100);
    }

    return ['active' => $active, 'orders' => $orders];
}


/**
 * Property test: Division::active() returns only active divisions sorted by order ascending.
 *
 * Validates: Requirements 1.4, 2.4, 6.5
 */
it('Property 2: Division active scope returns only active records sorted by order', function () {
    for ($i = 0; $i < PBT_MIN_ITERATIONS; $i++) {
        $set = generateRandomRecordSet();
        $count = count($set['active']);

        // Create divisions with random is_active and order
        $createdIds = [];
        for ($j = 0; $j < $count; $j++) {
            $division = Division::create([
                'name' => "Div {$i}-{$j}",
                'slug' => "div-{$i}-{$j}",
                'hero_image' => 'images/test.jpg',
                'hero_title' => 'Test',
                'hero_subtitle' => 'Test',
                'order' => $set['orders'][$j],
                'is_active' => $set['active'][$j],
            ]);
            $createdIds[] = $division->id;
        }

        // Query with active scope
        $results = Division::query()->whereIn('id', $createdIds)->active()->get();

        // 1. All returned records must have is_active = true
        foreach ($results as $record) {
            expect($record->is_active)->toBeTrue(
                "Division id={$record->id} returned by active() has is_active=false (iteration {$i})"
            );
        }

        // 2. No inactive records should be returned
        $expectedActiveCount = count(array_filter($set['active']));
        expect($results)->toHaveCount(
            $expectedActiveCount,
            "Expected {$expectedActiveCount} active divisions but got {$results->count()} (iteration {$i})"
        );

        // 3. Results must be sorted by order ascending
        $orderValues = $results->pluck('order')->all();
        for ($k = 1; $k < count($orderValues); $k++) {
            expect($orderValues[$k])->toBeGreaterThanOrEqual(
                $orderValues[$k - 1],
                "Division results not sorted by order: {$orderValues[$k-1]} > {$orderValues[$k]} (iteration {$i})"
            );
        }

        // Clean up
        Division::whereIn('id', $createdIds)->delete();
    }
})->group('Feature: product-showcase', 'Property 2: Active-only filtering with correct ordering');


/**
 * Property test: Category::active() returns only active categories sorted by order ascending.
 *
 * Validates: Requirements 1.4, 2.4, 6.5
 */
it('Property 2: Category active scope returns only active records sorted by order', function () {
    // Create a parent division for all categories
    $parentDivision = Division::create([
        'name' => 'Parent Division for Categories',
        'slug' => 'parent-div-cat',
        'hero_image' => 'images/test.jpg',
        'hero_title' => 'Test',
        'hero_subtitle' => 'Test',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < PBT_MIN_ITERATIONS; $i++) {
        $set = generateRandomRecordSet();
        $count = count($set['active']);

        $createdIds = [];
        for ($j = 0; $j < $count; $j++) {
            $category = Category::create([
                'division_id' => $parentDivision->id,
                'name' => "Cat {$i}-{$j}",
                'slug' => "cat-{$i}-{$j}",
                'image' => 'images/cat.jpg',
                'order' => $set['orders'][$j],
                'is_active' => $set['active'][$j],
            ]);
            $createdIds[] = $category->id;
        }

        $results = Category::query()->whereIn('id', $createdIds)->active()->get();

        // 1. All returned records must have is_active = true
        foreach ($results as $record) {
            expect($record->is_active)->toBeTrue(
                "Category id={$record->id} returned by active() has is_active=false (iteration {$i})"
            );
        }

        // 2. Correct count of active records
        $expectedActiveCount = count(array_filter($set['active']));
        expect($results)->toHaveCount(
            $expectedActiveCount,
            "Expected {$expectedActiveCount} active categories but got {$results->count()} (iteration {$i})"
        );

        // 3. Sorted by order ascending
        $orderValues = $results->pluck('order')->all();
        for ($k = 1; $k < count($orderValues); $k++) {
            expect($orderValues[$k])->toBeGreaterThanOrEqual(
                $orderValues[$k - 1],
                "Category results not sorted by order: {$orderValues[$k-1]} > {$orderValues[$k]} (iteration {$i})"
            );
        }

        Category::whereIn('id', $createdIds)->delete();
    }
})->group('Feature: product-showcase', 'Property 2: Active-only filtering with correct ordering');


/**
 * Property test: Product::active() returns only active products sorted by order ascending.
 *
 * Validates: Requirements 1.4, 2.4, 6.5
 */
it('Property 2: Product active scope returns only active records sorted by order', function () {
    // Create parent records for products
    $parentDivision = Division::create([
        'name' => 'Parent Division for Products',
        'slug' => 'parent-div-prod',
        'hero_image' => 'images/test.jpg',
        'hero_title' => 'Test',
        'hero_subtitle' => 'Test',
        'order' => 1,
        'is_active' => true,
    ]);

    $parentCategory = Category::create([
        'division_id' => $parentDivision->id,
        'name' => 'Parent Category for Products',
        'slug' => 'parent-cat-prod',
        'image' => 'images/cat.jpg',
        'order' => 1,
        'is_active' => true,
    ]);

    for ($i = 0; $i < PBT_MIN_ITERATIONS; $i++) {
        $set = generateRandomRecordSet();
        $count = count($set['active']);

        $createdIds = [];
        for ($j = 0; $j < $count; $j++) {
            $product = Product::create([
                'division_id' => $parentDivision->id,
                'category_id' => $parentCategory->id,
                'content_mode' => 'detailed',
                'name' => "Prod {$i}-{$j}",
                'slug' => "prod-{$i}-{$j}",
                'short_description' => 'Test product',
                'featured_image' => 'images/test.jpg',
                'order' => $set['orders'][$j],
                'is_active' => $set['active'][$j],
            ]);
            $createdIds[] = $product->id;
        }

        $results = Product::query()->whereIn('id', $createdIds)->active()->get();

        // 1. All returned records must have is_active = true
        foreach ($results as $record) {
            expect($record->is_active)->toBeTrue(
                "Product id={$record->id} returned by active() has is_active=false (iteration {$i})"
            );
        }

        // 2. Correct count of active records
        $expectedActiveCount = count(array_filter($set['active']));
        expect($results)->toHaveCount(
            $expectedActiveCount,
            "Expected {$expectedActiveCount} active products but got {$results->count()} (iteration {$i})"
        );

        // 3. Sorted by order ascending
        $orderValues = $results->pluck('order')->all();
        for ($k = 1; $k < count($orderValues); $k++) {
            expect($orderValues[$k])->toBeGreaterThanOrEqual(
                $orderValues[$k - 1],
                "Product results not sorted by order: {$orderValues[$k-1]} > {$orderValues[$k]} (iteration {$i})"
            );
        }

        Product::whereIn('id', $createdIds)->delete();
    }
})->group('Feature: product-showcase', 'Property 2: Active-only filtering with correct ordering');
