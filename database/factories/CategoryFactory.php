<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Division;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        return [
            'division_id' => Division::factory(),
            'name' => fake()->unique()->words(rand(2, 3), true),
            'slug' => fn (array $attributes) => \Illuminate\Support\Str::slug($attributes['name']),
            'image' => 'categories/' . fake()->slug(2) . '.jpg',
            'order' => fake()->numberBetween(0, 100),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
