<?php

namespace Database\Factories;

use App\Models\Division;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $contentMode = fake()->randomElement(['detailed', 'brochure_only']);

        return [
            'division_id' => Division::factory(),
            'category_id' => Category::factory(),
            'brand_id' => null,
            'content_mode' => $contentMode,
            'name' => fake()->unique()->words(rand(2, 5), true),
            'slug' => fn (array $attributes) => \Illuminate\Support\Str::slug($attributes['name']),
            'short_description' => fake()->sentence(10),
            'description' => $contentMode === 'detailed' ? fake()->paragraphs(2, true) : null,
            'featured_image' => 'products/' . fake()->slug(2) . '.jpg',
            'brochure_file' => $contentMode === 'brochure_only' ? 'brochures/' . fake()->slug(2) . '.pdf' : null,
            'video_url' => $contentMode === 'detailed' ? fake()->optional(0.3)->url() : null,
            'is_active' => true,
            'order' => fake()->numberBetween(0, 100),
        ];
    }

    public function detailed(): static
    {
        return $this->state(fn (array $attributes) => [
            'content_mode' => 'detailed',
            'description' => fake()->paragraphs(2, true),
            'brochure_file' => null,
        ]);
    }

    public function brochureOnly(): static
    {
        return $this->state(fn (array $attributes) => [
            'content_mode' => 'brochure_only',
            'description' => null,
            'brochure_file' => 'brochures/' . fake()->slug(2) . '.pdf',
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
