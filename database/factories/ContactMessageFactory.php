<?php

namespace Database\Factories;

use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContactMessage>
 */
class ContactMessageFactory extends Factory
{
    protected $model = ContactMessage::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->optional(0.7)->phoneNumber(),
            'city' => fake()->optional(0.6)->city(),
            'activity_type' => fake()->optional(0.5)->randomElement(['Clinique', 'Salon', 'Salle de sport', 'Spa', 'Hôpital']),
            'project_nature' => fake()->optional(0.5)->randomElement(['Création', 'Rénovation', 'Extension', 'Remplacement']),
            'equipment_timeline' => fake()->optional(0.5)->randomElement(['Immédiat', '1-3 mois', '3-6 mois', '6-12 mois']),
            'request_reason' => fake()->optional(0.5)->randomElement(['Devis', 'Information', 'Démonstration', 'SAV']),
            'message' => fake()->paragraphs(rand(1, 3), true),
            'product_id' => null,
        ];
    }

    public function forProduct(\App\Models\Product $product): static
    {
        return $this->state(fn (array $attributes) => [
            'product_id' => $product->id,
        ]);
    }
}
