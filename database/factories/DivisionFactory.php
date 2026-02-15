<?php

namespace Database\Factories;

use App\Models\Division;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Division>
 */
class DivisionFactory extends Factory
{
    protected $model = Division::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(rand(2, 4), true),
            'slug' => fn (array $attributes) => \Illuminate\Support\Str::slug($attributes['name']),
            'hero_image' => 'divisions/' . fake()->slug(2) . '.jpg',
            'hero_title' => fake()->sentence(4),
            'hero_subtitle' => fake()->sentence(8),
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
