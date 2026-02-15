<?php

namespace Database\Factories;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brand>
 */
class BrandFactory extends Factory
{
    protected $model = Brand::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->company(),
            'slug' => fn (array $attributes) => \Illuminate\Support\Str::slug($attributes['name']),
            'logo' => 'brands/' . fake()->slug(2) . '.png',
            'is_partner' => fake()->boolean(40),
            'is_reference' => fake()->boolean(40),
            'order' => fake()->numberBetween(0, 100),
            'is_active' => true,
        ];
    }

    public function partner(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_partner' => true,
        ]);
    }

    public function reference(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_reference' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
