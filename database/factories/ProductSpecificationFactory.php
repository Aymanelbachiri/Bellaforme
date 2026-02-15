<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductSpecification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductSpecification>
 */
class ProductSpecificationFactory extends Factory
{
    protected $model = ProductSpecification::class;

    private static array $specLabels = [
        'Poids', 'Dimensions', 'Puissance', 'Tension', 'Fréquence',
        'Capacité', 'Matériau', 'Couleur', 'Garantie', 'Certification',
    ];

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'label' => fake()->randomElement(self::$specLabels),
            'value' => fake()->words(rand(1, 3), true),
            'order' => fake()->numberBetween(0, 20),
        ];
    }
}
