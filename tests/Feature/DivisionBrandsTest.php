<?php

/**
 * Property 9: Division page brand carousels filter correctly
 *
 * For any division, the reference brands shown should all have is_reference=true
 * and have at least one product in that division. Similarly, the partner brands
 * shown should all have is_partner=true and have at least one product in that
 * division. No brand that lacks products in the division should appear in either carousel.
 *
 * Validates: Requirements 3.4, 3.5
 *
 * @group Feature: product-showcase
 * @group Property 9: Division page brand carousels filter correctly
 */

use App\Models\Brand;
use App\Models\Category;
use App\Models\Division;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

const DIVISION_BRANDS_ITERATIONS = 100;

/**
 * Generate a random set of brands with mixed is_reference, is_partner, and is_active flags.
 *
 * @return list<array{is_reference: bool, is_partner: bool, is_active: bool}>
 */
function generateRandomBrandConfigs(): array
{
    $count = random_int(2, 8);
    $configs = [];

    for ($i = 0; $i < $count; $i++) {
        $configs[] = [
            'is_reference' => (bool) random_int(0, 1),
            'is_partner' => (bool) random_int(0, 1),
            'is_active' => (bool) random_int(0, 1),
        ];
    }

    return $configs;
}

/**
 * For each brand, randomly decide whether it has products in the division.
 *
 * @param int $brandCount
 * @return list<bool>
 */
function generateProductAssignments(int $brandCount): array
{
    $assignments = [];
    for ($i = 0; $i < $brandCount; $i++) {
        $assignments[] = (bool) random_int(0, 1);
    }
    return $assignments;
}


/**
 * Property test: Division page brand carousels filter correctly.
 *
 * For each iteration:
 * 1. Create a division with a category
 * 2. Create random brands with mixed is_reference/is_partner/is_active flags
 * 3. Randomly assign some brands to have products in the division
 * 4. Request GET /division/{slug}
 * 5. Verify referenceBrands contains only brands with is_reference=true, is_active=true, and products in division
 * 6. Verify partnerBrands contains only brands with is_partner=true, is_active=true, and products in division
 * 7. Verify no brand without products in the division appears in either carousel
 *
 * Validates: Requirements 3.4, 3.5
 */
it('Property 9: Division page brand carousels filter correctly', function () {
    $this->withoutVite();

    for ($i = 0; $i < DIVISION_BRANDS_ITERATIONS; $i++) {
        // Create a division
        $division = Division::create([
            'name' => "Division {$i}",
            'slug' => "division-{$i}",
            'hero_image' => 'images/hero.jpg',
            'hero_title' => "Division {$i} Title",
            'hero_subtitle' => "Division {$i} Subtitle",
            'order' => $i,
            'is_active' => true,
        ]);

        // Create a category in this division (products need a category)
        $category = Category::create([
            'division_id' => $division->id,
            'name' => "Category {$i}",
            'slug' => "category-{$i}",
            'image' => 'images/cat.jpg',
            'order' => 1,
            'is_active' => true,
        ]);

        // Generate random brand configurations
        $brandConfigs = generateRandomBrandConfigs();
        $productAssignments = generateProductAssignments(count($brandConfigs));

        $brands = [];
        $productIds = [];

        // Create brands
        foreach ($brandConfigs as $j => $config) {
            $brand = Brand::create([
                'name' => "Brand {$i}-{$j}",
                'slug' => "brand-{$i}-{$j}",
                'logo' => 'images/logo.png',
                'is_reference' => $config['is_reference'],
                'is_partner' => $config['is_partner'],
                'is_active' => $config['is_active'],
                'order' => $j,
            ]);
            $brands[] = $brand;

            // If this brand should have a product in the division, create one
            if ($productAssignments[$j]) {
                $product = Product::create([
                    'division_id' => $division->id,
                    'category_id' => $category->id,
                    'brand_id' => $brand->id,
                    'content_mode' => 'detailed',
                    'name' => "Product {$i}-{$j}",
                    'slug' => "product-{$i}-{$j}",
                    'short_description' => 'Test product',
                    'featured_image' => 'images/product.jpg',
                    'is_active' => true,
                    'order' => $j,
                ]);
                $productIds[] = $product->id;
            }
        }

        // Make the request to the division page
        $response = $this->get("/division/{$division->slug}");
        $response->assertOk();

        // Extract Inertia props
        $response->assertInertia(function (Assert $page) use ($i, $brands, $brandConfigs, $productAssignments) {
            $page->component('division/show');

            $referenceBrands = $page->toArray()['props']['referenceBrands'];
            $partnerBrands = $page->toArray()['props']['partnerBrands'];

            $referenceBrandIds = collect($referenceBrands)->pluck('id')->all();
            $partnerBrandIds = collect($partnerBrands)->pluck('id')->all();

            foreach ($brands as $j => $brand) {
                $hasProducts = $productAssignments[$j];
                $config = $brandConfigs[$j];

                // A brand should appear in referenceBrands only if:
                // is_reference=true AND is_active=true AND has products in division
                $shouldBeReference = $config['is_reference'] && $config['is_active'] && $hasProducts;
                // A brand should appear in partnerBrands only if:
                // is_partner=true AND is_active=true AND has products in division
                $shouldBePartner = $config['is_partner'] && $config['is_active'] && $hasProducts;

                if ($shouldBeReference) {
                    expect(in_array($brand->id, $referenceBrandIds))->toBeTrue(
                        "Brand '{$brand->name}' (is_reference=true, is_active=true, has products) should be in referenceBrands (iteration {$i})"
                    );
                } else {
                    expect(in_array($brand->id, $referenceBrandIds))->toBeFalse(
                        "Brand '{$brand->name}' (is_reference={$config['is_reference']}, is_active={$config['is_active']}, has_products={$hasProducts}) should NOT be in referenceBrands (iteration {$i})"
                    );
                }

                if ($shouldBePartner) {
                    expect(in_array($brand->id, $partnerBrandIds))->toBeTrue(
                        "Brand '{$brand->name}' (is_partner=true, is_active=true, has products) should be in partnerBrands (iteration {$i})"
                    );
                } else {
                    expect(in_array($brand->id, $partnerBrandIds))->toBeFalse(
                        "Brand '{$brand->name}' (is_partner={$config['is_partner']}, is_active={$config['is_active']}, has_products={$hasProducts}) should NOT be in partnerBrands (iteration {$i})"
                    );
                }
            }
        });

        // Clean up to avoid slug collisions
        Product::whereIn('id', $productIds)->delete();
        foreach ($brands as $brand) {
            $brand->delete();
        }
        $category->delete();
        $division->delete();
    }
})->group('Feature: product-showcase', 'Property 9: Division page brand carousels filter correctly');
